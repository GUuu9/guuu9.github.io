<!-- version: v1.9.0 -->
# Docker로 원격 개발 환경 실행

[Linux 원격 접속 서버](./01-linux-server.md)를 먼저 구성합니다. 프로젝트별로 `/code/proj/<프로젝트>-<호스트포트>` 폴더와 같은 이름의 컨테이너를 만들고, 로컬 PC는 Remote-SSH로 호스트에 접속합니다. Docker 관리 권한이 있는 계정은 Dev Containers로 실행 중인 컨테이너에 연결할 수 있습니다. 컨테이너 포트는 서버 loopback에만 공개하고, 필요한 개발 포트는 SSH 터널로 접속합니다. 이 문서는 Dockerfile·Compose 없이 Docker CLI를 사용하는 흐름입니다.

## 1. Docker Engine 설치

앞의 [Ubuntu 원격 접속 서버 안내](./01-linux-server.md)에서 최소 설치, 일반 사용자·SSH 키, UFW와 원격 접속을 먼저 완료합니다. 그 후 서버의 관리자 권한이 있는 SSH 세션에서 Ubuntu 버전과 CPU 아키텍처를 확인합니다. 아래 절차는 Docker 공식 apt 저장소를 등록합니다. Docker가 이미 있거나 다른 컨테이너 런타임이 설치되어 있으면 패키지·컨테이너·이미지·볼륨을 먼저 확인하고 백업한 뒤 공식 [충돌 패키지 안내](https://docs.docker.com/engine/install/ubuntu/#uninstall-old-versions)를 따릅니다.

```bash
# SSH 접속한 Ubuntu 서버에서 실행
cat /etc/os-release
dpkg --print-architecture
dpkg -l docker.io docker-compose docker-compose-v2 docker-doc docker-buildx podman-docker containerd runc
```

Docker 저장소의 서명 키와 apt 소스를 등록합니다.

```bash
# SSH 접속한 Ubuntu 서버에서 관리자 권한으로 실행
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt update
```

이 가이드는 Dockerfile·Compose를 사용하지 않으므로 Docker Engine과 CLI만 설치합니다.

```bash
sudo apt install docker-ce docker-ce-cli containerd.io
```

설치 후:

```bash
# Linux 서버에서 관리자 권한으로 실행
sudo systemctl enable --now docker
sudo systemctl status docker --no-pager
sudo docker version
sudo docker run --rm hello-world
```

`hello-world` 완료 메시지까지 확인하면 설치가 끝났습니다. 일반 개발 계정에 `docker` 그룹을 부여하면 호스트 관리자 권한에 가까운 접근을 허용합니다. 기본은 `sudo docker`를 사용하며, 사용자 권한 분리가 필요하면 rootless Docker를 검토합니다. Docker 데몬 TCP 포트는 외부에 공개하지 않습니다. Docker가 공개한 컨테이너 포트는 UFW 규칙을 우회할 수 있으므로 다음 절의 예시처럼 호스트 `127.0.0.1`에만 연결하고 SSH 터널을 사용합니다. [Docker 방화벽 제한](https://docs.docker.com/engine/install/ubuntu/#firewall-limitations)

## 2. 서버 프로젝트 경로 준비

[1단계](./01-linux-server.md)에서 준비한 `/code/proj` 아래에 프로젝트와 호스트 포트로 이름을 정합니다. 별도 디스크를 사용한다면 `findmnt --mountpoint /code`로 확인하고, 아래 예시의 `dev-user`를 실제 작업자 계정으로 바꿉니다. 기존 폴더는 소유권과 권한을 확인해 재사용합니다.

```bash
# Ubuntu 서버 관리자
if [ ! -d /code/proj/sample ]; then
  sudo install -d -o dev-user -g "$(id -gn dev-user)" -m 0750 /code/proj/sample
fi
ls -ld /code/proj/sample
```

예시 컨테이너는 Ubuntu 이미지의 기본 사용자 `root`로 실행하므로, 서버 프로젝트 폴더를 컨테이너 홈 아래 `/root/sample`으로 bind mount합니다. 컨테이너를 제거해도 소스 파일은 서버에 남습니다. 컨테이너 내부에서 root로 생성한 파일은 서버에서도 root 소유가 될 수 있으니 프로젝트 파일 생성은 SSH 사용자 권한으로 하거나 필요한 경우 해당 프로젝트 폴더의 소유권을 복구합니다.

컨테이너에서 파일을 생성한 뒤에는 호스트에서 해당 파일의 소유자와 모드를 확인합니다. 개인 작업 파일의 소유자가 잘못된 경우에만 관리자가 그 파일을 작업자 소유로 바꿉니다. 팀 공유 경로에서는 프로젝트 그룹 권한을 유지합니다. 전송 계정과 폴더 권한 확인은 [SCP 전송과 소유권 확인](./01-linux-server.md#scp-전송과-소유권-확인)을 따릅니다.

```bash
# 서버 관리자: 실제 파일 경로와 작업자 계정으로 변경
stat -c '%U:%G %a %n' /code/proj/sample/result.tar
sudo chown "dev-user:$(id -gn dev-user)" /code/proj/sample/result.tar
sudo -u dev-user test -r /code/proj/sample/result.tar && echo '다운로드 가능'
```

## 3. 프로젝트·포트·개발 컨테이너 준비

기본 이미지는 Ubuntu 24.04 LTS의 공식 이미지 `ubuntu:24.04`입니다. 프로젝트별 런타임과 SDK는 [Tools 안내](../01.Tools/README.md)에서 Linux 설치·버전 선택 절차를 확인해 컨테이너 안에 설치하고, 프로젝트의 버전 파일과 잠금 파일을 따릅니다.

컨테이너에서 사용할 서버 포트를 미리 정합니다. 예시의 호스트 포트 `3000`과 컨테이너 포트 `3000`은 프로젝트에 맞게 선택합니다. 서버에서 이미 사용 중인지 확인하고 Docker의 포트 매핑도 살펴봅니다. 포트는 Linux 서버의 loopback에만 열리므로 같은 LAN의 PC는 SSH 터널로 접속합니다.

```bash
# SSH 접속한 서버에서 실행
ss -ltn
sudo docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

터널 접속을 위해 호스트 주소는 `127.0.0.1`로 제한합니다. `--publish`는 컨테이너 생성 때 지정해야 하며 실행 중인 컨테이너에 추가·변경할 수 없습니다. 필요한 포트를 확정한 뒤 다음 명령으로 컨테이너를 만듭니다.

```bash
# SSH 접속한 서버에서 실행: 포트가 필요한 프로젝트의 예
sudo docker run -dit \
  --name sample \
  --publish 127.0.0.1:3000:3000 \
  --mount type=bind,src=/code/proj/sample,dst=/root/sample \
  --workdir /root/sample \
  ubuntu:24.04 bash
```

폴더명과 컨테이너 이름의 `3000`은 서버에서 사용할 호스트 포트입니다. 컨테이너 내부 포트는 예시에서 `3000`이며, 다르면 `호스트포트:컨테이너포트`로 지정합니다. 포트를 사용하지 않는 프로젝트는 `--publish` 줄을 빼고 생성합니다. 컨테이너 안에서 프로젝트에 필요한 도구를 설치하고 버전을 확인합니다. Ubuntu 이미지·패키지 저장소는 바뀔 수 있으므로 이미지 태그와 실제 도구 버전을 프로젝트 기록에 남깁니다.

### 마운트와 포트 공개 없이 실행

호스트와 파일을 공유할 필요가 없고 컨테이너 내부에서만 작업한다면 다음과 같이 생성합니다. 프로젝트 파일은 컨테이너 내부에 두고, 서버 관리자 SSH 세션에서 셸을 엽니다.

```bash
sudo docker run -dit --name sample-local --workdir /root ubuntu:24.04 bash
sudo docker exec -it sample-local bash
```

- **마운트만 사용**하려면 위의 `sample-3000` 생성 예시에서 `--publish` 줄을 빼고 사용합니다.
- **포트만 공개**하려면 `sample-local` 생성 명령에 `--publish 127.0.0.1:3000:3000`을 추가합니다. 호스트 포트 번호는 사용 가능한 값으로 정합니다.

포트를 공개하지 않아도 호스트에 SSH로 접속해 `docker exec` 또는 Dev Containers로 작업할 수 있습니다. 아래 SSH 터널 예시는 호스트에 앱 포트를 공개한 경우에 사용합니다. 마운트 없이 저장한 파일은 컨테이너를 중지하고 다시 시작해도 남지만, 컨테이너를 삭제하면 사라집니다. 필요한 파일은 삭제 전에 `docker cp` 또는 Git으로 별도 보관합니다.

## 4. SSH 접속과 컨테이너 작업

- **일반 작업자**는 Remote-SSH로 호스트의 `/code/proj/sample`을 열어 편집합니다. 컨테이너 셸이 필요한 경우 관리자가 호스트의 SSH 세션에서 `sudo docker exec -it sample bash`를 실행합니다.
- **Docker를 직접 관리할 권한이 있는 관리자**는 SSH 세션에서 `docker ps`가 sudo 없이 동작하는 경우 Remote-SSH 창의 **Dev Containers: Attach to Running Container...**로 `sample`을 선택하고 `/root/sample`을 엽니다. 이 명령이 실패하면 관리자 셸에서 `sudo docker exec`를 사용합니다. [VS Code 공식 안내](https://code.visualstudio.com/docs/devcontainers/attach-container)

SSH 인증은 Linux 호스트에서 처리합니다. 이 방식은 컨테이너에 `openssh-server`나 별도 SSH 포트를 요구하지 않습니다.

### 특정 사용자로 컨테이너 실행

이미지에는 기본 실행 사용자를 지정할 수 있습니다. 새 컨테이너에서 다른 사용자가 필요하면 `docker run --user`로 바꿉니다. bind mount에 파일을 만드는 경우, 호스트 프로젝트 소유자의 숫자 UID와 GID를 사용하면 호스트에서도 같은 계정 소유로 보입니다. 아래는 호스트 관리자 세션에서 `dev-user`의 UID·GID로 실행하는 예입니다.

```bash
work_user="$(id -u dev-user):$(id -g dev-user)"
sudo docker run -dit --name sample-user \
  --user "$work_user" \
  --mount type=bind,src=/code/proj/sample,dst=/home/sample \
  --workdir /home/sample \
  ubuntu:24.04 bash
sudo docker exec sample-user id
```

새 컨테이너의 마운트 경로를 `/home/sample`으로 둔 이유는 일반 사용자가 `/root`를 통과할 수 없기 때문입니다. 숫자 UID·GID를 지정하는 방식은 컨테이너 안에 사용자 이름이나 쓰기 가능한 홈을 자동으로 만들지 않습니다. 홈에 설정이나 캐시를 쓰는 도구를 사용한다면, 이미지에 같은 UID·GID를 가진 사용자와 해당 사용자가 쓸 수 있는 홈을 준비합니다.

실행 중인 컨테이너에서는 `docker exec --user`가 그 명령에만 적용됩니다. 위 컨테이너에서 관리자 권한으로 도구를 설치해야 할 때는 다음처럼 별도 셸을 열고, 프로젝트 파일을 만드는 작업은 평소 사용자로 수행합니다.

```bash
sudo docker exec -it --user root --workdir /root sample-user bash
```

이미지를 전달할 때 수신 서버에서 작업자 UID·GID가 다르면 컨테이너를 생성할 때 수신 서버 기준으로 `--user`를 다시 지정합니다. 작업자를 바꿔 실행해도 기존 파일의 소유권은 그대로이므로, 마운트한 경로의 권한을 먼저 확인합니다.

### 프로젝트 실행과 포트 접속

컨테이너 터미널에서 도구 설치와 프로젝트 의존성 준비를 마치고 개발 서버를 실행합니다. 앱은 컨테이너의 `0.0.0.0:3000`에서 수신하도록 설정합니다. SSH 명령에는 서버 주소나 SSH 별칭을 쓰고, Docker의 `127.0.0.1`은 유지합니다. 로컬 네트워크 PC에서 SSH 터널을 열어 서버의 loopback에 연결한 뒤 브라우저로 접속합니다.

```bash
# 개인 PC에서 실행
ssh -N -L 3000:127.0.0.1:3000 dev-server
```

브라우저에서 `http://localhost:3000`을 엽니다. 다른 포트를 선택했다면 터널의 로컬·원격 포트도 맞춥니다. 포트 매핑을 바꾸려면 기존 컨테이너를 종료·삭제하고 새 포트로 다시 생성해야 합니다. 서버 Docker 포트는 UFW 규칙만으로 보호된다고 가정하지 않습니다. loopback 바인딩을 유지하고 서버·공유기·클라우드 방화벽에서도 노출 여부를 확인합니다.

## 5. 개발 환경 저장·다른 PC로 전달

### 환경 초기 설정을 공유

재현 가능한 초기 설정을 공유하려면 프로젝트 README에 Ubuntu 이미지 태그, `docker run` 옵션, Tools에서 선택한 런타임 버전, 설치·확인 명령, 필요한 포트, 프로젝트 의존성 복원 명령을 기록합니다. `.env.example`은 비밀값 없이 보관하고 실제 비밀값은 전달하지 않습니다. 수신 PC는 같은 CPU 아키텍처와 Docker 환경을 준비한 뒤 기록된 명령과 프로젝트 lock 파일로 다시 구성합니다.

### 특정 시점의 컨테이너 이미지 전달

컨테이너 내부에서 수동으로 설치·변경한 상태를 특정 시점 이미지로 전달할 수 있습니다. 컨테이너를 중지한 뒤 송신 PC에서 새 이미지 태그로 저장합니다. 이 예의 이미지는 호스트의 `/code/proj/sample`에서 bind mount한 프로젝트 데이터를 포함하지 않습니다.

```bash
# 송신 PC 또는 송신 서버에서 실행
sudo docker stop sample
sudo docker commit sample dev-environment:2026-11-24
sudo docker image inspect dev-environment:2026-11-24 --format '{{.Os}}/{{.Architecture}}'
(umask 077; set -o noclobber; sudo docker image save dev-environment:2026-11-24 > dev-environment-2026-11-24.tar) &&
  sha256sum dev-environment-2026-11-24.tar
stat -c '%U:%G %a %n' dev-environment-2026-11-24.tar
```

아카이브와 SHA-256 값을 수신 PC로 안전하게 전달합니다. 이미지에는 비밀키·토큰·개인 자격증명이 들어가지 않도록 검사합니다. `docker commit`은 컨테이너 쓰기 영역을 이미지로 만들지만 bind mount·volume에 저장된 내용은 포함하지 않습니다. 컨테이너 설정 중 포트 매핑·bind mount·실행 인자도 이미지에 포함되지 않으므로 실행 명령을 별도로 전달해야 합니다. [Docker commit](https://docs.docker.com/reference/cli/docker/container/commit/).

위 명령은 SSH 계정이 쓸 수 있는 폴더에서 실행합니다. 셸이 파일을 생성하므로 아카이브는 그 계정 소유입니다. 전송 전에 `stat`으로 소유자를 확인하고, 저장이 실패하면 부분 파일을 정리하거나 새 파일명을 사용해 다시 저장합니다.

수신 PC에서는 SSH 계정의 홈에 받은 파일을 기준으로 읽기 권한과 해시를 확인한 뒤 이미지를 불러옵니다. 송신 PC와 다른 CPU 아키텍처라면 이미지가 해당 플랫폼을 지원하는지 확인합니다.

```bash
# 수신 PC에서 실행: 전달받은 파일의 실제 경로 사용
stat -c '%U:%G %a %n' dev-environment-2026-11-24.tar
sha256sum dev-environment-2026-11-24.tar
sudo docker image load -i dev-environment-2026-11-24.tar
sudo docker image inspect dev-environment:2026-11-24 --format '{{.Os}}/{{.Architecture}}'
```

이미지 적재 후 프로젝트 폴더명과 사용할 호스트 포트에 맞춰 컨테이너를 만듭니다.

```bash
# 수신 PC에서 실행: 수신 PC의 프로젝트 경로와 필요한 포트로 조정
sudo docker run -dit \
  --name sample \
  --publish 127.0.0.1:3000:3000 \
  --mount type=bind,src=/code/proj/sample,dst=/root/sample \
  --workdir /root/sample \
  dev-environment:2026-11-24 bash
```

프로젝트 파일은 이미지에 포함되지 않으므로 Git으로 가져오거나 서버 간 승인된 파일 전송·백업 절차로 별도 전달합니다. 원본 PC와 수신 PC 양쪽에서 `docker image save` 아카이브와 프로젝트 백업을 확인하기 전에는 원본 데이터를 삭제하지 않습니다. `docker image save`는 이미지를 옮기며 컨테이너·bind mount·volume 전체 백업은 아닙니다. [Docker image save](https://docs.docker.com/reference/cli/docker/image/save/) · [Docker image load](https://docs.docker.com/reference/cli/docker/image/load/).

## 6. 종료·데이터·다음 단계

`docker exec`로 연 셸을 닫아도 컨테이너는 실행 중입니다. 이 안내는 `--rm`을 사용하지 않으므로 다시 시작하면 내부에 설치한 도구가 유지됩니다. VS Code의 Dev Containers 명령으로 실행 중인 컨테이너에 다시 연결하거나 `sudo docker start sample`으로 시작합니다. 컨테이너를 삭제하면 내부 설치·변경은 사라지지만 bind mount한 프로젝트 파일은 서버에 남습니다.

```bash
# 서버에서 대상 컨테이너를 확인한 뒤 실행
sudo docker ps -a
sudo docker stop sample
# 재개할 때
sudo docker start sample
```

삭제가 필요하면 데이터 보존을 확인하고 컨테이너를 중지한 뒤 `sudo docker rm sample`을 실행합니다. Docker 이미지·컨테이너·볼륨을 정리하기 전에 `docker ps -a`, `docker image ls`, `docker volume ls`로 대상과 보존 데이터를 확인합니다. 전체 prune이나 볼륨 삭제를 일반 정리 절차로 사용하지 않습니다. 프로젝트 파일은 서버 백업 정책으로 별도 보관합니다.

다음 문서는 [Docker 공식 CLI](https://docs.docker.com/reference/cli/docker/)와 [원격 개발 서버 안내](./01-linux-server.md)를 참고합니다. Android 에뮬레이터·USB 장치·iOS 빌드·데스크톱 GUI는 컨테이너에 자동 전달되지 않으며 별도 지원 조건이 필요합니다.
