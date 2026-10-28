<!-- version: v1.1.0 -->
# macOS 공통 개발 도구 설정

확인일: 2026-10-28. 먼저 [Apple Silicon](./macOS_AppleSilicon_Dev_Setting.md) 또는 [Intel](./macOS_Intel_Dev_Setting.md)의 기본 설치를 완료합니다.

## 복원 원칙

- 기존 프로젝트의 README, 버전 파일, 잠금 파일, 빌드 설정을 우선합니다. 환경 복원 중 의존성 업그레이드나 잠금 파일 재생성은 하지 않습니다.
- Node.js는 nvm, Python은 uv와 프로젝트별 `.venv`, Flutter는 FVM, Rust는 rustup, Unity는 Hub로 버전을 관리합니다.
- React·TypeScript·Electron은 프로젝트 의존성으로 설치합니다. 전역 TypeScript나 별도의 React 설치는 필요하지 않습니다.
- 아래 명령은 해당 프로젝트의 루트에서 실행합니다. 프로젝트별 명령이 다르면 README를 따릅니다.

## 1. VS Code와 기본 도구

```bash
brew install --cask visual-studio-code
brew install uv cmake pkgconf
```

VS Code 명령 팔레트에서 `Shell Command: Install 'code' command in PATH`를 실행하고 새 터미널에서 `code --version`을 확인합니다.

필요한 작업에 맞춰 확장을 설치합니다.

| 작업 | 확장 |
| :--- | :--- |
| TypeScript·React·Electron | ESLint, Prettier |
| Python | Python, Python Debugger |
| Flutter | Flutter (Dart 확장 포함) |
| C/C++ | C/C++, CMake Tools |
| Rust | rust-analyzer |
| Unity | Unity (Microsoft) |
| 컨테이너 개발 | Dev Containers (필요할 때) |

