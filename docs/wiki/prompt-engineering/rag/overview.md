# 검색 증강 생성 (RAG) 개요 (Retrieval Augmented Generation)

## 개요

일반용 언어 모델은 감정 분석 및 명명된 엔티티 인식과 같은 여러 일반적인 작업을 달성하도록 미세 조정될 수 있습니다. 이러한 작업들은 일반적으로 추가 배경 지식이 필요하지 않습니다.

더 복잡하고 지식 집약적인 작업의 경우 외부 지식 소스에 접근하는 언어 모델 기반 시스템을 구축할 수 있습니다. 이를 통해 사실적 일관성이 향상되고, 생성된 응답의 신뢰성이 개선되며, "환각(hallucination)" 문제를 완화할 수 있습니다.

## RAG란?

Meta AI 연구원들은 [검색 증강 생성(RAG)](https://ai.facebook.com/blog/retrieval-augmented-generation-streamlining-the-creation-of-intelligent-natural-language-processing-models/)이라는 방법을 도입하여 그러한 지식 집약적 작업을 해결했습니다. RAG는 정보 검색 구성 요소를 텍스트 생성 모델과 결합합니다. RAG는 미세 조정될 수 있으며 전체 모델을 재훈련할 필요 없이 효율적인 방식으로 내부 지식을 수정할 수 있습니다.

RAG는 입력을 받아 소스(예: Wikipedia)로부터 관련/지원 문서 집합을 검색합니다. 문서들은 원래 입력 프롬프트와 함께 컨텍스트로 연결되고 최종 출력을 생성하는 텍스트 생성기에 공급됩니다. 이것은 사실이 시간에 따라 변할 수 있는 상황에서 RAG를 적응형으로 만듭니다. 이는 LLM의 파라미터 지식이 정적이기 때문에 매우 유용합니다. RAG를 통해 언어 모델은 재훈련을 우회하고 최신 정보에 접근하여 검색 기반 생성을 통해 신뢰할 수 있는 출력을 생성할 수 있습니다.

## RAG 아키텍처

Lewis et al., (2021)은 RAG를 위한 일반적인 미세 조정 레시피를 제안했습니다. 사전 훈련된 seq2seq 모델이 파라미터 메모리로 사용되고 Wikipedia의 밀집 벡터 인덱스가 비파라미터 메모리로 사용됩니다(신경 사전 훈련된 검색기를 사용하여 접근). 다음은 접근 방식이 작동하는 방식의 개요입니다:

<!-- 이미지: RAG 아키텍처 -->

RAG는 [자연 질문(Natural Questions)](https://ai.google.com/research/NaturalQuestions), [WebQuestions](https://paperswithcode.com/dataset/webquestions), CuratedTrec과 같은 여러 벤치마크에서 강한 성능을 발휘합니다. RAG는 MS-MARCO 및 Jeopardy 질문에서 테스트할 때 더 사실적이고, 구체적이며, 다양한 응답을 생성합니다. RAG는 또한 FEVER 사실 검증에서 결과를 개선합니다.

이것은 지식 집약적 작업에서 언어 모델의 출력을 향상시키는 실행 가능한 옵션으로서 RAG의 잠재력을 보여줍니다.

## 현대 RAG 시스템

최근에 이러한 검색기 기반 접근 방식은 더욱 인기를 얻었으며 ChatGPT와 같은 인기 있는 LLM과 결합되어 기능과 사실적 일관성을 개선합니다.

## RAG 사용 사례: ML 논문 제목 생성

오픈 소스 LLM을 사용하여 기계 학습 논문의 짧고 간결한 제목을 생성하기 위한 RAG 시스템을 구축하는 노트북 튜토리얼을 준비했습니다:

[RAG 시작하기](https://github.com/dair-ai/Prompt-Engineering-Guide/blob/main/notebooks/pe-rag.ipynb)

---

## 참고 자료

- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) (2023년 12월)
- [Retrieval Augmented Generation: Streamlining the creation of intelligent natural language processing models](https://ai.meta.com/blog/retrieval-augmented-generation-streamlining-the-creation-of-intelligent-natural-language-processing-models/) (2020년 9월)

---

## 핵심 개념

- **외부 지식 통합**: 최신 정보에 접근하여 환각 문제 완화
- **검색 기반 생성**: 관련 문서를 조회하여 컨텍스트로 사용
- **재훈련 불필요**: 파라미터 메모리를 수정하지 않고 지식 업데이트
- **사실적 일관성**: 문서 기반 생성으로 검증 가능한 응답 제공
- **확장성**: 다양한 지식 기반과 도메인에 적용 가능

## 왜 중요한가

RAG는 LLM이 최신 정보와 도메인 특화 지식에 접근할 수 있게 함으로써 지식 집약적 작업의 신뢰성을 크게 향상시킵니다. 이는 정보가 빠르게 변하는 분야(뉴스, 과학, 기술)에서 특히 중요합니다. RAG를 통해 각 쿼리마다 전체 모델을 재훈련할 필요 없이 지식 기반을 유동적으로 업데이트할 수 있습니다.

## 시험 포인트

- RAG의 검색과 생성 구성요소의 역할
- 검색 효율성과 응답 품질의 트레이드오프
- 다양한 도메인과 언어에 대한 RAG 적응화
- 환각 완화의 메커니즘
- 재훈련 없이 지식 업데이트하는 방법
- 실제 응용에서의 지연시간과 정확도 고려사항
