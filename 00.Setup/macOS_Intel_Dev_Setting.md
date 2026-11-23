<!-- version: v1.1.0 -->
# macOS Intel 개발 환경 설정

Intel Mac 전용 설정 순서입니다. **시스템 설정 → 일반 → 정보**에서 Intel 프로세서를 확인하고 터미널에서 `uname -m`이 `x86_64`인지 확인합니다. 앱과 패키지는 Intel(x86_64)용 또는 Intel을 포함한 Universal 버전만 선택합니다. Apple Silicon 전용 arm64 버전은 사용하지 않습니다. Apple Silicon은 [Apple Silicon 설정](./macOS_Dev_Setting.md)을 사용합니다. Intel은 macOS·Xcode·도구별 지원 범위가 제한될 수 있습니다.

## 1. 필수 설정

### 셸·Git·컴파일 도구

```bash
# 개인 Mac의 터미널에서 실행
sw_vers
uname -m
xcode-select -p
```

Command Line Tools가 없으면 설치합니다. Git·Clang 확인이 실패하면 다음 단계로 넘어가지 않습니다. iOS 개발에 전체 Xcode가 필요하면 Homebrew보다 먼저 Xcode 설치·라이선스·최초 실행을 완료합니다.

```bash
xcode-select --install
git --version
clang --version
```

```bash
# 전체 Xcode를 설치한 경우
sudo env DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -license
sudo env DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -runFirstLaunch
DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -version
```

### Homebrew

Homebrew 최신 설치 스크립트는 Apple Silicon만 지원하므로 Intel Mac의 신규 설치·재설치에는 사용할 수 없습니다. 기존 설치를 먼저 확인하고, 신규 설치가 필요하면 아래 Intel용 과거 설치기 절차를 따릅니다. 이는 Homebrew 공식 저장소에 남아 있는 과거 설치 스크립트 후보이며 성공이나 패키지 지원을 보장하지 않습니다. 설치가 안 되면 각 도구의 공식 Intel 배포판을 사용합니다.

```bash
# Intel Mac의 일반 사용자 터미널
uname -m
xcode-select -p
command -v brew
brew --version
brew --prefix
```

`uname -m`이 `x86_64`인지 확인합니다. 기존 brew가 있으면 재설치하지 않습니다. `command -v brew`가 경로 없이 끝나도 `/usr/local/bin/brew` 존재와 PATH 누락 여부를 확인합니다. Command Line Tools 경로 조회가 실패하면 설치를 진행하지 말고 앞의 Xcode·Command Line Tools 절차를 먼저 마칩니다.

