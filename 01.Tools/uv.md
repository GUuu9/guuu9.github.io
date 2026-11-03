<!-- version: v2.0.0 -->
# uv·Python 가상환경

uv로 Python 버전·프로젝트 의존성·가상환경을 관리합니다. 새 프로젝트는 `uv` 명령과 `uv.lock`을 사용하고, 기존 프로젝트는 `requirements.txt` 등 현재 선언을 유지합니다.

## 1. 설치·상태 확인

macOS·Linux에서는 [공식 독립 설치](https://docs.astral.sh/uv/getting-started/installation/)를 사용합니다.

```bash
curl -LsSf https://astral.sh/uv/0.13.6/install.sh | sh
```

설치기의 PATH 안내를 반영하고 새 터미널에서 확인합니다.

```bash
command -v uv
uv --version
```

Windows PowerShell에서는 공식 설치기를 사용하고 새 PowerShell에서 확인합니다.

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.13.6/install.ps1 | iex"
Get-Command uv
uv --version
```

Intel·Ventura에서 Homebrew formula를 설치할 수 없어도 uv 자체의 지원 여부와는 별개입니다. [공식 OS 지원](https://docs.astral.sh/uv/reference/policies/platforms/#macos-versions)을 확인합니다. 기존 설치가 있으면 `which -a uv`로 경로를 확인하고 Homebrew·독립 설치를 중복하지 않습니다.

## 2. 프로젝트 생성·복원·사용

새 프로젝트 루트에서 Python 버전을 기록하고 의존성을 추가합니다.

```bash
uv init my-project
cd my-project
uv python install 3.12
uv python pin 3.12
uv add requests
uv add --dev pytest
uv run python --version
uv run pytest
```

`3.12`는 예시입니다. 기존 프로젝트는 `.python-version`, `requires-python`, CI에서 정한 버전을 따릅니다. `.python-version`은 사용할 버전을 선택하고, `requires-python`은 지원 범위를 선언합니다.

기존 uv 프로젝트는 잠금 파일을 유지해 복원합니다.

```bash
uv sync --locked
uv run --locked python --version
uv run --locked pytest
```

`uv sync`는 `.venv`를 만들고 선언된 패키지로 맞춥니다. `--locked`는 잠금 파일 변경이 필요할 때 실패합니다. 새 패키지는 `uv add`, 제거는 `uv remove 패키지명`을 사용합니다. 일반 작업에서는 `uv run 명령`으로 실행하며 활성화는 필요하지 않습니다.

## 3. 환경·인터프리터 확인

프로젝트 루트에서 Python과 실행 경로를 확인합니다.

```bash
uv python find
uv run python -c "import sys; print(sys.executable)"
```

기본 uv 프로젝트 인터프리터는 `.venv`에 있습니다. VS Code에서는 `Python: Select Interpreter`로 해당 `.venv`를 선택하고, Git에서 `.venv/`을 제외합니다. `uv.lock`은 공유합니다.

기존 pip 프로젝트에만 `requirements.txt` 흐름을 사용합니다.

```bash
uv venv --python 3.12 .venv
uv pip install -r requirements.txt
uv pip check
```

새 uv 프로젝트의 환경은 `uv sync`로 만듭니다. `python -m venv`를 섞지 않습니다. 전체 requirements 파일로 동기화할 때는 `uv pip sync requirements.txt`를 사용하며, 선언에 없는 패키지가 제거될 수 있습니다. 기존 `venv`는 이동·복사하지 말고 프로젝트 Python과 의존성 파일로 다시 만듭니다.

가상환경을 직접 활성화해야 할 때:

```bash
# macOS / Linux
source .venv/bin/activate
```

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

확인은 `python --version`과 `python -c "import sys; print(sys.executable)"`를 사용합니다. 종료는 `deactivate`입니다. 활성화 없이 `.venv/bin/python` 또는 Windows의 `.venv\Scripts\python.exe`를 직접 실행할 수 있습니다.

## 업데이트·복귀

- uv 자체: `uv self update`
- Python 추가·선택: `uv python install 버전` → `uv python pin 버전`
- 패키지 하나 갱신: `uv lock --upgrade-package 패키지명` → `uv sync`
- 선언 범위 내 전체 갱신: `uv lock --upgrade` → `uv sync`
- 복귀: 이전 `.python-version`·`pyproject.toml`·`uv.lock`을 복원한 뒤 `uv sync --locked`

Python 변경과 패키지 갱신은 나누어 진행합니다. `uv lock --upgrade`는 모든 잠금 패키지를 바꾸므로 전체 갱신을 의도할 때만 사용합니다.

독립 실행 CLI는 `uv tool install ruff`, 확인은 `uv tool list`, 제거는 `uv tool uninstall ruff`를 사용합니다. 한 번만 실행할 도구는 `uvx ruff --version`으로 실행할 수 있습니다.

공식 안내: [프로젝트](https://docs.astral.sh/uv/guides/projects/) · [Python 관리](https://docs.astral.sh/uv/guides/install-python/) · [pip 인터페이스](https://docs.astral.sh/uv/pip/) · [CLI 도구](https://docs.astral.sh/uv/guides/tools/).
