<!-- version: v1.0.0 -->
# Windows 개발 환경 복원·업데이트

확인일: 2026-10-28. Windows 11 x64·PowerShell·Windows 네이티브 개발을 기준으로 합니다. ARM Windows는 각 도구·네이티브 모듈·Unity의 지원 여부를 별도 확인합니다. Linux 서버 환경이 필요한 작업은 WSL2 또는 Docker로 구분합니다.

## 1. Windows·Git·VS Code·빌드 도구

Windows Update로 지원되는 업데이트를 적용하고 필요한 재시작을 완료합니다. 대규모 OS 변경 전 작업과 데이터를 백업합니다. App Installer가 제공하는 `winget --version`을 확인합니다.

```powershell
winget install --id Git.Git -e --source winget
winget install --id Microsoft.VisualStudioCode -e --source winget
winget install --id Microsoft.VisualStudio.2022.BuildTools -e --source winget
```

Visual Studio Installer에서 **Desktop development with C++** 워크로드와 프로젝트에 맞는 Windows SDK·MSVC·CMake 도구를 선택합니다. Build Tools 설치 명령만으로 워크로드가 모두 구성되지는 않습니다. C/C++·Rust MSVC·Electron 네이티브 모듈에 필요합니다.

새 PowerShell에서 `git --version`, `code --version`을 확인합니다. C/C++는 Developer PowerShell에서 프로젝트 CMake 프리셋을 사용합니다. 일반 CMake 프로젝트는 `cmake -S . -B build`, `cmake --build build --config Debug`로 확인합니다.

VS Code 확장은 ESLint·Prettier·Python·Flutter·C/C++·CMake Tools·rust-analyzer·Unity 중 필요한 것만 설치합니다. 앱은 업데이트 기능 또는 `winget upgrade --id Microsoft.VisualStudioCode -e`로, 확장은 Extensions 화면에서 갱신합니다. Git은 `winget upgrade --id Git.Git -e`, MSVC·SDK는 Visual Studio Installer로 업데이트합니다. 전체 `winget upgrade --all`보다 대상별 업데이트를 우선합니다.

## 2. Node.js: nvm-windows + npm

