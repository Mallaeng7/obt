#!/bin/bash
# RustPlusBot 업데이트 스크립트
# 서버에서 실행: bash deploy/update.sh

set -e

echo "🔄 [1/5] 최신 코드 가져오기..."
git pull origin main

echo "🛑 [2/5] 컨테이너 중지..."
docker-compose down

echo "🔨 [3/5] 이미지 재빌드..."
docker-compose build --no-cache

echo "🔍 [4/5] 빌드 확인..."
docker-compose config --services

echo "🚀 [5/5] 컨테이너 시작..."
docker-compose up -d

echo ""
echo "⏳ 컨테이너 상태 확인 중 (10초 대기)..."
sleep 10
docker-compose ps

echo ""
echo "📋 최근 로그:"
echo "=== BOT ==="
docker-compose logs --tail=20 bot
echo ""
echo "=== WEB ==="
docker-compose logs --tail=20 web
echo ""
echo "=== NGINX ==="
docker-compose logs --tail=10 nginx
