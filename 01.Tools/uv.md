<!-- version: v1.3.4 -->
# uv·Python 가상환경 사용 가이드

확인일: 2026-10-28. uv는 Python 버전, 가상환경, 패키지 의존성, 잠금 파일과 CLI 도구 환경을 관리합니다. 기존 requirements.txt 방식과 pyproject.toml·uv.lock 방식 중 프로젝트가 사용하는 흐름을 따릅니다. pip와 유사한 명령이 있지만 모든 동작·옵션이 완전히 같지는 않습니다.

venv는 Python 표준 기능으로 uv 없이도 사용할 수 있습니다. 이 저장소는 uv로 Python·가상환경을 관리하는 방식을 기본으로 하고, 기존 프로젝트의 표준 venv·pip 절차도 이 문서에서 함께 관리합니다. `uv venv`로 만든 환경에는 pip가 기본 포함되지 않을 수 있으므로 패키지 관리는 `uv pip`를 사용합니다.

## 설치와 역할 구분

설치는 [OS 설정 안내](../00.Setup/OS_Dev_Setting.md)를 따릅니다. macOS는 공식 독립 설치를 기본으로 하며 `uv self update`로 갱신합니다. 목표 버전 고정이 필요하면 공식 설치 안내의 버전 URL로 재설치합니다. Homebrew로 이미 설치한 uv만 기존 관리 방식인 brew upgrade uv를 사용하며 두 경로로 중복 관리하지 않습니다.

