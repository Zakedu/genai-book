# Claude Code와 함께한 24시간: 8,960줄의 AI 교육 허브가 탄생하기까지

> "정말로 하루 만에 이게 가능해?"

이 질문은 내가 프로젝트를 시작하기 전에 스스로에게 던진 것이고, 완성 후에 주변 사람들이 가장 많이 한 질문이기도 하다.

**결론부터 말하면: 가능하다.** 단, 좋은 파트너가 있다면.

---

## 프로젝트 개요: 무엇을 만들었나

![프로젝트 구조](https://img.shields.io/badge/Lines-8,960+-blue) ![문서](https://img.shields.io/badge/Docs-30_files-green) ![템플릿](https://img.shields.io/badge/Templates-60+-orange)

**"생성형 AI 완전 정복"** - 대학생과 성인을 위한 생성형 AI 활용 가이드다.

단순한 문서 사이트가 아니다:

| 구성요소 | 설명 |
|---------|------|
| 📚 **6부 구성 교재** | Part 0~5까지 체계적 커리큘럼 |
| 🤖 **RAG 챗봇** | 교재 내용 기반 AI 학습 도우미 |
| 📝 **60개 프롬프트 템플릿** | 즉시 활용 가능한 실전 템플릿 |
| 📖 **위키 시스템** | 개념, 도구, 사례연구 아카이브 |
| 🚀 **자동 배포** | GitHub Pages + Actions |

**라이브 사이트**: [https://zakedu.github.io/genai-book/](https://zakedu.github.io/genai-book/)

---

## 타임라인: 실제로 어떻게 진행되었나

Git 커밋 히스토리가 모든 것을 말해준다:

```
1월 16일 17:54 ─── 🚀 Initial commit: 생성형 AI 완전 정복 교재
           │
         17:58 ─── 📝 Update README with chatbot setup guide
           │
         18:16 ─── 📚 콘텐츠 보강: 11개 문서 상세 내용 추가
           │
1월 18일 21:55 ─── 🔧 Add GitHub Pages deployment workflow
           │
         22:22 ─── 🐛 Fix: enable GitHub Pages in workflow
           │
         22:23 ─── 🔐 Fix permissions
           │
1월 19일 08:53 ─── ✨ 네비게이션 버튼 추가 및 콘텐츠 보강
           │
1월 20일 09:12 ─── 🔍 리뷰 피드백 반영: High risk 항목 수정
```

**첫 커밋부터 배포까지 핵심 작업 시간: 약 24시간**

---

## Part 1: 기획과 구조 설계 (첫 1시간)

### "Claude, 생성형 AI 교재를 만들고 싶어"

Claude Code와의 대화는 이렇게 시작됐다. 나는 대략적인 아이디어만 있었다:

- 대학생/성인 대상
- 실용적이고 체계적인 가이드
- 단순 이론이 아닌 실전 활용 중심

Claude는 즉시 구조화된 제안을 내놓았다:

```
Part 0: 서론 - 왜 지금 배워야 하는가
Part 1: 이해 - Foundations (개념과 생태계)
Part 2: 원리 - Principles (프롬프트 엔지니어링)
Part 3: 활용 - Applications (분야별 적용)
Part 4: 위험관리 - Risks & Ethics (환각, 윤리)
Part 5: 미래 - Future (역량과 트렌드)
```

인상적이었던 건 단순히 구조만 제안한 게 아니라, **학습 로드맵까지 함께 제시**한 점이다:

| 단계 | 대상 | 학습 범위 |
|------|------|----------|
| 1단계 | 입문자 | Part 0-1 |
| 2단계 | 기초 학습자 | Part 2-3 |
| 3단계 | 중급 활용자 | Part 4 |
| 4단계 | 고급 실무자 | Part 5 |

**내가 한 일**: 구조 검토 및 승인
**Claude가 한 일**: 전체 아키텍처 설계, 폴더 구조 생성, 네비게이션 설계

---

## Part 2: 기술 스택 선정과 기반 구축 (2-3시간)

### MkDocs + Material: 왜 이 조합인가

여러 선택지가 있었다:
- Docusaurus (React 기반)
- GitBook (SaaS)
- VuePress (Vue 기반)
- **MkDocs + Material** ✅

Claude의 추천 이유:

> "한국어 콘텐츠에 최적화된 검색, 다크/라이트 모드, 풍부한 Markdown 확장, 그리고 Python 기반이라 챗봇 백엔드와 동일한 언어로 통합 가능합니다."

**mkdocs.yml** 설정은 177줄. Claude가 작성한 설정의 일부:

```yaml
theme:
  name: material
  language: ko
  features:
    - navigation.tabs           # 상단 Part별 탭
    - navigation.tabs.sticky    # 스크롤해도 탭 고정
    - navigation.sections       # 섹션 구분
    - navigation.expand         # 사이드바 자동 확장
    - search.suggest            # 검색 제안
    - content.code.copy         # 코드 복사 버튼

markdown_extensions:
  - admonition                   # 알림 박스
  - pymdownx.details             # 접기/펼치기
  - pymdownx.superfences         # 코드 블록 고급 기능
  - pymdownx.tabbed              # 탭 콘텐츠
  - pymdownx.tasklist            # 체크박스 리스트
```

### 커스텀 스타일링: Pretendard 폰트의 도입

한글 가독성을 위해 Pretendard 폰트를 적용했다. `extra.css`가 순식간에 300줄이 넘어갔다:

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

[data-md-color-scheme="default"] {
  --md-primary-fg-color: #1565C0;
  --md-accent-fg-color: #2196F3;
  --md-text-font: "Pretendard", -apple-system, BlinkMacSystemFont;
}
```

---

## Part 3: 콘텐츠 폭풍 (핵심 8시간)

여기서부터가 진짜 마법이 일어났다.

### 30개 마크다운 파일, 8,960줄의 콘텐츠

Claude와 나는 **페어 프로그래밍**이 아닌 **페어 라이팅**을 했다:

**내가 한 일**:
- 각 챕터의 핵심 방향 제시
- 실제 경험 기반 사례 제공
- 검토 및 수정 요청

**Claude가 한 일**:
- 구조화된 콘텐츠 작성
- 예제 코드와 프롬프트 생성
- 일관된 톤과 스타일 유지

예를 들어, "환각(Hallucination)" 챕터를 작성할 때:

```markdown
나: "환각 현상에 대해 설명하는데, 실제 법률 사례도 포함해줘"

Claude:
## 환각의 이해와 대응

### 💡 핵심 개념
환각(hallucination)은 AI가 그럴듯하지만 사실이 아닌 정보를
자신있게 생성하는 현상입니다...

### 실제 사례: 법률 분야의 환각
2023년, 미국의 한 변호사가 ChatGPT가 생성한
가상의 판례를 법정에 제출하여...
```

### 60개 프롬프트 템플릿 생성

`appendix/prompt-templates.md`는 이 프로젝트의 백미다:

```markdown
## 학습/연구용

### 1. 논문 요약
[역할]
당신은 학술 논문 분석 전문가입니다.

[작업]
첨부한 논문에 대해 다음을 분석해주세요:
1. 연구 질문 및 가설
2. 연구 방법론
3. 주요 발견 및 결과
...
```

분야별로 철저하게 구분:
- 학습/연구용 (12개)
- 업무/비즈니스 (15개)
- 창작/콘텐츠 (10개)
- 코딩/기술 (12개)
- 일상/생산성 (11개)

---

## Part 4: RAG 챗봇 구축 (4-5시간)

문서 사이트만으로는 부족했다. **대화형 학습 도우미**가 필요했다.

### 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    사용자 질문                           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  FastAPI 서버 (8001)                     │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │   임베딩     │───▶│   ChromaDB   │───▶│  컨텍스트   │ │
│  │  (bge-m3)   │    │  벡터 검색    │    │    구성     │ │
│  └─────────────┘    └──────────────┘    └────────────┘ │
│                                               │         │
│                                               ▼         │
│                          ┌─────────────────────────┐   │
│                          │   Ollama LLM 응답 생성   │   │
│                          │   (Gemini 3 Flash)      │   │
│                          └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              응답 + 출처 (관련 챕터/섹션)                 │
└─────────────────────────────────────────────────────────┘
```

### server.py: 234줄의 심플한 백엔드

```python
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # 1. 질문 임베딩
    query_embedding = await get_embedding(request.message)

    # 2. 유사 문서 검색 (상위 5개)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5,
        include=["documents", "metadatas", "distances"]
    )

    # 3. 컨텍스트 구성
    contexts = []
    for doc, meta, dist in zip(...):
        contexts.append(f"[{i+1}] {doc}")

    # 4. LLM 응답 생성
    response = await generate_response(
        request.message,
        context_text,
        request.history
    )

    return ChatResponse(response=response, sources=top_sources)
```

**핵심 설계 결정**:
- `bge-m3` 임베딩 모델: 다국어(한/영) 지원
- 코사인 유사도 > 0.3인 문서만 출처로 표시
- 최근 4개 대화만 컨텍스트에 포함 (토큰 절약)

### indexer.py: 문서 인덱싱 파이프라인

```python
# 문서 처리 흐름
마크다운 파일 읽기
    ↓
Frontmatter 추출 (YAML 메타데이터)
    ↓
H2 헤더 기준 섹션 분할
    ↓
마크다운 문법 정리
    ↓
길이 조정 (최대 1,500자)
    ↓
Ollama bge-m3로 임베딩 생성
    ↓
ChromaDB에 저장
```

---

## Part 5: 배포와 운영화 (2-3시간)

### GitHub Actions 자동 배포

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install mkdocs-material
      - run: mkdocs build
      - uses: actions/deploy-pages@v4
```

**push만 하면 2-3분 내에 라이브 배포 완료.**

### 로컬 개발 환경: start.sh

```bash
#!/bin/bash
# 문서 서버 + 챗봇 서버 동시 실행
cd chatbot && uvicorn server:app --port 8001 &
mkdocs serve --port 8000 &

echo "📖 문서: http://127.0.0.1:8000"
echo "🤖 챗봇: http://127.0.0.1:8001"
```

---

## 배운 것들: AI와 협업하는 법

### 1. "구체적으로 요청하라"는 말의 진짜 의미

❌ "챕터 하나 써줘"
✅ "프롬프트 엔지니어링 챕터를 작성해줘. 대상은 대학생이고, 실제 예제 3개 이상 포함해줘. 분량은 800-1000단어."

### 2. 검토자로서의 내 역할

Claude가 모든 것을 완벽하게 하진 않는다. 내가 한 중요한 일:

- **팩트 체크**: AI가 생성한 사례/통계 검증
- **일관성 유지**: 전체 톤과 스타일 통일
- **실용성 검증**: "이게 실제로 도움이 될까?"

### 3. 반복적 개선의 힘

```
버전 1 → 리뷰 → 피드백 → 버전 2 → 리뷰 → 피드백 → 최종
```

Git 히스토리의 "리뷰 피드백 반영: High risk 항목 수정" 커밋이 이를 증명한다.

---

## 기술 스택 총정리

| 카테고리 | 기술 | 역할 |
|---------|------|------|
| **문서** | MkDocs | 정적 사이트 생성 |
| **테마** | Material for MkDocs | UI/UX |
| **백엔드** | FastAPI | 챗봇 API 서버 |
| **벡터 DB** | ChromaDB | 문서 임베딩 저장 |
| **임베딩** | Ollama (bge-m3) | 다국어 텍스트 벡터화 |
| **LLM** | Ollama (Gemini 3 Flash) | 응답 생성 |
| **배포** | GitHub Pages | 정적 호스팅 |
| **CI/CD** | GitHub Actions | 자동 빌드/배포 |

---

## 최종 결과물

### 정량적 성과

| 지표 | 수치 |
|------|------|
| 총 코드/콘텐츠 라인 | 8,960+ |
| 마크다운 문서 | 30개 |
| 프롬프트 템플릿 | 60개 |
| 챕터 수 | 13개 (+ 부록 5개) |
| 위키 페이지 | 9개 |
| 백엔드 코드 | 234줄 |
| 설정 파일 | 177줄 |
| 개발 기간 | ~24시간 |

### 정성적 성과

- ✅ 체계적인 학습 경로 제공
- ✅ 실전 활용 가능한 템플릿
- ✅ AI 기반 대화형 학습 지원
- ✅ 반응형 디자인 (모바일 지원)
- ✅ 다크/라이트 모드
- ✅ 한국어 검색 최적화

---

## 마무리: AI는 도구이고, 방향은 사람이 정한다

Claude Code와 24시간을 보내며 깨달은 것:

**AI는 실행력을 10배로 높여주지만, 무엇을 만들지 결정하는 건 여전히 사람의 몫이다.**

나는 "생성형 AI 교육 허브를 만들자"는 비전을 갖고 있었고, Claude는 그 비전을 실현하기 위한 모든 기술적 세부사항을 처리해줬다.

### 다음에 도전할 것

1. 다국어 지원 (영문 버전)
2. 인터랙티브 퀴즈 기능
3. 학습 진도 추적 시스템
4. 커뮤니티 기능

---

**프로젝트 링크**: [https://zakedu.github.io/genai-book/](https://zakedu.github.io/genai-book/)

**GitHub**: [https://github.com/Zakedu/genai-book](https://github.com/Zakedu/genai-book)

---

*이 글도 Claude와 함께 작성했다. 그리고 그 사실을 숨기지 않는다. 왜냐하면, 이것이 바로 이 교재가 가르치고자 하는 "AI와의 협업"이기 때문이다.*
