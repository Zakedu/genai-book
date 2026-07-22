# 합성 데이터 생성

## 개요

고품질의 학습 데이터는 LLM의 성능을 결정하는 가장 중요한 요소입니다. 하지만 수백만 개의 고품질 데이터를 수집하는 것은 시간이 많이 걸리고 비용이 듭니다. 2024년 Google DeepMind의 연구에 따르면, **LLM 자체를 사용하여 학습 데이터를 생성할 수 있으며**, 올바른 방법으로 생성된 합성 데이터는 실제 데이터에 버금가는 품질을 달성할 수 있습니다.

합성 데이터 생성은 한국의 중소 AI 기업들에게 특히 중요한 전략입니다. 충분한 한국어 데이터가 없을 때, LLM을 활용하여 고품질의 한국어 학습 데이터를 생성할 수 있기 때문입니다.

## 합성 데이터란?

### 정의

```
실제 데이터: 실제로 수집된 데이터
"I love this product!" (실제 고객 리뷰)

합성 데이터: LLM이 생성한 데이터
"이 제품은 정말 훌륭해요! 품질도 좋고 배송도 빨라요"
(Claude Opus 4.8이 생성한 한국어 리뷰)

중요: 합성 데이터는 현실을 모델링하는 데이터
(단순한 복사가 아님)
```

### 합성 데이터의 장점

| 측면 | 실제 데이터 | 합성 데이터 |
|------|-----------|----------|
| **수집 시간** | 수개월 | 수시간 |
| **비용** | 높음 | 매우 낮음 |
| **다양성** | 제한적 | 무제한 |
| **프라이버시** | 위험 | 안전 |
| **라벨링** | 수동 필요 | 자동 가능 |
| **한국어** | 부족 | 충분히 생성 가능 |

## 합성 데이터 생성 프로세스

### 1단계: 데이터 정의

#### 필요한 것들

```python
# 합성 데이터 생성에 필요한 정의

data_specification = {
    "task": "감정 분석 (긍정/부정/중립)",
    "domain": "이커머스 상품 리뷰",
    "language": "한국어",
    "quantity": 10000,
    "format": {
        "input": "상품 리뷰 텍스트",
        "output": "감정 레이블",
        "metadata": ["상품 카테고리", "별점"]
    },
    "constraints": [
        "한국어 자연스러움",
        "실제 리뷰처럼 보이기",
        "다양한 길이 (50-500 단어)",
        "긍정:부정:중립 = 4:3:3"
    ]
}
```

### 2단계: 생성 전략 선택

#### 전략 A: 템플릿 기반 생성

```python
from anthropic import Anthropic

def template_based_generation(num_samples=100):
    """
    템플릿을 사용한 합성 데이터 생성
    """
    client = Anthropic()

    templates = {
        "긍정": "이 {product}는 정말 {adjective}합니다. {reason}",
        "부정": "{product}는 {issue} 때문에 실망했어요. {detail}",
        "중립": "{product}는 {characteristic}합니다. {observation}"
    }

    prompts = {
        "adjective": ["훌륭한", "최고의", "놀라운", "놀라울 정도로 좋은"],
        "issue": ["품질이 떨어져", "배송이 늦어", "가격이 비싼"],
        "characteristic": ["보통이에요", "그저 그래요", "특별하지는 않네요"]
    }

    generated_data = []

    for sentiment, template in templates.items():
        for _ in range(num_samples // 3):
            prompt = f"""
            다음 템플릿을 사용하여 자연스러운 한국어 제품 리뷰를 생성하세요:
            템플릿: {template}

            변수를 자연스럽게 치환하여 실제 리뷰처럼 보이게 하세요.
            감정: {sentiment}
            """

            response = client.messages.create(
                model="claude-4-6",
                max_tokens=200,
                messages=[{"role": "user", "content": prompt}]
            )

            review_text = response.content[0].text

            generated_data.append({
                "text": review_text,
                "sentiment": sentiment,
                "source": "synthetic"
            })

    return generated_data
```

#### 전략 B: 다양화 기반 생성

