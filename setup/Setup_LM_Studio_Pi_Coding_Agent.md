# 💻 Pi Coding Agent 연동을 위한 로컬 AI 백엔드 구축 가이드 (LM Studio 전용)

이 가이드는 **Pi Coding Agent (`pi`)**에 연결하여 사용할 수 있는 오프라인 로컬 AI 백엔드 서버를 **LM Studio** 기준으로 구축하는 방법을 정리한 문서입니다.

사용자가 모델을 직접 로컬 PC에 다운로드하고 구동하여 API 형태로 외부 에이전트와 연동할 수 있도록 OS 환경 및 플랫폼별 단계별 설치/설정 방법을 안내합니다.

---

## 🔍 1. LM Studio 선정 및 모델 안내

**LM Studio**는 GUI가 매우 강력하고 모델 탐색, 다운로드, 추론 테스트가 시각적으로 직관적인 로컬 AI 실행 도구입니다.

### 🧠 추천 AI 모델 (코딩 전용)
Pi Coding Agent와 연동하여 안정적인 소스코드 분석 및 수정을 수행하려면 **도구 호출(Tool Calling/Function Calling)** 성능이 우수한 아래 모델을 추천합니다.
*   **Qwen2.5-Coder-7B-Instruct** (또는 저사양 구성을 위한 **Qwen2.5-Coder-3B-Instruct**)
*   **Llama-3.1-8B-Instruct** (범용 코딩 및 추론에 우수)

> ⚠️ **도구 호출(Tool Call) 실패 이슈 주의**:
> `pi` 에이전트 실행 시 파일 쓰기/수정 도구를 작동시키지 못하고 `{"name": "write", ...}` 형태의 Raw JSON 텍스트만 출력되는 오작동이 일어난다면, 모델이 도구 사용 지시를 이해하지 못하고 있는 상태입니다. 
> 반드시 모델 태그명에 **`-instruct`**가 명시된 전용 지시어 튜닝 모델을 설치해 사용해야 합니다.

---

## 🍎 2. macOS 환경 구축 가이드

macOS는 CPU 아키텍처에 따라 지원 라이브러리 및 하드웨어 가속 방식이 다르므로, 본인의 시스템 사양에 맞는 옵션을 선택해야 합니다.

### 2-1. Apple Silicon Mac (M1, M2, M3, M4 등)
M 시리즈 칩은 통합 메모리(Unified Memory)를 통해 GPU 가속을 완벽히 지원하므로 대규모 모델도 매우 빠르게 작동합니다.

