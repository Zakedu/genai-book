# 퓨샷 프롬프팅(Few-Shot Prompting)

## 개요

대형 언어 모델(LLM)이 뛰어난 영샷 능력을 보여주지만, 더 복잡한 작업에서는 영샷 설정으로 부족할 수 있습니다. 퓨샷 프롬프팅은 프롬프트에 시연을 제공하여 맥락 내 학습(In-context learning)을 가능하게 하는 기법입니다. 시연은 후속 예시에서 모델이 더 나은 성능을 제공하도록 유도하기 위한 조건입니다.

[Touvron et al. 2023](https://arxiv.org/pdf/2302.13971.pdf)에 따르면, 퓨샷 능력은 모델이 충분한 규모로 확대될 때 처음 나타났습니다.

## 퓨샷 프롬프팅의 예시

### 새 단어 사용 학습

다음은 [Brown et al. 2020](https://arxiv.org/abs/2005.14165)에서 제시한 예시로, 새로운 단어를 문장에 올바르게 사용하는 작업입니다.

**프롬프트:**
```
A "whatpu" is a small, furry animal native to Tanzania. An example of a sentence that uses the word whatpu is:
We were traveling in Africa and we saw these very cute whatpus.

To do a "farduddle" means to jump up and down really fast. An example of a sentence that uses the word farduddle is:
```

**출력:**
```
When we won the game, we all started to farduddle in celebration.
```

모델이 단 하나의 예시(1-shot)만으로 작업을 학습했습니다! 더 어려운 작업의 경우, 시연의 개수를 늘려볼 수 있습니다(예: 3-shot, 5-shot, 10-shot 등).

## 퓨샷 프롬프팅의 핵심 원리

[Min et al. (2022)](https://arxiv.org/abs/2202.12837)의 연구에 따르면, 퓨샷 예시를 사용할 때 다음을 주의해야 합니다:

- "레이블 공간과 시연에 의해 지정된 입력 텍스트의 분포가 모두 중요합니다(개별 입력에 대한 레이블이 올바른지 여부와 상관없이)"
- 사용하는 형식도 성능에 중요한 역할을 하며, 무작위 레이블을 사용하더라도 레이블이 없는 것보다 훨씬 나습니다
- 균등 분포 대신 진정한 레이블 분포에서 무작위 레이블을 선택하는 것도 도움이 됩니다

### 무작위 레이블로 퓨샷 진행하기

**프롬프트:**
```
This is awesome! // Negative
This is bad! // Positive
Wow that movie was rad! // Positive
What a horrible show! //
```

**출력:**
```
Negative
```

레이블이 무작위로 할당되었음에도 불구하고 올바른 답변을 얻었습니다! 형식을 유지한 것이 도움이 되었습니다.

## 퓨샷 프롬프팅의 한계

표준 퓨샷 프롬프팅은 많은 작업에서 잘 작동하지만, 특히 복잡한 추론 작업을 다룰 때는 완벽한 기법이 아닙니다.

**문제 예시:**
```
The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1.

A:
```

**모델 출력:**
```
Yes, the odd numbers in this group add up to 107, which is an even number.
```

이 응답은 올바르지 않습니다. 이는 이러한 시스템의 한계를 보여주며 더 고급 프롬프트 엔지니어링이 필요함을 시사합니다.

예시를 여러 개 추가해도 퓨샷 프롬프팅만으로는 이러한 복잡한 추론 문제를 해결할 수 없습니다. 이런 경우 사고의 연쇄(Chain-of-Thought) 프롬프팅과 같은 고급 기법을 사용해야 합니다.

## 언제 퓨샷을 사용할 것인가?

퓨샷 프롬프팅은 다음과 같은 경우에 효과적입니다:

- 영샷이 부족한 중간 복잡도의 작업
- 특정 형식이나 스타일이 필요한 작업
- 모델의 성능을 미세하게 조정해야 하는 경우
- 예시를 통해 패턴을 학습하기 쉬운 작업

복잡한 추론이 필요한 작업에는 사고의 연쇄 기법을 고려해야 합니다.

---

## 핵심 개념

- 맥락 내 학습(In-context learning): 예시를 통해 학습하는 능력
- 시연의 중요성: 형식과 예시가 모두 중요함
- 레이블 분포: 무작위이더라도 형식이 도움이 됨
- 한계: 복잡한 추론에는 한계가 있음
- 예시 수의 영향: 더 많은 예시가 항상 더 좋은 것은 아님

## 왜 중요한가

퓨샷 프롬프팅은 영샷이 부족한 영역에서 LLM의 성능을 크게 향상시킵니다. 미세 조정 없이 모델을 특정 작업에 적응시킬 수 있게 해줍니다. 이는 빠른 프로토타이핑과 작은 데이터셋에서의 작업 최적화를 가능하게 합니다.

## 시험 포인트

- 영샷과 퓨샷의 성능 차이
- 예시의 질이 결과에 미치는 영향
- 최적의 예시 개수 선택
- 형식과 구조의 중요성
- 복잡한 추론에서의 한계 이해
- 사고의 연쇄로의 전환 시기
