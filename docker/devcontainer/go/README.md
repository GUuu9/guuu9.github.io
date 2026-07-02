<!-- version: v1.0.0 -->
# Go 개발을 위한 Dev Container 구축 가이드

이 가이드는 VS Code Dev Containers 환경 내부에서 우분투 22.04 LTS를 기반으로 Go 개발 환경을 구축하는 방법을 다룹니다. Go 최신 안정 버전 설치와 더불어 개발에 유용한 VS Code 확장 패키지 및 기본 설정을 자동으로 적용합니다.

---

## 1. 프로젝트 파일 구성

Go 개발 환경을 구축하기 위한 폴더 트리는 다음과 같습니다.

```text
my-go-project/
└── .devcontainer/
    ├── devcontainer.json   # Dev Container 설정 파일
    └── Dockerfile          # 우분투 및 Go 최신 안정 버전이 설치된 이미지 정의
```

### 1) `Dockerfile` 작성
Ubuntu 22.04를 베이스로 Go 개발에 필수적인 도구 및 Go v1.22.4 버전을 다운로드하여 설치하고 PATH를 등록하는 설정 파일입니다.

```dockerfile
# 1. 베이스 이미지로 우분투 22.04 LTS 사용
FROM ubuntu:22.04

# 2. apt 패키지 설치 시 대화형 프롬프트가 뜨는 것을 방지
ENV DEBIAN_FRONTEND=noninteractive

# 3. 필수 시스템 패키지 및 컴파일을 위한 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    sudo \
    build-essential \
    tar \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 4. 개발 전용 사용자(developer) 생성 및 sudo 권한 할당
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer

# 5. 사용자 비밀번호 설정 및 NOPASSWD sudo 권한 부여
RUN echo 'developer:developer' | chpasswd && \
    echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# 6. Go 다운로드 및 설치 (v1.22.4)
RUN wget https://go.dev/dl/go1.22.4.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.22.4.linux-amd64.tar.gz && \
    rm go1.22.4.linux-amd64.tar.gz

# 7. developer 사용자로 전환
USER developer
WORKDIR /home/developer

# 8. Go 환경 변수 설정
ENV GOPATH=/home/developer/go
ENV PATH=$PATH:/usr/local/go/bin:/home/developer/go/bin
```

### 2) `devcontainer.json` 작성
개발 서버 포트(8080)를 호스트와 연결하며 VS Code의 Go 전용 공식 확장(`golang.go`)을 설치하고 저장 시 자동 포맷 설정을 구성합니다.

```json
{
  "name": "Go 개발 환경",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "."
  },
  "remoteUser": "developer",

  // Go 개발 서버 혹은 애플리케이션 기본 포트(8080)를 호스트와 연결합니다.
  "forwardPorts": [8080],

  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash",  // 기본 터미널을 bash로 설정
        "editor.formatOnSave": true                         // 저장 시 자동 포맷 활성화
      },
      "extensions": [
        "golang.go"                                         // Go 언어 지원 확장 패키지
      ]
    }
  }
}
```

---

## 2. 사용 방법

### 1단계: 컨테이너에서 프로젝트 열기
1. VS Code에서 프로젝트 폴더를 엽니다.
2. 명령 팔레트(`Ctrl+Shift+P` / `Cmd+Shift+P`)를 열고 **`Dev Containers: Reopen in Container`** 를 실행합니다.
3. 최초 실행 시 Docker 이미지가 빌드되며 지정한 Go 컴파일러와 환경이 자동으로 준비됩니다.

### 2단계: Go 모듈 초기화
컨테이너 내부 터미널이 준비되면 프로젝트 모듈을 초기화합니다.

```bash
go mod init <module-name>
```

### 3단계: Go 애플리케이션 작성 및 실행
간단하게 `main.go`를 작성하고 아래 실행 명령을 통해 정상 동작을 확인합니다.

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Dev Container!")
}
```

```bash
# 애플리케이션 직접 실행
go run main.go

# 애플리케이션 빌드
go build -o app main.go
./app
```
