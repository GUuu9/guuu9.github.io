<!-- version: v2.1.0 -->
# Windows 개발 도구 초기 설치

**Windows 11 x64·PowerShell·Windows 네이티브 개발**을 기준으로 합니다. macOS와 동일하게 **0~8절 초기 설치 → 도구 인식 확인 → 프로젝트 작업 안내 → 업데이트** 순서입니다. 별도 표시가 없으면 개인 PC의 일반 사용자 PowerShell에서 임의 디렉터리에서 실행합니다. 아직 프로젝트 폴더·가상환경·잠금 파일이 필요하지 않습니다.

ARM Windows는 별도 지원 확인이 필요하며 특히 Android Studio의 Windows ARM 지원을 전제하지 않습니다. Linux 서버용 개발이 필요하면 WSL2를 별도 선택합니다. Windows·WSL의 도구·인증·프로젝트 의존성을 혼용하지 않습니다.

## 0. Windows·터미널·Git·폰트 준비

설정 → 시스템 → 정보에서 Windows 버전·CPU를 확인합니다. Windows Update의 필요한 재시작을 마치고 Windows Terminal의 PowerShell을 엽니다. App Installer가 제공하는 `winget --version`을 확인합니다. 기존 도구는 `Get-Command`·`where.exe`로 설치 경로를 먼저 확인합니다.

```powershell
winget --version
winget install --id Git.Git -e --source winget
```

