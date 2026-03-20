# 컨텍스트 캐싱으로 비용 최적화

컨텍스트 캐싱은 반복적으로 사용되는 긴 문서나 데이터를 캐시하여 API 호출 비용을 크게 절감합니다. Gemini 2.5 Pro, Claude 4.6 등의 최신 모델에서 지원합니다.

## 핵심 개념

### 1. 컨텍스트 캐싱이란?

LLM에 긴 문서를 반복해서 전송하는 대신, 첫 번째 전송 시에만 완전히 처리하고 이후에는 캐시된 버전을 재사용합니다.

**예시**:
- 매번 같은 API 문서 1,000개 토큰을 전송 대신
- 첫 번째만 전송하고 다음부터는 캐시된 버전 사용
- 토큰 사용량 70-90% 감소

### 2. 컨텍스트 캐싱의 가치

| 시나리오 | 비용 절감 | 활용 효과 |
|---------|---------|---------|
| **문서 검색** | 80% | 매번 같은 문서 질의 |
| **코드 분석** | 75% | 같은 코드베이스 반복 분석 |
| **고객 지원** | 70% | 회사 정책/FAQ 반복 사용 |
| **연구** | 85% | 논문 데이터셋 반복 조회 |

### 3. 지원 모델 및 비용

**Gemini**:
- Gemini 2.5 Pro: 캐시된 토큰 50% 할인
- 캐시 생성 비용: 토큰당 25%

**Claude**:
- Claude 4.6: 캐시된 입력 토큰 90% 할인
- 캐시 생성: 입력 토큰 25% 비용

**최소 캐시 크기**:
- Gemini: 1,024토큰 이상
- Claude: 1,024토큰 이상

## 실무 활용 예제

### 예제 1: 대규모 API 문서 캐싱 (Gemini)

#### 상황
개발팀이 API 문서(약 5,000토큰)에 대해 매일 여러 질문을 합니다.

#### 구현

```python
import anthropic
import json

# 긴 API 문서 로드
with open("api_docs.txt", "r") as f:
    api_docs = f.read()  # 약 5,000토큰

client = anthropic.Anthropic()

# Step 1: 처음 한 번만 캐싱 활성화
first_response = client.messages.create(
    model="claude-opus-4-20250805",
    max_tokens=1000,
    system=[
        {
            "type": "text",
            "text": "당신은 API 전문가입니다. 주어진 API 문서를 기반으로 질문에 답해주세요."
        },
        {
            "type": "text",
            "text": api_docs,
            "cache_control": {"type": "ephemeral"}  # 캐싱 활성화
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "POST /users 엔드포인트는 어떻게 사용하나요?"
        }
    ]
)

print("사용 토큰:", first_response.usage)
# 입력 토큰: 5,000 (캐시 생성 비용 포함)

# Step 2: 다음 질문들은 캐시된 버전 사용
subsequent_queries = [
    "GET /users/{id}의 응답 형식은?",
    "인증 헤더는 어떻게 구성하나요?",
    "에러 처리 방식을 설명해주세요"
]

for query in subsequent_queries:
    response = client.messages.create(
        model="claude-opus-4-20250805",
        max_tokens=1000,
        system=[
            {
                "type": "text",
                "text": "당신은 API 전문가입니다."
            },
            {
                "type": "text",
                "text": api_docs,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=[
            {"role": "user", "content": query}
        ]
    )

    # 캐시된 토큰 확인
    cache_info = response.usage
    print(f"쿼리: {query}")
    print(f"입력 토큰: {cache_info.input_tokens}")
    print(f"캐시된 토큰: {cache_info.cache_read_input_tokens}")
    print()
```

#### 비용 분석

```
시나리오: 일일 10개 쿼리

캐싱 없는 경우:
- 입력 토큰: 5,000 × 10 = 50,000
- 비용: 50,000 × $0.003 = $150/일

캐싱 적용:
- 첫 번째: 5,000 × $0.00375 = $18.75 (캐시 생성)
- 나머지 9개: 5,000 × 9 × $0.0003 = $13.50 (캐시 사용, 90% 할인)
- 일일 비용: $32.25

절감액:
- 일일: $150 - $32.25 = $117.75 (78% 절감)
- 월간: $3,532.50 절감!
```

### 예제 2: 고객 지원 FAQ 캐싱

#### 상황
고객 지원팀이 회사의 FAQ 문서(3,000토큰)를 반복적으로 참조합니다.

#### 캐시 설정

