# Ubuntu 22.04 LTS 기반 Dev Container 구축 가이드

이 가이드는 공식 Ubuntu 22.04 LTS Docker 이미지를 베이스로 사용하고, 외부 원격 SSH 연결 환경과 기본적인 개발 환경을 구축하기 위한 설정 가이드입니다.

---

## 1. 프로젝트 파일 구성

우분투 환경을 다루기 위한 프로젝트 구성 폴더 트리는 다음과 같습니다.

```text
my-ubuntu-project/
└── .devcontainer/
    ├── devcontainer.json   # Dev Container 설정 파일
    ├── Dockerfile          # Ubuntu 22.04 베이스 이미지 정의
    └── entrypoint.sh       # 컨테이너 구동 시 SSH 서비스를 켜는 스크립트
```

### 1) `entrypoint.sh` 작성
컨테이너가 기동되는 즉시 SSH 서비스를 실행하고 지속시키는 진입점 스크립트입니다.
> [!IMPORTANT]
> 스크립트를 생성한 뒤, 호스트 PC 터미널에서 **`chmod +x .devcontainer/entrypoint.sh`** 명령을 실행하여 반드시 실행 권한을 부여해 주어야 합니다.

```bash
#!/bin/bash
# ==========================================
# Ubuntu 22.04 SSH 서비스 자동 기동 스크립트
# ==========================================

# 1. SSH 백그라운드 서비스 시작
echo "[System] Starting SSH server..."
sudo service ssh start

# 2. 컨테이너가 즉시 종료되는 것을 방지하기 위해 무한 대기 명령 실행
tail -f /dev/null
```

### 2) `Dockerfile` 작성
순수 `ubuntu:22.04` 기본 이미지 위에서 표준 빌드 도구(`build-essential`)와 SSH 관련 패키지들을 설치하고, 권한이 제약된 안전한 개발용 계정(`developer`)을 생성합니다.

```dockerfile
# 1. 우분투 22.04 LTS 공식 이미지 지정
FROM ubuntu:22.04

# 2. apt 패키지 설치 시 대화형 프롬프트가 뜨는 것을 방지
ENV DEBIAN_FRONTEND=noninteractive

# 3. 필수 시스템 패키지 및 개발 표준 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    openssh-server \
    sudo \
    tar \
    dbus \
    binutils \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. SSH 서비스 기동을 위한 디렉토리 사전 확보 및 권한 설정
RUN mkdir -p /var/run/sshd && chmod 0755 /var/run/sshd

# 5. 개발 전용 사용자(developer) 생성 및 sudo 권한 할당
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer

# 6. 사용자 및 루트 비밀번호 설정 (원격 PC SSH 로그인용)
RUN echo 'root:rootpassword' | chpasswd && \
    echo 'developer:developerpassword' | chpasswd

# 7. SSH 로그인 정책 변경 (루트 및 패스워드 인증 활성화)
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 8. 진입점 자동 시작 스크립트(entrypoint.sh) 복사 및 실행권한 부여
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# 9. 포트 설정 (SSH: 22)
EXPOSE 22

# 10. 컨테이너 시작 시 실행될 진입점 스크립트 지정
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
```

### 3) `devcontainer.json` 작성
컨테이너 빌드 후 기본 원격 사용자를 `developer`로 설정하여 권한 안정성을 확보하고, 호스트의 `2224` 포트를 컨테이너의 `22` 포트로 연결하도록 구성합니다.

```json
{
  "name": "Ubuntu 22.04 개발 환경",
  
  // Dockerfile 위치 지정 및 빌드 옵션
  "build": {
    "dockerfile": "Dockerfile",
    "context": "."
  },

  // Dockerfile에 정의된 ENTRYPOINT(entrypoint.sh) 유지
  "overrideCommand": false,

  // VS Code 내부 환경에서 일반 사용자(developer) 계정으로 안전하게 접근하도록 명시
  "remoteUser": "developer",

  // 컨테이너 내부에서 실행할 VS Code 확장 프로그램 목록
  "customizations": {
    "vscode": {
      "settings": {
        // 컨테이너 내 VS Code 기본 터미널을 bash로 지정
        "terminal.integrated.defaultProfile.linux": "bash"
      },
      "extensions": [
        "christian-kohler.path-intellisense"
      ]
    }
  },

  // 호스트와 컨테이너 포트 매핑 (호스트 2224 -> 컨테이너 22)
  "appPort": [
    "2224:22"
  ],

  // 로컬 컴퓨터로 포워딩할 포트 목록
  "forwardPorts": [22]
}
```

---

## 2. 외부 PC에서 연결하는 방법

### 1단계: 외부 PC SSH Config 파일 등록
클라이언트 PC B의 SSH `config` 파일에 아래 프로필을 입력합니다. (호스트 PC IP 주소가 `192.168.10.226`인 경우 예시)

```text
Host Ubuntu-DevContainer
    HostName 192.168.10.226
    User developer             # Dockerfile에서 지정한 일반 사용자 ID
    Port 2224                 # devcontainer.json에 매핑된 호스트 포트번호
```

### 2단계: 연결 시도
1. 클라이언트 PC B의 VS Code에서 `F1` 키를 눌러 **`Remote-SSH: Connect to Host...`**를 검색합니다.
2. 목록에서 **`Ubuntu-DevContainer`**를 클릭합니다.
3. 새로운 창이 열리면 운영체제로 `Linux`를 선택하고, 암호 입력창에 `developerpassword`를 기입하여 접속합니다.
