# llama.cpp + Aider 개발 환경 구축 및 사용 가이드

로컬 AI 코딩 환경을 구축하기 위한 **llama.cpp 설치 → 모델 다운로드 → Aider 연동 → 실제 사용**까지의 전체 과정을 OS별로 정리한 가이드입니다.

---

## 목차

1. [현재 프로젝트 설정 (Qwen 3B 로컬 설정)](#0-현재-프로젝트-설정-qwen-3b-로컬-설정)
2. [사전 준비 사항](#1-사전-준비-사항)
3. [llama.cpp 설치](#2-llamacpp-설치)
4. [GGUF 모델 다운로드](#3-gguf-모델-다운로드)
5. [llama-server 실행](#4-llama-server-실행)
6. [Aider 설치](#5-aider-설치)
7. [Aider + llama.cpp 연동](#6-aider--llamacpp-연동)
8. [Aider 사용 방법](#7-aider-사용-방법)
9. [자주 쓰는 설정 자동화](#8-자주-쓰는-설정-자동화)
10. [트러블슈팅](#9-트러블슈팅)

---

## 0. 현재 프로젝트 설정 (Qwen 3B 로컬 설정)

현재 가이드를 기반으로 프로젝트 디렉토리에 직접 적용된 환경 정보와 모델 위치, 그리고 서버 구동 명령어 정보입니다.

### 📁 모델 저장 경로
* **다운로드 경로**: `/Users/knetzmac2/models/qwen2.5-coder-3b-instruct-q4_k_m.gguf`
* **다운로드 모델**: Qwen 2.5 Coder 3B GGUF (`Q4_K_M` 양자화 버전, 약 2.0GB)

### ⚙️ 로컬 `llama-server` 구동 명령어 (Intel Mac CPU)
Intel Mac 환경에 맞추어 아래 명령어로 서버를 구동해 두었습니다. (포트: `8080`, 컨텍스트: `4096`)
```bash
llama-server \
  -m /Users/knetzmac2/models/qwen2.5-coder-3b-instruct-q4_k_m.gguf \  # 로컬 GGUF 모델 파일 경로 지정
  --port 8080 \                                                      # API 서버가 포트를 대기할 주소 (기본: 8080)
  -c 4096 \                                                          # 컨텍스트 윈도우 크기 설정 (토큰 제한 단위)
  -t 2                                                               # CPU 연산에 사용할 스레드 수 (코어 수에 맞춤)
```

### 💻 `aider` 실행 명령어
로컬에서 구동 중인 `llama-server` API에 연결하여 Aider를 실행하는 명령어입니다.
```bash
aider \
  --openai-api-base http://127.0.0.1:8080/v1 \   # llama-server가 제공하는 OpenAI 호환 API 주소
  --openai-api-key no-key-needed \               # 로컬 서버이므로 API 키는 아무 값이나 입력
  --model openai/qwen2.5-coder-3b-instruct \     # llama-server에 올린 로컬 모델명 명시
  --edit-format whole                            # 코드가 잘리거나 망가지는 것을 방지하는 수정 포맷 (전체 덮어쓰기)
```

---

## 1. 사전 준비 사항

### 공통 요구 사항

| 항목 | 최소 사양 | 권장 사양 |
| :--- | :--- | :--- |
| RAM | 8GB | 16GB 이상 |
| 저장 공간 | 10GB 여유 | 30GB 이상 |
| Python | 3.9 이상 | 3.11 |
| Git | 필수 | 최신 버전 |

### 운영 환경 확인

```bash
# Python 버전 확인
python3 --version    # 3.9 이상이어야 함

# Git 확인
git --version

# (macOS) Xcode Command Line Tools 확인
xcode-select --version
```

---

## 2. llama.cpp 설치

### 🍎 macOS Apple Silicon (M1/M2/M3/M4) — Metal GPU 자동 가속

```bash
# Homebrew로 1줄 설치 (Metal GPU 가속 자동 포함)
brew install llama.cpp

# 설치 확인
llama-server --version
```

> `brew`로 설치하면 Metal 가속이 기본으로 활성화되어 별도 설정 없이 GPU를 활용합니다.

---

### 🍏 macOS Intel — CPU 최적화 빌드

```bash
# 빌드 도구 설치
xcode-select --install
brew install cmake git

# llama.cpp 소스 클론
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# Intel CPU 전용 빌드 (Metal 비활성화)
cmake -B build \
  -DGGML_METAL=OFF \
  -DGGML_AVX2=ON \
  -DCMAKE_BUILD_TYPE=Release

cmake --build build --config Release -j$(sysctl -n hw.logicalcpu)

# 전역에서 쓸 수 있도록 PATH 등록 (선택)
echo 'export PATH="$HOME/llama.cpp/build/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

### 🪟 Windows — 사전 빌드 바이너리 (가장 간편)

1. [github.com/ggerganov/llama.cpp/releases](https://github.com/ggerganov/llama.cpp/releases) 접속
2. 최신 릴리즈에서 환경에 맞는 파일 다운로드:
   - NVIDIA GPU: `llama-...-win-cuda-cu12.x-x64.zip`
   - CPU Only: `llama-...-win-avx2-x64.zip`
3. ZIP 압축 해제 후 해당 폴더 PATH 등록

```powershell
# PATH 등록 (PowerShell - 영구 적용)
$llamaPath = "C:\llama.cpp"  # 압축 해제 경로
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$llamaPath", "User")
```

#### NVIDIA GPU CUDA 빌드 (선택)

```powershell
# Visual Studio Build Tools + CUDA Toolkit 설치 후
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release
# 결과: build\bin\Release\llama-server.exe
```

---

### 🐧 Linux — NVIDIA GPU (CUDA) 빌드

```bash
# 빌드 도구 설치 (Ubuntu/Debian)
sudo apt update
sudo apt install -y build-essential cmake git libcurl4-openssl-dev

git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# NVIDIA CUDA 빌드
cmake -B build \
  -DGGML_CUDA=ON \
  -DCMAKE_CUDA_ARCHITECTURES=all-major \
  -DCMAKE_BUILD_TYPE=Release

cmake --build build --config Release -j$(nproc)

# PATH 등록
echo 'export PATH="$HOME/llama.cpp/build/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

```bash
# AMD GPU (ROCm) 빌드
cmake -B build -DGGML_HIP=ON -DAMDGPU_TARGETS="gfx1100"
cmake --build build --config Release -j$(nproc)

# CPU Only 빌드
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release -j$(nproc)
```

---

## 3. GGUF 모델 다운로드

`llama.cpp`는 **GGUF 포맷**의 모델 파일을 사용합니다.

### 모델 선택 기준

| RAM/VRAM | 추천 모델 파일명 | 파일 크기 | 비고 |
| :--- | :--- | :--- | :--- |
| 8GB | `qwen2.5-coder-7b-instruct-q4_k_m.gguf` | ~4.4GB | 시작점으로 권장 |
| 16GB | `qwen2.5-coder-7b-instruct-q8_0.gguf` | ~7.7GB | 정확도↑ |
| 24GB+ | `qwen2.5-coder-14b-instruct-q4_k_m.gguf` | ~8.9GB | 대형 프로젝트 |
| 32GB+ | `qwen2.5-coder-32b-instruct-q4_k_m.gguf` | ~20GB | 최고 성능 |

### 다운로드 방법 — Hugging Face CLI (권장)

```bash
# huggingface-hub 설치
pip install huggingface-hub

# 모델 저장 폴더 생성
mkdir -p ~/models

# 7B Q4_K_M 다운로드 (권장 시작점)
huggingface-cli download \
  Qwen/Qwen2.5-Coder-7B-Instruct-GGUF \
  qwen2.5-coder-7b-instruct-q4_k_m.gguf \
  --local-dir ~/models

# 다운로드 확인
ls -lh ~/models/
```

### 다운로드 방법 — wget

```bash
wget -P ~/models \
  "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/qwen2.5-coder-7b-instruct-q4_k_m.gguf"
```

---

## 4. llama-server 실행

`llama-server`는 **OpenAI 호환 API 서버**를 로컬에 띄웁니다.  
Aider를 포함한 모든 도구가 이 API를 통해 모델과 통신합니다.

### OS별 실행 명령

#### 🍎 Apple Silicon
```bash
llama-server \
  -m ~/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf \
  --port 8080 \
  -ngl 99 \
  -c 16384
```

#### 🍏 Intel Mac / CPU Only
```bash
llama-server \
  -m ~/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf \
  --port 8080 \
  -c 8192 \
  -t $(sysctl -n hw.physicalcpu)
# -ngl 옵션 없음 (GPU 미사용)
```

#### 🪟 Windows (NVIDIA GPU)
```powershell
llama-server.exe `
  -m "$env:USERPROFILE\models\qwen2.5-coder-7b-instruct-q4_k_m.gguf" `
  --port 8080 `
  -ngl 35 `
  -c 16384
# -ngl 35: 8GB VRAM 기준. VRAM 크면 더 높게 설정
```

#### 🐧 Linux (NVIDIA GPU)
```bash
llama-server \
  -m ~/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf \
  --port 8080 \
  -ngl 99 \
  -c 16384
```

### 주요 옵션 설명

| 옵션 | 의미 | 기본값 |
| :--- | :--- | :--- |
| `-m` | 모델 파일 경로 | 필수 |
| `--port` | API 서버 포트 | 8080 |
| `-ngl` | GPU에 올릴 레이어 수 (99=전체) | 0 (CPU) |
| `-c` | 컨텍스트 윈도우 크기 (토큰) | 4096 |
| `-t` | CPU 스레드 수 | 자동 |
| `--host` | 바인딩 주소 | 127.0.0.1 |

### 서버 실행 확인

```bash
# 서버가 정상 실행되면 아래 메시지 출력:
# "llama server listening at http://0.0.0.0:8080"

# 상태 확인
curl http://localhost:8080/health
# {"status":"ok"}
```

### 백그라운드 실행 (macOS/Linux)

```bash
# 백그라운드 실행
nohup llama-server \
  -m ~/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf \
  --port 8080 -ngl 99 -c 16384 \
  > ~/llama-server.log 2>&1 &

# 종료
kill $(lsof -t -i:8080)
```

---

## 5. Aider 설치

```bash
# pipx 설치 (환경 격리 권장)
pip install pipx
pipx install aider-chat

# 또는 pip 직접 설치
pip install aider-chat

# 설치 확인
aider --version
```

---

## 6. Aider + llama.cpp 연동

`llama-server`가 8080 포트에서 실행 중인 상태에서 연결합니다.

### 바로 실행

```bash
aider \
  --openai-api-base http://localhost:8080/v1 \
  --openai-api-key none \
  --model openai/local
```

### 환경 변수로 설정 (매번 입력 불필요)

```bash
# macOS / Linux: ~/.zshrc 또는 ~/.bashrc에 추가
export OPENAI_API_BASE="http://localhost:8080/v1"
export OPENAI_API_KEY="none"
source ~/.zshrc

# 이후
aider --model openai/local
```

```powershell
# Windows PowerShell 프로파일에 추가
$env:OPENAI_API_BASE = "http://localhost:8080/v1"
$env:OPENAI_API_KEY = "none"
```

### .aider.conf.yml — 프로젝트 설정 파일

프로젝트 루트 또는 `~/.aider.conf.yml`에 생성하면 옵션 자동 적용됩니다.

```yaml
# .aider.conf.yml

openai-api-base: http://localhost:8080/v1
openai-api-key: none
model: openai/local

# 편집 형식 (로컬 모델에는 diff가 안정적)
edit-format: diff

# 동작 설정
auto-commits: true           # 변경 후 자동 Git 커밋
dirty-commits: true          # 미커밋 상태에서도 실행
suggest-shell-commands: true # 셸 명령어 제안

# 컨텍스트
map-tokens: 2048
max-chat-history-tokens: 4096
```

---

## 7. Aider 사용 방법

### 기본 실행

```bash
cd ~/my-project

# Git 초기화 (없는 경우)
git init && git config user.email "you@email.com" && git config user.name "Name"

# Aider 시작 (파일 지정)
aider --model openai/local src/main.ts
```

### 파일 관리 명령어

```
# 실행 후 프롬프트에서:

> /add src/main.ts            # 편집 맥락에 파일 추가
> /add src/main.ts src/util.ts  # 여러 파일 한번에
> /read-only docs/spec.md     # 읽기 전용 추가 (수정 안 함)
> /ls                          # 현재 맥락 파일 목록
> /drop src/util.ts            # 맥락에서 파일 제거
```

### 실전 요청 예시

```
# 기능 추가
> main.ts 파일에 JWT 기반 로그인 기능을 추가해줘. 에러 처리 포함.

# 버그 수정
> parseDate 함수가 UTC 타임존을 잘못 처리하고 있어. 수정해줘.

# 리팩토링
> 중복 코드를 utils.ts로 분리해줘.

# 테스트 작성
> auth.ts에 대한 Jest 단위 테스트를 작성해줘. 엣지 케이스 포함.

# 새 파일 생성
> Express.js REST API 서버 파일을 새로 만들어줘. CRUD 엔드포인트 포함.

# 셸 명령 실행 확인
> /run npm run build          # 빌드 실행 후 결과를 AI가 확인
```

### 슬래시 명령어 전체 목록

| 명령어 | 기능 |
| :--- | :--- |
| `/add <파일>` | 편집 맥락에 파일 추가 |
| `/drop <파일>` | 맥락에서 파일 제거 |
| `/read-only <파일>` | 읽기 전용으로 추가 |
| `/ls` | 현재 맥락 파일 목록 |
| `/run <명령>` | 셸 명령 실행 및 결과 확인 |
| `/git <명령>` | Git 명령 실행 |
| `/undo` | 마지막 Aider 커밋 취소 |
| `/diff` | 마지막 변경사항 diff 확인 |
| `/clear` | 대화 히스토리 초기화 |
| `/help` | 전체 명령어 목록 |
| `/exit` | Aider 종료 |

### 편집 형식 선택 (`--edit-format`)

로컬 모델에서 안정성이 다를 수 있으므로 형식 선택이 중요합니다.

```bash
# diff 형식 (기본 권장 — 변경 부분만 출력)
aider --model openai/local --edit-format diff

# whole 형식 (파일 전체를 다시 씀 — 느리지만 안정적)
aider --model openai/local --edit-format whole

# udiff 형식 (통합 diff 형식)
aider --model openai/local --edit-format udiff
```

---

## 8. 자주 쓰는 설정 자동화

### macOS / Linux — 원커맨드 시작 스크립트

```bash
# ~/scripts/ai.sh 로 저장

#!/bin/bash
MODEL="$HOME/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf"
PORT=8080

# 서버가 이미 실행 중인지 확인
if ! curl -s http://localhost:$PORT/health > /dev/null 2>&1; then
  echo "🚀 llama-server 시작 중..."
  nohup llama-server -m "$MODEL" --port $PORT -ngl 99 -c 16384 \
    > ~/llama-server.log 2>&1 &
  
  echo -n "준비 대기 중"
  until curl -s http://localhost:$PORT/health > /dev/null 2>&1; do
    sleep 1 && echo -n "."
  done
  echo " 완료!"
else
  echo "✅ llama-server 이미 실행 중"
fi

# Aider 실행
aider \
  --openai-api-base http://localhost:$PORT/v1 \
  --openai-api-key none \
  --model openai/local \
  --edit-format diff
```

```bash
chmod +x ~/scripts/ai.sh
echo 'alias ai="~/scripts/ai.sh"' >> ~/.zshrc
source ~/.zshrc

# 사용법
ai           # 프로젝트에서 한 줄로 시작
```

---

## 9. 트러블슈팅

### ❌ 포트 충돌 — "address already in use"

```bash
# 사용 중인 포트 확인 및 종료
lsof -i:8080
kill -9 $(lsof -t -i:8080)

# 또는 다른 포트 사용
llama-server -m ~/models/... --port 8181 -ngl 99 -c 16384
aider --openai-api-base http://localhost:8181/v1 ...
```

### ❌ GPU가 사용되지 않음 — 속도가 느림

```bash
# 서버 로그에서 GPU 로드 확인
# 정상: "offloaded 32/32 layers to GPU"
# 문제: "offloaded 0/32 layers to GPU"

# -ngl 값을 명시적으로 지정
llama-server -m ~/models/... --port 8080 -ngl 99

# macOS: Metal 지원 여부 확인
system_profiler SPDisplaysDataType | grep "Metal"
```

### ❌ 모델이 너무 느릴 때

```bash
# 1. 낮은 양자화 모델로 교체
# Q4_K_M (균형) → Q3_K_S (빠름) → Q2_K (매우 빠름, 품질 저하)

# 2. 더 작은 모델 사용
ollama run qwen2.5-coder:1.5b  # 1.5B 경량 모델

# 3. 컨텍스트 크기 줄이기
llama-server -m ~/models/... --port 8080 -ngl 99 -c 4096  # 16384 → 4096
```

### ❌ Aider가 변경 사항을 적용하지 못할 때

```bash
# 1. Git 설정 확인
git config user.email
git config user.name

# 2. 파일 권한 확인
ls -la src/main.ts

# 3. 편집 형식 변경
aider ... --edit-format whole  # diff → whole로 변경
```

### ❌ 컨텍스트 초과 오류

```
# Aider 내에서
> /drop 불필요한파일.ts  # 맥락 파일 줄이기
> /clear                 # 대화 히스토리 초기화

# 또는 서버 재시작 시 컨텍스트 크기 줄이기
llama-server -m ~/models/... --port 8080 -ngl 99 -c 8192
```

### ❌ Windows Defender 경고

```
llama-server.exe 실행 시 바이러스로 오인하는 경우:
Windows 보안 → 바이러스 및 위협 방지 → 예외 추가
→ 폴더: llama.cpp 설치 경로 추가
```

---

## 빠른 시작 요약

```bash
# ① 모델 다운로드
huggingface-cli download Qwen/Qwen2.5-Coder-7B-Instruct-GGUF \
  qwen2.5-coder-7b-instruct-q4_k_m.gguf --local-dir ~/models

# ② llama-server 실행
llama-server -m ~/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf \
  --port 8080 -ngl 99 -c 16384

# ③ Aider 설치 및 실행
pip install aider-chat
cd ~/my-project
aider --openai-api-base http://localhost:8080/v1 \
      --openai-api-key none --model openai/local

# ④ 작업 시작
> /add src/main.ts
> 이 파일에 에러 핸들링 코드를 추가해줘
```
