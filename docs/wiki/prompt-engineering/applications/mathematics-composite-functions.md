# 합성함수 계산

Evaluating Composite Functions

Copy page

# Evaluating Composite Functions

## Background

This prompt tests an LLM's mathematical capabilities by prompting it to evaluate a given composition function.

## Prompt

Suppose g(x)=f−1(x),g(0)=5,g(4)=7,g(3)=2,g(7)=9,g(9)=6g(x) = f^{-1}(x), g(0) = 5, g(4) = 7, g(3) = 2, g(7) = 9, g(9) = 6g(x)=f−1(x),g(0)=5,g(4)=7,g(3)=2,g(7)=9,g(9)=6 what is f(f(f(6)))f(f(f(6)))f(f(f(6)))?

## Code / API

GPT-4 (OpenAI)Mixtral MoE 8x7B Instruct (Fireworks)

```
from openai import OpenAI
client = OpenAI()
 
response = client.chat.completions.create(
model="gpt-4",
messages=[
    {
    "role": "user",
    "content": "Suppose  g(x) = f^{-1}(x), g(0) = 5, g(4) = 7, g(3) = 2, g(7) = 9, g(9) = 6 what is f(f(f(6)))?\n"
    }
],
temperature=1,
max_tokens=256,
top_p=1,
frequency_penalty=0,
presence_penalty=0
)
```

## Reference

* [Sparks of Artificial General Intelligence: Early experiments with GPT-4 (opens in a new tab)](https://arxiv.org/abs/2303.12712) (13 April 2023)
---

## 핵심 개념

- 합성함수 계산의 정의 및 기본 원리
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
