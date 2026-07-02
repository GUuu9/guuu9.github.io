<!-- version: v1.0.0 -->
# Rust 개발을 위한 Dev Container 구축 가이드

이 가이드는 VS Code Dev Containers 환경 내부에서 Rust 툴체인(rustup, cargo)을 구성하고, `rust-analyzer`를 활용한 코드 자동 완성 및 `rustfmt`·`clippy`를 통한 코드 품질 관리 환경을 구축하는 방법을 다룹니다.

---

## 1. 프로젝트 파일 구성

Rust 개발 환경을 구축하기 위한 폴더 트리는 다음과 같습니다.

```text
my-rust-project/
└── .devcontainer/
    ├── devcontainer.json   # Dev Container 설정 파일
    └── Dockerfile          # Rust 툴체인이 설치된 이미지 정의
```

### 1) `Dockerfile` 작성
`ubuntu:22.04`를 베이스로 필수 빌드 도구와 SSL 라이브러리를 설치한 뒤, `developer` 계정으로 `rustup`을 통해 Rust 툴체인을 자동으로 설치하고 PATH에 등록하는 설정 파일입니다.

```dockerfile
# 1. 베이스 이미지로 우분투 22.04 LTS 사용
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 2. 필수 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    sudo \
    build-essential \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 3. 개발용 사용자(developer) 생성 및 권한 설정
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer
RUN echo 'developer:developer' | chpasswd
RUN echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER developer
WORKDIR /home/developer

# 4. rustup을 통한 Rust 툴체인 설치
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# 5. Cargo 및 rustup 바이너리 경로를 PATH에 등록
ENV PATH=/home/developer/.cargo/bin:$PATH

# 6. Cargo 환경 변수 소싱
RUN echo '. $HOME/.cargo/env' >> /home/developer/.bashrc
```

### 2) `devcontainer.json` 작성
컨테이너 생성 직후 `rustfmt`와 `clippy` 컴포넌트를 자동으로 추가하고, `rust-analyzer` 등 Rust 개발에 필요한 VS Code 확장을 탑재합니다.

```json
{
  "name": "Rust 개발 환경",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "."
  },
  "remoteUser": "developer",

  // 컨테이너 생성 후 rustfmt, clippy 컴포넌트 자동 추가
  "postCreateCommand": "rustup component add rustfmt clippy",

  "customizations": {
    "vscode": {
      "settings": {
        // 컨테이너 내 VS Code 기본 터미널을 bash로 지정
        "terminal.integrated.defaultProfile.linux": "bash",
        // 저장 시 자동 포맷 활성화 (rustfmt 연동)
        "editor.formatOnSave": true
      },
      "extensions": [
        "rust-lang.rust-analyzer",  // Rust 공식 언어 서버 확장
        "serayuzgur.crates",        // Cargo.toml 의존성 버전 관리
        "tamasfe.even-better-toml", // TOML 파일 문법 강조 및 편집 지원
        "vadimcn.vscode-lldb"       // LLDB 기반 Rust 네이티브 디버거
      ]
    }
  },

  // 로컬 컴퓨터로 포워딩할 포트 목록 (예: 웹 서버 개발 시 사용)
  "forwardPorts": [8080]
}
```

---

## 2. 사용 방법

### 1단계: 컨테이너 열기
1. 프로젝트 폴더를 VS Code로 열고, 좌측 하단의 `><` 아이콘을 클릭하거나 `F1` 키를 눌러 명령 팔레트를 엽니다.
2. **`Dev Containers: Reopen in Container`** 를 선택합니다.
3. 최초 실행 시 Docker 이미지를 빌드하며 (`rustup` 설치 포함), 이후에는 캐시된 이미지를 재사용하므로 빠르게 시작됩니다.
4. 빌드 완료 후 `postCreateCommand`가 자동으로 실행되어 `rustfmt`와 `clippy`가 추가됩니다.

### 2단계: 새 Rust 프로젝트 생성
VS Code 컨테이너 터미널에서 `cargo new` 명령으로 새 프로젝트를 생성합니다.

```bash
# 바이너리(실행 파일) 프로젝트 생성
cargo new my-app

# 라이브러리 크레이트 생성
cargo new --lib my-lib
```

### 3단계: 빌드 및 실행
```bash
# 프로젝트 디렉터리로 이동
cd my-app

# 디버그 빌드 후 실행
cargo run

# 릴리스 최적화 빌드 후 실행
cargo run --release

# 빌드만 수행 (실행 파일은 target/debug/ 또는 target/release/ 에 생성됨)
cargo build
cargo build --release

# 코드 오류 검사 (빌드 없이 빠르게 확인)
cargo check
```

### 4단계: 코드 품질 관리
```bash
# rustfmt: 코드 스타일 자동 포맷 (저장 시 자동 실행되도록 설정되어 있음)
cargo fmt

# clippy: 잠재적인 오류 및 비관용적 코드 패턴 경고
cargo clippy

# 테스트 실행
cargo test
```

### 5단계: rustup 툴체인 관리
컨테이너 내부에서 `rustup` 명령으로 Rust 버전과 타겟을 직접 관리할 수 있습니다.

```bash
# 현재 설치된 툴체인 목록 확인
rustup toolchain list

# 안정(stable) 채널로 업데이트
rustup update stable

# 나이틀리(nightly) 툴체인 추가
rustup toolchain install nightly

# 크로스 컴파일 타겟 추가 (예: WebAssembly)
rustup target add wasm32-unknown-unknown

# 설치된 Rust 버전 및 cargo 버전 확인
rustc --version
cargo --version
```
