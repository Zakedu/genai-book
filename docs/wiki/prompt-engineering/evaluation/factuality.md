# 사실성 검증 및 향상

LLM의 응답이 실제 사실과 일치하는지 확인하고 개선하는 방법을 학습합니다.

## 사실성이란?

사실성(Factuality)은 LLM의 응답이 검증 가능한 현실과 일치하는 정도입니다. LLM은 그럴듯하지만 거짓인 정보를 마치 사실인 것처럼 생성할 수 있으므로, 사실성 검증은 매우 중요합니다.

## 사실성 문제의 원인

### 1. 학습 데이터의 한계

```python
# LLM의 학습이 2024년 4월에 중단된 경우
# 2024년 5월 이후의 정보는 알 수 없음

question = "2025년 한국 대선 결과는?"
# 모델은 실제 답을 모르고, 그럴듯한 답을 만들어냄
```

### 2. 사전 학습 데이터의 불완전성

```
학습 데이터의 구성:
- 인기 있는 정보: 많이 학습됨 → 높은 정확도
- 틈새 정보: 적게 학습됨 → 낮은 정확도
- 오류 정보: 학습됨 → 오류 반복 가능
```

### 3. 모델의 추론 한계

```
Q: "한국의 재정적자는 GNP의 몇 %인가?"
모델의 과정:
1. "재정적자"의 의미 이해
2. 과거 패턴 기반 추론
3. "대략 3-5% 정도" (실제 근거 없이)
```

## 2026년 모델별 사실성 성능

### 평가 데이터셋 (FEVER, TruthfulQA)

| 모델 | FEVER F1 | TruthfulQA | 문제점 |
|------|----------|-----------|-------|
| Claude 4.6 | 89% | 91% | 드물지만 여전히 환각 |
| GPT-5.4 | 87% | 89% | 확신 있게 거짓말 |
| Gemini 2.5 Pro | 85% | 87% | 시간 기반 정보 약함 |

## 사실성 검증 방법

### 1. 문맥 기반 검증 (Context-Based Verification)

```python
def verify_with_context(question, context, response):
    """제공된 문맥에서 응답 검증"""

    # 응답이 문맥에 포함되어 있는가?
    if response_in_context(response, context):
        return {
            'verified': True,
            'confidence': 'high',
            'method': 'context_matching'
        }

    return {
        'verified': False,
        'confidence': 'low',
        'method': 'context_matching'
    }

# 사용 예시
context = """
한국의 수도는 서울입니다.
서울은 한강을 중심으로 발전했습니다.
"""

question = "한국의 수도는?"
response = "서울"

verify_with_context(question, context, response)
# → {'verified': True, 'confidence': 'high'}
```

### 2. 외부 지식 기반 검증 (Knowledge-Based Verification)

```python
def verify_with_knowledge_base(question, response):
    """외부 지식 기반에서 응답 검증"""

    knowledge_base = load_wikipedia_knowledge()

    # 사실 추출
    extracted_facts = extract_facts(response)

    verified_facts = []
    unverified_facts = []

    for fact in extracted_facts:
        if fact in knowledge_base:
            verified_facts.append(fact)
        else:
            unverified_facts.append(fact)

    return {
        'verified_facts': verified_facts,
        'unverified_facts': unverified_facts,
        'accuracy': len(verified_facts) / len(extracted_facts)
    }
```

### 3. 인간 검증 (Human Verification)

민감한 분야에서는 전문가의 검증이 필수:

```python
class HumanVerificationQueue:
    def __init__(self):
        self.queue = []
        self.reviewers = {}

    def queue_for_review(self, response, domain, priority='normal'):
        """검증을 위해 응답 큐에 등록"""
        review_request = {
            'response': response,
            'domain': domain,
            'priority': priority,
            'timestamp': datetime.now(),
            'status': 'pending'
        }
        self.queue.append(review_request)

        # 우선순위가 높으면 전문가에게 즉시 할당
        if priority == 'high':
            expert = self.find_available_expert(domain)
            if expert:
                self.assign_review(expert, review_request)

    def assign_review(self, expert, request):
        """전문가에게 검증 할당"""
        # 전문가 시스템으로 전송
        notify_expert(expert, request)
```

## 한국 맥락의 사실성 검증

### 한국 역사/지리 사실 확인

```python
korean_fact_checker = {
    "historical_facts": [
        {
            "question": "삼국통일은 언제 이루어졌는가?",
            "correct_answer": "676년 (신라의 삼국통일)",
            "common_errors": [
                "660년 (백제 멸망)",
                "668년 (고구려 멸망)",
            ]
        }
    ],
    "geographical_facts": [
        {
            "question": "한국의 최고봉은?",
            "correct_answer": "백두산 (2,744m)",
            "context": "한반도 내에서는 설악산(1,708m)"
        }
    ],
    "cultural_facts": [
        {
            "question": "훈민정음은 누가 창제했는가?",
            "correct_answer": "세종대왕 (1443년)",
            "related_facts": ["14자 기본 자음/모음"]
        }
    ]
}
```

### 한국 공공 정보 검증

```python
korean_public_fact_checker = {
    "political": {
        "verified_sources": [
            "국회 공식 웹사이트",
            "청와대 공식 발표",
            "행정안전부 공식 통지"
        ]
    },
    "economic": {
        "verified_sources": [
            "한국은행 공식 발표",
            "통계청 공식 자료",
            "금융감시위원회 공시"
        ]
    },
    "health": {
        "verified_sources": [
            "질병관리청",
            "의료진흥청",
            "대한의학회"
        ]
    }
}
```

## 사실성 향상 전략

### 1단계: 접지 문맥 제공 (Grounding with Context)

