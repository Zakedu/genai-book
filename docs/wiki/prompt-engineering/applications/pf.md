# 프롬프트 함수 (Prompt Functions)

프롬프트 함수는 반복 가능한 작업을 자동화하기 위해 프롬프트를 함수처럼 정의하고 재사용합니다. 같은 작업을 여러 번 해야 할 때 매우 효율적입니다.

## 핵심 개념

### 1. 프롬프트 함수란?

프롬프트 함수는 특정 작업을 수행하는 재사용 가능한 프롬프트입니다:

```
【프롬프트 함수의 구조】
function_name: [함수명]
input: [입력 파라미터]
rule: [작업 방식/규칙]

【호출 방식】
function_name(input_value)
```

**장점**:
- 일관된 결과
- 시간 절약
- 복잡한 작업 자동화
- 함수 조합으로 더 복잡한 워크플로우 구현

### 2. 프롬프트 함수의 구성 요소

**함수명 (Function Name)**: 짧고 기억하기 쉬운 이름
- 예: `summarize`, `classify`, `translate`, `extract`

**입력 (Input)**: 함수가 받을 파라미터
- 단일 입력: `text`
- 다중 입력: `text`, `language`, `format`

**규칙 (Rule)**: 입력을 처리하는 방식
- 역할 정의: “당신은 번역가입니다”
- 작업 정의: “텍스트를 번역해주세요”
- 제약사항: “한국어로 작성해주세요”

### 3. 프롬프트 함수 사용 패턴

| 패턴 | 예시 | 사용 경우 |
|------|------|----------|
| **단일 함수** | `summarize(article)` | 한 가지 작업 |
| **순차 함수** | `summarize(article)` → `translate(result)` | 여러 단계 |
| **함수 체이닝** | `translate(summarize(article))` | 파이프라인 |
| **파라미터 함수** | `classify(text, category_list)` | 유연한 실행 |

## 실무 활용 예제

### 예제 1: 번역 함수 정의 (한국어)

#### 프롬프트

```
안녕하세요! 저는 특정 함수를 정의하여 AI의 능력을 활용하려고 합니다.
이 형식으로 정의된 함수를 이해하고 사용해주세요.

【함수 정의 메타프롬프트】

function_name: [함수명]
input: [입력값]
rule: [작업 규칙]

이 형식으로 정의된 함수를 호출하면 규칙에 따라 처리해주세요.
호출 형식은 function_name(input_value)입니다.

이해하셨으면 “네”라고만 답해주세요.
```

#### 함수 정의

```
【함수 정의 1: 한영 번역】
function_name: [translate_ko2en]
input: [“text”]
rule: [당신은 프로 번역가입니다.
주어진 한국어 텍스트를 자연스러운 영어로 번역하세요.
기술용어는 원문 그대로 남기고,
격식 있는 표현을 사용해주세요.
번역문만 출력해주세요.]

【함수 정의 2: 요약】
function_name: [summarize]
input: [“text”]
rule: [주어진 텍스트를 간결하게 요약해주세요.
원본의 50% 길이 이내로 압축하고,
핵심 내용만 포함해주세요.
마크다운 bullet point 형식으로 출력해주세요.]

【함수 정의 3: 감정 분석】
function_name: [sentiment_analysis]
input: [“text”]
rule: [주어진 텍스트의 감정을 분석해주세요.
결과는 다음 형식으로:
{
  “sentiment”: “긍정/부정/중립”,
  “score”: 0-1 (확실도),
  “reason”: “분석 근거”
}]
```

#### 사용 예시

```
【함수 호출】

1. 단일 함수:
translate_ko2en('안녕하세요, 저는 AI 전문가입니다.')

2. 순차 함수:
summarize(translate_ko2en('이것은 매우 긴 한국어 문서입니다...'))

3. 체이닝:
sentiment_analysis(translate_ko2en('정말 좋은 제품입니다!'))
```

### 예제 2: 고객 지원 함수 시스템

#### 함수 정의

```
【고객 지원 자동화 함수 세트】

함수 1: 문의 분류
function_name: [classify_inquiry]
input: [“customer_message”]
rule: [고객 메시지의 유형을 분류해주세요.
카테고리: 배송문제/상품불량/반품/A/S/기타
결과: {category, priority(HIGH/MEDIUM/LOW)}
설명은 하지 말고 결과만 JSON으로 출력해주세요.]

함수 2: 자동 응답
function_name: [auto_response]
input: [“category”, “priority”]
rule: [주어진 카테고리와 우선순위에 맞는
표준 응답 메시지를 생성해주세요.
고객이 읽기 좋도록 친근한 톤으로 작성하고,
명확한 다음 단계를 제시해주세요.]

함수 3: 데이터 추출
function_name: [extract_details]
input: [“customer_message”]
rule: [고객 메시지에서 다음 정보를 추출해주세요:
- 주문 번호
- 제품명
- 문제 설명
- 요청사항

결과는 JSON 형식으로:
{
  “order_id”: “...”,
  “product”: “...”,
  “issue”: “...”,
  “request”: “...”
}]
```

#### 워크플로우

```
【자동 응답 워크플로우】

고객 문의 수신
  ↓
classify_inquiry(customer_message) → 분류 결과
  ↓
extract_details(customer_message) → 주문 정보
  ↓
auto_response(category, priority) → 답변 생성
  ↓
고객에게 자동 응답 발송
```

### 예제 3: 콘텐츠 작성 함수 파이프라인

