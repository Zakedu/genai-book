# RAG를 위한 합성 데이터셋 생성

# Generating Synthetic Dataset for RAG



## Synthetic Data for RAG Setup

Unfortunately, in the life of a Machine Learning Engineer, there's often a lack of labeled data or very little of it. Typically, upon realizing this, projects embark on a lengthy process of data collection and labeling. Only after a couple of months can one start developing a solution.

However, with the advent of LLM, the paradigm shifted in some products: now one can rely on LLM’s generalization ability and test an idea or develop an AI-powered feature almost immediately. If it turns out to work (almost) as intended, then the traditional development process can begin.

<!-- 이미지: Paradigm shift in AI-powered products. -->

Image Source: [The Rise of the AI Engineer, by S. Wang (opens in a new tab)](https://www.latent.space/p/ai-engineer)

One of the emerging approaches is [Retrieval Augmented Generation (RAG) (opens in a new tab)](https://www.promptingguide.ai/techniques/rag). It's used for knowledge-intensive tasks where you can't solely rely on the model's knowledge. RAG combines an information retrieval component with a text generator model. To learn more about this approach, refer to [the relevant section in the guide (opens in a new tab)](https://www.promptingguide.ai/techniques/rag).

The key component of RAG is a Retrieval model that identifies relevant documents and passes them to LLM for further processing. The better the performance of the Retrieval model, the better the product or feature outcome. Ideally, Retrieval works well right out of the box. However, its performance often drops in different languages or specific domains.
---

## 핵심 개념

- RAG를 위한 합성 데이터셋 생성의 정의 및 기본 원리
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
