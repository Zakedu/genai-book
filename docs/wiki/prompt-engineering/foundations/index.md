# 기초(Foundations)

프롬프트 엔지니어링의 기본 개념과 원리를 학습합니다.

## 목차

### 핵심 개념

- **[프롬프트 엔지니어링의 기초](basics.md)** - 언어 모델과의 상호작용, 프롬프트 포맷, 영샷 및 퓨샷 프롬프팅의 기초

- **[프롬프트의 요소들](elements.md)** - 효과적인 프롬프트를 구성하는 네 가지 요소(명령어, 맥락, 입력 데이터, 출력 지표)

- **[프롬프트 예시](examples.md)** - 텍스트 요약, 정보 추출, 질의응답, 텍스트 분류, 대화, 코드 생성, 추론 등 다양한 작업의 구체적 예시

### 실무 가이드

- **[LLM 설정](settings.md)** - 온도, Top P, 최대 길이, 중지 시퀀스, 페널티 등 모델 파라미터 설정

- **[프롬프트 설계의 일반적인 팁](general-tips.md)** - 단순하게 시작, 명령어 작성, 구체성, "하지 말 것"보다 "할 것" 강조

- **[효과적인 프롬프트 만들기](optimizing-prompts.md)** - 구체성, 구조화된 형식, 작업 분해, 고급 기법(퓨샷, 사고의 연쇄, ReAct)

### 모델 이해

- **[주요 LLM 모델 개요](models-overview.md)** - OpenAI(GPT-4, ChatGPT), Anthropic(Claude 3), Google(Gemini), Meta(Llama), Mistral 등 주요 모델의 특징과 비교

## 학습 순서

1. **입문자**: basics.md → elements.md → examples.md → general-tips.md
2. **실무 적용**: settings.md → optimizing-prompts.md → 기법 섹션
3. **모델 선택**: models-overview.md

## 핵심 학습 목표

이 섹션을 완료하면 다음을 이해하게 됩니다:

- 프롬프트 엔지니어링의 기본 원리
- 효과적인 프롬프트를 작성하기 위한 기본 요소들
- LLM 설정이 출력에 미치는 영향
- 다양한 작업에 맞는 프롬프트 설계 방법
- 각 LLM 모델의 강점과 적합한 사용 사례

## 다음 단계

기초를 이해했다면, [기법(Techniques)](../techniques/index.md) 섹션에서 다음을 배울 수 있습니다:

- 영샷 프롬프팅
- 퓨샷 프롬프팅
- 사고의 연쇄(Chain-of-Thought)
- ReAct 프롬프팅
- 그 외 다양한 고급 기법들
