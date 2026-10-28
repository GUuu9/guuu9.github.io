<!-- version: v1.1.0 -->
# Python venv 사용 가이드

확인일: 2026-10-28. venv는 Python 표준 라이브러리의 가상환경 도구입니다. 프로젝트 패키지를 시스템·다른 프로젝트와 분리합니다. Python 자체 버전 다운로드·잠금 파일 관리는 하지 않으므로 필요하면 [uv](./uv.md)와 함께 사용합니다.

## 언제 사용하는가

기존 README가 venv·pip·requirements.txt를 기준으로 할 때 사용합니다. 환경은 만드는 데 사용한 Python 버전을 따릅니다. Python이나 의존성 버전이 고정되지 않으면 venv만으로 동일한 실행 결과를 보장할 수 없습니다. Electron의 node-gyp용 Python도 해당 프로젝트·node-gyp가 요구하는 버전을 우선합니다.

## 생성과 활성화

먼저 프로젝트가 요구하는 Python을 선택합니다. 아래 python3 또는 py가 어떤 버전을 가리키는지 확인합니다.

```bash
# macOS / Linux
python3 --version
python3 -m venv .venv
source .venv/bin/activate
```

```powershell
# Windows: 설치된 Python 3.12가 필요한 프로젝트의 예시
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Windows CMD는 `.venv\Scripts\activate.bat`를 사용합니다. 활성화는 현재 터미널의 PATH를 바꿉니다. 새 터미널에서는 다시 활성화하거나 해당 인터프리터를 직접 사용합니다.

```bash
python -c "import sys; print(sys.executable); print(sys.prefix != sys.base_prefix)"
python -m pip --version
```

경로가 프로젝트 .venv 내부이고 마지막 값이 True인지 확인합니다. 종료는 `deactivate`입니다.

## 패키지 설치와 복원

```bash
python -m pip install -r requirements.txt
python -m pip list
python -m pip check
```

새 패키지는 활성화한 환경에서 `python -m pip install requests`처럼 설치합니다. `python -m pip`를 사용하면 선택한 Python과 pip가 달라지는 실수를 줄일 수 있습니다.

pip 자체 갱신은 `python -m pip install --upgrade pip`입니다. 패키지 갱신은 목표 버전을 정해 수행하고 프로젝트 테스트로 확인합니다. 시스템 Python에서 sudo pip나 강제 전역 설치 옵션을 사용하지 않습니다.

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

## 문제 해결

| 상황 | 확인 |
| :--- | :--- |
| pip가 시스템에 설치함 | sys.executable과 `python -m pip --version` 확인 |
| Linux에서 venv 모듈 없음 | 배포판의 해당 Python용 venv 패키지 설치 |
| 이동 후 실행 실패 | 새 경로에서 환경 재생성 |
| node-gyp 실패 | 프로젝트의 Python·컴파일러·Node/Electron 호환 조건 확인 |

공식 참고: [Python venv](https://docs.python.org/3/library/venv.html).
