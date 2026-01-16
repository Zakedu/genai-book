# 생성형 AI 완전 정복

대학생과 성인을 위한 생성형 AI 활용 가이드 교재입니다.

---

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# Python 가상환경 생성
python -m venv .venv

# 가상환경 활성화
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# 패키지 설치
pip install -r requirements.txt
pip install -r chatbot/requirements.txt
```

### 2. 서버 실행

```bash
# 문서 + 챗봇 동시 실행
./start.sh

# 서버 종료
./stop.sh
# 또는 Ctrl+C
```

### 3. 접속

- **문서 사이트**: http://127.0.0.1:8000
- **네트워크 접속**: http://{로컬IP}:8000
- **챗봇 API**: http://127.0.0.1:8001

---

## 🤖 인공지능 챗봇

RAG(Retrieval-Augmented Generation) 기반 챗봇이 내장되어 있습니다.

### 챗봇 설정

1. **Ollama 설치**: https://ollama.ai
2. **필요 모델 다운로드**:
```bash
ollama pull bge-m3              # 임베딩 모델
ollama pull gemini-3-flash-preview:cloud  # LLM (또는 다른 모델)
```
3. **문서 인덱싱**:
```bash
cd chatbot
python indexer.py
```

### 기술 스택

- **벡터 DB**: ChromaDB
- **임베딩**: bge-m3 (다국어 지원)
- **LLM**: Ollama 기반
- **프론트엔드**: JavaScript 위젯

---

## 📁 프로젝트 구조

```
genai-book/
├── docs/                    # 마크다운 문서
│   ├── index.md             # 홈페이지
│   ├── part0~5/             # 본문 (6개 파트)
│   ├── appendix/            # 부록
│   ├── wiki/                # 위키 (개념, 도구, 사례)
│   ├── assets/              # 챗봇 JS/CSS
│   └── stylesheets/         # 커스텀 CSS
├── chatbot/                 # 챗봇 백엔드
│   ├── server.py            # FastAPI 서버
│   ├── indexer.py           # 문서 인덱싱
│   └── chroma_db/           # 벡터 데이터 (gitignore)
├── overrides/               # MkDocs 테마 오버라이드
├── mkdocs.yml               # MkDocs 설정
├── start.sh                 # 서버 시작 스크립트
└── stop.sh                  # 서버 종료 스크립트
```

---

## 📚 교재 구성

| 파트 | 제목 | 내용 |
|------|------|------|
| Part 0 | 서론 | 학습 로드맵, 왜 지금 배워야 하는가 |
| Part 1 | 이해 | 생성형 AI란, 주요 도구와 생태계 |
| Part 2 | 원리 | 프롬프트 구조, 고급 기법, 반복 개선 |
| Part 3 | 활용 | 학습/연구, 업무/비즈니스, 창작/콘텐츠 |
| Part 4 | 위험관리 | 환각, 윤리, 책임 있는 사용 |
| Part 5 | 미래 | 핵심 역량, 기술 트렌드 |

---

## ✏️ 마크다운 컴포넌트

```markdown
# 알림 박스
!!! tip "팁 제목"
    내용

!!! warning "주의사항"
    내용

!!! example "사례"
    내용

# 탭
=== "탭1"
    내용

=== "탭2"
    내용

# 체크리스트
- [x] 완료 항목
- [ ] 미완료 항목
```

---

## 🎨 테마 커스터마이징

`docs/stylesheets/extra.css`에서 색상 변경:

```css
[data-md-color-scheme="default"] {
  --md-primary-fg-color: #1565C0;  /* 메인 컬러 */
  --md-accent-fg-color: #2196F3;   /* 악센트 컬러 */
}
```

---

## 📝 라이선스

MIT License

Copyright (c) 2025 GenAI Education Project