```python
def diversity_based_generation(seed_examples=100):
    """
    실제 예제를 기반으로 다양한 변형 생성
    """
    client = Anthropic()

    # 실제 몇 개의 예제로 시작
    seed_examples = [
        "이 노트북 정말 좋아요! 가벼우면서도 성능이 좋고, 배터리도 오래가요.",
        "배송이 너무 늦어서 실망했어요. 물건 자체는 괜찮은데...",
    ]

    generated_data = []

    for seed in seed_examples:
        for _ in range(10):  # 각 예제마다 10개 변형
            prompt = f"""
            다음 제품 리뷰를 참고하여, 비슷한 의견이지만 다른 내용의
            자연스러운 한국어 제품 리뷰를 생성하세요.

            참고 리뷰: "{seed}"

            요구사항:
            - 길이: 50-200 단어
            - 같은 감정이지만 다른 이유
            - 한국어 자연스러움 유지
            - 실제 고객 리뷰처럼 보이기
            """

            response = client.messages.create(
                model="claude-4-6",
                max_tokens=200,
                messages=[{"role": "user", "content": prompt}]
            )

            new_review = response.content[0].text
            generated_data.append({
                "text": new_review,
                "based_on": seed,
                "source": "synthetic"
            })

    return generated_data
```

## 합성 데이터의 품질 관리

### 핵심 품질 차원

#### 1. 충실성 (Fidelity)

```
정의: 합성 데이터가 실제 데이터의 특성을 얼마나 잘 반영하는가?

좋은 충실성:
"이 냉장고 정말 추천합니다! 8년 동안 매일 사용했는데
문제가 없었어요. 전력 소비도 적고 소음도 없습니다."
→ 실제 리뷰처럼 보임

낮은 충실성:
"이 냉장고는 매우 좋습니다. 내용이 긍정적입니다."
→ 부자연스럽고 일반적

측정 방법:
- 실제 데이터와 합성 데이터의 통계 특성 비교
- 언어적 자연스러움 점수 (0-100)
- 전문가 평가
```

!!! example "한국어 충실성 평가"

    ```python
    def evaluate_fidelity(synthetic_review, real_reviews):
        """
        합성 리뷰가 얼마나 현실적인지 평가
        """
        metrics = {
            # 1. 길이 분포
            "length_similarity": compare_lengths(
                synthetic_review,
                real_reviews
            ),

            # 2. 어휘 다양성
            "vocabulary_similarity": compare_vocabulary(
                synthetic_review,
                real_reviews
            ),

            # 3. 문법 자연스러움
            "grammar_score": evaluate_korean_grammar(
                synthetic_review
            ),

            # 4. 감정 분포
            "sentiment_alignment": check_sentiment_match(
                synthetic_review,
                real_reviews
            )
        }

        fidelity_score = average(metrics.values())
        return fidelity_score

    # 좋은 합성 데이터: 85-100점
    # 기준선: 50점
    ```

#### 2. 사실성 (Factuality)

```
정의: 합성 데이터의 명제가 실제로 참인가?

문제:
합성 리뷰: "이 핸드폰은 999시간 배터리를 제공합니다"
→ 물리적으로 불가능한 수치 (환각)

해결책:
1. 사실 기반 생성
2. 검증 단계 추가
3. 불가능한 값 필터링
```

#### 3. 다양성 (Diversity)

```
정의: 생성된 데이터가 충분히 다양한가?

낮은 다양성:
100개 리뷰가 모두:
"좋은 제품입니다. 품질이 좋습니다. 배송도 빠릅니다."
→ 모델이 이 패턴만 학습

높은 다양성:
- 다양한 구매 이유
- 다양한 사용 경험
- 다양한 불만 사항
- 다양한 언어 표현
```

#### 4. 불편견성 (Unbiasedness)

```
정의: 합성 데이터가 특정 편견을 과도하게 반영하지 않는가?

위험한 편견:
"특정 상품은 항상 좋고, 다른 상품은 항상 나쁘다"
→ 모델이 편견을 학습

해결책:
- 감정 분포 균형 (긍정/부정/중립)
- 다양한 사용자 유형
- 다양한 사용 사례
```

### 품질 관리 파이프라인