포맷터와 린터는 프로젝트 설정을 우선합니다. [VS Code macOS 설치 안내](https://code.visualstudio.com/docs/setup/mac)

## 2. Node.js: nvm + npm

nvm은 [공식 설치 스크립트](https://github.com/nvm-sh/nvm#installing-and-updating)로 설치합니다. Homebrew의 Node.js를 별도로 설치하지 않습니다.

```bash
touch ~/.zshrc
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | PROFILE="$HOME/.zshrc" bash
source ~/.zshrc
command -v nvm
nvm install --lts
node --version
npm --version
```

설치 스크립트가 `~/.zshrc`에 nvm 초기화 설정을 추가합니다. 인식되지 않으면 새 터미널을 열어 확인합니다.

### 기존 TypeScript·React·Electron·서버 프로젝트

`.nvmrc`가 있으면 다음을 실행합니다.

```bash
nvm install
nvm use
```

없으면 README, `package.json`의 `engines`, CI 설정에서 요구 Node.js 버전을 확인해 `nvm install 버전`과 `nvm use 버전`으로 맞춥니다. 지정이 없는 프로젝트에만 LTS를 사용하고 실행·빌드로 호환성을 확인합니다. 디렉터리 이동만으로 nvm 버전이 자동 전환되지는 않습니다.

`package-lock.json`이 있으면:

```bash
npm ci
npm run
```

잠금 파일이 없는 npm 프로젝트는 `npm install`을 사용합니다. `npm run`에 표시된 개발·테스트·빌드 스크립트를 실행합니다. 다른 패키지 관리자의 잠금 파일이 있는 저장소는 임의로 npm으로 변환하지 않습니다.

Electron 네이티브 모듈은 Node.js뿐 아니라 Electron ABI와 CPU 아키텍처에 맞아야 합니다. 프로젝트의 `postinstall` 또는 rebuild 절차를 따릅니다. Windows·Linux 패키징은 해당 프로젝트의 CI·빌드 문서를 따르며 Docker만으로 모든 대상의 빌드를 보장하지 않습니다.

## 3. Python: uv + 프로젝트별 가상환경

`uv --version`으로 설치를 확인합니다. uv는 Python 자체 버전을 관리하고, `.venv`는 프로젝트 패키지를 격리합니다. 시스템 Python과 전역 pip는 변경하지 않습니다.

### uv 프로젝트 (`pyproject.toml` + `uv.lock`)

```bash
uv sync --locked
uv run python --version
```

`.python-version`, `requires-python`, 잠금 파일에 따라 환경을 복원합니다. `--locked`가 실패하면 Python 조건과 잠금 파일의 일관성을 확인하며, 복원을 위해 임의로 `uv lock`을 실행하지 않습니다.

### 기존 requirements.txt 또는 venv 프로젝트

README에서 Python 버전을 확인한 뒤 해당 버전을 설치합니다. 다음은 **Python 3.12가 필요한 프로젝트의 예시**입니다.

```bash
uv python install 3.12
uv venv --python 3.12 .venv
source .venv/bin/activate
uv pip install -r requirements.txt
python --version
deactivate
```

표준 venv·pip 절차가 필요한 프로젝트는 uv로 설치한 Python 경로를 `uv python find 3.12`로 확인해 해당 실행 파일로 `-m venv .venv`를 실행합니다. 활성화 후 `python -m pip`를 사용합니다. 기존 `.venv`는 다른 PC에서 복사하지 않습니다.

VS Code의 `Python: Select Interpreter`에서 프로젝트 `.venv`를 선택합니다. 새 프로젝트의 버전 고정은 `uv python pin 버전`으로 하되, 기존 프로젝트 설정을 덮어쓰지 않습니다.

공식 안내: [Python 버전 관리](https://docs.astral.sh/uv/guides/install-python/), [프로젝트 복원](https://docs.astral.sh/uv/guides/projects/). 상세 사용법은 [UV 가이드](../01.Tools/uv.md), [venv 가이드](../01.Tools/venv.md)를 참고합니다.

## 4. Flutter: FVM + Android·iOS 실기기

### FVM과 프로젝트 SDK

[FVM 공식 설치 안내](https://fvm.app/documentation/getting-started/installation)에 따라 설치합니다.

```bash
curl -fsSL https://fvm.app/install.sh | bash
```

설치 결과의 PATH 안내를 적용하고 새 터미널에서 `fvm --version`을 확인합니다.

기존 `.fvmrc`가 있는 프로젝트는:

```bash
fvm install
fvm flutter --version
fvm flutter pub get
```

FVM을 사용하지 않던 프로젝트는 README·CI·기존 개발 환경에서 사용하던 Flutter 버전을 확인한 뒤 `fvm use 버전`으로 지정합니다. `pubspec.yaml`의 Dart SDK 범위만으로 정확한 Flutter 버전을 알 수는 없습니다. 버전 변경은 별도로 검증합니다.

`.fvmrc`는 버전 관리하고 SDK 캐시인 `.fvm/`은 Git에서 제외합니다. VS Code에서 Flutter SDK 경로를 프로젝트의 `.fvm/flutter_sdk`로 지정합니다. 이후 CLI는 `fvm flutter`와 `fvm dart`를 사용합니다.

### Android

1. [Android Studio](https://developer.android.com/studio)를 칩에 맞게 설치합니다. 코드는 VS Code에서 작성하고 Android Studio는 SDK 관리에 사용합니다.
2. SDK Manager에서 프로젝트에 필요한 Android SDK Platform, Build-Tools, Command-line Tools와 Platform-Tools를 설치합니다. NDK·CMake는 프로젝트 또는 플러그인이 요구할 때 해당 버전을 추가합니다.
3. AVD와 에뮬레이터 시스템 이미지는 설치하지 않습니다. 설치 마법사의 다운로드 목록에서도 제외합니다.
4. 기기에서 개발자 옵션·USB 디버깅을 켜고 USB로 연결한 뒤 기기의 연결 허용 창을 승인합니다.

```bash
fvm flutter doctor --android-licenses
fvm flutter doctor -v
fvm flutter devices
```

Android Studio의 포함 JDK를 우선 사용합니다. 기존 Gradle·Android Gradle Plugin이 호환되지 않으면 프로젝트 요구 JDK를 별도로 선택합니다. SDK가 탐지되지 않을 때만 `fvm flutter config --android-sdk "$HOME/Library/Android/sdk"`로 실제 설치 경로를 지정합니다.

[Flutter Android 실기기 설정](https://docs.flutter.dev/platform-integration/android/setup)

### iOS

1. 프로젝트와 macOS에서 지원하는 Xcode를 설치합니다. Command Line Tools만으로는 iOS 개발이 되지 않습니다.
2. Xcode를 한 번 열어 필수 구성요소를 설치합니다. iOS 플랫폼 지원은 필요하지만 Simulator 런타임은 사전 설치하지 않습니다.
3. 아래 명령으로 사용할 Xcode를 지정하고 초기 설정과 라이선스 확인을 진행합니다.

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
sudo xcodebuild -license
brew install cocoapods
```

기존 프로젝트에 `Gemfile`이 있으면 CocoaPods는 해당 Ruby·Bundler 버전을 따릅니다. 시스템 Ruby에 `sudo gem install`하는 방식은 기본 절차에서 제외합니다.

iPhone을 연결하고 컴퓨터 신뢰·Developer Mode를 설정합니다. 실기기 실행 시 Xcode에서 개발 계정과 프로젝트 Signing Team을 선택하고 서명을 구성합니다. 계정·인증서는 문서에 기록하지 않습니다.

```bash
fvm flutter doctor -v
fvm flutter devices
```

목록의 기기 ID로 `fvm flutter run -d 기기ID`를 실행합니다. iOS 서명과 플러그인 빌드까지 성공해야 복원이 완료됩니다. 시뮬레이터가 필요해지면 Xcode에서 런타임을 별도로 추가합니다.

[Flutter iOS 실기기 설정](https://docs.flutter.dev/platform-integration/ios/setup)

## 5. C/C++, Rust, Unity C#

### C/C++

Command Line Tools의 Clang과 앞서 설치한 CMake·pkgconf를 사용합니다. `CMakePresets.json`과 프로젝트의 툴체인·라이브러리 설치 절차를 우선합니다. 프리셋이 없는 일반적인 CMake 프로젝트의 예시는 다음과 같습니다.

```bash
cmake -S . -B build
cmake --build build
```

다른 칩에서 생성한 CMake 캐시·빌드 디렉터리는 재사용하지 않습니다. Intel 전용 라이브러리 때문에 실패하면 의존성의 아키텍처부터 확인합니다.

### Rust

[Rust 공식 안내](https://rust-lang.org/tools/install/)에 따라 rustup으로 설치합니다.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup show
```

프로젝트의 `rust-toolchain.toml` 또는 `rust-toolchain`을 우선합니다. 잠금 파일이 있는 기존 프로젝트에서:

```bash
cargo build --locked
cargo test --locked
```

### Unity C#

[Unity Hub](https://unity.com/download)를 설치하고 로그인·라이선스를 활성화합니다. 프로젝트의 `ProjectSettings/ProjectVersion.txt`에 기록된 정확한 Editor 버전을 Hub에서 설치합니다. 프로젝트를 최신 Editor로 자동 업그레이드하지 않습니다.

빌드 대상에 필요한 모듈만 추가합니다. Unity Android 개발에 쓰는 SDK·NDK·OpenJDK는 해당 Editor의 Hub 모듈을 우선하며 Flutter용 경로로 일괄 덮어쓰지 않습니다. iOS는 Xcode도 필요합니다.

Unity의 External Tools에서 VS Code를 외부 에디터로 선택하고 Microsoft Unity 확장의 요구 조건에 맞춰 연동합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다. 확장·프로젝트가 요구하면 해당 SDK를 추가합니다.

확인은 프로젝트 열기 → 컴파일 오류 확인 → Play Mode → 필요한 대상 빌드 순으로 진행합니다. [Unity Hub 문서](https://docs.unity.com/en-us/hub)

## 6. Docker Desktop: 필요한 프로젝트에만 사용

[공식 Mac 설치 페이지](https://docs.docker.com/desktop/setup/install/mac-install/)에서 칩에 맞는 Docker Desktop을 설치합니다. Docker Desktop을 실행해 초기 설정을 끝내고 엔진이 준비될 때까지 기다립니다. CLI만 설치해서는 로컬 컨테이너를 실행할 수 없습니다.

```bash
docker version
docker compose version
docker run --rm hello-world
```

프로젝트에 Compose 설정이 있으면 README에 따라 환경 변수 파일을 준비하고 실행합니다.

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=100
```

중지는 `docker compose down`으로 합니다. 데이터가 필요하면 볼륨을 삭제하는 `down -v`는 사용하지 않습니다. 컨테이너 셸 연결은 `docker compose exec 서비스명 sh`로 진행합니다.

Apple Silicon에서는 arm64 또는 멀티 아키텍처 이미지를 우선합니다. amd64 전용 이미지는 필요할 때만 `--platform linux/amd64`를 사용하며, 에뮬레이션으로 실행·빌드가 모두 보장되지는 않습니다. 호스트의 `node_modules`·`.venv`를 컨테이너에서 재사용하지 않습니다.

Dev Containers 설정이 있는 프로젝트는 VS Code에서 해당 설정을 재사용합니다. 상세 구성은 [Docker 개발 환경 문서](../04.Servers/docker-server/guides/docker_container_setup.md)를 참고합니다.

## 7. Codex CLI

Node 버전 전환과 별개로 사용할 수 있도록 [OpenAI 공식 안내](https://learn.chatgpt.com/docs/codex/cli)의 독립 설치 방식을 사용합니다.

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

설치 안내에 따라 PATH를 적용하고 새 터미널에서 확인합니다.

```bash
codex --version
codex
```

처음 실행할 때 안내에 따라 인증합니다. API 키나 토큰을 셸 설정·저장소에 직접 기록하지 않습니다. 기존 npm 설치를 유지하려면 `npm install -g @openai/codex`도 가능하지만 nvm의 Node 버전에 따라 전역 패키지 설치 위치가 달라집니다. 두 설치 방식을 중복 적용하지 않습니다.

## 8. 복원 완료 확인

설치 명령의 성공뿐 아니라 사용하는 기존 프로젝트로 확인합니다.

- [ ] 새 터미널과 VS Code 통합 터미널에서 nvm·uv·fvm·codex가 인식된다.
- [ ] TypeScript·React·서버: Node 버전 선택, npm 의존성 복원, 개발 실행·테스트·빌드가 성공한다.
- [ ] Electron: 앱 실행과 필요한 대상의 패키징이 성공한다.
- [ ] Python: 프로젝트 Python 버전과 `.venv`가 맞고 실행·테스트가 성공한다.
- [ ] Flutter: 프로젝트 SDK로 Android·iOS 실기기가 탐지되고 각각 앱이 실행된다.
- [ ] C/C++·Rust·Unity: 실제 사용하는 프로젝트가 빌드·실행된다.
- [ ] Docker 사용 프로젝트: 엔진과 서비스가 실행되고 터미널에서 접속된다.
- [ ] 복원 과정에서 버전 파일·잠금 파일이 의도치 않게 변경되지 않았다 (`git diff` 확인).

프로젝트의 로컬 환경 변수·외부 서비스·서명 자격증명은 별도 복원이 필요할 수 있습니다. 초기 도구 설치만으로 모든 과거 프로젝트의 호환성을 보장하지는 않습니다.

## 9. 도구와 프로젝트 업데이트

도구 자체 업데이트와 프로젝트의 런타임·SDK·의존성 변경은 별도로 진행합니다. 프로젝트 변경은 작업 내용을 커밋하거나 백업한 뒤 별도 브랜치에서 수행합니다. 업데이트 전 버전을 기록하고 기존 버전은 새 환경의 실행·테스트·빌드를 확인한 뒤 정리합니다.

### VS Code·확장·C/C++ 도구

VS Code의 **Check for Updates**로 앱을 업데이트합니다. Homebrew로 설치한 앱을 직접 관리하려면 `brew upgrade --cask visual-studio-code`를 사용합니다. 확장은 Extensions 화면에서 업데이트하고, 프로젝트의 포맷·진단 결과가 달라지는지 확인합니다.

CMake·pkgconf는 `brew update` 후 `brew upgrade cmake pkgconf`로 갱신합니다. Clang은 Command Line Tools 또는 Xcode 업데이트에 포함됩니다. 컴파일러 변경 후에는 별도의 빌드 디렉터리에서 구성·빌드해 기존 캐시와 구분합니다.

### nvm·Node.js·npm

nvm 자체는 설치 절의 공식 설치 스크립트를 다시 실행한 뒤 새 터미널에서 `nvm --version`으로 확인합니다. 실행 전 공식 README에서 설치 스크립트의 최신 릴리스 태그를 확인합니다.

Node.js는 기존 버전을 덮어쓰기보다 새 버전을 설치해 시험합니다.

```bash
nvm current
nvm ls
nvm install --lts
node --version
npm --version
```

특정 프로젝트는 목표 버전을 정해 `nvm install 버전`과 `nvm use 버전`으로 전환합니다. 통과하면 `.nvmrc`와 CI의 버전을 함께 변경합니다. 실패하면 `nvm use 이전버전`으로 돌아가 의존성을 다시 복원합니다. 새 셸의 기본값도 바꾸려면 `nvm alias default 버전`을 사용합니다.

npm은 Node.js와 함께 제공되는 버전을 우선합니다. npm만 변경해야 하면 현재 Node.js와 호환되는 버전을 확인한 뒤 `npm install -g npm@버전`으로 설치합니다. nvm에서는 `sudo npm`을 사용하지 않습니다.

TypeScript·React·Electron 의존성 변경은 별도 작업입니다. `npm outdated`로 확인하고, 허용 범위 내 업데이트는 `npm update`, 특정 패키지의 목표 버전은 `npm install 패키지@버전`으로 적용합니다. `package.json`·`package-lock.json`의 변경을 함께 검토하고 실행·테스트·빌드를 확인합니다. 메이저 버전은 해당 도구의 마이그레이션 안내를 따릅니다.

### uv·Python·가상환경

이 문서에서는 uv를 Homebrew로 설치했으므로 아래 방식으로 갱신합니다. 이 설치 방식에서는 `uv self update`를 사용하지 않습니다. [uv 업데이트 안내](https://docs.astral.sh/uv/getting-started/installation/#upgrading-uv)

```bash
brew update
brew upgrade uv
uv --version
```

Python은 목표 버전을 `uv python install 버전`으로 추가합니다. 기존 uv 프로젝트는 `.python-version`을 `uv python pin 버전`으로 변경하고 `requires-python`과 CI도 검토한 뒤 `uv sync`로 환경을 맞춥니다. 기존 `.venv`가 새 버전과 맞지 않으면 환경 재생성이 필요합니다. 가상환경 내부에 소스나 데이터를 보관하지 않습니다.

venv·requirements.txt 프로젝트는 새 Python으로 별도의 가상환경을 만들고 기존 요구사항을 설치해 확인합니다. 표준 pip를 사용하는 환경에서 pip 자체 업데이트가 필요하면 해당 가상환경을 활성화한 뒤 `python -m pip install --upgrade pip`를 실행합니다.

uv 패키지 업데이트는 `uv lock --upgrade-package 패키지명` 후 `uv sync`로 적용하고 `uv.lock` 변경을 검토합니다. 전체 의존성 변경이 목적일 때만 `uv lock --upgrade`를 사용합니다. Python 버전 변경과 패키지 일괄 업데이트를 동시에 하지 않으면 실패 원인을 좁히기 쉽습니다.

### FVM·Flutter·Android·iOS

FVM 자체는 설치 절의 스크립트를 다시 실행해 갱신하고 `fvm --version`을 확인합니다. 프로젝트 Flutter SDK는 캐시 내부에서 `flutter upgrade`로 변경하는 대신 **목표 버전**을 선택해 전환합니다.

```bash
fvm list
```

현재 `.fvmrc`의 버전을 기록한 뒤 `fvm use 목표버전`을 실행하고 아래를 확인합니다.

```bash
fvm flutter pub get
fvm flutter doctor -v
fvm flutter analyze
fvm flutter test
fvm flutter devices
```

Android·iOS 실기기 실행과 빌드를 모두 확인한 뒤 `.fvmrc`·`pubspec.lock` 등 변경을 검토합니다. 문제가 있으면 `fvm use 이전버전`으로 전환하고 의존성 파일의 변경도 되돌립니다. 패키지만 갱신할 때는 `fvm flutter pub outdated`로 확인하고 `fvm flutter pub upgrade`를 사용합니다. [Flutter 업데이트·마이그레이션 안내](https://docs.flutter.dev/install/upgrade)

Android Studio는 앱의 업데이트 확인 기능으로, Android SDK는 SDK Manager에서 필요한 버전을 추가합니다. 기존 프로젝트용 SDK·NDK를 먼저 삭제하지 않습니다. JDK·Gradle·Android Gradle Plugin은 호환되는 조합으로 변경합니다. 업데이트 시에도 AVD·시스템 이미지는 필요할 때만 설치합니다.

Xcode는 설치했던 App Store 또는 Apple Developer 배포 경로에서 갱신합니다. 갱신 후 Xcode를 열고 설치 절의 `xcode-select`, `xcodebuild -runFirstLaunch`, 라이선스 절차를 확인한 뒤 실기기 연결·서명을 점검합니다. Simulator 런타임은 선택 설치합니다.

Homebrew CocoaPods는 `brew upgrade cocoapods`로 갱신합니다. `Gemfile`로 관리하는 프로젝트는 해당 Ruby·Bundler 환경에서 `bundle update cocoapods`로 목표 변경을 검토합니다. `Podfile.lock`을 삭제해 강제로 전체 갱신하지 않습니다.

### Rust

```bash
rustup self update
rustup update stable
rustup show
```

rustup 자체와 stable 툴체인을 갱신합니다. 특정 버전에 고정된 프로젝트는 그대로 유지되므로, 변경이 필요하면 `rust-toolchain.toml` 또는 `rust-toolchain`의 목표 버전과 CI를 함께 수정합니다. 이후 `cargo build --locked`와 `cargo test --locked`로 확인합니다. 크레이트 갱신은 별도 작업으로 `cargo update`를 사용하고 `Cargo.lock` 변경을 검토합니다. [rustup 업데이트 안내](https://rust-lang.github.io/rustup/basics.html)

### Unity Hub·Editor

Hub 앱의 업데이트 안내로 Hub 자체를 갱신합니다. Editor는 Hub에서 새 버전을 **추가 설치**하고 프로젝트 복사본 또는 별도 브랜치로 열어 업그레이드를 확인합니다. 대상 플랫폼 모듈도 해당 Editor 버전으로 추가합니다.

컴파일·Play Mode·대상 빌드가 통과한 뒤 `ProjectVersion.txt`, `Packages/manifest.json`, `Packages/packages-lock.json` 등 변경을 검토합니다. 이전 Editor로 돌아갈 때는 업그레이드 전 프로젝트 상태도 복원합니다. 새 Editor로 변환한 프로젝트를 이전 Editor에서 그대로 여는 방식은 피합니다.

### Docker Desktop·이미지

Docker Desktop 앱의 업데이트 확인 기능으로 갱신하거나 공식 설치 페이지에서 해당 칩의 새 버전을 설치합니다. 엔진 재시작으로 실행 중인 컨테이너가 중단될 수 있으므로 작업을 저장하고 중요한 볼륨 데이터는 백업합니다. 갱신 후 `docker version`과 `docker compose version`을 확인합니다.

컨테이너 이미지 업데이트는 Desktop 업데이트와 별개입니다. 프로젝트가 의도한 이미지 태그·digest와 변경 내용을 확인한 뒤:

```bash
docker compose pull
docker compose up -d --build
docker compose ps
docker compose logs --tail=100
```

위 pull은 Compose의 이미지 기반 서비스에 적용됩니다. 로컬 Dockerfile의 베이스 이미지도 갱신하려면 `docker compose build --pull` 후 `docker compose up -d`로 재생성합니다. DB 이미지 변경 전에는 데이터 호환성과 복원 절차를 확인합니다. 볼륨을 지워 업데이트하지 않습니다. 이전 이미지로 되돌려도 DB 데이터 마이그레이션이 자동 취소되지는 않습니다.

### Codex CLI

독립 설치 방식은 설치 스크립트를 다시 실행해 업데이트합니다. [OpenAI 공식 업데이트 안내](https://learn.chatgpt.com/docs/codex/cli)

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex --version
```

npm으로 설치한 경우에는 해당 설치가 있는 nvm Node 환경에서 `npm install -g @openai/codex@latest`를 사용합니다. 업데이트 후 새 세션에서 실행을 확인합니다.

### 업데이트 완료 확인

새 터미널과 VS Code를 열어 도구 버전을 확인하고, 앞 절의 **복원 완료 확인** 목록에서 업데이트한 도구에 해당하는 프로젝트를 검증합니다. 버전·잠금 파일의 변경을 검토하고 성공한 변경만 저장합니다. OS·SDK·데이터 형식 변경은 단순히 실행 파일 버전을 낮추는 것만으로 복구되지 않을 수 있습니다.

## Rust・C/C++ 버전 관리 상세

설치 후 프로젝트별 선택·고정·업데이트·복귀는 [rustup 가이드](../01.Tools/rustup.md)와 [C/C++ 툴체인 가이드](../01.Tools/cpp-toolchain.md)를 따릅니다.
