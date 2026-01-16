#!/bin/bash
# 생성형 AI 완전 정복 - 서버 시작 스크립트

cd "$(dirname "$0")"

# 가상환경 활성화
if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "🚀 서버 시작 중..."

# 챗봇 서버 시작 (백그라운드)
cd chatbot
python3 -m uvicorn server:app --host 0.0.0.0 --port 8001 &
CHATBOT_PID=$!
cd ..

# MkDocs 서버 시작 (백그라운드, 외부 공개)
python3 -m mkdocs serve --dev-addr 0.0.0.0:8000 &
MKDOCS_PID=$!

# 로컬 IP 주소 가져오기
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}')

echo ""
echo "✅ 서버가 시작되었습니다!"
echo "   📖 문서: http://127.0.0.1:8000 (로컬)"
echo "   📖 문서: http://${LOCAL_IP}:8000 (네트워크)"
echo "   🤖 챗봇: http://127.0.0.1:8001"
echo ""
echo "종료하려면 Ctrl+C를 누르세요."

# Ctrl+C 시 두 프로세스 모두 종료
trap "echo ''; echo '🛑 서버 종료 중...'; kill $CHATBOT_PID $MKDOCS_PID 2>/dev/null; exit" SIGINT SIGTERM

# 프로세스 대기
wait
