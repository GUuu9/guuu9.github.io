<!-- version: v1.0.0 -->
# Python 개발을 위한 Dev Container 구축 가이드

이 가이드는 VS Code Dev Containers 환경 내부에서 Python 3 개발 환경을 구성하고, 가상 환경(venv)을 활용하여 패키지를 격리 관리하며, Flask/Django 등 웹 서버를 로컬에서 실행하는 방법을 다룹니다.

---

## 1. 프로젝트 파일 구성

Python 개발 환경을 구축하기 위한 폴더 트리는 다음과 같습니다.

```text
my-python-project/
└── .devcontainer/
    ├── devcontainer.json   # Dev Container 설정 파일
    └── Dockerfile          # Python 3, pip, venv가 설치된 이미지 정의
```

### 1) `Dockerfile` 작성
순수 `ubuntu:22.04` 기본 이미지 위에서 Python 3 인터프리터, pip, venv, 헤더 파일(`python3-dev`)과 표준 빌드 도구(`build-essential`)를 설치하고, 권한이 제약된 안전한 개발용 계정(`developer`)을 생성합니다.

```dockerfile
# 1. 베이스 이미지로 우분투 22.04 LTS 사용
FROM ubuntu:22.04

# 2. apt 패키지 설치 시 대화형 프롬프트가 뜨는 것을 방지
ENV DEBIAN_FRONTEND=noninteractive

# 3. 필수 시스템 패키지 및 Python 개발 도구 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    sudo \
    build-essential \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# 4. 개발 전용 사용자(developer) 생성 및 sudo 권한 할당
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer

# 5. 사용자 비밀번호 설정
RUN echo 'developer:developer' | chpasswd

# 6. sudo 실행 시 패스워드 입력 생략 설정
RUN echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER developer
WORKDIR /home/developer

# 7. pip로 설치한 스크립트(~/.local/bin)를 PATH에 추가
ENV PATH=$PATH:/home/developer/.local/bin
```

### 2) `devcontainer.json` 작성
컨테이너 생성 직후 Python 가상 환경(`.venv`)을 자동으로 초기화하고, Python 공식 확장 및 Black 포매터를 탑재합니다. 또한 Flask/Django 등 웹 개발 서버의 기본 포트인 `8000`번을 로컬로 포워딩합니다.

```json
{
  "name": "Python 개발 환경",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "."
  },
  "remoteUser": "developer",

  // 컨테이너 생성 후 가상 환경(.venv)을 자동으로 초기화합니다.
  "postCreateCommand": "python3 -m venv .venv",

  "customizations": {
    "vscode": {
      "settings": {
        // 가상 환경 내부의 Python 인터프리터를 기본값으로 지정
        "python.defaultInterpreterPath": "./.venv/bin/python",
        // 저장 시 자동 포매팅 활성화
        "editor.formatOnSave": true,
        // 기본 포매터로 Black 지정
        "[python]": {
          "editor.defaultFormatter": "ms-python.black-formatter"
        }
      },
      "extensions": [
        "ms-python.python",           // Python 언어 공식 확장
        "ms-python.pylint",           // 정적 코드 분석 (Pylint)
        "ms-python.black-formatter",  // 코드 자동 포매터 (Black)
        "ms-python.isort"             // import 구문 자동 정렬 (isort)
      ]
    }
  },

  // 로컬 컴퓨터로 포워딩할 포트 목록 (Flask/Django 기본 개발 서버 포트)
  "forwardPorts": [8000]
}
```

---

## 2. 사용 방법

### 1단계: 컨테이너에서 열기
1. VS Code에서 Python 프로젝트 폴더를 열고, `.devcontainer` 폴더를 프로젝트 루트에 배치합니다.
2. VS Code 좌측 하단의 `><` 아이콘을 클릭하거나 `F1` 키를 눌러 **`Dev Containers: Reopen in Container`**를 선택합니다.
3. 최초 실행 시 Docker 이미지를 빌드하므로 수 분이 소요될 수 있습니다. 빌드가 완료되면 `postCreateCommand`에 의해 `.venv` 가상 환경이 자동으로 생성됩니다.

### 2단계: 가상 환경 활성화
컨테이너 내부의 VS Code 터미널에서 아래 명령으로 가상 환경을 활성화합니다.

```bash
source .venv/bin/activate
```

> [!NOTE]
> `devcontainer.json`의 `postCreateCommand`는 컨테이너 최초 생성 시에만 `.venv`를 초기화합니다. 이후 터미널을 열 때마다 위 명령으로 가상 환경을 활성화해야 합니다. VS Code는 `python.defaultInterpreterPath` 설정 덕분에 편집기 수준에서는 `.venv`의 인터프리터를 자동으로 인식합니다.

### 3단계: 패키지 설치
가상 환경이 활성화된 상태에서 `requirements.txt`를 이용해 필요한 패키지를 설치합니다.

```bash
# requirements.txt가 있는 경우
pip install -r requirements.txt

# 개별 패키지 설치
pip install flask
```

### 4단계: 애플리케이션 실행
Flask 또는 Django 등의 개발 서버를 실행하면 `devcontainer.json`에 설정된 포트 포워딩(`8000`)을 통해 호스트 브라우저에서 바로 확인할 수 있습니다.

```bash
# Flask 예시
flask run --host=0.0.0.0 --port=8000

# Django 예시
python manage.py runserver 0.0.0.0:8000
```

호스트 PC 브라우저에서 `http://localhost:8000`으로 접속하면 컨테이너 내부에서 실행 중인 서버에 연결됩니다.
