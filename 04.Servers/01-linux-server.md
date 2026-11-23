<!-- version: v1.1.0 -->
# 네트워크 개발용 Ubuntu Linux 서버 구성

개발 PC에서 네트워크로 접속해 코드 편집·빌드·테스트하는 Ubuntu Server 구성입니다. 기본은 서버 호스트의 일반 사용자 계정과 SSH·VS Code Remote - SSH이며, Docker는 사용자별 환경 격리가 필요할 때 선택합니다.

## 1. 서버 준비와 Ubuntu 설치

Ubuntu Server LTS 설치 이미지는 [Ubuntu 공식 다운로드](https://ubuntu.com/download/server)에서 받습니다. 대상 PC의 CPU 아키텍처와 설치 시점의 지원 기간을 확인하고, 중요한 디스크 데이터는 먼저 백업합니다. 설치 중 네트워크, 호스트 이름, 관리자 계정, OpenSSH Server 설치를 선택합니다. 디스크 파티션은 대상 장치와 보존할 데이터를 확인한 뒤 지정합니다.

첫 설치는 모니터와 키보드를 연결해 진행합니다. 서버는 유선 LAN에 연결하고 설치 단계에서는 DHCP를 사용합니다. 원격 접속 주소를 고정하려면 공유기에서 서버 MAC 주소에 DHCP 예약을 설정하는 방법을 우선합니다. Ubuntu에 고정 IP를 직접 설정해야 할 때는 다음 절의 Netplan 절차를 사용합니다. 설치가 끝나 원격 접속을 확인하기 전까지 공유기 포트 포워딩은 만들지 않습니다.

## 2. 서버 IP 주소 설정

현재 주소·인터페이스·기본 경로를 확인합니다. `eno1` 등 인터페이스 이름과 주소는 장치마다 다릅니다.

```bash
# Ubuntu Server 콘솔에서 실행
ip -brief address
ip route
```

주소가 바뀌지 않게 하는 목적이라면 공유기의 DHCP 예약을 우선합니다. 서버에서 직접 고정할 경우 기존 Netplan 파일을 백업하고, 현재 네트워크의 주소·prefix·gateway·DNS와 중복되지 않는 주소를 네트워크 관리자에게 확인합니다. 다음은 **값을 실제 네트워크에 맞게 바꾼 예시**입니다. `/etc/netplan/`의 실제 파일명과 인터페이스를 사용합니다.

```yaml
# /etc/netplan/01-server.yaml에 추가 또는 기존 설정을 대체
# interface, IP/prefix, gateway, DNS를 실제 값으로 바꾸세요.
network:
  version: 2
  ethernets:
    eno1:
      dhcp4: false
      addresses:
        - 192.168.1.20/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 192.168.1.1
          - 1.1.1.1
```

콘솔에서 문법을 확인하고 `netplan try`로 적용합니다. 확인 프롬프트에 응답하지 않으면 설정을 되돌립니다. 연결이 유지되는지 확인한 뒤 승인합니다.

```bash
# Ubuntu Server 콘솔에서 관리자 권한으로 실행
sudo netplan generate
sudo netplan try
ip -brief address
ip route
```

SSH 원격 세션 하나만 둔 상태에서 주소를 바꾸지 않습니다. DHCP 예약과 서버 고정 IP를 동시에 설정해 충돌시키지 말고, 설정 후 개인 PC에서 새 주소로 SSH 접속을 확인합니다.

## 3. 첫 부팅과 SSH

서버 콘솔에서 OS와 주소를 확인하고 업데이트합니다.

```bash
# Ubuntu Server 콘솔에서 관리자 권한으로 실행
hostnamectl
ip address
sudo apt update
sudo apt upgrade
sudo apt install openssh-server
sudo systemctl enable --now ssh
sudo systemctl status ssh --no-pager
```

개인 PC에서 접속합니다. `server-user`와 주소를 실제 값으로 바꿉니다.

```bash
# 개인 PC에서 실행
ssh server-user@192.168.1.20
```

개인 PC에서 사용자별 키를 만들고 공개키만 서버 계정에 등록합니다. 아래는 키가 아직 없을 때 개인 PC에서 실행합니다. 기존 키 파일이 있으면 덮어쓰지 않습니다. 새 키 인증을 확인한 뒤에만 비밀번호 로그인을 끄고 기존 SSH 세션은 설정 검증까지 유지합니다. 원격 접속 경로가 확인되지 않은 상태에서 SSH 설정이나 방화벽을 변경하지 않습니다.

```bash
# 개인 PC에서 실행
ssh-keygen -t ed25519 -f ~/.ssh/dev-server
ssh-copy-id -i ~/.ssh/dev-server.pub server-user@192.168.1.20
ssh -i ~/.ssh/dev-server server-user@192.168.1.20
```

## 4. 방화벽과 네트워크

서버 콘솔 또는 유지 중인 SSH 세션에서 필요한 접속만 허용합니다. SSH 포트를 바꿨다면 실제 설정 포트를 규칙에 사용합니다.

```bash
# Ubuntu Server에서 실행
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status verbose
```

공유기 포트 포워딩으로 SSH를 인터넷에 바로 공개하지 않는 구성이 기본입니다. VPN 또는 허용된 관리망을 우선하고, 고정 주소 대신 DHCP 예약을 사용할 수 있습니다. 외부 공개가 필요하면 상위 방화벽·인증·로그·보안 업데이트를 함께 계획합니다.

## 5. VS Code에서 원격 개발

개인 PC의 VS Code에 Microsoft Remote - SSH 확장을 설치하고 SSH 설정에 서버를 등록합니다.

```sshconfig
# 개인 PC의 ~/.ssh/config에 추가
Host dev-server
    HostName 192.168.1.20
    User server-user
    IdentityFile ~/.ssh/dev-server
    IdentitiesOnly yes
```

VS Code에서 `Remote-SSH: Connect to Host...` → `dev-server`를 선택하고 서버의 프로젝트 디렉터리를 엽니다. 터미널에서 `hostname`, `whoami`, `pwd`를 확인해 원격 서버에서 작업 중인지 확인합니다. 서버별 Node·Python 등 개발 도구는 필요한 것만 프로젝트 버전 지침에 따라 설치합니다.

개발 서버 주소는 VPN 또는 내부망을 우선합니다. SSH를 인터넷에 공개해야 한다면 공유기 포트 포워딩에 의존하기 전에 VPN·접근 제어를 검토하고, 공개 포트는 허용 IP와 상위 방화벽으로 제한합니다.

## 6. 접속·데이터 확인과 개발 환경 선택

개인 PC에서 새 SSH 세션을 열고 서버 정보를 확인합니다.

```bash
# SSH 접속한 서버에서 실행
hostname
whoami
sudo systemctl is-active ssh
sudo ufw status
```

Remote - SSH로 열면 VS Code 탐색기와 터미널은 서버의 파일시스템을 사용합니다. 소스는 사용자 홈 아래 프로젝트 폴더에 두고, 로컬 PC 데이터는 SSH/SFTP로 전송하거나 필요한 폴더만 별도 마운트합니다. 서버의 공유 디스크를 로컬 PC 디스크처럼 자동 표시한다고 가정하지 않습니다.

개인 프로젝트나 신뢰된 소규모 팀은 사용자 계정과 프로젝트 디렉터리로 작업할 수 있습니다. 프로젝트마다 같은 개발 도구·시스템 패키지 조합을 재현하고 싶다면 [Docker 개발 환경](./02-docker-development.md)를 추가합니다. 컨테이너는 `docker run`의 bind mount로 서버 프로젝트 경로에 연결하며, 이미지 태그와 실행 명령으로 도구 환경을 재현합니다. 컨테이너는 호스트 커널을 공유하므로 서로 신뢰할 수 없는 사용자를 강하게 격리해야 하면 사용자별 VM이나 별도 서버를 사용합니다.

공식 안내: [Ubuntu Server 설치](https://ubuntu.com/server/docs/installation), [OpenSSH 서버](https://ubuntu.com/server/docs/openssh-server), [Ubuntu 방화벽](https://ubuntu.com/server/docs/security-firewall).
