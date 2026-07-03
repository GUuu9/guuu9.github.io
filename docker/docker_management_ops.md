<!-- version: v1.0.0 -->
# 🐳 Docker 원격 개발 환경 구성 가이드 - 3편: 운영, 보안 및 트러블슈팅

이 가이드는 호스트 서버와 원격 개발 환경 구축 완료 후의 Docker 네트워크/볼륨 관리, 보안 강화 설정, 운영 노하우, 그리고 장애 복구를 위한 트러블슈팅 기법을 상세히 다룹니다.

---

## 📋 목차
1. [Docker 네트워크 및 볼륨 관리](#1-docker-네트워크-및-볼륨-관리)
2. [보안 강화 설정](#2-보안-강화-설정)
3. [운영 및 유지보수](#3-운영-및-유지보수)
4. [다중 프로젝트 병렬 운용 및 컨테이너 생명 주기 관리](#4-다중-프로젝트-병렬-운용-및-컨테이너-생명-주기-관리)
5. [트러블슈팅](#5-트러블슈팅)

---

## 1. Docker 네트워크 및 볼륨 관리

### 1-1. 커스텀 네트워크 생성
```bash
docker network create \
    --driver bridge \
    --subnet 172.20.0.0/16 \
    --gateway 172.20.0.1 \
    dev-network

docker network ls
docker network inspect dev-network
```

### 1-2. 볼륨 관리
```bash
docker volume create projects_data
docker volume ls
docker volume inspect projects_data

# 볼륨 데이터 백업
docker run --rm \
    -v projects_data:/data \
    -v /backup:/backup \
    ubuntu tar czf /backup/projects_backup_$(date +%Y%m%d).tar.gz /data
```

### 1-3. Portainer 설치 (Docker 웹 관리 UI)

> **Docker Desktop 사용 시 주의**: Docker Desktop은 사용자 공간에서 동작하므로 기본 소켓 경로가 `/var/run/docker.sock`이 아닌 `$HOME/.docker/desktop/docker.sock`입니다. 호스트 소켓 경로를 이에 맞춰 마운트해야 합니다.

```bash
docker volume create portainer_data

docker run -d \
    --name portainer \
    --restart unless-stopped \
    -p 9443:9443 \
    -v $HOME/.docker/desktop/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce:latest

# https://192.168.1.100:9443 → 초기 관리자 비밀번호 설정
```

---

## 2. 보안 강화 설정

### 2-1. SSH 키 기반 인증으로 전환
```bash
# 외부 PC에서 SSH 키 쌍 생성
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519

# 호스트 서버에 공개키 복사
ssh-copy-id $USER@192.168.1.100

# 컨테이너에 공개키 복사
cat ~/.ssh/id_ed25519.pub >> ~/docker-envs/ubuntu-dev/ssh_keys/authorized_keys

# 키 인증 확인 후 비밀번호 인증 비활성화
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### 2-2. Fail2ban 설치 (무차별 대입 방지)
```bash
sudo apt install -y fail2ban
sudo vim /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 600
bantime = 3600
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
sudo fail2ban-client status sshd
```

### 2-3. 컨테이너 리소스 제한
```yaml
services:
  ubuntu-dev:
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 4G
        reservations:
          cpus: "0.5"
          memory: 512M
```

### 2-4. 정기 보안 업데이트 자동화
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# "Yes" 선택 → 보안 업데이트 자동 적용
```

---

## 3. 운영 및 유지보수

### 3-1. 컨테이너 상태 확인
```bash
docker ps -a
docker stats
docker stats ubuntu-dev --no-stream
```

### 3-2. 로그 관리
```bash
docker logs ubuntu-dev --tail 100 -f
du -sh /var/lib/docker/containers/*/
```

### 3-3. 이미지 정리
```bash
docker system prune -af --volumes
docker images
docker rmi ubuntu-dev_ubuntu-dev
```

### 3-4. 컨테이너 백업 및 복원
```bash
# 현재 상태 스냅샷
docker commit ubuntu-dev ubuntu-dev-backup:$(date +%Y%m%d)

# 이미지 파일로 내보내기
docker save ubuntu-dev-backup:20260625 | gzip > ubuntu-dev-backup.tar.gz

# 복원
docker load < ubuntu-dev-backup.tar.gz
```

---

## 4. 다중 프로젝트 병렬 운용 및 컨테이너 생명 주기 관리

### 4-1. 다중 프로젝트 병렬 운용 (포트 충돌 회피)
호스트 서버에 여러 개의 개발 환경 컨테이너를 동시에 구동하여 병렬로 개발할 때, 컨테이너 내부 포트(예: 22번, 3000번)는 격리되어 동일하게 사용해도 무방하지만 **호스트 PC의 외부 매핑 포트**는 겹치지 않도록 유일하게 지정해야 합니다.

* **포트 포워딩 구성 예시**:
  * **프로젝트 A**: 호스트 포트 `2222:22` (SSH), `3000:3000` (Web)
  * **프로젝트 B**: 호스트 포트 `2223:22` (SSH), `3001:3000` (Web)

* **외부 PC config 구성**:
  ```text
  Host ProjectA-Container
      HostName 192.168.1.100
      Port 2222
      User developer

  Host ProjectB-Container
      HostName 192.168.1.100
      Port 2223
      User developer
  ```

### 4-2. 컨테이너 생명 주기 및 재빌드 없는 빠른 재연결
* **자동 중지 방지 및 제어**: VS Code 원격 세션을 닫으면 호스트 리소스 절약을 위해 해당 컨테이너가 자동으로 중지(`Stop`)될 수 있습니다.
* **빠른 시작 및 재연결**: 매번 `Reopen in Container`나 재빌드를 수행할 필요 없이, 호스트에서 컨테이너가 가동 중이라면 외부 PC에서 단 1초 만에 바로 SSH 접속을 통해 기존 작업 환경을 복원할 수 있습니다.
  ```bash
  # 호스트에서 컨테이너 수동 시작
  docker start ubuntu-dev
  ```
  이후 외부 PC의 VS Code에서 `Remote-SSH` 연결 프로필로 접속하면 즉시 원래 개발 창이 복구됩니다.

---

## 5. 트러블슈팅

### 문제 1: 외부에서 SSH 접속이 안 될 때
```bash
# 컨테이너 실행 여부 확인
docker ps | grep ubuntu-dev

# 포트 바인딩 확인
docker port ubuntu-dev
sudo ss -tlnp | grep 2222

# UFW 규칙 확인
sudo ufw status

# 컨테이너 내부 SSH 데몬 확인
docker exec ubuntu-dev ps aux | grep sshd
```

### 문제 2: 컨테이너가 시작되지 않을 때
```bash
docker compose logs ubuntu-dev
docker inspect ubuntu-dev | grep Status

# 이미지 재빌드
docker compose down
docker compose build --no-cache
docker compose up -d
```

### 문제 3: 볼륨 마운트 권한 오류
```bash
# 호스트 디렉토리 권한 확인
ls -la /data/projects

# 컨테이너 사용자 UID 확인
docker exec ubuntu-dev id developer

# 소유자 변경 (UID 1000은 예시)
sudo chown -R 1000:1000 /data/projects
```

### 문제 4: 디스크 공간 부족
```bash
docker system df
docker system prune -f
docker volume prune -f
docker image prune -af
```

### 문제 5: 컨테이너 간 네트워크 통신 안 될 때
```bash
docker network ls
docker network inspect dev-network
docker inspect ubuntu-dev | grep NetworkMode
docker exec ubuntu-dev ping -c 3 code-server
```

### 문제 6: VS Code Dev Container 연결 시 $PLATFORM undefined 에러
클라이언트 VS Code가 컨테이너 내부에 VS Code Server 바이너리를 다운로드하고 파싱하는 과정에서 필수 도구 부재로 에러가 발생할 수 있습니다.
* **해결 방법**:
  1. Dockerfile 내에 패키지 압축 해제 및 아키텍처 조회에 필요한 `tar`, `binutils`, `dbus` 유틸리티를 명시적으로 설치하는 구문이 있는지 확인하고 컨테이너를 재빌드(Rebuild)합니다.
  2. `devcontainer.json` 설정에 `terminal.integrated.defaultProfile.linux` 항목 값을 `bash`로 명시해줍니다.
  3. 컨테이너 내부 터미널로 진입하여 불완전하게 설치된 `.vscode-server` 폴더를 `rm -rf ~/.vscode-server` 명령으로 완전히 지우고 다시 접속을 시도합니다.

### 문제 7: Host Key Verification Failed (보안 경고) 에러
컨테이너를 Rebuild하거나 재생성할 때 SSH 호스트 키 정보가 변경되어 외부 PC에서 접속을 거부하는 경우입니다.
* **해결 방법**:
  * 클라이언트 PC의 터미널(Git Bash, Powershell 등)에서 해당 IP/포트에 대해 기존 등록된 호스트 키 정보를 삭제해줍니다.
  ```bash
  ssh-keygen -R 192.168.1.100
  # 또는 특정 포트가 매핑된 경우
  ssh-keygen -R [192.168.1.100]:2222
  ```

---
* [1편: 호스트 및 Docker Desktop 설치 가이드](./docker_remote_dev_env.md)
* [2편: 컨테이너 개발 환경 구축 가이드](./docker_container_setup.md)
