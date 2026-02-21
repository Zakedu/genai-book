# ReAct Framework

## 개념

ReAct(Reasoning + Acting)는 Yao et al. (2022)가 제안한 프레임워크로, **추론(Reasoning)과 행동(Acting)을 번갈아 가며 수행하여 외부 도구와 정보를 활용하면서 복잡한 문제를 해결**하는 방식입니다.

## 기본 아이디어

### 전통적인 접근의 한계

Chain-of-Thought는 **사고만 하고 행동하지 않습니다**:
- 내부 지식에만 의존
- 실시간 정보 활용 불가
- 계산 오류 발생 가능
- 최신 정보 부재

### ReAct의 혁신

```
전통적 CoT:     생각 → 생각 → 생각 → 답변
ReAct 방식:     생각 → 행동 → 관찰 → 생각 → 행동 → ...
```

## Yao et al. (2022) 프레임워크

### 핵심 루프

```
1. Thought (생각)
   현재 상태 분석, 다음 행동 결정

2. Action (행동)
   외부 도구나 정보 소스에 접근
   - 웹 검색
   - 계산기 사용
   - 데이터베이스 조회
   - API 호출

3. Observation (관찰)
   행동의 결과 수집

4. 다시 반복
   새로운 정보를 바탕으로 다음 행동 결정
```

### 루프 다이어그램

```
┌─────────────────────────────────┐
│   Thought: 현재 상태 분석        │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│   Action: 도구 사용/정보 검색    │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│   Observation: 결과 수집         │
└────────────┬────────────────────┘
             ↓
       (조건 확인)
        ↙       ↘
    완료됨      아직 불완전
       ↓         ↓
    답변    Thought로 돌아가기
```

## 지식 집약적 작업 vs 의사결정 작업

### 지식 집약적 작업 (Knowledge-Intensive Tasks)

외부 정보가 필수적인 작업:

**예제 1: 최신 뉴스 요약**

```
Thought: 2026년 2월의 최신 기술 뉴스를 찾아야 한다.
Action: search("2026년 2월 기술 뉴스")
Observation: [검색 결과 10개 반환]
Thought: 가장 관련성 있는 3개 기사를 자세히 본다.
Action: fetch_article("기사1 URL")
Observation: [기사 내용]
Action: fetch_article("기사2 URL")
Observation: [기사 내용]
...
Thought: 수집한 정보를 종합하여 요약한다.
```

**예제 2: 제품 가격 비교**

```
Thought: 노트북 가격을 비교해야 한다.
Action: search_price("삼성 노트북 2026")
Observation: A쇼핑몰 150만원, B쇼핑몰 145만원...
Thought: 배송료와 AS를 포함한 전체 비용을 계산해야 한다.
Action: get_details("B쇼핑몰 배송료")
Observation: 배송료 5000원 무료 배송 조건 100만원 이상
...
```

### 의사결정 작업 (Decision-Making Tasks)

올바른 판단과 분석이 필수적인 작업:

**예제: 투자 의사결정**

```
Thought: 회사 A에 투자할지 판단해야 한다.
Action: analyze_financials("Company A 2025 earnings")
Observation: 수익 증가율 15%, 부채 비율 45%
Thought: 경쟁사와 비교 분석이 필요하다.
Action: analyze_competitors("동일 업종 회사들 2025")
Observation: 산업 평균 수익 증가율 10%
Thought: 위험 요소를 평가한다.
Action: assess_risks("Company A 시장 위험")
Observation: 시장 변동성, 규제 위험 등...
Thought: 종합 분석 결과를 토대로 판단한다.
```

## 실전 예제

### 1. 한국 정보 검색 + 추론

```
프롬프트:
당신은 한국 관광 정보 시스템입니다.
다음 질문을 ReAct 방식으로 해결하세요.

질문: 서울에서 볼 수 있는 벚꽃 명소는 어디이고, 
2026년 예상 만개 시기는 언제입니까?

Thought: 서울의 벚꽃 명소와 2026년 개화 예측을 찾아야 한다.

Action: search_korean_database("서울 벚꽃 명소")
Observation: 여의도 공원, 남산, 덕수궁, 한강공원 등이 주요 명소

Action: search("2026년 서울 벚꽃 개화 예측")
Observation: 기상청 예측에 따르면 2026년 서울 벚꽃 개화는 
3월 28일~4월 5일 예상

Thought: 각 명소의 특징과 함께 정보를 정리한다.

최종 답변:
1. 여의도 공원: 도시 공원 중 가장 많은 벚꽃
2. 남산: 서울 시내를 배경으로 한 벚꽃
3. 덕수궁: 전통 궁궐 배경의 벚꽃
예상 개화: 2026년 3월 28일~4월 5일
```

### 2. 다단계 문제 해결

