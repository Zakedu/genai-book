"""
GenAI Book 챗봇 백엔드 서버
- FastAPI 기반
- Ollama LLM 연동
- ChromaDB 벡터 검색
"""

import os
import json
from pathlib import Path
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from chromadb.config import Settings
import httpx

# 설정
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL = "bge-m3"
CHAT_MODEL = "gemini-3-flash-preview:cloud"
COLLECTION_NAME = "genai_book"
CHROMA_PATH = Path(__file__).parent / "chroma_db"

# 전역 변수
chroma_client = None
collection = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 시작/종료 시 실행"""
    global chroma_client, collection

    # ChromaDB 초기화
    chroma_client = chromadb.PersistentClient(
        path=str(CHROMA_PATH),
        settings=Settings(anonymized_telemetry=False)
    )

    # 컬렉션 가져오기 또는 생성
    try:
        collection = chroma_client.get_collection(COLLECTION_NAME)
        print(f"Loaded collection '{COLLECTION_NAME}' with {collection.count()} documents")
    except Exception:
        collection = chroma_client.create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        print(f"Created new collection '{COLLECTION_NAME}'")

    yield

    # 종료 시 정리
    print("Shutting down...")


app = FastAPI(
    title="GenAI Book Chatbot API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용, 프로덕션에서는 제한 필요
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    history: Optional[list] = []


class ChatResponse(BaseModel):
    response: str
    sources: list[dict]


async def get_embedding(text: str) -> list[float]:
    """Ollama를 사용해 텍스트 임베딩 생성"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/embeddings",
            json={"model": EMBED_MODEL, "prompt": text},
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()["embedding"]


async def generate_response(prompt: str, context: str, history: list) -> str:
    """Ollama를 사용해 응답 생성"""

    # 시스템 프롬프트
    system_prompt = """당신은 '생성형 AI 완전 정복' 교재의 학습 도우미입니다.
주어진 문서 내용을 바탕으로 정확하고 친절하게 답변해주세요.

규칙:
1. 문서에 있는 내용만 답변하세요
2. 모르는 내용은 "교재에서 해당 내용을 찾지 못했습니다"라고 답하세요
3. 답변은 간결하고 명확하게 작성하세요
4. 가능하면 관련 챕터나 섹션을 안내해주세요"""

    # 대화 히스토리 구성
    messages = [{"role": "system", "content": system_prompt}]

    for h in history[-4:]:  # 최근 4개 대화만 포함
        messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})

    # 현재 질문 + 컨텍스트
    user_message = f"""참고 문서:
{context}

질문: {prompt}"""

    messages.append({"role": "user", "content": user_message})

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={
                "model": CHAT_MODEL,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 1024
                }
            },
            timeout=60.0
        )
        response.raise_for_status()
        return response.json()["message"]["content"]


@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {
        "status": "ok",
        "collection_count": collection.count() if collection else 0
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """챗봇 대화 API"""

    if not request.message.strip():
        raise HTTPException(status_code=400, detail="메시지를 입력해주세요")

    if not collection or collection.count() == 0:
        raise HTTPException(
            status_code=503,
            detail="문서가 인덱싱되지 않았습니다. indexer.py를 먼저 실행해주세요."
        )

    try:
        # 1. 질문 임베딩
        query_embedding = await get_embedding(request.message)

        # 2. 유사 문서 검색
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=5,
            include=["documents", "metadatas", "distances"]
        )

        # 3. 컨텍스트 구성
        contexts = []
        sources = []

        for i, (doc, meta, dist) in enumerate(zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        )):
            contexts.append(f"[{i+1}] {doc}")
            sources.append({
                "title": meta.get("title", ""),
                "chapter": meta.get("chapter", ""),
                "section": meta.get("section", ""),
                "url": meta.get("url", ""),
                "relevance": round(1 - dist, 3)  # 거리를 유사도로 변환
            })

        context_text = "\n\n".join(contexts)

        # 4. LLM 응답 생성
        response = await generate_response(
            request.message,
            context_text,
            request.history
        )

        # 상위 3개 소스만 반환
        top_sources = [s for s in sources if s["relevance"] > 0.3][:3]

        return ChatResponse(response=response, sources=top_sources)

    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Ollama 연결 오류: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")


@app.get("/api/stats")
async def get_stats():
    """인덱싱 통계"""
    if not collection:
        return {"indexed": False, "count": 0}

    return {
        "indexed": True,
        "count": collection.count(),
        "model": {
            "embed": EMBED_MODEL,
            "chat": CHAT_MODEL
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
