<!-- version: v1.5.0 -->
# Linux에서 SSH Git bare 저장소 운영

Ubuntu Server를 Git 호스트로 사용하고 Linux·macOS·Windows PC에서 SSH로 연결합니다. bare 저장소는 작업 파일 없이 Git 기록만 보관합니다. 웹 UI·Pull Request·저장소별 접근 제어·CI는 제공하지 않습니다.

## 1. Linux 호스트와 네트워크 확인

[Linux 원격 접속 서버](./01-linux-server.md)의 Ubuntu minimized 설치·고정 IP·SSH 키·UFW 설정을 먼저 마칩니다. 서버는 유선 인터페이스를 사용하고 저장소는 용량을 확보한 서버 사용자 홈 아래에 둡니다.

관리자는 1단계의 SSH 허용 범위와 저장 공간을 확인합니다. 저장소 소유자는 SSH로 로그인해 `whoami`와 `df -h "$HOME"`을 확인합니다. 클라이언트는 LAN 또는 VPN을 통해 같은 호스트 SSH 서비스에 접속합니다.

## 2. 홈 디렉터리에 bare 저장소 생성

bare 저장소는 SSH 접속에 사용할 Linux 계정 소유로 만듭니다. `sudo git init`으로 만들지 않습니다. 그래야 SSH로 실행되는 Git 명령의 사용자와 저장소 소유자가 일치합니다.

### 대화형 스크립트로 생성

[create-bare-repo.sh](./create-bare-repo.sh)를 서버로 복사하고, 저장소를 소유할 SSH 계정으로 실행합니다. 복사한 파일의 소유자와 권한을 먼저 확인합니다. `bash ./create-bare-repo.sh`에는 파일 읽기 권한이 필요합니다.

```bash
whoami
stat -c '%U:%G %a %n' ./create-bare-repo.sh
bash ./create-bare-repo.sh
```

`./create-bare-repo.sh`로 직접 실행하려면 파일 소유자가 실행 권한을 추가합니다.

```bash
chmod u+x ./create-bare-repo.sh
./create-bare-repo.sh
```

다른 계정이 복사해 작업자가 파일을 읽거나 권한을 바꿀 수 없다면, 작업자 계정으로 다시 복사하거나 관리자가 스크립트 파일만 작업자 소유로 변경합니다. 아래 명령의 `gituser`는 실제 저장소 소유 계정으로 바꿉니다. 홈 경로가 `/home/gituser`와 다르면 아래 경로도 실제 계정의 홈에 맞춥니다.

```bash
sudo chown "gituser:$(id -gn gituser)" ./create-bare-repo.sh
# 소유권 변경 후 작업자 계정에서 실행
chmod 0700 ./create-bare-repo.sh
```

저장소 이름과 기본 브랜치(기본값 `main`)를 입력하고 생성 경로를 확인합니다. 승인하면 `~/git/<이름>.git`을 만들고 소유권과 clone 명령을 표시합니다. 이미 있는 경로에서는 초기화하지 않습니다. clone 명령의 `git-host`는 다음 절에서 설정하는 SSH 별칭입니다. 공유 그룹 저장소는 아래 공유 절차를 사용합니다.

스크립트는 `sudo` 없이 실행합니다. 새 저장소는 실행 계정 소유로 생성되므로 정상 생성 후 재지정할 필요가 없습니다. 기존 `~/git`에서 생성 권한 오류가 나면 `namei -l "$HOME/git"`로 경로 권한을 확인합니다. 기존 개인 저장소의 소유자가 잘못된 경우에는 아래의 소유권 교정 절차를 해당 저장소에만 적용합니다.

`/home/gituser/git`이 `gituser` 전용인데 `root:root`에 권한이 `0755`라면 작업자가 하위 저장소를 생성할 수 없습니다. 서버 관리자가 상위 폴더 자체의 소유권을 바꾼 뒤, 작업자 권한으로 쓰기와 진입을 확인합니다.

