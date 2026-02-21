# 환각 탐지 및 식별

LLM이 생성하는 환각(거짓 정보)을 식별하고 방지하는 방법을 상세히 분석합니다.

## 환각이란?

환각(Hallucination)은 LLM이 근거 없이 거짓이거나 과장된 정보를 마치 사실인 것처럼 생성하는 현상입니다. 마치 인간이 실제 기억이 없는데 자신있게 거짓 기억을 말하는 것처럼, LLM도 학습하지 않은 정보를 생성합니다.

## 환각의 유형

### 1. 사실적 환각 (Factual Hallucination)

**정의**: 존재하지 않는 사실을 만들어내기

**예시**:
```
Q: "한국 최초의 AI 회사는?"
A: "2010년 설립된 'AIKorea Inc'가 한국 최초의 AI 회사입니다"
→ 실제로는 존재하지 않는 회사

Q: "파리의 에펠탑 높이는?"
A: "정확히 324.9미터입니다"
→ 실제는 330미터 (환각은 아니지만, 부정확한 기억)
```

### 2. 의미론적 환각 (Semantic Hallucination)

**정의**: 존재하는 개념을 잘못 설명하기

```
Q: "광합성 과정에서 생성되는 최종 산물은?"
A: "산소와 이산화탄소입니다"
→ 실제: 포도당(에너지)과 산소

Q: "한국의 정치 제도는?"
A: "대통령중심제이고, 대통령이 행정부장을 겸임합니다"
→ 오류: 국무총리가 행정부의 수장
```

### 3. 논리적 환각 (Logical Hallucination)

**정의**: 논리적으로 모순되거나 불가능한 주장

```
Q: "A는 B보다 크고 B는 C보다 큽니다. C와 A의 크기 관계는?"
A: "C가 A보다 큽니다"
→ 논리적 모순

Q: "한국의 인구가 2년 연속 감소했습니다. 그렇다면 인구가 증가했나요?"
A: "예, 인구가 크게 증가했습니다"
→ 명백한 모순
```

### 4. 외부화 환각 (Extrinsic Hallucination)

**정의**: 제공된 문맥을 무시하고 다른 정보 사용

```
[문맥]
한국의 GDP는 2024년 기준 약 1.5조 달러입니다.

[질문]
한국의 GDP는?

[환각된 답]
"한국의 GDP는 2조 달러입니다"
→ 제공된 문맥을 무시하고 다른 정보 사용
```

## 환각 탐지 체크리스트

!!! checklist "환각 탐지 체크리스트"
    - [ ] **출처 확인**: 응답이 신뢰성 있는 출처를 인용하는가?
    - [ ] **일관성**: 다양한 각도에서 질문했을 때 일관된 답변인가?
    - [ ] **가능성**: 물리적으로 가능한 답변인가?
    - [ ] **논리성**: 논리적으로 모순되지 않는가?
    - [ ] **문맥 충실성**: 제공된 문맥을 올바르게 사용했는가?
    - [ ] **세부 사항**: 과도하게 구체적인 세부사항이 있는가? (환각의 신호)
    - [ ] **신뢰도 표현**: 모델이 불확실성을 인정하는가?
    - [ ] **추가 검증**: 독립적인 출처로 검증 가능한가?

## 환각 탐지 방법

### 1. 자체 검증 (Self-Verification)

```python
def self_verify_response(model, question, response):
    """응답을 자체적으로 검증"""

    # Step 1: 초기 응답 분석
    extracted_facts = extract_factual_claims(response)

    # Step 2: 각 사실에 대해 별도 질문
    verification_results = {}
    for fact in extracted_facts:
        # 다른 형태로 같은 정보 물어보기
        alternative_question = rephrase_question(fact)
        alternative_response = model.query(alternative_question)

        # 응답 비교
        is_consistent = compare_responses(response, alternative_response)
        verification_results[fact] = is_consistent

    # Step 3: 불일치 확인
    hallucination_score = sum(1 for v in verification_results.values()
                             if not v) / len(verification_results)

    return {
        'verification_results': verification_results,
        'hallucination_score': hallucination_score,
        'is_hallucinated': hallucination_score > 0.3
    }
```

### 2. 문맥 기반 검증 (Context-Based Verification)

