<!-- version: v1.3.0 -->
# 네트워크 개발용 Ubuntu Linux 서버 구성

개발 PC에서 네트워크로 접속해 코드 편집·빌드·테스트하는 Ubuntu Server 구성입니다. 기본은 서버 호스트의 일반 사용자 계정과 SSH·VS Code Remote - SSH이며, Docker는 사용자별 환경 격리가 필요할 때 선택합니다.

## 1. 서버 준비와 Ubuntu 설치

Ubuntu Server LTS 설치 이미지는 [Ubuntu 공식 다운로드](https://ubuntu.com/download/server)에서 받습니다. 대상 PC의 CPU 아키텍처와 설치 시점의 지원 기간을 확인하고 중요한 디스크 데이터는 먼저 백업합니다. 설치 유형에서 **Ubuntu Server (minimized)**를 선택합니다. 설치 화면에 SSH 설정이 있으면 OpenSSH Server를 선택해도 되며, 선택하지 않았더라도 첫 부팅 후 설치합니다. 디스크 파티션은 대상 장치와 보존할 데이터를 확인한 뒤 지정합니다.

첫 설치는 모니터와 키보드를 연결해 진행합니다. 서버는 유선 LAN에 연결하고 설치 중에는 DHCP로 연결합니다. 설치 후에는 다음 절의 Netplan 절차로 서버의 IPv4 주소를 고정합니다. 선택한 주소는 공유기 DHCP 할당 범위와 겹치지 않게 네트워크 관리자와 확인합니다. 설치가 끝나 원격 접속을 확인하기 전까지 공유기 포트 포워딩은 만들지 않습니다.

최소 설치 뒤 첫 로그인은 서버 콘솔에서 합니다. 패키지 목록을 갱신하고 서버 문서 편집·Git·SSH·방화벽에 필요한 도구를 설치합니다.

```bash
# Ubuntu Server 콘솔에서 실행
sudo apt update
sudo apt upgrade
sudo apt install vim git openssh-server ufw
sudo systemctl enable --now ssh
```

설치 상태를 확인합니다. Netplan을 직접 수정할 때는 `vim`을 사용합니다. `i`를 눌러 편집하고, 저장·종료는 `Esc` 후 `:wq`를 입력합니다.

```bash
vim --version | head -n 1
git --version
ssh -V
sudo systemctl status ssh --no-pager
```

## 2. 서버 IP 주소 설정

현재 주소·인터페이스·기본 경로·DNS를 확인합니다. 이 서버의 유선 인터페이스가 `enp10s0`이면 그 이름을 사용합니다. 다른 PC에서는 `ip -4 -brief address`와 `ip route` 결과에 맞는 유선 인터페이스를 사용합니다. `/16` 같은 suffix는 prefix 길이이며 주소가 점으로 구분된 IPv4 형식인지도 확인합니다.

```bash
# Ubuntu Server 콘솔에서 실행
ip -4 -brief address
ip -4 route
resolvectl status
```

현재 DHCP 주소를 그대로 고정값으로 복사하지 않습니다. 공유기 DHCP 범위 밖의 사용 가능한 IPv4 주소를 네트워크 관리자와 정하고, prefix·gateway·DNS도 현재 네트워크 값으로 확인합니다. 기존 Netplan 파일을 백업한 뒤 실제 인터페이스와 파일명으로 수정합니다.

```bash
ls -l /etc/netplan
sudo cp /etc/netplan/실제파일.yaml /etc/netplan/실제파일.yaml.bak
sudo vim /etc/netplan/실제파일.yaml
```

```yaml
# /etc/netplan/실제파일.yaml의 예시. 장치명·주소·prefix·gateway·DNS를 확인한 값으로 바꿉니다.
network:
  version: 2
  ethernets:
    # ip -4 -brief address에서 확인한 유선 인터페이스 이름
    enp10s0:
      dhcp4: false
      addresses:
        - 192.168.1.226/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 192.168.1.1
          - 1.1.1.1
```

### 서브넷 길이 확인

`addresses`의 `/24`는 예시입니다. 같은 IP 서브넷에서 직접 통신하는 서버와 PC는 공유기 LAN 설정이나 DHCP에서 확인한 실제 주소 범위와 서브넷 마스크를 사용합니다. 서로 다른 서브넷이나 VLAN이라면 각 장치에 해당 네트워크의 값을 적용하고, 라우터에 양방향 경로와 SSH 허용 규칙이 있는지 확인합니다.

예를 들어 PC가 `192.168.100.17/16`, 서버가 `192.168.10.226/24`라면 PC는 서버가 같은 링크에 있다고 보고 직접 접속을 시도합니다. 서버는 PC가 다른 서브넷에 있다고 보고 응답을 기본 게이트웨이로 보낼 수 있습니다. 게이트웨이가 응답을 전달하지 못하면 SSH가 연결되지 않습니다. 실제 LAN이 `192.168.0.0/16`이면 해당 LAN의 설정을 따르고, 실제로 두 `/24`가 분리되어 있다면 마스크를 넓히는 대신 라우팅을 확인합니다.

서버에서는 `ip -4 route get 192.168.100.17`, 접속하는 macOS에서는 `route -n get 192.168.10.226`을 실행합니다. 주소는 상대 장치의 실제 IP로 바꾸고 각 방향이 직접 연결인지 게이트웨이 경유인지 확인합니다. 경로가 맞으면 PC에서 `ssh -v dev-user@192.168.10.226`으로 접속을 확인합니다.

콘솔에서 문법을 확인하고 `netplan try`로 적용합니다. 확인 프롬프트에 응답하지 않으면 설정을 되돌립니다. 연결이 유지되는지 확인한 뒤 승인합니다.

```bash
# Ubuntu Server 콘솔에서 관리자 권한으로 실행
sudo netplan generate
sudo netplan try
ip -brief address
ip route
```

네트워크 설정은 서버 콘솔에서 적용합니다. SSH 원격 세션 하나만 둔 상태에서 주소를 바꾸지 않습니다. DHCP 서버의 할당 범위와 중복되지 않는 주소인지 확인하고, 적용 후 개인 PC에서 새 주소로 SSH 접속을 확인합니다.

## 3. 저장 공간과 경로 준비

관리자는 기존 저장 공간과 추가 디스크의 파일시스템을 확인합니다. Docker 프로젝트 데이터는 `/code/proj`, bare Git은 용량이 확보된 계정의 `~/git`에 둡니다.

```bash
# 서버 콘솔
lsblk -f
df -h / /home
```

기존 디스크에 여유가 있으면 `sudo mkdir -p /code/proj`로 경로를 준비합니다. 별도 디스크를 쓰는 경우 다음은 **이미 ext4로 준비된 파티션**을 비어 있는 `/code`에 연결하는 예입니다. 기존 `/code`에 파일이 있다면 사용을 중지하고 데이터를 백업·이전한 뒤 진행합니다. 마운트하면 기존 파일이 가려집니다.

```bash
# 서버 관리자
sudo mkdir -p /code
sudo cp -a /etc/fstab /etc/fstab.before-code
sudo vim /etc/fstab
```

```text
# /etc/fstab에 추가. UUID는 lsblk -f에서 확인한 값으로 변경
UUID=실제-UUID /code ext4 defaults 0 2
```

```bash
sudo findmnt --verify --verbose
sudo systemctl daemon-reload
sudo mount /code
findmnt --mountpoint /code
```

`/code`가 의도한 디스크에 연결된 것을 확인한 뒤 `sudo mkdir -p /code/proj`를 실행합니다. 재부팅 후에도 Docker를 시작하기 전에 마운트 상태를 확인합니다. [Ubuntu mount 매뉴얼](https://manpages.ubuntu.com/manpages/noble/man8/mount.8.html)

## 4. 관리자와 작업자 계정 분리

설치 때 만든 관리자 계정은 패키지·네트워크·디스크·Docker를 관리합니다. 작업자는 개인 계정으로 SSH에 접속합니다. 관리자 계정에서 다음과 같이 작업자를 만들고 소속 그룹을 확인합니다. 일반 작업자는 `sudo`와 호스트 `docker` 그룹에 추가하지 않습니다.

```bash
sudo adduser dev-user
id dev-user
```

작업자마다 별도 공개키를 등록하고 프로젝트 폴더의 소유권은 해당 작업자에게 부여합니다. [Ubuntu 사용자 관리](https://ubuntu.com/server/docs/how-to/security/user-management/)

### 프로젝트 폴더 접근 권한

관리자는 `/code/proj` 아래에 프로젝트별 폴더를 만들고, 폴더 단위로 접근 권한을 부여합니다. 다음 명령은 **새 폴더**를 준비하는 예시입니다. 기존 폴더는 `namei -l`로 상위 경로와 대상의 권한을 확인한 뒤 필요한 경로만 조정합니다.

```bash
# 서버 관리자: dev-user 전용, 다른 일반 계정은 접근 불가
sudo install -d -o dev-user -g "$(id -gn dev-user)" -m 0700 /code/proj/private-app-3000

# 서버 관리자: 팀 공유, 그룹 구성원은 읽기·쓰기 가능
sudo groupadd project-alpha
sudo usermod -aG project-alpha dev-user
sudo install -d -o root -g project-alpha -m 2770 /code/proj/alpha-4000
```

공유 그룹에는 필요한 작업자만 추가합니다. 조회만 허용하는 공유 폴더는 관리자가 소유하고 모드를 `2750`으로 지정합니다. 내부 파일에도 그룹 읽기 권한을 부여하고 그룹 쓰기 권한은 제거해야 합니다. `2770`의 setgid는 새 파일과 폴더에 프로젝트 그룹을 상속시킵니다. 팀에서 새 파일을 서로 수정하려면 파일을 만드는 셸이나 프로세스에서 `umask 0007` 등으로 그룹 쓰기 권한도 유지합니다.

그룹을 바꾼 뒤 작업자는 SSH와 VS Code 원격 연결을 종료하고 다시 접속합니다. 관리자도 실제 사용자 권한으로 확인할 수 있습니다.

```bash
namei -l /code/proj/alpha-4000
sudo -u dev-user test -r /code/proj/alpha-4000 && echo '목록 읽기 가능'
sudo -u dev-user test -x /code/proj/alpha-4000 && echo '폴더 진입 가능'
sudo -u dev-user test -w /code/proj/alpha-4000 && echo '폴더에 파일 생성 가능'
```

프로젝트 권한은 해당 경로를 보호합니다. 일반 SSH 셸을 허용하면 시스템에서 읽기 권한을 준 다른 경로도 볼 수 있습니다. 파일 전송만 허용하고 지정된 경로 안으로 제한해야 하는 계정은 별도 SFTP 전용 계정으로 구성합니다. Docker에 프로젝트를 마운트할 때는 해당 폴더만 연결하고, 컨테이너에서 파일을 만드는 프로세스의 UID·GID도 확인합니다. 컨테이너 root가 만든 파일은 호스트 작업자가 수정하지 못할 수 있습니다.

## 5. LAN SSH 접속과 키 인증

서버 콘솔에서 주소와 호스트 이름을 확인한 뒤 개인 PC에서 접속합니다. `dev-user`와 주소를 실제 값으로 바꿉니다.

```bash
# Ubuntu Server 콘솔에서 실행
hostnamectl
ip -4 -brief address
```

```bash
# 개인 PC에서 실행
ssh dev-user@192.168.1.226
```

개인 PC에서 사용자별 키를 만들고 공개키만 서버 계정에 등록합니다. 아래는 키가 아직 없을 때 개인 PC에서 실행합니다. 기존 키 파일이 있으면 덮어쓰지 않습니다. 새 키 인증을 확인한 뒤에만 비밀번호 로그인을 끄고 기존 SSH 세션은 설정 검증까지 유지합니다. 원격 접속 경로가 확인되지 않은 상태에서 SSH 설정이나 방화벽을 변경하지 않습니다.

```bash
# 개인 PC에서 실행
ssh-keygen -t ed25519 -f ~/.ssh/dev-server
ssh-copy-id -i ~/.ssh/dev-server.pub dev-user@192.168.1.226
ssh -i ~/.ssh/dev-server dev-user@192.168.1.226
```

## 6. 방화벽과 네트워크

서버 콘솔 또는 유지 중인 SSH 세션에서 필요한 접속만 허용합니다. SSH 포트를 바꿨다면 실제 설정 포트를 규칙에 사용합니다.

```bash
# Ubuntu Server에서 실행
sudo ufw status numbered
sudo ufw allow from 192.168.0.0/16 to any port 22 proto tcp
sudo ufw enable
sudo ufw status verbose
```

위 CIDR은 현재 네트워크의 예시입니다. 실제 관리망/VPN 주소 범위로 바꾸고, 기존에 SSH를 모든 주소에서 허용하는 규칙이 있으면 범위를 좁힙니다. 공유기 포트 포워딩으로 SSH를 인터넷에 바로 공개하지 않는 구성이 기본입니다. VPN 또는 허용된 관리망을 우선합니다. 외부 공개가 필요하면 상위 방화벽·인증·로그·보안 업데이트를 함께 계획합니다.

## 7. VS Code에서 원격 개발

개인 PC의 VS Code에 Microsoft Remote - SSH 확장을 설치하고 SSH 설정에 서버를 등록합니다.

```sshconfig
# 개인 PC의 ~/.ssh/config에 추가
Host dev-server
    HostName 192.168.1.226
    User dev-user
    IdentityFile ~/.ssh/dev-server
    IdentitiesOnly yes
```

VS Code에서 `Remote-SSH: Connect to Host...` → `dev-server`를 선택하고 서버의 프로젝트 디렉터리를 엽니다. 터미널에서 `hostname`, `whoami`, `pwd`를 확인해 원격 서버에서 작업 중인지 확인합니다. 서버별 Node·Python 등 개발 도구는 필요한 것만 프로젝트 버전 지침에 따라 설치합니다.

개발 서버 주소는 VPN 또는 내부망을 우선합니다. SSH를 인터넷에 공개해야 한다면 공유기 포트 포워딩에 의존하기 전에 VPN·접근 제어를 검토하고, 공개 포트는 허용 IP와 상위 방화벽으로 제한합니다.

## 8. 접속·데이터 확인과 개발 환경 선택

개인 PC에서 새 SSH 세션을 열고 서버 정보를 확인합니다.

```bash
# SSH 접속한 서버에서 실행
hostname
whoami
systemctl is-active ssh
```

Remote - SSH로 열면 VS Code 탐색기와 터미널은 서버의 파일시스템을 사용합니다. 소스는 사용자 홈 아래 프로젝트 폴더에 두고, 로컬 PC 데이터는 SSH/SFTP로 전송하거나 필요한 폴더만 별도 마운트합니다. 서버의 공유 디스크를 로컬 PC 디스크처럼 자동 표시한다고 가정하지 않습니다.

컨테이너 개발 환경이 필요하면 이 문서의 Ubuntu 설치·네트워크·SSH 키·UFW·VS Code 연결을 먼저 마친 뒤 [Docker 개발 환경](./02-docker-development.md)의 Engine 설치부터 순서대로 진행합니다. Docker 사용 권한에 따라 서버 SSH 이후의 접근 방법을 선택합니다. 컨테이너는 프로젝트 폴더를 bind mount해서 사용합니다. 이미지 태그와 실행 명령으로 도구 환경을 재현합니다. 컨테이너는 호스트 커널을 공유하므로 서로 신뢰할 수 없는 사용자를 강하게 격리해야 하면 사용자별 VM이나 별도 서버를 사용합니다.

공식 안내: [Ubuntu Server 설치](https://ubuntu.com/server/docs/installation), [Netplan 네트워크 설정](https://ubuntu.com/server/docs/configuring-networks/), [OpenSSH 서버](https://ubuntu.com/server/docs/openssh-server), [Ubuntu 방화벽](https://ubuntu.com/server/docs/security-firewall).
