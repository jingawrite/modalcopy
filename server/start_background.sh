#!/bin/bash
# 백엔드 서버 백그라운드 시작 스크립트

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "맞춤법 검사 백엔드 서버를 백그라운드에서 시작합니다..."
echo "Python 버전 확인 중..."

python3 --version

echo "필요한 패키지 설치 중..."
pip3 install -r requirements.txt > /dev/null 2>&1

echo "기존 서버 프로세스 종료 중..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || echo "포트 5001에 실행 중인 프로세스가 없습니다"

echo "서버 시작 중... (백그라운드)"
nohup python3 app.py > server.log 2>&1 &
SERVER_PID=$!

echo "서버가 시작되었습니다. PID: $SERVER_PID"
echo "로그 파일: $SCRIPT_DIR/server.log"
echo ""
echo "서버 상태 확인:"
sleep 2
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ 서버가 정상적으로 실행 중입니다."
    echo "포트 5001에서 서비스 중입니다."
else
    echo "❌ 서버 시작에 실패했습니다. 로그를 확인하세요:"
    echo "   tail -f $SCRIPT_DIR/server.log"
fi

echo ""
echo "서버 종료 방법:"
echo "   kill $SERVER_PID"
echo "   또는"
echo "   lsof -ti:5001 | xargs kill -9"