```python
def context_based_verification(context, response):
    """응답이 제공된 문맥에 포함되어 있는가?"""

    extracted_facts = extract_factual_claims(response)

    verified_facts = []
    unverified_facts = []

    for fact in extracted_facts:
        if is_fact_in_context(fact, context):
            verified_facts.append(fact)
        else:
            unverified_facts.append(fact)

    return {
        'verified': verified_facts,
        'unverified': unverified_facts,
        'extrinsic_hallucination_detected': len(unverified_facts) > 0
    }

# 사용 예시
context = """
한국의 수도는 서울이고, 서울의 인구는 약 900만입니다.
서울은 한강을 중심으로 발전했습니다.
"""

response = """
한국의 수도는 서울이며, 인구는 약 1,000만입니다.
서울은 아마 한강을 중심으로 발전했을 것입니다.
한국에는 5개의 주요 도시가 있습니다.
"""

result = context_based_verification(context, response)
# 결과: verified=['한국의 수도는 서울'], unverified=['인구 1000만', '5개 주요도시']
```

### 3. 외부 지식 기반 검증 (Knowledge-Based Verification)

```python
from wikipedia import Wikipedia
from korean_fact_database import KoreanFacts

class KnowledgeBasedVerifier:
    def __init__(self):
        self.wikipedia = Wikipedia()
        self.korean_facts = KoreanFacts()
        self.trusted_sources = [
            "통계청",
            "한국은행",
            "문화재청"
        ]

    def verify_with_knowledge_base(self, facts):
        """외부 지식 기반으로 사실 검증"""

        results = {
            'verified': [],
            'unverified': [],
            'contradicted': []
        }

        for fact in facts:
            # 위키피디아 검증
            wiki_result = self.wikipedia.search_fact(fact)

            # 한국 사실 데이터베이스 검증
            korean_result = self.korean_facts.search(fact)

            if wiki_result['found'] or korean_result['found']:
                # 일치하는가?
                if wiki_result['matches'] or korean_result['matches']:
                    results['verified'].append(fact)
                else:
                    results['contradicted'].append(fact)
            else:
                results['unverified'].append(fact)

        return results

    def get_trusted_source_info(self, fact):
        """신뢰할 수 있는 출처에서 정보 가져오기"""

        for source in self.trusted_sources:
            info = self.query_source(source, fact)
            if info:
                return {
                    'source': source,
                    'information': info,
                    'reliability': 'high'
                }

        return None
```

### 4. 반복 테스트 (Consistency Testing)

```python
def consistency_testing(model, question, num_iterations=5):
    """같은 질문을 여러 번 물어서 일관성 확인"""

    responses = []
    for _ in range(num_iterations):
        response = model.query(question, temperature=0.7)  # 다양성 허용
        responses.append(response)

    # 응답의 일관성 분석
    consistency_score = calculate_consistency(responses)

    if consistency_score < 0.6:
        # 일관성이 낮으면 환각 위험
        return {
            'hallucination_risk': 'high',
            'consistency_score': consistency_score,
            'recommendation': 'use_with_caution',
            'responses': responses
        }

    return {
        'hallucination_risk': 'low',
        'consistency_score': consistency_score,
        'recommendation': 'reliable'
    }
```

## 한국 맥락의 환각 탐지

### 한국 역사/지리 환각 사례

```python
korean_hallucination_examples = [
    {
        "type": "factual",
        "example": "한국 최초의 수도는 평양입니다",
        "correct": "한국 최초의 수도는 서울(한양)입니다",
        "detection": "역사 데이터베이스 확인"
    },
    {
        "type": "numerical",
        "example": "한국의 인구는 5,000만입니다",
        "correct": "약 5,200만명 (2024년 기준)",
        "detection": "통계청 자료 비교"
    },
    {
        "type": "logical",
        "example": "한국은 북한보다 인구가 적습니다",
        "correct": "한국의 인구가 약 2배 많습니다",
        "detection": "수치 비교"
    }
]
```

### 한국 공공 정보 검증

```python
class KoreanPublicInfoVerifier:
    def __init__(self):
        # 한국 공식 데이터 소스
        self.sources = {
            "statistics": "https://kostat.go.kr",      # 통계청
            "bank": "https://www.bok.or.kr",           # 한국은행
            "government": "https://www.korea.kr",      # 정부 공식 사이트
            "cultural": "https://www.cha.go.kr",       # 문화재청
            "health": "https://www.kdca.go.kr"         # 질병관리청
        }

    def verify_statistic(self, statistic_claim):
        """통계청 기준 검증"""
        official_data = self.sources['statistics'].get_data()
        return self._compare_claim_with_data(statistic_claim, official_data)

    def verify_monetary_policy(self, policy_claim):
        """한국은행 기준 검증"""
        official_data = self.sources['bank'].get_data()
        return self._compare_claim_with_data(policy_claim, official_data)

    def verify_cultural_fact(self, cultural_claim):
        """문화재청 기준 검증"""
        official_data = self.sources['cultural'].get_data()
        return self._compare_claim_with_data(cultural_claim, official_data)
```

