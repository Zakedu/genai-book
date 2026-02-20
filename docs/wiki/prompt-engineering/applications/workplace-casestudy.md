# 대학원생 채용공고 분류 사례 연구

# Graduate Job Classification Case Study

[Clavié et al., 2023 (opens in a new tab)](https://arxiv.org/abs/2303.07142) provide a case-study on prompt-engineering applied to a medium-scale text classification use-case in a production system. Using the task of classifying whether a job is a true "entry-level job", suitable for a recent graduate, or not, they evaluated a series of prompt engineering techniques and report their results using GPT-3.5 (`gpt-3.5-turbo`).

The work shows that LLMs outperforms all other models tested, including an extremely strong baseline in DeBERTa-V3. `gpt-3.5-turbo` also noticeably outperforms older GPT3 variants in all key metrics, but requires additional output parsing as its ability to stick to a template appears to be worse than the other variants.

The key findings of their prompt engineering approach are:

* For tasks such as this one, where no expert knowledge is required, Few-shot CoT prompting performed worse than Zero-shot prompting in all experiments.
* The impact of the prompt on eliciting the correct reasoning is massive. Simply asking the model to classify a given job results in an F1 score of 65.6, whereas the post-prompt engineering model achieves an F1 score of 91.7.
* Attempting to force the model to stick to a template lowers performance in all cases (this behaviour disappears in early testing with GPT-4, which are posterior to the paper).
* Many small modifications have an outsized impact on performance.
  + The tables below show the full modifications tested.
  + Properly giving instructions and repeating the key points appears to be the biggest performance driver.
  + Something as simple as giving the model a (human) name and referring to it as such increased F1 score by 0.6pts.

### Prompt Modifications Tested

| Short name | Description |
| --- | --- |
| Baseline | Provide a a job posting and asking if it is fit for a graduate. |
| CoT | Give a few examples of accurate classification before querying. |
| Zero-CoT | Ask the model to reason step-by-step before providing its answer. |
| rawinst | Give instructions about its role and the task by adding to the user msg. |
| sysinst | Give instructions about its role and the task as a system msg. |
| bothinst | Split instructions with role as a system msg and task as a user msg. |
| mock | Give task instructions by mocking a discussion where it acknowledges them. |
| reit | Reinforce key elements in the instructions by repeating them. |
| strict | Ask the model to answer by strictly following a given template. |
| loose | Ask for just the final answer to be given following a given template. |
| right | Asking the model to reach the right conclusion. |
| info | Provide additional information to address common reasoning failures. |
| name | Give the model a name by which we refer to it in conversation. |
| pos | Provide the model with positive feedback before querying it. |

### Performance Impact of All Prompt Modifications

|  | Precision | Recall | F1 | Template Stickiness |
| --- | --- | --- | --- | --- |
| *Baseline* | *61.2* | *70.6* | *65.6* | *79%* |
| *CoT* | *72.6* | *85.1* | *78.4* | *87%* |
| *Zero-CoT* | *75.5* | *88.3* | *81.4* | *65%* |
| *+rawinst* | *80* | *92.4* | *85.8* | *68%* |
| *+sysinst* | *77.7* | *90.9* | *83.8* | *69%* |
| *+bothinst* | *81.9* | *93.9* | *87.5* | *71%* |
| +bothinst+mock | 83.3 | 95.1 | 88.8 | 74% |
| +bothinst+mock+reit | 83.8 | 95.5 | 89.3 | 75% |
| *+bothinst+mock+reit+strict* | *79.9* | *93.7* | *86.3* | ***98%*** |
| *+bothinst+mock+reit+loose* | *80.5* | *94.8* | *87.1* | *95%* |
| +bothinst+mock+reit+right | 84 | 95.9 | 89.6 | 77% |
| +bothinst+mock+reit+right+info | 84.9 | 96.5 | 90.3 | 77% |
| +bothinst+mock+reit+right+info+name | 85.7 | 96.8 | 90.9 | 79% |
| +bothinst+mock+reit+right+info+name+pos | **86.9** | **97** | **91.7** | 81% |

Template stickiness refers to how frequently the model answers in the desired format.
---

## 핵심 개념

- 대학원생 채용공고 분류 사례 연구의 정의 및 기본 원리
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
