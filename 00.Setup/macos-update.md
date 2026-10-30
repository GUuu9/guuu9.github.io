<!-- version: v1.0.0 -->
# macOS 개발 도구·프로젝트 업데이트

초기 설치 때 이 문서를 순서대로 실행하지 않습니다. [초기 설치](./macOS_Common_Dev_Setting.md) 또는 [프로젝트 복원](./macos-project-restore.md)이 끝난 환경에서 업데이트할 대상 절만 선택합니다. 도구 자체 명령은 개인 터미널의 임의 디렉터리에서, 버전 파일·의존성을 바꾸는 명령은 해당 프로젝트 루트에서 실행합니다. 예시의 목표 버전은 실제 값으로 바꿉니다.

Intel Mac의 Homebrew 제약은 [Intel 가이드](./macOS_Intel_Dev_Setting.md)를 먼저 확인합니다. 아래 brew 명령은 실행 가능한 Homebrew 설치가 있다는 전제입니다.

## 진행 전 확인

도구 자체 업데이트와 프로젝트의 런타임·SDK·의존성 변경은 별도로 진행합니다. 프로젝트 변경은 작업 내용을 커밋하거나 백업한 뒤 별도 브랜치에서 수행합니다. 업데이트 전 버전을 기록하고 기존 버전은 새 환경의 실행·테스트·빌드를 확인한 뒤 정리합니다.

## macOS·Command Line Tools·Homebrew

