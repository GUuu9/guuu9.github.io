<!-- version: v1.0.0 -->
# SSH로 Git bare 저장소 운영

개인 PC나 서버에 Git의 bare 저장소를 만들고 SSH로 clone·push·pull하는 절차입니다. bare 저장소는 작업 파일 없이 Git 기록만 보관합니다. 웹 UI·Pull Request·계정별 저장소 권한·CI는 제공하지 않습니다. 상시 운영과 여러 사용자 공유에는 Linux 서버를 권장합니다.

## 1. 호스트와 네트워크 준비

호스트에는 Git과 SSH 서버가 필요합니다. 클라이언트는 같은 내부망에 있거나 VPN에 연결되어야 합니다.

- 서버는 유선 네트워크를 사용하고 공유기의 DHCP 예약 또는 내부 DNS 이름으로 주소를 고정합니다.
- SSH는 TCP 22를 사용합니다. 호스트 방화벽은 접속할 내부망/VPN 주소만 허용합니다.
- 인터넷에서 직접 접속하려고 공유기 포트를 열지 않습니다. 외부에서는 VPN으로 내부망에 연결합니다.
- 저장소 호스트의 전원이 꺼지거나 절전 상태이면 Git에 접속할 수 없습니다.

예시 주소 `git-host`와 사용자 `gituser`는 실제 호스트명·계정으로 바꿉니다.

## 2. OS별 호스트 설정

### Linux 서버 (상시 운영 권장)

Ubuntu Server 콘솔 또는 관리자 SSH 세션에서 Git과 OpenSSH Server를 설치하고 SSH를 활성화합니다.

```bash
sudo apt update
sudo apt install git openssh-server
sudo systemctl enable --now ssh
sudo systemctl status ssh --no-pager
```

UFW를 쓰면 실제 내부망 대역만 허용합니다. 아래 대역은 예시이므로 네트워크에 맞게 바꿉니다.

```bash
sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp
sudo ufw status verbose
```

일반 사용자 계정의 홈에 bare 저장소를 만듭니다. SSH 계정에는 원격 셸과 해당 계정이 접근할 수 있는 파일 권한이 주어집니다. 계정을 협업자끼리 공유하지 말고, 각자 개인 계정과 공개키를 사용합니다.

```bash
mkdir -p ~/git
git init --bare --initial-branch=main ~/git/project.git
```

여러 사용자가 한 저장소를 공유할 경우 Linux 그룹 권한을 설정합니다. 구성원 모두 같은 저장소에 읽기·쓰기 권한을 갖습니다.

```bash
sudo groupadd git-repos
sudo usermod -aG git-repos gituser
sudo install -d -o gituser -g git-repos -m 2770 /srv/git
sudo -u gituser git init --bare --shared=group --initial-branch=main /srv/git/project.git
sudo chgrp -R git-repos /srv/git/project.git
```

각 협업자에게 개인 OS 계정을 부여하고 그룹에 추가합니다. 그룹 권한은 다시 로그인한 뒤 적용됩니다. 그룹 구성원은 공유 그룹에 연결된 저장소를 읽고 쓸 수 있습니다. Git 저장소별 접근 제한이 필요하다면 bare 저장소와 공용 그룹만으로 구현하지 말고 Git 서비스의 권한 관리 기능을 사용합니다.

### macOS 개인 PC

Git이 없고 Command Line Tools도 설치되지 않았다면 설치 대화상자를 열고 완료될 때까지 기다립니다.

```bash
xcode-select --install
```

설치 상태와 저장소를 준비합니다.

```bash
git --version
mkdir -p ~/git
git init --bare --initial-branch=main ~/git/project.git
```

**시스템 설정 → 일반 → 공유 → 원격 로그인**을 켜고 허용할 사용자만 선택합니다. 서버 방화벽은 내부망/VPN 접속만 허용합니다. Apple 메뉴의 시스템 설정에서 표시되는 SSH 접속 주소 또는 `hostname`·내부 IP 주소를 사용합니다. [Apple 원격 로그인 안내](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac).

Mac이 잠자기 상태에 들어가면 저장소 접속이 끊길 수 있습니다. 상시 접근이 필요하면 전원·잠자기 정책을 확인하고 Linux 서버를 사용합니다. 여러 사람에게 macOS 개인 계정을 공유하지 않습니다.

### Windows 개인 PC

관리자 PowerShell에서 OpenSSH Server를 설치하고 자동 시작을 설정합니다. Git for Windows는 이미 있으면 현재 경로를 확인하고, 없을 때 설치합니다.

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

OpenSSH 설치가 만든 방화벽 규칙 `OpenSSH-Server-In-TCP`의 프로필과 허용 원격 주소를 확인해 내부망/VPN으로 제한합니다. 설치 확인과 방화벽 규칙은 [Microsoft OpenSSH Server 안내](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse)를 따릅니다.

내부 LAN에서만 접속하도록 제한하는 예입니다. 별도 VPN 대역에서 접속할 때는 `LocalSubnet` 대신 해당 VPN 대역을 지정합니다.

```powershell
# 관리자 PowerShell
Set-NetFirewallRule -Name OpenSSH-Server-In-TCP -RemoteAddress LocalSubnet
Get-NetFirewallRule -Name OpenSSH-Server-In-TCP | Get-NetFirewallAddressFilter
```

