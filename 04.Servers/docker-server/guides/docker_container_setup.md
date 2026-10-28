<!-- version: v2.0.0 -->
# 2. 서버에서 사용자 작업 영역 생성·개인 PC 접속

## 1. 서버 관리자가 생성

공통 [Dockerfile](../Dockerfile)·[compose.yaml](../compose.yaml)을 사용합니다. SSH 서버·계정·보안 설정을 언어별 Dockerfile에 복제하지 않습니다. [구축 안내 3~5절](../README.md#3-사용자별-구성-파일과-ssh-공개키)을 순서대로 진행합니다.

1. 서버의 /srv/workspaces/사용자별 디렉터리에 공통 파일을 배치합니다.
2. 개인 PC에서 받은 공개키와 서버에서 생성한 고유 SSH host key를 access 디렉터리에 준비합니다.
3. .env에 고유 COMPOSE_PROJECT_NAME·BIND_ADDRESS·SSH_PORT·WORKSPACE_IMAGE를 지정합니다.
4. 이미지 한 버전을 빌드·검증한 뒤 사용자 영역에 배포합니다. 같은 버전 태그를 덮어쓰지 않습니다.

```bash
# 서버 관리자: 해당 사용자 Compose 디렉터리에서
sudo docker compose config --quiet
sudo docker compose build workspace
sudo docker compose run --rm --no-deps workspace /usr/sbin/sshd -t -h /etc/workspace-ssh/host_key
sudo docker compose up -d --no-build --pull never
sudo docker compose ps
sudo docker compose logs --tail=100 workspace
```

공통 Compose는 이미지 태그를 환경 변수로 요구하고 개인 home을 named volume으로 보관합니다. authorized_keys·host key는 읽기 전용으로 연결합니다. 사용자별 포트·프로젝트명·볼륨·키는 분리하며 공유 /data/projects나 고정 컨테이너 이름을 일괄 사용하지 않습니다.

## 2. 개인 PC 사용자가 접속

개인 PC에 SSH 클라이언트와 VS Code Remote - SSH만 있으면 됩니다. 사용자에게 로컬 Docker 설치·원격 Docker 관리 권한을 요구하지 않습니다.

```bash
ssh -i ~/.ssh/workspace_alice -p 2222 developer@서버주소
```

최초 host key 지문을 관리자에게 받은 값과 비교합니다. VS Code SSH 프로필은 [공통 접속 안내](../README.md#6-개인-pc에서-sshvs-code-접속)를 따릅니다. SSH 후 /home/developer 아래 프로젝트를 열고 필요한 확장을 **원격 작업 영역**에 설치합니다. devcontainer.json의 postCreateCommand가 직접 SSH 접속 시 자동 실행된다고 가정하지 않습니다.

## 3. 컨테이너 내부 언어 설정

다음은 로그인한 developer 사용자가 수행합니다. 기본 이미지는 sudo를 제공하지 않으므로 apt가 필요한 라이브러리는 관리자가 이미지에 추가하고 새 버전으로 배포합니다.

| 환경 | 설정 안내 |
| :--- | :--- |
| Ubuntu 공통 | [기본 환경](../environments/ubuntu/README.md) |
| Node.js·서버·React·Electron | [nvm·npm](../environments/nodejs/README.md) |
| TypeScript | [프로젝트 의존성·빌드](../environments/typescript/README.md) |
| Python | [uv·프로젝트 가상환경](../environments/python/README.md) |
| Rust | [rustup·고정 툴체인](../environments/rust/README.md) |
| Flutter | [FVM·Android 빌드](../environments/flutter/README.md) |

홈 볼륨의 런타임은 재생성 후 유지되지만 별도 버전·잠금 파일과 백업이 필요합니다. 다른 OS의 node_modules·.venv를 복사하지 않습니다.

## 4. 개발 웹 앱 확인

개인 PC의 SSH config에 workspace-alice를 등록한 뒤:

```bash
# 개인 PC에서 실행
ssh -N -L 127.0.0.1:3000:127.0.0.1:3000 workspace-alice
```

서버 컨테이너 3000에서 앱이 실행돼 있어야 합니다. 개인 PC 브라우저에서 http://localhost:3000 을 엽니다. 이 터널의 localhost는 양쪽 의미가 다르며 서버 호스트의 서비스에 자동 연결하는 것은 아닙니다. VS Code Ports 탭으로 전달해도 됩니다.

## 5. 선택적 작업 영역

[RStudio·Jupyter·브라우저 VS Code·Android 선택 안내](../workspace-types.md)를 따릅니다. code-server는 실제 config.yaml과 인증을 구성하고 HTTPS·VPN 또는 SSH 터널로 접근합니다. 원격 GUI가 필요하면 개인별 VM·원격 데스크톱을 별도 검증합니다.

Wine은 Windows 호환 계층이며 Windows 자체가 아닙니다. QEMU/KVM은 VM으로서 디바이스·가상화·권한·라이선스 요구를 따로 확인합니다. 기존 무인증 VNC·공용 비밀번호·privileged 예제는 서버 기본 설정에서 제거했습니다. GUI·Windows 설정은 현재 검증된 실행 템플릿으로 제공하지 않습니다.

## 6. 선택적 Dev Containers 연동

이 문서의 기본 접속은 컨테이너 SSH입니다. 관리자가 원격 엔진을 대상으로 Dev Containers를 사용하려면 서버 파일 경로·엔진 연결·권한을 별도로 구성합니다. 개인 PC에서 Reopen in Container를 실행하는 것만으로 서버 컨테이너가 생성되지 않습니다. [공식 원격 Docker 안내](https://code.visualstudio.com/remote/advancedcontainers/develop-remote-host)

DB는 작업 영역별 내부 네트워크·named volume·개인 자격증명으로 구성하고 기본적으로 외부 포트를 공개하지 않습니다. DB 이미지 변경은 일관된 백업·복원 검증 후 수행합니다.

다음: [운영·복구](../operations.md).
