<!-- version: v1.0.0 -->
# TypeScript 개발을 위한 Dev Container 구축 가이드

이 가이드는 VS Code Dev Containers 환경 내부에서 nvm(Node Version Manager)을 통해 Node.js LTS(v20)를 구성하고, TypeScript 및 ts-node를 전역 설치하여 ESLint · Prettier · TypeScript 확장이 탑재된 표준화된 개발 환경을 구축하는 방법을 다룹니다.

---

## 1. 프로젝트 파일 구성

TypeScript 개발 환경을 구축하기 위한 폴더 트리는 다음과 같습니다.

```text
my-typescript-project/
└── .devcontainer/
    ├── devcontainer.json   # Dev Container 설정 파일
    └── Dockerfile          # nvm, Node.js LTS, TypeScript가 설치된 이미지 정의
```

### 1) `Dockerfile` 작성
Ubuntu 22.04를 베이스로 nvm을 설치한 뒤 Node.js LTS(v20)를 설치하고, TypeScript와 ts-node를 전역 설치하여 셸 환경에서 바로 컴파일하고 실행할 수 있도록 설정한 파일입니다.

```dockerfile
# 1. 베이스 이미지로 우분투 22.04 LTS 사용
FROM ubuntu:22.04

# 2. apt 패키지 설치 시 대화형 프롬프트가 뜨는 것을 방지
ENV DEBIAN_FRONTEND=noninteractive

# 3. 필수 시스템 패키지 및 네이티브 애드온 컴파일을 위한 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    sudo \
    build-essential \
    unzip \
    tar \
    && rm -rf /var/lib/apt/lists/*

# 4. 개발 전용 사용자(developer) 생성 및 sudo 권한 할당
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer

# 5. 사용자 비밀번호 설정 및 NOPASSWD sudo 권한 부여
RUN echo 'developer:developer' | chpasswd && \
    echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# 6. developer 사용자로 전환하여 nvm 설치
USER developer
WORKDIR /home/developer

# 7. nvm(Node Version Manager) 설치
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 8. nvm 환경 변수 설정 및 Node.js LTS(v20) 설치
ENV NVM_DIR=/home/developer/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install 20 && nvm alias default 20 && nvm use default

# 9. node, npm, nvm 명령을 셸 환경에서 바로 사용할 수 있도록 PATH 등록
ENV PATH=$NVM_DIR/versions/node/v20/bin:$PATH

# 10. TypeScript 및 ts-node 전역 설치
RUN npm install -g typescript ts-node
```

### 2) `devcontainer.json` 작성
컨테이너 생성 후 `npm install`을 자동 실행하며, TypeScript 개발 서버 포트(3000)를 호스트와 연결하고 ESLint · Prettier · TypeScript 및 경로 자동완성 관련 VS Code 확장을 탑재합니다.

```json
{
  "name": "TypeScript 개발 환경",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "."
  },
  "remoteUser": "developer",

  // 컨테이너 생성 후 package.json이 존재할 경우 의존성을 자동으로 설치합니다.
  "postCreateCommand": "[ -f package.json ] && npm install || true",

  // Node.js/TypeScript 개발 서버 기본 포트(3000)를 호스트와 연결합니다.
  "forwardPorts": [3000],

  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash",  // 기본 터미널을 bash로 설정
        "editor.formatOnSave": true,                         // 저장 시 자동 포맷 활성화
        "editor.defaultFormatter": "esbenp.prettier-vscode"  // 기본 포매터를 Prettier로 지정
      },
      "extensions": [
        "dbaeumer.vscode-eslint",           // ESLint: JavaScript/TypeScript 코드 품질 검사
        "esbenp.prettier-vscode",           // Prettier: 코드 자동 포맷터
        "ms-vscode.vscode-typescript-next", // TypeScript 최신 언어 서버 지원
        "christian-kohler.path-intellisense" // 경로 자동완성 지원
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
3. 최초 실행 시 Docker 이미지가 빌드되며 nvm, Node.js v20, TypeScript, ts-node가 자동으로 설치됩니다.

### 2단계: tsconfig.json 생성 및 프로젝트 설정
프로젝트의 TypeScript 컴파일러 설정을 위해 다음 명령으로 `tsconfig.json`을 초기화하고 생성합니다.

```bash
npx tsc --init
```

### 3단계: 컴파일 및 실행
ts-node를 사용하여 TypeScript 파일을 컴파일 없이 즉시 실행하거나, tsc 컴파일러를 통해 JavaScript 파일로 빌드한 후 실행할 수 있습니다.

```bash
# TypeScript 파일 즉시 실행 (개발 모드)
npx ts-node src/index.ts

# TypeScript 코드를 JavaScript로 컴파일
npx tsc

# 컴파일된 JavaScript 파일 실행
node dist/index.js
```

### 4단계: 패키지 설치
컨테이너가 시작된 이후 `package.json`이 존재하면 `postCreateCommand`에 의해 `npm install`이 자동 실행됩니다. 수동으로 실행하려면 VS Code 터미널에서 다음 명령을 사용합니다.

```bash
npm install
```

### nvm으로 Node.js 버전 전환하기
컨테이너 내부에는 nvm이 설치되어 있으므로, 필요에 따라 다른 Node.js 버전을 설치하고 전환할 수 있습니다.

```bash
# 설치된 버전 목록 확인
nvm list

# 특정 버전 설치 (예: Node.js 18 LTS)
nvm install 18

# 버전 전환
nvm use 18

# 기본 버전 변경
nvm alias default 18
```
