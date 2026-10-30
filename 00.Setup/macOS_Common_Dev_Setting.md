<!-- version: v2.0.0 -->
# macOS 공통 개발 도구 초기 설치

먼저 [Apple Silicon](./macOS_AppleSilicon_Dev_Setting.md) 또는 [Intel](./macOS_Intel_Dev_Setting.md)의 기본 설정을 완료합니다. 이 문서는 **프로젝트를 내려받기 전, 개인 Mac에 도구를 설치하고 인식 여부를 확인하는 단계**입니다. 터미널 명령은 별도 표시가 없으면 임의 디렉터리에서 실행합니다. 아직 프로젝트 폴더나 package.json·pubspec.yaml은 필요하지 않습니다.

| 순서 | 문서 | 완료 기준 |
| :--- | :--- | :--- |
| 1 | 이 문서: 초기 설치 | 새 터미널에서 필요한 도구가 인식됨 |
| 2 | [기존 프로젝트 복원](./macos-project-restore.md) | 프로젝트 버전·의존성 복원 후 실행·테스트·빌드 |
| 별도 작업 | [도구·프로젝트 업데이트](./macos-update.md) | 변경 대상의 호환성 검증과 복귀 준비 |

기존 프로젝트의 호환성 확인은 2단계에서 진행합니다. 처음부터 npm ci·uv sync·fvm use·cargo build·docker compose up을 실행하지 않습니다. React·TypeScript·Electron은 프로젝트 의존성이므로 초기 전역 설치 대상이 아닙니다.

