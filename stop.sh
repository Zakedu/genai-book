#!/bin/bash
# 생성형 AI 완전 정복 - 서버 중단 스크립트

echo "🛑 서버 종료 중..."

# 챗봇 서버 종료
lsof -ti:8001 | xargs kill -9 2>/dev/null

# MkDocs 서버 종료
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "✅ 모든 서버가 종료되었습니다."
