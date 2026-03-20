# Gemini

!!! info "최종 수정일: 2026-03-19"

Google DeepMind이 개발한 멀티모달 AI입니다. 업계 최대 컨텍스트 윈도우(2M 토큰), Google 생태계와의 깊은 통합, 멀티모달 입출력 처리 능력, Deep Research와 에이전트 기능이 특징입니다. Gemini 3.1 Pro Preview (2026년 3월)가 최신 모델이며, Gemini 2.5 Pro가 안정 버전으로 사용됩니다.

---

## 기본 정보

| 항목 | 내용 |
|------|------|
| 개발사 | Google DeepMind |
| 출시일 | 2023년 12월 (Bard에서 리브랜딩) |
| 최신 모델 | Gemini 3.1 Pro (Preview), Gemini 2.5 Pro, Gemini 3.1 Flash-Lite (Preview), Gemini 2.0 Flash |
| 웹사이트 | [gemini.google.com](https://gemini.google.com) |
| API | [ai.google.dev](https://ai.google.dev) |
| AI Studio | [aistudio.google.com](https://aistudio.google.com) |
| 모바일 앱 | iOS / Android |

---

## 요금제

### 개인 사용자

| 플랜 | 가격 | 주요 기능 |
|------|------|----------|
| **Free** | 무료 | Gemini 2.0 Flash, 기본 멀티모달, Google 검색 연동 |
| **Advanced** | $19.99/월 | 최신 모델, Deep Research, Gems, NotebookLM Plus, 2TB Drive |
| **AI Pro** | $49.99/월 | Advanced보다 높은 사용량, 3.1 Pro Preview 접근 |
| **AI Ultra** | $249.99/월 | 최고 성능 모델 무제한, 최대 컨텍스트, 모든 프리미엄 기능 |

!!! tip "Google One AI Premium / AI Pro / AI Ultra"
    Gemini Advanced는 Google One AI Premium 플랜에 포함됩니다. 2TB Google Drive 저장공간, Google Workspace 앱에서의 Gemini 기능, NotebookLM Plus 이용권이 모두 포함된 통합 구독입니다. AI Pro($49.99/월)와 AI Ultra($249.99/월)는 더 높은 사용량과 최신 3.1 Pro Preview 모델 접근을 제공하는 상위 티어입니다.

### 비즈니스

| 플랜 | 가격 | 주요 기능 |
|------|------|----------|
| **Gemini Business** | $24/월/인 | Workspace 통합, 기업 보안, 관리 콘솔 |
| **Gemini Enterprise** | $36/월/인 | 무제한 사용, 고급 보안, 전담 지원 |

---

## 모델 라인업

### Gemini 2.5 Pro (최신 추천)

2025년 6월 17일 출시된 최신 플래그십 모델입니다. 내부적으로 추론 과정을 수행하는 "Thinking Model"입니다.

**특징**:

- 1M 토큰 컨텍스트 윈도우 (약 2,500페이지)
- 내장 추론(Thinking) 기능으로 복잡한 문제 단계적 해결
- 코딩, 수학, 과학 벤치마크 최상위 성능
- 멀티모달 입출력 (텍스트, 이미지, 오디오, 비디오)
- Gemini Advanced 및 Google AI Studio에서 사용 가능
- Gemini 3.1 출시 전까지 최고 성능 모델

!!! tip "Thinking 모델"
    Gemini 2.5 Pro는 응답 전에 내부 추론 과정을 거칩니다. 복잡한 코딩 문제, 수학, 다단계 분석 작업에서 특히 뛰어난 성능을 보여줍니다. Deep Research도 내부적으로 Gemini 2.5 Pro 추론 기능을 활용합니다.

### Gemini 3.1 Pro (Preview)

2026년 3월 초 Preview로 출시된 차세대 플래그십 모델입니다.

**특징**:

- Gemini 2.5 Pro 대비 향상된 추론 및 코딩 성능
- 확장된 컨텍스트 윈도우
- 개선된 멀티모달 처리
- 에이전트 기능 강화
- AI Ultra 및 AI Pro 구독에서 접근 가능
- Preview 단계로 성능이 계속 개선 중

### Gemini 3.1 Flash-Lite (Preview)

2026년 3월 출시된 경량 고효율 모델입니다.

**특징**:

- API 가격: $0.25 입력 / $1.50 출력 (1M 토큰당)
- 빠른 응답 속도
- 대량 처리 및 경량 작업에 최적
- Preview 단계

### Gemini 2.0 Flash

2024년 12월 출시된 고속 멀티모달 모델입니다. 빠른 속도와 에이전트 기능이 특징입니다.

**특징**:

- 1M 토큰 컨텍스트 윈도우
- 이전 세대 대비 2배 빠른 추론 속도
- 멀티모달 출력 지원 (텍스트 + 이미지 + 오디오)
- 네이티브 도구 사용 (Google Search, 코드 실행, 함수 호출)
- 에이전트 기능 강화 — 자율적 멀티스텝 작업 수행
- 무료 사용자에게도 기본 제공
- API 비용 매우 저렴 ($0.10 입력 / $0.40 출력)

### Gemini 2.0 Flash-Lite

2.0 Flash의 경량 버전으로, 비용 효율성을 극대화한 모델입니다.

**특징**:

- 1M 토큰 컨텍스트 윈도우
- 매우 낮은 API 비용 ($0.075 입력 / $0.30 출력)
- 대량 처리 및 경량 작업에 최적
- 무료 API 티어에서도 사용 가능 (분당 30회)

!!! warning "모델 퇴역 안내"
    - **Gemini 3 Pro**: 2026년 3월 9일부로 퇴역
    - **Gemini 2.5 Flash-Lite**: 2026년 3월 31일 종료 예정
    퇴역된 모델은 더 이상 API에서 사용할 수 없습니다. 후속 모델로 마이그레이션하세요.

### Gemini 1.5 Pro

대용량 컨텍스트가 필요한 작업을 위한 모델입니다. 후속 모델(Gemini 2.5 Pro, 3.1 Pro)이 출시되어 신규 프로젝트에는 2.5 Pro 이상을 권장합니다.

**특징**:

- 2M 토큰 컨텍스트 (업계 최대, 약 5,000페이지)
- 복잡한 추론 및 장문 문서 분석에 적합
- 여러 권의 책, 대규모 코드베이스, 긴 영상을 한 번에 처리

---

## 핵심 기능

### 1. Deep Research

Gemini Advanced에서 사용 가능한 AI 에이전트 기반 심층 조사 기능입니다. 자율적으로 웹을 탐색하며 종합 보고서를 생성합니다.

**작동 방식**:

1. 사용자가 조사 주제를 입력
2. Gemini가 연구 계획을 수립하고 사용자에게 확인 요청
3. 수십~수백 개의 웹 소스를 자동으로 탐색
4. 정보를 종합하여 구조화된 보고서 생성
5. 모든 출처를 인용과 함께 제공

**특징**:

- Gemini 2.0 Flash 기반 에이전트 기능 활용
- 멀티스텝 리서치 (여러 단계에 걸쳐 심층 조사)
- Google Docs로 보고서 내보내기 지원
- 출처 명시 및 인용 링크 포함

**예시 프롬프트**:

```
"2024년 글로벌 전기차 시장 동향을 심층 조사해줘.
주요 제조사별 판매량, 배터리 기술 트렌드,
각국 정책 변화, 2025년 전망을 포함해줘."
```

### 2. Gems (맞춤형 AI)

특정 목적에 맞게 Gemini를 커스터마이징할 수 있는 기능입니다. Gemini Advanced에서 사용 가능합니다.

**특징**:

- 커스텀 지시사항으로 전문 AI 어시스턴트 생성
- 대화 톤, 전문 분야, 응답 형식 등 설정 가능
- 미리 만들어진 Gem 템플릿 제공
- 생성한 Gem을 반복적으로 재사용

**활용 예시**:

| Gem 유형 | 설명 |
|----------|------|
| 코딩 멘토 | 코드 리뷰, 디버깅, 최적화 조언 |
| 글쓰기 코치 | 특정 톤과 스타일로 글쓰기 지원 |
| 학습 튜터 | 특정 과목의 맞춤형 학습 가이드 |
| 브레인스토밍 파트너 | 아이디어 확장 및 비판적 분석 |

### 3. Multimodal Live API

실시간 음성·영상 대화를 지원하는 API입니다.

**특징**:

- 실시간 오디오 입출력 (양방향 음성 대화)
- 실시간 비디오/카메라/화면 공유 처리
- 저지연 스트리밍 응답
- Gemini 앱에서 음성 대화 기능으로 제공
- 개발자용 API로도 사용 가능

**활용 시나리오**:

- 실시간 통역 및 언어 학습
- 카메라로 보이는 것에 대한 실시간 질의응답
- 화면 공유를 통한 실시간 기술 지원
- 음성 기반 AI 어시스턴트 구축

### 4. Google Workspace 통합

Gmail, Docs, Sheets, Slides, Meet 등 Google Workspace 전반에 Gemini가 통합되어 있습니다.

**앱별 기능**:

| Workspace 앱 | Gemini 기능 |
|-------------|------------|
| **Gmail** | 이메일 요약, 답장 초안 작성, 톤 조정 |
| **Google Docs** | AI 기반 문서 자동 생성, 구조 제안, 번역 통합 |
| **Google Sheets** | AI 피벗 분석, 자연어 수식 생성, 예측 차트 |
| **Google Slides** | AI 기반 전체 프레젠테이션 자동 생성, 이미지 검색 통합 |
| **Google Meet** | 실시간 자막, 회의 요약, 노트 자동 작성 |
| **Google Drive** | AI 기반 파일 검색, 요약, 정리 |

**사용 방법**:

1. Google One AI Premium 구독 (개인) 또는 Gemini Business/Enterprise 플랜 이용
2. 각 앱에서 Gemini 사이드패널 또는 인라인 기능 활성화
3. 사이드패널 아이콘 또는 전용 버튼으로 호출

### 5. NotebookLM / NotebookLM Plus

AI 기반 리서치 및 노트 정리 도구입니다. 업로드한 자료만을 기반으로 답변하여 환각을 최소화합니다.

**특징**:

- 다양한 소스 업로드 (PDF, Google Docs, 웹페이지, YouTube 영상, 텍스트)
- 업로드 자료 기반의 정확한 답변 및 인라인 인용
- **Audio Overview**: 업로드 자료를 팟캐스트 스타일 대화로 변환
- 소스 간 교차 분석 및 질의응답

**NotebookLM Plus** (Google One AI Premium 포함):

- 더 많은 노트북 및 소스 허용
- Audio Overview 커스터마이징 (길이, 초점, 전문성 수준)
- 공유 및 팀 협업 기능 강화
- 사용량 제한 완화

### 6. Imagen 3 (이미지 생성)

Google의 최신 이미지 생성 모델인 Imagen 3을 Gemini에서 직접 사용할 수 있습니다.

**특징**:

- 높은 품질의 포토리얼리스틱 이미지 생성
- 이미지 내 텍스트 렌더링 품질 대폭 향상
- 다양한 아트 스타일 지원
- Gemini 대화 내에서 직접 생성

```
프롬프트 예시:
"한옥 카페에서 커피를 마시는 고양이,
수채화 스타일, 따뜻한 조명, 16:9 비율"
```

### 7. Veo 2 (동영상 생성)

Google DeepMind의 비디오 생성 모델 Veo 2를 통해 텍스트에서 고품질 동영상을 생성합니다.

**특징**:

- 텍스트 프롬프트로 1080p 동영상 생성
- 다양한 시네마틱 스타일 및 카메라 무브먼트 지원
- 물리법칙과 움직임의 자연스러운 표현
- Gemini Advanced 및 VideoFX에서 사용 가능

```
프롬프트 예시:
"바다 위를 날아가는 드론 시점의 영상,
일몰 시간대, 시네마틱 색감, 부드러운 카메라 이동"
```

### 8. 실시간 Google 검색

Google 검색과 네이티브 연동하여 최신 정보를 제공합니다.

- 최신 뉴스, 실시간 정보 자동 검색 및 반영
- 검색 결과 출처 링크 제공 (Double-check 기능)
- 모든 Gemini 사용자 이용 가능
- API에서 Google Search 도구로 활용 가능 (Grounding with Google Search)

---

## Google AI Studio

개발자를 위한 무료 웹 기반 프로토타이핑 도구입니다.

| 항목 | 내용 |
|------|------|
| 주소 | [aistudio.google.com](https://aistudio.google.com) |
| 가격 | 무료 (API 사용량별 과금) |
| 지원 모델 | Gemini 3.1 Pro (Preview), Gemini 3.1 Flash-Lite (Preview), Gemini 2.5 Pro, 2.0 Flash, 2.0 Flash-Lite, 1.5 Pro 등 |

**주요 기능**:

- 채팅, 구조화 프롬프트, 자유형 프롬프트 모드
- API 키 발급 및 관리
- 프롬프트 테스트 후 코드 자동 생성 (Python, JavaScript, cURL 등)
- 파일 업로드를 통한 멀티모달 테스트
- 모델 파인튜닝 지원
- **gemini-embedding-2-preview**: 텍스트뿐 아니라 이미지까지 임베딩할 수 있는 멀티모달 임베딩 모델이 Preview로 제공됩니다.

**API 가격 (주요 모델, 유료 티어)**:

| 모델 | 입력 (1M 토큰당) | 출력 (1M 토큰당) | 무료 티어 |
|------|------------------|------------------|----------|
| **Gemini 3.1 Pro** (Preview) | TBD | TBD | - |
| **Gemini 3.1 Flash-Lite** (Preview) | $0.25 | $1.50 | - |
| **Gemini 2.0 Flash** | $0.10 | $0.40 | 분당 15회 |
| **Gemini 2.0 Flash-Lite** | $0.075 | $0.30 | 분당 30회 (3/31 종료 예정) |
| **Gemini 1.5 Pro** (≤128K) | $1.25 | $5.00 | 분당 2회 |
| **Gemini 1.5 Pro** (>128K) | $2.50 | $10.00 | 분당 2회 |

!!! tip "무료 API 티어"
    Google AI Studio에서는 속도 제한이 있지만 무료로 Gemini API를 사용할 수 있습니다. 프로토타이핑과 학습 목적으로 매우 유용합니다.

---

## 사용 팁

### 효과적인 프롬프트 작성

=== "기본 요청"
    ```
    이메일 답장 써줘
    ```

=== "상세 프롬프트"
    ```
    다음 이메일에 대한 답장을 작성해주세요.

    톤: 정중하지만 친근하게
    길이: 5문장 이내
    포함 내용:
    - 감사 표현
    - 요청사항 확인
    - 다음 단계 제안

    원본 이메일:
    [이메일 내용]
    ```

=== "Deep Research 활용"
    ```
    다음 주제에 대해 Deep Research를 실행해줘:

    주제: 2024-2025 한국 스타트업 투자 동향
    포함할 내용:
    - 분기별 투자 규모 변화
    - 주요 투자 분야 (AI, 바이오, 핀테크 등)
    - 주요 투자자 및 딜 사례
    - 2025년 전망

    Google Docs로 내보내기 해줘.
    ```

### 모델 선택 가이드

| 작업 유형 | 추천 모델 | 이유 |
|----------|----------|------|
| 복잡한 추론·코딩 | Gemini 2.5 Pro | Thinking 기능으로 정확도 높음 |
| 일반 대화·빠른 작업 | Gemini 2.0 Flash | 빠른 속도, 충분한 품질 |
| 대용량 문서 분석 | Gemini 2.5 Pro | 1M 토큰 컨텍스트 (대용량 분석에 최적) |
| 대량 API 호출 | Gemini 2.0 Flash-Lite | 최저 비용 |

### 긴 문서 처리

```
프롬프트 예시:
"첨부한 PDF 3개를 모두 읽고, 각 문서의 핵심 내용을
비교 분석해줘. 공통점과 차이점을 표로 정리해줘."
```

---

## 장단점

### 장점

- [x] 업계 최대 컨텍스트 (1.5 Pro: 2M 토큰)
- [x] Google 생태계 완벽 통합 (Workspace, Drive, NotebookLM)
- [x] 강력한 실시간 Google 검색 연동
- [x] Deep Research로 자동 심층 조사
- [x] 무료 API 티어 제공 (Google AI Studio)
- [x] Multimodal Live API로 실시간 음성·영상 대화
- [x] Imagen 3, Veo 2 등 생성형 미디어 통합
- [x] 한국어 지원 우수

### 단점

- [ ] Google 계정 필수
- [ ] 일부 기능 국가별 출시 시차
- [ ] 독립적인 데스크톱 앱 부재 (웹/모바일)
- [ ] Workspace 통합은 유료 플랜 필요

---

## 활용 분야

| 분야 | 활용 예시 | 추천 기능 |
|------|----------|----------|
| **업무** | Gmail 답장, Docs 작성, Sheets 분석 | Workspace 통합 |
| **리서치** | 심층 조사, 논문 분석, 시장 조사 | Deep Research, NotebookLM |
| **학습** | 대용량 교재 분석, 팟캐스트 변환 | NotebookLM Audio Overview |
| **개발** | 코드 작성, 디버깅, API 프로토타이핑 | AI Studio, Gemini 2.5 Pro |
| **콘텐츠** | 이미지·영상 생성 및 편집 | Imagen 3, Veo 2 |
| **고객 서비스** | 실시간 음성 AI 구축 | Multimodal Live API |

---

## 다른 AI와 비교

| 항목 | Gemini | ChatGPT | Claude |
|------|--------|---------|--------|
| 최대 컨텍스트 | 2M 토큰 | 128K 토큰 | 1M 토큰 |
| 웹 검색 | Google 검색 통합 | Bing 검색 | 제한적 |
| 생태계 연동 | Google Workspace | Microsoft 365 | - |
| 이미지 생성 | Imagen 3 | DALL-E 3 / GPT-4o | - |
| 영상 생성 | Veo 2 | Sora | - |
| 음성 대화 | Multimodal Live API | Advanced Voice | - |
| 무료 API | ✅ (AI Studio) | 제한적 | 제한적 |
| 한국어 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 관련 링크

- [Gemini 공식 사이트](https://gemini.google.com)
- [Google AI Studio](https://aistudio.google.com)
- [Google AI 개발자 문서](https://ai.google.dev/docs)
- [Gemini API 가격표](https://ai.google.dev/pricing)
- [NotebookLM](https://notebooklm.google.com)
- [Gemini 도움말 센터](https://support.google.com/gemini)
