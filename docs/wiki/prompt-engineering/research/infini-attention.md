# 효율적인 무한 컨텍스트 트랜스포머

# Efficient Infinite Context Transformers



A new [paper (opens in a new tab)](https://arxiv.org/abs/2404.07143) by Google integrates compressive memory into a vanilla dot-product attention layer.

The goal is to enable Transformer LLMs to effectively process infinitely long inputs with bounded memory footprint and computation.

They propose a new attention technique called Infini-attention which incorporates a compressive memory module into a vanilla attention mechanism.

<!-- 이미지: "Infini-Attention" -->

It builds in both masked local attention and long-term linear attention into a single Transformer block. This allows the Infini-Transformer model to efficiently handle both long and short-range contextual dependencies.

This approach outperforms baseline models on long-context language modeling with a 114x compression ratio of memory!

They also show that a 1B LLM can naturally scale to a 1M sequence length and a 8B model achieves a new SoTA result on a 500K length book summarization task.

Given how important long-context LLMs are becoming having an effective memory system could unlock powerful reasoning, planning, continual adaption, and capabilities not seen before in LLMs.
---

## 핵심 개념

- 효율적인 무한 컨텍스트 트랜스포머의 정의 및 기본 원리
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
