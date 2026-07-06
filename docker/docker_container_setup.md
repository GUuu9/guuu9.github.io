<!-- version: v1.0.0 -->
# 🐳 Docker 원격 개발 환경 구성 가이드 - 2편: 컨테이너 개발 환경 구축

이 가이드는 호스트 서버(ubuntu26.04-desktop)에 Docker Desktop이 완비된 후, 목적에 맞는 다양한 개발 환경 컨테이너(Linux, Browser-based IDE, Windows)를 올리고 설정하는 과정을 상세히 다룹니다.

---

## 📋 목차
1. [SSH 기반 원격 접근 컨테이너 구성 (Linux 개발 환경)](#1-ssh-기반-원격-접근-컨테이너-구성-linux-개발-환경)
2. [Browser 기반 접근: code-server 컨테이너](#2-browser-기반-접근-code-server-컨테이너)
3. [Windows 개발 환경 컨테이너 구성 (Wine / QEMU)](#3-windows-개발-환경-컨테이너-구성-wine--qemu)

---

## 1. SSH 기반 원격 접근 컨테이너 구성 (Linux 개발 환경)

### 1-1. 프로젝트 디렉토리 구조 생성
```bash
mkdir -p ~/docker-envs/ubuntu-dev
cd ~/docker-envs/ubuntu-dev
```

### 1-2. Dockerfile 작성
```bash
vim Dockerfile
```

```dockerfile
# ~/docker-envs/ubuntu-dev/Dockerfile
FROM ubuntu:26.04

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

# 개발자 사용자 생성 (ID: developer, PW: developer)
ARG DEV_USER=developer
ARG DEV_PASSWORD=developer
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

### 1-3. docker-compose.json 작성
```json
// ~/docker-envs/ubuntu-dev/docker-compose.json
{
  "version": "3.9",
  "services": {
    "ubuntu-dev": {
      "build": {
        "context": ".",
        "dockerfile": "Dockerfile",
        "args": {
          "DEV_USER": "developer",
          "DEV_PASSWORD": "developer"
        }
      },
      "container_name": "ubuntu-dev",
      "hostname": "ubuntu-dev-container",
      "restart": "unless-stopped",
      "ports": [
        "2222:22"
      ],
      "volumes": [
        "projects_data:/home/developer/projects",
        "./ssh_keys:/home/developer/.ssh:ro"
      ],
      "environment": [
        "TZ=Asia/Seoul"
      ],
      "networks": [
        "dev-network"
      ],
      "security_opt": [
        "no-new-privileges:true"
      ],
      "deploy": {
        "resources": {
          "limits": {
            "cpus": "2",
            "memory": "4G"
          }
        }
      }
    }
  },
  "volumes": {
    "projects_data": {
      "driver": "local",
      "driver_opts": {
        "type": "none",
        "o": "bind",
        "device": "/data/projects"
      }
    }
  },
  "networks": {
    "dev-network": {
      "driver": "bridge",
      "ipam": {
        "config": [
          {
            "subnet": "172.20.0.0/16"
          }
        ]
      }
    }
  }
}
```

### 1-4. 공유 디렉토리 및 SSH 키 설정
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

### 1-5. 컨테이너 빌드 및 실행
```bash
cd ~/docker-envs/ubuntu-dev

# 이미지 빌드
docker compose -f docker-compose.json build

# 컨테이너 백그라운드 실행
docker compose -f docker-compose.json up -d

# 실행 상태 확인
docker compose -f docker-compose.json ps
docker compose -f docker-compose.json logs -f ubuntu-dev
```

### 1-6. 외부 PC에서 SSH 접속 테스트
```bash
# 비밀번호 인증 (PW: developer)
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

## 2. VS Code Remote Development 연결

### 2-1. VS Code 확장 설치 (외부 PC에서)
```text
VS Code → Extensions → 검색:
  "Remote Development" (ms-vscode-remote.vscode-remote-extensionpack)
  → Remote SSH, Dev Containers, Remote WSL 포함
```

### 2-2. SSH Config 등록
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

### 2-3. VS Code에서 원격 접속 순서
1. VS Code 좌측 하단 `><` 버튼 클릭 또는 `F1` ➔ `Remote-SSH: Connect to Host...` 입력
2. `ubuntu-container` 선택
3. 처음 접속 시 VS Code Server가 컨테이너에 자동 설치됨
4. 폴더 열기: `/home/developer/projects`
5. 로컬처럼 원격 컨테이너에서 개발 가능

### 2-4. Dev Containers로 직접 접속
```text
F1 → "Dev Containers: Attach to Running Container..."
→ "ubuntu-dev" 선택
→ 컨테이너 내부에서 직접 작업
```

---

## 3. Browser 기반 접근: code-server 컨테이너

클라이언트에 VS Code 설치 없이 **브라우저만으로** 개발 환경에 접근합니다.

### 3-1. 디렉토리 및 설정 파일 생성
```bash
mkdir -p ~/docker-envs/code-server/config
cd ~/docker-envs/code-server

vim config/config.yaml
```

```json
// config/config.json
{
  "bind-addr": "0.0.0.0:8080",
  "auth": "password",
  "password": "your_secure_password_here",
  "cert": false
}
```

### 3-2. docker-compose.json 작성
```json
// ~/docker-envs/code-server/docker-compose.json
{
  "version": "3.9",
  "services": {
    "code-server": {
      "image": "codercom/code-server:latest",
      "container_name": "code-server",
      "restart": "unless-stopped",
      "ports": [
        "8080:8080"
      ],
      "volumes": [
        "code_server_data:/home/coder/.local/share/code-server",
        "/data/projects:/home/coder/projects",
        "./config:/home/coder/.config/code-server"
      ],
      "environment": [
        "TZ=Asia/Seoul"
      ],
      "networks": [
        "dev-network"
      ],
      "user": "1000:1000"
    }
  },
  "volumes": {
    "code_server_data": null
  },
  "networks": {
    "dev-network": {
      "external": true,
      "name": "ubuntu-dev_dev-network"
    }
  }
}
```

### 3-3. 실행 및 접속
```bash
docker compose up -d

# 브라우저에서 접속
# http://192.168.1.100:8080
# → 설정한 비밀번호 입력 후 브라우저에서 VS Code 사용
```

---

## 4. Windows 개발 환경 컨테이너 구성 (Wine / QEMU)

Docker 컨테이너는 Linux 커널 기반이므로 네이티브 Windows 실행은 불가합니다.
* **방법 A**: Wine (Windows 앱 에뮬레이터, 가벼움)
* **방법 B**: QEMU/KVM (하드웨어 가상화, 완전한 Windows 환경)

### 방법 A: Wine + noVNC 컨테이너
```bash
mkdir -p ~/docker-envs/wine-env
cd ~/docker-envs/wine-env
```

**Dockerfile**
```dockerfile
FROM ubuntu:26.04

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

**docker-compose.json**
```json
{
  "version": "3.9",
  "services": {
    "wine-env": {
      "build": ".",
      "container_name": "wine-env",
      "restart": "unless-stopped",
      "ports": [
        "2223:22",
        "5900:5900",
        "6081:6080"
      ],
      "volumes": [
        "wine_data:/home/winuser/.wine",
        "/data/projects:/home/winuser/projects"
      ],
      "environment": [
        "TZ=Asia/Seoul"
      ],
      "networks": [
        "dev-network"
      ]
    }
  },
  "volumes": {
    "wine_data": null
  },
  "networks": {
    "dev-network": {
      "external": true,
      "name": "ubuntu-dev_dev-network"
    }
  }
}
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

## 5. Dev Container 구축 가이드 및 설정 파일 구성 비교

VS Code 등을 통해 개발 컨테이너 환경을 구성할 때, 프로젝트 요건에 따라 **`devcontainer.json` 단독(Dockerfile 기반) 구성** 방식과 **`devcontainer.json` + `docker-compose.json` 연동** 방식 중 선택할 수 있습니다.

### 5-1. 두 방식의 역할 차이
* **`devcontainer.json`**: 개발 도구(IDE) 레벨의 환경 정의 (VS Code 확장 프로그램 자동 설치, 개발용 remoteUser 권한 지정, 개발 디렉토리 지정 등)
* **`docker-compose.json`**: Docker 엔진 레벨의 다중 컨테이너 및 인프라 구조 정의 (웹 서버, 데이터베이스, 네트워크, 외부 볼륨 매핑 등)

---

### 💡 [방식 1] Dockerfile 기반 단일 컨테이너 구성 (Single Container)
추가 서비스(DB, Redis 등) 없이 독립된 하나의 가상 리눅스 환경만 구축하여 개발할 때 유용하며, 설정이 단순합니다.

#### 📁 폴더 구성
```text
my-project/
└── .devcontainer/
    ├── devcontainer.json   # Dockerfile을 빌드하고 마운트할 정보 기술
    ├── Dockerfile          # 우분투 패키지 등 기본 개발 도구 정의
    └── entrypoint.sh       # 컨테이너 실행 직후 SSH 기동 등을 위한 엔트리포인트
```

#### 📄 `devcontainer.json` 예시
```json
{
  "name": "Ubuntu Single Dev Container",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "."
  },
  "remoteUser": "developer",
  "workspaceFolder": "/home/developer/workspace",
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash"
      },
      "extensions": [
        "christian-kohler.path-intellisense"
      ]
    }
  }
}
```

---

### 💡 [방식 2] Docker Compose 기반 다중 컨테이너 구성 (Multi-Container Stack)
코드를 실행하는 개발용 컨테이너와 함께 데이터베이스(MySQL, PostgreSQL)나 캐시(Redis) 등을 병렬로 구동하여 통합 테스트가 필요한 실무 환경에 적합합니다.

#### 📁 폴더 구성
```text
my-project/
└── .devcontainer/
    ├── devcontainer.json   # docker-compose.json 위치와 메인 개발 서비스를 지정
    ├── docker-compose.json # 다중 컨테이너 스택 정의 (App, DB 등)
    ├── Dockerfile          # 개발자가 들어가서 코딩할 App 컨테이너 구성 정의
    └── entrypoint.sh
```

#### 📄 `docker-compose.json` 예시
```json
{
  "version": "3.9",
  "services": {
    "app": {
      "build": {
        "context": ".",
        "dockerfile": "Dockerfile"
      },
      "container_name": "dev-app-container",
      "restart": "unless-stopped",
      "volumes": [
        "..:/workspace:cached"
      ],
      "networks": [
        "dev-network"
      ]
    },
    "db": {
      "image": "mysql:8.0",
      "container_name": "dev-db-container",
      "restart": "always",
      "environment": {
        "MYSQL_ROOT_PASSWORD": "root_password",
        "MYSQL_DATABASE": "test_db"
      },
      "ports": [
        "3306:3306"
      ],
      "networks": [
        "dev-network"
      ]
    }
  },
  "networks": {
    "dev-network": {
      "driver": "bridge"
    }
  }
}
```

#### 📄 `devcontainer.json` 예시 (Compose 연동)
```json
{
  "name": "Ubuntu with DB Service (Compose)",
  // Docker Compose 구성 파일 경로 지정
  "dockerComposeFile": "docker-compose.json",
  // IDE 접속 대상인 메인 개발 서비스 이름 지정
  "service": "app",
  // 컨테이너 내부 개발 영역 디렉토리 경로 지정
  "workspaceFolder": "/workspace",
  // 컨테이너 접속 계정을 개발 사용자 계정으로 세팅
  "remoteUser": "developer",
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash"
      },
      "extensions": [
        "christian-kohler.path-intellisense"
      ]
    }
  }
}
```

---
* [1편: 호스트 및 Docker Desktop 설치 가이드](./docker_remote_dev_env.md)
* [3편: Docker 운영, 보안 및 트러블슈팅 가이드](./docker_management_ops.md)
