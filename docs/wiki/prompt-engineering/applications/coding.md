# 코드 생성을 위한 LLM

LLM을 활용한 코드 생성은 개발 생산성을 크게 향상시킵니다. 이 섹션에서는 코드 스니펫 생성, SQL 쿼리 생성, 디버깅, 리팩토링 등의 실무 사례를 다룹니다.

## 핵심 개념

### 1. 코드 생성의 기본 원리

LLM은 학습 데이터의 코드 예제를 바탕으로 다음과 같은 작업을 수행합니다:

- **코드 스니펫 생성**: 특정 기능을 수행하는 함수나 클래스 작성
- **SQL 쿼리 생성**: 자연어 설명으로부터 데이터베이스 쿼리 자동 작성
- **디버깅**: 에러 메시지를 분석하여 해결책 제시
- **리팩토링**: 기존 코드를 더 깔끔하고 효율적으로 개선
- **코드 해석**: 복잡한 코드를 쉬운 언어로 설명

### 2. 효과적인 코드 생성 프롬프트 작성

코드 생성 시 다음 요소들이 중요합니다:

- **언어 명시**: Python, JavaScript, SQL 등 명확하게 지정
- **라이브러리/프레임워크 지정**: pandas, numpy, Django 등
- **컨텍스트 제공**: 입력/출력 형식, 예시 데이터
- **제약조건 명시**: 성능 요구사항, 호환성 버전

### 3. 생성된 코드 검증

LLM이 생성한 코드는 항상 검증이 필요합니다:

- 문법 오류 확인
- 로직 검증 (edge case 처리)
- 보안 취약점 확인
- 성능 최적화 검토

## 실무 활용 예제

### 예제 1: Python 데이터 분석 코드 생성

#### 상황
고객 데이터 CSV 파일에서 월별 판매액을 집계하고 시각화해야 합니다.

#### 프롬프트

```
당신은 Python 데이터 분석 전문가입니다.

다음 작업을 수행하는 Python 코드를 작성해주세요:

1. 'sales_data.csv' 파일 읽기 (컬럼: date, product, amount)
2. 월별 판매액 집계
3. 월별 판매액을 line plot으로 시각화
4. 월별 매출 통계 출력 (평균, 최대, 최소값)

요구사항:
- pandas, matplotlib 사용
- 날짜 형식: YYYY-MM-DD
- 한글 폰트 지원 필수
- 코드에 주석 추가

결과 코드 전체를 제시해주세요.
```

#### 예상 응답
```python
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

# 한글 폰트 설정
plt.rcParams['font.family'] = 'DejaVu Sans'

# 데이터 읽기
df = pd.read_csv('sales_data.csv')

# 날짜 열을 datetime으로 변환
df['date'] = pd.to_datetime(df['date'])

# 월별로 그룹화하여 판매액 집계
df['year_month'] = df['date'].dt.to_period('M')
monthly_sales = df.groupby('year_month')['amount'].sum()

# 통계 출력
print("월별 판매액 통계:")
print(f"평균: {monthly_sales.mean():.2f}")
print(f"최대: {monthly_sales.max():.2f}")
print(f"최소: {monthly_sales.min():.2f}")

# 시각화
plt.figure(figsize=(12, 6))
monthly_sales.plot(kind='line', marker='o')
plt.title('월별 판매액 추이')
plt.xlabel('기간')
plt.ylabel('판매액 (원)')
plt.grid(True)
plt.tight_layout()
plt.show()
```

### 예제 2: 에러 디버깅

#### 상황
다음 코드에서 KeyError가 발생합니다:

```python
data = {'name': 'John', 'age': 30}
print(data['email'])  # KeyError
```

#### 프롬프트

```
다음 Python 코드에서 KeyError가 발생합니다:

```python
data = {'name': 'John', 'age': 30}
print(data['email'])
```

이 에러의 원인을 설명하고 3가지 해결 방법을 코드 예시와 함께 제시해주세요.
```

#### 예상 응답

**원인**: 딕셔너리에 'email' 키가 없는데 접근하려고 시도했습니다.

**해결 방법 1: .get() 메서드 사용 (권장)**
```python
data = {'name': 'John', 'age': 30}
email = data.get('email', '정보 없음')
print(email)  # 정보 없음
```

**해결 방법 2: 조건문으로 확인**
```python
if 'email' in data:
    print(data['email'])
else:
    print('이메일 정보가 없습니다')
```

**해결 방법 3: 예외 처리 (try-except)**
```python
try:
    print(data['email'])
except KeyError:
    print('해당 키가 존재하지 않습니다')
```

### 예제 3: 코드 리팩토링

#### 상황
아래의 비효율적인 코드를 개선해야 합니다.

#### 프롬프트

```
다음 Python 코드를 리팩토링해주세요. 코드의 가독성과 성능을 개선하고,
주석을 추가하여 설명해주세요.

```python
def process_data(data):
    result = []
    for i in range(len(data)):
        if data[i] % 2 == 0:
            result.append(data[i] * 2)
    return result
```

리팩토링된 코드와 개선사항을 설명해주세요.
```

#### 예상 응답

**개선 버전 1: List Comprehension 활용**
```python
def process_data(data):
    """짝수에만 2를 곱하여 반환하는 함수"""
    return [num * 2 for num in data if num % 2 == 0]

# 사용 예
result = process_data([1, 2, 3, 4, 5, 6])
# 출력: [4, 8, 12]
```

