#!/bin/bash
# 백엔드 서버 시작 스크립트

echo "맞춤법 검사 백엔드 서버를 시작합니다..."
echo "Python 버전 확인 중..."

python3 --version

echo "필요한 패키지 설치 중..."
pip3 install -r requirements.txt

echo "서버 시작 중..."
python3 app.py

