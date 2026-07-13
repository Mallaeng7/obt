#!/bin/bash
# RustPlusBot 업데이트 스크립트
# 서버에서 실행: bash deploy/update.sh

set -e

echo "🔄 [1/4] 최신 코드 가져오기..."
git pull origin main

echo "🛑 [2/4] 컨테이너 중지..."
docker-compose down

echo "🔨 [3/4] 이미지 재빌드 (캐시 없이)..."
docker-compose build --no-cache bot

echo "🚀 [4/4] 컨테이너 재시작..."
docker-compose up -d

echo ""
echo "✅ 업데이트 완료! 로그 확인:"
echo "   docker-compose logs -f bot"
