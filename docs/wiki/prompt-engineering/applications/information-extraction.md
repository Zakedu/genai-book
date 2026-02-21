# 정보 추출

정보 추출은 비구조화된 텍스트에서 필요한 데이터를 자동으로 추출합니다. 이력서, 계약서, 뉴스 기사 등에서 핵심 정보를 빠르게 추출할 수 있습니다.

## 핵심 개념

### 1. 정보 추출의 유형

#### 엔터티 추출 (Named Entity Recognition, NER)
텍스트에서 사람, 회사, 장소, 날짜 등 특정 유형의 정보를 추출합니다.

**예시**:
- 뉴스: "삼성전자의 CEO 이재용이 서울에서 발표했다"
  → 회사: 삼성전자, 인물: 이재용, 장소: 서울

#### 관계 추출 (Relation Extraction)
엔터티들 사이의 관계를 추출합니다.

**예시**:
- "John은 Apple의 CEO이다"
  → (John, CEO_OF, Apple)

#### 구조화된 정보 추출
비구조화된 텍스트를 구조화된 형식(JSON, Table)으로 변환합니다.

**예시**:
- 이력서 → JSON: {name, education, experience, skills}
- 계약서 → Table: {항목, 내용, 기한, 담당자}

### 2. 추출 정확도를 결정하는 요소

**1. 스키마 정의 (Schema Definition)**
- 추출할 필드를 명확히 정의
- 각 필드의 형식 지정

**2. 예시 제공 (Examples)**
- Few-shot learning으로 정확도 향상
- 경계선 사례 포함

**3. 출력 형식 (Output Format)**
- JSON, CSV, XML 등 명시
- 필수/선택 필드 구분

### 3. 정보 추출의 활용

| 분야 | 사용 사례 | 효과 |
|------|----------|------|
| **인사/채용** | 이력서 파싱, 자동 합격선 판정 | 시간 90% 단축 |
| **법무** | 계약서 핵심 조항 추출, 위험 조항 탐지 | 검토 시간 70% 단축 |
| **재무** | 인보이스, 영수증 데이터 추출 | 오류율 95% 감소 |
| **뉴스/미디어** | 기사에서 핵심 정보 추출, 자동 태깅 | 편집 시간 50% 단축 |
| **고객 관리** | 문의에서 주요 내용 추출 | 대응 속도 3배 향상 |

## 실무 활용 예제

### 예제 1: 이력서 정보 추출

#### 상황
채용 담당자가 100개의 이력서를 처리해야 합니다.
각 이력서에서 핵심 정보를 JSON으로 추출하려고 합니다.

#### 프롬프트

```
당신은 채용 정보 처리 시스템입니다.

다음 이력서에서 정보를 추출하여 JSON 형식으로 반환해주세요.

【추출 항목】
- 이름 (name)
- 나이 (age) - 없으면 null
- 최종학력 (education): {학교명, 전공, 졸업년도}
- 경력사항 (experiences): 배열, 각각 {회사명, 직급, 기간, 주요업무}
- 기술스택 (skills): 배열
- 자격증 (certifications): 배열, 없으면 빈 배열

【출력 형식】
JSON 형식, 한국어 필드명 사용

이력서:
---
[이력서 전문을 여기에 붙여넣기]
---

결과 JSON을 제시해주세요.
```

#### 예상 응답

```json
{
  "name": "김태희",
  "age": 32,
  "education": {
    "school": "서울대학교",
    "major": "컴퓨터공학",
    "graduation_year": 2014
  },
  "experiences": [
    {
      "company": "삼성전자",
      "position": "선임 엔지니어",
      "duration": "2018년 3월 - 2023년 12월",
      "main_tasks": [
        "AI 칩셋 개발",
        "팀 리더십 (7명 팀 관리)",
        "기술 문서화"
      ]
    },
    {
      "company": "네이버",
      "position": "주임 개발자",
      "duration": "2014년 7월 - 2018년 2월",
      "main_tasks": [
        "검색 알고리즘 개선",
        "성능 최적화 (응답시간 30% 단축)"
      ]
    }
  ],
  "skills": [
    "Python",
    "C++",
    "CUDA",
    "Machine Learning",
    "Leadership"
  ],
  "certifications": [
    "AWS Solutions Architect",
    "TensorFlow Developer Certificate"
  ]
}
```

### 예제 2: 계약서 핵심 조항 추출

#### 프롬프트

```
당신은 법무팀의 계약 분석 도구입니다.

다음 계약서에서 핵심 조항과 위험 요소를 추출해주세요.

【추출 항목】
1. 기본 정보
   - 계약 당사자 (company_a, company_b)
   - 계약명 (contract_name)
   - 계약 기간 (start_date, end_date, duration)
   - 계약금액 (amount, currency)

2. 주요 조항
   - 계약 내용 (scope)
   - 결제 조건 (payment_terms)
   - 배송/납기 조건 (delivery_terms)
   - 지연 페널티 (penalty_terms)

3. 위험 요소
   - 불리한 조항 (unfavorable_clauses): 배열
   - 위험도 평가 (risk_level): HIGH/MEDIUM/LOW
   - 개선 권장사항 (recommendations): 배열

【출력 형식】
JSON 형식

계약서:
---
[계약서 전문을 여기에 붙여넣기]
---

분석 결과를 JSON으로 제시해주세요.
```

