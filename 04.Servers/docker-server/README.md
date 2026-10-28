<!-- version: v1.1.0 -->
# 외부 서버의 Docker 개인 작업 영역 구성

확인일: 2026-10-28. Ubuntu Server 24.04 LTS와 Docker Engine·Compose 플러그인을 기준으로 합니다. 관리자가 사용자별 컨테이너와 접속 포트를 만들고 사용자는 개인 PC의 SSH·VS Code로 작업합니다. GUI·브라우저 IDE·GPU·Windows VM은 필요한 시점에 별도 구성합니다.

RStudio·JupyterLab·브라우저 VS Code·Android 환경 선택은 [작업 영역 종류와 이미지 선택](./workspace-types.md)을 참고합니다.


## 문서 순서

- [서버 준비](./guides/docker_remote_dev_env.md)
- [사용자 영역 생성·접속](./guides/docker_container_setup.md)
- [운영·장애 대응](./operations.md)
- [작업 영역 종류·이미지 선택](./workspace-types.md)

## 언어별 환경

| 환경 | 설정 |
| :--- | :--- |
| 기본 Linux | [Ubuntu 공통](./environments/ubuntu/README.md) |
| 웹·서버·Electron | [Node.js](./environments/nodejs/README.md) · [TypeScript](./environments/typescript/README.md) |
| Python | [uv·가상환경](./environments/python/README.md) |
| Flutter | [Android 서버 빌드](./environments/flutter/README.md) |
| Rust | [rustup·툴체인](./environments/rust/README.md) |

## 1. 접속 구조와 권한

```text
개인 PC (SSH 키·VS Code Remote - SSH)
  → 서버 주소:사용자별 포트 (VPN/접속 IP 제한)
  → 해당 사용자의 개발 컨테이너:22
  → 개인 home 볼륨 (소스·도구·설정)

서버 관리자 → 호스트 SSH → Docker Engine·Compose 관리
```

예를 들어 alice는 서버 2222, bob은 2223으로 접속합니다. 컨테이너 안에서는 각자 developer 계정을 사용해도 home 볼륨·SSH 키·네트워크가 분리됩니다. 일반 사용자에게 호스트 계정·docker 그룹·Docker socket을 제공하지 않습니다. docker 그룹은 사실상 호스트 root 권한에 해당합니다.