#### 함수 정의

```
【콘텐츠 작성 함수】

함수 1: 아이디어 생성
function_name: [brainstorm]
input: [“topic”, “count”]
rule: [주어진 주제로 ${count}개의 창의적인 아이디어를 생성해주세요.
각 아이디어는 한 문장으로 표현하고,
다양한 각도에서의 접근을 포함해주세요.
bullet point 형식으로 출력해주세요.]

함수 2: 제목 생성
function_name: [generate_titles]
input: [“topic”, “style”]
rule: [주어진 주제로 5개의 매력적인 제목을 생성해주세요.
스타일: 클릭 유도(clickbait이 아닌)/정보성/신비로움
각 제목은 10단어 이내여야 합니다.
번호를 매겨서 출력해주세요.]

함수 3: 본문 초안
function_name: [draft_content]
input: [“title”, “target_length”, “tone”]
rule: [주어진 제목으로 본문 초안을 작성해주세요.
- 길이: ${target_length}단어
- 톤: ${tone}
- 구조: 소개 → 본론 → 결론
- 마크다운 형식으로 작성해주세요.]

함수 4: 편집
function_name: [edit]
input: [“text”, “style”]
rule: [텍스트를 ${style} 톤으로 편집해주세요.
- 문법과 맞춤법 확인
- 가독성 향상
- 불필요한 반복 제거
- 더 강력한 표현으로 수정
편집된 텍스트만 출력해주세요.]
```

#### 사용 시나리오

```
【시나리오: 블로그 글 작성】

Step 1: 아이디어 생성
brainstorm(“AI의 미래”, 5)

Step 2: 최고의 아이디어를 기반으로 제목 생성
generate_titles(“AI가 일자리를 빼앗을까?”, “신비로움”)

Step 3: 선택한 제목으로 본문 작성
draft_content(“AI 시대, 인간만이 할 수 있는 일은?”, 1000, “전문적이면서도 접근 가능한”)

Step 4: 최종 편집
edit(draft_content_result, “매력적이고 친근한”)
```

### 예제 4: 다중 파라미터 함수

#### 프롬프트

```
【다중 파라미터 함수 정의】

함수: 비밀번호 생성기
function_name: [generate_password]
input: [“length”, “uppercase”, “lowercase”, “numbers”, “special”]
rule: [다음 사양에 맞는 비밀번호를 생성해주세요:
- 길이: ${length}자
- 대문자: ${uppercase}개 포함
- 소문자: ${lowercase}개 포함
- 숫자: ${numbers}개 포함
- 특수문자: ${special}개 포함

생성된 비밀번호만 출력해주세요. 설명은 하지 말아주세요.]
```

#### 사용 예시

```
【함수 호출】

generate_password(length=12, uppercase=2, lowercase=6, numbers=2, special=2)
→ 예: Xy9$mP#kQw2L

generate_password(16, 3, 8, 3, 2)
→ 예: MnX9p$kL#vQ2wYz&B4
```

## 💡 실전 팁

!!! tip “효과적인 함수 설계”

    1. **명확한 함수명**: 기능을 한 단어로 표현
       ```
       ○ summarize, translate, classify
       × process_text_with_ai
       ```

    2. **제약사항 추가**: 원하지 않는 출력 방지
       ```
       “설명 없이 결과만 제시해주세요”
       “마크다운 형식으로 출력해주세요”
       “JSON 형식으로 반환해주세요”
       ```

    3. **테스트 후 저장**: 잘 작동하는 함수 저장
       - 노션, 옵시디언 등에 기록
       - 템플릿화하여 재사용
       - 버전 관리

    4. **함수 조합**: 복잡한 작업을 단순한 함수로 구성
       ```
       final_result = edit(draft_content(generate_titles(brainstorm(topic))))
       ```

    5. **기본값 설정**: 명시하지 않은 경우의 기본 동작
       ```
       tone: 미명시 시 “전문적이고 친근한”
       length: 미명시 시 “원본의 50%”
       ```

!!! tip “함수 문서화”

    ```
    함수 이름: summarize
    목적: 긴 텍스트를 간단히 요약
    입력: text (string)
    출력: summary (string)
    사용 예: summarize(“이것은 매우 긴 문서...”)
    주의사항: 원본 길이의 50% 이상 줄지 않음
    ```

## 프롬프트 함수 라이브러리 구축

### 추천 함수들

```
【텍스트 처리】
- translate (번역)
- summarize (요약)
- expand (확장)
- simplify (단순화)
- proofread (교정)

【데이터 처리】
- extract (추출)
- classify (분류)
- parse (파싱)
- normalize (정규화)

【창의적 작업】
- brainstorm (아이디어)
- generate (생성)
- refine (다듬기)

【분석】
- analyze_sentiment (감정 분석)
- analyze_tone (톤 분석)
- fact_check (사실 검증)
```

## 📝 핵심 정리

| 항목 | 내용 |
|------|------|
| **핵심 개념** | 재사용 가능한 프롬프트 템플릿 |
| **장점** | 일관성, 자동화, 효율성 향상 |
| **구성요소** | 함수명, 입력, 규칙 |
| **사용 패턴** | 단일/순차/체이닝 |
| **저장 방식** | 노션, 옵시디언, 깃허브 등 |
| **확장성** | 함수 조합으로 복잡한 작업 처리 |
| **활용 분야** | 콘텐츠 제작, 데이터 처리, 고객 지원 |
