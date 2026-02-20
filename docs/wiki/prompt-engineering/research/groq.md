# Groq란 무엇인가?

# What is Groq?

[Groq (opens in a new tab)](https://groq.com/) recently made a lot of headlines as one of the fastest LLM inference solutions available today. There is a lot of interest from LLM practitioners to reduce the latency in LLM responses. Latency is an important metric to optimize and enable real-time AI applications. There are many companies now in the space competing around LLM inference.

Groq is one of those LLM inference companies that claim, at the time of writing this post, 18x faster inference performance on [Anyscale's LLMPerf Leaderboard (opens in a new tab)](https://github.com/ray-project/llmperf-leaderboard) compared to other top cloud-based providers. Groq currently makes available models like Meta AI's Llama 2 70B and Mixtral 8x7B via their APIs. These models are powered by Groq LPU™ Inference Engine which is built with their own custom hardware designed for running LLMs called language processing units (LPUs).

According to to Groq's FAQs, LPU helps to reduce the amount of time per word calculated, enabling faster text sequence generation. You can read more about the technical details of LPU and its benefits in their ISCA-awarded [2020 (opens in a new tab)](https://wow.groq.com/groq-isca-paper-2020/) and [2022 (opens in a new tab)](https://wow.groq.com/isca-2022-paper/) papers.

Here is a chart with the speed and pricing for their models:

<!-- 이미지: "Groq pricing" -->

The chart below compares the output tokens throughput (tokens/s) which is the average number of output tokens returned per second. The numbers in the chart correspond to the mean output tokens throughput (based on 150 requests) of the LLM inference providers on the Llama 2 70B model.

!["LLMPerf Leaderboard"](https://github.com/ray-project/llmperf-leaderboard/blob/main/.assets/output_tokens_per_s.jpg?raw=true)

Another important factor of LLM inference, especially for streaming applications, is called time to first token (TTFT) which corresponds to the duration of time that the LLM returns the first token. Below is a chart showing how different LLM inference providers perform:

!["time to first token (seconds)"](https://github.com/ray-project/llmperf-leaderboard/blob/main/.assets/ttft.jpg?raw=true)

You can read more about Groq's LLM inference performance on Anyscale’s LLMPerf Leaderboard [here (opens in a new tab)](https://wow.groq.com/groq-lpu-inference-engine-crushes-first-public-llm-benchmark/).
---

## 핵심 개념

- Groq란 무엇인가?의 정의 및 기본 원리
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