macOS 13에서 brew install uv가 실패하면 Homebrew 경로와 uv 자체의 지원 범위를 구분합니다. uv는 [macOS 13 이상을 지원](https://docs.astral.sh/uv/reference/policies/platforms/#macos-versions)하며 공식 0.13.6 Intel 바이너리의 버전 명령을 macOS 13.7.8에서 확인했습니다(2026-10-30). 설치는 [macOS 독립 설치 절차](../00.Setup/macOS_Common_Dev_Setting.md#3-python-관리-도구-uv)를 따릅니다. Python 배포판과 프로젝트 패키지의 OS 지원은 별도로 확인합니다.

| 요소 | 역할 |
| :--- | :--- |
| `.python-version` | 사용할 Python 버전 선택 |
| pyproject.toml | 프로젝트 메타데이터·Python 조건·직접 의존성 |
| uv.lock | 해결된 의존성 버전 |
| `.venv/` | 실제 실행 환경. Git에서 제외 |
| uv 캐시 | 다운로드·빌드 재사용. 프로젝트 소스를 두지 않음 |

uv.lock은 Git에 보관하고 직접 편집하지 않습니다. Python 자체 버전과 패키지 버전은 별도 항목입니다.

## Python 버전 관리

```bash
uv --version
uv python list
uv python install 3.12
uv python find 3.12
```

3.12는 예시입니다. 프로젝트 버전을 선택한 뒤 `uv python pin 버전`으로 기록할 수 있습니다. 기존 프로젝트의 .python-version·requires-python을 임의 변경하지 않습니다.

## 새 프로젝트와 일상 작업

```bash
uv init my-project
cd my-project
uv add requests
uv add --dev pytest
uv run python --version
uv run pytest
```

`uv add`는 의존성 선언과 잠금·환경을 함께 관리합니다. 제거는 `uv remove requests`, 개발 의존성 제거는 `uv remove --dev pytest`입니다. 프로젝트 실행은 `uv run python script.py` 또는 `uv run 도구명`을 사용합니다. uv run은 필요 시 환경을 동기화할 수 있으므로 변경 파일을 확인합니다.

일반 프로젝트 명령에서는 .venv를 수동 활성화할 필요가 없습니다. 편집기나 다른 프로그램에서 필요하면 .venv 인터프리터를 선택합니다.

## 기존 uv 프로젝트 복원

```bash
uv sync --locked
uv run --locked python --version
uv run --locked pytest
```

pytest는 해당 프로젝트에 선언돼 있을 때 실행합니다. `--locked`는 잠금 파일 변경이 필요하면 실패하도록 합니다. 실패하면 요구 Python·pyproject.toml·uv.lock의 일관성을 확인합니다. 초기 복원에서 uv lock으로 문제를 덮지 않습니다.

> [!IMPORTANT]
> `uv sync`는 기본적으로 환경을 선언 내용과 정확히 맞추므로 별도로 설치한 불필요 패키지가 제거될 수 있습니다. 작업마다 필요한 의존성은 프로젝트 선언에 추가합니다. CI에서는 프로젝트의 검증 명령과 `--locked`를 사용합니다.

## requirements.txt·pip 방식 유지

먼저 [가상환경 생성·선택](#가상환경-생성활성화와-인터프리터-확인)으로 프로젝트에 맞는 환경을 준비한 뒤 복원합니다.

```bash
uv pip install -r requirements.txt
uv pip list
uv pip check
```

`uv pip`는 활성화된 가상환경(`VIRTUAL_ENV`), Conda 환경, 현재·상위 폴더의 `.venv` 순으로 환경을 찾습니다. 다른 프로젝트 환경이 활성화되어 있다면 먼저 `deactivate`하고 대상 환경을 확인합니다. 활성화 자체는 필수가 아닙니다. 환경을 명확히 지정하려면 `uv pip install --python 실행파일경로 -r requirements.txt`를 사용합니다. 여러 환경이 있을 때 특히 확인합니다.

uv pip 설치는 pyproject.toml·uv.lock을 자동으로 프로젝트 의존성 선언으로 갱신하지 않습니다. uv 프로젝트에서는 uv add·remove를 우선합니다.

requirements.in에서 버전을 해결하려면 `uv pip compile requirements.in -o requirements.txt`, 완전한 요구사항 목록과 환경을 맞추려면 `uv pip sync requirements.txt`를 사용합니다. sync는 목록에 없는 패키지를 제거할 수 있으므로 완전한 목록인지 확인합니다.

## 가상환경 생성·활성화와 인터프리터 확인

프로젝트 루트에서 요구 Python 버전을 선택합니다. 아래 3.12는 예시이며 기존 `.python-version`·`requires-python`·CI가 지정한 값을 우선합니다. 새 환경은 `uv venv`로 생성합니다. 기존 `.venv`가 있으면 현재 Python·의존성을 확인하고 덮어쓰지 않습니다.

```bash
uv python install 3.12
uv python pin 3.12
uv venv --python 3.12 .venv
```

3.12는 minor 버전 선택이며 patch 버전까지 고정하지 않습니다. 정확한 재현이 필요하면 프로젝트에서 검증한 `3.12.x`의 실제 숫자를 install·pin·venv에 동일하게 지정합니다.

`uv python pin`은 `.python-version`을 기록하고 `uv venv --python`은 실제 환경의 Python을 지정합니다. 기존 uv 프로젝트는 위 생성 명령 대신 `uv sync --locked`로 선언·잠금 파일에 맞춰 `.venv`를 복원합니다. `uv run`과 `uv pip`에서는 수동 활성화가 필수가 아니며, 일반 `python` 명령이나 다른 도구를 사용할 때 아래처럼 활성화합니다.

```bash
# macOS / Linux
source .venv/bin/activate
```

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

Windows CMD는 `.venv\Scripts\activate.bat`를 사용합니다. 활성화는 현재 터미널의 PATH를 바꾸며 Python 버전을 새로 선택하거나 설치하지 않습니다. 새 터미널에서는 다시 활성화하거나 인터프리터를 직접 사용합니다.

```bash
python --version
python -c "import sys; print(sys.executable); print(sys.prefix != sys.base_prefix)"
```

Python 버전이 프로젝트 요구값과 같고 실행 경로가 `.venv` 내부이며 마지막 값이 True인지 확인합니다. 종료는 `deactivate`입니다. `uv venv` 환경에는 pip가 기본 포함되지 않을 수 있으므로 아래 기존 pip 절차 대신 `uv pip` 또는 프로젝트의 `uv add`·`uv sync`를 사용합니다.

## 기존 표준 venv·pip 프로젝트 유지

기존 README가 uv가 아닌 Python 표준 venv·pip를 지정한 프로젝트에만 적용합니다. 해당 프로젝트가 지정한 Python으로 표준 venv를 생성하는 기존 절차를 유지하고, uv 환경 생성의 기본 명령으로 사용하지 않습니다. 환경은 생성에 사용한 Python 버전을 따릅니다. Electron의 node-gyp용 Python도 해당 프로젝트·node-gyp 요구 버전을 우선합니다.

<details>
<summary>기존 pip 환경의 패키지 복원·갱신</summary>

### 패키지 설치와 복원

```bash
python -m pip install -r requirements.txt
python -m pip list
python -m pip check
```

새 패키지는 활성화한 환경에서 `python -m pip install requests`처럼 설치합니다. `python -m pip`를 사용하면 선택한 Python과 pip가 달라지는 실수를 줄일 수 있습니다.

pip 자체 갱신은 `python -m pip install --upgrade pip`입니다. 패키지 갱신은 목표 버전을 정해 수행하고 프로젝트 테스트로 확인합니다. 시스템 Python에서 sudo pip나 강제 전역 설치 옵션을 사용하지 않습니다.

</details>

현재 환경을 기록하려면 `python -m pip freeze > requirements.txt`를 사용할 수 있습니다. 기존 파일을 덮어쓰므로 먼저 Git 변경과 내용을 확인합니다. freeze는 현재 설치 목록이며 다른 OS·Python까지 보장하는 범용 잠금 파일은 아닙니다.

## 활성화 없이 실행

```bash
# macOS / Linux
.venv/bin/python script.py
```

```powershell
# Windows
.\.venv\Scripts\python.exe script.py
```

자동화·VS Code는 이 인터프리터를 직접 선택할 수 있습니다. PowerShell 활성화가 정책으로 차단되면 직접 실행 방식을 사용하고 조직의 전역 정책을 해제하지 않습니다.

## VS Code·Git 관리

Python 확장의 `Python: Select Interpreter`에서 `.venv`를 선택합니다. 새 통합 터미널에서 실제 인터프리터 경로도 확인합니다. 프로젝트 `.gitignore`에 `.venv/`을 추가하고 requirements.txt 또는 프로젝트 의존성 선언을 커밋합니다. 소스·데이터·비밀키를 .venv 안에 보관하지 않습니다.

## Python 변경과 환경 재생성

기존 환경의 Python을 제자리 교체하지 않고 목표 Python으로 별도 `.venv-next`를 만듭니다. 같은 의존성을 설치해 테스트한 뒤 기존 환경을 정리하고 최종 경로에서 다시 생성합니다. venv는 이동·복사보다 재생성이 원칙입니다.

의존성 파일에 없는 설치 내역이 필요한지 먼저 확인하고, 환경 디렉터리 안에 소스·데이터가 없는지 검토합니다. 다른 PC에서 `.venv`를 복사하지 않고 필요한 Python과 의존성 파일로 복원합니다.

## 기존 pip·표준 venv 문제 해결

| 상황 | 확인 |
| :--- | :--- |
| pip가 시스템에 설치함 | sys.executable과 `python -m pip --version` 확인 |
| 표준 venv 사용 중 Linux에서 venv 모듈 없음 | 배포판의 해당 Python용 venv 패키지 설치 |
| 이동 후 실행 실패 | 새 경로에서 환경 재생성 |
| node-gyp 실패 | 프로젝트의 Python·컴파일러·Node/Electron 호환 조건 확인 |

가상환경 생성·선택·활성화 설명 확인일: 2026-11-02. 공식 문서와 대조했으며 이 문서 점검에서 환경 생성·패키지 설치는 실행하지 않았습니다.

공식 참고: [Python 표준 venv](https://docs.python.org/3/library/venv.html), [uv 가상환경](https://docs.astral.sh/uv/pip/environments/).

## 도구 실행·격리

```bash
uvx ruff --version
uv tool install ruff
uv tool list
```

uvx는 별도 도구 환경에서 실행하며 프로젝트 의존성을 추가하지 않습니다. 프로젝트가 특정 버전의 린터를 고정했다면 해당 프로젝트의 `uv run ruff`를 우선합니다. 지속 설치한 도구는 `uv tool upgrade ruff`, 제거는 `uv tool uninstall ruff`로 관리합니다.

## 업데이트와 복귀

패키지 버전 확인은 `uv tree`로 시작합니다. 특정 패키지는 `uv lock --upgrade-package requests` 후 `uv sync`로 반영합니다. 전체 갱신이 목적일 때만 `uv lock --upgrade`를 사용합니다. uv.lock·pyproject 변경을 검토하고 테스트합니다.

Python 변경은 새 버전 설치 → `uv python pin 목표버전` → requires-python·CI 검토 → uv sync → 실행·테스트 순서로 진행합니다. Python과 패키지의 대규모 변경은 나누어 진행합니다. 실패하면 이전 버전 파일·선언·uv.lock을 복원하고 uv sync --locked로 환경을 다시 맞춥니다.

## 캐시·문제 해결

`uv cache dir`로 캐시 위치를 확인합니다. `uv cache prune`은 불필요한 캐시 정리에 사용합니다. 캐시 삭제가 프로젝트 의존성 문제를 해결한다고 가정하지 않습니다.

| 상황 | 확인 |
| :--- | :--- |
| Python 버전 불일치 | .python-version·requires-python·실행 중인 인터프리터 |
| 잠금 파일 검사 실패 | pyproject와 uv.lock이 같은 변경으로 커밋됐는지 |
| 설치한 패키지가 없어짐 | uv sync의 정확한 동기화 여부, uv add 누락 |
| VS Code import 오류 | .venv 인터프리터 선택과 설치 그룹 |
| 네이티브 패키지 빌드 실패 | OS·CPU용 wheel·컴파일러·개발 헤더 확인 |

공식 참고: [프로젝트](https://docs.astral.sh/uv/guides/projects/), [Python 관리](https://docs.astral.sh/uv/guides/install-python/), [pip 인터페이스](https://docs.astral.sh/uv/pip/), [도구 관리](https://docs.astral.sh/uv/guides/tools/).

제거 후 숨김 설정·캐시·셸 초기화 항목까지 정리하려면 [도구별 제거·잔여 파일 관리](./uninstall-cleanup.md)를 함께 확인합니다.