개인 Mac 터미널과 시스템 설정에서 수행합니다. 먼저 작업과 데이터를 백업하고 프로젝트가 요구하는 macOS·Xcode·SDK 호환성을 확인합니다. macOS는 **시스템 설정 → 일반 → 소프트웨어 업데이트**에서 지원되는 버전으로 갱신합니다. Command Line Tools는 제공되는 업데이트를 확인하며 `xcode-select --install`을 매번 업데이트하는 명령으로 사용하지 않습니다. [Apple 업데이트 안내](https://support.apple.com/en-us/108382).

Intel Mac은 [지원 범위·기존 환경 보존 안내](./macOS_Intel_Dev_Setting.md#intel-지원-범위와-버전-선택)를 먼저 읽습니다. `brew update`는 Homebrew 본체도 갱신하므로 구버전 고정 환경 보존과 함께 실행하지 않습니다. 실행 가능한 Homebrew를 유지·갱신하기로 선택한 경우에만:

```bash
brew update
brew outdated
```

필요한 패키지만 선택해 갱신합니다. 아래는 사용 중인 도구가 해당되는 경우의 예시입니다.

```bash
brew upgrade uv cmake pkgconf
brew doctor
```

전체 `brew upgrade`는 전체 패키지의 호환성을 검증할 수 있을 때만 사용합니다. 이후 `brew --prefix`, `uname -m`, `clang --version`을 확인하고, Xcode 갱신 시 아래 iOS 절의 초기화·실기기 검사를 수행합니다. Intel용 업데이트가 없는 도구를 Apple Silicon용으로 교체하지 않습니다. [Homebrew 명령 안내](https://docs.brew.sh/Manpage).

## VS Code·확장·C/C++ 도구

VS Code의 **Check for Updates**로 앱을 업데이트합니다. Homebrew로 설치한 앱을 직접 관리하려면 `brew upgrade --cask visual-studio-code`를 사용합니다. 확장은 Extensions 화면에서 업데이트하고, 프로젝트의 포맷·진단 결과가 달라지는지 확인합니다.

CMake·pkgconf는 `brew update` 후 `brew upgrade cmake pkgconf`로 갱신합니다. Clang은 Command Line Tools 또는 Xcode 업데이트에 포함됩니다. 컴파일러 변경 후에는 별도의 빌드 디렉터리에서 구성·빌드해 기존 캐시와 구분합니다.

## nvm·Node.js·npm

nvm 자체는 [초기 설치 가이드](./macOS_Common_Dev_Setting.md)의 공식 설치 스크립트를 다시 실행한 뒤 새 터미널에서 `nvm --version`으로 확인합니다. 실행 전 공식 README에서 설치 스크립트의 최신 릴리스 태그를 확인합니다.

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

## uv·Python·가상환경

uv를 Homebrew로 설치한 경우 아래 방식으로 갱신합니다. 다른 방식으로 설치했다면 [uv 가이드](../01.Tools/uv.md)의 해당 업데이트 절차를 사용합니다. 이 설치 방식에서는 `uv self update`를 사용하지 않습니다. [uv 업데이트 안내](https://docs.astral.sh/uv/getting-started/installation/#upgrading-uv)

```bash
brew update
brew upgrade uv
uv --version
```

Python은 목표 버전을 `uv python install 버전`으로 추가합니다. 기존 uv 프로젝트는 `.python-version`을 `uv python pin 버전`으로 변경하고 `requires-python`과 CI도 검토한 뒤 `uv sync`로 환경을 맞춥니다. 기존 `.venv`가 새 버전과 맞지 않으면 환경 재생성이 필요합니다. 가상환경 내부에 소스나 데이터를 보관하지 않습니다.

venv·requirements.txt 프로젝트는 새 Python으로 별도의 가상환경을 만들고 기존 요구사항을 설치해 확인합니다. 표준 pip를 사용하는 환경에서 pip 자체 업데이트가 필요하면 해당 가상환경을 활성화한 뒤 `python -m pip install --upgrade pip`를 실행합니다.

uv 패키지 업데이트는 `uv lock --upgrade-package 패키지명` 후 `uv sync`로 적용하고 `uv.lock` 변경을 검토합니다. 전체 의존성 변경이 목적일 때만 `uv lock --upgrade`를 사용합니다. Python 버전 변경과 패키지 일괄 업데이트를 동시에 하지 않으면 실패 원인을 좁히기 쉽습니다.

## FVM·Flutter·Android·iOS

FVM 자체는 [초기 설치 가이드](./macOS_Common_Dev_Setting.md)의 스크립트를 다시 실행해 갱신하고 `fvm --version`을 확인합니다. 프로젝트 Flutter SDK는 캐시 내부에서 `flutter upgrade`로 변경하는 대신 **목표 버전**을 선택해 전환합니다.

```bash
fvm list
```

사용 중인 Intel MacBook은 Flutter 3.35.7 고정 기준을 유지합니다. OS·Xcode·프로젝트 호환성을 확인해 고정을 변경하기로 한 경우에만 전환합니다. 현재 `.fvmrc`의 버전을 기록한 뒤 `fvm use 목표버전`을 실행하고 아래를 확인합니다.

```bash
fvm flutter pub get
fvm flutter doctor -v
fvm flutter analyze
fvm flutter test
fvm flutter devices
```

Android·iOS 실기기 실행과 빌드를 모두 확인한 뒤 `.fvmrc`·`pubspec.lock` 등 변경을 검토합니다. 문제가 있으면 `fvm use 이전버전`으로 전환하고 의존성 파일의 변경도 되돌립니다. 패키지만 갱신할 때는 `fvm flutter pub outdated`로 확인하고 `fvm flutter pub upgrade`를 사용합니다. [Flutter 업데이트·마이그레이션 안내](https://docs.flutter.dev/install/upgrade)

Android Studio는 앱의 업데이트 확인 기능으로, Android SDK는 SDK Manager에서 필요한 버전을 추가합니다. 기존 프로젝트용 SDK·NDK를 먼저 삭제하지 않습니다. JDK·Gradle·Android Gradle Plugin은 호환되는 조합으로 변경합니다. 업데이트 시에도 AVD·시스템 이미지는 필요할 때만 설치합니다.

Xcode는 설치했던 App Store 또는 Apple Developer 배포 경로에서 갱신합니다. 갱신 후 Xcode를 열고 [초기 설치 가이드](./macOS_Common_Dev_Setting.md)의 `xcode-select`, `xcodebuild -runFirstLaunch`, 라이선스 절차를 확인한 뒤 실기기 연결·서명을 점검합니다. Simulator 런타임은 선택 설치합니다.

Homebrew CocoaPods는 `brew upgrade cocoapods`로 갱신합니다. `Gemfile`로 관리하는 프로젝트는 해당 Ruby·Bundler 환경에서 `bundle update cocoapods`로 목표 변경을 검토합니다. `Podfile.lock`을 삭제해 강제로 전체 갱신하지 않습니다.

## Rust

```bash
rustup self update
rustup update stable
rustup show
```

rustup 자체와 stable 툴체인을 갱신합니다. 특정 버전에 고정된 프로젝트는 그대로 유지되므로, 변경이 필요하면 `rust-toolchain.toml` 또는 `rust-toolchain`의 목표 버전과 CI를 함께 수정합니다. 이후 `cargo build --locked`와 `cargo test --locked`로 확인합니다. 크레이트 갱신은 별도 작업으로 `cargo update`를 사용하고 `Cargo.lock` 변경을 검토합니다. [rustup 업데이트 안내](https://rust-lang.github.io/rustup/basics.html)

## Unity Hub·Editor

Hub 앱의 업데이트 안내로 Hub 자체를 갱신합니다. Editor는 Hub에서 새 버전을 **추가 설치**하고 프로젝트 복사본 또는 별도 브랜치로 열어 업그레이드를 확인합니다. 대상 플랫폼 모듈도 해당 Editor 버전으로 추가합니다.

컴파일·Play Mode·대상 빌드가 통과한 뒤 `ProjectVersion.txt`, `Packages/manifest.json`, `Packages/packages-lock.json` 등 변경을 검토합니다. 이전 Editor로 돌아갈 때는 업그레이드 전 프로젝트 상태도 복원합니다. 새 Editor로 변환한 프로젝트를 이전 Editor에서 그대로 여는 방식은 피합니다.

## Docker Desktop·이미지

Docker Desktop 앱의 업데이트 확인 기능으로 갱신하거나 공식 설치 페이지에서 해당 칩의 새 버전을 설치합니다. 엔진 재시작으로 실행 중인 컨테이너가 중단될 수 있으므로 작업을 저장하고 중요한 볼륨 데이터는 백업합니다. 갱신 후 `docker version`과 `docker compose version`을 확인합니다.

컨테이너 이미지 업데이트는 Desktop 업데이트와 별개입니다. 프로젝트가 의도한 이미지 태그·digest와 변경 내용을 확인한 뒤:

```bash
docker compose pull
docker compose up -d --build
docker compose ps
docker compose logs --tail=100
```

위 pull은 Compose의 이미지 기반 서비스에 적용됩니다. 로컬 Dockerfile의 베이스 이미지도 갱신하려면 `docker compose build --pull` 후 `docker compose up -d`로 재생성합니다. DB 이미지 변경 전에는 데이터 호환성과 복원 절차를 확인합니다. 볼륨을 지워 업데이트하지 않습니다. 이전 이미지로 되돌려도 DB 데이터 마이그레이션이 자동 취소되지는 않습니다.

## Codex CLI

독립 설치 방식은 설치 스크립트를 다시 실행해 업데이트합니다. [OpenAI 공식 업데이트 안내](https://learn.chatgpt.com/docs/codex/cli)

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex --version
```

npm으로 설치한 경우에는 해당 설치가 있는 nvm Node 환경에서 `npm install -g @openai/codex@latest`를 사용합니다. 업데이트 후 새 세션에서 실행을 확인합니다.

## 업데이트 완료 확인

새 터미널과 VS Code를 열어 도구 버전을 확인하고, [프로젝트 복원 완료 확인](./macos-project-restore.md#8-프로젝트-복원-완료-확인) 목록에서 업데이트한 도구에 해당하는 프로젝트를 검증합니다. 버전·잠금 파일의 변경을 검토하고 성공한 변경만 저장합니다. OS·SDK·데이터 형식 변경은 단순히 실행 파일 버전을 낮추는 것만으로 복구되지 않을 수 있습니다.
