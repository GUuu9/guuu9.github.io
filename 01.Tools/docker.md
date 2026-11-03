<!-- version: v2.0.0 -->
<!-- {% raw %} -->
# Docker·Compose 사용 가이드

확인일: 2026-10-28. Docker Desktop을 실행하고 주로 터미널에서 컨테이너를 관리하는 로컬 개발 기준입니다. 설치·OS별 지원 조건은 아래 설치 절차를 참고합니다. 명령은 개인 PC의 임의 폴더에서 일반 사용자로 실행하며 관리자 작업은 별도 표시합니다.

## macOS Docker Desktop 설치

먼저 macOS 버전·CPU와 [공식 지원 조건](https://docs.docker.com/desktop/setup/install/mac-install/#system-requirements)을 확인합니다. **Intel·Ventura 13.7.8은 최신 버전을 설치할 수 없으므로 [4.48.0 설치 안내](#intel-ventura의-docker-desktop-4480)를 따릅니다.**

지원되는 환경은 [공식 Mac 설치 페이지](https://docs.docker.com/desktop/setup/install/mac-install/)에서 칩에 맞는 Docker Desktop을 설치합니다. 앱을 실행해 초기 설정을 끝내고 엔진이 준비될 때까지 기다립니다. CLI만 설치해서는 로컬 컨테이너를 실행할 수 없습니다.

```bash
docker version
docker compose version
docker run --rm hello-world
```

hello-world는 Docker 엔진 확인용이며 이미지 다운로드가 필요합니다. 실제 프로젝트의 Compose·볼륨·터미널 접속·Dev Containers 설정은 [Docker 가이드](docker.md)에서 진행합니다.

## Windows Docker Desktop·WSL 설치

[공식 Windows 지원 조건](https://docs.docker.com/desktop/setup/install/windows-install/)의 Windows 빌드·가상화·WSL 버전 요구 조건을 먼저 확인합니다. 필요한 경우 **관리자 PowerShell**에서 WSL을 설치·갱신하고 요구되는 재시작을 완료합니다. 아래는 사용자 배포판을 추가하지 않는 예시입니다.

```powershell
wsl --install --no-distribution
wsl --update
wsl --status
```

[Microsoft WSL 명령 안내](https://learn.microsoft.com/en-us/windows/wsl/basic-commands). 이미 구성되어 있으면 재설치하지 않고 상태를 확인합니다. Windows x86_64 공식 Docker Desktop을 설치하고 WSL2 백엔드의 Linux 컨테이너 환경으로 실행합니다. 엔진 준비 후 일반 PowerShell에서 확인합니다.

```powershell
docker context ls
docker context show
docker version
docker compose version
docker run --rm hello-world
```

Windows 컨테이너가 필요하면 별도 지원 조건·설치 모드를 확인합니다. 위 Linux 컨테이너 구성과 구분합니다.

#### WSL에서 개발할 때만

개인 PC PowerShell에서 `wsl --list --online`으로 배포판을 확인하고 선택한 배포판을 설치합니다. 예를 들어 Ubuntu가 목록에 있으면 `wsl --install -d Ubuntu`를 사용하고 Linux 사용자 생성을 마칩니다.

WSL 안의 도구는 [Linux 문서](../00.Setup/Linux_Dev_Setting.md)를 따르되, VS Code는 Windows 설치본과 WSL 확장으로 연결하고 Docker는 Windows Docker Desktop의 해당 배포판 통합을 사용합니다. Linux GUI 앱·Docker Desktop을 중복 설치하지 않습니다. 소스는 Linux 홈 파일시스템에 두고 Windows의 `node_modules`·`.venv`를 공유하지 않습니다. Codex·Ponytail도 WSL에서 쓰려면 해당 환경에 별도 설치·인증합니다. Windows에 연결한 Android USB 기기가 WSL에 자동 전달된다고 가정하지 않습니다.

## Linux Docker Desktop 설치

[공식 Linux 지원 조건](https://docs.docker.com/desktop/setup/install/linux/)에서 지원 배포판·x86_64·KVM 조건을 확인한 뒤 해당 [Ubuntu](https://docs.docker.com/desktop/setup/install/linux/ubuntu/) 또는 [Debian](https://docs.docker.com/desktop/setup/install/linux/debian/) 패키지 설치 절차를 따릅니다. 앱을 실행해 엔진이 준비된 뒤 확인합니다.

```bash
docker context ls
docker context show
docker version
docker compose version
docker run --rm hello-world
```

Desktop은 별도 VM·`desktop-linux` context를 사용하며 호스트 Engine의 이미지·컨테이너·볼륨을 자동 공유하지 않습니다. 포트 충돌을 피하도록 사용할 엔진을 구분합니다. GUI 없는 서버에는 Desktop 대신 [Docker Engine](https://docs.docker.com/engine/install/)과 [서버 가이드](../04.Servers/docker-server/README.md)를 사용합니다. WSL에서는 Windows Docker Desktop 통합을 사용하며 Linux Desktop을 중복 설치하지 않습니다.

## Intel Ventura의 Docker Desktop 4.48.0

2026-10-30 확인: 이 Mac은 `macOS 13.7.8`·`x86_64`입니다. Docker Desktop **4.48.0(빌드 207573)**은 macOS 13에 설치 가능한 마지막 버전입니다. [4.48.0 공식 릴리스 노트](https://docs.docker.com/desktop/release-notes/#4480)는 다음 릴리스부터 macOS 14가 필요하다고 명시합니다. 최신 Intel 배포판을 받거나 Homebrew로 설치 경로만 바꿔도 OS 요구 조건은 해결되지 않습니다.

#### 설치 파일 선택·검증

개인 Mac에서 다음 순서로 진행합니다. Homebrew는 필요하지 않습니다.

1. 기존 Docker 데이터가 있다면 먼저 백업합니다. 실행 가능한 환경에서는 [Docker 가이드](docker.md)의 이미지·볼륨 백업을 따릅니다. 앱이 시작되지 않으면 Docker를 완전히 종료한 상태에서 `~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw`를 별도 위치에 복사합니다. 디스크 위치를 변경했다면 실제 위치를 사용하며, bind mount의 호스트 파일은 별도 보관합니다. [공식 백업·복원 안내](https://docs.docker.com/desktop/settings-and-maintenance/backup-and-restore/).
2. [Docker Desktop 4.48.0 Intel 공식 DMG](https://desktop.docker.com/mac/main/amd64/207573/Docker.dmg)를 내려받습니다. arm64 또는 버전이 고정되지 않은 최신 `Docker.dmg` 링크와 구분합니다.
3. 내려받은 파일의 SHA-256을 [동일 빌드 공식 체크섬](https://desktop.docker.com/mac/main/amd64/207573/checksums.txt)과 비교합니다. 아래 명령은 파일이 `~/Downloads/Docker.dmg`에 있을 때의 예시이며 실제 저장 경로·파일명에 맞춥니다.

```bash
shasum -a 256 ~/Downloads/Docker.dmg
```

확인 당시 공식 SHA-256:

```text
fac73a1edc91e6bce5a449e83e3d0b537f19df74c5f51af4705e479cf0d32515
```

체크섬이 다르면 설치하지 않고 다운로드 출처·파일을 다시 확인합니다. 위 주소는 확인일에 HTTP 200으로 응답했지만, Docker는 오래된 설치 파일의 제공을 중단할 수 있습니다. 링크가 사라지면 임의 미러의 파일을 기본 대안으로 사용하지 않습니다.

#### 설치·실행·업데이트 주의

1. 기존 Docker와 이를 사용하는 도구를 종료합니다. DMG를 열고 Docker.app을 Applications로 옮깁니다. 기존 앱 교체는 데이터 백업을 마친 뒤 진행합니다. 더 최신 버전에서 사용한 데이터 디스크의 하위 버전 호환성은 보장하지 않습니다.
2. Docker.app을 실행하고 초기 설정·필요한 권한 안내를 완료합니다. 엔진이 준비되면 [공통 설치 문서의 확인 명령](#macos-docker-desktop-설치)을 실행합니다. `docker version`에 Client와 Server가 모두 표시되어야 합니다. Docker Desktop 앱 버전 4.48.0과 포함된 Engine·Compose 버전은 서로 다릅니다.
3. 앱의 업데이트 설정에서 자동 다운로드·자동 설치 항목이 있으면 끄고 4.48.0을 유지합니다. macOS 13에서는 최신 버전 업데이트를 수락하지 않습니다. 새 버전 전환 전에는 OS 요구 조건과 데이터 백업을 다시 확인합니다.

이 방법은 **지원이 종료된 구버전으로 로컬 개발 환경을 복원하는 방법**입니다. 최신 보안 수정은 포함되지 않습니다. 장기 사용은 해당 Mac에서 공식 지원하는 macOS로 업그레이드한 뒤 지원되는 Docker Desktop을 설치하거나, [Linux Docker 서버](../04.Servers/docker-server/README.md)에서 작업하고 Mac은 SSH·VS Code로 접속하는 구성을 검토합니다. 서버의 볼륨과 소스는 Mac의 기존 로컬 데이터와 별개입니다.

검증 범위: 현재 Mac의 OS·CPU, 공식 지원 변경 내용, DMG HTTP 응답과 공식 체크섬 조회를 확인했습니다. 설치 파일 전체 다운로드·서명 검사·설치·엔진 실행·기존 데이터 복원은 수행하지 않았습니다.

## 1. 용도와 구성 요소

프로젝트마다 다른 OS 라이브러리·런타임·DB를 격리할 때 사용합니다. 호스트에서는 nvm·uv·FVM으로 개발하고 DB만 컨테이너로 실행하거나, 프로젝트의 개발 환경 전체를 컨테이너로 구성할 수 있습니다.

| 요소 | 역할 | 보관·변경 시점 |
| :--- | :--- | :--- |
| 이미지 | 실행 환경의 기반 | pull 또는 Dockerfile build로 준비 |
| 컨테이너 | 이미지로 만든 실행 인스턴스 | 시작·중지·재생성 가능 |
| Dockerfile | 이미지 생성 절차 | 소스와 함께 Git 관리 |
| Compose 파일 | 서비스·포트·저장소·환경 설정 | 프로젝트와 함께 Git 관리 |
| named volume | Docker가 관리하는 영속 데이터 | DB·업로드 데이터 등, 별도 백업 필요 |
| bind mount | 호스트 디렉터리를 컨테이너에 연결 | 소스 편집 공유. 컨테이너 변경도 호스트에 반영 |
| 네트워크 | 서비스 간 통신 | 같은 Compose 네트워크에서는 서비스명으로 연결 |
| context | 명령을 보낼 Docker 엔진 | 로컬·원격 작업 전 확인 |

컨테이너의 쓰기 영역은 컨테이너 삭제 시 사라집니다. 소스·DB를 그 영역에만 보관하지 않습니다. Docker Desktop의 Linux 컨테이너가 Windows·macOS 자체나 Xcode를 제공하는 것은 아닙니다.

## 2. 엔진·대상 확인

```bash
docker version
docker compose version
docker context ls
docker context show
docker ps -a
```

version에서 Client뿐 아니라 Server가 나와야 합니다. Server 연결 실패 시 Desktop 실행 상태와 context를 확인합니다. 원격 context에서 삭제 명령을 실행하면 원격 데이터가 대상이 됩니다.

macOS·Windows Desktop은 Linux VM 기반이며 Windows는 보통 WSL2 백엔드를 사용합니다. Linux Desktop의 desktop-linux context는 호스트 Engine의 저장소와 별개입니다. 엔진을 바꿨다고 기존 볼륨이 자동 이전되지는 않습니다.

## 3. 단일 컨테이너 실행·접속

아래는 로컬 웹 서버를 시험하는 예시입니다. nginx:alpine은 변경될 수 있는 태그이므로 재현이 필요한 프로젝트는 검증한 버전·digest를 기록합니다.

```bash
docker run -d --name tools-web -p 127.0.0.1:8080:80 nginx:alpine
docker ps
docker logs --tail=100 tools-web
docker exec -it tools-web sh
```

브라우저에서 http://localhost:8080 을 확인합니다. exec는 실행 중인 컨테이너에 새 셸을 띄웁니다. `exit`하면 접속 셸만 종료합니다. 이미지에 bash가 없으면 sh를 사용하며, 셸이 없는 이미지에는 별도 진단 방법이 필요합니다.

```bash
docker stop tools-web
docker start tools-web
```

실습을 마치고 저장할 데이터가 없으면 중지 후 `docker rm tools-web`로 해당 컨테이너만 제거합니다. 동일 이름이 이미 있으면 기존 컨테이너의 용도를 확인하고 무조건 삭제하지 않습니다.

`-p 호스트IP:호스트포트:컨테이너포트` 형식입니다. IP를 생략한 포트 공개는 외부 인터페이스에서도 접근 가능할 수 있으므로 로컬 개발 예시는 127.0.0.1로 제한합니다. [포트 공개](https://docs.docker.com/engine/network/port-publishing/), [exec 명령](https://docs.docker.com/reference/cli/docker/container/exec/)

## 4. 기존 프로젝트의 Compose 사용

프로젝트 README와 compose.yaml을 먼저 확인합니다. 다른 파일명이면 `docker compose -f 파일명 ...`을 사용합니다. 여러 파일·프로젝트명이 필요하면 모든 명령에 동일하게 지정합니다.

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100
```

config --quiet는 구문·변수 해석 오류를 확인하며 실제 서비스 정상 동작까지 검사하지는 않습니다. 프로젝트가 요구하는 환경 변수 파일을 준비한 뒤 실행합니다. config 전체 출력에는 비밀값이 포함될 수 있어 그대로 공유하지 않습니다.

| 작업 | 명령 |
| :--- | :--- |
| 서비스 셸 접속 | `docker compose exec 서비스명 sh` |
| 특정 서비스 로그 추적 | `docker compose logs -f --tail=100 서비스명` |
| 기존 컨테이너 중지·재개 | `docker compose stop`, `docker compose start` |
| 프로세스 재시작 | `docker compose restart 서비스명` |
| 새 임시 컨테이너에서 명령 | `docker compose run --rm 서비스명 명령` |
| 컨테이너·기본 네트워크 제거 | `docker compose down` |

exec는 실행 중인 서비스에 접속하고 run은 새 일회성 컨테이너를 만듭니다. run은 서비스 포트를 기본 공개하지 않습니다. restart는 변경한 Compose 환경 변수·이미지를 적용하는 재생성 방법이 아닙니다. 설정 변경은 up으로 반영합니다.

Compose 프로젝트명을 `docker compose -p 프로젝트명 ...`으로 지정하면 프로젝트별 자원을 구분할 수 있습니다. 호스트 포트 충돌은 별도로 해결해야 합니다. 프로젝트명을 바꾸면 기본 named volume 이름도 달라져 데이터가 없는 것처럼 보일 수 있습니다.

공식 참고: [Compose 빠른 시작](https://docs.docker.com/compose/gettingstarted/), [Compose 명령](https://docs.docker.com/reference/cli/docker/compose/).

VS Code의 Dev Containers 설정이 있는 프로젝트는 기존 구성을 재사용합니다. 호스트의 node_modules·.venv를 컨테이너에서 재사용하지 않습니다.

### VS Code로 컨테이너 작업하기

| 작업 환경 | 개인 PC에 필요한 도구·확장 | 연결 방법 |
| :--- | :--- | :--- |
| 개인 PC의 로컬 개발 컨테이너 | VS Code, 로컬 Docker, Microsoft **Dev Containers** | 실행 중인 개발 컨테이너에 `Dev Containers: Attach to Running Container...`; 기존 `.devcontainer` 구성은 해당 프로젝트의 Reopen 절차 사용 |
| 관리자가 제공한 SSH 개발 컨테이너 | VS Code, OpenSSH 클라이언트, Microsoft **Remote - SSH** | 할당된 주소·컨테이너 SSH 포트·사용자 키로 직접 연결 |
| 원격 Docker 엔진을 직접 관리하는 개발자 | 호스트 SSH 접근, Docker 관리 권한, Remote - SSH·Dev Containers | 원격 호스트에 SSH 연결 후 Dev Containers 구성. 일반 서버 작업 영역 사용자에게는 이 관리 권한을 제공하지 않음 |

로컬 컨테이너 편집에는 SSH 서버 설치가 필요하지 않습니다. DB·nginx 같은 실행 전용 컨테이너를 VS Code 개발 서버로 바꾸거나 SSH 포트를 추가하지 않습니다.

SSH 개발 컨테이너에 연결할 때는 개인 PC에서 다음 순서로 진행합니다.

1. `ssh -V`로 SSH 클라이언트를 확인하고 VS Code Extensions에서 Microsoft Remote - SSH를 설치합니다. Dev Containers 확장은 직접 SSH 방식의 필수 조건이 아닙니다.
2. 관리자가 준 주소·포트·사용자·공개키 등록 여부·host key 지문을 확인하고 먼저 일반 터미널에서 SSH 로그인이 되는지 검사합니다. 키 생성·SSH config 예시는 [서버 접속 안내](../04.Servers/docker-server/README.md#6-개인-pc에서-sshvs-code-접속)를 따릅니다. 개인 키는 개인 PC에 보관합니다.
3. VS Code 명령 팔레트에서 `Remote-SSH: Connect to Host...`를 실행하고 등록한 프로필을 선택합니다. 서버 플랫폼을 물으면 실제 컨테이너의 Linux를 선택합니다.
4. 첫 연결에서 VS Code Server 구성 요소를 원격 사용자 권한으로 준비합니다. 사용자 home의 쓰기 권한·디스크 여유와 다운로드 통신 경로가 필요합니다. 별도 데스크톱 VS Code 앱을 컨테이너에 설치하지 않습니다.
5. 원격 창에서 **Open Folder**로 컨테이너 안 프로젝트를 열고 통합 터미널의 `whoami`, `hostname`, `pwd`로 실행 위치를 확인합니다. 빌드·디버깅 명령과 패키지는 컨테이너 OS·CPU 환경을 사용합니다.
6. 필요한 언어 확장·런타임·프로젝트 의존성을 [서버 작업 영역 가이드](../04.Servers/docker-server/guides/docker_container_setup.md#vs-code-확장과-프로젝트-패키지)에 따라 준비합니다. 웹 앱은 Ports 탭으로 필요한 포트만 전달합니다.
7. 작업을 저장하고 `Remote: Close Remote Connection`으로 연결을 닫습니다. 연결 종료만으로 컨테이너가 중지되지 않습니다.

컨테이너의 프로젝트·원격 확장·사용자 설정을 재생성 후 유지하려면 해당 경로가 볼륨에 있는지 확인합니다. 이 저장소의 서버 구성은 사용자 home을 볼륨으로 보관합니다. `devcontainer.json`의 postCreateCommand는 직접 SSH 연결 시 실행되지 않습니다.

공식 안내: [Remote - SSH](https://code.visualstudio.com/docs/remote/ssh) · [원격 Linux 필수 패키지](https://code.visualstudio.com/docs/remote/linux) · [실행 중 컨테이너 연결](https://code.visualstudio.com/docs/devcontainers/attach-container).

## 5. 네트워크·환경 변수·개발 파일

컨테이너 안의 localhost는 그 컨테이너 자신입니다. 같은 Compose 네트워크의 API가 DB에 접근할 때는 `db:5432`처럼 실제 서비스명과 컨테이너 포트를 사용합니다. 호스트에서 접근할 때는 공개한 호스트 포트를 사용합니다. 웹 브라우저는 Compose 서비스명을 자동으로 해석하지 못합니다.

컨테이너의 개발 서버는 외부 인터페이스 요청을 받을 수 있게 0.0.0.0에 바인딩해야 할 수 있습니다. 이는 호스트 포트 공개와 별개입니다. Dockerfile의 EXPOSE만으로 호스트 포트가 공개되지는 않습니다.

Compose의 .env는 기본적으로 설정 값 치환에 사용됩니다. 컨테이너 프로세스에 전달할 값은 environment 또는 env_file로 설정합니다. 민감한 .env는 Git과 이미지에서 제외하고 필요한 이름만 .env.example로 공유합니다.

소스를 bind mount하면 컨테이너에서 수정·삭제한 파일이 호스트에도 반영됩니다. macOS·Windows의 node_modules·Python .venv를 Linux 컨테이너에서 재사용하지 않습니다. 컨테이너용 의존성은 이미지나 별도 볼륨에서 관리하고 잠금 파일로 설치합니다.

## 6. 이미지 빌드와 버전 관리

```bash
docker build -t my-app:dev .
docker image ls
```

마지막 점은 빌드 컨텍스트입니다. Dockerfile·Compose·의존성 잠금 파일을 Git에 보관하고 .dockerignore에서 .git·호스트 의존성·캐시·비밀값을 제외합니다. 비밀키를 Dockerfile의 COPY·ARG·ENV에 넣어 이미지 레이어에 남기지 않습니다.

컨테이너 셸에서 수동 설치한 도구는 재생성 때 유지되지 않을 수 있으므로 필요한 변경을 Dockerfile로 옮깁니다. 태그는 바뀔 수 있고 digest는 이미지 내용을 지정합니다. 엄격한 재현이 필요한 경우 검증한 digest도 기록하되 보안 업데이트는 별도로 검토합니다.

Apple Silicon은 arm64·멀티 아키텍처 이미지를 우선합니다. amd64 전용 이미지가 필요할 때만 `--platform linux/amd64`를 사용합니다. 에뮬레이션의 성능과 네이티브 모듈·빌드 호환성은 실제 프로젝트로 확인합니다.

## 7. Desktop·이미지 업데이트와 복귀

Desktop은 앱 업데이트 기능 또는 공식 설치 패키지로 갱신합니다. 작업을 저장하고 중요한 볼륨을 백업한 뒤 엔진 재시작 영향을 확인합니다. 갱신 후 version·context·프로젝트 실행을 확인합니다.

이미지는 별도로 업데이트합니다. 먼저 현재 태그·digest와 DB 마이그레이션 여부를 기록한 뒤:

```bash
docker compose pull
docker compose up -d --build
docker compose ps
docker compose logs --tail=100
```

pull은 이미지 기반 서비스의 이미지를 갱신합니다. Dockerfile의 베이스 이미지도 갱신하려면 `docker compose build --pull` 후 `docker compose up -d`를 실행합니다. 무조건 --no-cache부터 사용하지 않습니다.

문제가 있으면 이전 Compose·Dockerfile·잠금 파일·이미지 버전으로 복원합니다. DB 데이터 형식이 변경됐다면 이미지 버전만 낮추지 말고 DB별 복원 절차를 따릅니다. 업데이트 완료 전 이전 이미지·백업을 정리하지 않습니다.

## 8. 데이터 백업·복원

```bash
docker volume ls
docker volume inspect 볼륨명
docker inspect 컨테이너명
```

먼저 Mounts에서 실제 데이터 위치를 확인합니다. named volume은 컨테이너 재생성과 별개의 수명을 가지지만 명시적인 볼륨 삭제·Desktop 초기화로 잃을 수 있습니다.

DB는 pg_dump 등 해당 DB의 공식 백업 도구와 일관성 보장 절차를 사용합니다. 실행 중인 DB 볼륨을 단순 압축하면 일관된 백업이 되지 않을 수 있습니다. 일반 파일 볼륨도 쓰기 작업을 중단한 뒤 백업하며 새 볼륨·별도 환경에서 복원 시험을 합니다. bind mount는 호스트 파일도 별도로 백업합니다.

`docker commit`은 마운트한 볼륨 데이터를 포함하지 않습니다. `docker save`·`docker load`는 이미지를 이동하는 기능이며 컨테이너·볼륨·Compose·비밀값 전체 백업이 아닙니다. 이미지 보관이 필요하면 `docker image save -o app-image.tar 이미지:태그`, 복원은 `docker image load -i app-image.tar`로 수행합니다.

공식 참고: [볼륨과 백업](https://docs.docker.com/engine/storage/volumes/), [이미지 저장](https://docs.docker.com/reference/cli/docker/image/save/).

## 9. 개발 이미지 저장·공유

수동 변경을 계속 공유하려면 Dockerfile에 기록하는 편이 재현하기 쉽습니다. 일회성 변경은 컨테이너를 이미지로 저장할 수 있습니다.

```bash
docker ps -a
docker diff dev-container
docker commit dev-container my-dev:1.0.0
docker image inspect my-dev:1.0.0 --format '{{.Os}}/{{.Architecture}}'
```

`docker commit`은 컨테이너의 쓰기 영역만 저장합니다. 볼륨·bind mount 데이터, 포트·네트워크·실행 옵션은 포함하지 않습니다. 비밀값이 이미지·환경 변수·셸 기록에 없는지 확인합니다.

파일로 전달할 때는 보내는 PC에서 저장하고, 받는 PC에서 불러옵니다.

```bash
docker image save -o my-dev-1.0.0.tar my-dev:1.0.0
docker image load -i my-dev-1.0.0.tar
```

레지스트리 공유는 이미지에 버전 태그를 지정한 뒤 `docker push`·`docker pull`을 사용합니다. 토큰을 명령이나 저장소에 넣지 않습니다. 새 컨테이너를 만들 때는 `docker run` 또는 Compose에 포트·마운트·환경 변수를 다시 지정합니다. [commit](https://docs.docker.com/reference/cli/docker/container/commit/) · [save/load](https://docs.docker.com/reference/cli/docker/image/save/).

## 10. 용량 정리와 문제 해결

먼저 `docker system df`, `docker ps -a`, `docker image ls`, `docker volume ls`로 확인합니다. 필요 없는 대상만 이름·ID로 선택해 제거합니다. 중지된 컨테이너에도 보존할 파일이 있을 수 있습니다.

`docker system prune`은 중지 컨테이너·미사용 네트워크·일부 이미지·빌드 캐시를 지웁니다. `-a`는 이미지 삭제 범위를 넓히고 `--volumes`는 미사용 익명 볼륨도 대상으로 삼습니다. `docker compose down -v`는 프로젝트 볼륨도 지울 수 있습니다. 이 명령들을 업데이트나 일반 장애 해결 절차로 일괄 실행하지 않습니다. [prune 범위](https://docs.docker.com/reference/cli/docker/system/prune/)

| 상황 | 먼저 확인할 것 |
| :--- | :--- |
| 엔진 연결 실패 | Desktop 실행·docker context show·환경의 DOCKER_HOST 설정 |
| 컨테이너 즉시 종료 | ps -a·logs·종료 코드·필수 환경 변수 |
| 포트 충돌 | 다른 프로젝트의 호스트 포트·기존 프로세스 |
| 접속 불가 | 서버 바인딩 주소·호스트 포트 매핑·요청 주체의 localhost 의미 |
| 데이터가 사라진 것처럼 보임 | context·Compose 프로젝트명·볼륨 연결 경로 |
| 권한 오류 | 컨테이너 UID/GID·호스트 파일 소유자. chmod 777로 일괄 우회하지 않음 |
| exec 실패 | 서비스 실행 여부와 셸 포함 여부 |
| 느린 빌드 | 빌드 컨텍스트 크기·dockerignore·캐시·CPU 아키텍처 |

로컬 접속만 필요하면 컨테이너 안에 SSH 서버를 추가하지 않고 exec 또는 VS Code Dev Containers를 사용합니다. 원격 호스트·개발 컨테이너 구성과 템플릿은 [서버 Docker 가이드](../04.Servers/docker-server/README.md)을 참고합니다. 기존 문서의 이미지 스냅샷은 볼륨 백업을 대체하지 않습니다.

제거 후 숨김 설정·캐시·셸 초기화 항목까지 정리하려면 [도구별 제거·잔여 파일 관리](./uninstall-cleanup.md)를 함께 확인합니다.
<!-- {% endraw %} -->
