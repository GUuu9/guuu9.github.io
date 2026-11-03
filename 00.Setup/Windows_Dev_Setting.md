<!-- version: v5.1.0 -->
# Windows 개발 환경 설정

Windows 11 x64·PowerShell 기준입니다. WSL은 별도 Linux 환경으로 관리합니다. 아래 명령은 일반 PowerShell에서 실행하며 설치기가 권한 상승을 요구할 때만 승인합니다.

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
winget install --id Microsoft.VisualStudio.2022.BuildTools -e --source winget
```

새 PowerShell을 열어 확인합니다. `cl`은 **Developer PowerShell for VS**에서 확인합니다.

```powershell
git --version
code --version
```

**Developer PowerShell for VS**에서 C++ 컴파일러도 확인합니다.

```powershell
cl
cmake --version
```

설치기가 PATH를 등록하지 않은 도구만 사용자 환경 변수의 `Path`에 실제 실행 파일 폴더를 추가합니다. 기존 값을 교체하지 않습니다. 새 PowerShell에서 확인합니다.

```powershell
$env:Path -split ';'
Get-Command git, code -ErrorAction SilentlyContinue
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

## 2. 작업 공간과 데이터 드라이브

저장소와 용량이 큰 SDK·캐시는 OS 드라이브와 분리합니다. 아래 예시는 `D:\Dev` 기준이므로 실제 데이터 드라이브 문자로 바꿉니다. 프로그램 자체는 설치기가 정한 위치에 두고, 설정에서 저장 위치를 지정할 수 있는 데이터만 옮깁니다.

```powershell
$DevRoot = 'D:\Dev'
$Repositories = Join-Path $DevRoot 'repositories'
New-Item -ItemType Directory -Force -Path $Repositories | Out-Null
Set-Location $Repositories
```

프로젝트 저장소는 `$Repositories` 아래에 clone합니다. Node·Flutter·Gradle·uv의 버전 파일과 캐시도 데이터 드라이브에 두려면 사용자 환경 변수로 지정합니다. 새 PowerShell을 연 뒤 적용됩니다.

```powershell
[Environment]::SetEnvironmentVariable('FVM_CACHE_PATH', 'D:\Dev\Flutter', 'User')
[Environment]::SetEnvironmentVariable('GRADLE_USER_HOME', 'D:\Dev\Gradle', 'User')
[Environment]::SetEnvironmentVariable('UV_CACHE_DIR', 'D:\Dev\uv-cache', 'User')
```

### Node.js

[nvm-windows 공식 릴리스](https://github.com/coreybutler/nvm-windows/releases)를 설치한 뒤 Node 버전 저장소를 데이터 드라이브로 지정합니다. nvm 프로그램 파일은 설치기 기본 위치에 남습니다.

```powershell
nvm config set root=D:\Dev\Node\versions
nvm config get root
nvm install lts
nvm use lts
node --version
npm --version
```

## 3. 개발 도구

### Python

```powershell
powershell -ExecutionPolicy ByPass -Command "Invoke-Expression (Invoke-RestMethod https://astral.sh/uv/0.13.6/install.ps1)"
```

새 PowerShell에서 확인합니다.

```powershell
uv --version
```

### Flutter

[FVM 공식 설치 안내](https://fvm.app/documentation/getting-started/installation)에서 Windows 패키지를 내려받아 압축을 풀고, 실행 파일 폴더를 사용자 `Path`에 추가합니다. 새 PowerShell에서 확인합니다.

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

Docker Desktop **Settings → Resources → Advanced → Disk image location**에서 `D:\Dev\Docker`를 선택합니다. 이미지를 옮길 때도 이 설정을 사용합니다. [Docker Desktop 저장 위치 설정](https://docs.docker.com/desktop/settings-and-maintenance/settings/)

WSL 배포판이 필요한 경우 설치 위치를 데이터 드라이브로 지정합니다. [WSL 설치 명령](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)

```powershell
wsl --install -d Ubuntu --location D:\Dev\WSL\Ubuntu
wsl --list --verbose
```

### Codex·Ponytail

Node.js를 설치한 PowerShell에서 실행합니다.

```powershell
npm install -g @openai/codex
codex --version
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
codex plugin list
```

### Unity

[Unity Hub](https://unity.com/download)를 설치하고 프로젝트가 요구하는 Editor를 추가합니다.

Unity Hub에서 **Settings → Projects → Project location**을 저장소 경로로, **Settings → Installs → Installs location**을 `D:\Dev\Unity\Editor`로 지정합니다. 새 프로젝트와 에디터에 적용됩니다. [Unity Hub 설정](https://docs.unity.com/en-us/hub/settings)

Android Studio는 [공식 Windows 설치 안내](https://developer.android.com/studio/install#windows)로 설치합니다. SDK Manager에서 SDK Location을 `D:\Dev\Android\Sdk`로 지정하고 Command-line Tools·Platform-Tools를 추가합니다. 사용자 환경 변수 `ANDROID_HOME`도 같은 경로로 설정하고 사용자 `Path`에 `%ANDROID_HOME%\platform-tools`를 추가합니다. [Android Studio SDK 위치 설정](https://developer.android.com/studio/intro/studio-config)

```powershell
[Environment]::SetEnvironmentVariable('ANDROID_HOME', 'D:\Dev\Android\Sdk', 'User')
adb --version
```

실기기는 제조사 USB 드라이버와 USB 디버깅 승인이 필요합니다. JDK는 Android Studio 포함 버전을 먼저 사용합니다.

Flutter iOS 빌드는 Mac·Xcode가 필요합니다. WSL 안에서 Android USB 연결을 자동으로 사용할 수 있다고 가정하지 않습니다.

## 완료 확인

새 PowerShell에서 확인합니다. 프로젝트가 지정한 런타임 버전은 각 저장소의 설정 파일로 선택합니다.

```powershell
git --version
nvm version
node --version
npm --version
uv --version
fvm --version
rustc --version
codex --version
```

새 프로젝트는 [보일러플레이트 시작 가이드](../02.Boilerplates/README.md#처음-실행하는-순서), 상세한 도구 사용·업데이트는 [Tools 목록](../01.Tools/README.md)을 참고합니다.
