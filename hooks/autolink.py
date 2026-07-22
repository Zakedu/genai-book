"""autolink.py — mkdocs hook: 위키백과식 키워드 자동 연결

각 페이지 본문에서 '핵심 개념 용어'의 **첫 등장 1회**를 해당 위키 문서로 자동 링크합니다.
- 대상 용어: 위키 개념 문서(wiki/concepts/*) + 주요 위키 문서의 제목/별칭 (아래 TERMS)
- 보호: 코드블록/인라인코드/헤딩/이미 링크된 텍스트/표 구분선은 건드리지 않음
- 자기 자신 페이지에서는 자기 용어를 링크하지 않음 (순환 방지)
- 한 페이지에서 용어당 1회만 (과잉 링크 방지)

mkdocs.yml:  hooks: [hooks/autolink.py]
"""
from __future__ import annotations
import re

# (링크 대상 문서 경로[docs 기준, 확장자 제외], 매칭할 별칭들)
TERMS: list[tuple[str, list[str]]] = [
    ("wiki/concepts/hallucination",        ["환각", "Hallucination"]),
    ("wiki/concepts/prompt",               ["프롬프트", "Prompt"]),
    ("wiki/concepts/token",                ["토큰", "Token"]),
    ("wiki/concepts/context-window",       ["컨텍스트 윈도우", "Context Window"]),
    ("wiki/concepts/bias",                 ["편향성", "편향", "Bias"]),
    ("wiki/concepts/chain-of-thought",     ["Chain of Thought", "생각의 사슬"]),
    ("wiki/concepts/few-shot-learning",    ["Few-shot Learning", "퓨샷"]),
    ("wiki/concepts/role-playing",         ["역할 부여", "Role-playing"]),
    ("wiki/prompt-engineering/rag/overview",              ["검색 증강 생성", "RAG"]),
    ("wiki/prompt-engineering/rag/graphrag",              ["GraphRAG"]),
    ("wiki/prompt-engineering/rag/ontology-knowledge-graph", ["온톨로지", "지식 그래프"]),
    ("wiki/prompt-engineering/agents/mcp",               ["MCP", "Model Context Protocol"]),
    ("wiki/prompt-engineering/agents/langchain",         ["LangChain"]),
    ("wiki/prompt-engineering/agents/langgraph",         ["LangGraph"]),
    ("wiki/prompt-engineering/agents/introduction",      ["AI 에이전트", "에이전트"]),
    ("wiki/security/prompt-injection",     ["프롬프트 인젝션", "Prompt Injection"]),
    ("wiki/security/agent-security",       ["에이전트 보안"]),
    ("wiki/security/index",                ["AI 보안"]),
    ("wiki/governance/eu-ai-act",          ["EU AI Act"]),
    ("wiki/governance/enterprise-adoption", ["에이전틱 AI"]),
    ("wiki/prompt-engineering/applications/vibe-coding", ["바이브 코딩"]),
]

# 긴 별칭 우선(부분매칭 충돌 방지)
_FLAT: list[tuple[str, str]] = sorted(
    [(alias, tgt) for tgt, aliases in TERMS for alias in aliases],
    key=lambda x: -len(x[0]),
)


def _rel(from_url: str, to_doc: str) -> str:
    """현재 페이지 src_path(use_directory_urls) 기준 상대경로. 단순화: 루트 절대링크."""
    return "/" + to_doc + "/"  # site_url 하위 절대경로 — use_directory_urls=True 환경


def on_page_markdown(markdown: str, *, page, config, files, **kwargs):
    src = page.file.src_uri.replace(".md", "")  # 예: part4/ch09-hallucination
    used: set[str] = set()

    # 코드펜스 블록을 통째로 보호: 세그먼트로 쪼개 코드가 아닌 곳만 처리
    parts = re.split(r"(```.*?```|`[^`]+`)", markdown, flags=re.S)
    out = []
    for seg in parts:
        if seg.startswith("```") or (seg.startswith("`") and seg.endswith("`")):
            out.append(seg)  # 코드 — 그대로
            continue
        lines = seg.split("\n")
        for i, line in enumerate(lines):
            s = line.lstrip()
            # 헤딩/표구분/인용/리스트기호 줄, admonition 지시줄은 스킵
            if s.startswith("#") or re.match(r"^\|?[\s:|-]+$", s) or s.startswith("!!!") or s.startswith("    "):
                continue
            for alias, tgt in _FLAT:
                if tgt in used or tgt == src or tgt.split("/")[-1] in src:
                    continue
                # 이미 링크/속성 안이 아닌, 단어 경계의 첫 등장만
                pat = re.compile(r"(?<![\[\/\w])" + re.escape(alias) + r"(?![\w\]\(])")
                m = pat.search(line)
                if not m:
                    continue
                link = f"[{alias}]({_rel(src, tgt)})"
                line = line[:m.start()] + link + line[m.end():]
                used.add(tgt)
            lines[i] = line
        out.append("\n".join(lines))
    return "".join(out)
