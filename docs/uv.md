<!-- version: v1.0.0 -->
# uv: Rust 기반의 초고속 Python 패키지 및 프로젝트 관리 도구 가이드

`uv`는 Astral(Ruff 개발사)에서 개발한 Rust 기반의 차세대 Python 패키지 설치(Installer), 의존성 해결(Resolver), 그리고 프로젝트 관리 도구입니다. 기존 `pip`, `pip-tools`, `virtualenv`, 심지어 `poetry`나 `rye`와 같은 도구들의 영역까지 통합하며 개발 환경의 생산성을 비약적으로 향상시킵니다.

---

## 1. uv란 무엇인가요? (Introduction)

`uv`는 Python 생태계에서 패키지 설치, 가상환경 관리, Python 인터프리터 버전 관리 등을 단일 도구로 해결할 수 있도록 설계된 올인원 도구입니다. 

* **압도적인 속도:** Rust로 작성되어 기존 `pip` 및 `pip-tools` 대비 최대 10~100배 빠른 성능을 자랑합니다.
* **올인원 툴체인:** Python 설치(인터프리터 관리), 가상환경 생성, 패키지 설치, 스크립트 실행, 프로젝트 관리 등을 모두 지원합니다.
* **디스크 공간 절약:** 글로벌 캐시 및 하드링크(또는 Copy-on-Write)를 사용하여 동일 패키지가 여러 가상환경에 설치되어도 디스크 공간을 거의 차지하지 않습니다.

---

## 2. 설치 방법 (Installation)

`uv`는 별도의 Python 환경 없이 독립적인 바이너리로 설치하는 것을 권장합니다.

### macOS & Linux
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Windows
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Homebrew (macOS)
```bash
brew install uv
```

---

## 3. 주요 기능 및 파트별 명령어 (Key Features & Commands)

`uv`는 크게 두 가지 방식으로 사용됩니다. 
1. **`uv pip` 계열:** 기존 `pip`의 명령어를 완전 대체하는 하위 호환 모드
2. **`uv` 프로젝트 관리 계열:** `poetry`처럼 프로젝트 자체를 관리하는 모드

### A. Python 인터프리터 관리 (Python Version Management)
시스템에 Python이 설치되어 있지 않아도 `uv`가 직접 최신 Python 버전을 내려받아 관리할 수 있습니다.

```bash
# 사용 가능한 Python 버전 목록 조회
uv python list

# 특정 버전의 Python 설치
uv python install 3.12
```

### B. 가상환경 관리 (Virtual Environment)
기존 `python -m venv`보다 훨씬 빠르게 가상환경을 생성합니다.

```bash
# 가상환경 생성 (.venv 디렉토리가 기본 생성됨)
uv venv

# 특정 Python 버전을 지정하여 생성
uv venv --python 3.11
```

### C. pip 대체 모드 (uv pip)
기존 `pip` 워크플로우를 그대로 유지하면서 고속 처리를 적용할 때 사용합니다. (가상환경이 활성화되어 있어야 합니다)

```bash
# 패키지 설치
uv pip install requests

# requirements.txt로부터 설치
uv pip install -r requirements.txt

# 의존성 파일 빌드 (requirements.in -> requirements.txt)
uv pip compile requirements.in -o requirements.txt

# 설치된 패키지 환경과 requirements.txt 싱크 맞추기 (불필요한 패키지 자동 삭제)
uv pip sync requirements.txt
```

### D. 현대적 프로젝트 관리 (Modern Project Management)
`pyproject.toml`을 기반으로 패키지 잠금(Locking) 및 프로젝트 개발을 관리합니다.

```bash
# 신규 프로젝트 초기화
uv init my-project

# 프로젝트에 종속성 추가 (자동으로 pyproject.toml 및 uv.lock 업데이트)
uv add requests
uv add --dev pytest

# 종속성이 정의된 개발 환경 실행
uv run main.py
```

---

## 4. pip 대비 장점 (Advantages)

1. **콜드/웜 캐시 처리 속도:**
   * 로컬 캐시가 전혀 없는 상태(Cold)에서도 병렬 네트워크 다운로드로 속도가 매우 빠릅니다.
   * 이미 받아둔 캐시가 있는 상태(Warm)에서는 다운로드 없이 캐시 저장소에서 하드링크로 복사하므로 **사실상 0초**만에 설치가 완료됩니다.
2. **별도의 Python 설치 불필요:**
   * 새로운 개발자의 PC 환경에 Python이 전혀 설치되어 있지 않아도, `uv` 명령어 하나로 명시된 Python 런타임 버전을 자동 다운로드하여 구동할 수 있습니다.
3. **독립 스크립트 실행 (`uv run`):**
   * 의존성이 선언된 임의의 단일 파일 스크립트를 가상환경 명시 없이 즉시 실행할 수 있습니다.
   * 예: `uv run --with requests script.py` (자동으로 임시 가상환경에 `requests`를 올려 실행함)
