<!-- version: v1.2.0 -->
# Docker·Compose 사용 가이드

확인일: 2026-10-28. Docker Desktop을 실행하고 주로 터미널에서 컨테이너를 관리하는 로컬 개발 기준입니다. 설치·OS별 지원 조건은 [00.Setup](../00.Setup/OS_Dev_Setting.md)을 참고합니다.

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

## 9. 개발 컨테이너를 이미지로 저장·공유하고 다시 실행하기

전체 흐름은 **컨테이너 변경 저장(commit) → 이미지 전달(save/load 또는 push/pull) → 실행 설정으로 새 컨테이너 생성(run/Compose)**입니다. 이미지를 등록하는 것과 컨테이너를 생성하는 것은 별도 단계입니다.

아래 예시의 원본 컨테이너는 `dev-container`, 공유 이미지는 `my-dev:1.0.0`입니다. 실제 이름은 `docker ps -a`로 확인합니다. Dockerfile로 이미 빌드한 이미지가 있고 컨테이너에서 추가 변경한 것이 없다면 commit 없이 기존 이미지를 바로 공유합니다.

### 9.1 공유 전에 보관 범위 확인

```bash
docker ps -a
docker inspect dev-container
docker diff dev-container
```

inspect의 Mounts·포트·시작 명령·사용자·작업 경로·환경 변수를 확인해 필요한 실행 설정을 Compose나 README로 기록합니다. inspect 출력에는 비밀값이 들어갈 수 있으므로 원본 출력을 그대로 전달하지 않습니다.

| 포함되는 것 | 별도로 전달·복원할 것 |
| :--- | :--- |
| 컨테이너 쓰기 영역에 설치한 도구·파일 | bind mount의 소스·파일 |
| 이미지 설정으로 저장된 CMD·ENTRYPOINT·ENV 등 | named/anonymous volume의 DB·업로드 데이터 |
| 기존 이미지의 레이어와 변경 레이어 | 호스트 포트 매핑·마운트·네트워크·장치 등 실행 옵션 |
| 이미지의 OS·CPU 아키텍처 | 실행 중인 프로세스·메모리·접속 세션 |

환경 변수·설정 파일·셸 기록에 토큰이나 개인 키가 남아 있지 않은지 확인합니다. 이전 이미지 레이어에 들어간 비밀값은 파일 삭제만으로 제거되지 않을 수 있으므로 비밀값 없는 빌드로 다시 만들고 노출된 자격증명을 교체합니다.

### 9.2 컨테이너 변경을 이미지로 저장

쓰기 작업을 완료하고 DB는 일관된 백업을 별도로 준비합니다. 작업 중단이 가능하면 원본 컨테이너를 중지한 상태로 저장합니다.

```bash
docker stop dev-container
docker commit --message "개발 환경 도구 구성 저장" dev-container my-dev:1.0.0
docker image ls my-dev
docker image inspect my-dev:1.0.0 --format '{{.Os}}/{{.Architecture}}'
```

