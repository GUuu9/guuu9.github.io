<!-- version: v1.0.1 -->
# 🐳 Ubuntu 26.04 기반 Docker 원격 개발 환경 구성 가이드 (종합)

> **목표**: Ubuntu 26.04 Desktop (ubuntu26.04-desktop) GUI 호스트 서버에 Docker Desktop을 설치하고, 외부 PC에서 SSH / VS Code Remote / 브라우저 등 다양한 방법으로 컨테이너(Linux · Windows 개발 환경)에 접근하는 호스트 환경을 단계별로 구성한다.

---

## 📋 목차

1. [사전 준비 및 환경 확인](#1-사전-준비-및-환경-확인)
2. [Ubuntu 26.04 Desktop 초기 설정](#2-ubuntu-2604-desktop-초기-설정)
3. [Docker Desktop 설치](#3-docker-desktop-설치)
4. [Docker Desktop 컨텍스트 및 Compose 확인](#4-docker-desktop-컨텍스트-및-compose-확인)
5. [외부 접근을 위한 네트워크 설정](#5-외부-접근을-위한-네트워크-설정)
6. [다음 단계 바로가기](#-다음-단계-바로가기)

---

## 1. 사전 준비 및 환경 확인

### 1-1. 전체 아키텍처

```
[ 외부 PC (Windows/Mac/Linux) ]
        │
        │  SSH (포트 22xx) / HTTPS (포트 443)
        │  VS Code Remote / 브라우저
        ▼
[ Ubuntu 26.04 Desktop 호스트 서버 ]
        │
        │  Docker Desktop
        ├─── [ 컨테이너 A: Ubuntu 26.04 개발환경 ] ← SSH :2222
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
| OS   | ubuntu26.04-desktop | ubuntu26.04-desktop |
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

## 2. Ubuntu 26.04 Desktop 초기 설정

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
# SSH 기본 포트 설정
Port 22

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
sudo ufw allow 22/tcp comment '호스트 SSH'

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

## 3. Docker Desktop 설치

### 3-1. KVM 가상화 지원 확인
Docker Desktop은 가상 머신(VM)을 실행하므로 호스트가 KVM 가상화를 지원해야 합니다.
```bash
# KVM 커널 모듈 활성화 여부 확인 (1 이상이어야 함)
egrep -c '(vmx|svm)' /proc/cpuinfo

# kvm 장치 권한 설정 확인
ls -al /dev/kvm

# 현재 사용자를 kvm 그룹에 추가
sudo usermod -aG kvm $USER
```

### 3-2. 기존 Docker Engine 제거 (충돌 방지)
호스트에 기존 Docker Engine이 설치되어 있다면 제거합니다.
```bash
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
```

### 3-3. Docker 공식 패키지 저장소 설정
Docker Desktop의 의존성 패키지 설치를 위해 공식 저장소를 등록합니다.
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

### 3-4. Docker Desktop 설치 패키지 다운로드 및 설치
Docker 공식 사이트에서 최신 `.deb` 패키지를 다운로드하여 설치합니다.
```bash
# 최신 Debian 패키지 다운로드
wget https://desktop.docker.com/linux/main/amd64/docker-desktop-amd64.deb

# apt를 통해 의존성 패키지와 함께 설치
sudo apt install -y ./docker-desktop-amd64.deb

# 다운로드한 패키지 삭제
rm docker-desktop-amd64.deb
```

### 3-5. Docker Desktop 시작 및 서비스 등록
Docker Desktop은 사용자 서비스 계층(systemd user space)에서 동작합니다.
```bash
# Docker Desktop 서비스 시작 및 자동 시작 등록
systemctl --user enable docker-desktop
systemctl --user start docker-desktop

# 상태 확인
systemctl --user status docker-desktop
```

---

## 4. Docker Desktop 컨텍스트 및 Compose 확인

> Docker Desktop은 기본적으로 `desktop-linux` 컨텍스트를 사용합니다. Docker CLI 명령어가 이 컨텍스트를 가리키도록 설정해야 하며, Docker Compose V2가 내장되어 있습니다.

```bash
# Docker Desktop 컨텍스트로 전환
docker context use desktop-linux

# 동작 상태 및 버전 확인
docker info
docker compose version

# 테스트 컨테이너 실행
docker run hello-world
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

외부포트 22    → 내부IP 192.168.1.100 : 22    (호스트 SSH)
외부포트 2222  → 내부IP 192.168.1.100 : 2222  (컨테이너 SSH)
외부포트 8080  → 내부IP 192.168.1.100 : 8080  (code-server)
외부포트 9443  → 내부IP 192.168.1.100 : 9443  (Portainer)
```

---

## 📌 다음 단계 바로가기

* [2편: 컨테이너 개발 환경 구축 가이드 (_docker_container_setup.md)](file:///Users/knetzmac2/Desktop/guuu9.github.io/docker/_docker_container_setup.md)
  * Linux SSH 개발 서버 구축, VS Code Remote SSH 연결, 브라우저 기반의 code-server, Windows(Wine/QEMU) 컨테이너 가이드를 담고 있습니다.
* [3편: Docker 운영, 보안 및 트러블슈팅 가이드 (_docker_management_ops.md)](file:///Users/knetzmac2/Desktop/guuu9.github.io/docker/_docker_management_ops.md)
  * 커스텀 네트워크/볼륨 관리, Portainer 설치, 보안 강화(SSH 키 인증, Fail2ban), 컨테이너 백업, 다중 프로젝트 병렬 운용 및 생명 주기 제어, 장애 해결법을 다룹니다.

---
*문서 업데이트일: 2026-07-03 | ubuntu26.04-desktop 기준*
