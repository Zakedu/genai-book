# LLM 응답의 할루시네이션 식별

Hallucination Identification

Copy page

# Identify Hallucination in LLM Responses

## Background

The following prompt tests an LLM's capabilities to identify hallucination in the context of [closed-domain question answering](/question-answering/closed-domain). Bubeck et al. (2023) suggests that LLMs like GPT-4 can be leveraged to identify hallucination.

⚠️

Note that due to the challenging nature of the task, LLMs are likely to hallucinate when they have no knowledge or context regarding the question.

The prompt has been slightly modified to include indicators that show which sections of the prompt corresponds to what information.

## Prompt

```
Patient’s facts:
- 20 year old female
- with a history of anerxia nervosa and depression
- blood pressure 100/50, pulse 50, height 5’5’’
- referred by her nutrionist but is in denial of her illness
- reports eating fine but is severely underweight
 
Question: Please rewrite the data above into a medical note, using exclusively the information above.
 
GPT-4 Response: 20 year old female patient with a history of anorexia nervosa and depression was referred by her nutritionist for evaluation and management of her eating disorder. She denies having any problem with her eating habits or body image and claims to eat normally. However, she is severely underweight for her height (BMI 16.6) and has signs of malnutrition, such as low blood pressure (100/50) and bradycardia (pulse 50). She also reports feeling depressed and hopeless. She is at risk of serious medical complications, such as cardiac arrhythmias, electrolyte imbalances, osteoporosis, and infertility. She needs urgent psychiatric and medical intervention to address her anorexia nervosa and depression.
 
Please read the above medical note and verify that each claim is exactly contained in the patient’s facts. Report any information which is not contained in the patient’s facts list.
```

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
    "content": "Patient’s facts:\n- 20 year old female\n- with a history of anerxia nervosa and depression\n- blood pressure 100/50, pulse 50, height 5’5’’\n- referred by her nutrionist but is in denial of her illness\n- reports eating fine but is severely underweight\n\nQuestion: Please rewrite the data above into a medical note, using exclusively the information above.\n\nGPT-4 Response: 20 year old female patient with a history of anorexia nervosa and depression was referred by her nutritionist for evaluation and management of her eating disorder. She denies having any problem with her eating habits or body image and claims to eat normally. However, she is severely underweight for her height (BMI 16.6) and has signs of malnutrition, such as low blood pressure (100/50) and bradycardia (pulse 50). She also reports feeling depressed and hopeless. She is at risk of serious medical complications, such as cardiac arrhythmias, electrolyte imbalances, osteoporosis, and infertility. She needs urgent psychiatric and medical intervention to address her anorexia nervosa and depression.\n\nPlease read the above medical note and verify that each claim is exactly contained in the patient’s facts. Report any information which is not contained in the patient’s facts list."
    }
],
temperature=1,
max_tokens=250,
top_p=1,
frequency_penalty=0,
presence_penalty=0
)
```

## Reference

* [Sparks of Artificial General Intelligence: Early experiments with GPT-4 (opens in a new tab)](https://arxiv.org/abs/2303.12712) (13 April 2023)
---

## 핵심 개념

- LLM 응답의 할루시네이션 식별의 정의 및 기본 원리
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