## 환각 방지 전략

### 1. 프롬프트 설계

```python
# ❌ 환각을 유발할 수 있는 프롬프트
bad_prompt = "한국의 모든 역사적 사건을 나열하세요"

# ✅ 환각을 방지하는 프롬프트
good_prompt = """
다음 규칙을 따르세요:

1. 확실하지 않은 정보는 제공하지 마세요
2. 정보의 출처를 명시하세요
3. 이전 학습 데이터의 한계를 인정하세요
4. "모릅니다"라고 말하는 것이 틀린 정보를 제공하는 것보다 낫습니다

Q: 한국의 주요 역사적 사건은?
A: (신뢰할 수 있는 범위 내에서만 답변)
"""
```

### 2. 온도와 매개변수 조정

```python
# 환각이 많을 때:
# - temperature: 높음 (0.9+) → 낮음 (0.1-0.3)
# - top_p: 높음 (0.99) → 낮음 (0.7-0.8)
# - frequency_penalty: 낮음 → 높음

def reduce_hallucination_parameters():
    return {
        'temperature': 0.2,        # 더 결정론적
        'top_p': 0.7,              # 확률 분포 제한
        'presence_penalty': 0.5,   # 새로운 토픽 제한
        'frequency_penalty': 0.3,  # 반복 감소
    }
```

### 3. 접지 (Grounding)

```python
def ground_answer_in_documents(question, documents):
    """문서 기반으로 답변 접지"""

    prompt = f"""
다음 문서들을 기반으로 질문에 답하세요.
문서에 없는 정보는 제공하지 마세요.

[문서들]
{documents}

Q: {question}

A: (문서에만 기반하여 답변)
"""

    response = model.query(prompt)
    return response
```

## 환각 탐지 시스템 구축

```python
class HallucinationDetectionSystem:
    def __init__(self):
        self.verifier = KnowledgeBasedVerifier()
        self.context_verifier = ContextVerifier()
        self.consistency_checker = ConsistencyChecker()

    def comprehensive_hallucination_check(self, question, response):
        """종합적인 환각 검사"""

        checks = {
            'knowledge_verification': self.verifier.verify_with_knowledge_base(
                extract_facts(response)
            ),
            'context_verification': self.context_verifier.check(response),
            'consistency': self.consistency_checker.check(question, response),
            'confidence_level': extract_confidence(response)
        }

        # 종합 점수 계산
        hallucination_score = self._calculate_hallucination_score(checks)

        return {
            'detailed_checks': checks,
            'hallucination_score': hallucination_score,
            'risk_level': self._determine_risk_level(hallucination_score),
            'recommendation': self._generate_recommendation(hallucination_score)
        }

    def _calculate_hallucination_score(self, checks):
        """환각 점수 계산"""
        unverified_ratio = (
            len(checks['knowledge_verification']['unverified']) /
            (len(checks['knowledge_verification']['verified']) +
             len(checks['knowledge_verification']['unverified']) + 0.001)
        )
        return unverified_ratio

    def _determine_risk_level(self, score):
        """위험 수준 결정"""
        if score < 0.1:
            return 'low'
        elif score < 0.3:
            return 'medium'
        else:
            return 'high'

    def _generate_recommendation(self, score):
        """권장사항 생성"""
        if score < 0.1:
            return 'production_ready'
        elif score < 0.3:
            return 'needs_review'
        else:
            return 'requires_revision'
```

## 2026년 모델 환각 성능

```
Claude 4.6:
- 환각 비율: 5-8%
- 탐지 후 자체 수정 확률: 70%
- "모릅니다" 사용: 매우 자주

GPT-5:
- 환각 비율: 7-10%
- 탐지 후 자체 수정 확률: 65%
- "모릅니다" 사용: 적당히

Gemini 2.5 Pro:
- 환각 비율: 8-12%
- 탐지 후 자체 수정 확률: 60%
- "모릅니다" 사용: 드물게
```

---

## 📝 핵심 정리

- **환각**: 근거 없이 거짓 정보를 사실처럼 생성하는 LLM의 현상
- **유형**: 사실적, 의미론적, 논리적, 외부화 환각
- **탐지 방법**: 자체 검증, 문맥 기반, 지식 기반, 반복 테스트
- **한국 맥락**: 공식 출처(통계청, 한국은행, 문화재청)를 활용한 검증
- **방지 전략**: 프롬프트 설계, 매개변수 조정, 접지 (문서 기반)
- **2026년 현황**: Claude 4.6이 가장 낮은 환각 비율(5-8%)

**마지막 업데이트**: 2026년 2월