2026-11-23 확인 기준, 공식 `Homebrew/install`의 커밋 `f4aa1b1ca5b256954dbde0315455fb259cdfc45a`에는 macOS `x86_64` 허용과 `/usr/local` 설치 분기가 남아 있습니다. 최신 설치기가 Intel을 거부할 때 사용하는 과거 설치기 후보이며, 공식 지원 복원이나 모든 Intel Mac에서의 성공을 뜻하지 않습니다. [고정된 공식 스크립트](https://github.com/Homebrew/install/blob/f4aa1b1ca5b256954dbde0315455fb259cdfc45a/install.sh) · [Intel 지원 제거 변경](https://github.com/Homebrew/install/commit/e078684c4a86a34bc1239e1a0ddcb86d7b9c787b).

신규 설치가 필요하면 임시 디렉터리에 스크립트를 내려받고, 실행 전 구문·SHA-256을 확인해 내용을 읽습니다.

```bash
brew_install_dir="$(mktemp -d)"
curl -fL 'https://raw.githubusercontent.com/Homebrew/install/f4aa1b1ca5b256954dbde0315455fb259cdfc45a/install.sh' -o "$brew_install_dir/install.sh"
/bin/bash -n "$brew_install_dir/install.sh"
shasum -a 256 "$brew_install_dir/install.sh"
less "$brew_install_dir/install.sh"
```

확인한 SHA-256은 `12479a24be3f5307eecac7cde670fad7118640f031229e964f544b1367b52a41`입니다. 값이 다르거나 다운로드·문법 검사에 실패하면 실행하지 않습니다. 이 해시는 확인한 파일과의 일치 검사이며 별도 서명 검증은 아닙니다. `less`는 `q`로 종료합니다. 내용을 확인하고 설치를 진행하기로 했다면 같은 터미널에서 실행합니다.

```bash
/bin/bash "$brew_install_dir/install.sh"
```

설치기가 출력한 Next steps를 따릅니다. 성공한 경우 `~/.zprofile` 또는 사용하는 `~/.zshrc` 중 한 곳에 아래를 한 번만 추가하고 새 터미널에서 확인합니다.

```bash
eval "$(/usr/local/bin/brew shellenv)"
```

```bash
brew --prefix
brew doctor
git --version
clang --version
```

`brew --prefix`가 `/usr/local`인지 확인합니다. 설치기가 예상과 다른 동작을 하거나 실패하면 중단합니다. `/usr/local` 전체 삭제·일괄 소유권 변경으로 해결하지 않습니다. `brew doctor`의 경고는 내용을 읽고 해당 항목을 해결합니다. Intel 지원은 제한되어 있으며 각 패키지의 macOS·CPU 지원과 소스 빌드 성공 여부는 별도입니다.

### VS Code·폰트

[VS Code 공식 다운로드](https://code.visualstudio.com/Download)에서 Intel용 앱을 선택해 Applications에 설치합니다. Command Palette에서 `Shell Command: Install 'code' command in PATH`를 실행합니다.

```bash
code --version
```

[D2Coding 공식 릴리스](https://github.com/naver/d2codingfont/releases)에서 폰트를 받아 Font Book으로 설치합니다. VS Code 표시 언어는 `Configure Display Language`에서 Korean을 선택하고 User Settings에 적용합니다.

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

필요한 도구를 프로젝트가 요구하는 버전으로 설치합니다. OS가 지원하지 않는 최신 도구를 강제로 설치하지 않습니다.

### 셸·Node·Python·Flutter·Rust

```bash
# Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc --skip-chsh

# Node.js
PROFILE="$HOME/.zshrc" bash <(curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh)
source ~/.zshrc
nvm install --lts

# Python
sh <(curl -LsSf https://astral.sh/uv/0.13.6/install.sh)

# Flutter
bash <(curl -fsSL https://fvm.app/install.sh)

# Rust
sh <(curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs)
source "$HOME/.cargo/env"
```

```bash
nvm --version
node --version
uv --version
fvm --version
rustc --version
cargo --version
```

설치기 안내의 PATH가 필요하면 `~/.zshrc`에 추가하고 새 터미널에서 확인합니다. Intel Homebrew는 지원이 제한되므로 `brew install`을 필수 설치 경로로 전제하지 않습니다. 기존 Homebrew가 정상 동작하고 패키지가 Intel·현재 macOS를 지원할 때만 사용합니다.

### Android·iOS

Android Studio의 [공식 Intel 지원·다운로드](https://developer.android.com/studio)와 현재 macOS 지원 조건을 확인합니다. SDK Manager에서 Command-line Tools·Platform-Tools와 프로젝트가 요구하는 SDK를 설치합니다. 기본 경로를 사용할 때:

```bash
# ~/.zshrc에 추가
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

```bash
adb --version
```

iOS는 설치한 macOS가 지원하는 Xcode 버전을 사용합니다. CocoaPods가 필요한 프로젝트는 프로젝트 Gemfile의 버전을 따르고 Ruby·Bundler 절차를 확인합니다.

### Docker Desktop

Intel용 Docker Desktop은 macOS 지원 제약이 있습니다. 현재 OS가 설치기 요구 조건에 맞는지 [Intel Docker 설치 안내](../01.Tools/docker.md#intel-ventura의-docker-desktop-4480)와 공식 지원 페이지에서 확인합니다. 조건을 충족할 때만 설치하고, 지원 종료 버전을 장기 개발 환경으로 전제하지 않습니다.

## 3. 설치 확인과 프로젝트 시작

```bash
sw_vers
uname -m
git --version
code --version
```

실제로 설치한 도구만 확인합니다. 프로젝트의 `.fvmrc`, `.nvmrc`, `rust-toolchain.toml`, lock 파일과 지원 OS를 먼저 확인하고, 동작이 확인된 버전 조합을 임의로 올리지 않습니다. 상세 설치·버전 관리와 Intel 제약은 [Tools 목록](../01.Tools/README.md)에서 도구별로 확인합니다. 새 프로젝트는 [보일러플레이트 안내](../02.Boilerplates/README.md)로 진행합니다.
