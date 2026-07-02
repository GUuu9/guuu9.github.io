#!/bin/bash
# ==========================================
# Ubuntu 22.04 SSH 서비스 자동 기동 스크립트
# ==========================================

# 1. SSH 백그라운드 서비스 시작
echo "[System] Starting SSH server..."
sudo service ssh start

# 2. 컨테이너가 즉시 종료되는 것을 방지하기 위해 무한 대기 명령 실행
tail -f /dev/null