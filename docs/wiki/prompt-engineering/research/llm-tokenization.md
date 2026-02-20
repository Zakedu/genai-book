# LLM의 토큰화

# LLM Tokenization

Andrej Karpathy recently published a new [lecture (opens in a new tab)](https://youtu.be/zduSFxRajkE?si=Hq_93DBE72SQt73V) on large language model (LLM) tokenization. Tokenization is a key part of training LLMs but it's a process that involves training tokenizers using their own datasets and algorithms (e.g., [Byte Pair Encoding (opens in a new tab)](https://en.wikipedia.org/wiki/Byte_pair_encoding)).

In the lecture, Karpathy teaches how to implement a GPT tokenizer from scratch. He also discusses weird behaviors that trace back to tokenization.

<!-- 이미지: "LLM Tokenization" -->

*Figure Source: [https://youtu.be/zduSFxRajkE?t=6711 (opens in a new tab)](https://youtu.be/zduSFxRajkE?t=6711)*

Here is the text version of the list above:

* Why can't LLM spell words? Tokenization.
* Why can't LLM do super simple string processing tasks like reversing a string? Tokenization.
* Why is LLM worse at non-English languages (e.g. Japanese)? Tokenization.
* Why is LLM bad at simple arithmetic? Tokenization.
* Why did GPT-2 have more than necessary trouble coding in Python? Tokenization.
* Why did my LLM abruptly halt when it sees the string "<endoftext>"? Tokenization.
* What is this weird warning I get about a "trailing whitespace"? Tokenization.
* Why the LLM break if I ask it about "SolidGoldMagikarp"? Tokenization.
* Why should I prefer to use YAML over JSON with LLMs? Tokenization.
* Why is LLM not actually end-to-end language modeling? Tokenization.
* What is the real root of suffering? Tokenization.

To improve the reliability of LLMs, it's important to understand how to prompt these models which will also involve understanding their limitations. While there isn't too much emphasis on tokenizers (beyond the `max_tokens` configuration) at inference time, good prompt engineering involves understanding the constraints and limitations inherent in tokenization similar to how to structure or format your prompt. You could have a scenario where your prompt is underperforming because it's failing to, for instance, understand an acronym or concept that's not properly processed or tokenized. That's a very common problem that a lot of LLM developers and researchers overlook.

A good tool for tokenization is the [Tiktokenizer (opens in a new tab)](https://tiktokenizer.vercel.app/) and this is what's actually used in the lecture for demonstration purposes.
---

## 핵심 개념

- LLM의 토큰화의 정의 및 기본 원리
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