1. **LM Studio 다운로드 및 설치**:
   * [LM Studio 공식 홈페이지](https://lmstudio.ai)에서 Apple Silicon (M1/M2/M3/M4) 전용 `.dmg` 파일을 받아 설치합니다.
2. **모델 검색 및 다운로드**:
   * 앱 실행 후 왼쪽 돋보기(검색) 탭에서 `Qwen2.5-Coder-3B-Instruct`를 검색한 뒤 양자화 모델(예: Q4_K_M 등)을 다운로드합니다.
3. **로컬 서버 기동**:
   * 왼쪽 사이드바의 양방향 화살표 모양(Local Server) 탭으로 이동합니다.
   * 다운로드한 Qwen 모델을 상단에서 선택하여 로드합니다.
   * **Start Server** 버튼을 눌러 로컬 API 서버를 시작합니다 (기본 포트: `1234`).

### 2-2. Intel Mac (이전 세대 iMac, MacBook Pro 등)
1. **지원 유무**:
   * LM Studio는 현재 **Intel macOS를 공식 지원하지 않습니다**. 앱 구조가 Apple Silicon 아키텍처의 하드웨어 가속(Metal 및 MLX)에 맞춰 최적화되어 있습니다.
2. **우회책**:
   * Intel Mac에서 LM Studio를 사용하려면 Boot Camp를 사용해 Windows를 구동한 후 Vulkan 드라이버를 적용해 실행하는 것이 유일한 우회 방법이지만 성능이 매우 떨어져 실사용이 어렵습니다.
   * 따라서 Intel Mac 환경에서는 LM Studio 구동을 권장하지 않습니다.

---

## 🐧 3. Linux 환경 구축 가이드

Linux 환경은 GUI가 탑재된 데스크톱 환경과 터미널 위주의 헤드리스(Headless) 서버 환경으로 나뉩니다. 상황에 맞게 다음 중 하나의 방법으로 설치하고 기동하십시오.

### 3-1. GUI 환경 (데스크톱)
1. **AppImage 다운로드**:
   * LM Studio 공식 사이트에서 Linux용 `.AppImage` 파일을 다운로드합니다.
2. **실행 권한 부여 및 기동**:
   ```bash
   chmod +x LM_Studio-*.AppImage
   ./LM_Studio-*.AppImage
   ```
   * 만약 샌드박스 오류로 실행이 실패하는 경우 `--no-sandbox` 옵션을 붙여 줍니다.
     ```bash
     ./LM_Studio-*.AppImage --no-sandbox
     ```

### 3-2. 헤드리스 환경 (GUI 미지원 서버 - AppImage 압축 해제 우회)
서버나 가상환경 등 물리 디스플레이(Display)가 없거나 샌드박스 보안 문제로 AppImage 실행에 제약이 있는 경우, AppImage 내부의 압축을 명시적으로 해제(`--appimage-extract`)하여 구동하는 방식을 권장합니다.

1. **AppImage 압축 해제**:
   ```bash
   chmod +x LM_Studio-*.AppImage
   ./LM_Studio-*.AppImage --appimage-extract
   ```
   *실행 시 현재 디렉터리에 `squashfs-root` 폴더가 생성됩니다.*

2. **샌드박스 소유권 및 권한 설정**:
   추출한 Electron 샌드박스 도구의 보안 설정이 올바르지 않으면 실행 에러가 발생하므로 아래와 같이 설정을 변경합니다.
   ```bash
   cd squashfs-root
   sudo chown root:root chrome-sandbox
   sudo chmod 4755 chrome-sandbox
   ```

3. **가상 디스플레이(xvfb)와 함께 서비스 실행**:
   ```bash
   # 가상 프레임 버퍼가 필요한 경우 xvfb 설치
   sudo apt-get update && sudo apt-get install -y xvfb
   
   # 샌드박스를 사용하여 백그라운드 구동
   xvfb-run --auto-servernum ./lm-studio &
   ```

### 3-3. 헤드리스 전용 백그라운드 데몬 (`llmster` / CLI)
LM Studio 공식 GUI가 전혀 필요 없고 백그라운드 데몬 및 CLI 형태로만 구동하고자 할 때는 공식 헤드리스 버전인 **llmster** 패키지를 설치합니다.
1. **원클릭 헤드리스 인스톨러 실행**:
   ```bash
   curl -fsSL https://lmstudio.ai/install.sh | bash
   ```
2. **CLI 연동 및 부트스트랩**:
   * 설치가 완료된 후, CLI 도구 `lms`를 사용하기 위해 환경에 바인딩합니다.
   ```bash
   ~/.lmstudio/bin/lms bootstrap
   ```
   *(새로운 터미널 세션을 열거나 `source ~/.bashrc` 등으로 PATH를 동기화해야 `lms` 명령어를 전역으로 사용 가능합니다.)*
3. **CLI 명령어를 활용한 서버 기동**:
   ```bash
   # Qwen 코딩 모델 다운로드
   lms get qwen2.5-coder-7b-instruct
   
   # 다운로드한 모델 로드 및 로컬 API 서버 시작
   lms server start
   ```

---

## 🪟 4. Windows 환경 구축 가이드

Windows 환경은 LM Studio 기본 앱을 활용하여 손쉽게 로컬 AI 서버를 구성할 수 있습니다.

1. **설치**:
   * LM Studio Windows 전용 인스톨러(.exe)를 내려받아 설치를 진행합니다.
2. **실행 및 서버 켜기**:
   * GUI 앱 내에서 모델을 설치한 뒤 Local Server에서 서버를 기동합니다. (Nvidia GPU 탑재 시 CUDA 연산으로 자동 전환됩니다.)

---

## 🔌 5. LM Studio 환경 설정 및 Pi Coding Agent 연동 방법

LM Studio 로컬 AI 백엔드 엔진을 구동할 때와 이를 Pi Coding Agent에 연결할 때는 **환경 변수(Environment Variable)** 및 **설정 파일**이 핵심적인 역할을 합니다.

---

### 5-1. LM Studio 환경 설정
* LM Studio GUI의 Local Server 설정에서 포트와 GPU 오프로드를 조율합니다. (기본 포트: `1234`)
* 외부 기기나 다른 컨테이너에서 접속 가능하도록 하려면 `Network Server Settings`에서 바인딩 주소를 `0.0.0.0`으로 개방합니다.

---

### 5-2. Pi Coding Agent (`pi`) 자동 인식 설정 (추천 ⭐)

`pi` 에이전트가 로컬에서 동작 중인 LM Studio 백엔드를 자동으로 탐지하고 정상 통신하도록 설정 파일들을 변경합니다.

#### 1️⃣ `config.json` 설정 파일 갱신
`~/.pi/agent/settings.json` (혹은 프로젝트 폴더 내 `.pi/settings.json`) 파일을 열어 `defaultProvider`와 `defaultModel`을 LM Studio 사양에 맞게 다음과 같이 수정합니다.

```json
{
  "lastChangelogVersion": "0.80.2",
  "theme": "light",
  "defaultProvider": "lm-studio=http://127.0.0.1:1234",
  "defaultModel": "qwen2.5-coder-7b-instruct",
  "packages": [
    "npm:pi-tools"
  ]
}
```
*   `defaultProvider`: `lm-studio=http://127.0.0.1:1234` 주소 규격으로 설정하여 LM Studio 포트로 통신하도록 유도합니다.

---

### 5-3. `models.json`을 통한 명시적 모델 메타데이터 수동 정의 방법

LM Studio가 불러오는 기본 목록 대신, 사용자가 특정 로컬 모델의 세부 사양(이름, 역할, 호출 토큰 한계 등)을 강제로 Pi 에이전트에 선언하고 사용하고 싶을 경우 **`models.json`** 파일을 직접 만들어서 바인딩할 수 있습니다.

#### 📁 `models.json` 작성 경로
* **전역 설정 경로**: `~/.pi/agent/models.json`
* **프로젝트 설정 경로**: 현재 작업 디렉터리의 `.pi/models.json`

#### 📄 `models.json` 모델 정의 명세 구조

```json
{
  "providers": {
    "local-lmstudio": {
      "baseUrl": "http://127.0.0.1:1234/v1",
      "api": "openai-completions",
      "apiKey": "lm-studio",
      "models": [
        {
          "id": "qwen2.5-coder-7b-instruct",
          "name": "LM Studio Qwen Coder 7B",
          "contextWindow": 16384,
          "maxTokens": 4096,
          "input": ["text"],
          "supportsToolCalling": true
        },
        {
          "id": "llama-3.1-8b-instruct",
          "name": "LM Studio Llama 3.1 8B",
          "contextWindow": 16384,
          "maxTokens": 4096,
          "input": ["text"],
          "supportsToolCalling": true
        }
      ]
    }
  }
}
```
*   `supportsToolCalling`: 각각의 모델이 에이전트 내 파일 쓰기/실행 도구(Tool Call)를 개별적으로 수행할 수 있도록 모델마다 명시해 주는 것이 안전합니다.

---

### 5-4. 수동 환경 변수 오버라이드 기동

패키지 설정 변경 없이 임시로 주입하여 실행하려면 다음 환경 변수를 세션에 등록 후 기동합니다.

```bash
export OPENAI_BASE_URL=http://localhost:1234/v1
export OPENAI_API_KEY=lm-studio
pi --model qwen2.5-coder-7b-instruct
```

---

## 🌐 6. 원격 서버 연동 가이드 (다른 PC에서 실행 및 pi 연결)

LM Studio를 특정 PC(호스트 서버)에 구동시켜 두고, 네트워크상의 다른 PC(클라이언트)에서 `pi` Coding Agent를 실행하여 원격으로 로컬 AI 자원을 공유하여 사용할 수 있습니다.

### 6-1. 호스트 PC 설정 (LM Studio 구동 PC)
1. **바인딩 주소 개방**:
   * LM Studio GUI의 **Local Server** 탭으로 이동합니다.
   * 우측의 **Network Server Settings** 설정으로 스크롤합니다.
   * 기본 바인딩 주소(`127.0.0.1`)를 **`0.0.0.0`**으로 변경하여 모든 네트워크 인터페이스로부터의 접근을 허용합니다.
2. **포트 번호 확인**:
   * 기본 설정된 포트 번호(예: `1234`)를 기억해 둡니다.
3. **방화벽 허용 규칙 추가 (인바운드 규칙)**:
   * **Windows**: `고급 보안이 설정된 Windows 방화벽`에서 포트(TCP `1234`) 인바운드 허용 규칙을 추가합니다.
   * **macOS**: `시스템 설정 > 네트워크 > 방화벽` 설정에서 LM Studio 앱의 외부 연결 수신을 허용합니다.
   * **Linux**: ufw를 사용하는 경우 포트를 개방합니다.
     ```bash
     sudo ufw allow 1234/tcp
     ```
4. **호스트 IP 확인**:
   * 명령프롬프트(CMD) 또는 터미널에서 호스트 PC의 로컬 IP(예: `192.168.0.100`)를 확인합니다.
     ```bash
     # macOS/Linux
     ifconfig | grep inet
     # Windows (CMD)
     ipconfig
     ```

### 6-2. 클라이언트 PC 설정 (pi 에이전트 구동 PC)
호스트 PC의 IP 주소와 포트(예: `http://192.168.0.100:1234`)를 타깃 엔드포인트로 설정하여 접속합니다.

#### Option A: 임시 환경 변수로 기동 (수동 실행)
```bash
export OPENAI_BASE_URL=http://192.168.0.100:1234/v1
export OPENAI_API_KEY=lm-studio
pi --model qwen2.5-coder-7b-instruct
```

#### Option B: `settings.json` 고정 등록
클라이언트 PC의 `~/.pi/agent/settings.json` 설정에 호스트의 원격 주소를 기입합니다.
```json
{
  "defaultProvider": "lm-studio=http://192.168.0.100:1234",
  "defaultModel": "qwen2.5-coder-7b-instruct",
  "packages": [
    "npm:pi-tools"
  ]
}
```

#### Option C: `models.json`을 통한 명시적 바인딩
클라이언트 PC의 현재 프로젝트 폴더 내 `.pi/models.json`을 새로 만들거나 편집하여 `baseUrl`을 호스트 주소로 매핑합니다.
```json
{
  "providers": {
    "remote-lmstudio": {
      "baseUrl": "http://192.168.0.100:1234/v1",
      "api": "openai-completions",
      "apiKey": "lm-studio",
      "models": [
        {
          "id": "qwen2.5-coder-7b-instruct",
          "name": "Remote LM Studio Qwen 7B",
          "contextWindow": 16384,
          "maxTokens": 4096,
          "input": ["text"],
          "supportsToolCalling": true
        }
      ]
    }
  }
}
```