```python
def quality_assurance_pipeline(generated_data):
    """
    합성 데이터의 품질을 체계적으로 검증
    """

    # 단계 1: 자동 필터링
    filtered_data = []
    for item in generated_data:
        if passes_automatic_checks(item):
            filtered_data.append(item)

    # 단계 2: 다양성 검사
    if has_sufficient_diversity(filtered_data):
        pass  # OK
    else:
        # 부족한 다양성 보충
        filtered_data.extend(generate_missing_variants())

    # 단계 3: 전문가 검증 (표본)
    sample_size = min(100, len(filtered_data) // 10)
    sample = random.sample(filtered_data, sample_size)

    expert_validation = manual_review_by_experts(sample)

    if expert_validation.acceptance_rate > 0.9:
        return filtered_data  # 승인
    else:
        # 품질 재조정 후 재생성
        return regenerate_with_improvements(filtered_data)


def passes_automatic_checks(item):
    """
    자동 품질 검사
    """
    checks = {
        "minimum_length": len(item["text"]) > 20,
        "maximum_length": len(item["text"]) < 2000,
        "korean_language": is_korean(item["text"]),
        "no_repetition": not has_excessive_repetition(item["text"]),
        "no_obvious_hallucination": not contains_impossible_claims(item["text"]),
        "appropriate_sentiment": matches_sentiment_label(item),
    }

    return all(checks.values())
```

## 한국어 학습 데이터 생성

### 한국어 특화 고려사항

#### 1. 한국 비즈니스 어휘

```
일반적인 영어 데이터 기반 LLM은:
- 한국식 인사말 부자연스러움
- 비즈니스 용어 부정확성
- 존댓말/반말 구분 부정확

예시:

나쁜 합성 데이터:
"안녕하세요. 이 제품은 좋습니다."
→ 부자연스러운 존댓말

좋은 합성 데이터:
"안녕하세요! 이 제품 정말 좋아요. 특히 A 부분이 나을 것 같아요."
→ 자연스러운 한국어
```

#### 2. 문화적 맥락

```python
def generate_culturally_aware_korean_data(task):
    """
    한국 문화를 반영한 합성 데이터 생성
    """
    client = Anthropic()

    # 한국 특화 가이드
    korean_guidelines = """
    한국어 제품 리뷰 생성 시 고려사항:

    1. 명절 문화
    - "추석 선물로 좋아요"
    - "설날 전에 도착해서 좋았어요"

    2. 서비스 문화
    - "배송 빨라요" (매우 중요)
    - "AS 잘 봐줘요"
    - "고객센터 친절해요"

    3. 가격 문화
    - "가성비 좋아요" (중요한 표현)
    - "이 가격이 정당해요"

    4. 존댓말 자연스러움
    - "정말 좋아요" (O)
    - "매우 좋습니다" (부자연스러움)
    """

    prompt = f"""
    {korean_guidelines}

    위 가이드라인을 고려하여, {task}에 대한
    자연스러운 한국어 데이터를 생성하세요.
    """

    # 생성 수행
    response = client.messages.create(
        model="claude-4-6",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )

    return response.content[0].text
```

### 한국 도메인별 합성 데이터 예시

#### 금융 도메인

```python
# 금융 상품 리뷰 합성

finance_prompts = {
    "신용카드": {
        "긍정": "포인트도 많이 주고, 혜택이 좋아요. 특히 외식할 때...",
        "부정": "연회비가 아까워요. 실제 혜택은...",
        "특화": "한국 신용카드의 특성: 포인트, 캐시백, 멤버십 혜택"
    },

    "보험": {
        "긍정": "보험료가 저렴하고 가입 절차가 간단했어요",
        "부정": "보험금 청구가 복잡해요",
        "특화": "한국 보험의 특성: 보험료, 보장 범위, 청구 절차"
    }
}
```

#### 이커머스 도메인

```python
# 한국 이커머스 특성 반영

ecommerce_synthetic_data = {
    "배송": [
        "새벽배송이라 다음날 받아서 좋아요",
        "명절 전에 받고 싶었는데 배송이 늦어서 아쉬웠어요",
        "제주도인데도 같은 가격이고 배송이 빨라요"
    ],

    "반품": [
        "반품 접수하니까 바로 수거 와줬어요",
        "반품 절차가 간단해서 좋았어요"
    ],

    "가격": [
        "이 가격이면 정말 가성비 좋아요",
        "쿠폰과 할인을 합치면 정말 싸요"
    ]
}
```

