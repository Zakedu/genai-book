# LLM의 신뢰성

# Trustworthiness in LLMs



Trustworthy LLMs are important to build applications in high-stake domains like health and finance. While LLMs like ChatGPT are very capable of producing human readable responses they don't guarantee trustworthy responses across dimensions like truthfulness, safety, and privacy, among others.

[Sun et al. (2024) (opens in a new tab)](https://arxiv.org/abs/2401.05561) recently proposed a comprehensive study of trustworthiness in LLMs, discussing challenges, benchmarks, evaluation, analysis of approaches, and future directions.

One of the greater challenges of taking current LLMs into production is trustworthiness. Their survey proposes a set of principles for trustworthy LLMs that span 8 dimensions, including a benchmark across 6 dimensions (truthfulness, safety, fairness, robustness, privacy, and machine ethics).

The author proposed the following benchmark to evaluate the trustworthiness of LLMs on six aspects:

<!-- 이미지: A benchmark of trustworthy large language models -->

Below are the definitions of the eight identified dimensions of trustworthy LLMs.

<!-- 이미지: Dimensions of Trustworthy LLMs -->

## Findings

This work also presents a study evaluating 16 mainstream LLMs in TrustLLM, consisting of over 30 datasets. Below are the main findings from the evaluation:

* While proprietary LLMs generally outperform most open-source counterparts in terms of trustworthiness, there are a few open-source models that are closing the gap.
* Models like GPT-4 and Llama 2 can reliably reject stereotypical statements and show enhanced resilience to adversarial attacks.
* Open-source models like Llama 2 perform closely to proprietary ones on trustworthiness without using any type of special moderation tool. It's also stated in the paper that some models, such as Llama 2, are overly calibrated towards trustworthiness which at times compromises their utility on several tasks and mistakenly treats benign prompts as harmful inputs to the model.

## Key Insights

Over the different trustworthiness dimensions investigated in the paper, here are the reported key insights:

* **Truthfulness**: LLMs often struggle with truthfulness due to training data noise, misinformation, or outdated information. LLMs with access to external knowledge sources show improved performance in truthfulness.
* **Safety**: Open-source LLMs generally lag behind proprietary models in safety aspects like jailbreak, toxicity, and misuse. There is a challenge in balancing safety measures without being overly cautious.
* **Fairness**: Most LLMs perform unsatisfactorily in recognizing stereotypes. Even advanced models like GPT-4 have only about 65% accuracy in this area.
* **Robustness**: There is significant variability in the robustness of LLMs, especially in open-ended and out-of-distribution tasks.
* **Privacy**: LLMs are aware of privacy norms, but their understanding and handling of private information vary widely. As an example, some models have shown information leakage when tested on the Enron Email Dataset.
* **Machine Ethics**: LLMs demonstrate a basic understanding of moral principles. However, they fall short in complex ethical scenarios.

## Trustworthiness Leaderboard for LLMs

The authors have also published a leaderboard [here (opens in a new tab)](https://trustllmbenchmark.github.io/TrustLLM-Website/leaderboard.html). For example, the table below shows how the different models measure on the truthfulness dimension. As mentioned on their website, "More trustworthy LLMs are expected to have a higher value of the metrics with ↑ and a lower value with ↓".

<!-- 이미지: Trustworthiness Leaderboard for LLMs -->

## Code

You can also find a GitHub repository with a complete evaluation kit for testing the trustworthiness of LLMs across the different dimensions.

Code: [https://github.com/HowieHwong/TrustLLM (opens in a new tab)](https://github.com/HowieHwong/TrustLLM)

## References

Image Source / Paper: [TrustLLM: Trustworthiness in Large Language Models (opens in a new tab)](https://arxiv.org/abs/2401.05561) (10 Jan 2024)
---

## 핵심 개념

- LLM의 신뢰성의 정의 및 기본 원리
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