```python
# ❌ 나쁜 예: 문맥 없음
bad_prompt = """
Q: 한국의 GDP는?
A:
"""

# ✅ 좋은 예: 문맥 제공
good_prompt = """
다음 문맥을 기반으로 질문에 답하세요:

[문맥]
한국은행의 2024년 발표에 따르면,
한국의 GDP는 약 1.5조 달러입니다.

Q: 한국의 GDP는?
A: (문맥의 정보 기반)
"""

# 사용 코드
def ground_response_with_context(question, context):
    prompt = f"""
다음 문맥을 기반으로 질문에 답하세요.
만약 문맥에 정보가 없으면 "모릅니다"라고 말하세요.

[문맥]
{context}

Q: {question}
A:
"""
    return model.query(prompt)
```

### 2단계: 확신도 낮추기 (Reducing Confidence)

```python
def reduce_model_confidence():
    """모델이 덜 확신 있게 응답하도록"""

    parameters = {
        'temperature': 0.3,      # 낮은 값: 덜 다양하고 더 보수적
        'top_p': 0.7,            # 확률이 낮은 토큰 제외
        'presence_penalty': 0.5, # 반복 제거
    }

    prompt = """
다음 규칙을 따르세요:
1. 확실하지 않으면 "모릅니다"라고 답하세요
2. 정보의 출처를 명시하세요
3. 한계를 인정하세요

Q: [질문]
A:
"""

    return parameters, prompt
```

### 3단계: Few-Shot 예시 (Few-Shot Examples)

```python
def few_shot_factuality_examples():
    """사실성 강조 예시"""

    prompt = """
Q: 지구의 자전 주기는?
A: 지구는 약 23시간 56분 4초에 한 번 자전합니다.

Q: 미래 기술에 대해 설명하세요.
A: 저는 현재 시점의 정보만 알고 있으므로,
   미래 기술은 예측할 수 없습니다.

Q: 한국 최고 높이의 산은?
A: 한반도에서는 백두산이 가장 높으며,
   남한에서는 설악산이 가장 높습니다.

Q: 2026년 올림픽은 어디서 열릴까요?
A: 제 학습 데이터는 2024년까지이므로,
   이에 대해서는 확실히 답할 수 없습니다.
"""

    return prompt
```

### 4단계: 자체 검증 (Self-Verification)

```python
class SelfVerificationChain:
    def __init__(self, model):
        self.model = model

    def verify_response(self, question, initial_response):
        """응답을 생성한 후 자체적으로 검증"""

        # Step 1: 초기 응답 생성
        response = initial_response

        # Step 2: 검증 질문 생성
        verification_prompt = f"""
다음 답변이 사실인지 검증하세요:
Q: {question}
A: {response}

이 답변의 각 주요 주장을 검증하세요:
1. 주요 주장 1이 사실인가? (예/아니오/확실하지 않음)
2. 주요 주장 2가 사실인가?
...
"""

        verification = self.model.query(verification_prompt)

        # Step 3: 검증 결과 분석
        is_factual = self.analyze_verification(verification)

        if not is_factual:
            # Step 4: 응답 수정
            correction_prompt = f"""
다음 사실성 문제가 있습니다:
{verification}

이를 고려하여 더 정확한 답변을 제공하세요:
"""
            corrected_response = self.model.query(correction_prompt)
            return corrected_response

        return response
```

## 사실성 검증 체크리스트

!!! checklist "사실성 검증 체크리스트"
    - [ ] 신뢰성 있는 소스의 문맥 제공
    - [ ] 모델의 확신도 낮추기
    - [ ] 불확실성 명시 유도
    - [ ] Few-shot 예시로 사실성 강조
    - [ ] 자체 검증 메커니즘 구현
    - [ ] 민감한 정보는 전문가 검증
    - [ ] 사실 검증 도구 연동 (위키피디아, 공식 자료)
    - [ ] 정기적 사실성 평가 (주간)

## 한국 산업별 사실성 요구사항

| 산업 | 사실성 요구도 | 검증 방법 |
|------|------------|---------|
| 금융 | 극도로 높음 (99%+) | 금융감시위원회 자료, 은행 공시 |
| 의료 | 극도로 높음 (99%+) | 의료 데이터베이스, 의사 감수 |
| 법률 | 매우 높음 (98%+) | 법령 데이터베이스, 변호사 검증 |
| 교육 | 높음 (95%+) | 교과서, 학술 자료 |
| 미디어 | 높음 (95%+) | 사실 검증 기관 자료 |
| 마케팅 | 중간 (90%+) | 통계청 자료, 고객 리뷰 |

## 2026년 모델별 사실성 개선

```
Claude 4.6:
- Constitutional AI로 거짓말 자체 거부
- "모릅니다" 사용 빈도: 매우 높음
- 신뢰성: 사실에 기반한 응답만 제공

GPT-5.4:
- 다단계 검증 메커니즘
- 확신도 표시: "이것은 추측입니다" 표현
- 신뢰성: 사실과 의견의 구분

Gemini 2.5 Pro:
- 실시간 정보 통합
- 소스 인용: 응답에 출처 표시
- 신뢰성: 최신 정보 기반
```

---

## 📝 핵심 정리

- **사실성**: LLM 응답이 검증 가능한 현실과 일치하는 정도
- **문제의 원인**: 학습 데이터 한계, 시간 경과, 추론 오류
- **검증 방법**: 문맥 기반, 지식 기반, 인간 검증, 자체 검증
- **향상 전략**: 문맥 제공 → 확신도 낮추기 → Few-shot 예시 → 자체 검증
- **한국 특화**: 공공 자료(통계청, 금감원) 활용한 자동 검증
- **산업별**: 금융/의료는 99%, 교육/미디어는 95% 이상의 정확도 필요

**마지막 업데이트**: 2026년 2월