#### 예상 응답 (부분)

```json
{
  "basic_info": {
    "contract_name": "소프트웨어 개발 용역 계약",
    "company_a": "A 솔루션",
    "company_b": "B 회사",
    "contract_date": "2024년 1월 15일",
    "duration": "12개월",
    "amount": "500,000,000원",
    "currency": "KRW"
  },
  "key_clauses": {
    "scope": "B 회사의 전사 ERP 시스템 개발",
    "payment_terms": "계약금 30%, 완성금 70% (완료 후 30일 내 지급)",
    "delivery_terms": "12개월 이내 완료, 지연 시마다 월 2% 페널티",
    "penalty_terms": "계약금 전액 환수 + 손해배상금"
  },
  "risk_assessment": {
    "risk_level": "HIGH",
    "unfavorable_clauses": [
      "지연 페널티가 과도함 (월 2%는 업계 표준 1%보다 높음)",
      "A 솔루션의 책임 범위가 명확하지 않음",
      "B 회사의 변경 요청에 대한 추가비용 조항 없음"
    ],
    "recommendations": [
      "지연 페널티를 월 1%로 협상하기",
      "변경요청에 대한 추가 비용 조항 추가",
      "장비/라이선스 제공 책임 명확히 하기"
    ]
  }
}
```

### 예제 3: 뉴스 기사 정보 추출

#### 프롬프트

```
당신은 뉴스 자동 태깅 시스템입니다.

다음 뉴스 기사에서 핵심 정보를 추출해주세요.

【추출 항목】
1. 기본 정보
   - 제목 (title)
   - 발행일 (publish_date)
   - 출처 (source)

2. 엔터티
   - 인물 (people): {이름, 직책/역할}
   - 조직 (organizations): {이름, 산업}
   - 장소 (locations): {도시, 국가}

3. 내용 분석
   - 주요 사건 (key_events): 배열
   - 영향도 (impact): HIGH/MEDIUM/LOW
   - 관련 주제 (topics): 배열

【출력 형식】
JSON 형식

기사:
---
[뉴스 기사 전문을 여기에 붙여넣기]
---
```

#### 예상 응답 (부분)

```json
{
  "basic_info": {
    "title": "삼성전자, AI칩 신제품 공개",
    "publish_date": "2024년 2월 20일",
    "source": "뉴스통신사"
  },
  "entities": {
    "people": [
      {
        "name": "이재용",
        "role": "삼성전자 회장"
      },
      {
        "name": "유영호",
        "role": "반도체 사업부 사장"
      }
    ],
    "organizations": [
      {
        "name": "삼성전자",
        "industry": "반도체, 전자기기"
      },
      {
        "name": "NVIDIA",
        "industry": "AI칩 제조"
      }
    ],
    "locations": [
      {
        "city": "서울",
        "country": "한국"
      },
      {
        "city": "실리콘밸리",
        "country": "미국"
      }
    ]
  },
  "content_analysis": {
    "key_events": [
      "삼성전자가 고성능 AI칩 공개",
      "NVIDIA와 협력 강화",
      "내년 양산 목표"
    ],
    "impact": "HIGH",
    "topics": [
      "AI",
      "반도체",
      "삼성전자",
      "신제품"
    ]
  }
}
```

### 예제 4: 고객 문의 내용 분류 및 추출

#### 프롬프트

```
당신은 고객 지원팀의 자동 분류 시스템입니다.

고객의 이메일 내용을 분석하여 정보를 추출해주세요.

【추출 항목】
1. 분류 정보
   - 문의 유형 (category): 상품불량/배송문제/A/S/환불요청/기타
   - 우선순위 (priority): HIGH/MEDIUM/LOW
   - 감정 (sentiment): 긍정/중립/부정

2. 고객 정보
   - 고객명 (customer_name)
   - 주문번호 (order_id) - 없으면 null
   - 구매 제품 (product_name)

3. 주요 내용
   - 문제 설명 (issue_description)
   - 요청사항 (requested_action)
   - 첨부 증거 (attachments): 있으면 배열

4. 대응 정보
   - 추천 부서 (recommended_dept)
   - 예상 처리 시간 (estimated_resolution_time)

기고객 이메일:
---
[이메일 전문을 여기에 붙여넣기]
---

분석 결과를 JSON으로 제시해주세요.
```

#### 예상 응답 (부분)