```
프롬프트:
당신은 수학 튜터입니다.
다음 문제를 ReAct 방식으로 풀어주세요.

문제: 서울에서 대구까지 기차 요금은 어떻게 되고,
편도 요금으로 왕복할 경우 총 비용은?

Thought: 현재 서울-대구 기차 요금을 찾아야 한다.

Action: search("KTX 서울 대구 요금 2026년")
Observation: KTX 일반석 58,000원

Thought: 이제 왕복 비용을 계산한다.

Action: calculate(58000 * 2)
Observation: 116,000원

Thought: 혹시 할인 정보가 있는지 확인해보자.

Action: search("KTX 왕복 할인 2026년")
Observation: 왕복 구매 시 5% 할인 가능

Thought: 할인을 적용한 최종 가격을 계산한다.

Action: calculate(58000 * 2 * 0.95)
Observation: 110,200원

최종 답변: 왕복 기차 요금은 일반 가격 116,000원이며,
5% 할인 적용 시 110,200원입니다.
```

### 3. 한국 음식 관련 정보 검색

```
프롬프트:
당신은 한국 음식 전문가입니다.
다음을 ReAct 방식으로 해결하세요.

질문: 전주 비빔밥의 특징은 무엇이고, 
정통 레시피의 주요 재료는 무엇입니까?

Thought: 전주 비빔밥의 특징과 레시피를 찾아야 한다.

Action: search_korean_food("전주 비빔밥 특징")
Observation: 전주 비빔밥은 산채를 많이 사용하고 
고추장양념이 특징

Action: search_recipe("전주 비빔밥 정통 레시피")
Observation: 주요 재료는 소고기, 계란, 고추장, 
도라지, 숙주, 고구마, 버섯 등

최종 답변:
특징: 산채의 신선함과 맛, 진한 고추장 양념
주요 재료: 소고기, 달걀, 도라지, 숙주, 고구마, 
표고버섯, 고추장, 참기름
```

## 외부 도구와의 통합

### 활용 가능한 도구

```
도구 종류                 예제
─────────────────────────────────
검색 엔진              Google Search
정보 시스템            Wikipedia API
계산기                 Calculator
데이터베이스           SQL Database
웹 스크래핑            BeautifulSoup
API 호출               Weather API, Stock API
코드 실행              Python REPL
```

### 도구 통합 예제

```python
def react_agent(question):
    thought = analyze_question(question)
    
    while not is_complete(thought):
        action = decide_action(thought)
        
        if action['type'] == 'search':
            observation = search(action['query'])
        elif action['type'] == 'calculate':
            observation = calculate(action['expression'])
        elif action['type'] == 'fetch':
            observation = fetch_url(action['url'])
        else:
            observation = execute_tool(action)
        
        thought = update_thought(thought, observation)
    
    return generate_answer(thought)
```

## CoT와 ReAct 비교

| 특성 | Chain-of-Thought | ReAct |
|------|-----------------|-------|
| 추론만 사용 | 예 | 아니오 |
| 외부 도구 | 불가 | 가능 |
| 최신 정보 | 제한적 | 가능 |
| 복잡한 작업 | 약함 | 우수 |
| 계산 정확도 | 낮음 | 높음 |
| 구현 복잡도 | 낮음 | 높음 |
| 반복 가능성 | 제한적 | 높음 |

## 💡 실전 팁

!!! tip "효과적인 ReAct 프롬프트"
    1. **명확한 루프 구조**: Thought → Action → Observation 반복 명시
    2. **도구 명시**: 사용 가능한 도구 목록 제공
    3. **종료 조건**: "충분한 정보를 수집했을 때 답변하세요" 명시
    4. **형식 일관성**: 매번 같은 형식 사용
    5. **관찰 통합**: 각 관찰을 다음 생각에 명시적으로 반영

!!! example "ReAct 프롬프트 템플릿"
    ```
    당신은 [역할]입니다.
    다음 도구를 사용할 수 있습니다:
    - search(query): 정보 검색
    - calculate(expr): 계산
    - fetch(url): 웹 페이지 조회
    
    질문: [질문]
    
    Thought: [현재 상태 분석]
    Action: [도구 선택]
    Observation: [결과]
    Thought: [다음 단계 결정]
    ... (반복)
    
    최종 답변: [결론]
    ```

!!! warning "주의사항"
    - 무한 루프 방지: 최대 반복 횟수 정하기
    - 도구 오류: 검색 실패 등 예외 처리
    - 정보 신뢰성: 여러 소스에서 검증
    - 토큰 소비: ReAct는 많은 토큰 사용

## 📝 핵심 정리

- ReAct는 추론과 행동을 번갈아 수행하는 프레임워크
- Yao et al. (2022)가 제안하여 복잡한 작업에서 성능 향상 입증
- Thought → Action → Observation의 반복 루프
- 외부 도구와 정보를 활용하여 더 정확하고 신뢰할 수 있는 답변 제공
- 지식 집약적 작업과 의사결정 작업 모두에 효과적
- 웹 검색, 계산, 데이터베이스 조회 등 다양한 도구 통합 가능
- CoT보다 복잡하지만 더 강력한 결과 제공
- 대규모 프로젝트와 실전 응용 프로그램에 적극 권장
