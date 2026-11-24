<!-- version: v1.1.0 -->
# SSH로 Git bare 저장소 운영

개인 PC나 서버에 bare 저장소를 만들고 SSH로 사용합니다. bare 저장소는 작업 파일 없이 Git 기록만 보관합니다. 웹 UI·Pull Request·계정별 저장소 권한·CI는 제공하지 않습니다. 상시 운영과 여러 사용자 공유에는 Linux 서버를 권장합니다.

## 1. 네트워크 구성

서버와 클라이언트를 같은 내부망에 연결하거나 VPN으로 연결합니다. 서버는 유선 네트워크를 권장하며, 공유기에서 서버의 MAC 주소에 DHCP 예약을 설정하거나 내부 DNS 이름을 사용해 주소를 고정합니다. 서버 OS에 임의의 고정 IP를 입력하기보다 네트워크 관리자가 지정한 주소·게이트웨이·DNS를 사용합니다.

SSH는 TCP 22를 사용합니다. 호스트 방화벽은 신뢰하는 내부망 또는 VPN 대역만 허용합니다. 공유기에서 외부 포트 포워딩을 설정하지 않습니다. 인터넷 밖에서 연결해야 하면 VPN으로 내부망에 접속합니다. 서버의 절전·종료 중에는 접속할 수 없습니다.

아래 `git-host`, `192.168.1.20`, `192.168.1.0/24`는 예시입니다. 실제 호스트 주소와 신뢰할 네트워크 대역으로 바꿉니다.

## 2. OS별 네트워크 설정

### Linux 서버

서버 콘솔에서 네트워크 인터페이스·주소·기본 경로를 확인합니다. `ip link` 출력에서 사용하는 인터페이스의 MAC 주소를 공유기 DHCP 예약에 등록합니다.

```bash
ip -brief address
ip route
ip link
```

UFW를 사용하는 경우 먼저 현재 규칙을 확인합니다. 기존에 `22/tcp ALLOW Anywhere`처럼 더 넓은 규칙이 있으면 좁히거나 제거해야 아래 내부망 규칙이 접근 범위를 제한합니다. VPN 사용자는 VPN 대역을 별도로 지정합니다.

```bash
sudo ufw status numbered
sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp
sudo ufw status verbose
```

