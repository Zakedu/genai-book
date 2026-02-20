# 프롬프트 예시

이전 섹션에서 LLM에 프롬프트를 사용하는 방법의 기본 예시를 소개했습니다.

이 섹션에서는 프롬프트를 사용하여 다양한 작업을 달성하는 방법의 더 많은 예시를 제공하고, 함께 핵심 개념을 소개합니다. 종종 개념을 학습하는 가장 좋은 방법은 예시를 통하는 것입니다.

## 텍스트 요약

자연어 생성의 표준 작업 중 하나는 텍스트 요약입니다. 텍스트 요약은 많은 다양한 특징과 도메인을 포함할 수 있습니다. 실제로 언어 모델의 가장 유망한 응용 중 하나는 기사와 개념을 빠르고 쉽게 읽을 수 있는 요약으로 요약할 수 있다는 것입니다.

**프롬프트:**
```
Explain antibiotics

A:
```

**출력:**
```
Antibiotics are a type of medication used to treat bacterial infections. They work by either killing the bacteria or preventing them from reproducing, allowing the body's immune system to fight off the infection.
```

이것이 너무 많은 정보라고 생각하신다면, 모델에 한 문장으로 요약하도록 지시할 수 있습니다:

**프롬프트:**
```
Antibiotics are a type of medication used to treat bacterial infections. They work by either killing the bacteria or preventing them from reproducing, allowing the body's immune system to fight off the infection.

Explain the above in one sentence:
```

**출력:**
```
Antibiotics are medications used to treat bacterial infections by either killing the bacteria or stopping them from reproducing.
```

---

## 정보 추출

언어 모델은 자연어 생성 및 관련 작업을 수행하도록 학습되었지만, 분류 및 다양한 자연어 처리(NLP) 작업도 매우 능숙합니다.

**프롬프트:**
```
Author-contribution statements and acknowledgements in research papers should state clearly and specifically whether, and to what extent, the authors used AI technologies such as ChatGPT in the preparation of their manuscript and analysis.

Mention the large language model based product mentioned in the paragraph above:
```

**출력:**
```
The large language model based product mentioned in the paragraph above is ChatGPT.
```

---

## 질의응답

모델이 구체적인 답변을 하도록 하는 가장 좋은 방법 중 하나는 프롬프트의 형식을 개선하는 것입니다. 앞에서 다룬 바와 같이, 프롬프트는 명령어, 맥락, 입력, 출력 지표를 결합할 수 있습니다.

**프롬프트:**
```
Answer the question based on the context below. Keep the answer short and concise.

Context: Teplizumab traces its roots to a New Jersey drug company called Ortho Pharmaceutical. There, scientists generated an early version of the antibody, dubbed OKT3. Originally sourced from mice, the molecule was able to bind to the surface of T cells and limit their cell-killing potential.

Question: What was OKT3 originally sourced from?

Answer:
```

**출력:**
```
Mice.
```

---

## 텍스트 분류

지금까지 단순한 명령어를 사용하여 작업을 수행했습니다. 프롬프트 엔지니어로서 모델에 더 나은 명령어를 제공하는 기술을 향상시켜야 합니다. 하지만 그것만으로는 충분하지 않습니다! 더 어려운 사용 사례의 경우, 명령어만 제공하는 것으로는 충분하지 않을 수 있습니다.

**프롬프트:**
```
Classify the text into neutral, negative or positive.

Text: I think the food was okay.
Sentiment:
```

**출력:**
```
Neutral
```

모델이 "Neutral"이 아닌 "neutral"을 반환하도록 원한다면 어떻게 해야 할까요? 몇 가지 방법이 있습니다. 다음 예시에서 보이듯이, 프롬프트에 예시를 제공하면 도움이 됩니다:

**프롬프트:**
```
Classify the text into neutral, negative or positive.

Text: I think the vacation is okay.
Sentiment: neutral

Text: I think the food was okay.
Sentiment:
```

**출력:**
```
neutral
```

완벽합니다! 이번에는 모델이 원하는 레이블 "neutral"을 반환했습니다.

---

## 대화

프롬프트 엔지니어링으로 달성할 수 있는 더욱 흥미로운 것 중 하나는 LLM에게 행동 방식, 의도, 정체성을 지시하는 것입니다. 이는 고객 서비스 챗봇과 같은 대화형 시스템을 구축할 때 특히 유용합니다.

**프롬프트:**
```
The following is a conversation with an AI research assistant. The assistant tone is technical and scientific.