```bash
sudo chown "gituser:$(id -gn gituser)" /home/gituser/git
sudo -u gituser test -w /home/gituser/git &&
  sudo -u gituser test -x /home/gituser/git &&
  echo '저장소 생성 가능'
```

이 명령은 기존 파일과 저장소의 소유권을 유지합니다. 확인 후 `gituser`로 스크립트를 다시 실행합니다. 여러 계정이 사용하는 경로는 공유 그룹의 권한을 확인합니다.

### 직접 생성

아래는 SSH 접속 계정의 홈에 `project.git`을 만드는 예입니다. 같은 이름이 이미 있으면 재초기화하지 말고 먼저 상태를 확인합니다.

```bash
# Ubuntu 서버에서 저장소 소유자로 실행
mkdir -p "$HOME/git"
git init --bare --initial-branch=main "$HOME/git/project.git"
stat -c '%U:%G %a %n' "$HOME/git/project.git"
```

저장소 경로는 `/home/<사용자>/git/project.git`이 됩니다. `git init` 후 소유자가 SSH 접속 계정인지 확인합니다. root가 만든 저장소라면 소유자가 달라질 수 있습니다.

```bash
# 소유자가 잘못된 단일 사용자 저장소만 SSH 접속 계정으로 교정
sudo chown -R "$USER:$(id -gn)" "$HOME/git/project.git"
```

이 명령은 단일 사용자 저장소에만 사용합니다. 여러 계정이 함께 쓰는 저장소에는 적용하지 않습니다.

## 3. 클라이언트 SSH 키와 접속 별칭

클라이언트에서 개인 키를 만듭니다. 기존 키가 있으면 다른 파일명을 사용합니다. 개인 키는 클라이언트에 보관하고 공개키 `.pub`만 서버의 해당 계정에 등록합니다.

Linux·macOS 클라이언트:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t ed25519 -f ~/.ssh/git-host
```

공개키를 Linux 서버에 추가합니다. SSH 로그인 계정명과 주소를 실제 값으로 바꿉니다.

```bash
cat ~/.ssh/git-host.pub | ssh gituser@192.168.10.226 'umask 077; mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys'
```

Windows 클라이언트 PowerShell:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.ssh"
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\git-host"
Get-Content "$env:USERPROFILE\.ssh\git-host.pub" | ssh gituser@192.168.10.226 'umask 077; mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys'
```

클라이언트의 `~/.ssh/config` 또는 Windows의 `%USERPROFILE%\.ssh\config`에 별칭을 둡니다.

```sshconfig
Host git-host
    HostName 192.168.10.226
    User gituser
    IdentityFile ~/.ssh/git-host
    IdentitiesOnly yes
```

처음 연결할 때 서버 콘솔에서 SSH 호스트 키 지문을 확인한 뒤 승인합니다. 다음 명령의 `whoami`가 저장소 소유 계정과 같아야 합니다.

```bash
ssh git-host 'whoami'
```

## 4. 프로젝트 push·clone

기존 프로젝트에서 현재 브랜치와 원격을 확인한 뒤 첫 push를 합니다. `main`은 예시이며 실제 브랜치명으로 바꿉니다. SSH 별칭의 계정 홈을 기준으로 한 경로입니다.

```bash
git status --short --branch
git remote -v
git remote add origin git-host:git/project.git
git push -u origin main
```

이미 `origin`이 있다면 `git remote add` 대신 주소를 변경합니다.

```bash
git remote set-url origin git-host:git/project.git
```

모든 로컬 브랜치와 태그를 보낼 때:

```bash
git push -u origin --all
git push origin --tags
```

다른 PC에서는 같은 계정으로 공개키 등록을 마친 뒤 clone합니다.

```bash
git clone git-host:git/project.git
```

원격 브랜치와 태그 확인 및 브랜치 전환:

```bash
git fetch --all --tags
git branch -a
git tag
git switch --track origin/<브랜치명>
```

## 5. 소유권 오류와 다중 사용자 공유

