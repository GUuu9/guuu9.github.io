<!-- version: v1.0.0 -->
# 🐳 Ubuntu 22.04 기반 Docker 원격 개발 환경 구성 가이드

> **목표**: Ubuntu 22.04.05 GUI 호스트 서버에 Docker를 설치하고,  
> 외부 PC에서 SSH / VS Code Remote / 브라우저 등 다양한 방법으로  
> 컨테이너(Linux · Windows 개발 환경)에 접근하는 환경을 단계별로 구성한다.

---

## 📋 목차

1. [사전 준비 및 환경 확인](#1-사전-준비-및-환경-확인)
2. [Ubuntu 22.04 초기 설정](#2-ubuntu-2204-초기-설정)
3. [Docker Engine 설치](#3-docker-engine-설치)
4. [Docker Compose 설치](#4-docker-compose-설치)
5. [외부 접근을 위한 네트워크 설정](#5-외부-접근을-위한-네트워크-설정)
6. [SSH 기반 원격 접근 컨테이너 구성 (Linux 개발 환경)](#6-ssh-기반-원격-접근-컨테이너-구성-linux-개발-환경)
7. [VS Code Remote Development 연결](#7-vs-code-remote-development-연결)
8. [Browser 기반 접근: code-server 컨테이너](#8-browser-기반-접근-code-server-컨테이너)
9. [Windows 개발 환경 컨테이너 구성 (Wine / QEMU)](#9-windows-개발-환경-컨테이너-구성-wine--qemu)
10. [Docker 네트워크 및 볼륨 관리](#10-docker-네트워크-및-볼륨-관리)
11. [보안 강화 설정](#11-보안-강화-설정)
12. [운영 및 유지보수](#12-운영-및-유지보수)
13. [트러블슈팅](#13-트러블슈팅)

---

## 1. 사전 준비 및 환경 확인

### 1-1. 전체 아키텍처

```
[ 외부 PC (Windows/Mac/Linux) ]
        │
        │  SSH (포트 22xx) / HTTPS (포트 443)
        │  VS Code Remote / 브라우저
        ▼
[ Ubuntu 22.04.05 호스트 서버 ]
        │
        │  Docker Engine
        ├─── [ 컨테이너 A: Ubuntu 22.04 개발환경 ] ← SSH :2222
        ├─── [ 컨테이너 B: code-server (브라우저 IDE) ] ← HTTP :8080
        ├─── [ 컨테이너 C: Windows (QEMU/KVM) ] ← RDP :3389
        └─── [ 공유 볼륨: /data/projects ]
```

### 1-2. 필요 사양

| 항목 | 최소 사양 | 권장 사양 |
|------|-----------|-----------|
| CPU  | 4코어      | 8코어 이상 |
| RAM  | 8GB       | 16GB 이상  |
| 디스크 | 50GB SSD | 200GB NVMe |
| OS   | Ubuntu 22.04.05 LTS | Ubuntu 22.04.05 LTS |
| 네트워크 | 유선 100Mbps | 유선 1Gbps |

### 1-3. 호스트 정보 확인

```bash
# OS 버전 확인
lsb_release -a

# 커널 버전 확인
uname -r

# CPU / RAM 확인
lscpu
free -h

# 디스크 확인
df -h

# 네트워크 인터페이스 확인
ip addr show
```

---

## 2. Ubuntu 22.04 초기 설정

### 2-1. 시스템 업데이트

```bash
# 패키지 목록 갱신 및 전체 업그레이드
sudo apt update && sudo apt upgrade -y

# 불필요한 패키지 제거
sudo apt autoremove -y
```

### 2-2. 필수 패키지 설치

```bash
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    net-tools \
    ufw \
    openssh-server \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    apt-transport-https
```

### 2-3. 호스트 SSH 서버 설정

> 외부 PC에서 호스트 서버 자체에 SSH로 접속하기 위한 설정

```bash
# SSH 서버 상태 확인
sudo systemctl status ssh

# SSH 서버 시작 및 자동 시작 등록
sudo systemctl enable ssh
sudo systemctl start ssh

# SSH 설정 파일 백업 후 편집
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sudo vim /etc/ssh/sshd_config
```

**`/etc/ssh/sshd_config` 주요 설정**

```ini
# SSH 기본 포트 변경 (보안 강화)
Port 2022

# 루트 로그인 비활성화
PermitRootLogin no

# 비밀번호 인증 허용 (초기 설정 후 키 인증으로 전환 권장)
PasswordAuthentication yes

# 공개키 인증 활성화
PubkeyAuthentication yes

# X11 포워딩 (GUI 앱 원격 사용 시)
X11Forwarding yes
```

```bash
# SSH 서비스 재시작
sudo systemctl restart ssh
```

### 2-4. 방화벽(UFW) 기본 설정

```bash
# UFW 활성화
sudo ufw enable

# 기본 정책: 들어오는 트래픽 차단, 나가는 트래픽 허용
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 호스트 SSH 포트 허용
sudo ufw allow 2022/tcp comment '호스트 SSH'

# UFW 상태 확인
sudo ufw status verbose
```

### 2-5. 일반 사용자 계정 생성 (선택)

```bash
# 새 사용자 생성
sudo adduser devuser

# sudo 권한 부여
sudo usermod -aG sudo devuser

# 사용자 전환
su - devuser
```

---

## 3. Docker Engine 설치

### 3-1. 기존 Docker 제거 (있을 경우)

```bash
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
```

### 3-2. Docker 공식 GPG 키 및 저장소 추가

```bash
# GPG 키 저장 디렉토리 생성
sudo install -m 0755 -d /etc/apt/keyrings

# Docker 공식 GPG 키 다운로드
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    -o /etc/apt/keyrings/docker.asc

# GPG 키 권한 설정
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Docker 저장소 추가
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 패키지 목록 갱신
sudo apt update
```

### 3-3. Docker Engine 설치

```bash
# Docker Engine, CLI, containerd, Buildx, Compose 플러그인 설치
sudo apt install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
```

### 3-4. Docker 서비스 활성화

```bash
# Docker 시작 및 자동 시작 등록
sudo systemctl enable docker
sudo systemctl start docker

# 상태 확인
sudo systemctl status docker
```

### 3-5. 현재 사용자를 docker 그룹에 추가

```bash
# docker 그룹에 현재 사용자 추가 (sudo 없이 docker 명령 사용)
sudo usermod -aG docker $USER

# 변경 사항 즉시 적용 (로그아웃 없이)
newgrp docker

# Docker 설치 확인
docker --version
docker run hello-world
```

### 3-6. Docker 데이터 디렉토리 변경 (선택 - 디스크 분리 시)

```bash
# Docker 데이터 기본 위치: /var/lib/docker
# 별도 파티션/디스크로 변경하려면

sudo systemctl stop docker

sudo vim /etc/docker/daemon.json
```

```json
{
  "data-root": "/data/docker",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
```

```bash
# 기존 데이터 이동
sudo rsync -aP /var/lib/docker/ /data/docker/

# Docker 재시작
sudo systemctl start docker
```

---

## 4. Docker Compose 설치

> Docker Compose V2는 Docker Engine 설치 시 플러그인으로 함께 설치된다.

```bash
# 버전 확인
docker compose version

# 독립 실행형 docker-compose 추가 설치 (선택)
sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

---

## 5. 외부 접근을 위한 네트워크 설정

### 5-1. 호스트 고정 IP 설정

```bash
# Netplan 설정 파일 확인
ls /etc/netplan/

# 설정 파일 편집 (파일명은 환경마다 다를 수 있음)
sudo vim /etc/netplan/00-installer-config.yaml
```

```yaml
# /etc/netplan/00-installer-config.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:                        # 네트워크 인터페이스명 (ip addr로 확인)
      dhcp4: no
      addresses:
        - 192.168.1.100/24        # 호스트 서버 고정 IP
      routes:
        - to: default
          via: 192.168.1.1        # 게이트웨이
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
```

```bash
# 설정 적용
sudo netplan apply

# 네트워크 확인
ip addr show
ping -c 3 google.com
```

### 5-2. 컨테이너별 포트 계획

| 컨테이너 | 용도 | 호스트 포트 | 컨테이너 포트 |
|---------|------|------------|--------------|
| ubuntu-dev | SSH 접근 개발환경 | 2222 | 22 |
| code-server | 브라우저 기반 IDE | 8080 | 8080 |
| windows-dev | Windows RDP | 3389 | 3389 |
| portainer | Docker 웹 관리 | 9443 | 9443 |

### 5-3. UFW 컨테이너 포트 허용

```bash
# 컨테이너 SSH 포트
sudo ufw allow 2222/tcp comment '컨테이너 Ubuntu SSH'

# code-server 웹 IDE 포트
sudo ufw allow 8080/tcp comment 'code-server 브라우저 IDE'

# Windows RDP 포트
sudo ufw allow 3389/tcp comment 'Windows RDP'

# Portainer 관리 UI
sudo ufw allow 9443/tcp comment 'Portainer HTTPS'

# 특정 IP만 허용하는 경우 (보안 강화)
# sudo ufw allow from 192.168.1.50 to any port 2222 comment '특정 PC만 허용'

sudo ufw status numbered
```

### 5-4. 공유기 포트 포워딩 (외부 인터넷에서 접근 시)

> 내부 네트워크가 아닌 인터넷을 통한 외부 접근이 필요한 경우

```
공유기 관리자 페이지 접속 (보통 192.168.1.1)
→ NAT / 포트 포워딩 메뉴
→ 아래 규칙 추가:

외부포트 2022  → 내부IP 192.168.1.100 : 2022  (호스트 SSH)
외부포트 2222  → 내부IP 192.168.1.100 : 2222  (컨테이너 SSH)
외부포트 8080  → 내부IP 192.168.1.100 : 8080  (code-server)
외부포트 9443  → 내부IP 192.168.1.100 : 9443  (Portainer)
```

---

## 6. SSH 기반 원격 접근 컨테이너 구성 (Linux 개발 환경)

### 6-1. 프로젝트 디렉토리 구조 생성

```bash
mkdir -p ~/docker-envs/ubuntu-dev
cd ~/docker-envs/ubuntu-dev
```

### 6-2. Dockerfile 작성

```bash
vim Dockerfile
```

```dockerfile
# ~/docker-envs/ubuntu-dev/Dockerfile
FROM ubuntu:22.04

# 비대화형 모드 설정 (apt 설치 중 입력 방지)
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Seoul

# 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    openssh-server \
    build-essential \
    git \
    curl \
    wget \
    vim \
    nano \
    htop \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    sudo \
    locales \
    tzdata \
    net-tools \
    iputils-ping \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 한국어 로케일 설정
RUN locale-gen ko_KR.UTF-8
ENV LANG=ko_KR.UTF-8
ENV LANGUAGE=ko_KR:ko
ENV LC_ALL=ko_KR.UTF-8

# Node.js LTS 설치
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# SSH 설정
RUN mkdir -p /var/run/sshd

# 개발자 사용자 생성
ARG DEV_USER=developer
ARG DEV_PASSWORD=devpass123
RUN useradd -m -s /bin/bash ${DEV_USER} \
    && echo "${DEV_USER}:${DEV_PASSWORD}" | chpasswd \
    && usermod -aG sudo ${DEV_USER} \
    && echo "${DEV_USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# SSH 키 디렉토리 생성
RUN mkdir -p /home/${DEV_USER}/.ssh \
    && chmod 700 /home/${DEV_USER}/.ssh \
    && chown -R ${DEV_USER}:${DEV_USER} /home/${DEV_USER}/.ssh

# SSH 서버 설정
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config \
    && sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config \
    && sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

WORKDIR /home/${DEV_USER}

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
```

### 6-3. docker-compose.yml 작성

```yaml
# ~/docker-envs/ubuntu-dev/docker-compose.yml
version: "3.9"

services:
  ubuntu-dev:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        DEV_USER: developer
        DEV_PASSWORD: devpass123
    container_name: ubuntu-dev
    hostname: ubuntu-dev-container
    restart: unless-stopped
    ports:
      - "2222:22"
    volumes:
      - projects_data:/home/developer/projects
      - ./ssh_keys:/home/developer/.ssh:ro
    environment:
      - TZ=Asia/Seoul
    networks:
      - dev-network
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 4G

volumes:
  projects_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /data/projects

networks:
  dev-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 6-4. 공유 디렉토리 및 SSH 키 설정

```bash
# 공유 프로젝트 디렉토리 생성
sudo mkdir -p /data/projects
sudo chown $USER:$USER /data/projects

# SSH 공개키 디렉토리 생성
mkdir -p ~/docker-envs/ubuntu-dev/ssh_keys

# 외부 PC의 공개키를 authorized_keys에 추가
vim ~/docker-envs/ubuntu-dev/ssh_keys/authorized_keys
chmod 600 ~/docker-envs/ubuntu-dev/ssh_keys/authorized_keys
```

### 6-5. 컨테이너 빌드 및 실행

```bash
cd ~/docker-envs/ubuntu-dev

# 이미지 빌드
docker compose build

# 컨테이너 백그라운드 실행
docker compose up -d

# 실행 상태 확인
docker compose ps
docker compose logs -f ubuntu-dev
```

### 6-6. 외부 PC에서 SSH 접속 테스트

```bash
# 비밀번호 인증
ssh -p 2222 developer@192.168.1.100

# SSH 키 인증 방식
ssh -i ~/.ssh/id_rsa -p 2222 developer@192.168.1.100
```

> **`~/.ssh/config`에 등록하면 편리**

```ini
Host ubuntu-dev-container
    HostName 192.168.1.100
    Port 2222
    User developer
    IdentityFile ~/.ssh/id_rsa
```

---

## 7. VS Code Remote Development 연결

### 7-1. VS Code 확장 설치 (외부 PC에서)

```
VS Code → Extensions → 검색:
  "Remote Development" (ms-vscode-remote.vscode-remote-extensionpack)
  → Remote SSH, Dev Containers, Remote WSL 포함
```

### 7-2. SSH Config 등록

```ini
# ~/.ssh/config (외부 PC)
Host ubuntu-container
    HostName 192.168.1.100
    Port 2222
    User developer
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

### 7-3. VS Code에서 원격 접속 순서

```
1. VS Code 좌측 하단 "><" 버튼 클릭
   또는 F1 → "Remote-SSH: Connect to Host..." 입력

2. "ubuntu-container" 선택

3. 처음 접속 시 VS Code Server가 컨테이너에 자동 설치됨

4. 폴더 열기: /home/developer/projects

5. 로컬처럼 원격 컨테이너에서 개발 가능
```

### 7-4. Dev Containers로 직접 접속

```
F1 → "Dev Containers: Attach to Running Container..."
→ "ubuntu-dev" 선택
→ 컨테이너 내부에서 직접 작업
```

---

## 8. Browser 기반 접근: code-server 컨테이너

> 클라이언트에 VS Code 설치 없이 **브라우저만으로** 개발 환경 접근

### 8-1. 디렉토리 및 설정 파일 생성

```bash
mkdir -p ~/docker-envs/code-server/config
cd ~/docker-envs/code-server

vim config/config.yaml
```

```yaml
# config/config.yaml
bind-addr: 0.0.0.0:8080
auth: password
password: your_secure_password_here   # 강력한 비밀번호로 변경
cert: false
```

### 8-2. docker-compose.yml 작성

```yaml
# ~/docker-envs/code-server/docker-compose.yml
version: "3.9"

services:
  code-server:
    image: codercom/code-server:latest
    container_name: code-server
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - code_server_data:/home/coder/.local/share/code-server
      - /data/projects:/home/coder/projects
      - ./config:/home/coder/.config/code-server
    environment:
      - TZ=Asia/Seoul
    networks:
      - dev-network
    user: "1000:1000"

volumes:
  code_server_data:

networks:
  dev-network:
    external: true
    name: ubuntu-dev_dev-network
```

### 8-3. 실행 및 접속

```bash
docker compose up -d

# 브라우저에서 접속
# http://192.168.1.100:8080
# → 설정한 비밀번호 입력 후 브라우저에서 VS Code 사용
```

---

## 9. Windows 개발 환경 컨테이너 구성 (Wine / QEMU)

> Docker 컨테이너는 Linux 커널 기반이므로 네이티브 Windows 실행은 불가.  
> **방법 A**: Wine (Windows 앱 에뮬레이터, 가벼움)  
> **방법 B**: QEMU/KVM (하드웨어 가상화, 완전한 Windows 환경)

### 방법 A: Wine + noVNC 컨테이너

```bash
mkdir -p ~/docker-envs/wine-env
cd ~/docker-envs/wine-env
```

**Dockerfile**

```dockerfile
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Seoul
ENV DISPLAY=:1

RUN dpkg --add-architecture i386

RUN apt-get update && apt-get install -y \
    wine64 wine32 winetricks \
    xvfb x11vnc \
    novnc websockify \
    openssh-server sudo \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash winuser \
    && echo "winuser:winpass123" | chpasswd \
    && usermod -aG sudo winuser

RUN mkdir -p /var/run/sshd

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 22 5900 6080

CMD ["/start.sh"]
```

**start.sh**

```bash
#!/bin/bash
service ssh start

# 가상 디스플레이 시작
Xvfb :1 -screen 0 1920x1080x24 &
sleep 2

# VNC 서버 시작
x11vnc -display :1 -nopw -listen 0.0.0.0 -xkb -forever &

# noVNC 웹 클라이언트 시작
websockify --web=/usr/share/novnc/ 6080 localhost:5900 &

wait
```

**docker-compose.yml**

```yaml
version: "3.9"

services:
  wine-env:
    build: .
    container_name: wine-env
    restart: unless-stopped
    ports:
      - "2223:22"     # SSH
      - "5900:5900"   # VNC
      - "6081:6080"   # noVNC 웹 접속
    volumes:
      - wine_data:/home/winuser/.wine
      - /data/projects:/home/winuser/projects
    environment:
      - TZ=Asia/Seoul
    networks:
      - dev-network

volumes:
  wine_data:

networks:
  dev-network:
    external: true
    name: ubuntu-dev_dev-network
```

```bash
docker compose up -d

# 브라우저로 noVNC 접속
# http://192.168.1.100:6081/vnc.html
```

### 방법 B: QEMU/KVM Windows VM

```bash
# KVM 지원 여부 확인 (0이면 미지원)
egrep -c '(vmx|svm)' /proc/cpuinfo

# KVM 관련 패키지 설치
sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

sudo usermod -aG kvm,libvirt $USER
newgrp libvirt

# Docker에서 KVM 접근 허용 컨테이너 실행
docker run -d \
    --name windows-kvm \
    --privileged \
    --device /dev/kvm \
    -p 3389:3389 \
    -v /data/windows-disk:/storage \
    -e RAM_SIZE=4G \
    -e CPU_CORES=2 \
    dockurr/windows:latest
```

> **⚠️ 주의**: Windows를 사용하려면 정식 라이선스가 필요합니다.

---

## 10. Docker 네트워크 및 볼륨 관리

### 10-1. 커스텀 네트워크 생성

```bash
docker network create \
    --driver bridge \
    --subnet 172.20.0.0/16 \
    --gateway 172.20.0.1 \
    dev-network

docker network ls
docker network inspect dev-network
```

### 10-2. 볼륨 관리

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

### 10-3. Portainer 설치 (Docker 웹 관리 UI)

```bash
docker volume create portainer_data

docker run -d \
    --name portainer \
    --restart unless-stopped \
    -p 9443:9443 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce:latest

# https://192.168.1.100:9443 → 초기 관리자 비밀번호 설정
```

---

## 11. 보안 강화 설정

### 11-1. SSH 키 기반 인증으로 전환

```bash
# 외부 PC에서 SSH 키 쌍 생성
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519

# 호스트 서버에 공개키 복사
ssh-copy-id -p 2022 $USER@192.168.1.100

# 컨테이너에 공개키 복사
cat ~/.ssh/id_ed25519.pub >> ~/docker-envs/ubuntu-dev/ssh_keys/authorized_keys

# 키 인증 확인 후 비밀번호 인증 비활성화
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### 11-2. Fail2ban 설치 (무차별 대입 방지)

```bash
sudo apt install -y fail2ban

sudo vim /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 2022
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

### 11-3. 컨테이너 리소스 제한

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

### 11-4. 정기 보안 업데이트 자동화

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# "Yes" 선택 → 보안 업데이트 자동 적용
```

---

## 12. 운영 및 유지보수

### 12-1. 컨테이너 상태 확인

```bash
docker ps -a
docker stats
docker stats ubuntu-dev --no-stream
```

### 12-2. 로그 관리

```bash
docker logs ubuntu-dev --tail 100 -f
du -sh /var/lib/docker/containers/*/
```

### 12-3. 이미지 정리

```bash
docker system prune -af --volumes
docker images
docker rmi ubuntu-dev_ubuntu-dev
```

### 12-4. 컨테이너 백업 및 복원

```bash
# 현재 상태 스냅샷
docker commit ubuntu-dev ubuntu-dev-backup:$(date +%Y%m%d)

# 이미지 파일로 내보내기
docker save ubuntu-dev-backup:20260625 | gzip > ubuntu-dev-backup.tar.gz

# 복원
docker load < ubuntu-dev-backup.tar.gz
```

---

## 13. 트러블슈팅

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

---

## 📌 최종 체크리스트

```
[ ] Ubuntu 22.04 시스템 업데이트 완료
[ ] Docker Engine 설치 및 서비스 활성화
[ ] 현재 사용자 docker 그룹 추가
[ ] 호스트 SSH 서버 설정 (포트 2022)
[ ] UFW 방화벽 규칙 설정
[ ] 고정 IP 설정
[ ] ubuntu-dev 컨테이너 빌드 및 실행 (포트 2222)
[ ] 외부 PC SSH 접속 테스트
[ ] VS Code Remote SSH 연결 확인
[ ] code-server 컨테이너 실행 (포트 8080)
[ ] 브라우저에서 code-server 접속 확인
[ ] Portainer 설치 (포트 9443)
[ ] SSH 키 인증 설정
[ ] Fail2ban 설치 및 설정
[ ] 볼륨 백업 정책 수립
```

---

## 🔗 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Ubuntu SSH 서버 설정](https://ubuntu.com/server/docs/service-openssh)
- [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)
- [code-server GitHub](https://github.com/coder/code-server)
- [Portainer 공식 문서](https://docs.portainer.io/)
- [UFW 방화벽 가이드](https://help.ubuntu.com/community/UFW)

---

*문서 작성일: 2026-06-25 | Ubuntu 22.04.05 LTS 기준*