서버에 이미 다른 방화벽 규칙이 있다면 이를 확인하고, 방화벽을 끄거나 SSH를 모든 주소에 허용하지 않습니다. Ubuntu의 [UFW 안내](https://documentation.ubuntu.com/server/how-to/security/firewalls/)를 참고합니다.

### macOS 개인 PC

**시스템 설정 → 네트워크 → 연결 중인 서비스 → 세부사항 → TCP/IP**에서 IPv4 구성이 DHCP인지 확인합니다. 주소를 고정하려면 공유기의 DHCP 예약을 사용합니다. 네트워크 관리자가 직접 값을 지정한 경우에만 수동 IP·서브넷 마스크·라우터·DNS를 입력합니다. [Apple TCP/IP 설정](https://support.apple.com/guide/mac-help/mchlp2718/mac)

터미널에서 하드웨어 포트와 현재 주소를 확인합니다. Wi-Fi가 `en0`가 아닐 수 있으므로 앞의 출력에서 실제 장치 이름을 확인합니다.

```bash
networksetup -listallhardwareports
ipconfig getifaddr en0
```

macOS 기본 방화벽을 켜 둔 상태에서 **시스템 설정 → 네트워크 → 방화벽 → 옵션**을 확인합니다. 들어오는 연결 전체 차단이 켜져 있으면 Remote Login 접속을 허용하도록 조정하고, 방화벽 자체를 끄지는 않습니다. [Apple 방화벽 안내](https://support.apple.com/guide/mac-help/mh34041/mac)

### Windows 개인 PC

**설정 → 네트워크 및 인터넷 → Wi-Fi 또는 이더넷 → 연결된 네트워크**에서 네트워크가 신뢰하는 내부망일 때만 프로필을 **개인**으로 설정합니다. 현재 IP·게이트웨이·어댑터 MAC을 확인하고, 공유기 DHCP 예약에는 해당 어댑터의 MAC 주소를 등록합니다.

```powershell
Get-NetIPConfiguration
getmac /v
Get-NetConnectionProfile
```

OpenSSH 방화벽 규칙의 프로필과 원격 주소를 내부망 또는 VPN으로 제한합니다. 관리자 PowerShell에서 실행합니다. VPN 대역에 연결하려면 `LocalSubnet` 대신 실제 VPN CIDR을 넣습니다.

```powershell
Set-NetFirewallRule -Name OpenSSH-Server-In-TCP -Profile Private -RemoteAddress LocalSubnet
Get-NetFirewallRule -Name OpenSSH-Server-In-TCP | Get-NetFirewallAddressFilter
```

Microsoft는 네트워크 프로필별 Windows 방화벽 사용을 권장합니다. 방화벽을 끄거나 공개 네트워크에 SSH를 열지 않습니다. [Windows 방화벽 프로필](https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/) · [방화벽 원격 주소 설정](https://learn.microsoft.com/en-us/powershell/module/netsecurity/set-netfirewallrule)

## 3. OS별 SSH 서버 준비

### Linux

Ubuntu Server에서 관리자 계정으로 OpenSSH Server를 설치하고 시작 상태를 확인합니다. 저장소를 사용할 각 사람에게 개인 Linux 계정을 부여합니다.

```bash
sudo apt update
sudo apt install git openssh-server
sudo systemctl enable --now ssh
sudo systemctl status ssh --no-pager
```

### macOS

Git이 없고 Command Line Tools도 설치되지 않았다면 설치 대화상자를 완료합니다.

```bash
xcode-select --install
git --version
```

**시스템 설정 → 일반 → 공유 → 원격 로그인**을 켜고 접속할 사용자만 허용합니다. macOS 개인 계정을 여러 사람과 공유하지 않습니다. [Apple 원격 로그인 안내](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac)

### Windows

관리자 PowerShell에서 OpenSSH Server를 설치하고 자동 시작을 설정합니다. Git for Windows가 없을 때만 설치합니다.

```powershell
# 관리자 PowerShell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
```

```powershell
# 일반 PowerShell
winget install --id Git.Git --exact
git --version
Get-Service sshd
```

OpenSSH 설치가 방화벽 규칙을 만들었는지 확인합니다. 설치 확인과 방화벽 규칙은 [Microsoft OpenSSH Server 안내](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse)를 따릅니다.

```powershell
Get-NetFirewallRule -Name OpenSSH-Server-In-TCP
```

Git for Windows의 `git`, `git-upload-pack`, `git-receive-pack` 명령이 SSH 세션에서도 찾아져야 합니다. 기본 설치 경로를 사용하면 `C:\Program Files\Git\cmd`가 PATH에 있는지 확인하고, 바꿨다면 `sshd` 서비스를 다시 시작합니다. SSH 로그인은 되지만 Git 전송이 실패하면 Windows SSH shell의 명령 실행·경로 인용 문제가 원인일 수 있습니다. 같은 PC의 여러 사용자 공유는 NTFS ACL과 SSH 계정 권한도 별도로 구성해야 합니다.

## 4. 클라이언트 SSH 키와 연결

클라이언트 PC에서 개인별 키를 만듭니다. 기존 키가 있으면 다른 파일명을 사용합니다. 개인 키는 클라이언트에 두고 공개키 `.pub`만 호스트 계정의 `authorized_keys`에 등록합니다.

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t ed25519 -f ~/.ssh/git-host
```

Windows 클라이언트 PowerShell:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.ssh"
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\git-host"
```

Linux/macOS 호스트에 공개키를 추가하는 예입니다. 서버 계정으로 로그인할 때 공개키 등록을 확인합니다.

```bash
cat ~/.ssh/git-host.pub | ssh gituser@git-host 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys'
```

Windows 클라이언트에서 Linux/macOS 호스트로 공개키를 보낼 때:

```powershell
ssh gituser@git-host 'mkdir -p ~/.ssh && chmod 700 ~/.ssh'
Get-Content "$env:USERPROFILE\.ssh\git-host.pub" | ssh gituser@git-host 'cat >> ~/.ssh/authorized_keys'
ssh gituser@git-host 'chmod 600 ~/.ssh/authorized_keys'
```

Windows 호스트는 `C:\Users\gituser\.ssh\authorized_keys`에 공개키 한 줄을 추가하고 [Microsoft SSH 키 인증·파일 권한 안내](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)를 따릅니다. `Administrators` 그룹 계정은 `administrators_authorized_keys` 경로 규칙이 적용될 수 있습니다.

클라이언트의 `~/.ssh/config` 또는 Windows의 `%USERPROFILE%\.ssh\config`에 접속 별칭을 등록합니다.

```sshconfig
Host git-host
    HostName 192.168.1.20
    User gituser
    IdentityFile ~/.ssh/git-host
    IdentitiesOnly yes
```

첫 접속 때 호스트 키 지문을 서버 콘솔과 대조해 승인합니다. SSH 접속 확인 후 종료합니다.

```bash
ssh git-host
```

## 5. 백업과 사용 범위

bare 저장소는 커밋·브랜치·태그 기록을 보관하지만 미커밋 작업 파일, 이슈·리뷰·CI, 사용자 홈의 SSH 키는 보관하지 않습니다. 호스트 디스크 장애에 대비해 저장소 폴더를 별도 디스크나 다른 장치에 정기 백업하고 실제 clone 또는 복구를 확인합니다.

팀에 웹 화면·사용자/저장소별 권한·코드 리뷰·이슈·CI가 필요하면 bare 저장소 대신 자체 호스팅 Git 서비스를 검토합니다. bare 저장소는 SSH 서비스만으로 동작하며 별도의 Git 전용 포트나 `git daemon`을 열 필요가 없습니다.

## 6. 저장소 생성·push·clone

아래 예시 저장소명 `project.git`, 사용자 `gituser`, 호스트 `git-host`, 브랜치 `main`은 실제 값으로 바꿉니다. SSH 키 연결을 먼저 완료합니다.

### 호스트에서 bare 저장소 생성

Linux·macOS 서버 계정의 홈 아래에 생성합니다.

```bash
mkdir -p ~/git
git init --bare --initial-branch=main ~/git/project.git
```

Windows 호스트의 일반 PowerShell에서 생성합니다.

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\git"
git init --bare --initial-branch=main "$env:USERPROFILE\git\project.git"
```

다른 Linux 사용자가 같은 저장소에 접근해야 하면 별도 공유 그룹을 사용합니다. 그룹 구성원은 해당 저장소를 읽고 쓸 수 있습니다. Git 저장소별 권한 분리가 필요하면 bare 저장소와 공유 그룹만으로 구현하지 말고 Git 서비스의 권한 관리 기능을 사용합니다.

```bash
sudo groupadd git-repos
sudo usermod -aG git-repos gituser
sudo install -d -o gituser -g git-repos -m 2770 /srv/git
sudo -u gituser git init --bare --shared=group --initial-branch=main /srv/git/project.git
sudo chgrp -R git-repos /srv/git/project.git
```

그룹에 추가된 사용자는 다시 로그인해야 권한이 반영됩니다.

### 기존 프로젝트에서 첫 push

프로젝트 폴더에서 현재 브랜치명을 확인하고 원격 저장소를 등록합니다. Linux/macOS/Windows 호스트의 홈 아래 저장소는 아래 경로를 사용합니다. `main`은 예시이며 실제 브랜치 이름으로 바꿉니다.

```bash
git status --short --branch
git remote add origin git-host:git/project.git
git push -u origin main
```

모든 로컬 브랜치와 태그를 처음 올리려면 다음처럼 실행합니다.

```bash
git push -u origin --all
git push origin --tags
```

`--all`은 각 로컬 브랜치를 같은 이름으로 올립니다. 브랜치 하나만 올릴 때는 해당 이름을 지정합니다.

```bash
git push -u origin <브랜치명>
```

Linux 공유 그룹 저장소는 원격 주소 경로를 `/srv/git/project.git`으로 바꿉니다.

```bash
git remote add origin git-host:/srv/git/project.git
git push -u origin main
```

원격 저장소의 브랜치와 태그를 확인하려면:

```bash
git fetch --all --tags
git branch -a
git tag
```

원격에 있는 다른 브랜치를 로컬 작업 브랜치로 전환할 때는 실제 이름을 지정합니다.

```bash
git switch --track origin/<브랜치명>
```

`git ls-remote`는 읽기 권한만 확인하며 push 권한까지 검증하지 않습니다. SSH 로그인은 되지만 Windows 호스트에서 Git 전송이 실패하면 `sshd` 서비스가 Git for Windows의 명령 경로를 상속했는지와 저장소 경로를 확인합니다.

### 다른 PC에서 clone

첫 push가 성공한 뒤 다른 PC도 SSH 키 등록을 마치고 실행합니다.

```bash
git clone git-host:git/project.git
```

연결 문제는 `ssh -v git-host`, SSH 서비스, 호스트 방화벽, 저장소 경로와 파일 권한 순서로 확인합니다. 외부 네트워크에서는 VPN 접속 여부와 VPN 대역 방화벽 규칙을 확인합니다.

공식 참고: [Git 서버 설정](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server) · [Git bare 공유 저장소](https://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server) · [Ubuntu 방화벽](https://documentation.ubuntu.com/server/how-to/security/firewalls/) · [Microsoft OpenSSH Server](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse) · [Apple Remote Login](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac).
