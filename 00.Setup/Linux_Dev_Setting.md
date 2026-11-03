<!-- version: v5.0.0 -->
# Linux 개발 환경 설정 (Ubuntu / Debian)

Ubuntu·Debian 데스크톱 x86_64 기준입니다. 다른 배포판·ARM은 패키지와 지원 버전을 확인합니다. WSL은 Windows VS Code·Docker Desktop 통합을 쓰며 Linux GUI 앱을 중복 설치하지 않습니다. 명령은 개인 사용자 터미널에서 실행하고 `sudo`가 붙은 설치만 관리자 권한으로 수행합니다.

## 1. 기본 패키지·PATH

```bash
cat /etc/os-release
uname -m
sudo apt update
sudo apt install git curl ca-certificates unzip xz-utils zip build-essential cmake pkg-config minicom fontconfig
```

새 터미널에서 확인합니다.

```bash
git --version
gcc --version
cmake --version
```

uv·FVM 등 설치기가 `~/.local/bin`을 안내하고 PATH에 없을 때만 `~/.bashrc`에 한 번 추가합니다. 새 터미널에서 `command -v uv`로 확인합니다.

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## 2. 편집기·터미널

[VS Code 공식 Linux 설치 안내](https://code.visualstudio.com/docs/setup/linux)에서 배포판에 맞는 `.deb`를 내려받습니다. 다운로드 폴더에서 실제 파일명으로 설치·확인합니다.

```bash
sudo apt install ./실제파일명.deb
code --version
```

`Configure Display Language`에서 Korean을 선택합니다. [D2Coding 공식 릴리스](https://github.com/naver/d2codingfont/releases)의 폰트를 풀어 TTF/TTC 파일을 `~/.local/share/fonts`에 복사하고 캐시를 갱신합니다.

```bash
mkdir -p ~/.local/share/fonts
cp D2Coding*.ttf ~/.local/share/fonts/
fc-cache -f
fc-list : family | grep D2Coding
```

VS Code User Settings에 적용합니다.

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

```bash
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc --skip-chsh
```

Oh My Zsh 설치 후 기존 `~/.zshrc`에 다음 블록을 한 번 추가합니다.

```bash
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source "$ZSH/oh-my-zsh.sh"
```

새 zsh에서 설치 상태를 확인합니다.

```bash
type omz
```

## 3. 개발 도구

아래 CLI 설치 명령은 공식 설치 경로입니다. 설치 후 새 터미널에서 버전을 확인합니다.

### Node.js

```bash
PROFILE="$HOME/.bashrc" bash <(curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh)
source ~/.bashrc
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

설치기 안내의 PATH를 `~/.bashrc`에 추가하고 새 터미널에서 확인합니다.

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

### Docker Desktop

[공식 설치 안내](https://docs.docker.com/desktop/setup/install/linux/)에서 `.deb`를 내려받고 해당 파일이 있는 폴더에서 설치합니다.

```bash
sudo apt install ./docker-desktop-amd64.deb
```

Docker Desktop을 실행한 뒤 확인합니다.

```bash
docker version
docker compose version
```

### Unity

[Unity Hub](https://unity.com/download)를 설치하고 프로젝트가 요구하는 Editor를 추가합니다.

Android Studio는 [공식 Linux 설치 안내](https://developer.android.com/studio/install#linux)에 따라 설치합니다. SDK Manager에서 Command-line Tools·Platform-Tools를 설치하고 **Settings → Languages & Frameworks → Android SDK**에서 SDK 경로를 확인합니다. Flutter에서 CLI가 SDK를 찾지 못하면 실제 경로를 `~/.bashrc`에 추가합니다.

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
adb --version
```

## 완료 확인

```bash
git --version
node --version
npm --version
uv --version
fvm --version
rustc --version
codex --version
minicom --version
```

프로젝트별 버전은 저장소의 설정 파일을 따릅니다. 새 프로젝트는 [보일러플레이트 시작 가이드](../02.Boilerplates/README.md#처음-실행하는-순서), 상세한 도구 사용·업데이트는 [Tools 목록](../01.Tools/README.md)을 참고합니다. iOS 로컬 빌드는 Mac·Xcode가 필요합니다.
