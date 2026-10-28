<!-- version: v2.0.0 -->
# 서버 Python 작업 영역

이 문서는 **서버 관리자가 만든 SSH 컨테이너에 접속한 developer 사용자**가 실행하는 언어 설정입니다. 개인 PC의 로컬 Docker·Reopen in Container 절차가 아닙니다. 서버 생성·포트·키·볼륨은 [공통 구성](../../guides/docker_container_setup.md)을 따릅니다.


## uv 설치

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

설치 결과의 PATH 안내를 적용하고 새 로그인 셸에서 uv --version을 확인합니다. 기본 이미지의 시스템 Python은 OS용으로 유지합니다. Python 3.10~3.14 등은 프로젝트 요구에 맞게 uv로 추가합니다.

## 프로젝트 복원

pyproject.toml·uv.lock이 있으면:

```bash
uv sync --locked
uv run --locked python --version
```

requirements.txt 프로젝트는 요구 Python을 확인한 뒤 진행합니다. 다음은 3.12 예시입니다.

```bash
uv python install 3.12
uv venv --python 3.12 .venv
uv pip install -r requirements.txt
```

VS Code 원격 Python 확장에서 해당 .venv를 선택합니다. uv는 버전을, 가상환경은 패키지를 격리합니다. 시스템 pip·sudo pip는 사용하지 않습니다. Python 버전·pyproject·잠금 파일을 Git으로 기록하고 .venv는 백업·PC 간 복사 대신 재생성합니다. [uv 가이드](../../../../01.Tools/uv.md)