```python
from anthropic import Anthropic

client = Anthropic()

# FAQ 문서 로드
faq_content = """
【자주 묻는 질문】

1. 배송은 얼마나 걸리나요?
   → 일반 배송: 2-3일 (서울 기준)
     특급 배송: 당일 또는 다음날

2. 반품은 어떻게 하나요?
   → 구매 후 30일 이내에 반품 가능
     미개봉 상품만 환불 가능
     배송비는 고객 부담

3. A/S는?
   → 구매일로부터 1년 무료 A/S
   [... 더 많은 Q&A ...]
"""

def customer_support(question):
    response = client.messages.create(
        model="claude-opus-4-20250805",
        max_tokens=500,
        system=[
            {
                "type": "text",
                "text": "당신은 친절한 고객 지원팀입니다."
            },
            {
                "type": "text",
                "text": faq_content,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=[
            {"role": "user", "content": question}
        ]
    )
    return response.content[0].text

# 사용
print(customer_support("배송비는 얼마인가요?"))
print(customer_support("반품 가능 기간은?"))
print(customer_support("A/S 기간은?"))
```

### 예제 3: 긴 문서 분석 (논문/보고서)

#### 프롬프트

```python
# 논문(10,000토큰) 캐싱
paper_content = """
[긴 학술 논문 전문 ...]
"""

# 논문에 대한 여러 질문
questions = [
    "이 논문의 주요 기여도는?",
    "방법론을 설명해주세요",
    "실험 결과의 의의는?",
    "앞으로의 연구 방향은?",
    "이 논문이 인용한 주요 관련 연구는?"
]

for q in questions:
    response = client.messages.create(
        model="claude-opus-4-20250805",
        max_tokens=1000,
        system=[
            {
                "type": "text",
                "text": "당신은 논문 분석 전문가입니다."
            },
            {
                "type": "text",
                "text": paper_content,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=[{"role": "user", "content": q}]
    )
```

## 💡 컨텍스트 캐싱 팁

!!! tip "효과적인 캐싱 전략"

    1. **캐시할 콘텐츠 선정**
       - 반복되는 문서 (API 문서, 회사 정책, FAQ)
       - 충분한 크기 (최소 1,024토큰)
       - 자주 변경되지 않는 내용

    2. **TTL (Time-to-Live) 설정**
       - 단기 캐시: 5분 (임시 세션)
       - 중기 캐시: 1시간 (업무 시간)
       - 장기 캐시: 24시간 (일관성 있는 정보)

    3. **비용 최적화**
       ```
       가치 = (1회 캐시 비용 증가) < (여러 번 재사용 절감)

       예시:
       - 캐시 생성: 3,000 토큰 × $0.003 = $9
       - 캐시 사용 x 10회: 3,000 × $0.0003 × 10 = $9
       - 브레이크이브: 약 3-4회 사용 시점
       ```

    4. **동시성 관리**
       - 여러 사용자가 같은 캐시 공유 가능
       - 캐시 히트율 모니터링
       - 갱신 주기 설정

!!! tip "캐싱이 효과적인 경우"

    ✓ API 문서 반복 질의 (70-90% 절감)
    ✓ 고객 지원 FAQ (75-85% 절감)
    ✓ 코드 리뷰 (같은 코드베이스) (80% 절감)
    ✓ 대규모 데이터셋 분석 (85-90% 절감)

    ✗ 일회성 쿼리 (캐싱 오버헤드 더 큼)
    ✗ 자주 변경되는 문서
    ✗ 아주 짧은 콘텐츠 (< 1,000토큰)

## 📝 핵심 정리

| 항목 | 내용 |
|------|------|
| **목적** | API 호출 비용 70-90% 절감 |
| **최소 크기** | 1,024토큰 |
| **캐시 유지 시간** | 5분-24시간 (조정 가능) |
| **비용 절감** | 캐시된 토큰 90% 할인 |
| **활용 사례** | API 문서, FAQ, 코드 분석, 데이터셋 분석 |
| **추천 모델** | Claude 4.6, Gemini 2.5 Pro |
| **적용 시간** | 즉시 (API 설정) |

🎓
---

## 핵심 개념

- Gemini 2.0 Flash의 컨텍스트 캐싱의 정의 및 기본 원리
- LLM 프롬프팅에서의 실무 활용 방식
- 성공적인 구현을 위한 핵심 요소
- 일반적인 실패 사례 및 해결 방법
- 성능 평가 및 최적화 전략

## 왜 중요한가

현대의 대규모 언어 모델(LLM)을 효과적으로 활용하기 위해서는 프롬프팅 기법에 대한 깊이 있는 이해가 필수적입니다. 이 섹션에서 다루는 내용들은 실무에서 마주치는 다양한 문제들을 해결하고, LLM의 능력을 최대한 활용하는 방법을 제시합니다.

## 시험 포인트

- 개념 간 관계 및 차이점 파악
- 실제 구현 과정에서의 주의사항
- 예상 가능한 오류 모드 (failure modes)
- 프로덕션 환경에서의 제약사항
- 성능 최적화 및 비용 고려사항
