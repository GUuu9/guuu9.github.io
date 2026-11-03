<!-- version: v6.1.0 -->
# macOS 개발 환경 설정

처음 설치하거나 Mac을 다시 설정할 때 사용합니다. **시스템 설정 → 일반 → 정보**에서 칩과 macOS 버전을 확인합니다. 아래 명령은 개인 사용자 터미널에서 실행합니다. 도구의 상세 사용·업데이트는 연결한 Tools 문서를 참고합니다.

## CPU별 확인 사항

| CPU | 확인 사항 |
| :--- | :--- |
| Apple Silicon | 터미널·VS Code를 `arm64`로 실행합니다. Rosetta의 `x86_64` 도구와 혼용하지 않습니다. |
| Intel | macOS·Xcode 지원 범위가 최신 도구 설치를 제한할 수 있습니다. Intel용 배포판이 현재 macOS에서 실행된다고 가정하지 않습니다. 기존 macOS 13.7.8 환경의 Homebrew 제한은 [Intel 설치 안내](../01.Tools/brew.md#과거-공식-설치-스크립트로-신규-설치-시도), Flutter 3.35.7은 [기존 Flutter 기준](../01.Tools/fvm.md#intel-macbook의-flutter-버전-고정), Docker Desktop 4.48.0은 [해당 버전의 제약](../01.Tools/docker.md#intel-ventura의-docker-desktop-4480)을 확인합니다. 이 기록은 모든 Intel Mac의 지원 상한이 아닙니다. |

## 1. 필수 설정

### 셸·Git·컴파일 도구

```bash
touch ~/.zshrc
sw_vers
uname -m
xcode-select -p
```

Command Line Tools가 없으면 설치하고 완료 후 확인합니다. 전체 Xcode를 쓸 경우 [라이선스·최초 실행](../01.Tools/xcode.md#전체-xcode-설치초기화)을 먼저 끝냅니다. Git·Clang 조회가 실패하면 다음 단계로 넘어가지 않습니다.

위 명령이 경로를 출력하지 않을 때만 설치 대화상자를 엽니다.

```bash
xcode-select --install
```

설치 완료 후 확인합니다.

```bash
git --version
clang --version
```

iOS를 개발한다면 Homebrew·nvm보다 먼저 [전체 Xcode](https://developer.apple.com/xcode/)를 설치하고 라이선스·최초 실행을 완료합니다. `/Applications/Xcode.app` 기준이며 다른 경로면 바꿉니다.

```bash
sudo env DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -license
sudo env DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -runFirstLaunch
DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -version
```

### Homebrew

Apple Silicon에서 설치합니다. Intel은 최신 설치기가 제한되므로 [Intel 절차](../01.Tools/brew.md#과거-공식-설치-스크립트로-신규-설치-시도)를 확인합니다.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치기가 출력한 PATH 안내를 따릅니다. 기본 경로를 쓰는 경우 CPU에 맞는 한 줄을 `~/.zprofile`에 추가하고 새 터미널에서 확인합니다.

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"  # Apple Silicon
eval "$(/usr/local/bin/brew shellenv)"    # Intel 기존 설치
```

```bash
brew --version
brew --prefix
```

### VS Code

[공식 배포판](https://code.visualstudio.com/Download)에서 CPU에 맞는 앱을 설치해 Applications로 옮깁니다. Command Palette에서 `Shell Command: Install 'code' command in PATH`를 실행합니다. 한국어 표시 언어는 `Configure Display Language`에서 Korean을 선택합니다.

```bash
code --version
```

[D2Coding 공식 릴리스](https://github.com/naver/d2codingfont/releases)에서 TTF/TTC 폰트를 내려받아 열고 Font Book에서 설치한 뒤 User Settings에 적용합니다. `Configure Display Language`에서 Korean도 선택합니다.

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

## 2. 개발 도구 설치

CLI 도구는 아래 명령으로 설치·확인합니다. 기존 프로젝트 버전을 전역 기본값으로 고정하지 않습니다.

uv·FVM 설치 후 명령을 찾지 못하면 아래 PATH 항목을 `~/.zshrc`에 한 번 추가하고 새 터미널에서 확인합니다.

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### Oh My Zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc --skip-chsh
```

Oh My Zsh 설치 후 기존 `~/.zshrc`에 다음 블록을 한 번 추가하고 새 터미널을 엽니다.

```bash
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source "$ZSH/oh-my-zsh.sh"
```

```bash
type omz
```

### Node.js

```bash
PROFILE="$HOME/.zshrc" bash <(curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh)
source ~/.zshrc
nvm install --lts
node --version
npm --version
```

### Python

```bash
sh <(curl -LsSf https://astral.sh/uv/0.13.6/install.sh)
uv --version
```

### Flutter

```bash
bash <(curl -fsSL https://fvm.app/install.sh)
fvm --version
```

설치기에서 안내하는 PATH를 `~/.zshrc`에 추가하고 새 터미널에서 확인합니다.

### Rust

```bash
sh <(curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs)
source "$HOME/.cargo/env"
rustc --version
cargo --version
```

### Codex·Ponytail

```bash
sh <(curl -fsSL https://chatgpt.com/codex/install.sh)
codex --version
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
codex plugin list
```

### Ruby·CocoaPods

```bash
brew install rbenv
```

아래 줄을 `~/.zshrc`에 추가하고 새 터미널을 엽니다.

```bash
eval "$(rbenv init - zsh)"
```

확인합니다.

```bash
type rbenv
```

CocoaPods 사용 프로젝트는 Gemfile에 선언한 버전을 설치·확인합니다.

```bash
bundle install
bundle exec pod --version
```

### CMake·minicom

Intel·Ventura는 설치 지원이 제한될 수 있습니다.

```bash
brew install cmake minicom
cmake --version
minicom --version
```

### Android·Flutter

[Android Studio](https://developer.android.com/studio)를 설치하고 SDK Manager에서 Command-line Tools·Platform-Tools를 추가합니다. 기본 SDK 경로를 쓰는 경우 `~/.zshrc`에 다음을 추가합니다.

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
adb --version
```

### iOS

전체 Xcode와 라이선스·최초 실행은 **Homebrew 설치 전에 위 절차대로** 완료합니다. 설치 상태를 확인합니다.

```bash
DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -version
```

CocoaPods 사용 프로젝트는 위 Ruby·CocoaPods 절차를 진행합니다.

### Docker Desktop

[Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/)을 설치하고 실행한 뒤 확인합니다.

```bash
docker version
docker compose version
```

### Unity

[Unity Hub](https://unity.com/download)를 설치하고 프로젝트가 요구하는 Editor를 추가합니다.

프로젝트별 JDK·Android SDK·Flutter·Node 버전은 프로젝트 설정에 맞춥니다. 상세한 버전 선택과 문제 해결은 [Tools 목록](../01.Tools/README.md)에서 확인합니다.

## 완료 확인

- [ ] 새 터미널에서 설치 버전을 확인했다.

```bash
brew --version
node --version
uv --version
fvm --version
rustc --version
codex --version
```
- [ ] 필요한 앱에서 Android SDK·Xcode·Docker 실행을 확인했다.
- [ ] 기존 설치와 중복되지 않고 셸·PATH·개인 설정이 보존된다.

도구 인식 확인은 프로젝트 빌드·실행·배포 성공과 별개입니다.

## 프로젝트 시작·업데이트

새 프로젝트는 [보일러플레이트 유형별 시작 가이드](../02.Boilerplates/README.md#처음-실행하는-순서)로 이동합니다. 기존 프로젝트는 README·CI·버전 파일·잠금 파일로 요구 환경을 복원하며 초기 설정을 이유로 SDK·의존성을 일괄 갱신하지 않습니다. 각 도구의 일상 사용·업데이트·복귀·삭제는 연결한 Tools 문서에서 관리합니다. 프로젝트 환경 변수·자격증명·데이터는 별도 보존하고 다른 OS의 node_modules·.venv·네이티브 빌드 결과를 복사하지 않습니다.

macOS 자체 갱신은 [OS 업데이트·보존](../01.Tools/shell-environment.md#os-업데이트와-보존)을 확인합니다.
