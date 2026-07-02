<!-- version: v1.0.0 -->
# 로컬 AI 모델을 이용한 시스템 제어 및 파일/터미널/GUI 컨트롤 종합 가이드

로컬 PC에서 실행되는 오픈소스 LLM을 사용하여 파일 생성/수정, 터미널 명령, **화면 인식(Screen Vision), 마우스/키보드 자동 조작**까지 수행할 수 있는 에이전트 도구와 백엔드 인프라 종합 가이드입니다.

**Intel macOS / Apple Silicon macOS / Windows / Linux** 환경별 설치 및 실행 방법을 모두 다룹니다.

---

## 목차

1. [에이전트 도구 개요 — 코딩 특화](#1-에이전트-도구-개요--코딩-특화)
2. [에이전트 도구 개요 — 화면 인식 및 GUI 제어 특화](#2-에이전트-도구-개요--화면-인식-및-gui-제어-특화)
3. [비전(Vision) 모델 및 GUI 자동화 핵심 개념](#3-비전vision-모델-및-gui-자동화-핵심-개념)
4. [로컬 LLM 백엔드 개요](#4-로컬-llm-백엔드-개요)
5. [OS별 백엔드 설치 가이드](#5-os별-백엔드-설치-가이드)
6. [OS별 에이전트 설치 및 연동 가이드 — 화면 인식/GUI 제어](#6-os별-에이전트-설치-및-연동-가이드--화면-인식gui-제어)
7. [OS별 추천 조합표 — GUI 제어 포함](#7-os별-추천-조합표--gui-제어-포함)
8. [추천 로컬 AI 모델 — 비전 포함](#8-추천-로컬-ai-모델--비전-포함)
9. [보안 및 안전한 실행 가이드](#9-보안-및-안전한-실행-가이드)

---

## 1. 에이전트 도구 개요 — 코딩 특화

### ① 터미널/OS 범용 제어 에이전트

| 에이전트 | 특징 | GitHub |
| :--- | :--- | :--- |
| **Open Interpreter** | 자연어 → 코드 생성 → 로컬 터미널 실행. 파이썬·배시·JS 지원. 파일 처리, 브라우저 자동화. | github.com/OpenInterpreter/open-interpreter |
| **Devika** | 웹 UI 기반 AI 소프트웨어 엔지니어. 목표 인식 → 웹 검색 → 아키텍처 설계 → 코드 작성 → 실행 테스트 반복. | github.com/stitionai/devika |
| **OpenHands (구 OpenDevin)** | Docker 컨테이너 내부에서 터미널·파일·브라우저를 안전하게 제어. 코딩 외 범용 OS 조작 가능. | github.com/All-Hands-AI/OpenHands |

### ② 코딩 워크플로우 특화 에이전트

| 에이전트 | 특징 | GitHub |
| :--- | :--- | :--- |
| **Aider** | 터미널 기반 AI 페어 프로그래머. Git 맵 분석으로 다중 파일 수정 및 자동 커밋 생성. | github.com/paul-gauthier/aider |
| **SWE-agent** | 프린스턴 대학 연구팀 개발. 실제 소프트웨어 버그 수정 특화. | github.com/princeton-nlp/SWE-agent |
| **GPT-Pilot** | 대화형으로 요구사항 구체화 → 전체 앱을 처음부터 빌드하는 개발 파트너. | github.com/Pythagora-io/gpt-pilot |
| **AutoGen** | Microsoft 개발. 여러 AI 에이전트가 역할 분담 협업으로 복잡한 작업 처리. | github.com/microsoft/autogen |
| **CrewAI** | 역할(리서처/코더/QA 등)을 가진 에이전트가 파이프라인으로 협업. | github.com/joaomdmoura/crewAI |

### ③ IDE 플러그인 에이전트

| 에이전트 | 특징 | 지원 IDE |
| :--- | :--- | :--- |
| **Cline / Roo Cline** | 터미널·파일 권한 부여 시 파일 생성·편집·빌드 자동 수행. | VS Code |
| **Continue.dev** | 코드베이스 맥락을 LLM에 통합 전송. 리팩토링, 자동완성. | VS Code, JetBrains |
| **Cursor** | AI 기반으로 재설계된 VS Code 포크. 프로젝트 전체 파일을 Composer로 편집. | 자체 에디터 |
| **Windsurf (Codeium)** | Cascade 에이전트 모드로 자율적 코드 수정 수행. | 자체 에디터 |

---

## 2. 에이전트 도구 개요 — 화면 인식 및 GUI 제어 특화

> 이 계층의 에이전트들은 **스크린샷을 촬영 → 비전 AI로 화면 분석 → 마우스/키보드로 OS를 직접 조작**하는 능력을 갖고 있습니다.  
> 즉, AI가 "눈으로 보고 손으로 클릭하는" 구조입니다.

### ① 완성형 데스크톱 GUI 에이전트 (바로 사용 가능)

| 에이전트 | 개발사 | 특징 | OS 지원 |
| :--- | :--- | :--- | :--- |
| **UI-TARS Desktop** | ByteDance | 로컬 구동 가능한 가장 강력한 데스크톱 GUI 에이전트. 스크린 캡처 → 추론 → 마우스/키보드 실행 루프. Apple Silicon 포함 소비자 하드웨어에서 구동 가능. | Mac, Win, Linux |
| **UFO / UFO³** | Microsoft | Windows 전용 듀얼 에이전트(HostAgent + AppAgent). 여러 앱을 넘나드는 복잡한 멀티 앱 워크플로우 자동화. UFO³는 크로스 디바이스 오케스트레이션까지 지원. | Windows |
| **Agent S** | simular.ai | ACI(Agent-Computer Interface) 기반. 경험을 학습하며 복잡한 멀티 스텝 GUI 작업 수행. 오픈소스. | Mac, Win, Linux |
| **ScreenAgent** | 오픈소스 | Planning → Acting → Reflection 3단계 루프. 화면 상태 해석 후 마우스/키보드 제어. 연구용 고자율성 에이전트. | Mac, Win, Linux |

### ② 화면 파싱 및 해석 도구 (다른 에이전트와 조합)

| 도구 | 개발사 | 역할 |
| :--- | :--- | :--- |
| **OmniParser** | Microsoft | 스크린샷을 구조화된 텍스트(버튼, 아이콘, 텍스트)로 파싱. 어떤 VLM과도 결합 가능한 범용 UI 파서. |
| **OmniTool** | Microsoft | OmniParser를 래핑하여 Windows에서 다양한 비전 모델로 에이전트 제어를 실행하는 툴킷. |
| **SOM (Set-of-Mark)** | Microsoft Research | 스크린샷 위에 번호 태그(마크)를 오버레이하여 LLM이 클릭 위치를 정확히 지정할 수 있게 함. |

### ③ 저수준 GUI 자동화 실행 라이브러리 (에이전트가 내부적으로 사용)

| 라이브러리 | 언어 | 지원 OS | 용도 |
| :--- | :--- | :--- | :--- |
| **PyAutoGUI** | Python | Mac, Win, Linux | 마우스 이동/클릭, 키보드 입력, 스크린샷 |
| **pygetwindow** | Python | Mac, Win | 창 제목 목록 조회, 창 최대화/최소화/이동 |
| **xdotool** | Shell | Linux | X11 환경에서 마우스/키보드/창 조작 |
| **AutoHotkey (AHK)** | AHK | Windows | Windows 전용 강력한 키보드/마우스 매크로 |
| **Quartz / Accessibility API** | Python | macOS | macOS 네이티브 접근성 API를 통한 UI 요소 제어 |
| **pywinauto** | Python | Windows | Windows GUI 자동화 (버튼 클릭, 텍스트 입력 등) |

---

## 3. 비전(Vision) 모델 및 GUI 자동화 핵심 개념

```
┌─────────────────────────────────────────────────────────┐
│           화면 인식 AI 에이전트 동작 원리                 │
│                                                          │
│  1. 스크린샷 캡처                                        │
│        ↓                                                 │
│  2. Vision-Language Model (VLM) 이 이미지를 분석         │
│     "빨간 버튼이 중앙에 있고, 텍스트 입력창이 상단에 있음" │
│        ↓                                                 │
│  3. LLM이 다음 행동을 추론                               │
│     "입력창 클릭 → 텍스트 입력 → 버튼 클릭"              │
│        ↓                                                 │
│  4. PyAutoGUI / xdotool 등으로 실제 마우스/키보드 실행   │
│        ↓                                                 │
│  5. 결과 화면을 다시 캡처 → 루프 반복                    │
└─────────────────────────────────────────────────────────┘
```

### 핵심 기술 3가지

1. **Visual Grounding (시각적 위치 특정)**: VLM이 화면에서 특정 UI 요소(버튼, 아이콘 등)의 픽셀 좌표를 정확히 출력하는 능력. 최신 모델(`Qwen2.5-VL`, `UI-TARS 모델`)은 클릭 좌표를 직접 생성합니다.

2. **OS 접근성 트리 (Accessibility Tree)**: 픽셀 인식 대신 OS가 제공하는 UI 요소 트리(버튼 ID, 역할, 텍스트)를 직접 읽는 방식. 더 빠르고 정확하나 모든 앱이 지원하지 않을 수 있습니다.

3. **하이브리드 접근**: 접근성 트리로 일반 UI를 처리하고, 캔버스/게임/이미지 기반 UI는 VLM 비전 인식으로 처리하는 혼합 방식. 현재 프로덕션 레벨에서 가장 안정적입니다.

---

## 4. 로컬 LLM 백엔드 개요

| 백엔드 | 특징 | Intel Mac | Apple Silicon | Windows | Linux |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Ollama** | CLI 단순, 데몬 기반, OpenAI 호환 API, 비전 모델 지원 | ✅ | ✅ (최적화) | ✅ | ✅ |
| **LM Studio** | GUI 기반 모델 관리, 비전 모델 로드 지원 | ✅ | ✅ (MLX 가속) | ✅ | ✅ |
| **Llama.cpp** | CPU/GPU 고효율 C++ 추론, 비전 모델(llava) 지원 | ✅ | ✅ (Metal 가속) | ✅ | ✅ |
| **vLLM** | GPU 서버 고처리량 서빙 (PagedAttention) | ❌ | ❌ | ⚠️ (WSL2) | ✅ (권장) |
| **LocalAI** | OpenAI API 완전 대체 Docker 패키지, 멀티모달 지원 | ✅ | ✅ | ✅ | ✅ |
| **GPT4All** | GUI 앱, CPU 중심 로컬 실행 | ✅ | ✅ | ✅ | ✅ |
| **Jan.ai** | 오프라인 GUI 앱, API 서버 내장, 비전 모델 지원 | ✅ | ✅ | ✅ | ✅ |

---

## 5. OS별 백엔드 설치 가이드

### 🍎 macOS (Apple Silicon — M1/M2/M3/M4)

```bash
# Homebrew 설치 (미설치 시)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Ollama 설치 (비전 모델 포함)
brew install ollama
ollama serve

# 코딩용 텍스트 모델
ollama run qwen2.5-coder:7b

# 화면 인식용 비전 모델 (VLM)
ollama run qwen2.5vl:7b   # Qwen2.5-VL: UI 파악, 화면 설명에 탁월
ollama run llava:13b       # LLaVA: 범용 이미지 분석
```

### 🍏 macOS (Intel)

```bash
brew install ollama
ollama serve

# Intel Mac CPU에서 구동 가능한 경량 비전 모델
ollama run llava:7b
ollama run moondream      # 매우 경량 (1.6B), 화면 설명 특화
```

### 🪟 Windows

```powershell
winget install Ollama.Ollama
ollama serve

# 비전 모델 실행
ollama run qwen2.5vl:7b
ollama run llava:7b
```

### 🐧 Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl start ollama

# 비전 모델 실행
ollama run qwen2.5vl:7b
ollama run llava:13b

# 고성능 GPU 환경: vLLM으로 비전 모델 서빙
pip install vllm
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-VL-7B-Instruct \
  --port 8000
```

---

## 6. OS별 에이전트 설치 및 연동 가이드 — 화면 인식/GUI 제어

### ① UI-TARS Desktop (가장 접근성 높은 GUI 에이전트)

ByteDance가 개발한 로컬 구동 데스크톱 GUI 에이전트입니다. 스크린샷 → 추론 → 클릭/타이핑의 루프를 완전 자동으로 실행합니다.

#### macOS (Apple Silicon / Intel)
```bash
# 1. 사전 요구사항
brew install python@3.11 git

# 2. UI-TARS Desktop 클론
git clone https://github.com/bytedance/UI-TARS-desktop
cd UI-TARS-desktop

# 3. 패키지 설치
pip install -r requirements.txt

# 4. 로컬 Ollama 백엔드 연결 설정
# config.yaml 파일에서 api_base를 http://localhost:11434/v1 로 설정
# model_name을 qwen2.5vl:7b 로 설정

# 5. 실행
python main.py
```

#### Windows (PowerShell)
```powershell
# 1. Python 설치 (winget)
winget install Python.Python.3.11

# 2. UI-TARS Desktop 클론
git clone https://github.com/bytedance/UI-TARS-desktop
cd UI-TARS-desktop

# 3. 패키지 설치
pip install -r requirements.txt

# 4. 실행
python main.py
```

#### Linux
```bash
git clone https://github.com/bytedance/UI-TARS-desktop
cd UI-TARS-desktop
pip install -r requirements.txt
python main.py
```

---

### ② OmniParser + PyAutoGUI 커스텀 파이프라인

Microsoft OmniParser로 화면을 파싱하고, 로컬 LLM이 판단한 행동을 PyAutoGUI로 실행하는 유연한 파이프라인입니다.

#### 전 OS 공통 (Python 환경)
```bash
# 1. 필수 패키지 설치
pip install pyautogui pillow openai requests

# 2. OmniParser 설치 (Microsoft 오픈소스)
git clone https://github.com/microsoft/OmniParser
cd OmniParser
pip install -r requirements.txt

# 3. 간단한 스크린 캡처 → Ollama VLM 분석 → 자동 클릭 스크립트
```

```python
# screen_agent.py - 화면 인식 및 자동 제어 예시
import pyautogui
import base64
from PIL import ImageGrab
from openai import OpenAI
import io

# Ollama 로컬 서버 연결 (OpenAI 호환)
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

def capture_screen():
    """현재 화면을 캡처하여 base64로 인코딩"""
    screenshot = ImageGrab.grab()
    buffer = io.BytesIO()
    screenshot.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()

def analyze_screen(task: str, image_b64: str):
    """VLM으로 화면 분석 및 다음 행동 결정"""
    response = client.chat.completions.create(
        model="qwen2.5vl:7b",
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{image_b64}"}
                },
                {
                    "type": "text",
                    "text": f"""
                    현재 화면을 분석하고, 다음 작업을 수행하기 위한 행동을 JSON으로 답변하세요.
                    작업: {task}
                    
                    답변 형식:
                    {{
                        "action": "click|type|scroll|move",
                        "x": 픽셀_X좌표,
                        "y": 픽셀_Y좌표,
                        "text": "입력할 텍스트 (type 액션 시)",
                        "reason": "이 행동을 선택한 이유"
                    }}
                    """
                }
            ]
        }]
    )
    return response.choices[0].message.content

def execute_action(action_json: dict):
    """파싱된 행동을 PyAutoGUI로 실행"""
    action = action_json.get("action")
    x = action_json.get("x")
    y = action_json.get("y")
    
    if action == "click":
        pyautogui.click(x, y)
    elif action == "type":
        pyautogui.click(x, y)
        pyautogui.typewrite(action_json.get("text", ""), interval=0.05)
    elif action == "scroll":
        pyautogui.scroll(action_json.get("amount", 3), x=x, y=y)
    elif action == "move":
        pyautogui.moveTo(x, y, duration=0.3)

# 실행 예시
if __name__ == "__main__":
    task = "크롬 브라우저에서 새 탭을 열고 google.com을 입력해줘"
    
    for step in range(5):  # 최대 5 스텝 수행
        screen_b64 = capture_screen()
        action_str = analyze_screen(task, screen_b64)
        
        import json
        try:
            action = json.loads(action_str)
            print(f"Step {step+1}: {action.get('reason')}")
            execute_action(action)
        except json.JSONDecodeError:
            print("행동 파싱 실패, 종료")
            break
```

---

### ③ Open Interpreter — 화면 인식 모드

Open Interpreter는 `--vision` 플래그를 통해 화면 스크린샷을 찍고 VLM으로 분석한 뒤 터미널 명령 또는 GUI 조작까지 통합하여 실행합니다.

```bash
# 설치
pip install open-interpreter

# VLM 모드 활성화 (Ollama qwen2.5vl 연결)
interpreter --vision --model ollama/qwen2.5vl:7b

# 사용 예시 (터미널에서 자연어로 입력)
# "지금 화면에 열려있는 브라우저에서 '로그인' 버튼을 찾아서 클릭해줘"
# "현재 화면 내용을 설명해줘"
```

---

### ④ UFO (Windows 전용 — 멀티 앱 자동화)

```powershell
# 사전 요구사항: Python 3.11, Ollama 실행 중

git clone https://github.com/microsoft/UFO
cd UFO
pip install -r requirements.txt

# config.yaml 수정 (Ollama 연결)
# OPENAI_API_BASE: http://localhost:11434/v1
# OPENAI_API_MODEL: qwen2.5vl:7b

# 실행 (자연어로 Windows 앱 제어)
python -m ufo --task "Word를 열고, '안녕하세요'라는 제목의 문서를 작성한 뒤 저장해줘"
```

---

### ⑤ PyAutoGUI 단독 직접 제어 (가장 단순한 방법)

LLM 없이 파이썬 스크립트로 직접 화면 캡처 → 위치 인식 → 조작하는 기초 방법입니다.

```bash
pip install pyautogui pillow
```

```python
import pyautogui
import time

# 현재 마우스 위치 확인
print(pyautogui.position())

# 안전 장치: 마우스를 화면 모서리로 이동하면 자동 중단
pyautogui.FAILSAFE = True

# 화면 크기 확인
width, height = pyautogui.size()
print(f"화면 크기: {width} x {height}")

# 이미지 인식으로 버튼 찾기 (스크린샷에서 특정 이미지 검색)
button_location = pyautogui.locateOnScreen('button.png', confidence=0.8)
if button_location:
    pyautogui.click(button_location)

# 키보드 조합키 입력
pyautogui.hotkey('ctrl', 'c')   # 복사
pyautogui.hotkey('ctrl', 'v')   # 붙여넣기
pyautogui.hotkey('cmd', 'space')  # macOS Spotlight

# 드래그
pyautogui.drag(100, 200, 400, 200, duration=0.5)
```

---

## 7. OS별 추천 조합표 — GUI 제어 포함

### 🍎 Apple Silicon macOS — 화면 인식 + GUI 제어

| 목적 | 백엔드 | 에이전트/도구 | 모델 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **입문 GUI 자동화** | Ollama | Open Interpreter (--vision) | qwen2.5vl:7b | 자연어로 화면 보며 클릭·타이핑 |
| **완전 자율 데스크톱** | Ollama | UI-TARS Desktop | qwen2.5vl:7b | 복잡한 멀티 스텝 데스크톱 작업 |
| **화면 분석 + 코딩** | Ollama | Cline + 커스텀 VLM 스크립트 | qwen2.5vl + qwen2.5-coder | 화면 보고 코드 수정까지 |
| **경량 화면 설명** | Ollama | PyAutoGUI + moondream | moondream:1.8b | 화면 내용 설명, 가벼운 CPU 실행 |
| **다중 앱 자동화** | Ollama | Agent S | qwen2.5vl:7b | 여러 앱을 넘나드는 복잡한 자동화 |

### 🍏 Intel macOS — 화면 인식 + GUI 제어

| 목적 | 백엔드 | 에이전트/도구 | 모델 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **경량 화면 인식** | Ollama | PyAutoGUI + Ollama VLM | moondream / llava:7b | CPU에서 구동 가능한 경량 비전 |
| **기본 GUI 자동화** | Ollama | Open Interpreter (--vision) | llava:7b | 속도는 느리지만 다양한 작업 가능 |
| **이미지 인식 자동화** | — | PyAutoGUI (이미지 매칭) | — | LLM 없이 이미지 패턴 매칭으로 클릭 |

### 🪟 Windows — 화면 인식 + GUI 제어

| 목적 | 백엔드 | 에이전트/도구 | 모델 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **Windows 앱 자동화** | Ollama | UFO / UFO³ | qwen2.5vl:7b | Word, Excel, Edge 등 멀티 앱 조작 |
| **범용 GUI 에이전트** | Ollama | UI-TARS Desktop | qwen2.5vl:7b | 데스크톱 전체 자율 제어 |
| **고성능 화면 인식** | LM Studio (CUDA) | OmniParser + PyAutoGUI | qwen2.5vl:14b | 높은 정확도의 UI 파싱 |
| **GPU없는 기본 자동화** | Ollama (CPU) | PyAutoGUI + llava:7b | llava:7b | NVIDIA 없어도 동작 (속도 느림) |
| **스크립트 자동화** | — | AutoHotkey + PyAutoGUI | — | LLM 없이 매크로 기반 제어 |

### 🐧 Linux — 화면 인식 + GUI 제어

| 목적 | 백엔드 | 에이전트/도구 | 모델 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **고성능 GUI 에이전트** | vLLM | UI-TARS + xdotool | Qwen2.5-VL-7B | GPU 가속 고속 화면 인식 |
| **X11 기반 자동화** | Ollama | PyAutoGUI + xdotool | qwen2.5vl:7b | X11 환경 마우스/키보드 완전 제어 |
| **헤드리스 서버 자동화** | vLLM | ScreenAgent | Qwen2.5-VL-7B | GUI 없는 서버 환경 Xvfb로 구동 |
| **브라우저 전용 자동화** | Ollama | Skyvern | llava / qwen2.5vl | 웹 브라우저 전용 AI 자동화 |

---

## 8. 추천 로컬 AI 모델 — 비전 포함

### 텍스트 전용 (코딩/터미널 제어)

| 모델명 | 파라미터 | Apple Silicon | Intel/CPU | Windows GPU | Linux GPU | 특징 |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Qwen 2.5 Coder 7B** | 7B | ✅ 최적 | ✅ | ✅ | ✅ | 코딩·에이전트 도구 호출 최강 |
| **Llama 3.1 8B Instruct** | 8B | ✅ | ✅ | ✅ | ✅ | 범용 지시 수행, 한국어 지원 |
| **Phi-3 Mini 3.8B** | 3.8B | ✅ | ✅ 최적 | ✅ | ✅ | CPU·저사양 경량 최강 |

### 비전 포함 (화면 인식 + GUI 제어용 VLM)

| 모델명 | 파라미터 | Apple Silicon | Intel/CPU | Windows GPU | Linux GPU | 특징 |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Qwen2.5-VL 7B** | 7B | ✅ 최적 | ⚠️ (느림) | ✅ | ✅ | GUI 인식·좌표 출력 현재 최강. UI-TARS 기반 모델 |
| **LLaVA 7B** | 7B | ✅ | ✅ | ✅ | ✅ | 범용 이미지 분석, 화면 설명 |
| **LLaVA 13B** | 13B | ✅ (32GB) | ❌ | ✅ | ✅ | 높은 정확도 이미지 분석 |
| **moondream2** | 1.8B | ✅ 최적 | ✅ 최적 | ✅ | ✅ | 초경량. 화면 설명·OCR에 특화. CPU에서도 빠름 |
| **Qwen2.5-VL 32B** | 32B | ✅ (M2 Max+) | ❌ | ✅ (24GB+) | ✅ | 복잡한 UI 분석, 고정밀 좌표 추론 |

### Ollama에서 비전 모델 실행 방법
```bash
# Qwen2.5-VL (화면 인식 특화, 가장 추천)
ollama run qwen2.5vl:7b

# LLaVA (범용 이미지 분석)
ollama run llava:7b

# moondream (초경량, CPU에서도 빠름)
ollama run moondream

# Python에서 이미지와 함께 VLM 호출
import base64, requests

with open("screenshot.png", "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

response = requests.post("http://localhost:11434/api/generate", json={
    "model": "qwen2.5vl:7b",
    "prompt": "이 화면에서 '로그인' 버튼이 어디 있나요? 픽셀 좌표를 알려주세요.",
    "images": [img_b64]
})
print(response.json()["response"])
```

---

## 9. 보안 및 안전한 실행 가이드

### ① GUI 에이전트 특별 주의사항

> [!WARNING]
> GUI 에이전트는 **마우스와 키보드를 직접 제어**하므로 잘못된 판단 시 파일 삭제, 설정 변경, 의도치 않은 구매 등이 발생할 수 있습니다. 반드시 아래 안전 장치를 설정하세요.

```python
import pyautogui

# 필수: Failsafe 활성화 (마우스를 화면 좌상단 모서리로 이동하면 즉시 중단)
pyautogui.FAILSAFE = True

# 행동 간 딜레이 설정 (너무 빠른 실행 방지)
pyautogui.PAUSE = 0.5  # 각 명령 후 0.5초 대기
```

### ② 공통 보안 원칙

1. **사용자 승인 단계 추가**: 에이전트가 행동을 결정한 뒤, 실제 실행 전 터미널에서 `y/n`으로 확인하는 단계를 코드에 삽입하세요.
2. **Git 롤백 준비**: 파일 수정 전 항상 `git commit`으로 현재 상태를 저장해 두세요.
3. **가상환경/VM 사용**: GUI 에이전트를 처음 테스트할 때는 가상 머신(VMWare, VirtualBox, UTM) 또는 Docker 환경에서 실행하세요.
4. **모니터링**: 에이전트가 실행 중일 때 항상 화면을 지켜보고, 문제 발생 시 즉시 `Failsafe(좌상단 코너)`로 중단하세요.

### ③ OS별 추가 주의사항

| OS | 주의사항 |
| :--- | :--- |
| **macOS** | `시스템 환경설정 > 개인정보 보호 > 손쉬운 사용`에서 터미널/Python에 접근성 권한을 부여해야 PyAutoGUI가 동작합니다. |
| **Windows** | UAC(사용자 계정 컨트롤) 팝업이 뜰 경우 에이전트가 클릭하지 못하므로, 관리자 권한으로 스크립트를 실행하거나 UAC를 조정하세요. |
| **Linux (X11)** | `xdotool`은 X11에서만 동작합니다. Wayland 환경에서는 `ydotool` 또는 `wtype`을 사용하세요. |
| **Linux (Wayland)** | `pip install ydotool` 후 `ydotoold` 데몬을 먼저 실행해야 합니다. |
