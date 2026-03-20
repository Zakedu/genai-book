# 교재 접근성 개선 설계: PDF eBook 파이프라인

> 작성일: 2026-02-12 | 상태: 설계 완료, 샘플 검증 완료

---

## 1. 배경 및 목적

### 해결할 문제
현재 "생성형 AI 완전 정복" 교재는 MkDocs Material 기반 웹사이트(GitBook)로만 서비스되고 있다. 이 교재를 기반으로 AI 시험이 진행되므로, 세 가지 핵심 품질 기준이 있다:

1. **최신성** - 주기적 콘텐츠 업데이트 (전략 수립 완료)
2. **신뢰도** - 정기 점검 및 검증 (전략 수립 완료)
3. **접근성** - 학습자가 편하게 공부할 수 있는 형태 (**이 설계의 대상**)

### 학생 피드백 기반 핵심 불편 사항
- 웹 전용이라 오프라인 학습 불가 (지하철, 도서관 등)
- 웹사이트 특성상 체계적 학습 경험 부족 (산만한 탐색)
- 시험 준비 도구 부재 (하이라이트, 메모, 복습 문제 등)

### 대상 규모
- 수백 명 규모 (대학 강의 / 기업 교육 프로그램)

---

## 2. 접근 방식: Pandoc + XeLaTeX 파이프라인

### 선정 이유
| 기준 | Pandoc+LaTeX | CSS PDF (WeasyPrint) | InDesign |
|------|-------------|---------------------|----------|
| 전문 조판 품질 | O (학술 표준) | 제한적 | O (최고) |
| 멀티포맷 지원 | O (PDF+ePub) | PDF만 | 수동 |
| 자동화 | O (CLI) | O | X |
| 한글 조판 | O (XeLaTeX) | 제한적 | O |
| Markdown 호환 | O (네이티브) | 전처리 필요 | X |

### 최종 전략
- **1순위**: PDF eBook (Pandoc + XeLaTeX)
- **2순위**: ePub (Pandoc 동일 소스)
- **3순위**: 실물 인쇄 교재 (동일 PDF 기반 인쇄용 변환)

---

## 3. 아키텍처

```
docs/*.md (원본 - Single Source of Truth)
    |
    +---> MkDocs build ---> 웹사이트 (기존 유지)
    |
    +---> preprocess.py (전처리)
           |  - MkDocs 전용 문법 변환
           |  - 챕터 순서 병합
           |  - 메타데이터 주입
           |
           +---> Pandoc + callout-filter.lua
                  |
                  +---> XeLaTeX (2-pass) ---> PDF eBook
                  |
                  +---> ePub 템플릿 ---> ePub (향후)
```

---

## 4. 핵심 구성 요소

### 4.1 전처리 스크립트 (`preprocess.py`)
MkDocs Material 전용 확장을 Pandoc 호환 형태로 변환:

| MkDocs 문법 | 변환 방식 | 상태 |
|---|---|---|
| `!!! type "title"` (Admonition) | Pandoc fenced div (`.callout-box`) | 완료 |
| `=== "탭제목"` (탭 콘텐츠) | 볼드 섹션 헤딩 | 완료 |
| `<div class="grid cards">` | 제거/리스트 변환 | TODO |
| Material 아이콘 단축코드 | 텍스트 대체 | 완료 |
| 이모지 | 텍스트 라벨 대체 | 완료 |
| `# Chapter N:` 중복 | 접두어 제거 | 완료 |
| 내부 상대 링크 | 페이지 참조 변환 | TODO |
| HTML 네비게이션 | 제거 | 완료 |

### 4.2 Pandoc Lua 필터 (`callout-filter.lua`)
fenced div를 LaTeX tcolorbox 환경으로 변환:
- `.tip` -> `tipbox` (초록)
- `.info` -> `infobox` (파랑)
- `.warning` -> `warningbox` (주황)
- `.danger` -> `dangerbox` (빨강)
- `.abstract` -> `abstractbox` (보라)
- `.question` -> `questionbox` (청록)
- `.example` -> `examplebox` (파랑)

### 4.3 LaTeX 템플릿 (`book-template.tex`)
현재 구현된 주요 설정:
- **용지**: B5 (182x257mm) - 한국 교재 표준 사이즈
- **여백**: 상22/하25/좌22/우18mm
- **폰트**: Noto Sans KR (Regular/Bold)
- **줄간격**: 1.35
- **색상 체계**: primaryblue (#1565C0) 기반
- **구성**: 표지 -> 빈페이지 -> 판권 -> 목차 -> 본문

---

## 5. 학습 지원 기능 (TODO)

### 5.1 챕터별 학습 가이드 페이지
- 각 챕터 시작 전 1페이지 삽입
- 학습 목표, 예상 소요 시간, 선수 지식, 핵심 키워드

### 5.2 복습 문제
- OX 퀴즈, 빈칸 채우기, 단답형
- `book/exercises/chNN-exercises.md` 파일로 관리
- 빌드 시 각 챕터 끝에 자동 병합

### 5.3 용어 색인 (Index)
- 부록 C 용어사전 데이터 활용
- 본문 내 용어 등장 페이지 자동 수집

### 5.4 인쇄 최적화
- 양면 인쇄 대비 gutter margin
- 회색 배경 박스 인쇄 가독성 확보

---

## 6. 프로젝트 파일 구조

```
genai-book/
  book/                        <- 새로 추가
    build.sh                   # 원클릭 빌드
    preprocess.py              # 전처리 스크립트
    callout-filter.lua         # Pandoc Lua 필터
    templates/
      book.tex                 # LaTeX 메인 템플릿
    exercises/                 # 챕터별 복습 문제
      ch01-exercises.md
      ...
    output/                    # 빌드 결과물
      genai-book.pdf
```

---

## 7. 빌드 명령

```bash
cd book && ./build.sh          # 전체 교재 PDF 생성
```

빌드 스크립트 내부:
1. 각 챕터 .md 전처리
2. 챕터 순서대로 병합
3. Pandoc -> .tex 변환
4. XeLaTeX 2-pass 실행
5. output/ 에 최종 PDF 저장

---

## 8. 샘플 검증 결과

- **검증 대상**: Chapter 1 (생성형 AI란 무엇인가)
- **결과물**: `sample-chapter1-v2.pdf` (19페이지)
- **확인된 항목**:
  - 표지, 판권, 목차, 본문 정상 렌더링
  - 콜아웃 박스 (TIP/INFO/WARNING/DANGER/ABSTRACT) 컬러 구분
  - 표, 각주, 코드 블록 정상 표시
  - 한글 줄바꿈 정상
  - 헤더/푸터 정상

---

## 9. 다음 단계

1. 전체 13개 챕터 + 부록 PDF 빌드
2. 학습 가이드 페이지 템플릿 구현
3. 복습 문제 콘텐츠 작성
4. 용어 색인 자동 생성 구현
5. 헤더 "CHAPTER" 한글화
6. 표 너비 자동 조절 개선
7. ePub 변환 테스트