Intel Mac 신규 복원 시 최신 Homebrew 설치 스크립트는 사용할 수 없습니다. 아래 brew 명령은 기존 Homebrew 또는 [과거 설치기 절차](./macOS_Intel_Dev_Setting.md#과거-공식-설치-스크립트로-신규-설치-시도)로 구성한 Homebrew가 실행 가능한 경우에만 적용합니다. 그 외에는 [Intel 신규 설치 안내](./macOS_Intel_Dev_Setting.md#신규-설치와-기존-환경-보존)에 따라 공식 Intel 배포판을 사용합니다. OS·도구의 기존 지원 정보는 2026-10-28~30 확인 기록을 유지하며, 이번 문서 분리로 전체 지원 조건을 재검증한 것은 아닙니다.

## 0. 셸 설정 파일 준비

macOS에 포함된 zsh를 사용합니다. `~/.zshrc`는 설치 프로그램이 아니라 개인 셸 설정 파일이며 없으면 만듭니다.

```bash
touch ~/.zshrc
```

아래 nvm 초기화는 `~/.zshrc`에 설정합니다. Homebrew PATH는 칩별 가이드와 설치기의 Next steps를 우선하며 `~/.zprofile` 또는 `~/.zshrc` 중 한 곳에만 둡니다. 새 터미널을 열어 인식 여부를 확인하고 개인 경로·기존 설정을 덮어쓰지 않습니다. Oh My Zsh는 필수 설치가 아닙니다.

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

위 LTS는 프로젝트가 없는 상태의 기본 Node입니다. 기존 프로젝트의 Node 버전 선택과 npm 의존성 복원은 [프로젝트 복원 1절](./macos-project-restore.md#1-typescriptreactelectron서버)에서 진행합니다.

## 3. Python 관리 도구: uv

1절에서 설치한 uv가 인식되는지 확인합니다. 시스템 Python과 전역 pip를 변경하지 않습니다. 이 단계에서는 특정 Python 버전 설치나 가상환경 생성이 필요하지 않습니다.

```bash
uv --version
```

프로젝트 Python 설치·.venv 생성·패키지 복원·VS Code 인터프리터 선택은 [프로젝트 복원 2절](./macos-project-restore.md#2-python)에서 진행합니다. 상세 사용법은 [uv](../01.Tools/uv.md)·[venv](../01.Tools/venv.md)를 참고합니다.

## 4. Flutter 도구: FVM·Android Studio·Xcode

### FVM 설치

[FVM 공식 설치 안내](https://fvm.app/documentation/getting-started/installation)에 따라 설치합니다.

```bash
curl -fsSL https://fvm.app/install.sh | bash
```

설치 결과의 PATH 안내를 적용하고 새 터미널에서 `fvm --version`을 확인합니다.

사용 중인 Intel MacBook은 Flutter SDK 3.35.7이 복원 기준입니다. SDK를 미리 내려받아 두려면 아래 명령만 실행합니다. 프로젝트 선택 파일 `.fvmrc`는 만들지 않습니다.

```bash
fvm install 3.35.7
```

다른 환경은 이 버전을 일괄 적용하지 않고 프로젝트 복원 시 요구 SDK를 선택합니다. `fvm use`·pub get·doctor·실기기 빌드는 [프로젝트 복원 3절](./macos-project-restore.md#3-flutterandroidios-실기기)에서 진행합니다.

### Android Studio 설치

1. [Android Studio](https://developer.android.com/studio)를 칩에 맞게 설치하고 처음 실행합니다. 코드는 VS Code에서 작성하고 Android Studio는 SDK 관리에 사용합니다.
2. SDK Manager에서 Android SDK Command-line Tools와 Platform-Tools를 준비하고 SDK 설치 경로를 확인합니다. 프로젝트별 SDK Platform·Build-Tools·NDK·CMake 버전은 복원 단계에서 결정합니다.
3. AVD·에뮬레이터 시스템 이미지는 필요할 때 직접 추가하므로 초기 다운로드에서 제외합니다.
4. 실기기를 사용할 경우 개발자 옵션·USB 디버깅을 켜고 USB 연결 허용 창을 승인합니다. Flutter 라이선스 확인·기기 탐지·앱 실행은 프로젝트 복원에서 진행합니다.

Android Studio 포함 JDK를 기본으로 두되 프로젝트 Gradle·Android Gradle Plugin의 요구 버전은 복원 때 확인합니다. [Flutter Android 설정](https://docs.flutter.dev/platform-integration/android/setup).

### Xcode 설치·초기화

1. 해당 macOS가 지원하는 Xcode를 설치합니다. Command Line Tools만으로는 iOS 개발이 되지 않습니다.
2. Xcode를 한 번 열고 필수 구성요소와 iOS 플랫폼 지원을 설치합니다. Simulator 런타임은 사전 설치하지 않습니다.
3. 아래 명령으로 사용할 Xcode를 지정하고 초기 설정과 라이선스를 확인합니다. 설치 경로가 다르면 실제 경로로 바꿉니다.

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
sudo xcodebuild -license
```

iPhone의 컴퓨터 신뢰·Developer Mode를 준비합니다. CocoaPods·프로젝트 Signing Team·서명 계정·실기기 빌드는 [프로젝트 복원 3절](./macos-project-restore.md#3-flutterandroidios-실기기)에서 확인합니다. 계정·인증서는 문서에 기록하지 않습니다. [Flutter iOS 설정](https://docs.flutter.dev/platform-integration/ios/setup).

## 5. C/C++·Rust·Unity 도구

### C/C++

칩별 초기 설정에서 설치한 Command Line Tools의 Clang과 1절의 CMake·pkgconf를 사용합니다. 버전만 확인하고 프로젝트 빌드 폴더는 아직 만들지 않습니다.

```bash
clang --version
cmake --version
pkgconf --version
```

### Rust

[Rust 공식 설치 안내](https://rust-lang.org/tools/install/)에 따라 rustup을 설치합니다.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup show
```

프로젝트 툴체인 선택·빌드는 [프로젝트 복원 5절](./macos-project-restore.md#5-rust)을 따릅니다.

### Unity Hub

[Unity Hub](https://unity.com/download)를 설치하고 실행 여부를 확인합니다. 정확한 Unity Editor 버전·플랫폼 모듈·VS Code 연동은 프로젝트 요구 사항을 확인한 뒤 [프로젝트 복원 6절](./macos-project-restore.md#6-unity-c)에서 진행합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다.

## 6. Docker Desktop 설치

[공식 Mac 설치 페이지](https://docs.docker.com/desktop/setup/install/mac-install/)에서 칩에 맞는 Docker Desktop을 설치합니다. 앱을 실행해 초기 설정을 끝내고 엔진이 준비될 때까지 기다립니다. CLI만 설치해서는 로컬 컨테이너를 실행할 수 없습니다.

```bash
docker version
docker compose version
docker run --rm hello-world
```

hello-world는 Docker 엔진 확인용이며 이미지 다운로드가 필요합니다. 실제 프로젝트의 Compose·볼륨·터미널 접속·Dev Containers 설정은 [프로젝트 복원 7절](./macos-project-restore.md#7-docker-프로젝트)에서 진행합니다.

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

## 8. 초기 설치 완료 확인

필요한 도구만 설치하면 됩니다. 아직 기존 프로젝트 실행 성공까지 확인하는 단계는 아닙니다.

- [ ] 새 터미널과 VS Code 통합 터미널에서 code·nvm·node·npm·uv·fvm·codex가 인식된다.
- [ ] Android Studio의 SDK Manager와 Xcode가 열리고 필요한 기본 구성요소가 준비되어 있다.
- [ ] C/C++·Rust를 사용한다면 clang·cmake·pkgconf·rustup이 인식된다.
- [ ] Unity를 사용한다면 Hub가 실행된다. 프로젝트 Editor는 다음 단계에서 설치한다.
- [ ] Docker를 사용한다면 엔진·Compose 버전과 hello-world 실행을 확인했다.
- [ ] 셸 설정이 중복되지 않고 사용 중인 Mac의 CPU용 도구를 설치했다.

여기까지 끝나면 [기존 프로젝트 복원](./macos-project-restore.md)으로 이동해 사용하는 유형의 절만 진행합니다. 이후 도구·SDK·의존성을 바꿀 때는 [업데이트 가이드](./macos-update.md)를 사용합니다. 버전 관리 상세는 [nvm](../01.Tools/nvm.md)·[FVM](../01.Tools/fvm.md)·[uv](../01.Tools/uv.md)·[rustup](../01.Tools/rustup.md)·[C/C++ 툴체인](../01.Tools/cpp-toolchain.md)을 참고합니다.
