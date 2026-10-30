<!-- version: v2.8.0 -->
# macOS 공통 개발 도구 초기 설치

먼저 [Apple Silicon](./macOS_AppleSilicon_Dev_Setting.md) 또는 [Intel](./macOS_Intel_Dev_Setting.md)의 기본 설정을 완료합니다. 이 문서는 **프로젝트를 내려받기 전, 개인 Mac에 도구를 설치하고 인식 여부를 확인하는 단계**입니다. 터미널 명령은 별도 표시가 없으면 임의 디렉터리에서 실행합니다. 아직 프로젝트 폴더나 package.json·pubspec.yaml은 필요하지 않습니다.

초기 설치는 아래 0~8절까지만 진행합니다. 프로젝트를 내려받은 뒤에는 문서 끝의 [프로젝트 작업 안내](#프로젝트-작업-안내)에서 필요한 도구 가이드로 이동합니다. React·TypeScript·Electron은 프로젝트 의존성이므로 초기 전역 설치 대상이 아닙니다.

macOS에서는 **공식 독립 설치 스크립트·공식 배포판**을 기본으로 사용합니다. Homebrew 설치는 선행 조건이 아닙니다. curl은 다운로드 수단이며 도구별 업데이트 명령을 사용합니다. 스크립트 방식도 OS·CPU 지원 제한은 있으므로 설치 전 공식 지원 조건을 확인합니다. 기존 설치와 충돌하지 않도록 command -v·which -a로 경로를 확인하고 기존 Homebrew를 일괄 삭제하지 않습니다.

## 0. 셸 설정 파일 준비

macOS에 포함된 zsh를 사용합니다. `~/.zshrc`는 설치 프로그램이 아니라 개인 셸 설정 파일이며 없으면 만듭니다.

```bash
touch ~/.zshrc
```

아래 nvm 초기화는 `~/.zshrc`에 설정합니다. 각 설치기의 PATH 안내를 우선하며 `~/.zprofile` 또는 `~/.zshrc` 중 한 곳에만 둡니다. 새 터미널을 열어 인식 여부를 확인하고 개인 경로·기존 설정을 덮어쓰지 않습니다.

### Oh My Zsh 설치

Apple Silicon·Intel 모두 위 기본 설정에서 Command Line Tools 설치를 마친 뒤, 개인 Mac의 **zsh 터미널**에서 일반 사용자 권한으로 진행합니다. Oh My Zsh는 zsh의 테마·플러그인을 관리하는 도구이며 Homebrew는 필요하지 않습니다. 아래는 기본 경로 `~/.zshrc`·`~/.oh-my-zsh`를 사용하는 경우입니다. `ZDOTDIR`나 별도 셸 관리 도구를 사용 중이면 기존 설정 경로와 로딩 구성을 먼저 확인합니다.

```zsh
zsh --version
git --version
curl --version
cp -p ~/.zshrc ~/.zshrc.backup-$(date +%Y%m%d-%H%M%S)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc --skip-chsh
```

공식 설치기의 `--keep-zshrc`로 기존 설정을 보존하고 `--skip-chsh`로 로그인 셸 변경을 생략합니다. 이미 `~/.oh-my-zsh`가 있다면 재설치하지 말고 [사용·업데이트 가이드](../01.Tools/oh-my-zsh.md)를 확인합니다.

기존 `~/.zshrc`를 편집해 아래 블록을 한 번만 추가합니다. 기존 Oh My Zsh 설정이 있다면 중복 추가하지 않습니다. `--keep-zshrc`는 초기화 설정을 자동으로 넣지 않으므로 이 단계가 필요합니다. nvm 초기화·개인 PATH·별칭은 보존하고, 개인 별칭으로 기본 별칭을 덮어쓰려면 아래 블록 뒤에 둡니다.

```zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source "$ZSH/oh-my-zsh.sh"
```

새 터미널을 열어 아래 결과에 `omz is a shell function`이 표시되는지 확인합니다. 로그인 셸이 zsh가 아니라면 먼저 `zsh`를 실행한 뒤 확인합니다.

```zsh
type omz
```

설치 방법·옵션 확인일: 2026-10-30. [공식 설치 안내](https://github.com/ohmyzsh/ohmyzsh#basic-installation) · [설치기 옵션](https://github.com/ohmyzsh/ohmyzsh/blob/master/tools/install.sh). 테마·플러그인 변경과 백업·복귀는 [Oh My Zsh 가이드](../01.Tools/oh-my-zsh.md)를 참고합니다.

### D2Coding 폰트 설치·Terminal 적용

개인 Mac의 Apple Silicon·Intel 모두 같은 폰트 파일을 사용합니다. 사용하는 `D2Coding-Ver1` 배포본이 이미 설치되어 있다면 재설치하지 않고 서체 관리자(Font Book)에서 활성화 여부와 **서체 패밀리 이름**을 확인합니다. 배포 압축 파일명·버전과 앱에서 지정하는 이름은 다릅니다. 아래 예시는 패밀리 이름이 `D2Coding`인 경우이며, 실제 표시 이름이 다르면 그 이름으로 바꿉니다.

1. 새 Mac에서는 [NAVER 공식 릴리스](https://github.com/naver/d2-coding-font/releases)에서 기존에 사용하던 Ver 1.x 배포본을 선택해 압축을 풉니다. `D2Coding-Ver1`만으로 세부 버전을 확정하지 않으며, 기존 원본 파일이나 서체 관리자에 표시되는 버전을 확인합니다.
2. 사용할 일반 D2Coding의 TTF 또는 TTC 파일을 열어 서체 관리자에서 설치합니다. 같은 서체의 TTF·TTC를 모두 설치하거나 서로 다른 버전을 중복 설치하지 않습니다. Ligature 변형은 별도 이름으로 표시될 수 있으므로 기존 사용 변형을 유지합니다.
3. 서체 관리자에서 D2Coding을 검색해 미리보기·버전을 확인하고 필요하면 서체 유효성 검사를 실행합니다. 설치 후 사용 중인 앱을 완전히 종료했다가 다시 엽니다.
4. macOS 기본 Terminal에서 **Terminal → 설정(Settings, 구버전은 환경설정) → 프로파일(Profiles) → 사용할 프로파일 → 텍스트(Text) → 서체 변경(Change)**을 열고 D2Coding을 선택합니다. 크기는 14pt를 시작값으로 조절합니다.
5. 새 창에서도 사용하려면 해당 프로파일을 **기본(Default)**으로 지정합니다. 다른 프로파일을 쓰는 기존 창·탭에는 별도로 적용하거나 새 기본 프로파일 창을 엽니다.

[Apple 서체 설치·검증](https://support.apple.com/en-gb/guide/font-book/fntbk1000/mac) · [Terminal 텍스트 설정](https://support.apple.com/en-lb/guide/terminal/trmltxt/mac).

폰트 선택은 각 앱에서 따로 설정합니다. Oh My Zsh의 `ZSH_THEME`는 프롬프트 모양을 선택하는 값이므로 폰트 이름을 넣지 않습니다. 특수 아이콘이 깨지면 해당 테마의 Powerline·Nerd Font 요구 조건을 확인하거나 기본 테마를 사용합니다. 일반 D2Coding이 모든 특수 아이콘을 포함한다고 가정하지 않습니다.

폰트를 교체·업데이트하기 전 사용하던 원본 폰트 파일·버전과 앱별 서체 이름·크기를 보관합니다. 같은 패밀리의 구버전을 정리해야 하면 서체 관리자에서 대상만 확인해 제거한 뒤 새 파일을 설치합니다. 문제가 생기면 새 버전을 제거하고 보관한 파일과 앱 설정으로 복귀합니다. 목록에 보이지 않으면 서체 활성화·중복·정확한 패밀리 이름을 확인하고 앱을 재시작합니다.

폰트 배포처·앱별 설정 방법 확인일: 2026-10-30. 실제 사용 중인 Ver1 파일의 세부 버전과 각 앱의 렌더링은 사용자 Mac에서 확인합니다.

## 1. VS Code

[공식 macOS 배포판](https://code.visualstudio.com/docs/setup/mac)을 내려받아 압축을 풀고 Visual Studio Code.app을 Applications로 옮겨 실행합니다. 사용하는 OS·CPU와 호환되는 배포판을 선택합니다. 별도 비공식 curl 설치 스크립트는 사용하지 않습니다.

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

### VS Code 표시 언어 변경

한국어 메뉴를 사용하려면 개인 Mac의 VS Code에서 다음을 진행합니다.

1. `Cmd+Shift+X`로 확장을 열고 Microsoft의 [Korean Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ko)(식별자: `MS-CEINTL.vscode-language-pack-ko`)를 설치합니다.
2. `Cmd+Shift+P`로 명령 팔레트를 열고 `Configure Display Language`(표시 언어 구성)를 실행합니다.
3. `한국어` / `Korean (ko)`를 선택하고 안내에 따라 VS Code를 재시작합니다. 메뉴가 한국어로 표시되는지 확인합니다.

영어로 돌아가거나 다른 언어로 바꾸려면 같은 명령에서 `English (en)` 또는 원하는 언어를 선택하고 재시작합니다. 원하는 언어가 없으면 해당 Language Pack을 먼저 설치합니다. 한국어가 적용되지 않으면 언어 팩 활성화 여부를 확인하고 표시 언어를 다시 선택합니다.

표시 언어는 명령 팔레트에서 관리하며 프로젝트의 `settings.json`에 `locale`을 추가하지 않습니다. 확인일: 2026-10-30. [공식 표시 언어 안내](https://code.visualstudio.com/docs/configure/locales).

### VS Code 편집기·통합 터미널 폰트

[D2Coding 설치](#d2coding-폰트-설치terminal-적용) 후 명령 팔레트에서 `Preferences: Open User Settings (JSON)`을 열어 기존 객체에 아래 항목을 병합합니다. 기존 설정 파일 전체를 교체하지 않으며, 같은 키가 있으면 값을 수정합니다. 개인 폰트 취향은 사용자 설정에 보관합니다.

```json
{
  "editor.fontFamily": "D2Coding, monospace",
  "editor.fontSize": 14,
  "terminal.integrated.fontFamily": "D2Coding",
  "terminal.integrated.fontSize": 14
}
```

편집기와 통합 터미널의 폰트는 별도 항목입니다. 실제 패밀리 이름이 다르면 두 항목을 함께 바꿉니다. VS Code를 재시작하고 코드 파일과 새 통합 터미널에서 한글·영문·숫자를 확인합니다. 적용되지 않으면 현재 프로파일의 사용자 설정과 워크스페이스·언어별 설정의 덮어쓰기를 확인합니다. [공식 설정 안내](https://code.visualstudio.com/docs/configure/settings) · [통합 터미널 폰트](https://code.visualstudio.com/docs/terminal/appearance).

## 2. Node.js: nvm + npm

nvm은 [공식 설치 스크립트](https://github.com/nvm-sh/nvm#installing-and-updating)로 설치합니다. 다른 경로의 Node.js를 중복 설치하지 않습니다.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | PROFILE="$HOME/.zshrc" bash
source ~/.zshrc
command -v nvm
nvm install --lts
node --version
npm --version
```

설치 스크립트가 `~/.zshrc`에 nvm 초기화 설정을 추가합니다. 인식되지 않으면 새 터미널을 열어 확인합니다.

위 LTS는 프로젝트가 없는 상태의 기본 Node입니다. 기존 프로젝트의 Node 버전 선택과 npm 의존성 복원은 [nvm 가이드](../01.Tools/nvm.md#macoslinux-기본-흐름)에서 진행합니다.

## 3. Python 관리 도구: uv

uv는 Homebrew와 분리하여 [공식 독립 설치 방법](https://docs.astral.sh/uv/getting-started/installation/)을 사용합니다. 개인 터미널의 임의 디렉터리에서 아래를 실행합니다. 시스템 Python과 전역 pip를 변경하지 않으며 아직 특정 Python 버전 설치나 가상환경 생성은 필요하지 않습니다.

```bash
curl -LsSf https://astral.sh/uv/0.13.6/install.sh | sh
```

설치기의 PATH 안내를 적용하고 새 터미널을 엽니다. 기본 경로인 ~/.local/bin이 인식되지 않으면 기존 ~/.zshrc에 `export PATH="$HOME/.local/bin:$PATH"`를 한 번만 추가합니다. 이후 확인합니다.

```bash
command -v uv
uv --version
```

2026-10-30 확인: uv 자체는 [macOS 13 이상을 지원](https://docs.astral.sh/uv/reference/policies/platforms/#macos-versions)합니다. Homebrew의 [uv bottle 목록](https://formulae.brew.sh/formula/uv)에는 Intel·Ventura용이 없으므로 brew install uv의 실패를 uv 자체 미지원으로 판단하지 않습니다. 공식 0.13.6 x86_64 바이너리의 버전 명령은 macOS 13.7.8 Intel에서 확인했으며, 독립 설치기 실행과 Python 다운로드·프로젝트 복원은 이번 확인 범위가 아닙니다.

기존 설치가 있다면 `which -a uv`로 중복·PATH 우선순위를 확인합니다. 독립 설치로 전환한 뒤 업데이트는 `uv self update`를 사용하며 brew upgrade uv와 혼용하지 않습니다. 기존 uv의 Python·캐시·가상환경을 지우지 않습니다.

프로젝트 Python 설치·.venv 생성·패키지 복원·VS Code 인터프리터 선택은 [uv 가이드](../01.Tools/uv.md#기존-uv-프로젝트-복원)에서 진행합니다. 상세 사용법은 [uv](../01.Tools/uv.md)·[venv](../01.Tools/venv.md)를 참고합니다.

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

다른 환경은 이 버전을 일괄 적용하지 않고 프로젝트 복원 시 요구 SDK를 선택합니다. `fvm use`·pub get·doctor·실기기 빌드는 [FVM 가이드](../01.Tools/fvm.md#macos-실기기-프로젝트-연결)에서 진행합니다.

### Android Studio 설치

1. [Android Studio](https://developer.android.com/studio)를 칩에 맞게 설치하고 처음 실행합니다. 코드는 VS Code에서 작성하고 Android Studio는 SDK 관리에 사용합니다.
2. SDK Manager에서 Android SDK Command-line Tools와 Platform-Tools를 준비하고 SDK 설치 경로를 확인합니다. 프로젝트별 SDK Platform·Build-Tools·NDK·CMake 버전은 복원 단계에서 결정합니다.
3. AVD·에뮬레이터 시스템 이미지는 필요할 때 직접 추가하므로 초기 다운로드에서 제외합니다.
4. 실기기를 사용할 경우 개발자 옵션·USB 디버깅을 켜고 USB 연결 허용 창을 승인합니다. Flutter 라이선스 확인·기기 탐지·앱 실행은 프로젝트 복원에서 진행합니다.

Android Studio 포함 JDK를 기본으로 두되 프로젝트 Gradle·Android Gradle Plugin의 요구 버전은 복원 때 확인합니다. [Flutter Android 설정](https://docs.flutter.dev/platform-integration/android/setup).

### Android Studio 편집기·콘솔·터미널 폰트

D2Coding 설치 후 Android Studio를 재시작하고 **Android Studio → Settings**(구버전은 Preferences)를 엽니다. 버전에 따라 메뉴 이름·상속 옵션이 다를 수 있으므로 설정 검색에서 `Font`·`Console Font`·`Terminal`을 찾습니다.

| 적용 영역 | 설정 위치·방법 |
| :--- | :--- |
| 코드 편집기 | **Editor → Font**에서 D2Coding 선택. 크기는 14를 시작값으로 조절 |
| 색 구성표가 편집기 폰트를 별도 지정할 때 | **Editor → Color Scheme → Color Scheme Font**의 별도 지정 옵션을 해제해 Editor Font를 상속하거나 D2Coding 지정 |
| Run·Debug 콘솔 | **Editor → Color Scheme → Console Font**에서 편집기 폰트를 상속하거나 별도 콘솔 폰트로 D2Coding 지정 |
| 내장 Terminal | **Tools → Terminal → Font Settings**가 있으면 D2Coding 지정. 이 항목이 없는 구버전은 Console Font 설정을 확인하고 새 터미널에서 적용 여부 확인 |

내장 Terminal과 Run·Debug 콘솔은 각각 확인합니다. Android Studio의 기반 플랫폼인 IntelliJ IDEA 문서를 참고한 경로이며, 설치된 Android Studio의 버전·터미널 엔진에 따라 표시 항목이 다를 수 있습니다. 편집기·콘솔·새 터미널에서 한글과 `0O 1lI {} [] =>` 표시를 확인합니다. 앱 메뉴·도구 창의 UI 폰트는 위 코드 폰트 설정과 별개입니다.

[Android Studio 설정 안내](https://developer.android.com/studio/intro/studio-config) · [JetBrains 편집기·콘솔 폰트](https://www.jetbrains.com/help/idea/configuring-colors-and-fonts.html) · [JetBrains 터미널 폰트](https://www.jetbrains.com/help/idea/settings-tools-terminal.html#font-settings).

### Xcode 설치·초기화

1. 해당 macOS가 지원하는 Xcode를 설치합니다. Command Line Tools만으로는 iOS 개발이 되지 않습니다.
2. Xcode를 한 번 열고 필수 구성요소와 iOS 플랫폼 지원을 설치합니다. Simulator 런타임은 사전 설치하지 않습니다.
3. 아래 명령으로 사용할 Xcode를 지정하고 초기 설정과 라이선스를 확인합니다. 설치 경로가 다르면 실제 경로로 바꿉니다.

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
sudo xcodebuild -license
```

iPhone의 컴퓨터 신뢰·Developer Mode를 준비합니다. CocoaPods·프로젝트 Signing Team·서명 계정·실기기 빌드는 [FVM 가이드](../01.Tools/fvm.md#macos-실기기-프로젝트-연결)에서 확인합니다. 계정·인증서는 문서에 기록하지 않습니다. [Flutter iOS 설정](https://docs.flutter.dev/platform-integration/ios/setup).

## 5. C/C++·Rust·Unity 도구

### C/C++

Command Line Tools의 Clang을 확인합니다. CMake를 사용하는 작업은 [공식 배포판 설치](../01.Tools/cpp-toolchain.md#macos-cmake와-pkgconf-설치업데이트)를 추가로 진행합니다. pkgconf는 프로젝트가 요구할 때만 같은 안내를 따릅니다. 아직 프로젝트 빌드 폴더는 만들지 않습니다.

```bash
clang --version
cmake --version
```

### Rust

[Rust 공식 설치 안내](https://rust-lang.org/tools/install/)에 따라 rustup을 설치합니다.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup show
```

프로젝트 툴체인 선택·빌드는 [rustup 가이드](../01.Tools/rustup.md)을 따릅니다.

### Unity Hub

[Unity Hub](https://unity.com/download)를 설치하고 실행 여부를 확인합니다. 정확한 Unity Editor 버전·플랫폼 모듈·VS Code 연동은 프로젝트 요구 사항을 확인한 뒤 [아래 Unity 안내](#unity-프로젝트)에서 진행합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다.

## 6. Docker Desktop 설치

먼저 macOS 버전·CPU와 [공식 지원 조건](https://docs.docker.com/desktop/setup/install/mac-install/#system-requirements)을 확인합니다. **Intel·Ventura 13.7.8은 최신 버전을 설치할 수 없으므로 [4.48.0 설치 안내](./macOS_Intel_Dev_Setting.md#4-ventura-1378의-docker-desktop-설치)를 따릅니다.**

지원되는 환경은 [공식 Mac 설치 페이지](https://docs.docker.com/desktop/setup/install/mac-install/)에서 칩에 맞는 Docker Desktop을 설치합니다. 앱을 실행해 초기 설정을 끝내고 엔진이 준비될 때까지 기다립니다. CLI만 설치해서는 로컬 컨테이너를 실행할 수 없습니다.

```bash
docker version
docker compose version
docker run --rm hello-world
```

hello-world는 Docker 엔진 확인용이며 이미지 다운로드가 필요합니다. 실제 프로젝트의 Compose·볼륨·터미널 접속·Dev Containers 설정은 [Docker 가이드](../01.Tools/docker.md)에서 진행합니다.

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

### Ponytail 스킬 추가

[Ponytail](https://github.com/DietrichGebert/ponytail)은 기존 코드·표준 기능을 먼저 재사용하고 필요한 변경에 집중하도록 돕는 외부 스킬입니다. 제작자의 Codex 설치 안내에 따라 스킬과 라이프사이클 훅을 포함한 플러그인으로 설치합니다. Apple Silicon·Intel 모두 개인 Mac 터미널의 임의 디렉터리에서 일반 사용자 권한으로 진행합니다. 위 Codex 인증과 [nvm·Node.js 설치](#2-nodejs-nvm--npm)를 먼저 완료합니다.

```bash
codex --version
node --version
codex plugin --help
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
codex plugin list
```

`plugin` 하위 명령이 없으면 이 문서의 Codex CLI 업데이트 안내를 적용한 뒤 다시 확인합니다. 이미 설치되어 있으면 중복 설치하지 않고 `codex plugin list`에서 상태를 확인합니다. 기존 프로젝트의 `AGENTS.md`를 Ponytail 파일로 교체할 필요는 없습니다.

1. `codex`를 실행하고 `/hooks`에서 Ponytail이 제공하는 두 라이프사이클 훅의 내용을 검토한 뒤 신뢰하도록 설정합니다. 이는 제작자 설치 안내에 포함된 활성화 단계입니다.
2. 새 스레드를 시작합니다. 데스크톱 앱에서도 사용하려면 앱을 완전히 종료했다가 다시 엽니다.
3. Codex CLI에서 `/skills` 또는 `$`를 입력해 Ponytail 스킬 목록을 확인합니다. 예를 들어 아래 문장을 **Codex 입력창**에 입력하면 현재 변경 내용을 검토합니다. 셸 명령으로 실행하지 않습니다.

```text
$ponytail:ponytail-review 현재 커밋하지 않은 변경 내용을 검토해줘.
```

제작자의 공통 문서에 나오는 `/ponytail-review`는 Codex CLI·IDE에서는 위와 같은 플러그인 네임스페이스가 붙은 스킬로 호출합니다. 실제 목록에 표시된 스킬을 선택합니다. [제작자 명령 안내](https://github.com/DietrichGebert/ponytail#commands) · [OpenAI 스킬 호출 안내](https://learn.chatgpt.com/docs/build-skills#how-chatgpt-and-codex-use-skills).

훅에서 `node: command not found`가 나오면 **비대화형 셸의 PATH**에도 Node가 있는지 확인합니다. nvm은 대화형 터미널에서만 초기화될 수 있으므로, 터미널의 `node --version` 성공만으로 앱·훅에서 인식된다고 판단하지 않습니다. 실행 환경의 PATH를 조정한 뒤 Codex를 재시작하고 훅 오류가 사라지는지 확인합니다. [제작자 선행 조건·Codex 설치 안내](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md#codex).

제거가 필요하면 개인 설정을 별도 보관한 뒤 개인 Mac 터미널에서 `codex plugin remove ponytail@ponytail`을 실행하고 Codex를 재시작합니다. 이 명령은 플러그인과 로컬 캐시를 제거합니다. 기존 프로젝트 파일·Codex 인증정보를 삭제하는 절차로 사용하지 않습니다.

확인일: 2026-10-30. 제작자 문서와 로컬 `codex-cli 0.166.0`의 설치·목록·제거 명령 도움말을 확인했습니다. 실제 플러그인 설치·훅 실행은 이번 문서 작성에서 수행하지 않았습니다.

## 8. 초기 설치 완료 확인

필요한 도구만 설치하면 됩니다. 아직 기존 프로젝트 실행 성공까지 확인하는 단계는 아닙니다.

- [ ] D2Coding이 Terminal·VS Code 편집기/통합 터미널·Android Studio 편집기/콘솔/내장 터미널에 적용되고 한글·영문이 정상 표시된다.
- [ ] 새 터미널과 VS Code 통합 터미널에서 code·nvm·node·npm·uv·fvm·codex가 인식된다.
- [ ] Android Studio의 SDK Manager와 Xcode가 열리고 필요한 기본 구성요소가 준비되어 있다.
- [ ] C/C++·Rust를 사용한다면 필요한 clang·cmake·rustup이 인식된다.
- [ ] Unity를 사용한다면 Hub가 실행된다. 프로젝트 Editor는 다음 단계에서 설치한다.
- [ ] Docker를 사용한다면 엔진·Compose 버전과 hello-world 실행을 확인했다.
- [ ] Oh My Zsh 설치 후 새 터미널에서 `type omz`가 셸 함수를 표시하고 기존 PATH·nvm 설정이 유지된다.
- [ ] 셸 설정이 중복되지 않고 사용 중인 Mac의 CPU용 도구를 설치했다.

## 프로젝트 작업 안내

여기부터는 초기 설치가 끝난 뒤 필요한 작업만 선택합니다. 프로젝트 README·CI·버전 파일·잠금 파일을 우선하며, 복원 중 의존성을 일괄 갱신하거나 잠금 파일을 삭제하지 않습니다. 도구 사용·버전 변경·복귀 방법은 아래 문서 한 곳에서 관리합니다.

| 작업 | 상세 절차 |
| :--- | :--- |
| TypeScript·React·Electron·서버 | [nvm·npm](../01.Tools/nvm.md) |
| Python | [uv](../01.Tools/uv.md) · [venv](../01.Tools/venv.md) |
| Flutter·Android·iOS | [FVM·실기기 연결](../01.Tools/fvm.md) |
| C/C++ | [툴체인·프리셋·별도 빌드 경로](../01.Tools/cpp-toolchain.md) |
| Rust | [rustup·프로젝트 툴체인](../01.Tools/rustup.md) |
| 컨테이너 | [Docker·Compose·Dev Containers](../01.Tools/docker.md) |
| 기존 Homebrew 관리(선택) | [brew 설치·업데이트](../01.Tools/brew.md) |

### Unity 프로젝트

Hub에서 로그인·라이선스를 활성화하고 `ProjectSettings/ProjectVersion.txt`의 정확한 Editor와 필요한 빌드 모듈을 설치합니다. Unity Android SDK·NDK·OpenJDK는 Hub 모듈을 우선하며 Flutter용 경로로 일괄 덮어쓰지 않습니다. iOS는 Xcode도 필요합니다. Unity External Tools에서 VS Code를 선택하고 Microsoft Unity 확장의 요구 조건에 맞춰 연동합니다.

Editor 갱신은 새 버전을 추가 설치한 뒤 프로젝트 복사본 또는 별도 브랜치로 열어 컴파일·Play Mode·대상 빌드를 확인합니다. 성공 후 ProjectVersion.txt·Packages/manifest.json·Packages/packages-lock.json 변경을 검토합니다. 복귀할 때는 이전 Editor와 업그레이드 전 프로젝트 파일을 함께 복원합니다. [Unity Hub 문서](https://docs.unity.com/en-us/hub).

### 완료 판단

초기 도구 인식과 프로젝트 복원 성공은 별개입니다. 사용하는 프로젝트의 실행·테스트·빌드, Flutter 실기기·서명, Electron 패키징, Docker 서비스 접속을 확인하고 버전·잠금 파일이 의도치 않게 바뀌지 않았는지 검토합니다. 로컬 환경 변수·외부 서비스·서명 자격증명은 별도 복원이 필요할 수 있습니다.

## macOS와 설치된 앱 업데이트

초기 설치 순서에 포함하지 않습니다. 작업과 데이터를 백업하고 해당 Mac·프로젝트와 호환되는 OS·Xcode 버전을 확인한 뒤 진행합니다.

- macOS·Command Line Tools: 시스템 설정 → 일반 → 소프트웨어 업데이트에서 제공 항목을 확인합니다. `xcode-select --install`은 매번 업데이트하는 명령이 아닙니다. [Apple 안내](https://support.apple.com/en-us/108382).
- Xcode: App Store 또는 기존 Apple Developer 배포 경로에서 갱신하고 이 문서의 [Xcode 초기화](#xcode-설치초기화)와 FVM 가이드의 실기기·서명 확인을 수행합니다.
- VS Code·확장, Android Studio, Unity Hub: 앱의 업데이트 기능을 사용합니다. CMake·pkgconf는 [공식 배포판 갱신 안내](../01.Tools/cpp-toolchain.md#macos-cmake와-pkgconf-설치업데이트)를 따릅니다. 컴파일러가 바뀌면 별도 빌드 경로에서 프로젝트를 검증합니다.
- Codex CLI: 위에서 사용한 독립 설치 스크립트를 다시 실행하고 새 터미널에서 codex --version을 확인합니다. 기존 npm 설치를 유지한다면 해당 nvm Node 환경에서 npm install -g @openai/codex@latest를 사용합니다. 두 방식을 중복 적용하지 않습니다.

기존 Homebrew로 설치한 도구는 [brew 가이드](../01.Tools/brew.md)에 따라 관리하거나 독립 설치로 전환하며 두 경로로 같은 실행 파일을 중복 관리하지 않습니다. 업데이트 전 버전을 기록하고 프로젝트 실행·테스트·빌드를 확인한 뒤 이전 환경을 정리합니다. OS·SDK·데이터 형식은 실행 파일 버전만 낮춘다고 복원되지 않을 수 있습니다.

### 독립 설치 도구 업데이트

프로젝트 루트가 아닌 개인 터미널에서도 도구 자체를 갱신할 수 있습니다. 실행 전 현재 도구 버전·설치 경로·목표 버전의 macOS 지원을 확인하고 갱신 후 새 터미널에서 버전을 확인합니다.

| 도구 | 독립 설치의 갱신 방법 | 상세 안내 |
| :--- | :--- | :--- |
| uv | uv self update. 고정 버전을 재설치하려면 해당 버전 URL 사용 | [uv](../01.Tools/uv.md#설치와-역할-구분) |
| nvm | 공식 설치 스크립트의 목표 릴리스 태그로 다시 실행 | [nvm](../01.Tools/nvm.md#업데이트복귀제거) |
| FVM | 공식 설치 스크립트 재실행 | [FVM](../01.Tools/fvm.md#업데이트와-되돌리기) |
| rustup | rustup self update | [rustup](../01.Tools/rustup.md#6-업데이트검증복귀) |
| Codex CLI | 위 독립 설치 스크립트 재실행 | [공식 CLI 안내](https://learn.chatgpt.com/docs/cli) |

관리 도구 갱신과 프로젝트의 Node·Python·Flutter·Rust 버전 변경은 별개입니다. Intel MacBook의 Flutter 3.35.7 고정은 FVM 갱신 뒤에도 유지합니다. 사용 중인 프로젝트를 검증한 뒤 목표 SDK·잠금 파일을 별도 변경합니다.