설치기가 권한을 요구하면 해당 설치에 한해 승인합니다. 새 PowerShell에서 `git --version`을 확인합니다. Windows Terminal이 없다면 [Microsoft 공식 배포처](https://learn.microsoft.com/en-us/windows/terminal/install)에서 설치합니다. Terminal은 창·프로파일을 제공하며 PowerShell은 셸입니다. Oh My Zsh는 Windows 네이티브 PowerShell에 설치하지 않고, 필요하면 WSL의 Linux zsh 환경에서만 선택합니다.

### 사용자 환경 변수·Path 설정

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

설정할 값은 설치기의 안내와 실제 경로를 사용합니다. `%LOCALAPPDATA%`는 사용자 로컬 앱 데이터, `%USERPROFILE%`은 사용자 홈이며 PowerShell에서는 각각 `$env:LOCALAPPDATA`·`$env:USERPROFILE`로 읽습니다. nvm-windows의 `NVM_HOME`·`NVM_SYMLINK`는 설치기 설정을 유지하고 특정 Node 버전 폴더를 Path에 추가하지 않습니다. SDK·JDK 변수는 설치 후 [FVM 환경 변수 안내](../01.Tools/fvm.md#android-프로젝트-연결환경-변수)를 따릅니다. Windows 변수와 WSL 변수는 별도로 관리하고 토큰을 설정 예제·공유 출력에 넣지 않습니다.

환경 변수 범위·상속 확인일: 2026-10-30. [Microsoft PowerShell 환경 변수 안내](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_Environment_Variables).

### D2Coding 설치·터미널 적용

[NAVER 공식 릴리스](https://github.com/naver/d2-coding-font/releases)에서 사용하던 D2Coding Ver 1.x 배포본을 받아 압축을 풉니다. 사용할 TTF 또는 TTC를 열어 설치하고 설정 → 개인 설정 → 글꼴에서 실제 패밀리 이름·버전을 확인합니다. 같은 패밀리의 TTF·TTC·서로 다른 버전을 중복 설치하지 않습니다. [Microsoft 폰트 설치 안내](https://support.microsoft.com/en-us/windows/experience/personalization/manage-fonts-in-windows).

Windows Terminal의 **설정 → 기본값(Defaults) 또는 사용할 프로파일 → 모양(Appearance) → 글꼴(Font face)**에서 D2Coding을 선택하고 저장합니다. 크기는 14를 시작값으로 조절합니다. PowerShell·WSL 프로파일이 개별 설정으로 덮어쓰는지도 확인합니다. GUI를 렌더링하는 Windows에 폰트를 설치하며, WSL 터미널용이라고 WSL에만 설치하지 않습니다. 앱 재시작 후 한글·영문·숫자를 확인하고 원본 폰트·기존 설정을 보관합니다. [Terminal 폰트 설정](https://learn.microsoft.com/en-us/windows/terminal/customize-settings/profile-appearance).

## 1. VS Code

개인 PC PowerShell에서 설치하거나 [공식 Windows 설치 프로그램](https://code.visualstudio.com/docs/setup/windows)을 사용합니다. 같은 앱을 두 경로로 중복 설치하지 않습니다.

```powershell
winget install --id Microsoft.VisualStudioCode -e --source winget
```

새 PowerShell에서 `code --version`을 확인하고 [공통 편집기 설정](../01.Tools/editor-setup.md)에 따라 `Ctrl+Shift+P`의 표시 언어 구성으로 한국어를 선택합니다. D2Coding은 편집기·통합 터미널에 각각 적용합니다.

ESLint·Prettier·Python·Python Debugger·Flutter·C/C++·CMake Tools·rust-analyzer·Unity·Dev Containers 확장은 필요한 작업만 선택합니다. 포맷·린트는 프로젝트 설정을 우선합니다.

## 2. Node.js: nvm-windows + npm

[nvm-windows 공식 Releases](https://github.com/coreybutler/nvm-windows/releases)의 설치 프로그램을 사용합니다. 기존 단독 Node가 있다면 버전·전역 패키지를 기록하고 [공식 마이그레이션 안내](https://github.com/coreybutler/nvm-windows#installation--upgrades)에 따라 설치 경로·심볼릭 링크 충돌을 정리합니다. 새 PowerShell에서 확인합니다.

```powershell
nvm version
nvm list available
nvm install lts
nvm list
```

목록에 표시되는 **정확한 설치 버전**으로 `nvm use 버전`을 실행합니다. 심볼릭 링크 변경에 권한이 필요하면 이 명령을 관리자 PowerShell에서 실행합니다. 이후 새 일반 PowerShell에서 `node --version`·`npm --version`을 확인합니다. LTS는 프로젝트가 없는 초기 기본값이며 프로젝트별 버전은 [nvm Windows 흐름](../01.Tools/nvm.md#windows-기본-흐름)에서 선택합니다.

nvm-windows는 Unix nvm과 별개입니다. `nvm alias default`·`.nvmrc` 자동 적용을 전제하지 않으며 전환은 다른 Windows 셸에도 영향을 줄 수 있습니다. `npm.ps1`이 정책으로 차단되면 `npm.cmd`를 사용하고 조직의 실행 정책을 전역 해제하지 않습니다. [Microsoft Node.js 안내](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).

## 3. Python 관리 도구: uv

[공식 독립 PowerShell 설치 안내](https://docs.astral.sh/uv/getting-started/installation/)를 사용합니다.

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.13.6/install.ps1 | iex"
```

설치기의 사용자 PATH 안내를 적용하고 새 PowerShell에서 `Get-Command uv`·`uv --version`을 확인합니다. 실행 정책 옵션은 설치 프로세스에 한정합니다. 아직 특정 Python·`.venv`를 만들지 않고 시스템 Python을 변경하지 않습니다. 복원은 [uv](../01.Tools/uv.md)·[venv](../01.Tools/venv.md)를 따릅니다.

프로젝트 복원 후 가상환경 활성화는 `.\.venv\Scripts\Activate.ps1`, 종료는 `deactivate`입니다. 정책으로 차단되면 uv 명령 또는 `.\.venv\Scripts\python.exe`를 직접 사용합니다.

## 4. Flutter 도구: FVM·Android Studio

[FVM 공식 설치 안내](https://fvm.app/documentation/getting-started/installation)에서 연결된 공식 Releases의 Windows·CPU에 맞는 독립 패키지를 사용합니다. 사용자 쓰기 권한이 있는 경로에 풀고 실행 파일이 있는 폴더를 사용자 PATH에 추가합니다. 새 PowerShell에서 `fvm --version`을 확인합니다.

SDK 링크 생성에 권한이 필요하면 Windows 개발자 모드의 심볼릭 링크 지원과 FVM 안내를 확인합니다. SDK 사전 다운로드는 요구 버전으로 `fvm install 버전`을 사용하되 프로젝트가 없는 폴더에서 `fvm use`로 `.fvmrc`를 만들지 않습니다. Intel Mac 전용 Flutter 3.35.7 고정을 Windows 전체에 적용하지 않습니다.

[Android Studio 공식 Windows 설치 안내](https://developer.android.com/studio/install#windows)에 따라 x64 설치 프로그램으로 설치하고 처음 실행합니다. SDK Manager에서 Command-line Tools·Platform-Tools를 준비하고 SDK 경로를 기록합니다. 프로젝트별 SDK Platform·Build-Tools·NDK·CMake는 복원 단계에서 선택합니다. AVD·에뮬레이터 이미지는 사전 설치하지 않습니다.

JDK는 Android Studio 포함 버전을 우선하되 프로젝트 Gradle·AGP 요구 조건을 확인합니다. [공통 폰트 안내](../01.Tools/editor-setup.md#android-studio-편집기콘솔터미널-폰트)를 적용합니다. Android 실기기는 개발자 옵션·USB 디버깅·연결 허용과 [제조사 공식 USB 드라이버](https://developer.android.com/studio/run/oem-usb)를 준비합니다. Windows SDK·adb·JDK와 WSL의 도구를 혼용하지 않습니다.

## 5. C/C++·Rust·Unity 도구

C/C++·Rust MSVC·Electron 네이티브 모듈을 사용하는 경우 개인 PC PowerShell에서 Build Tools를 설치합니다. 설치기가 권한을 요구할 수 있습니다.

```powershell
winget install --id Microsoft.VisualStudio.2022.BuildTools -e --source winget
```

Visual Studio Installer에서 **Desktop development with C++** 워크로드와 필요한 Windows SDK·MSVC·CMake 도구를 선택합니다. 위 명령만으로 워크로드 전체가 준비되지 않습니다. 설치된 버전의 **Developer PowerShell**에서 `cl`·`cmake --version`으로 도구 인식을 확인합니다. 일반 PowerShell에서 `cl`을 찾지 못한다고 곧바로 재설치하지 않습니다. 프로젝트 빌드는 [C/C++ 툴체인](../01.Tools/cpp-toolchain.md)을 따릅니다.

Rust는 [공식 Windows rustup-init](https://rust-lang.org/tools/install/)을 설치하고 기본 MSVC 툴체인을 사용합니다. 새 PowerShell에서 `rustup show`를 확인합니다.

Unity가 필요하면 [공식 Unity Hub](https://unity.com/download)를 설치하고 실행만 확인합니다. 정확한 Editor와 빌드 모듈은 프로젝트 복원 때 선택합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다.

## 6. Docker Desktop·선택적 WSL2

[공식 Windows 지원 조건](https://docs.docker.com/desktop/setup/install/windows-install/)의 Windows 빌드·가상화·WSL 버전 요구 조건을 먼저 확인합니다. 필요한 경우 **관리자 PowerShell**에서 WSL을 설치·갱신하고 요구되는 재시작을 완료합니다. 아래는 사용자 배포판을 추가하지 않는 예시입니다.

```powershell
wsl --install --no-distribution
wsl --update
wsl --status
```

[Microsoft WSL 명령 안내](https://learn.microsoft.com/en-us/windows/wsl/basic-commands). 이미 구성되어 있으면 재설치하지 않고 상태를 확인합니다. Windows x86_64 공식 Docker Desktop을 설치하고 WSL2 백엔드의 Linux 컨테이너 환경으로 실행합니다. 엔진 준비 후 일반 PowerShell에서 확인합니다.

```powershell
docker context ls
docker context show
docker version
docker compose version
docker run --rm hello-world
```

Windows 컨테이너가 필요하면 별도 지원 조건·설치 모드를 확인합니다. 위 Linux 컨테이너 구성과 구분합니다.

### WSL에서 개발할 때만

개인 PC PowerShell에서 `wsl --list --online`으로 배포판을 확인하고 선택한 배포판을 설치합니다. 예를 들어 Ubuntu가 목록에 있으면 `wsl --install -d Ubuntu`를 사용하고 Linux 사용자 생성을 마칩니다.

WSL 안의 도구는 [Linux 문서](./Linux_Dev_Setting.md)를 따르되, VS Code는 Windows 설치본과 WSL 확장으로 연결하고 Docker는 Windows Docker Desktop의 해당 배포판 통합을 사용합니다. Linux GUI 앱·Docker Desktop을 중복 설치하지 않습니다. 소스는 Linux 홈 파일시스템에 두고 Windows의 `node_modules`·`.venv`를 공유하지 않습니다. Codex·Ponytail도 WSL에서 쓰려면 해당 환경에 별도 설치·인증합니다. Windows에 연결한 Android USB 기기가 WSL에 자동 전달된다고 가정하지 않습니다.

## 7. Codex CLI·Ponytail

선택한 Node 환경에서 [OpenAI 공식 CLI 안내](https://learn.chatgpt.com/docs/codex/cli)의 npm 설치 방식을 사용합니다. Windows 네이티브 PowerShell에서 실행합니다.

```powershell
npm install -g @openai/codex
codex --version
codex
```

처음 실행할 때 인증합니다. PowerShell 정책으로 `npm.ps1`·`codex.ps1`이 차단되면 각각 `npm.cmd`·`codex.cmd`를 사용합니다. nvm으로 Node를 바꾸면 전역 설치가 보이지 않을 수 있으므로 설치한 Node 버전·경로를 기록합니다. API 키·토큰을 저장소에 기록하지 않습니다.

Node 설치·Codex 인증 후 [Ponytail 설치·훅 활성화·스킬 호출](../01.Tools/codex.md#ponytail-스킬-추가)을 진행합니다. `codex plugin`이 지원되지 않으면 CLI를 먼저 갱신합니다. 제작자 설치 명령은 공통이지만 Windows 네이티브 훅 실행 성공 여부는 실제 설치 후 확인합니다. WSL 설치와 공유된다고 가정하지 않습니다.

## 8. 초기 설치 완료 확인

- [ ] 새 PowerShell과 VS Code 통합 터미널에서 필요한 git·code·nvm·node·npm·uv·fvm·codex를 인식한다.
- [ ] D2Coding·VS Code 한국어와 Android Studio의 폰트 설정을 확인했다.
- [ ] Android Studio의 SDK Manager가 열리고 제조사 USB 드라이버를 준비했다.
- [ ] C/C++·Rust를 사용한다면 Developer PowerShell의 빌드 도구와 rustup을 확인했다.
- [ ] Unity를 사용한다면 Hub가 준비되었다. 프로젝트 Editor는 다음 단계에서 설치한다.
- [ ] Docker를 사용한다면 Client·Server·Compose와 hello-world를 확인했다.
- [ ] Ponytail을 사용한다면 스킬 목록·훅 상태를 확인했다.
- [ ] Windows와 WSL의 도구·프로젝트 경로를 구분했다. 사용자 Path 변경 후 앱을 재시작하고 실제 실행 경로를 확인했다.

여기까지는 초기 도구 인식 확인이며 기존 프로젝트 실행 성공은 다음 단계에서 판단합니다.

## 프로젝트 작업 안내

프로젝트를 내려받은 뒤 README·CI·버전 파일·잠금 파일을 우선합니다. 복원 중 의존성을 일괄 갱신하거나 잠금 파일을 삭제하지 않습니다. 다른 OS·CPU의 `node_modules`·`.venv`·네이티브 빌드 결과를 복사하지 않습니다.

| 작업 | 상세 절차 |
| :--- | :--- |
| TypeScript·React·Electron·서버 | [nvm·npm](../01.Tools/nvm.md#windows-기본-흐름): 요구 Node 선택·npm ci·프로젝트 실행/테스트/빌드 |
| Python | [uv](../01.Tools/uv.md)·[venv](../01.Tools/venv.md): 요구 Python·잠금 파일·인터프리터 복원 |
| Flutter·Android | [FVM](../01.Tools/fvm.md#기존-프로젝트-복원): SDK 고정·pub get·doctor·실기기 확인 |
| C/C++ | [툴체인·프리셋·별도 빌드 경로](../01.Tools/cpp-toolchain.md) |
| Rust | [rustup·프로젝트 툴체인](../01.Tools/rustup.md) |
| 컨테이너 | [Docker·Compose·Dev Containers](../01.Tools/docker.md) |

Flutter 프로젝트의 SDK 복원 후에는 [FVM의 Android 프로젝트 연결·환경 변수](../01.Tools/fvm.md#android-프로젝트-연결환경-변수)에서 SDK·JDK 경로, 라이선스·기기 탐지·실행과 VS Code 연동을 확인합니다.

**iOS 로컬 빌드·서명·실기기 검증은 Mac·Xcode에서 수행합니다.** 모든 OS의 네이티브 패키징을 Docker만으로 대체하지 않습니다.

### Unity 프로젝트

Hub에서 로그인·라이선스를 활성화하고 `ProjectSettings/ProjectVersion.txt`의 정확한 Editor·빌드 모듈을 설치합니다. Unity Android SDK·NDK·OpenJDK는 Hub 모듈을 우선하며 Flutter용 경로로 덮어쓰지 않습니다. External Tools에서 VS Code를 선택하고 Microsoft Unity 확장을 연동합니다. 컴파일·Play Mode·대상 빌드를 확인합니다. [Unity Hub 문서](https://docs.unity.com/en-us/hub).

### 완료 판단

사용하는 프로젝트의 실행·테스트·빌드와 Android 실기기·Docker 서비스 접속을 확인하고 `git diff`로 의도치 않은 버전·잠금 파일 변경을 점검합니다. 환경 변수·외부 서비스·서명 자격증명은 별도 복원이 필요할 수 있습니다.

## OS·앱·관리 도구 업데이트

초기 설치와 분리해 진행합니다. 먼저 작업·데이터·개인 설정과 도구 버전을 보관하고 Windows Update를 적용합니다. 전체 `winget upgrade --all`보다 사용할 도구를 개별 확인합니다. 아래는 개인 PC PowerShell 기준이며 설치기가 요구할 때만 관리자 권한을 사용합니다.

| 도구 | 갱신·복귀 안내 |
| :--- | :--- |
| Git·VS Code | `winget upgrade --id Git.Git -e`, `winget upgrade --id Microsoft.VisualStudioCode -e`; 확장은 Extensions에서 갱신 |
| nvm·Node | [nvm](../01.Tools/nvm.md#업데이트복귀제거): nvm-windows 설치 프로그램과 Node 버전 변경 구분 |
| uv | 독립 설치는 `uv self update`; [uv](../01.Tools/uv.md) |
| FVM | 공식 Windows 독립 패키지로 실행 파일 교체. SDK 캐시·.fvmrc 유지; [FVM](../01.Tools/fvm.md#업데이트와-되돌리기) |
| Rust | 관리 도구는 `rustup self update`; 툴체인·crate 변경은 [rustup](../01.Tools/rustup.md#6-업데이트검증복귀) |
| C++ Build Tools·SDK | Visual Studio Installer로 갱신하고 새 빌드 디렉터리에서 검증 |
| Codex·Ponytail | npm 설치는 현재 Node에서 `npm install -g @openai/codex@latest`; [업데이트·복귀](../01.Tools/codex.md#codex-cli-업데이트복귀) |
| Android Studio·SDK·Unity Hub | 앱과 SDK Manager·공식 배포 경로에서 갱신. 기존 프로젝트 SDK는 유지 |
| Docker Desktop·WSL | 앱·공식 배포판, WSL은 `wsl --update`. 볼륨 백업 후 엔진·context·통합·프로젝트 검증; [Docker](../01.Tools/docker.md) |

관리 도구 갱신과 프로젝트 의존성·SDK 갱신을 구분합니다. Node·Python·Flutter·Rust는 새 버전으로 별도 검증한 뒤 버전 파일·CI·잠금 파일을 변경합니다. Unity Editor도 새 버전을 추가 설치해 복사본·별도 브랜치에서 검증하며 복귀 시 이전 Editor와 프로젝트 파일을 함께 복원합니다. Docker DB 데이터는 이미지 버전만 낮춘다고 복원되지 않습니다.

공식 설치 경로·지원 조건과 새 폰트·Codex 절차 확인일: 2026-10-30. Windows 실제 설치·PowerShell 실행·WSL·USB 연결·프로젝트 복원은 이 문서 작성 환경에서 검증하지 않았습니다.
