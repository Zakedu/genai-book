# 사고의 연쇄 프롬프팅(Chain-of-Thought Prompting)

## 개요

[Wei et al. (2022)](https://arxiv.org/abs/2201.11903)에서 소개된 사고의 연쇄(CoT) 프롬프팅은 중간 추론 단계를 통해 복잡한 추론 능력을 가능하게 합니다. 퓨샷 프롬프팅과 결합하면 추론이 필요한 더 복잡한 작업에서 더 나은 결과를 얻을 수 있습니다.

<!-- 이미지: 사고의 연쇄 다이어그램 -->

## 기본 사고의 연쇄 예시

**프롬프트:**
```
The odd numbers in this group add up to an even number: 4, 8, 9, 15, 12, 2, 1.
A: Adding all the odd numbers (9, 15, 1) gives 25. The answer is False.

The odd numbers in this group add up to an even number: 17, 10, 19, 4, 8, 12, 24.
A: Adding all the odd numbers (17, 19) gives 36. The answer is True.

The odd numbers in this group add up to an even number: 16, 11, 14, 4, 8, 13, 24.
A: Adding all the odd numbers (11, 13) gives 24. The answer is True.

The odd numbers in this group add up to an even number: 17, 9, 10, 12, 13, 4, 2.
A: Adding all the odd numbers (17, 9, 13) gives 39. The answer is False.

The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1.
A:
```

**출력:**
```
Adding all the odd numbers (15, 5, 13, 7, 1) gives 41. The answer is False.
```

매우 좋은 결과입니다! 추론 단계를 제공했을 때 모델이 올바르게 작동했습니다.

실제로 더 적은 예시로도 이 작업을 해결할 수 있습니다:

**최소 예시 프롬프트:**
```
The odd numbers in this group add up to an even number: 4, 8, 9, 15, 12, 2, 1.
A: Adding all the odd numbers (9, 15, 1) gives 25. The answer is False.

The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1.
A:
```

**출력:**
```
Adding all the odd numbers (15, 5, 13, 7, 1) gives 41. The answer is False.
```

저자들은 이것이 충분히 큰 언어 모델에서 나타나는 긴급 능력(Emergent ability)이라고 주장합니다.

## 영샷 사고의 연쇄(Zero-Shot CoT)

<!-- 이미지: 영샷 사고의 연쇄 다이어그램 -->

더 최근의 아이디어로 [Kojima et al. (2022)](https://arxiv.org/abs/2205.11916)는 영샷 CoT를 소개했습니다. 이는 원래 프롬프트에 "Let's think step by step(단계별로 생각해봅시다)"을 추가하는 것입니다.

### 영샷만으로는 실패하는 경우

**프롬프트:**
```
I went to the market and bought 10 apples. I gave 2 apples to the neighbor and 2 to the repairman. I then went and bought 5 more apples and ate 1. How many apples did I remain with?
```

**출력:**
```
11 apples
```

이 답변은 틀렸습니다!

### 영샷 CoT로 성공

**프롬프트:**
```
I went to the market and bought 10 apples. I gave 2 apples to the neighbor and 2 to the repairman. I then went and bought 5 more apples and ate 1. How many apples did I remain with?

Let's think step by step.
```

**출력:**
```
First, you started with 10 apples.
You gave away 2 apples to the neighbor and 2 to the repairman, so you had 6 apples left.
Then you bought 5 more apples, so now you had 11 apples.
Finally, you ate 1 apple, so you would remain with 10 apples.
```

이 간단한 문구가 작업에서 매우 효과적입니다! 특히 프롬프트에 사용할 많은 예시가 없는 경우에 유용합니다.

## 자동 사고의 연쇄(Auto-CoT)

사고의 연쇄 프롬프팅을 시연과 함께 적용할 때, 프로세스는 효과적이고 다양한 예시를 손으로 만드는 것을 포함합니다. 이 수동 노력은 최적이 아닌 솔루션으로 이어질 수 있습니다.

[Zhang et al. (2022)](https://arxiv.org/abs/2210.03493)는 "단계별로 생각해봅시다" 프롬프트로 LLM을 활용하여 시연을 위한 추론 연쇄를 자동으로 생성하는 접근 방식을 제안합니다.

Auto-CoT는 두 가지 주요 단계로 구성됩니다:

1. **질문 클러스터링(Question Clustering)**: 주어진 데이터셋의 질문을 몇 개의 클러스터로 분할
2. **시연 샘플링(Demonstration Sampling)**: 각 클러스터에서 대표적인 질문을 선택하고 영샷 CoT로 추론 연쇄 생성

간단한 휴리스틱(예: 질문 길이 60개 토큰, 추론 단계 5개)을 사용하여 모델이 간단하고 정확한 시연을 사용하도록 장려합니다.

## 사고의 연쇄의 강점과 한계

### 강점
- 복잡한 추론 작업에서 성능 대폭 향상
- 모델의 추론 과정을 명시적으로 볼 수 있음
- 영샷 버전도 효과적임
- 다양한 도메인에 적용 가능

### 한계
- 긴 텍스트를 생성하므로 비용 증가
- 추론 단계가 부정확할 수 있음
- 모든 작업에 필요한 것은 아님

---

## 핵심 개념

- 중간 추론 단계: 최종 답변 전에 생각 과정을 명시
- 긴급 능력: 특정 크기 이상의 모델에서 나타나는 능력
- 영샷 CoT: "단계별로 생각해봅시다"라는 간단한 프롬프트
- Auto-CoT: 자동으로 시연을 생성하는 방식
- 추론 추적: 모델의 생각 과정을 따라갈 수 있음

## 왜 중요한가

사고의 연쇄는 LLM이 복잡한 문제를 해결할 수 있게 해주는 혁신적인 기법입니다. 단순히 답변을 제공하는 대신 추론 과정을 명시함으로써, 모델의 성능이 크게 향상됩니다. 이는 수학, 논리, 계획이 필요한 많은 실제 응용에 필수적입니다.

## 시험 포인트

- 영샷 CoT와 퓨샷 CoT의 차이
- "단계별로 생각해봅시다" 프롬프트의 효과
- 추론 단계의 품질이 성능에 미치는 영향
- Auto-CoT의 원리와 장점
- 복잡한 작업에서의 필요성
- 긴급 능력으로서의 CoT 특성