컨테이너는 호스트 커널을 공유합니다. 신뢰할 수 없는 다중 사용자에 대한 강한 격리가 필요하면 사용자별 VM 등 별도 경계를 사용합니다. 컨테이너에서 호스트·다른 사용자에게 나가는 네트워크 접근까지 이 템플릿이 차단하지는 않습니다. [Docker 보안](https://docs.docker.com/engine/security/)

## 2. 서버 준비와 Docker 설치

관리 콘솔 또는 관리자 SSH 세션을 확보하고 OS·CPU·디스크·메모리·공인 IP/NAT 여부를 확인합니다. OS 업데이트 전 백업과 재시작 가능 시간을 확인합니다.

```bash
cat /etc/os-release
uname -m
free -h
df -h
sudo apt update
sudo apt upgrade
sudo apt install ca-certificates curl openssh-server
sudo systemctl enable --now ssh
```

[Docker 공식 Ubuntu 설치 안내](https://docs.docker.com/engine/install/ubuntu/)의 apt 저장소·서명키 등록 절차를 진행합니다. 기존 docker.io·containerd 등이 있으면 기존 서비스·데이터와 충돌 여부를 먼저 확인하며 일괄 삭제하지 않습니다. 공식 저장소가 등록된 뒤:

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo docker version
sudo docker compose version
sudo docker run --rm hello-world
```

외부 서버에는 GUI 로그인에 의존하는 Docker Desktop 대신 Engine을 사용합니다. 아래 Docker 관리 명령은 관리자만 sudo로 실행합니다. 데몬 TCP 2375/2376은 이 구성에 필요하지 않으며 외부로 열지 않습니다.

## 3. 사용자별 구성 파일과 SSH 공개키

첨부 [Dockerfile](./Dockerfile)과 [compose.yaml](./compose.yaml)을 서버의 사용자별 디렉터리에 복사합니다. 예시 경로는 `/srv/workspaces/alice`, bob은 `/srv/workspaces/bob`입니다. 각 디렉터리에 같은 두 파일을 두고 개인 access 파일과 .env만 다르게 관리합니다.

```bash
sudo install -d -m 0755 /srv/workspaces/alice
cd /srv/workspaces/alice
sudo install -d -m 0700 access
```

사용자는 개인 PC에서 기존 전용 키를 선택하거나 다음으로 새 키를 만듭니다. 같은 파일이 이미 있으면 덮어쓰지 않습니다.

```bash
ssh-keygen -t ed25519 -f ~/.ssh/workspace_alice -C alice-workspace
```

키 암호를 설정하고 공개키 `.pub`만 관리자에게 전달합니다. 개인 키는 서버에 복사하지 않습니다. Windows PowerShell은 필요하면 `$HOME/.ssh/workspace_alice` 경로로 지정합니다.

관리자는 받은 공개키 한 줄을 `access/authorized_keys`에 저장합니다. 이 파일에는 해당 사용자 키만 넣습니다. 연결 명령용 별도 공유 비밀번호는 만들지 않습니다.

```bash
sudo chmod 0644 access/authorized_keys
sudo ssh-keygen -t ed25519 -N '' -f access/host_key
sudo chmod 0600 access/host_key
sudo ssh-keygen -lf access/host_key.pub
```

위 host_key는 **서버 신원 확인용**이며 사용자 개인 키와 다릅니다. 컨테이너별로 따로 생성하고 지문을 사용자에게 안전한 경로로 전달합니다. 재생성 시 SSH 신원이 바뀌므로 기존 키를 보존합니다. access 디렉터리는 root만 접근하며 공개키 파일은 컨테이너에서 developer가 읽을 수 있게 합니다.

## 4. 주소·포트와 실행

서버 디렉터리에 아래 .env를 작성합니다. BIND_ADDRESS는 서버에 실제 할당된 VPN·사설 또는 외부 인터페이스 IP로 바꿉니다. `192.0.2.10`은 문서용 예시로 그대로 실행하지 않습니다. NAT 환경에서는 공인 IP가 아니라 서버 인터페이스 IP를 사용합니다.

```dotenv
COMPOSE_PROJECT_NAME=workspace-alice
BIND_ADDRESS=192.0.2.10
SSH_PORT=2222
WORKSPACE_IMAGE=personal-workspace:1.0.0
```

```bash
sudo docker compose config --quiet
sudo docker compose build
sudo docker compose run --rm --no-deps workspace /usr/sbin/sshd -t -h /etc/workspace-ssh/host_key
sudo docker compose up -d
sudo docker compose ps
sudo docker compose logs --tail=100 workspace
```

sshd -t는 키·설정을 검사하지만 외부 네트워크·인증 성공을 검증하지는 않습니다. Dockerfile은 공용 비밀번호·sudo 권한 없이 공개키만 허용합니다. 런타임 도구는 사용자 home에 설치할 수 있고, 추가 시스템 라이브러리는 관리자가 Dockerfile을 수정해 재빌드합니다.

bob은 별도 디렉터리에서 `COMPOSE_PROJECT_NAME=workspace-bob`, `SSH_PORT=2223`과 bob 전용 키로 실행합니다. 프로젝트명이 겹치면 볼륨·서비스를 잘못 공유할 수 있으므로 사용자명·디렉터리·프로젝트명·포트·담당자를 기록합니다. CPU 2·메모리 4GB·PID 512는 예시이며 동시 사용자 수와 빌드 요구량에 맞춰 조정합니다. home 볼륨의 디스크 사용량은 별도 감시해야 합니다.

## 5. 방화벽·외부 연결

클라우드 보안 그룹 또는 공유기·상위 방화벽에서 사용자별 SSH 포트를 VPN 대역이나 허용할 PC IP로 제한합니다. NAT 환경은 외부 포트에서 해당 서버 IP·포트로 전달합니다. 관리자 호스트 SSH 포트도 접근 대상을 제한하고 기존 관리 접속을 유지한 채 테스트합니다.

Docker가 공개한 포트는 UFW 일반 규칙을 우회할 수 있습니다. UFW에 deny를 추가한 것만으로 컨테이너 포트가 보호됐다고 판단하지 않습니다. 사용 중인 Docker 방화벽 백엔드의 공식 지침과 상위 방화벽을 함께 적용하고 허용·비허용 네트워크 양쪽에서 확인합니다. [Docker 방화벽 제한](https://docs.docker.com/engine/install/ubuntu/#firewall-limitations)

브라우저 IDE를 추가할 때는 인증·HTTPS 구성을 별도로 정의합니다. 기본 개발 서버나 Docker API를 그대로 공인 인터넷에 공개하지 않습니다.

## 6. 개인 PC에서 SSH·VS Code 접속

관리자에게 받은 주소·포트·host key 지문으로 접속합니다.

```bash
ssh -i ~/.ssh/workspace_alice -p 2222 developer@서버주소
```

최초 접속의 지문을 관리자가 전달한 값과 비교합니다. 다르면 확인 전 승인하지 않습니다. 이후 개인 PC의 ~/.ssh/config에 등록합니다.

```sshconfig
Host workspace-alice
    HostName 서버주소
    Port 2222
    User developer
    IdentityFile ~/.ssh/workspace_alice
    IdentitiesOnly yes
```

VS Code에서 Remote - SSH를 설치하고 `Remote-SSH: Connect to Host...` → workspace-alice로 접속합니다. `/home/developer` 아래 프로젝트를 엽니다. 서버 호스트가 아닌 컨테이너의 디렉터리와 터미널인지 `whoami`, `hostname`, `pwd`로 확인합니다. [VS Code 공식 SSH 안내](https://code.visualstudio.com/docs/remote/ssh)

Node·Python 환경은 [Linux 설정](../../00.Setup/Linux_Dev_Setting.md)의 nvm·uv 절차를 컨테이너 사용자로 진행합니다. 해당 문서의 호스트 apt·Docker Desktop 설치를 그대로 컨테이너에 적용하지 않습니다. 사용자 home 전체가 볼륨이므로 프로젝트·도구 설정을 유지합니다.

실행한 웹 앱은 VS Code Ports 탭으로 전달하거나 개인 PC에서 다음 터널로 확인합니다.

```bash
ssh -N -L 127.0.0.1:3000:127.0.0.1:3000 workspace-alice
```

개인 PC의 http://localhost:3000 으로 접근합니다. 앱이 컨테이너 3000 포트에서 실행돼 있어야 합니다. 이 흐름에서는 서버의 앱 포트를 추가 공개할 필요가 없습니다. 개인 PC 3000이 사용 중이면 터널의 첫 포트를 바꿉니다.

## 7. 유지보수·업데이트·사용자 회수

구체적인 배포 버전 기록·업데이트·복귀·볼륨 백업은 [운영 절차](./operations.md)를 따릅니다. 기존 자료의 적용 범위도 해당 문서에 정리했습니다.

- 이미지 변경: 새 WORKSPACE_IMAGE 태그로 한 번 빌드·검증하고 사용자별로 같은 이미지를 배포합니다. 같은 태그를 재빌드해 덮어쓰지 않습니다. home 볼륨은 유지됩니다.
- Engine 업데이트: 서버 작업·데이터 백업과 점검 시간을 확보하고 apt로 Docker 패키지만 선택 갱신합니다. 재시작 후 서비스·네트워크·자원 제한을 확인합니다.
- 이미지 공유: [이미지 저장·공유 가이드](../../01.Tools/docker.md#9-개발-컨테이너를-이미지로-저장공유하고-다시-실행하기)를 따릅니다. 사용자 home 볼륨·SSH 키는 이미지에 포함하지 않습니다.
- 사용자 중지: 접속 키 회수와 함께 컨테이너를 중지해 기존 세션도 끊습니다. `sudo docker compose down`은 기본 named volume을 유지합니다. 사용 중단 후 데이터 보존 기간·삭제 대상을 확인합니다.

`down -v`, volume prune, Desktop/Engine 데이터 초기화는 복원 절차가 아닙니다. 사용자 홈에는 개인 자격증명과 소스가 있을 수 있으므로 백업 접근도 관리자 범위로 제한합니다. 홈 볼륨은 작업을 중지한 뒤 백업하고 별도 볼륨에서 복원·SSH 접속·프로젝트 실행을 시험합니다. DB가 있다면 해당 DB의 일관된 백업 절차를 추가합니다.

## 8. 구축 완료 확인

- [ ] 각 사용자 공개키로 본인 포트에 접속되고 잘못된 키·root·비밀번호 접속은 거부된다.
- [ ] 관리자에게 받은 SSH host key 지문과 일치한다.
- [ ] 사용자별 home·프로젝트·네트워크와 Compose 프로젝트명이 분리돼 있다.
- [ ] docker socket·호스트 루트 경로·privileged·호스트 네트워크가 제공되지 않는다.
- [ ] 허용된 외부 PC에서 접속되고 비허용 네트워크에서는 접근이 제한된다.
- [ ] VS Code 접속·프로젝트 실행·로컬 웹 포트 전달이 된다.
- [ ] 재생성·서버 재시작 후 홈 데이터와 서버 신원이 유지된다.
- [ ] CPU·메모리 제한과 디스크·로그 감시, 백업·복원 절차를 확인했다.

이 템플릿은 공개키 기반 사용자별 원격 작업 영역을 구성합니다.