[nvm-windows 공식 Releases](https://github.com/coreybutler/nvm-windows/releases)에서 설치 프로그램을 내려받습니다. 기존 단독 Node.js가 있다면 필요한 버전·전역 패키지를 기록하고 공식 마이그레이션 안내에 따라 정리합니다. 기존 Node 설치 경로와 NVM의 심볼릭 링크 경로가 충돌하지 않도록 합니다. [Microsoft Node.js 안내](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)

새 PowerShell에서 확인합니다. 버전 전환이 권한을 요구하면 관리자 PowerShell을 사용합니다.

```powershell
nvm version
nvm list available
nvm install lts
nvm list
```

설치된 정확한 버전을 `nvm use 버전`으로 선택한 뒤 `node --version`, `npm --version`을 확인합니다. 기존 프로젝트는 `.nvmrc`·README·engines·CI의 버전을 직접 확인해 설치·선택합니다. **nvm-windows는 Unix nvm과 별개이며 `nvm alias default`나 `.nvmrc` 자동 적용을 전제하지 않습니다.** 버전 전환은 다른 Windows 셸에도 영향을 줄 수 있습니다.

nvm-windows 자체는 공식 새 설치 프로그램으로 갱신합니다. Node는 `nvm install 목표버전`, `nvm use 목표버전`으로 추가·검증합니다. 문제 발생 시 `nvm use 이전버전`으로 돌아갑니다. 검증 후 프로젝트 버전 파일과 CI를 함께 변경합니다.

PowerShell에서 npm.ps1 실행이 정책으로 차단되면 `npm.cmd`를 사용합니다. 조직의 실행 정책을 전역 해제하지 않습니다.

## 3. uv·FVM·Rust·Codex CLI

### uv

[uv 공식 PowerShell 설치 안내](https://docs.astral.sh/uv/getting-started/installation/)를 사용합니다.

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

설치 결과의 사용자 PATH 안내를 적용하고 새 터미널에서 `uv --version`을 확인합니다. 위 실행 정책 옵션은 설치 프로세스에 한정합니다. 독립 설치한 uv는 `uv self update`로 갱신합니다.

가상환경 활성화는 `..venvScriptsActivate.ps1`, 종료는 `deactivate`입니다. 정책 때문에 활성화할 수 없으면 uv 명령 또는 `..venvScriptspython.exe`를 직접 사용합니다. 시스템 Python을 변경하지 않습니다.

### FVM

[FVM 공식 설치 페이지](https://fvm.app/documentation/getting-started/installation)에서 연결된 공식 Releases의 Windows·CPU에 맞는 독립 패키지를 사용합니다. 사용자 쓰기 권한이 있는 경로에 압축을 풀고 실행 파일이 있는 폴더를 사용자 PATH에 추가한 뒤 `fvm --version`을 확인합니다. 업데이트는 같은 경로의 실행 파일을 새 공식 패키지로 교체합니다.

SDK 링크 생성이 권한을 요구하면 Windows 개발자 모드의 심볼릭 링크 지원과 FVM 안내를 확인합니다. SDK 캐시와 `.fvmrc`를 업데이트 과정에서 삭제하지 않습니다.

Android 실기기 연결에 필요한 제조사 USB 드라이버는 Android Studio·기기 제조사 공식 안내로 설치합니다. SDK·Gradle 작업은 Windows에 두고 WSL의 adb·JDK와 혼용하지 않습니다.

### Rust

[Rust 공식 설치 페이지](https://rust-lang.org/tools/install/)의 Windows rustup-init을 설치하고 기본 MSVC 툴체인을 사용합니다. 앞 절의 C++ Build Tools·Windows SDK가 필요합니다. 새 터미널에서 `rustup show`로 확인합니다. 프로젝트 rust-toolchain 파일을 우선하고 `cargo build --locked`, `cargo test --locked`로 검증합니다.

### Codex CLI

선택한 Node 환경에서 npm으로 설치합니다. [OpenAI 공식 CLI 안내](https://learn.chatgpt.com/docs/codex/cli)

```powershell
npm install -g @openai/codex
codex --version
codex
```

처음 실행할 때 인증합니다. 업데이트는 `npm install -g @openai/codex@latest`입니다. nvm 전환 후 명령이 사라지면 현재 Node 환경의 전역 설치를 확인합니다. API 키·토큰을 저장소에 기록하지 않습니다.

## 4. Docker Desktop·선택적 WSL2

[Docker Desktop Windows 공식 안내](https://docs.docker.com/desktop/setup/install/windows-install/)의 Windows·가상화·WSL2 요구 조건을 확인합니다. 관리자 PowerShell에서 필요한 WSL 구성을 설치하고 재시작합니다.

```powershell
wsl --install
wsl --update
wsl --status
```

Docker Desktop Windows x64 설치 프로그램으로 설치하고 WSL2 백엔드의 Linux 컨테이너 환경으로 실행합니다. Linux 컨테이너 환경이 Windows 컨테이너 실행 환경을 대신하지는 않습니다.

WSL에서 개발할 때만 Ubuntu 등 배포판을 선택해 구성합니다. 해당 환경에서는 [Linux 문서](./Linux_Dev_Setting.md)의 nvm·uv·도구를 **WSL 안에 별도로 설치**하고, 프로젝트를 Linux 홈 파일시스템에 둡니다. Windows의 node_modules·.venv와 공유하지 않습니다. VS Code WSL 확장으로 연결하고 필요한 경우 Docker Desktop의 해당 배포판 통합을 활성화합니다. WSL의 Flutter·adb 구성은 이 문서의 Windows 실기기 절차와 별개입니다.

Windows·WSL 업데이트 후 Docker 엔진·context·프로젝트 서비스를 확인합니다. WSL 자체는 `wsl --update`로 갱신합니다.

## 프로젝트 복원과 버전 변경 원칙

기존 프로젝트의 README·CI·버전 지정·잠금 파일을 우선합니다. 초기 복원에서 의존성을 최신화하거나 잠금 파일을 재생성하지 않습니다. 다른 OS·CPU의 `node_modules`, `.venv`, 빌드 결과는 복사하지 않습니다. GitHub·SSH 사전 설정은 범위에서 제외합니다.

### TypeScript·React·Electron·서버

Node 버전을 선택한 뒤 `package-lock.json`이 있으면 `npm ci`, 없으면 npm 프로젝트임을 확인하고 `npm install`을 실행합니다. `npm run`으로 스크립트를 확인하고 프로젝트의 개발 실행·테스트·빌드를 수행합니다. TypeScript·React·Electron은 전역 설치하지 않습니다.

Electron 네이티브 모듈은 OS·CPU·Electron ABI가 맞아야 합니다. 프로젝트의 postinstall·rebuild 절차를 따르고 대상 OS 패키징도 확인합니다. 모든 OS의 실행 파일을 Docker만으로 만들 수 있다고 가정하지 않습니다.

### Python

uv 프로젝트는 `uv sync --locked` 후 `uv run python --version`으로 확인합니다. 실패하면 `.python-version`, `requires-python`, 잠금 파일 조건부터 확인합니다. 복원 목적으로 `uv lock`을 실행하지 않습니다.

requirements.txt 프로젝트는 README의 Python 버전으로 `uv python install 버전`, `uv venv --python 버전 .venv`, `uv pip install -r requirements.txt`를 실행합니다. uv는 Python 버전을, `.venv`는 패키지를 격리합니다. 표준 venv가 필요하면 `uv python find 버전`으로 찾은 실행 파일의 `-m venv .venv`를 사용합니다.

VS Code의 `Python: Select Interpreter`에서 프로젝트 `.venv`를 선택합니다. [uv Python 관리](https://docs.astral.sh/uv/guides/install-python/), [프로젝트 복원](https://docs.astral.sh/uv/guides/projects/)

### Flutter SDK와 Android 실기기

`.fvmrc`가 있으면 `fvm install` 후 `fvm flutter pub get`을 실행합니다. 없다면 기존 프로젝트가 사용하던 Flutter 버전을 README·CI에서 확인해 `fvm use 버전`으로 고정합니다. `.fvmrc`는 Git으로 관리하고 `.fvm/` SDK 캐시는 제외합니다. VS Code Flutter SDK는 `.fvm/flutter_sdk`로 지정합니다.

[Android Studio](https://developer.android.com/studio)를 설치하고 SDK Manager에서 프로젝트에 필요한 Android SDK Platform·Build-Tools·Command-line Tools·Platform-Tools를 설치합니다. JDK는 Android Studio 포함 버전을 우선하며 기존 Gradle·AGP의 호환 조건에 맞춥니다. NDK·CMake는 프로젝트가 요구할 때 해당 버전을 설치합니다. **AVD·에뮬레이터 시스템 이미지는 사전 설치하지 않습니다.**

기기의 개발자 옵션·USB 디버깅을 켜고 연결 허용 창을 승인한 뒤:

```text
fvm flutter doctor --android-licenses
fvm flutter doctor -v
fvm flutter devices
```

기기 ID로 `fvm flutter run -d 기기ID`를 실행합니다. SDK가 탐지되지 않으면 실제 경로를 `fvm flutter config --android-sdk 경로`로 지정합니다. [Flutter Android 설정](https://docs.flutter.dev/platform-integration/android/setup)

**iOS 앱의 로컬 빌드·서명·실기기 실행에는 macOS와 Xcode가 필요합니다.** Windows·Linux에서는 공통 Dart 코드를 개발하고 iOS 검증은 Mac 또는 macOS CI에서 수행합니다.

### Unity C#

[Unity Hub](https://unity.com/download)를 설치해 로그인·라이선스를 활성화합니다. `ProjectSettings/ProjectVersion.txt`에 맞는 Editor와 필요한 빌드 모듈만 설치합니다. Android SDK·NDK·JDK는 해당 Unity Editor의 Hub 모듈을 우선하며 Flutter용 경로와 혼용하지 않습니다.

외부 에디터를 VS Code로 지정하고 Microsoft Unity 확장의 요구 조건에 맞춰 연동합니다. Unity만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다. 확장·프로젝트가 요구하는 SDK가 있으면 추가합니다. 컴파일·Play Mode·대상 빌드로 확인합니다. [Hub 문서](https://docs.unity.com/en-us/hub)

## 프로젝트 의존성·SDK 업데이트

먼저 현재 버전을 기록하고 작업 내용을 커밋하거나 백업합니다. 별도 브랜치에서 하나씩 변경하며 테스트·빌드·실기기 실행으로 확인합니다. 새 환경이 검증되기 전에는 이전 런타임·SDK를 제거하지 않습니다.

| 대상 | 업데이트 방법과 확인 |
| :--- | :--- |
| npm 자체 | 현재 Node와 호환되는 버전을 확인해 `npm install -g npm@버전`. Node 기본 포함 npm을 우선 |
| TS·React·Electron | `npm outdated` 확인 → `npm update` 또는 `npm install 패키지@버전` → package.json·잠금 파일 검토 및 앱·빌드 확인 |
| Python | `uv python install 목표버전` → uv 프로젝트는 `uv python pin 목표버전`, requires-python·CI 검토 → `uv sync`. 기존 venv 프로젝트는 새 환경에서 검증 |
| Python 패키지 | `uv lock --upgrade-package 패키지명` → `uv sync`; 전체 변경이 목적일 때만 `uv lock --upgrade`. requirements.txt는 프로젝트 방식으로 갱신 |
| pip | 표준 pip 가상환경 안에서만 `python -m pip install --upgrade pip` |
| Flutter | `fvm use 목표버전` → `fvm flutter pub get`, doctor·analyze·test·실기기 빌드. SDK 캐시에서 flutter upgrade를 직접 실행하지 않음 |
| Flutter 패키지 | `fvm flutter pub outdated` → `fvm flutter pub upgrade` → pubspec.lock 검토 |
| Android Studio·SDK | 앱 업데이트 기능과 SDK Manager 사용. 프로젝트용 SDK·NDK는 유지하고 JDK·Gradle·AGP 호환성 확인 |
| Rust | `rustup self update`, `rustup update stable`. 고정 프로젝트는 rust-toolchain 파일·CI를 별도 변경 후 build·test |
| Rust 크레이트 | `cargo update` 후 Cargo.lock 검토·테스트. 초기 복원에서는 실행하지 않음 |
| Unity | Hub는 앱에서 업데이트. Editor는 새 버전을 추가 설치해 복사본·별도 브랜치로 검증. ProjectVersion·Packages 변경을 함께 검토 |

실패하면 이전 런타임·SDK와 업데이트 전 프로젝트 파일을 함께 복원합니다. Unity의 프로젝트 변환은 Editor 버전만 낮추어 되돌리지 않습니다. [Flutter 업데이트](https://docs.flutter.dev/install/upgrade), [rustup 업데이트](https://rust-lang.github.io/rustup/basics.html)

## Docker 프로젝트 사용과 업데이트

Docker Desktop을 실행하고 아래로 엔진과 CLI를 확인합니다.

```text
docker version
docker compose version
docker run --rm hello-world
```

프로젝트 환경 변수 파일을 준비하고 `docker compose up -d --build`로 시작합니다. `docker compose ps`, `docker compose logs --tail=100`으로 확인하고 `docker compose exec 서비스명 sh`로 접속합니다. 중지는 `docker compose down`입니다. 데이터를 유지해야 하면 `down -v`는 사용하지 않습니다.

Desktop 자체는 앱 업데이트 안내 또는 해당 OS 공식 설치 패키지로 갱신합니다. 엔진 재시작 전 작업을 저장하고 중요한 볼륨 데이터는 백업합니다. 앱 업데이트와 컨테이너 이미지 업데이트는 별개입니다.

이미지는 태그·digest와 호환성을 확인한 뒤 `docker compose pull`, `docker compose up -d --build`로 반영합니다. 로컬 Dockerfile의 베이스 이미지까지 갱신하려면 `docker compose build --pull` 후 재생성합니다. DB 이미지 업데이트는 데이터 마이그레이션·복원 방법을 먼저 확인합니다. 이전 이미지로 돌아가도 데이터 변경은 자동 취소되지 않습니다.

호스트의 node_modules·.venv는 컨테이너에서 재사용하지 않습니다. 기존 `.devcontainer`가 있으면 VS Code Dev Containers로 재사용합니다. [기존 Docker 구성 문서](../04.Servers/docker-server/guides/docker_container_setup.md)

## 복원·업데이트 완료 확인

- [ ] 새 터미널과 VS Code 통합 터미널에서 도구가 인식된다.
- [ ] Node·Python·Flutter·Rust·Unity 버전이 프로젝트 요구와 맞는다.
- [ ] TS·React·서버·Electron 프로젝트의 실행·테스트·빌드가 성공한다.
- [ ] Python 가상환경의 실행·테스트가 성공한다.
- [ ] Flutter Android 실기기 실행이 성공하고 iOS 검증은 Mac에서 수행한다.
- [ ] C/C++·Rust 빌드와 Unity Play Mode·대상 빌드가 성공한다.
- [ ] Docker 프로젝트가 실행되고 터미널 접속이 된다.
- [ ] `git diff`로 버전·잠금 파일의 의도치 않은 변경이 없는지 확인했다.

로컬 환경 변수·외부 서비스·서명 자격증명은 별도 복원이 필요할 수 있습니다. 업데이트 후 OS·SDK·DB 변경은 버전만 낮추어 복구되지 않을 수 있습니다.

## Rust・C/C++ 버전 관리 상세

설치 후 프로젝트별 선택·고정·업데이트·복귀는 [rustup 가이드](../01.Tools/rustup.md)와 [C/C++ 툴체인 가이드](../01.Tools/cpp-toolchain.md)를 따릅니다.
