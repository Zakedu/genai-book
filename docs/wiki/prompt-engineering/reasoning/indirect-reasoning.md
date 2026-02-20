# LLM을 활용한 간접 추론 (Indirect Reasoning with LLMs)

## 배경

[Zhang et al. (2024)](https://arxiv.org/abs/2402.03667)는 최근 LLM의 추론 능력을 강화하기 위한 간접 추론 방법을 제안했습니다. 이 방법은 대우(contrapositive)와 모순의 논리를 활용하여 사실 추론 및 수학적 증명과 같은 간접 추론(Indirect Reasoning, IR) 작업을 해결합니다. 두 가지 핵심 단계로 구성됩니다:

1) 데이터와 규칙을 증대하여(대우의 논리적 동치성) LLM의 이해 가능성을 강화
2) 모순에 의한 증명(proof by contradiction)을 기반으로 간접 추론을 구현하도록 LLM을 자극하는 프롬프트 템플릿 설계

GPT-3.5-turbo 및 Gemini-pro와 같은 LLM에 대한 실험에서 제안된 방법은 기존의 직접 추론 방법과 비교하여 사실 추론의 정확도를 27.33%, 수학적 증명을 31.43% 향상시켰습니다.

## 프롬프트 예시

모순에 의한 증명을 위한 영점 샷(zero-shot) 템플릿:

```
If a+|a|=0, try to prove that a<0.

Step 1: List the conditions and questions in the original proposition.

Step 2: Merge the conditions listed in Step 1 into one. Define it as wj.

Step 3: Let us think it step by step. Please consider all possibilities. If the intersection between wj (defined in Step 2) and the negation of the question is not empty at least in one possibility, the original proposition is false. Otherwise, the original proposition is true.

Answer:
```

## 코드 예시

### OpenAI GPT-4

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "user",
            "content": "If a+|a|=0, try to prove that a<0.\n\nStep 1: List the conditions and questions in the original proposition.\n\nStep 2: Merge the conditions listed in Step 1 into one. Define it as wj.\n\nStep 3: Let us think it step by step. Please consider all possibilities. If the intersection between wj (defined in Step 2) and the negation of the question is not empty at least in one possibility, the original proposition is false. Otherwise, the original proposition is true.\n\nAnswer:"
        }
    ],
    temperature=0,
    max_tokens=1000,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
)
```

## 참고 자료

- [Large Language Models as an Indirect Reasoner: Contrapositive and Contradiction for Automated Reasoning](https://arxiv.org/abs/2402.03667) (2024년 2월 6일)

---

## 핵심 개념

- **간접 추론**: 대우와 모순의 논리를 활용한 증명 기법
- **모순에 의한 증명**: 명제의 부정이 거짓임을 보여 원래 명제를 증명
- **대우 활용**: 원래 명제와 논리적으로 동치인 대우 명제 활용
- **단계적 분석**: 조건 정리 → 통합 → 가능성 검토의 구조적 접근
- **정확도 향상**: 간접 추론이 직접 추론보다 27-31% 높은 정확도

## 왜 중요한가

간접 추론은 직접적인 접근이 어려운 수학적 증명과 복잡한 논리 문제에 효과적입니다. LLM이 모순에 의한 증명과 대우 논리를 체계적으로 활용하도록 교육함으로써, 더 높은 정확도와 신뢰성을 갖춘 추론 능력을 개발할 수 있습니다. 이는 과학, 수학, 철학 등 논리적 사고가 중요한 분야에서 특히 중요합니다.

## 시험 포인트

- 모순에 의한 증명의 논리적 구조 이해
- 원명제와 대우의 관계 및 동치성
- 단계적 조건 분석 및 경우의 수 검토
- LLM의 형식적 증명 능력 평가
- 직접 추론 vs 간접 추론 성능 비교