```json
{
  "classification": {
    "category": "상품불량",
    "priority": "HIGH",
    "sentiment": "부정"
  },
  "customer_info": {
    "customer_name": "박민수",
    "order_id": "2024020015623",
    "product_name": "프리미엄 무선이어폰 XZ-Pro"
  },
  "issue_details": {
    "issue_description": "왼쪽 이어폰에서 소리가 나오지 않음. 3일 전 구매했고, 배터리도 충분함. 여러 번 리셋 시도했으나 해결 안 됨.",
    "requested_action": "교환 또는 환불",
    "attachments": ["불량품_사진.jpg", "영수증.pdf"]
  },
  "response_plan": {
    "recommended_dept": "A/S팀",
    "estimated_resolution_time": "24시간 내 연락 및 48시간 내 교환"
  }
}
```

### 예제 5: 회의록에서 액션 아이템 추출

#### 프롬프트

```
당신은 회의 관리 도구입니다.

회의록에서 실행 과제(Action Items)를 추출해주세요.

【추출 항목】
각 액션 아이템:
- 항목ID (id): AI1, AI2, ...
- 담당자 (owner)
- 과제 내용 (task)
- 완료 기한 (due_date)
- 우선순위 (priority): P0/P1/P2
- 관련 주제 (related_topics): 배열
- 선행 조건 (dependencies): 다른 항목의 ID 참조

【출력 형식】
JSON 형식 배열

회의록:
---
[회의록을 여기에 붙여넣기]
---

각 액션 아이템을 추출하여 JSON으로 제시해주세요.
```

#### 예상 응답

```json
{
  "meeting_info": {
    "date": "2024년 2월 20일",
    "title": "Q1 마케팅 전략 회의",
    "attendees": ["마케팅팀장", "소셜미디어담당자", "콘텐츠담당자"]
  },
  "action_items": [
    {
      "id": "AI1",
      "owner": "김민지",
      "task": "SNS 광고 예산 증액 계획안 작성",
      "due_date": "2024년 2월 27일",
      "priority": "P0",
      "related_topics": ["마케팅", "SNS", "예산"],
      "dependencies": []
    },
    {
      "id": "AI2",
      "owner": "이순신",
      "task": "신제품 론칭 마케팅 타임라인 수립",
      "due_date": "2024년 3월 5일",
      "priority": "P0",
      "related_topics": ["론칭", "마케팅", "제품"],
      "dependencies": ["AI3"]
    },
    {
      "id": "AI3",
      "owner": "박지원",
      "task": "제품 스펙시트 최종 확인",
      "due_date": "2024년 2월 28일",
      "priority": "P0",
      "related_topics": ["제품", "사양"],
      "dependencies": []
    },
    {
      "id": "AI4",
      "owner": "마케팅팀",
      "task": "인플루언서 협업 업체 3곳 선정",
      "due_date": "2024년 3월 10일",
      "priority": "P1",
      "related_topics": ["인플루언서", "협업"],
      "dependencies": ["AI1"]
    }
  ]
}
```

## 💡 실전 팁

!!! tip "정확한 정보 추출 프롬프트"

    1. **스키마 명확화**: 추출할 필드를 모두 나열
       ```
       예시) fields: [name, email, phone, company, position]
       ```

    2. **타입 지정**: 각 필드의 데이터 타입
       ```
       - name: string
       - age: integer (nullable)
       - skills: array of strings
       ```

    3. **예시 포함**: 원하는 출력 형식의 예시
       ```
       Example:
       {"name": "John Doe", "email": "john@example.com"}
       ```

    4. **누락 처리**: 정보가 없을 때의 규칙
       ```
       "If information is missing, use null"
       "If unclear, mark with [UNCLEAR]"
       ```

    5. **값 선택지**: 정해진 값만 선택
       ```
       priority: only "HIGH", "MEDIUM", "LOW"
       ```

!!! tip "대량 정보 추출"

    **배치 처리**:
    ```
    여러 문서를 한 번에 처리하려면:
    문서1... [END_DOCUMENT]
    문서2... [END_DOCUMENT]
    문서3... [END_DOCUMENT]

    위 3개 문서에서 정보를 추출하여
    JSON 배열로 반환해주세요.
    ```

!!! tip "검증 및 오류 처리"

    - 추출된 정보 검증율 측정
    - 자신도가 낮은 항목 별도 플래깅
    - 정기적인 샘플 검증 (10%)

## 성능 최적화

| 상황 | 추천 방법 | 정확도 |
|------|----------|--------|
| 구조화된 문서 | 명확한 스키마 | 95% |
| 비구조화 텍스트 | Few-shot 예시 | 85-90% |
| 복잡한 관계 | Chain-of-Thought | 80-85% |
| 도메인 특화 | Fine-tuning | 92-98% |

## 📝 핵심 정리

| 항목 | 내용 |
|------|------|
| **핵심 기능** | 엔터티 추출, 관계 추출, 구조화 변환 |
| **장점** | 자동화, 빠른 처리, 높은 정확도 |
| **주의사항** | 스키마 명확화, 검증 필수, 개인정보 보호 |
| **프롬프트 팁** | 명확한 스키마, 타입 지정, 예시 포함 |
| **정확도** | Zero-shot 80% → Few-shot 90% → Fine-tuning 95%+ |
| **활용 분야** | 채용, 법무, 재무, 뉴스, 고객 관리 |
