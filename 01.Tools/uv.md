<!-- version: v1.2.0 -->
# uv 사용 가이드

확인일: 2026-10-28. uv는 Python 버전, 가상환경, 패키지 의존성, 잠금 파일과 CLI 도구 환경을 관리합니다. 기존 requirements.txt 방식과 pyproject.toml·uv.lock 방식 중 프로젝트가 사용하는 흐름을 따릅니다. pip와 유사한 명령이 있지만 모든 동작·옵션이 완전히 같지는 않습니다.

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

`uv sync`는 기본적으로 환경을 선언 내용과 정확히 맞추므로 별도로 설치한 불필요 패키지가 제거될 수 있습니다. 작업마다 필요한 의존성은 프로젝트 선언에 추가합니다. CI에서는 프로젝트의 검증 명령과 `--locked`를 사용합니다.

## requirements.txt·pip 방식 유지

```bash
uv venv --python 3.12 .venv
uv pip install -r requirements.txt
uv pip list
uv pip check
```

프로젝트 루트의 .venv를 탐지하므로 항상 활성화가 필수인 것은 아닙니다. 환경을 명확히 지정하려면 `uv pip install --python 실행파일경로 -r requirements.txt`를 사용합니다. 여러 환경이 있을 때 특히 확인합니다.

uv pip 설치는 pyproject.toml·uv.lock을 자동으로 프로젝트 의존성 선언으로 갱신하지 않습니다. uv 프로젝트에서는 uv add·remove를 우선합니다.

requirements.in에서 버전을 해결하려면 `uv pip compile requirements.in -o requirements.txt`, 완전한 요구사항 목록과 환경을 맞추려면 `uv pip sync requirements.txt`를 사용합니다. sync는 목록에 없는 패키지를 제거할 수 있으므로 완전한 목록인지 확인합니다.

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