`fatal: detected dubious ownership`은 서버에서 실행된 Git의 SSH 계정과 bare 저장소 소유자가 다를 때 발생할 수 있습니다. 클라이언트가 아니라 **서버 SSH 계정**에서 아래를 확인합니다.

```bash
whoami
stat -c '%U:%G %a %n' /home/gituser/git/project.git
```

단일 사용자 저장소는 같은 SSH 계정이 소유하도록 고칩니다. 의도적으로 그룹 공유하는 저장소만 해당 경로를 신뢰 대상으로 등록합니다. 이 명령은 각 사용자의 **서버 계정으로 SSH 접속한 세션**에서 실행합니다.

```bash
git config --global --add safe.directory /home/git-repos/project.git
git config --global --get-all safe.directory
```

`safe.directory '*'`로 모든 저장소 검사를 끄지 않습니다. Git은 소유자가 다른 저장소를 기본적으로 거부하며, `safe.directory`는 의도적으로 공유하는 정확한 경로에만 설정합니다. [Git safe.directory 안내](https://git-scm.com/docs/git-config#Documentation/git-config.txt-safedirectory)

여러 Linux 계정이 함께 쓰는 저장소는 별도 그룹으로 만듭니다. 그룹 구성원은 해당 저장소에 읽기·쓰기 권한을 갖습니다.

```bash
# Ubuntu 서버에서 관리자 권한으로 한 번 실행
sudo groupadd git-repos
sudo usermod -aG git-repos gituser
sudo install -d -o gituser -g git-repos -m 2770 /home/git-repos
```

저장소 소유 계정으로 그룹 공유 bare 저장소를 생성합니다.

```bash
sudo -u gituser git init --bare --shared=group --initial-branch=main /home/git-repos/project.git
sudo chgrp -R git-repos /home/git-repos/project.git
```

그룹에 추가된 사용자는 다시 로그인해야 권한이 반영됩니다. 그룹 구성원마다 위 `safe.directory` 설정을 자신의 서버 계정에 추가합니다. 그룹 공유는 구성원 모두에게 해당 저장소 쓰기 권한을 주며 사용자별 저장소 권한은 제공하지 않습니다. [Git shared repository 안내](https://git-scm.com/docs/git-init#_shared).

## 6. 상태 확인·백업·복구

bare 저장소는 커밋·브랜치·태그만 보관합니다. 미커밋 작업, 이슈·리뷰·CI, SSH 키는 별도입니다. `/home` 저장소 디렉터리를 다른 디스크나 장치에 정기 백업하고 clone 또는 복구를 확인합니다.

저장소 소유자는 사용량과 무결성을 확인합니다. 일관된 파일 백업이 필요하면 push가 없는 시간에 저장소 디렉터리 전체를 복사합니다. 복구는 기존 저장소를 덮어쓰기 전에 별도 디렉터리에서 확인합니다.

```bash
# 서버에서 저장소 소유자로 실행
du -sh "$HOME/git/project.git"
git --git-dir="$HOME/git/project.git" fsck --full
```

복구본에도 같은 무결성 검사를 수행하고, 소유권을 확인한 뒤 클라이언트에서 복구 경로로 시험 clone합니다. 작업자 퇴사나 키 교체 시 서버 계정의 `~/.ssh/authorized_keys`에서 해당 공개키를 제거하고 공유 그룹 소속도 확인합니다.

계정별 저장소 권한, 웹 화면, 코드 리뷰, 이슈, CI가 필요하면 자체 호스팅 Git 서비스를 사용합니다. bare 저장소는 SSH만 사용하며 별도의 Git 전용 포트나 `git daemon`은 필요하지 않습니다.

공식 안내: [Git 서버 설정](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server) · [Ubuntu 네트워크 설정](https://ubuntu.com/server/docs/configuring-networks/) · [Ubuntu OpenSSH Server](https://ubuntu.com/server/docs/openssh-server) · [Ubuntu 방화벽](https://ubuntu.com/server/docs/security-firewall).