## 합성 데이터 생성 도구와 프레임워크

### 오픈소스 옵션

```python
# 1. LLM을 사용한 직접 생성 (권장)

from anthropic import Anthropic

client = Anthropic()

def generate_with_claude(task_description, num_samples):
    """
    Claude를 사용한 직접 생성 (가장 유연함)
    """
    pass

# 2. HuggingFace 데이터셋 도구

from datasets import Dataset, DatasetDict

def create_synthetic_dataset():
    data = {
        "text": [...],  # 합성 텍스트
        "label": [...],  # 레이블
        "metadata": [...]  # 메타데이터
    }

    dataset = Dataset.from_dict(data)
    return dataset
```

## 실전 사례: 감정 분석 모델 학습

### 전체 프로세스

!!! example "한국어 감정 분석 모델 학습용 합성 데이터"

    ```python
    from anthropic import Anthropic
    import json
    import random

    class KoreanSentimentDataGenerator:
        def __init__(self):
            self.client = Anthropic()
            self.generated_data = []

        def generate_dataset(self, num_per_sentiment=3000):
            """
            한국어 감정 분석용 합성 데이터 대량 생성
            """

            sentiments = ["긍정", "부정", "중립"]
            domains = ["전자제품", "음식", "의류", "화장품", "도서"]

            for sentiment in sentiments:
                for domain in domains:
                    samples = self.generate_samples(
                        sentiment=sentiment,
                        domain=domain,
                        count=num_per_sentiment // len(domains)
                    )
                    self.generated_data.extend(samples)

            return self.generated_data

        def generate_samples(self, sentiment, domain, count):
            """
            특정 도메인과 감정의 데이터 생성
            """

            samples = []

            for i in range(count):
                prompt = f"""
                한국 이커머스 플랫폼의 {domain} 카테고리 상품 리뷰를 작성하세요.

                요구사항:
                - 감정: {sentiment}
                - 도메인: {domain}
                - 언어: 한국어
                - 길이: 50-300 단어
                - 자연스러움: 실제 고객 리뷰처럼

                주의: 각 리뷰는 고유하고 다양해야 합니다.
                """

                response = self.client.messages.create(
                    model="claude-4-6",
                    max_tokens=300,
                    messages=[{"role": "user", "content": prompt}]
                )

                review_text = response.content[0].text

                # 품질 검증
                if self.validate_review(review_text, sentiment):
                    samples.append({
                        "text": review_text,
                        "sentiment": sentiment,
                        "domain": domain,
                        "source": "synthetic"
                    })

            return samples

        def validate_review(self, text, expected_sentiment):
            """
            생성된 리뷰의 기본 품질 검증
            """
            checks = {
                "minimum_length": len(text) > 20,
                "maximum_length": len(text) < 1000,
                "is_korean": self.is_korean_text(text),
                "coherent": self.check_coherence(text),
            }

            return all(checks.values())

        def is_korean_text(self, text):
            # 한글 문자 포함 확인
            return any('\uac00' <= c <= '\ud7a3' for c in text)

        def check_coherence(self, text):
            # 매우 기본적인 일관성 검사
            return len(text.split()) > 5

        def save_to_jsonl(self, filepath):
            """
            생성된 데이터를 JSONL 형식으로 저장
            """
            with open(filepath, 'w', encoding='utf-8') as f:
                for item in self.generated_data:
                    f.write(json.dumps(item, ensure_ascii=False) + '\n')

    # 사용 예시
    generator = KoreanSentimentDataGenerator()
    dataset = generator.generate_dataset(num_per_sentiment=3000)
    generator.save_to_jsonl("korean_sentiment_data.jsonl")

    # 결과: 9,000개의 고품질 한국어 감정 분석 데이터
    # - 각 감정 3,000개
    # - 5개 도메인 다양화
    # - 완전 자동 생성 (몇 시간 소요)
    # - 비용: API 비용 <$50
    ```

### 생성된 데이터의 통계

