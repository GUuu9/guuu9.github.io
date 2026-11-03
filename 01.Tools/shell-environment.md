<!-- version: v1.0.0 -->
# 기본 패키지·셸·환경 변수

개인 PC의 도구 설치 전에 OS·CPU와 셸·PATH를 확인합니다. 프로젝트 전용 값은 `.env.example`·Git 제외 `.env`와 프로젝트 버전 파일에서 관리하며 공용 설정을 바꾸지 않습니다. 아래 명령은 표시한 OS의 임의 폴더에서 일반 사용자로 실행하고 `sudo`가 붙은 명령만 관리자 권한을 사용합니다. 기존 설정은 편집 전에 백업합니다.

## macOS 셸·PATH 준비

`sw_vers`·`uname -m`으로 macOS·CPU를 확인합니다. macOS에 포함된 zsh를 사용합니다. `~/.zshrc`는 설치 프로그램이 아니라 개인 셸 설정 파일이며 없으면 만듭니다.

```bash
touch ~/.zshrc
```

[nvm 초기화](./nvm.md#macos-nvm-설치)는 `~/.zshrc`에 설정합니다. 각 설치기의 PATH 안내를 우선하며 `~/.zprofile` 또는 `~/.zshrc` 중 한 곳에만 둡니다. 새 터미널을 열어 인식 여부를 확인하고 개인 경로·기존 설정을 덮어쓰지 않습니다.

#### 환경 변수·PATH 적용 위치

환경 변수는 실행 중인 도구에 전달하는 값이며 `PATH`는 명령을 찾는 폴더 목록입니다. 설치기가 안내한 경로를 우선하고 실제 실행 파일이 있는 폴더만 추가합니다. 설정 파일을 편집하기 전 기존 파일을 백업합니다.

- 이 문서의 기본 영구 설정 위치는 대화형 zsh가 읽는 `~/.zshrc`입니다. 기존 설치기가 `~/.zprofile`에 설정했다면 유지하고 두 파일에 같은 내용을 중복 추가하지 않습니다. `.zprofile`은 로그인 셸에서만 읽습니다.
- 터미널에 입력한 `export`는 현재 셸과 이후 자식 프로세스에만 적용됩니다. 영구 적용은 선택한 설정 파일을 편집하고 새 터미널에서 확인합니다. `.zshenv`에 모든 도구 초기화를 몰아넣지 않습니다.
- 예를 들어 uv 설치 경로가 `~/.local/bin`이고 PATH에 없다면 아래 한 줄을 추가합니다. 기존 `$PATH`를 보존하며 같은 항목이 있으면 다시 넣지 않습니다.

```zsh
export PATH="$HOME/.local/bin:$PATH"
```

설치 후 일반 터미널과 VS Code의 **새 통합 터미널**에서 다음을 확인합니다. 아직 설치 전이라면 `command -v uv`는 경로 없이 끝날 수 있습니다.

```zsh
printf '%s\n' "$PATH"
command -v uv
```

앱을 켠 상태에서 PATH를 바꿨다면 VS Code·Codex 같은 부모 앱도 완전히 종료한 뒤 다시 실행합니다. GUI 앱·비대화형 훅이 `.zshrc`를 읽는다고 가정하지 않습니다. Node 버전별 `bin` 경로는 고정하지 않고 nvm이 선택하게 둡니다. SDK·JDK 변수는 설치 후 [FVM 환경 변수 안내](fvm.md#android-프로젝트-연결환경-변수)를 따릅니다. 토큰·개인 키는 셸 설정·공유 PATH 출력에 넣지 않습니다.

zsh 로딩 규칙 확인일: 2026-10-30. [공식 시작 파일 안내](https://zsh.sourceforge.io/Doc/Release/Files.html).

## Windows 환경 변수·PATH

설정 → 시스템 → 정보에서 Windows 버전·CPU를 확인하고 Windows Update의 필요한 재시작을 마칩니다. [Windows Terminal 공식 설치](https://learn.microsoft.com/en-us/windows/terminal/install)와 App Installer의 winget을 준비한 뒤 일반 PowerShell에서 `winget --version`을 확인합니다. Terminal은 창·프로파일, PowerShell은 셸입니다.

설치기가 PATH를 등록했다면 중복 추가하지 않습니다. 직접 설치한 도구는 Windows 검색에서 **계정의 환경 변수 편집**을 열고 사용자 `Path` → 편집 → 새로 만들기로 **실행 파일이 있는 실제 폴더**를 추가합니다. 전체 Path 값을 교체하지 않고 기존 항목·변수 값을 변경 전에 기록합니다. 개인 도구의 경로를 넣기 위해 시스템 변수까지 변경할 필요는 없습니다.

현재 PowerShell의 `$env:변수명` 변경은 해당 프로세스와 이후 자식 프로세스에만 적용됩니다. 영구 설정은 사용자 환경 변수 화면에서 적용하고, Windows Terminal·VS Code·Codex를 완전히 종료했다가 다시 엽니다. 기존 앱에서 새 탭만 열면 이전 환경을 상속할 수 있습니다.

```powershell
# 현재 프로세스의 명령 검색 경로
$env:Path -split ';'
# 사용자 설정에 저장된 Path
[Environment]::GetEnvironmentVariable('Path', 'User')
# uv 설치 후 실제 검색되는 실행 파일 확인
Get-Command uv -All
```

설정할 값은 설치기의 안내와 실제 경로를 사용합니다. `%LOCALAPPDATA%`는 사용자 로컬 앱 데이터, `%USERPROFILE%`은 사용자 홈이며 PowerShell에서는 각각 `$env:LOCALAPPDATA`·`$env:USERPROFILE`로 읽습니다. nvm-windows의 `NVM_HOME`·`NVM_SYMLINK`는 설치기 설정을 유지하고 특정 Node 버전 폴더를 Path에 추가하지 않습니다. SDK·JDK 변수는 설치 후 [FVM 환경 변수 안내](fvm.md#android-프로젝트-연결환경-변수)를 따릅니다. Windows 변수와 WSL 변수는 별도로 관리하고 토큰을 설정 예제·공유 출력에 넣지 않습니다.

환경 변수 범위·상속 확인일: 2026-10-30. [Microsoft PowerShell 환경 변수 안내](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_Environment_Variables).

## Linux 기본 패키지 설치

개인 PC 터미널에서 배포판·CPU를 확인하고 기본 도구를 설치합니다. OS 전체 업그레이드는 아래 초기 설치와 분리합니다.

```bash
cat /etc/os-release
uname -m
sudo apt update
sudo apt install git curl ca-certificates unzip xz-utils zip
```

## Linux 셸·PATH 준비

설치기의 경로 안내를 우선합니다. `PATH`에는 실행 파일이 있는 폴더를 추가하고 기존 값을 보존합니다. bash의 대화형 터미널은 `~/.bashrc`, 선택한 zsh는 `~/.zshrc`에 설정하며 편집 전 기존 파일을 백업합니다. 로그인 bash는 `.bash_profile`·`.bash_login`·`.profile` 중 먼저 찾은 파일을 읽으므로, 로그인 셸에서만 경로가 없으면 기존 파일의 `.bashrc` 로딩 여부부터 확인합니다.

uv 등이 실제로 `~/.local/bin`에 설치되어 있고 PATH에 없다면 다음 한 줄을 선택한 셸 설정 파일에 한 번만 추가합니다. 터미널에만 입력한 `export`는 현재 셸과 이후 자식 프로세스에만 적용됩니다.

```bash
export PATH="$HOME/.local/bin:$PATH"
```

새 터미널에서 `printf '%s\n' "$PATH"`와 설치한 도구의 `command -v uv` 등으로 확인합니다. VS Code도 완전히 종료한 뒤 새로 열어 통합 터미널을 확인합니다. GUI 앱·비대화형 작업이 `.bashrc`를 항상 읽는다고 가정하지 않습니다. 기존 PATH를 통째로 교체하거나 nvm의 특정 Node 버전 경로를 영구 고정하지 않습니다. SDK·JDK 설정은 [FVM 환경 변수 안내](fvm.md#android-프로젝트-연결환경-변수)를 따릅니다. 토큰은 셸 설정·공유 로그에 넣지 않습니다.

셸 로딩 규칙 확인일: 2026-10-30. [Bash 시작 파일](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files) · [zsh 시작 파일](https://zsh.sourceforge.io/Doc/Release/Files.html).

## OS 업데이트와 보존

초기 도구 설치와 별도로 진행합니다. 먼저 소스·개인 데이터·셸 설정·설치 도구 버전을 보관하고 목표 OS가 필요한 SDK·IDE와 호환되는지 확인합니다. OS 업데이트가 프로젝트 SDK·의존성 업데이트를 대신하지 않습니다.

- macOS: 시스템 설정 → 일반 → 소프트웨어 업데이트를 사용합니다. [Apple 소프트웨어 업데이트](https://support.apple.com/en-us/108382).
- Windows: Windows Update에서 필요한 재시작까지 완료합니다. 도구는 각각의 Tools 문서에서 개별 갱신하고 `winget upgrade --all`을 기본 절차로 사용하지 않습니다.
- Ubuntu/Debian: 개인 터미널에서 아래 패키지 갱신 내역을 검토합니다. sudo 명령만 관리자 권한입니다.

```bash
sudo apt update
apt list --upgradable
sudo apt upgrade
```

OS 메이저 업그레이드는 [Ubuntu](https://ubuntu.com/desktop/docs/en/latest/how-to/upgrade-ubuntu-desktop/)·[Debian](https://www.debian.org/releases/stable/releasenotes) 공식 절차로 별도 진행합니다. 커널·드라이버 변경이 요구하면 재시작합니다. OS·SDK·데이터 형식은 실행 파일만 낮춘다고 복구되지 않으므로 백업·복구 수단을 먼저 확인합니다.

새 터미널·IDE의 도구 경로를 확인하고 문제 발생 시 백업한 셸·PATH와 비교해 변경 항목만 복원합니다. 공유 설정을 통째로 지우거나 모든 프로젝트의 환경 변수를 공용 셸 파일에 추가하지 않습니다. 이번 문서 이동에서 OS·패키지 설치·업데이트는 수행하지 않았습니다.
