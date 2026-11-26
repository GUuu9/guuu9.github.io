<!-- version: v5.2.0 -->
# Windows 개발 환경 설정

Windows 11 x64·PowerShell 7 기준입니다. WSL은 별도 Linux 환경으로 관리합니다. 최초 명령은 Windows PowerShell에서 실행하고 PowerShell 7 설치 후 나머지 설정은 `pwsh`에서 진행합니다. 설치기가 권한 상승을 요구할 때만 승인합니다.

## 1. 기본 도구·PATH

먼저 OS·CPU와 winget을 확인합니다.

```powershell
Get-ComputerInfo | Select-Object WindowsProductName, OsArchitecture
winget --version
```

Git·VS Code·C++ Build Tools를 설치합니다. Build Tools 설치 뒤 Visual Studio Installer에서 **Desktop development with C++**와 필요한 Windows SDK를 선택합니다.

```powershell
winget install --id Git.Git -e --source winget
winget install --id Microsoft.VisualStudioCode -e --source winget
winget install --id Microsoft.VisualStudio.2022.BuildTools -e --source winget --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
winget install --id Microsoft.PowerShell --source winget
```

PowerShell 7을 시작 메뉴에서 열거나 `pwsh`로 실행합니다. 이후 Windows Terminal에서 기본 프로필로 **PowerShell**을 선택합니다. VS Code 통합 터미널도 `Terminal: Select Default Profile` 명령에서 **PowerShell**을 선택합니다. 버전과 실행 파일 경로로 PowerShell 7인지 확인합니다.

```powershell
$PSVersionTable.PSVersion
(Get-Process -Id $PID).Path
```

Build Tools 설치기에서 **Desktop development with C++** 워크로드와 Windows SDK가 설치되었는지 확인합니다. 일반 PowerShell에는 MSVC 환경 변수가 설정되지 않으므로 시작 메뉴에서 **Developer PowerShell for VS 2022**를 열어 확인합니다.

```powershell
git --version
code --version
```

**Developer PowerShell for VS**에서 C++ 컴파일러도 확인합니다. 이 프로필은 MSVC 환경이 필요할 때만 사용합니다.

```powershell
cl
cmake --version
```

설치기가 PATH를 등록하지 않은 도구만 사용자 환경 변수의 `Path`에 실제 실행 파일 폴더를 추가합니다. 기존 값을 교체하지 않습니다. 새 PowerShell에서 확인합니다.

```powershell
$env:Path -split ';'
Get-Command git, code -ErrorAction SilentlyContinue
```