저장소는 호스트 사용자 계정이 쓰기 가능한 폴더에 만듭니다.

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\git"
git init --bare --initial-branch=main "$env:USERPROFILE\git\project.git"
```

Git for Windows의 `git`, `git-upload-pack`, `git-receive-pack` 명령이 SSH 세션에서도 찾아져야 합니다. Git 기본 설치 경로를 사용하면 `C:\Program Files\Git\cmd`가 PATH에 있는지 확인하고, 바꿨다면 `sshd` 서비스를 다시 시작합니다. 클라이언트에서 `ssh gituser@git-host "git --version"`과 `git ls-remote gituser@git-host:git/project.git`을 확인합니다. SSH 로그인은 되지만 Git 전송이 실패하면 Windows SSH shell의 명령 실행·경로 인용 문제일 수 있습니다. 이 구성을 억지로 우회하지 말고 Linux 호스트를 사용합니다. 같은 PC의 여러 사용자 공유는 NTFS ACL과 SSH 계정 권한을 따로 구성해야 하므로, 상시 팀 저장소는 Linux 구성을 사용합니다.

## 3. 클라이언트 SSH 키와 연결

클라이언트 PC에서 개인별 키를 만듭니다. 기존 키 파일이 있으면 덮어쓰지 않고 다른 파일명을 사용합니다. 개인 키는 클라이언트에 보관하고 공개키 `.pub`만 호스트 계정의 `authorized_keys`에 등록합니다.

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t ed25519 -f ~/.ssh/git-host
```

Windows 클라이언트 PowerShell에서는 같은 키를 다음처럼 만듭니다.

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.ssh"
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\git-host"
```

Linux/macOS 호스트는 해당 OS의 `~/.ssh/authorized_keys`에 공개키를 추가하고 권한을 제한합니다. 아래는 클라이언트의 일반 터미널에서 공개키를 전송하는 예입니다.

```bash
cat ~/.ssh/git-host.pub | ssh gituser@git-host 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys'
```

Windows 클라이언트에서 Linux/macOS 호스트로 공개키를 보낼 때는 PowerShell에서 실행합니다.

```powershell
ssh gituser@git-host 'mkdir -p ~/.ssh && chmod 700 ~/.ssh'
Get-Content "$env:USERPROFILE\.ssh\git-host.pub" | ssh gituser@git-host 'cat >> ~/.ssh/authorized_keys'
ssh gituser@git-host 'chmod 600 ~/.ssh/authorized_keys'
```

Windows 호스트는 `C:\Users\gituser\.ssh\authorized_keys`에 공개키 한 줄을 추가하고, [Microsoft의 SSH 키 인증·파일 권한 안내](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)를 따릅니다. `Administrators` 그룹 계정은 별도의 `administrators_authorized_keys` 경로 규칙이 적용될 수 있습니다.

클라이언트의 `~/.ssh/config`에 별칭을 추가합니다. Windows OpenSSH 클라이언트는 `%USERPROFILE%\.ssh\config`를 사용합니다.

```sshconfig
Host git-host
    HostName 192.168.1.20
    User gituser
    IdentityFile ~/.ssh/git-host
    IdentitiesOnly yes
```

첫 접속 때 표시되는 호스트 키 지문을 호스트 콘솔에서 확인한 뒤 승인합니다. 이후 접속과 저장소 경로를 확인합니다.

```bash
ssh git-host
```

연결을 확인한 뒤 종료하고, 예시 저장소의 참조를 조회합니다.

```bash
git ls-remote git-host:git/project.git
```

Linux 그룹 공유 저장소는 경로를 `/srv/git/project.git`으로 지정합니다.

```bash
git ls-remote git-host:/srv/git/project.git
```

## 4. 기존 프로젝트 push·다른 PC에서 clone

기존 프로젝트에서 현재 브랜치명을 확인한 뒤 원격 저장소를 등록하고 첫 push를 합니다. `main`은 예시이며 실제 브랜치명으로 바꿉니다.

```bash
git status --short --branch
git remote add origin git-host:git/project.git
git push -u origin main
```

다른 PC에서는 같은 SSH 키 등록 절차를 완료하고 저장소를 clone합니다.

```bash
git clone git-host:git/project.git
```

연결 문제는 `ssh -v git-host`, 호스트의 SSH 서비스 상태·방화벽, 저장소 경로·파일 권한 순서로 확인합니다. `git ls-remote`는 조회 권한만 확인하며 push 권한까지 검증하지 않습니다. 첫 push와 clone이 성공하는지 각각 확인합니다.

## 5. 백업과 사용 범위

bare 저장소는 커밋·브랜치·태그 기록을 보관하지만 미커밋 작업 파일, 이슈·리뷰·CI, 사용자 홈의 SSH 키를 보관하지 않습니다. 호스트 디스크 장애에 대비해 저장소 폴더를 별도 디스크나 다른 장치에 정기 백업하고 실제 clone 또는 복구를 확인합니다.

팀에 웹 화면·사용자/저장소별 권한·코드 리뷰·이슈·CI가 필요하면 bare 저장소 대신 자체 호스팅 Git 서비스를 검토합니다. Git 프로토콜은 bare 저장소와 SSH 서비스만으로 동작하며 별도의 Git 전용 포트나 `git daemon`을 열 필요가 없습니다.

공식 참고: [Git 서버 설정](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server) · [Git bare 공유 저장소](https://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server) · [Microsoft OpenSSH Server](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse) · [Apple Remote Login](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac).
