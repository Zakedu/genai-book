"""
마크다운 문서 인덱싱 스크립트
- docs/ 폴더의 모든 .md 파일을 읽어서
- 섹션별로 청킹하고
- ChromaDB에 임베딩과 함께 저장
"""

import os
import re
import json
import hashlib
from pathlib import Path
from typing import Generator

import httpx
import chromadb
from chromadb.config import Settings

# 설정
DOCS_PATH = Path(__file__).parent.parent / "docs"
CHROMA_PATH = Path(__file__).parent / "chroma_db"
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL = "bge-m3"
COLLECTION_NAME = "genai_book"

# 제외할 파일/폴더
EXCLUDE_PATTERNS = [
    "tags.md",
    "index.md",  # 인덱스 페이지는 내용이 적음
]


def get_embedding(text: str) -> list[float]:
    """Ollama를 사용해 텍스트 임베딩 생성 (동기)"""
    response = httpx.post(
        f"{OLLAMA_BASE_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": text},
        timeout=30.0
    )
    response.raise_for_status()
    return response.json()["embedding"]


def extract_frontmatter(content: str) -> tuple[dict, str]:
    """YAML frontmatter 추출"""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            try:
                import yaml
                frontmatter = yaml.safe_load(parts[1])
                return frontmatter or {}, parts[2].strip()
            except Exception:
                pass
    return {}, content


def chunk_markdown(content: str, file_path: Path) -> Generator[dict, None, None]:
    """마크다운 파일을 섹션별로 청킹"""

    frontmatter, body = extract_frontmatter(content)

    # 파일 경로에서 메타데이터 추출
    relative_path = file_path.relative_to(DOCS_PATH)
    url_path = str(relative_path).replace(".md", "/")

    # 챕터 정보 추출
    chapter_match = re.search(r"ch(\d+)", file_path.name)
    chapter = f"Chapter {chapter_match.group(1)}" if chapter_match else ""

    # 파트 정보
    part = ""
    if "part0" in str(file_path):
        part = "Part 0: 서론"
    elif "part1" in str(file_path):
        part = "Part 1: 이해"
    elif "part2" in str(file_path):
        part = "Part 2: 원리"
    elif "part3" in str(file_path):
        part = "Part 3: 활용"
    elif "part4" in str(file_path):
        part = "Part 4: 위험관리"
    elif "part5" in str(file_path):
        part = "Part 5: 미래"
    elif "appendix" in str(file_path):
        part = "부록"
    elif "wiki" in str(file_path):
        part = "위키"

    # 제목 추출
    title_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    title = title_match.group(1) if title_match else file_path.stem

    # H2 섹션 기준으로 분할
    sections = re.split(r"\n(?=##\s)", body)

    for i, section in enumerate(sections):
        section = section.strip()
        if not section or len(section) < 50:  # 너무 짧은 섹션 제외
            continue

        # 섹션 제목 추출
        section_title_match = re.search(r"^##\s+(.+)$", section, re.MULTILINE)
        section_title = section_title_match.group(1) if section_title_match else ""

        # 마크다운 문법 정리
        clean_text = clean_markdown(section)

        if len(clean_text) < 30:  # 정리 후에도 너무 짧으면 제외
            continue

        # 청크가 너무 길면 분할
        max_chunk_size = 1500
        if len(clean_text) > max_chunk_size:
            # 문단 단위로 분할
            paragraphs = clean_text.split("\n\n")
            current_chunk = ""

            for para in paragraphs:
                if len(current_chunk) + len(para) > max_chunk_size:
                    if current_chunk:
                        yield create_chunk(
                            current_chunk, title, chapter, part,
                            section_title, url_path, frontmatter
                        )
                    current_chunk = para
                else:
                    current_chunk += "\n\n" + para if current_chunk else para

            if current_chunk:
                yield create_chunk(
                    current_chunk, title, chapter, part,
                    section_title, url_path, frontmatter
                )
        else:
            yield create_chunk(
                clean_text, title, chapter, part,
                section_title, url_path, frontmatter
            )


def create_chunk(text: str, title: str, chapter: str, part: str,
                 section: str, url: str, frontmatter: dict) -> dict:
    """청크 객체 생성"""
    # 고유 ID 생성
    chunk_id = hashlib.md5(f"{url}:{section}:{text[:100]}".encode()).hexdigest()

    return {
        "id": chunk_id,
        "text": text,
        "metadata": {
            "title": title,
            "chapter": chapter,
            "part": part,
            "section": section,
            "url": url,
            "tags": ",".join(frontmatter.get("tags", []))
        }
    }


def clean_markdown(text: str) -> str:
    """마크다운 문법 제거"""
    # 코드 블록 제거
    text = re.sub(r"```[\s\S]*?```", "[코드 블록]", text)

    # 인라인 코드
    text = re.sub(r"`([^`]+)`", r"\1", text)

    # 링크
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)

    # 이미지
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"[이미지: \1]", text)

    # 헤더 마커 제거 (텍스트는 유지)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)

    # 강조 문법
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)

    # admonition 정리
    text = re.sub(r'!!!\s+\w+\s+"([^"]+)"', r"[\1]", text)
    text = re.sub(r"!!!\s+\w+", "", text)

    # 테이블 구분선
    text = re.sub(r"\|[-:]+\|", "", text)

    # 연속 공백/줄바꿈 정리
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"  +", " ", text)

    return text.strip()


def index_documents():
    """문서 인덱싱 실행"""

    print(f"문서 경로: {DOCS_PATH}")
    print(f"ChromaDB 경로: {CHROMA_PATH}")

    # ChromaDB 초기화
    client = chromadb.PersistentClient(
        path=str(CHROMA_PATH),
        settings=Settings(anonymized_telemetry=False)
    )

    # 기존 컬렉션 삭제 후 재생성
    try:
        client.delete_collection(COLLECTION_NAME)
        print(f"기존 컬렉션 '{COLLECTION_NAME}' 삭제")
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"}
    )

    # 마크다운 파일 수집
    md_files = list(DOCS_PATH.rglob("*.md"))
    print(f"발견된 마크다운 파일: {len(md_files)}개")

    total_chunks = 0
    errors = []

    for file_path in md_files:
        # 제외 패턴 체크
        if any(pattern in str(file_path) for pattern in EXCLUDE_PATTERNS):
            continue

        try:
            content = file_path.read_text(encoding="utf-8")
            chunks = list(chunk_markdown(content, file_path))

            if not chunks:
                continue

            print(f"처리 중: {file_path.name} ({len(chunks)}개 청크)")

            for chunk in chunks:
                try:
                    # 임베딩 생성
                    embedding = get_embedding(chunk["text"])

                    # ChromaDB에 저장
                    collection.add(
                        ids=[chunk["id"]],
                        embeddings=[embedding],
                        documents=[chunk["text"]],
                        metadatas=[chunk["metadata"]]
                    )
                    total_chunks += 1

                except Exception as e:
                    errors.append(f"{file_path.name}: {str(e)}")

        except Exception as e:
            errors.append(f"{file_path.name}: {str(e)}")

    print(f"\n인덱싱 완료!")
    print(f"총 청크 수: {total_chunks}")
    print(f"컬렉션 문서 수: {collection.count()}")

    if errors:
        print(f"\n오류 ({len(errors)}개):")
        for err in errors[:10]:
            print(f"  - {err}")


if __name__ == "__main__":
    index_documents()