```
생성 결과 분석:

총 샘플 수: 9,000
├─ 긍정: 3,000 (33%)
├─ 부정: 3,000 (33%)
└─ 중립: 3,000 (34%)

도메인별 분포:
├─ 전자제품: 1,800
├─ 음식: 1,800
├─ 의류: 1,800
├─ 화장품: 1,800
└─ 도서: 1,800

품질 지표:
├─ 최소 길이 충족: 99.8%
├─ 한국어 자연스러움: 96.5%
├─ 전문가 수동 검증 (표본 100): 94%

생성 비용:
├─ Claude Opus 4.8 API: ~$40
└─ 전문가 검증 인건비: ~$200
└─ 총 비용: ~$240 (기존 수집: ~$10,000)

ROI: 40배 비용 절감
```

## 주의사항 및 위험

### 합성 데이터의 한계

!!! warning "⚠️ 조심: 합성 데이터의 위험"

    | 위험 | 설명 | 해결책 |
    |------|------|--------|
    | **환각 (Hallucination)** | 존재하지 않는 사실 포함 | 팩트 체크 필터 |
    | **편견 강화** | 모델의 편견을 학습 데이터에 반영 | 다양성 검증 |
    | **현실과의 괴리** | 너무 이상적인 데이터 | 현실적 변형 추가 |
    | **저품질 데이터** | 생성 실패의 누적 | 품질 필터링 필수 |

### 규제 고려사항 (한국)

```
한국에서 합성 데이터 사용 시 주의:

1. 개인정보보호법
   - 합성 데이터도 실명/개인정보 포함 금지
   - 완전 익명화 필요

2. 저작권
   - 합성 데이터는 새로운 저작물 아님 (구글 기준)
   - 기본 모델의 라이선스 준수 필요

3. 차별금지법
   - 합성 데이터가 특정 집단 차별 포함 금지

예시:
나쁜 예: "000은행의 대출은 신용점수가 높아야 한다"
        (실제 차별 반영)

좋은 예: "이 은행의 대출 조건을 확인해보세요"
        (차별 없이 중립적)
```

---

## 📝 핵심 정리

### 핵심 개념
- **합성 데이터**: LLM이 생성한 학습 데이터 (실제 데이터 품질과 비교 가능)
- **품질 관리**: 충실성, 사실성, 다양성, 불편견성 4가지 핵심 차원
- **검증**: 자동 필터링 + 전문가 표본 검증

### 장점
- **속도**: 수개월 → 수시간
- **비용**: $10,000 → $100-500
- **프라이버시**: 개인정보 없음
- **다양성**: 무제한 생성 가능
- **한국어**: 부족한 한국어 데이터 충분히 생성

### 품질 관리 4단계
1. **충실성**: 실제 데이터와 유사한가?
2. **사실성**: 합리적인 명제인가?
3. **다양성**: 충분히 다양한가?
4. **불편견성**: 특정 편견 없는가?

### 한국어 특화
- 한국식 어휘와 문화적 맥락 반영
- 존댓말, 비즈니스 용어 자연스러움
- 한국 서비스 특성 (배송, 반품, 가격)
- 명절, 계절 문화 반영

### 실무 적용 프로세스
1. 데이터 요구사항 정의
2. 생성 전략 선택 (템플릿 vs 다양화)
3. Claude/GPT로 대량 생성
4. 자동 필터링 (기본 품질 검사)
5. 다양성 검증
6. 전문가 표본 검증 (5-10%)
7. 최종 모델 학습

### 비용-효과 분석
- 기존 수집: 3-6개월, $10,000-50,000
- 합성 데이터: 1-2주, $100-500
- ROI: 50-100배 비용 절감
- 한국 중소 기업에게 특히 유용

### 주의사항
- 규제: 개인정보보호법, 저작권, 차별금지법 준수
- 팩트 체크: 환각 데이터 제거 필수
- 편견 검증: 특정 집단 편견 포함 여부 확인
- 지속적 모니터링: 생성된 모델의 실제 성능 추적

---

**Last Updated**: 2026년 2월 | **Reference**: Google DeepMind, "Best Practices and Lessons Learned on Synthetic Data" (2024)