**개선 버전 2: 함수형 프로그래밍**
```python
from functools import reduce

def process_data(data):
    """filter와 map을 조합하여 더 함수형으로 작성"""
    return list(map(lambda x: x * 2, filter(lambda x: x % 2 == 0, data)))
```

**개선사항**:
- List comprehension은 for-append보다 3배 빠름
- 인덱스 기반 접근 제거 (더 Pythonic)
- 코드 길이 단축으로 가독성 향상
- 타입 힌트 추가 가능

### 예제 4: SQL 쿼리 생성

#### 상황
회사의 고객 관리 데이터베이스에서 복잡한 분석 쿼리가 필요합니다.

#### 프롬프트

```
MySQL 데이터베이스에서 다음 요청을 충족하는 SQL 쿼리를 작성해주세요.

테이블 구조:
- customers (id, name, email, registration_date)
- orders (id, customer_id, order_date, total_amount)
- order_items (id, order_id, product_id, quantity, unit_price)

요청:
2023년 이후에 가입한 고객 중에서 총 구매액이 1,000,000원 이상인
고객의 이름, 이메일, 가입일, 총 구매액, 구매 횟수를 조회해주세요.
결과는 총 구매액 기준으로 내림차순으로 정렬해주세요.

SQL 쿼리 전체를 제시해주세요.
```

#### 예상 응답

```sql
SELECT
    c.id,
    c.name,
    c.email,
    c.registration_date,
    SUM(o.total_amount) as total_purchase_amount,
    COUNT(DISTINCT o.id) as order_count
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE c.registration_date >= '2023-01-01'
GROUP BY c.id, c.name, c.email, c.registration_date
HAVING SUM(o.total_amount) >= 1000000
ORDER BY total_purchase_amount DESC;
```

### 예제 5: 함수 작성 (명확한 스펙 제공)

#### 프롬프트

```
Python 함수를 작성해주세요.

함수 이름: calculate_bmi
기능: 키(cm)와 몸무게(kg)를 받아서 BMI를 계산하고 판정을 반환
입력: height (cm), weight (kg)
출력: {'bmi': float, 'category': str}

BMI 판정:
- 18.5 미만: '저체중'
- 18.5 이상 23 미만: '정상'
- 23 이상 25 미만: '과체중'
- 25 이상 30 미만: '비만'
- 30 이상: '고도비만'

에러 처리, 타입 힌트, docstring을 포함해주세요.
```

#### 예상 응답

```python
def calculate_bmi(height: float, weight: float) -> dict:
    """
    키와 몸무게로부터 BMI를 계산합니다.

    Args:
        height: 키 (cm)
        weight: 몸무게 (kg)

    Returns:
        {'bmi': float, 'category': str}

    Raises:
        ValueError: 입력값이 유효하지 않을 경우
    """
    if height <= 0 or weight <= 0:
        raise ValueError("키와 몸무게는 0보다 커야 합니다.")

    height_m = height / 100  # cm를 m로 변환
    bmi = weight / (height_m ** 2)

    if bmi < 18.5:
        category = '저체중'
    elif bmi < 23:
        category = '정상'
    elif bmi < 25:
        category = '과체중'
    elif bmi < 30:
        category = '비만'
    else:
        category = '고도비만'

    return {'bmi': round(bmi, 2), 'category': category}

# 테스트
print(calculate_bmi(170, 65))  # {'bmi': 22.49, 'category': '정상'}
```

## 💡 실전 팁

!!! tip "코드 생성 시 주의사항"

    1. **명확한 요구사항**: "더 나은 코드"보다 "O(n) 시간복잡도 내에 정렬"처럼 구체적으로 작성

    2. **컨텍스트 제공**: 라이브러리 버전, 파이썬 버전, 기타 제약조건을 명시

    3. **단계별 요청**: 한 번에 여러 기능을 요청하기보다 단계적으로 진행

    4. **검증 필수**: 생성된 코드는 반드시 테스트하고 보안 검토

    5. **리뷰 요청**: "이 코드의 문제점을 지적해주세요"라는 2차 프롬프트 활용

!!! tip "효율적인 디버깅"

    - 에러 메시지 전체를 복사-붙여넣기
    - 관련 코드와 스택 트레이스 함께 제공
    - "왜 이런 에러가 발생했는가"에 초점
    - 여러 해결책 중 "가장 권장되는 방법은?"이라고 추가 질문

## 비용 최적화

- **Claude 4.6 Sonnet**: 일반적인 코드 생성에 최적 (빠르고 저비용)
- **GPT-5.4**: 매우 복잡한 알고리즘이 필요할 때
- **Gemini 2.5 Pro**: 다국어 코드 생성, 특히 한글 변수명 처리

## 📝 핵심 정리

| 항목 | 내용 |
|------|------|
| **핵심 기능** | 코드 생성, 디버깅, 리팩토링, SQL 쿼리 생성 |
| **효과** | 개발 시간 40-60% 단축, 코드 품질 향상 |
| **주의사항** | 생성 코드는 항상 검증 필수, 보안 리뷰 필요 |
| **프롬프트 팁** | 명확한 요구사항, 컨텍스트, 제약조건 제시 |
| **최적 모델** | Claude (일반), GPT-5.4 (복잡도), Gemini (다국어) |
| **추가 활용** | 테스트 코드 생성, API 문서화, 코드 주석 작성 |
