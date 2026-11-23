<!-- version: v1.2.0 -->
# Docker로 원격 개발 환경 실행

[Linux 원격 접속 서버](./01-linux-server.md)를 먼저 구성합니다. SSH로 서버의 프로젝트 파일을 열고, Docker 컨테이너에 같은 경로를 연결해 컨테이너 안의 도구로 작업합니다. 이 문서는 Dockerfile·Compose 없이 Docker CLI를 사용하는 흐름입니다.

## 1. Docker Engine 설치

서버 관리자 SSH 세션에서 Ubuntu 버전과 CPU 아키텍처를 확인하고 [Docker 공식 Ubuntu 설치 안내](https://docs.docker.com/engine/install/ubuntu/)에 따라 저장소·서명 키를 등록한 뒤 Engine을 설치합니다. 기존 Docker 패키지나 데이터가 있으면 제거하지 말고 설치 안내의 충돌 항목과 현재 컨테이너·볼륨부터 확인합니다.

설치 후:

```bash
# Linux 서버에서 관리자 권한으로 실행
sudo systemctl enable --now docker
sudo systemctl status docker --no-pager
sudo docker version
sudo docker run --rm hello-world
```

일반 개발 계정에 `docker` 그룹을 부여하면 호스트 관리자 권한에 가까운 접근을 허용합니다. 관리자만 `sudo docker`를 실행하거나, 격리 필요에 따라 rootless Docker를 검토합니다. Docker 데몬 TCP 포트는 외부에 공개하지 않습니다.

## 2. 서버 프로젝트 경로 준비

SSH 접속 사용자 소유의 프로젝트 폴더를 사용합니다. 아래 경로는 예시입니다.

```bash
# SSH 접속한 서버에서 일반 사용자로 실행
mkdir -p ~/projects/sample
cd ~/projects/sample
pwd
```

VS Code Remote-SSH로 이 폴더를 열면 편집 대상은 서버의 파일입니다. Docker에는 같은 경로를 bind mount로 연결하므로 컨테이너를 제거해도 소스 파일은 서버에 남습니다. 컨테이너 내부의 임시 파일·설치 내용은 컨테이너를 다시 만들면 사라질 수 있습니다.

## 3. 프로젝트·포트·개발 컨테이너 준비

기본 이미지는 Ubuntu 24.04 LTS의 공식 이미지 `ubuntu:24.04`입니다. 프로젝트별 런타임과 SDK는 [Tools 안내](../01.Tools/README.md)에서 Linux 설치·버전 선택 절차를 확인해 컨테이너 안에 설치하고, 프로젝트의 버전 파일과 잠금 파일을 따릅니다.

프로젝트 폴더를 만들고 컨테이너에서 사용할 서버 포트를 미리 정합니다. 예시의 호스트 포트 `3000`과 컨테이너 포트 `3000`은 프로젝트에 맞게 선택합니다. 서버에서 이미 사용 중인지 확인하고 Docker의 포트 매핑도 살펴봅니다.

```bash
# SSH 접속한 서버에서 실행
mkdir -p ~/projects/sample
ss -ltn
sudo docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

충돌이 없고 로컬 터널 접속만 필요하면 호스트 주소는 `127.0.0.1`로 제한합니다. `--publish`는 컨테이너 생성 때 지정해야 하며 실행 중인 컨테이너에 추가·변경할 수 없습니다. 필요한 포트를 확정한 뒤 다음 명령으로 컨테이너를 만듭니다.

```bash
# SSH 접속한 서버에서 실행: 포트가 필요한 프로젝트의 예
sudo docker run -it \
  --name sample-dev \
  --publish 127.0.0.1:3000:3000 \
  --mount type=bind,src="$HOME/projects/sample",dst=/workspace \
  --workdir /workspace \
  ubuntu:24.04 bash
```

포트를 사용하지 않는 프로젝트는 `--publish` 줄을 빼고 생성합니다. 프로젝트 파일은 서버 폴더에 저장됩니다. 컨테이너 안에서 프로젝트에 필요한 도구를 Tools 안내대로 설치하고 버전을 확인합니다. Ubuntu 이미지·패키지 저장소는 바뀔 수 있으므로 이미지 태그와 실제 도구 버전을 프로젝트 기록에 남깁니다.

## 4. 프로젝트 실행과 포트 접속

컨테이너 셸에서 도구 설치와 프로젝트 의존성 준비를 마친 뒤 개발 서버를 실행합니다. 서버 프로세스는 컨테이너 인터페이스에서 접속 가능하도록 실행합니다. 이후 개인 PC에서 SSH 터널을 열어 브라우저로 접속합니다.

```bash
# 개인 PC에서 실행
ssh -N -L 3000:127.0.0.1:3000 dev-server
```

브라우저에서 `http://localhost:3000`을 엽니다. 다른 포트를 선택했다면 터널의 로컬·원격 포트도 맞춥니다. 포트 매핑을 바꾸려면 기존 컨테이너를 종료·삭제하고 새 포트로 다시 생성해야 합니다. 서버 Docker 포트는 UFW 규칙만으로 보호된다고 가정하지 않습니다. loopback 바인딩을 유지하고 서버·공유기·클라우드 방화벽에서도 노출 여부를 확인합니다.

## 5. 개발 환경 저장·다른 PC로 전달

### 환경 초기 설정을 공유

재현 가능한 초기 설정을 공유하려면 프로젝트 README에 Ubuntu 이미지 태그, `docker run` 옵션, Tools에서 선택한 런타임 버전, 설치·확인 명령, 필요한 포트, 프로젝트 의존성 복원 명령을 기록합니다. `.env.example`은 비밀값 없이 보관하고 실제 비밀값은 전달하지 않습니다. 수신 PC는 같은 CPU 아키텍처와 Docker 환경을 준비한 뒤 기록된 명령과 프로젝트 lock 파일로 다시 구성합니다.

### 특정 시점의 컨테이너 이미지 전달

컨테이너 내부에서 수동으로 설치·변경한 상태를 특정 시점 이미지로 전달할 수 있습니다. 컨테이너를 중지한 뒤 송신 PC에서 새 이미지 태그로 저장합니다. 이 예의 이미지는 `/workspace`에 bind mount한 프로젝트 데이터를 포함하지 않습니다.

```bash
# 송신 PC 또는 송신 서버에서 실행
sudo docker stop sample-dev
sudo docker commit sample-dev dev-environment:2026-11-23
sudo docker image inspect dev-environment:2026-11-23 --format '{{.Os}}/{{.Architecture}}'
sudo docker image save -o dev-environment-2026-11-23.tar dev-environment:2026-11-23
sha256sum dev-environment-2026-11-23.tar
```

아카이브와 SHA-256 값을 수신 PC로 안전하게 전달합니다. 이미지에는 비밀키·토큰·개인 자격증명이 들어가지 않도록 검사합니다. `docker commit`은 컨테이너 쓰기 영역을 이미지로 만들지만 bind mount·volume에 저장된 내용은 포함하지 않습니다. 컨테이너 설정 중 포트 매핑·bind mount·실행 인자도 이미지에 포함되지 않으므로 실행 명령을 별도로 전달해야 합니다. [Docker commit](https://docs.docker.com/reference/cli/docker/container/commit/).

수신 PC에서 해시를 대조하고 이미지를 불러옵니다. 송신 PC와 다른 CPU 아키텍처라면 이미지가 해당 플랫폼을 지원하는지 확인합니다.

```bash
# 수신 PC에서 실행: 전달받은 파일의 실제 경로 사용
sha256sum dev-environment-2026-11-23.tar
sudo docker image load -i dev-environment-2026-11-23.tar
sudo docker image inspect dev-environment:2026-11-23 --format '{{.Os}}/{{.Architecture}}'
```

이미지 적재 후 송신 측에서 기록한 포트·프로젝트 bind mount·작업 경로 옵션으로 새 컨테이너를 만듭니다.

```bash
# 수신 PC에서 실행: 수신 PC의 프로젝트 경로와 필요한 포트로 조정
sudo docker run -it \
  --name sample-dev \
  --publish 127.0.0.1:3000:3000 \
  --mount type=bind,src="$HOME/projects/sample",dst=/workspace \
  --workdir /workspace \
  dev-environment:2026-11-23 bash
```

프로젝트 파일은 이미지에 포함되지 않으므로 Git으로 가져오거나 서버 간 승인된 파일 전송·백업 절차로 별도 전달합니다. 원본 PC와 수신 PC 양쪽에서 `docker image save` 아카이브와 프로젝트 백업을 확인하기 전에는 원본 데이터를 삭제하지 않습니다. `docker image save`는 이미지를 옮기며 컨테이너·bind mount·volume 전체 백업은 아닙니다. [Docker image save](https://docs.docker.com/reference/cli/docker/image/save/) · [Docker image load](https://docs.docker.com/reference/cli/docker/image/load/).

## 6. 종료·데이터·다음 단계

컨테이너 셸에서 `exit`하면 컨테이너가 중지됩니다. 이 안내는 `--rm`을 사용하지 않으므로 다시 시작하면 내부에 설치한 도구가 유지됩니다. `docker start -ai sample-dev`로 재접속할 수 있습니다. 컨테이너를 삭제하면 내부 설치·변경은 사라지지만 bind mount한 프로젝트 파일은 서버에 남습니다.

```bash
# 서버에서 대상 컨테이너를 확인한 뒤 실행
sudo docker ps -a
sudo docker stop sample-dev
sudo docker start -ai sample-dev
sudo docker rm sample-dev
```

Docker 이미지·컨테이너·볼륨을 정리하기 전에 `docker ps -a`, `docker image ls`, `docker volume ls`로 대상과 보존 데이터를 확인합니다. 전체 prune이나 볼륨 삭제를 일반 정리 절차로 사용하지 않습니다. 프로젝트 파일은 서버 백업 정책으로 별도 보관합니다.

다음 문서는 [Docker 공식 CLI](https://docs.docker.com/reference/cli/docker/)와 [원격 개발 서버 안내](./01-linux-server.md)를 참고합니다. Android 에뮬레이터·USB 장치·iOS 빌드·데스크톱 GUI는 컨테이너에 자동 전달되지 않으며 별도 지원 조건이 필요합니다.