필요하면 `docker start dev-container`로 원본을 다시 실행합니다. 원본을 유지한 채 새 이미지가 만들어지며 볼륨 데이터는 포함되지 않습니다. commit은 프로세스 체크포인트가 아니므로 새 컨테이너는 시작 명령부터 다시 실행됩니다. [commit 공식 안내](https://docs.docker.com/reference/cli/docker/container/commit/)

지속적으로 공유할 개발 환경은 설치 내역을 Dockerfile로 옮겨 build하는 방식도 함께 관리합니다. commit 이미지만 보관하면 어떤 명령으로 구성했는지 추적하기 어렵습니다.

### 9.3 방법 A: 이미지 파일로 전달

보내는 PC에서:

```bash
docker image save -o my-dev-1.0.0.tar my-dev:1.0.0
```

tar 파일과 실행 안내·Compose 파일을 함께 전달합니다. 파일 무결성 확인이 필요하면 다음 OS별 명령으로 SHA-256을 계산하고 수신자가 비교합니다.

| OS | 파일 해시 확인 |
| :--- | :--- |
| macOS | `shasum -a 256 my-dev-1.0.0.tar` |
| Linux | `sha256sum my-dev-1.0.0.tar` |
| Windows PowerShell | `Get-FileHash .\my-dev-1.0.0.tar -Algorithm SHA256` |

받는 PC에서 Docker 엔진을 실행한 뒤:

```bash
docker context show
docker image load -i my-dev-1.0.0.tar
docker image ls my-dev
docker image inspect my-dev:1.0.0 --format '{{.Os}}/{{.Architecture}}'
```

load는 현재 context의 엔진에 이미지와 태그를 등록합니다. 같은 태그가 이미 있으면 기존 이미지 ID를 먼저 기록하고 필요한 경우 다른 태그로 보관합니다. 불러온 뒤 컨테이너가 자동 생성·실행되지는 않습니다. [load 공식 안내](https://docs.docker.com/reference/cli/docker/image/load/)

이미지 전달에는 save/load를 사용합니다. `docker export`/`docker import`는 컨테이너 파일시스템을 다루는 다른 방식이며 이미지 설정·레이어를 동일하게 보존하는 대체 절차가 아닙니다.

### 9.4 방법 B: 레지스트리로 전달

Docker Hub를 사용하는 예시입니다. `your-account`를 본인 계정·조직명으로 바꾸고 저장소 공개 범위와 업로드 권한을 먼저 확인합니다.

```bash
docker login
docker tag my-dev:1.0.0 your-account/my-dev:1.0.0
docker push your-account/my-dev:1.0.0
```

받는 PC에서는 비공개 이미지라면 접근 권한이 있는 계정으로 login한 뒤:

```bash
docker pull your-account/my-dev:1.0.0
docker image ls your-account/my-dev
```

공유할 때 이미지 이름·버전·push 결과의 digest를 기록합니다. 동일 버전 태그를 덮어쓰기보다 새 버전을 발행합니다. 엄격히 같은 이미지를 받아야 하면 `your-account/my-dev@sha256:실제digest`로 pull합니다. 사설 레지스트리는 주소를 이미지 이름 앞에 붙이고 해당 호스트로 login합니다. 토큰을 명령 인자·저장소에 직접 남기지 않습니다. [push 공식 안내](https://docs.docker.com/reference/cli/docker/image/push/)

### 9.5 받은 이미지로 개발 컨테이너 생성

파일 전달은 `my-dev:1.0.0`, 레지스트리 전달은 `your-account/my-dev:1.0.0`을 사용합니다. 아래는 **sh가 포함된 Linux 개발 이미지**에서 셸로 작업하는 예시입니다.

```bash
docker run -it --name shared-dev --entrypoint sh my-dev:1.0.0
```

이 예시는 원본 ENTRYPOINT를 sh로 바꾸어 대화형으로 실행하며 서버를 자동 시작하는 방식이 아닙니다. 셸에서 exit하면 이 컨테이너는 중지됩니다. 다음 작업 때는 새 run 대신 `docker start -ai shared-dev`로 기존 환경을 다시 엽니다. 자동 삭제 옵션 --rm은 사용하지 않아 컨테이너 쓰기 영역을 유지합니다.

원래 이미지에 장기 실행 서비스가 설정돼 있다면 `docker run -d --name shared-service my-dev:1.0.0`으로 기본 시작 명령을 실행할 수 있습니다. 실제 서비스에 필요한 포트·환경 변수·볼륨은 원본 실행 설정대로 추가해야 합니다. 기본 명령이 셸이거나 즉시 종료하는 명령이면 -d만으로 계속 실행되지 않습니다. [run 공식 안내](https://docs.docker.com/reference/cli/docker/container/run/)

### 9.6 Compose 실행 설정도 함께 공유

다음은 파일로 전달받은 이미지를 셸 개발 환경으로 사용하는 최소 compose.yaml입니다. 이미지에 sh가 있어야 합니다. 서비스 앱을 실행하려면 entrypoint와 command를 프로젝트의 실제 시작 명령으로 변경합니다.

```yaml
services:
  dev:
    image: my-dev:1.0.0
    pull_policy: never
    entrypoint: ["sh"]
    command: ["-i"]
    stdin_open: true
    tty: true
```

```bash
docker compose config --quiet
docker compose up -d
docker compose exec dev sh
```

pull_policy: never는 load한 로컬 이미지를 사용하고 레지스트리에서 찾지 않게 합니다. 레지스트리 배포라면 image를 전체 경로로 바꾸고 이 정책을 제거한 뒤 pull합니다. 편집할 소스는 별도 전달·clone 후 실제 경로로 bind mount하고 DB·데이터 볼륨은 백업에서 복원하거나 새로 초기화합니다. 이미지에 들어 있던 파일 경로를 마운트하면 해당 파일들이 가려질 수 있습니다.

전달 문서에는 이미지 이름·버전·OS/CPU, 실행 명령·Compose, 포트, 작업 경로, 환경 변수 이름, 소스 위치, 볼륨 복원 방법, 검증 명령을 기록합니다. 비밀값은 별도 안전한 경로로 전달합니다. 다른 CPU용 이미지에 --platform을 붙여도 바이너리가 변환되지는 않으며, 에뮬레이션 또는 해당 CPU용 재빌드가 필요합니다.

수신 환경에서는 도구 버전·프로젝트 빌드·서비스 접속을 확인하고, 컨테이너를 중지·재시작한 뒤 필요한 데이터가 유지되는지도 확인합니다.

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
