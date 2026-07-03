<!-- version: v1.0.0 -->
# 컴퓨터 초기화 후 개발 환경 구축 가이드 (OS별 정리)

이 가이드는 컴퓨터를 초기화(포맷)한 후, 웹 개발 및 AI 연동 개발(Python, Node.js)에 필요한 필수 빌드 도구, 런타임 설치, 버전 관리(nvm), 독립 실행 환경(venv) 구성까지를 OS별로 다루는 가이드라인입니다.

---

## 목차

1. [macOS 개발 환경 구축](#1-macos-개발-환경-구축)
2. [Windows 개발 환경 구축](#2-windows-개발-환경-구축)
3. [Linux (Ubuntu/Debian) 개발 환경 구축](#3-linux-ubuntu-debian-개발-환경-구축)
4. [독립 환경 활용 가이드 (nvm & venv)](#4-독립-환경-활용-가이드-nvm--venv)
5. [패키지 관리 도구 및 명령어 (pip & npm)](#5-패키지-관리-도구-및-명령어-pip--npm)
6. [VS Code(Visual Studio Code) 설치 및 설정](#6-vs-codevisual-studio-code-설치-및-설정)
7. [Docker(도커) 설치 및 기본 세팅](#7-docker도커-설치-및-기본-세팅)
8. [Docker를 이용한 크로스 플랫폼 빌드 가이드 (macOS 기준)](#8-docker를-이용한-크로스-플랫폼-빌드-가이드-macos-기준)
9. [다양한 언어 개발 환경 및 격리 가이드 (C/C++, C#, Arduino, Flutter, Rust, Go, TS)](#9-다양한-언어-개발-환경-및-격리-가이드-cc-c-arduino-flutter-rust-go-ts)
10. [운영체제별 셸 환경설정 및 필수 환경 변수(export/setx) 목록](#10-운영체제별-셸-환경설정-및-필수-환경-변수exportsetx-목록)

---

## 1. macOS 개발 환경 구축

### Step 1: 필수 빌드 도구 (Command Line Tools)
컴파일러 및 Git 등의 핵심 도구를 설치합니다.
```bash
xcode-select --install
```

### Step 2: 패키지 매니저 (Homebrew) 설치
macOS용 표준 패키지 관리자를 설치합니다.
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 설치 완료 후 화면의 지시에 따라 PATH를 쉘 설정 파일(~/.zshrc)에 추가합니다.
# (M시리즈 Mac의 경우 일반적으로 아래 명령 실행 필요)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

### Step 3: Git 및 필수 유틸리티 설치
```bash
brew install git curl wget
```

---

## 2. Windows 개발 환경 구축

### Step 1: 패키지 매니저 (Winget / Chocolatey)
Windows에 내장된 패키지 매니저 `winget`을 사용해 터미널에서 소프트웨어를 손쉽게 설치합니다.

### Step 2: Git 및 기본 개발 툴 설치
PowerShell을 **관리자 권한**으로 실행한 뒤 아래 명령을 실행합니다.
```powershell
# Git 설치
winget install --id Git.Git -e --source winget

# 터미널 재실행 후 Git 버전 확인
git --version
```

### Step 3: C++ 빌드 도구 설치 (Python 라이브러리 컴파일용 필수)
일부 Python 패키지는 C++ 빌드 도구를 요구하므로 설치해 둡니다.
```powershell
# Visual Studio Build Tools 설치
winget install --id Microsoft.VisualStudio.BuildTools -e --source winget
```

---

## 3. Linux (Ubuntu/Debian) 개발 환경 구축

### Step 1: 시스템 업데이트 및 필수 빌드 패키지 설치
컴파일과 빌드에 필요한 패키지 모음(`build-essential`)을 설치합니다.
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl wget git libssl-dev libffi-dev python3-dev
```

---

## 4. 독립 환경 활용 가이드 (nvm & venv)

어느 OS에서든 프로젝트별로 다른 언어 버전을 다루고 라이브러리 간 충돌을 방지하기 위해 사용합니다.

### 🟢 Node.js 버전 관리: NVM (Node Version Manager)

nvm은 프로젝트마다 다른 버전의 Node.js를 스위칭할 수 있도록 돕습니다.

#### 1) NVM 설치
* **macOS / Linux**:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  
  # 설치 적용을 위해 쉘 터미널을 다시 켜거나 아래 명령 실행
  source ~/.zshrc  # 또는 source ~/.bashrc
  ```
* **Windows**:
  Windows 전용 nvm인 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) installer.exe 파일을 다운로드하여 설치합니다.

#### 2) NVM 주요 사용법
```bash
# 최신 LTS 버전 설치
nvm install --lts

# 특정 버전 설치 (예: v20.11.0)
nvm install 20.11.0

# 설치된 버전 목록 확인
nvm ls

# 특정 버전 활성화 및 기본값으로 설정
nvm use 20.11.0
nvm alias default 20.11.0
```

---

### 🟡 Python 독립 개발 환경: venv

OS에 전역으로 라이브러리를 설치하면 버전 충돌 문제가 발생하기 쉽습니다. 프로젝트 단위로 가상환경을 구성해 사용합니다.

#### 1) Python 설치
* **macOS**: `brew install python`
* **Windows**: `winget install --id Python.Python.3.11 -e --source winget` (3.11 권장)
* **Linux**: 기본 설치되어 있으나 패키지 관리용 `python3-pip`, `python3-venv` 필요:
  ```bash
  sudo apt install -y python3-pip python3-venv
  ```

#### 2) 가상환경 생성 및 사용 순서
개발을 진행할 프로젝트 디렉토리로 이동한 뒤 수행합니다.

```bash
# 1. 프로젝트 폴더로 이동
cd ~/my-project

# 2. 가상환경 생성 (보통 폴더명을 .venv 로 만듦)
python3 -m venv .venv   # Windows의 경우: python -m venv .venv

# 3. 가상환경 활성화 (Activate)
# - macOS / Linux:
source .venv/bin/activate
# - Windows (PowerShell):
.venv\Scripts\Activate.ps1
# - Windows (CMD):
.venv\Scripts\activate.bat

# 활성화 성공 시 터미널 프롬프트 앞에 (.venv) 표시가 나타납니다.
```

# 5. 패키지 관리 도구 및 명령어 (pip & npm)

각 환경을 구성한 뒤 라이브러리(패키지)를 검색, 설치, 업그레이드, 관리할 때 사용하는 대표 패키지 매니저 가이드입니다.

---

## 🟢 Node.js 패키지 매니저: NPM (Node Package Manager)

### 1) NPM 설치 방법
NPM은 Node.js를 설치할 때 세트로 자동 설치됩니다. 따라서 앞 단계의 `NVM`을 통해 Node.js를 설치했다면 이미 사용 준비가 완료되어 있습니다.
```bash
# Node.js 버전 확인 (LTS 또는 특정 버전 설치 시)
node -v

# NPM 버전 확인 (NPM이 제대로 설치되었는지 검증)
npm -v
```

### 2) 주요 명령어 요약

| 명령어 | 설명 | 예시 |
| :--- | :--- | :--- |
| `npm init` | 새로운 Node.js 프로젝트 시작 (`package.json` 생성) | `npm init -y` (기본값 설정) |
| `npm install <패키지>` | 프로젝트 로컬(`node_modules/`)에 패키지 설치 | `npm install express` |
| `npm install -g <패키지>` | 시스템 전역(Global)에 설치 (어디서나 실행 가능하게) | `npm install -g typescript` |
| `npm install --save-dev <패키지>` | 개발 환경 전용(`devDependencies`)으로 설치 | `npm install --save-dev jest` |
| `npm uninstall <패키지>` | 설치된 패키지 삭제 | `npm uninstall express` |
| `npm update` | 설치된 패키지들을 최신 버전 범위로 업데이트 | `npm update` |
| `npm run <스크립트>` | `package.json` 파일 내 `scripts`에 정의한 명령어 실행 | `npm run dev` |

### 2) package.json의 이해
`package.json` 파일은 프로젝트의 메타데이터와 의존 패키지 정보가 적히는 설정서입니다.
* **프로젝트 공유 시**: 용량이 큰 `node_modules` 폴더는 제외하고 `package.json`과 `package-lock.json`만 공유하며, 공유받은 위치에서 **`npm install`** 명령어 한 줄만 입력하면 기록된 모든 패키지가 자동으로 설치됩니다.

---

## 🟡 Python 패키지 매니저: pip (Preferred Installer Program)

### 1) pip 설치 및 최신화 방법
Python 3.4 이상의 공식 배포판(macOS python.org 빌드, Windows winget 빌드)에는 `pip`가 기본 내장되어 있습니다. 다만 리눅스나 초기화 후의 일부 환경에는 없을 수 있으므로 아래 방법으로 설치/최신화합니다.

* **macOS / Windows (기존 내장 pip 최신버전 업그레이드)**:
  ```bash
  python3 -m pip install --upgrade pip
  ```
* **Linux (Ubuntu/Debian) 직접 설치**:
  ```bash
  sudo apt update
  sudo apt install -y python3-pip
  ```
* **pip 수동 복구 설치 (기본 명령어 미동작 시)**:
  파이썬은 정상 설치되었으나 pip가 누락된 경우 아래 스크립트로 강제 설치합니다.
  ```bash
  curl -sSL https://bootstrap.pypa.io/get-pip.py -o get-pip.py
  python3 get-pip.py
  rm get-pip.py
  ```

### 2) 주요 명령어 요약

| 명령어 | 설명 | 예시 |
| :--- | :--- | :--- |
| `pip install <패키지>` | 패키지 다운로드 및 설치 | `pip install requests` |
| `pip install <패키지>==<버전>` | 특정 버전을 명시하여 설치 | `pip install requests==2.31.0` |
| `pip install --upgrade <패키지>` | 이미 설치된 패키지를 최신 버전으로 업그레이드 | `pip install --upgrade pip` |
| `pip uninstall <패키지>` | 설치되어 있는 패키지 삭제 | `pip uninstall requests` |
| `pip list` | 현재 가상환경/시스템에 설치된 패키지와 버전 확인 | `pip list` |
| `pip show <패키지>` | 특정 패키지의 상세 정보(위치, 의존성 등) 확인 | `pip show requests` |

### 2) 의존성 관리 및 협업 (`requirements.txt`)
파이썬 프로젝트 협업이나 서버 배포 시, 설치된 패키지 목록을 파일로 관리합니다.

* **내보내기 (Freeze)**:
  현재 가상환경에 설치된 전체 패키지 리스트를 파일로 저장합니다.
  ```bash
  pip freeze > requirements.txt
  ```
* **가져오기 (Install)**:
  다른 환경에서 복구하거나 팀원이 내려받은 뒤 패키지를 한 번에 설치할 때 사용합니다.
  ```bash
  pip install -r requirements.txt
  ```
* **시스템 패키지 충돌 방지**:
  macOS Ventura 이상이나 최신 Linux 환경에서는 시스템 Python 경로에 직접 `pip install`을 시도하면 시스템 파일 망가짐을 방지하기 위해 `externally-managed-environment` 에러가 뜹니다. 따라서 **반드시 가상환경(`venv`) 내부에서 실행하거나**, 시스템 전역으로 꼭 필요한 경우 `pip install --break-system-packages <패키지>` 형식을 사용하는 것이 안전합니다.

---

# 6. VS Code(Visual Studio Code) 설치 및 설정

개발용 IDE인 VS Code를 설치하고 터미널 연동과 필수 확장을 설정합니다.

### 1) OS별 설치 방법
* **macOS**:
  ```bash
  brew install --cask visual-studio-code
  ```
* **Windows**:
  ```powershell
  winget install --id Microsoft.VisualStudioCode -e --source winget
  ```
* **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt install apt-transport-https
  sudo wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
  sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
  sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
  rm -f packages.microsoft.gpg
  sudo apt update && sudo apt install code
  ```

### 2) 터미널에서 `code` 명령어로 열기 설정 (macOS 필수)
1. VS Code를 실행합니다.
2. `Cmd + Shift + P` (Windows/Linux는 `Ctrl + Shift + P`)를 눌러 명령 팔레트를 엽니다.
3. `Shell Command: Install 'code' command in PATH`를 검색하여 실행합니다.
4. 이제 터미널에서 `code .`을 입력하면 현재 디렉토리에서 VS Code가 바로 열립니다.

### 3) 권장 개발 확장 플러그인 (Extensions)
* **Prettier - Code formatter**: 코드 서식 자동 정리
* **ESLint**: JavaScript/TypeScript 정적 분석 및 에러 체크
* **Python**: 파이썬 개발 디버그 및 venv 가상환경 연동
* **Docker**: 도커 파일 작성 및 컨테이너 관리 편리 도구

---

# 7. Docker(도커) 설치 및 기본 세팅

컨테이너 기반 독립 개발/배포 환경 구성을 위한 도커 설치법입니다.

### 1) OS별 설치 방법 (데스크톱 GUI 환경 기반)
* **macOS (Docker Desktop)**:
  ```bash
  brew install --cask docker
  # 설치 후 Application 폴더에서 Docker를 실행하여 백그라운드 엔진을 켜줍니다.
  ```
* **Windows (Docker Desktop)**:
  먼저 WSL2(Windows Subsystem for Linux) 활성화가 권장됩니다.
  ```powershell
  # WSL 활성화 (관리자 권한)
  wsl --install
  
  # Docker Desktop 설치
  winget install --id Docker.DockerDesktop -e --source winget
  ```
* **Linux (Ubuntu CPU/서버 엔진 직접 설치)**:
  ```bash
  # Docker 공식 GPG 키 추가
  sudo apt-get update
  sudo apt-get install ca-certificates curl
  sudo install -m 0755 -d /etc/apt/keyrings
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc

  # 리포지토리 설정
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update

  # 도커 엔진 설치
  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  ```

### 2) 리눅스 사용 권한 그룹 추가 (sudo 없이 docker 실행)
리눅스 서버 환경의 경우 매번 `sudo docker`를 치지 않도록 현재 사용자를 docker 그룹에 추가합니다.
```bash
sudo usermod -aG docker $USER
# 적용을 위해 터미널을 나갔다가 다시 접속하거나 아래 명령어 실행
newgrp docker
```

### 3) 작동 확인
```bash
# 도커 서비스 실행 유무 및 버전 확인
docker --version

# Hello World 컨테이너 테스트 실행
docker run hello-world
```

---

# 8. Docker를 이용한 크로스 플랫폼 빌드 가이드 (macOS 기준)

Electron 앱이나 Node.js/Python 기반의 데스크톱 프로그램을 macOS(기본 개발 환경)에서 개발할 때, Windows나 Linux 타겟 환경의 실행 바이너리 및 패키지를 빌드하기 위해 Docker 컨테이너를 빌드 샌드박스로 사용합니다.

## 1) Linux(Ubuntu) 빌드 컨테이너 구성
리눅스 타겟 실행파일을 만들기 위해 Linux용 환경을 컨테이너로 띄워 소스를 빌드하는 방법입니다.

### 빌드용 Dockerfile 작성 (`Dockerfile.linux`)
```dockerfile
# Node.js LTS와 컴파일용 도구 내장 이미지 사용
FROM node:20-bookworm

# Electron 빌드 및 GUI 바인딩 컴파일에 필요한 Linux 라이브러리 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    clang \
    libdbus-1-dev \
    libgtk-3-dev \
    libnotify-dev \
    libasound2-dev \
    libcap-dev \
    libcups2-dev \
    libxtst-dev \
    libxss1 \
    libnss3-dev \
    gcc-multilib \
    g++-multilib \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
```

### macOS 터미널에서 리눅스 패키지 빌드 실행
```bash
# 1. 빌드 엔진 이미지 생성
docker build -t app-linux-builder -f Dockerfile.linux .

# 2. 현재 소스 폴더를 컨테이너 내부에 마운트하여 빌드 명령어 실행
docker run --rm -v "$(pwd)":/app app-linux-builder npm install && npm run build:linux
```

---

## 2) Windows (exe) 크로스 빌드를 위한 Docker 구성 (Wine 활용)
macOS 및 Linux에서 Windows 실행 바이너리를 빌드하려면 **Wine(와인)** 환경이 탑재된 도커 이미지를 이용합니다.

### Wine 기반 Windows 빌드용 Dockerfile 작성 (`Dockerfile.win`)
```dockerfile
# Electron-builder 전용 Wine 내장 이미지 활용
FROM electronuserland/builder:wine

WORKDIR /app
```

### macOS 터미널에서 Windows 패키지 빌드 실행
```bash
# Windows 패키지 빌드 명령어 수행 (현재 폴더 마운트)
docker run --rm \
  -v "$(pwd)":/app \
  -v ~/.npm:_npm \
  --env npm_config_cache=/_npm \
  electronuserland/builder:wine \
  sh -c "npm install && npm run build:win"
```

---

## 3) Multi-Architecture 빌드 (Apple Silicon Mac에서 Intel/AMD64 빌드)
Apple Silicon(M1/M2/M3/M4, `arm64`) Mac에서 일반적인 PC 사양인 Intel/AMD (`x86_64`) 이미지나 실행 파일을 빌드할 때는 `docker buildx` 또는 `--platform` 플래그를 활용합니다.

```bash
# M칩 Mac에서 Linux x86_64 타겟으로 도커 실행 및 빌드할 때
docker run --rm --platform linux/amd64 -v "$(pwd)":/app app-linux-builder npm run build:linux

# x86_64 타겟 컨테이너 이미지 빌드 시
docker build --platform linux/amd64 -t app-image:latest .
```

> **Tip**: macOS Docker Desktop은 내부적으로 Rosetta 2를 통한 x86_64 에뮬레이션을 지원하므로 별도의 qemu 설정 없이 `--platform linux/amd64` 옵션만 추가해도 원활한 크로스 빌드가 가능합니다.

---

# 9. 다양한 언어 개발 환경 및 격리 가이드 (C/C++, C#, Arduino, Flutter, Rust, Go, TS)

여러 프로그래밍 언어를 교차 개발할 때 시스템 전역 환경 오염을 차단하고 프로젝트마다 일관된 빌드 파이프라인을 분리하는 구축법입니다.

---

## 💻 C/C++ 개발 환경
C/C++ 빌드 및 디버깅 툴체인입니다.

### 1) OS별 핵심 툴체인 설치 (macOS 중심)
* **macOS**: `xcode-select --install`을 실행하면 내장 컴파일러 `Clang`과 빌드 제어 도구 `make`가 완비됩니다. 크로스 플랫폼 Makefile 구동 및 외부 라이브러리 연동 시 `CMake`와 `pkg-config`를 설치합니다:
  ```bash
  brew install cmake pkg-config
  ```
* **Windows**: `winget install --id Microsoft.VisualStudio.BuildTools -e --source winget`으로 MSVC 컴파일러를 쓰거나, GCC/Clang 툴체인(MinGW)이 필요하면 `winget install MSYS2.MSYS2`를 설치하여 관리합니다.

### 2) 독립성 유지 팁: CMake & Vcpkg
* 프로젝트의 `/third-party` 서브디렉토리에 소스코드로 외부 종속 라이브러리를 추가하고, `CMakeLists.txt`에 `add_subdirectory()`를 명시해 **시스템의 전역 `/usr/local/include` 혹은 DLL 경로 오염을 원천 차단**합니다.
* 라이브러리 관리에 `vcpkg`를 쓰는 경우 프로젝트 로컬에서 `git clone` 후 `--x-manifest-install` 모드로 빌드하여 로컬 빌드 경로에만 헤더와 라이브러리를 바인딩합니다.

---

## 🟣 C# / .NET SDK 개발 환경
크로스 플랫폼 앱 및 서버 개발용 닷넷 환경입니다.

### 1) OS별 SDK 설치 방법
* **macOS**:
  ```bash
  brew install --cask dotnet-sdk
  ```
* **Windows**:
  ```powershell
  winget install --id Microsoft.DotNet.SDK.8 -e --source winget
  ```

### 2) 독립성 유지 팁: 전역 설치 우회 및 `global.json`
* 프로젝트 루트 경로에 `global.json` 파일을 작성해 두면, 특정 프로젝트 디렉토리에 진입했을 때 해당 프로젝트가 강제 요구하는 SDK 버전만 활성화되어 동작합니다.
  ```json
  {
    "sdk": {
      "version": "8.0.200"
    }
  }
  ```

---

## 🔌 Arduino (아두이노) 개발 환경
IoT 하드웨어 펌웨어 제어를 위한 임베디드 툴체인입니다.

### 1) 툴킷 설치 (macOS / Windows 공통)
보통 GUI를 지원하는 IDE를 설치하지만, 버전 격리 및 자동화 빌드 파이프라인 구성을 위해 CLI(Command Line Interface)도 함께 구성합니다.
* **macOS**:
  ```bash
  # 아두이노 IDE GUI 설치
  brew install --cask arduino-ide
  # 버전 및 보드 자동화용 CLI 설치
  brew install arduino-cli
  ```
* **Windows**:
  ```powershell
  winget install --id Arduino.ArduinoIDE -e --source winget
  ```

### 2) 독립성 유지 팁: CLI 격리 설정
전역 캐시 디렉토리가 보드 설정으로 엉키는 것을 막기 위해 프로젝트 로컬에 config 설정을 격리하여 사용합니다.
```bash
# 프로젝트 디렉토리 내부에서 CLI 로컬 설정 파일 초기화
arduino-cli config init --dest-dir ./
# 로컬 샌드박스 경로 지정 빌드
arduino-cli compile --fqbn arduino:avr:uno --build-path ./build ./MyProject
```

---

## 🦋 Flutter (플러터) 개발 환경
Android / iOS / Desktop 다중 타겟 크로스 플랫폼 프레임워크입니다.

### 1) 설치 순서 (macOS 기준 - 모바일/데스크톱 빌드 최적화)
```bash
# 1. Xcode 설치가 완료된 상태에서 CocoaPods 설치 (iOS 라이브러리 바인더)
sudo gem install cocoapods  # 또는 brew install cocoapods

# 2. Flutter SDK 설치
brew install --cask flutter

# 3. 환경 진단 도구 실행
flutter doctor
# 화면 지시에 따라 부족한 Android SDK 라이센스(flutter doctor --android-licenses) 등을 충족시킵니다.
```

### 2) 독립성 유지 팁: FVM (Flutter Version Management)
플러터는 버전별 파괴적 변경사항이 잦으므로 프로젝트별 버전 스태킹이 필수적입니다.
```bash
# fvm 글로벌 설치
pub global activate fvm  # 또는 brew install leoafarias/fvm/fvm

# 프로젝트에서 특정 플러터 버전 적용 및 고정
fvm use 3.19.0 --force

# 해당 프로젝트 폴더 내에서는 flutter 명령어 대신 fvm을 앞에 붙여 실행
fvm flutter run
```

---

## 🦀 Rust 개발 환경
메모리 안전성이 확보된 고성능 시스템 언어입니다.

### 1) OS별 설치 방법
* **macOS / Linux**:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  source $HOME/.cargo/env
  ```
* **Windows**:
  `rustup-init.exe` 설치 프로그램을 웹에서 다운받아 실행합니다.

### 2) 독립성 및 버전 관리: Rustup & Cargo
* **Rustup**: Rust 공식 툴체인 매니저입니다. 프로젝트 폴더별로 툴체인을 고정하고 싶다면 디렉토리 안에서 아래 명령을 실행합니다.
  ```bash
  rustup override set nightly-2024-03-01
  ```
* **Cargo**: Rust 내장 빌드 시스템 및 패키지 관리자입니다. Rust는 기본적으로 모든 크레이트(라이브러리)의 다운로드 버전을 `~/.cargo/`에 저장하며, 빌드 산출물은 프로젝트 폴더 내부의 `target/`에만 생성하므로 완벽한 폴더 레벨 격리가 보장됩니다.

---

## 🐹 Go (Golang) 개발 환경
동시성 처리가 뛰어난 클라우드 백엔드용 컴파일 언어입니다.

### 1) OS별 설치 방법
* **macOS**:
  ```bash
  brew install go
  ```
* **Windows**:
  ```powershell
  winget install --id GoLang.Go -e --source winget
  ```

### 2) 독립성 유지 및 버전 격리: Go Modules (`go.mod`)
Go는 1.11 버전 이후 Go Modules 기반 격리가 기본값으로 고정되어 전역 `$GOPATH` 환경 오염 걱정이 전혀 없습니다.
```bash
# 프로젝트 초기화 (GOPATH 밖 어디서든 실행 가능)
go mod init my-project-name

# 라이브러리 설치 시 go.mod 파일에 프로젝트 로컬 의존성이 자동으로 기록됨
go get github.com/gin-gonic/gin

# 외부 라이브러리 소스 격리 (vendor 디렉토리에 로컬 카피)
go mod vendor
```

---

## ⚡ TypeScript (TS) 개발 환경
안정적인 대형 JS 애플리케이션 개발을 위한 타입 정적 제어 언어입니다.

### 1) 설치 방법
런타임이 아니므로 Node.js 환경에서 npm을 통해 설치하여 씁니다.

### 2) 독립성 유지 팁: Global 설치 지양하기
TypeScript 컴파일러(`tsc`)를 전역(`npm install -g typescript`)에 설치하면 프로젝트별 버전 차이로 컴파일러 충돌이 발생할 수 있습니다. **반드시 프로젝트별 개발 의존성으로 로컬 설치**하여 구동해야 합니다.

```bash
# 1. 개발 의존성으로 프로젝트 내 로컬 설치
npm install --save-dev typescript @types/node

# 2. 컴파일러 설정 파일 생성
npx tsc --init

# 3. 로컬에 설치된 tsc 컴파일러 실행 (글로벌 tsc 사용 우회)
npx tsc --noEmit
```

---

## 🏗️ 극단적 환경 격리가 필요할 때: Dev Containers 활용
로컬 OS에 그 어떤 언어 툴체인(Java, Go, C#, C++ 등)도 직접 설치하고 싶지 않은 경우, **VS Code의 Dev Containers 확장**을 활용합니다.

1. VS Code에서 `Dev Containers` 확장 기능을 설치합니다.
2. 프로젝트 루트에 `.devcontainer/devcontainer.json`을 추가합니다.
   ```json
   {
     "name": "Rust & Node Dev Env",
     "image": "mcr.microsoft.com/devcontainers/rust:1",
     "features": {
       "ghcr.io/devcontainers/features/node:1": {}
     },
     "customizations": {
       "vscode": {
         "extensions": ["rust-lang.rust-analyzer", "dbaeumer.vscode-eslint"]
       }
     }
   }
   ```
3. VS Code에서 `Reopen in Container`를 실행하면, 프로젝트 코드가 도커 컨테이너 내부 샌드박스로 탑재되어 내 컴퓨터에는 아무 흔적도 남기지 않은 채 완벽하게 격리된 환경에서 개발/빌드/디버깅을 처리할 수 있습니다.

---

# 10. 운영체제별 셸 환경설정 및 필수 환경 변수(export/setx) 목록

설치한 개발 도구의 명령어 실행 파일(PATH)을 운영체제가 인식하게 하거나, AI 연동 및 컴파일 옵션을 설정하기 위해 전역 또는 세션별로 환경 변수를 주입하는 방법입니다.

---

## 1) 🍎 macOS & 🐧 Linux 환경 변수 설정
macOS(zsh 셸) 및 Linux(bash 셸)는 사용자의 홈 디렉토리 내부 숨김 파일에 설정 정보를 기록합니다.

### ① 셸 프로파일 파일 편집 경로
* **macOS (기본 zsh)**: `~/.zshrc`
* **Linux (기본 bash)**: `~/.bashrc`
```bash
# VS Code로 열기
code ~/.zshrc  # Linux는 code ~/.bashrc
# 터미널 편집기(nano)로 열기
nano ~/.zshrc
```

### ② 수정 사항 적용법
설정을 저장한 후 터미널에 아래 명령어를 내려야 즉시 터미널 세션에 바인딩됩니다.
```bash
source ~/.zshrc   # Linux는 source ~/.bashrc
```

### ③ 필수 export 설정 스크립트 블록
`~/.zshrc` 또는 `~/.bashrc` 가장 하단에 추가합니다.
```bash
# 1. Homebrew 바이너리 경로 (M칩 Mac 필수)
if [ -f "/opt/homebrew/bin/brew" ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# 2. Node.js (nvm) 초기화 및 실행 설정
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 3. Python 사용자 패키지 실행 디렉토리 추가
export PATH="$HOME/Library/Python/3.11/bin:$HOME/Library/Python/3.12/bin:$PATH"

# 4. Rust (Cargo) 및 Go (Golang) 툴체인
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"
export GOPATH="$HOME/go"
export PATH="$GOPATH/bin:$PATH"

# 5. Flutter 및 Android SDK
export PATH="/opt/homebrew/Caskroom/flutter/latest/flutter/bin:$PATH"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

# 6. AI API 포트 환경변수 (Aider 자동화 연결용)
export OPENAI_API_BASE="http://localhost:8080/v1"
export OPENAI_API_KEY="no-key-needed"
```

---

## 2) 🪟 Windows 환경 변수 설정
Windows는 GUI 시스템 설정창을 이용하거나, **PowerShell CLI**를 사용하여 영구적 환경 변수 및 사용자 PATH 등록을 처리합니다.

### ① PowerShell을 통한 영구 환경 변수 등록 (`setx` 사용)
관리자 권한의 PowerShell 터미널을 열고 실행합니다.
```powershell
# 1. AI API 연동 환경 변수 영구 등록 (Aider용)
setx OPENAI_API_BASE "http://localhost:8080/v1"
setx OPENAI_API_KEY "no-key-needed"

# 2. Go 모듈 경로 및 개발 디렉토리 지정
setx GOPATH "$env:USERPROFILE\go"
```

### ② 특정 바이너리 폴더(PATH) 추가 설정
사용자 환경 변수의 `Path` 컬렉션 뒤에 원하는 컴파일 디렉토리를 덧붙입니다.
```powershell
# 예시: 사용자 경로에 Flutter 및 Cargo 디렉토리 덧붙이기
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$newPaths = ";$env:USERPROFILE\.cargo\bin;C:\src\flutter\bin"
[Environment]::SetEnvironmentVariable("Path", $userPath + $newPaths, "User")
```
> **Tip**: 변경 후 터미널 세션을 완전히 종료한 뒤 재부팅하여 확인하십시오.

---

## 3) 주입된 환경 변수 동작 검증
```bash
# macOS / Linux 환경 변수 목록 검색
env | grep -E "OPENAI|PATH"

# Windows PowerShell 환경 변수값 확인
$env:OPENAI_API_BASE

# PATH 등록 상태 자가진단 (모든 OS 공통)
flutter --version
rustc --version
```
