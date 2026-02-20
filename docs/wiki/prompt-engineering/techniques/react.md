# ReAct 프롬프팅(ReAct Prompting)

## 개요

ReAct는 "추론(Reasoning) + 행동(Action)"의 약자로, LLM이 복잡한 작업을 단계별로 해결하도록 장려하는 기법입니다. 이는 추론(생각 과정)과 행동(도구 사용, 검색, 계산 등)을 번갈아 가면서 진행합니다.

## 핵심 개념

ReAct는 다음과 같은 단계를 반복합니다:

1. **생각(Think)**: 현재 상황을 분석하고 다음 단계를 계획
2. **행동(Act)**: 실제 작업(도구 호출, 검색 등) 수행
3. **관찰(Observe)**: 행동의 결과 확인
4. **반복**: 목표에 도달할 때까지 반복

## ReAct 프롬프팅의 예시

### 웹 검색이 필요한 질문

**프롬프트:**
```
Question: What is the latest news about artificial intelligence?

Thought: I need to search for the latest news about artificial intelligence.
Action: Search "latest news artificial intelligence 2024"
Observation: [Search results about recent AI developments]

Thought: Based on the search results, I can now provide a comprehensive answer.
Action: Compile and summarize the findings
Observation: [Summary of recent AI news]

Answer: Based on the latest information, the key developments in AI include...
```

### 계산이 필요한 문제

**프롬프트:**
```
Question: If I buy 5 items at $15 each and get a 20% discount, how much will I spend?

Thought: I need to calculate the total cost with discount.
Action: Calculate total before discount = 5 × $15
Observation: $75

Thought: Now I need to apply the 20% discount.
Action: Calculate discount = $75 × 0.20
Observation: $15

Thought: Now calculate the final amount.
Action: Final amount = $75 - $15
Observation: $60

Answer: You will spend $60.
```

## ReAct의 장점

1. **투명성**: 모델의 추론 과정이 명확함
2. **정확성**: 각 단계에서 외부 도구를 사용할 수 있어 정확도 향상
3. **복잡성 처리**: 다단계 작업을 체계적으로 해결
4. **오류 수정**: 각 단계에서 오류를 감지하고 수정 가능
5. **확장성**: 새로운 도구를 쉽게 추가할 수 있음

## ReAct의 실무 활용

### 에이전트 시스템에서의 활용

ReAct는 AI 에이전트 시스템에서 매우 효과적입니다:

- **질의응답**: 웹에서 정보를 검색하며 답변 생성
- **작업 계획**: 목표를 달성하기 위한 단계별 계획 수립
- **문제 해결**: 복잡한 문제를 체계적으로 분석
- **데이터 분석**: 데이터베이스 쿼리 및 분석 수행

### 도구와의 통합

ReAct는 다양한 외부 도구와 통합될 수 있습니다:

- 검색 엔진 (Google, Bing 등)
- 계산 도구
- 데이터베이스
- API 호출
- 프로그래밍 실행 환경

## ReAct와 다른 기법의 비교

| 기법 | 특징 | 적합한 작업 |
|-----|------|----------|
| CoT | 추론 단계만 | 순수 추론 문제 |
| ReAct | 추론 + 행동 | 도구 필요한 작업 |
| 퓨샷 | 예시 기반 | 패턴 학습 |
| 에이전트 | 자율적 의사결정 | 복잡한 다단계 작업 |

## 구현 시 주의사항

1. **도구 가용성**: 필요한 도구가 실제로 사용 가능해야 함
2. **오류 처리**: 도구 호출 실패 시 대체 방안 필요
3. **비용**: 여러 단계의 처리로 인한 비용 증가
4. **속도**: 각 단계마다 모델 호출이 필요해 속도 저하 가능

---

## 핵심 개념

- 추론과 행동의 결합: 생각하고 행동하는 반복 프로세스
- 도구 사용: 외부 도구를 통한 능력 확장
- 단계별 실행: 복잡한 작업을 작은 단계로 분해
- 피드백 루프: 각 단계의 결과를 다음 단계에 반영
- 투명성: 모든 추론 과정이 명시적으로 표현됨

## 왜 중요한가

ReAct는 LLM의 능력을 외부 도구와 결합하여, 순수 언어 모델만으로는 불가능한 작업을 수행 가능하게 합니다. 이는 실제 응용에서 매우 중요한 패러다임이며, 현대적 AI 에이전트 시스템의 기초가 됩니다.

## 시험 포인트

- ReAct의 기본 사이클 이해
- 도구 호출의 적절한 시기
- 사고의 연쇄와의 차이점
- 에이전트 시스템에서의 역할
- 오류 처리 전략
- 실제 구현의 복잡성