Chocolatey를 설치합니다. winget이 설치를 마친 뒤 새 PowerShell을 열어 확인합니다. 설치 과정에서 관리자 권한을 요청하면 승인합니다. [Chocolatey 설치 안내](https://docs.chocolatey.org/en-us/choco/setup/)

```powershell
winget install --id chocolatey.chocolatey --source winget
```

```powershell
choco --version
```

[D2Coding 공식 릴리스](https://github.com/naver/d2codingfont/releases)에서 TTF/TTC 파일을 내려받아 우클릭 → **Install**을 선택합니다. VS Code의 `Configure Display Language`에서 Korean을 선택하고 User Settings에 아래 JSON을 적용합니다.

```json
{
  "workbench.colorTheme": "Dark+",
  "editor.fontFamily": "D2Coding, monospace",
  "editor.fontSize": 13,
  "terminal.integrated.fontFamily": "D2Coding",
  "terminal.integrated.fontSize": 13,
  "workbench.secondarySideBar.defaultVisibility": "hidden",
  "chat.tools.autoApprove": false,
  "github.copilot.chat.agent.runTasks": false,
  "github.copilot.chat.agent.autoFix": false
}
```

## 2. 프로젝트 작업 폴더

개발 도구와 SDK는 설치기의 기본 경로인 C 드라이브에 설치합니다. 프로젝트 저장소(소스 코드와 프로젝트 문서)만 D 드라이브에 둡니다.

파일 탐색기에서 사용할 프로젝트 폴더를 D 드라이브에 만듭니다. 이후 프로젝트를 내려받거나 생성할 때 해당 폴더를 선택합니다.

## 3. 개발 도구

### Node.js

[nvm-windows 공식 릴리스](https://github.com/coreybutler/nvm-windows/releases)를 설치합니다. nvm과 Node 버전은 기본 설치 경로에 둡니다.

```powershell
nvm install lts
nvm use lts
node --version
npm --version
```

### Python

```powershell
powershell -ExecutionPolicy ByPass -Command "Invoke-Expression (Invoke-RestMethod https://astral.sh/uv/0.13.6/install.ps1)"
```

새 PowerShell에서 확인합니다.

```powershell
uv --version
```

### Flutter

Chocolatey로 FVM을 설치합니다. 관리자 PowerShell에서 설치하고 새 PowerShell에서 확인합니다. [FVM 공식 설치 안내](https://fvm.app/documentation/getting-started/installation)

```powershell
choco install fvm
```

```powershell
fvm --version
```

### Rust

[Rust 공식 설치](https://rust-lang.org/tools/install/)에서 `rustup-init.exe`를 실행하고 MSVC 툴체인을 선택합니다. 새 PowerShell에서 확인합니다.

```powershell
rustc --version
cargo --version
```

### Docker Desktop

[공식 Windows 설치 안내](https://docs.docker.com/desktop/setup/install/windows-install/)에 따라 설치합니다. WSL2가 필요하면 관리자 PowerShell에서 실행하고 재시작합니다.

```powershell
wsl --install --no-distribution
wsl --update
wsl --status
```

Docker Desktop을 실행한 뒤 일반 PowerShell에서 확인합니다.

```powershell
docker version
docker compose version
```

Docker Desktop과 WSL 배포판은 기본 설치 경로를 사용합니다. [WSL 설치 명령](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)

```powershell
wsl --install -d Ubuntu
wsl --list --verbose
```

### Codex·Ponytail

Codex CLI 설치·업데이트 중 PowerShell 오류를 피하도록 PowerShell 7(`pwsh`)을 사용합니다. Windows PowerShell에서 설치한 뒤 새 PowerShell 7에서 Codex CLI를 설치·업데이트합니다. 자세한 인증·복귀는 [Codex CLI 가이드](../01.Tools/codex.md)를 따릅니다.

```powershell
irm https://chatgpt.com/codex/install.ps1 | iex
codex --version
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
codex plugin list
```

### 터미널 테마

[Oh My Posh Windows 안내](https://ohmyposh.dev/docs/installation/windows)에 따라 설치합니다. PowerShell 7에서 진행합니다.

```powershell
winget install JanDeDobbeleer.OhMyPosh --source winget
oh-my-posh font install meslo
notepad $PROFILE
```

프로필 파일에 다음 줄을 추가해 Oh My Zsh의 `robbyrussell` 테마와 같은 이름의 Oh My Posh 테마를 적용합니다. Windows Terminal과 VS Code의 통합 터미널 글꼴도 `MesloLGM Nerd Font`로 지정합니다. VS Code의 `terminal.integrated.fontFamily`는 기존 D2Coding 설정 대신 이 글꼴로 바꿉니다.

```powershell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\robbyrussell.omp.json" | Invoke-Expression
```

프로필을 저장한 뒤 새 PowerShell 7 터미널에서 `oh-my-posh version`과 프롬프트 아이콘 표시를 확인합니다. 테마 설정 및 업데이트는 [Oh My Zsh·Oh My Posh 가이드](../01.Tools/oh-my-zsh.md)를 참고합니다.

### Unity

[Unity Hub](https://unity.com/download)를 설치하고 프로젝트가 요구하는 Editor를 추가합니다.

Unity Hub와 Editor는 기본 설치 경로에 둡니다. **Settings → Projects → Project location**은 D 드라이브의 프로젝트 저장소 경로로 지정합니다. [Unity Hub 설정](https://docs.unity.com/en-us/hub/settings)

Android Studio와 Android SDK는 기본 설치 경로인 C 드라이브에 둡니다. SDK Manager에서 Command-line Tools·Platform-Tools와 프로젝트가 요구하는 SDK를 추가합니다. SDK Location을 확인한 뒤 사용자 환경 변수 `ANDROID_HOME`과 사용자 `Path`에 실제 경로를 등록합니다. [Android Studio SDK 위치 설정](https://developer.android.com/studio/intro/studio-config)

```powershell
$AndroidSdk = "$env:LOCALAPPDATA\Android\Sdk"
[Environment]::SetEnvironmentVariable('ANDROID_HOME', $AndroidSdk, 'User')
$UserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$PlatformTools = Join-Path $AndroidSdk 'platform-tools'
if (($UserPath -split ';') -notcontains $PlatformTools) {
    [Environment]::SetEnvironmentVariable('Path', "$UserPath;$PlatformTools", 'User')
}
& (Join-Path $PlatformTools 'adb.exe') --version
```

새 PowerShell에서 `adb --version`으로 사용자 `Path` 적용을 확인합니다.

실기기는 제조사 USB 드라이버와 USB 디버깅 승인이 필요합니다. JDK는 Android Studio 포함 버전을 먼저 사용합니다.

Flutter iOS 빌드는 Mac·Xcode가 필요합니다. WSL 안에서 Android USB 연결을 자동으로 사용할 수 있다고 가정하지 않습니다.

## 완료 확인

새 PowerShell 7에서 확인합니다. 프로젝트가 지정한 런타임 버전은 각 저장소의 설정 파일로 선택합니다.

```powershell
git --version
nvm version
node --version
npm --version
uv --version
fvm --version
rustc --version
oh-my-posh version
codex --version
```

새 프로젝트는 [보일러플레이트 시작 가이드](../02.Boilerplates/README.md#처음-실행하는-순서), 상세한 도구 사용·업데이트는 [Tools 목록](../01.Tools/README.md)을 참고합니다.
