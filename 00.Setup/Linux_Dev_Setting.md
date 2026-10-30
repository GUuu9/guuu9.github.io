<!-- version: v2.1.0 -->
# Linux 개발 도구 초기 설치 (Ubuntu / Debian)

지원 중인 Ubuntu LTS 또는 Debian의 **x86_64 데스크톱·bash**를 기준으로 합니다. 개인 PC의 일반 사용자 터미널에서 임의 디렉터리에서 실행하며 `sudo`가 붙은 명령만 관리자 권한이 필요합니다. ARM·다른 배포판은 별도 지원 확인이 필요합니다. Docker Desktop·Android Studio의 Linux ARM 지원을 전제하지 않습니다.

macOS와 동일하게 **0~8절 초기 설치 → 도구 인식 확인 → 프로젝트 작업 안내 → 업데이트** 순서입니다. 아직 프로젝트 폴더·가상환경·잠금 파일이 필요하지 않으며 TypeScript·React·Electron은 전역 설치하지 않습니다. 기존 도구는 `command -v`·`which -a`로 경로를 먼저 확인합니다.

## 0. OS·기본 도구·셸·폰트 준비

개인 PC 터미널에서 배포판·CPU를 확인하고 기본 도구를 설치합니다. OS 전체 업그레이드는 아래 초기 설치와 분리합니다.

```bash
cat /etc/os-release
uname -m
sudo apt update
sudo apt install build-essential git curl ca-certificates unzip xz-utils zip fontconfig
```

### bash와 선택적 Oh My Zsh

기본 명령은 bash와 `~/.bashrc` 기준입니다. zsh를 사용할 때만 `sudo apt install zsh` 후 `zsh`를 실행합니다. Oh My Zsh를 추가한다면 [공식 설치 안내](https://github.com/ohmyzsh/ohmyzsh#basic-installation)에 따라 기존 설정을 보존합니다. 아래는 **zsh 터미널**에서 실행합니다.

```zsh
touch ~/.zshrc
cp -p ~/.zshrc ~/.zshrc.backup-$(date +%Y%m%d-%H%M%S)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc --skip-chsh
```

`--keep-zshrc`는 초기화 블록을 자동 추가하지 않습니다. 기존 `~/.zshrc`에 아래 블록이 없으면 한 번만 추가한 뒤 새 zsh에서 `type omz`를 확인합니다. 로그인 셸은 위 명령으로 변경하지 않습니다. 터미널의 셸 설정에서 zsh를 선택할 경우도 기존 PATH·nvm 설정을 보존합니다.

```zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source "$ZSH/oh-my-zsh.sh"
```

테마·플러그인·백업·복귀는 [Oh My Zsh 가이드](../01.Tools/oh-my-zsh.md)를 참고합니다. 아래 nvm 설치는 bash용이므로 zsh를 선택했다면 `PROFILE="$HOME/.zshrc"`로 바꾸고 `source ~/.zshrc`로 적용합니다. 두 셸에서 nvm을 사용할 경우 각 셸에 초기화가 필요하며 같은 파일에 중복 추가하지 않습니다.

### 환경 변수·PATH 적용 위치

설치기의 경로 안내를 우선합니다. `PATH`에는 실행 파일이 있는 폴더를 추가하고 기존 값을 보존합니다. bash의 대화형 터미널은 `~/.bashrc`, 선택한 zsh는 `~/.zshrc`에 설정하며 편집 전 기존 파일을 백업합니다. 로그인 bash는 `.bash_profile`·`.bash_login`·`.profile` 중 먼저 찾은 파일을 읽으므로, 로그인 셸에서만 경로가 없으면 기존 파일의 `.bashrc` 로딩 여부부터 확인합니다.

uv 등이 실제로 `~/.local/bin`에 설치되어 있고 PATH에 없다면 다음 한 줄을 선택한 셸 설정 파일에 한 번만 추가합니다. 터미널에만 입력한 `export`는 현재 셸과 이후 자식 프로세스에만 적용됩니다.

```bash
export PATH="$HOME/.local/bin:$PATH"
```

새 터미널에서 `printf '%s\n' "$PATH"`와 설치한 도구의 `command -v uv` 등으로 확인합니다. VS Code도 완전히 종료한 뒤 새로 열어 통합 터미널을 확인합니다. GUI 앱·비대화형 작업이 `.bashrc`를 항상 읽는다고 가정하지 않습니다. 기존 PATH를 통째로 교체하거나 nvm의 특정 Node 버전 경로를 영구 고정하지 않습니다. SDK·JDK 설정은 [FVM 환경 변수 안내](../01.Tools/fvm.md#android-프로젝트-연결환경-변수)를 따릅니다. 토큰은 셸 설정·공유 로그에 넣지 않습니다.

셸 로딩 규칙 확인일: 2026-10-30. [Bash 시작 파일](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files) · [zsh 시작 파일](https://zsh.sourceforge.io/Doc/Release/Files.html).

### D2Coding 설치·터미널 적용

[NAVER 공식 릴리스](https://github.com/naver/d2-coding-font/releases)에서 사용하던 D2Coding Ver 1.x 배포본을 받아 압축을 풉니다. 실제 세부 버전·패밀리 이름을 확인하고 사용할 TTF 또는 TTC 한 형태만 선택합니다. 배포판 폰트 뷰어로 사용자 설치하거나 사용자 폰트 디렉터리 `~/.local/share/fonts`에 폰트 파일을 복사합니다. 기존 같은 패밀리의 폰트를 중복 설치하지 않습니다.

```bash
mkdir -p ~/.local/share/fonts
fc-cache -f ~/.local/share/fonts
fc-list : family | sort -u
```

위 캐시 갱신은 파일을 복사한 뒤 실행합니다. GNOME Terminal은 **Preferences → Profiles → 사용할 프로파일 → Text → Custom font**에서 D2Coding을 선택합니다. 다른 터미널은 해당 앱의 폰트 설정을 사용합니다. 앱을 재시작하고 한글·영문·숫자를 확인합니다. 폰트 원본·기존 앱 설정은 보관합니다. [Fontconfig 사용자 폰트 경로](https://fontconfig.pages.freedesktop.org/fontconfig/fontconfig-user.html) · [GNOME Terminal 폰트](https://help.gnome.org/gnome-terminal/app-fonts.html).

## 1. VS Code

[공식 Linux 설치 안내](https://code.visualstudio.com/docs/setup/linux)에 따라 CPU에 맞는 `.deb`를 설치하고 업데이트 저장소 추가 안내를 적용합니다. 새 터미널에서 `code --version`을 확인합니다.

[공통 편집기 설정](../01.Tools/editor-setup.md)에 따라 `Ctrl+Shift+P`의 표시 언어 구성으로 한국어를 선택하고 D2Coding을 편집기·통합 터미널에 각각 적용합니다. ESLint·Prettier·Python·Python Debugger·Flutter·C/C++·CMake Tools·rust-analyzer·Unity·Dev Containers 확장은 필요한 작업만 선택합니다. 포맷·린트는 프로젝트 설정을 우선합니다.

## 2. Node.js: nvm + npm

[공식 nvm 설치 스크립트](https://github.com/nvm-sh/nvm#installing-and-updating)를 사용합니다. 아래는 **bash** 기준입니다.

```bash
touch ~/.bashrc
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | PROFILE="$HOME/.bashrc" bash
source ~/.bashrc
command -v nvm
nvm install --lts
node --version
npm --version
```

LTS는 프로젝트가 없는 초기 기본값입니다. apt의 Node와 중복 설치하거나 `sudo npm`을 사용하지 않습니다. 프로젝트별 버전 선택은 [nvm](../01.Tools/nvm.md#macoslinux-기본-흐름)에서 진행합니다.

## 3. Python 관리 도구: uv

[공식 독립 설치 안내](https://docs.astral.sh/uv/getting-started/installation/)를 사용합니다.

```bash
curl -LsSf https://astral.sh/uv/0.13.6/install.sh | sh
```

설치기의 PATH 안내를 적용하고 새 터미널에서 `command -v uv`·`uv --version`을 확인합니다. 아직 Python 버전 설치·`.venv` 생성은 하지 않습니다. 시스템 Python과 전역 pip는 변경하지 않습니다. 프로젝트 복원은 [uv](../01.Tools/uv.md)·[venv](../01.Tools/venv.md)를 따릅니다.

## 4. Flutter 도구: FVM·Android Studio

[공식 FVM 설치 안내](https://fvm.app/documentation/getting-started/installation)에 따라 설치합니다.

```bash
curl -fsSL https://fvm.app/install.sh | bash
```

설치기의 PATH를 적용하고 새 터미널에서 `fvm --version`을 확인합니다. SDK 사전 다운로드가 필요하면 프로젝트가 요구하는 버전을 `fvm install 버전`으로 받되, 프로젝트가 없는 폴더에서 `fvm use`로 `.fvmrc`를 만들지 않습니다. Intel Mac 전용 Flutter 3.35.7 고정을 Linux 전체에 적용하지 않습니다.

[Android Studio 공식 설치 안내](https://developer.android.com/studio/install#linux)의 OS·CPU·라이브러리 조건을 확인해 Linux 배포판을 설치하고 처음 실행합니다. SDK Manager에서 Command-line Tools·Platform-Tools를 준비하고 SDK 경로를 기록합니다. 프로젝트별 SDK Platform·Build-Tools·NDK·CMake는 복원 단계에서 선택합니다. AVD·에뮬레이터 이미지는 사전 설치하지 않습니다.

JDK는 Android Studio 포함 버전을 우선하되 프로젝트 Gradle·AGP 요구 조건을 확인합니다. [공통 폰트 안내](../01.Tools/editor-setup.md#android-studio-편집기콘솔터미널-폰트)를 적용합니다. Android 실기기는 개발자 옵션·USB 디버깅·연결 허용을 준비하고 [공식 실기기 안내](https://developer.android.com/studio/run/device#setting-up)의 Linux 사용자 권한·udev 규칙을 따릅니다. adb를 상시 root로 실행해 우회하지 않습니다.

## 5. C/C++·Rust·Unity 도구

C/C++가 필요하면 개인 PC 터미널에서 `sudo apt install cmake pkg-config` 후 `gcc --version`·`cmake --version`을 확인합니다. 프로젝트 빌드 디렉터리는 아직 만들지 않습니다. [툴체인 가이드](../01.Tools/cpp-toolchain.md)를 참고합니다.

Rust는 [공식 rustup](https://rust-lang.org/tools/install/)으로 설치합니다.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup show
```

Unity가 필요하면 [공식 Hub Linux 설치 안내](https://docs.unity.com/en-us/hub/install-hub)의 배포판 지원 조건에 따라 Hub를 설치하고 실행만 확인합니다. 프로젝트 Editor와 빌드 모듈은 이후 선택합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다.

## 6. Docker Desktop 설치

[공식 Linux 지원 조건](https://docs.docker.com/desktop/setup/install/linux/)에서 지원 배포판·x86_64·KVM 조건을 확인한 뒤 해당 [Ubuntu](https://docs.docker.com/desktop/setup/install/linux/ubuntu/) 또는 [Debian](https://docs.docker.com/desktop/setup/install/linux/debian/) 패키지 설치 절차를 따릅니다. 앱을 실행해 엔진이 준비된 뒤 확인합니다.

```bash
docker context ls
docker context show
docker version
docker compose version
docker run --rm hello-world
```

Desktop은 별도 VM·`desktop-linux` context를 사용하며 호스트 Engine의 이미지·컨테이너·볼륨을 자동 공유하지 않습니다. 포트 충돌을 피하도록 사용할 엔진을 구분합니다. GUI 없는 서버에는 Desktop 대신 [Docker Engine](https://docs.docker.com/engine/install/)과 [서버 가이드](../04.Servers/docker-server/README.md)를 사용합니다. WSL에서는 Windows Docker Desktop 통합을 사용하며 Linux Desktop을 중복 설치하지 않습니다.

## 7. Codex CLI·Ponytail

[OpenAI 공식 CLI 안내](https://learn.chatgpt.com/docs/codex/cli)의 독립 설치 방식을 사용합니다.

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

설치기의 PATH를 적용하고 새 터미널에서 `codex --version`·`codex`로 실행해 인증합니다. 토큰을 저장소에 기록하지 않습니다. npm 설치를 유지한다면 해당 Node 환경의 전역 패키지와 구분하고 두 설치 방식을 중복 적용하지 않습니다.

Node 설치·Codex 인증 후 [Ponytail 설치·훅 활성화·스킬 호출](../01.Tools/codex.md#ponytail-스킬-추가)을 진행합니다. GUI 앱·비대화형 훅에서도 Node PATH를 확인합니다.

## 8. 초기 설치 완료 확인

- [ ] PATH 변경 후 부모 앱을 재시작하고 새 터미널에서 실행 경로를 확인했다.
- [ ] 새 터미널과 VS Code 통합 터미널에서 필요한 code·nvm·node·npm·uv·fvm·codex를 인식한다.
- [ ] D2Coding·VS Code 한국어와 Android Studio의 폰트 설정을 확인했다.
- [ ] zsh·Oh My Zsh를 선택했다면 초기화·PATH·nvm 설정이 유지된다.
- [ ] Android Studio의 SDK Manager가 열리고 실기기 연결 권한을 준비했다.
- [ ] C/C++·Rust·Unity를 사용한다면 컴파일러·관리 도구·Hub가 준비되었다.
- [ ] Docker를 사용한다면 Client·Server·Compose와 hello-world를 확인했다.
- [ ] Ponytail을 사용한다면 스킬 목록·훅 상태를 확인했다.

여기까지는 초기 도구 인식 확인이며 기존 프로젝트 실행 성공은 다음 단계에서 판단합니다.

## 프로젝트 작업 안내

프로젝트를 내려받은 뒤 README·CI·버전 파일·잠금 파일을 우선합니다. 복원 중 의존성을 일괄 갱신하거나 잠금 파일을 삭제하지 않습니다. 다른 OS·CPU의 `node_modules`·`.venv`·네이티브 빌드 결과를 복사하지 않습니다.

| 작업 | 상세 절차 |
| :--- | :--- |
| TypeScript·React·Electron·서버 | [nvm·npm](../01.Tools/nvm.md): 요구 Node 선택·npm ci·프로젝트 실행/테스트/빌드 |
| Python | [uv](../01.Tools/uv.md)·[venv](../01.Tools/venv.md): 요구 Python·잠금 파일·인터프리터 복원 |
| Flutter·Android | [FVM](../01.Tools/fvm.md#기존-프로젝트-복원): SDK 고정·pub get·doctor·실기기 확인 |
| C/C++ | [툴체인·프리셋·별도 빌드 경로](../01.Tools/cpp-toolchain.md) |
| Rust | [rustup·프로젝트 툴체인](../01.Tools/rustup.md) |
| 컨테이너 | [Docker·Compose·Dev Containers](../01.Tools/docker.md) |

Flutter 프로젝트의 SDK 복원 후에는 [FVM의 Android 프로젝트 연결·환경 변수](../01.Tools/fvm.md#android-프로젝트-연결환경-변수)에서 SDK·JDK 경로, 라이선스·기기 탐지·실행과 VS Code 연동을 확인합니다.

**iOS 로컬 빌드·서명·실기기 검증은 Mac·Xcode에서 수행합니다.** Linux Docker로 macOS·Windows용 네이티브 패키징 전체를 대체하지 않습니다.

### Unity 프로젝트

Hub에서 로그인·라이선스를 활성화하고 `ProjectSettings/ProjectVersion.txt`의 정확한 Editor·빌드 모듈을 설치합니다. Unity Android SDK·NDK·OpenJDK는 Hub 모듈을 우선하며 Flutter용 경로로 덮어쓰지 않습니다. External Tools에서 VS Code를 선택하고 Microsoft Unity 확장을 연동합니다. 컴파일·Play Mode·대상 빌드를 확인합니다. [Unity Hub 문서](https://docs.unity.com/en-us/hub).

### 완료 판단

사용하는 프로젝트의 실행·테스트·빌드와 Android 실기기·Docker 서비스 접속을 확인하고 `git diff`로 의도치 않은 버전·잠금 파일 변경을 점검합니다. 환경 변수·외부 서비스·서명 자격증명은 별도 복원이 필요할 수 있습니다.

## OS·앱·관리 도구 업데이트

초기 설치와 분리해서 진행합니다. 먼저 작업·데이터·셸 설정과 도구 버전을 보관합니다. 개인 PC 터미널에서 배포판 저장소의 갱신 내용을 확인합니다.

```bash
sudo apt update
apt list --upgradable
sudo apt upgrade
```

OS 메이저 업그레이드는 지원 중인 [Ubuntu](https://ubuntu.com/desktop/docs/en/latest/how-to/upgrade-ubuntu-desktop/)·[Debian](https://www.debian.org/releases/stable/releasenotes) 공식 절차와 프로젝트 호환성을 확인한 뒤 별도 진행합니다. 커널·드라이버 갱신이 요구하면 재시작합니다.

| 도구 | 갱신·복귀 안내 |
| :--- | :--- |
| VS Code | 공식 apt 저장소를 등록했다면 `sudo apt install --only-upgrade code`; 확장은 Extensions에서 갱신 |
| nvm·Node | [nvm](../01.Tools/nvm.md#업데이트복귀제거): nvm 설치 스크립트와 Node 버전 변경 구분 |
| uv | 독립 설치는 `uv self update`; [uv](../01.Tools/uv.md) |
| FVM | 공식 설치 스크립트 재실행; 프로젝트 SDK 변경은 [FVM](../01.Tools/fvm.md#업데이트와-되돌리기) |
| Rust | 관리 도구는 `rustup self update`; 툴체인·crate 변경은 [rustup](../01.Tools/rustup.md#6-업데이트검증복귀) |
| Oh My Zsh | zsh에서 `omz update`; [설정 백업·복귀](../01.Tools/oh-my-zsh.md) |
| Codex·Ponytail | [설치 방식별 업데이트·복귀](../01.Tools/codex.md#codex-cli-업데이트복귀) |
| Android Studio·SDK·Unity Hub | 앱과 SDK Manager·공식 배포 경로에서 갱신. 기존 프로젝트 SDK는 유지 |
| Docker Desktop | 앱·공식 배포판으로 갱신. 볼륨·bind mount 백업 후 엔진·프로젝트 검증; [Docker](../01.Tools/docker.md) |

관리 도구 갱신과 프로젝트 의존성·SDK 갱신을 구분합니다. Node·Python·Flutter·Rust는 새 버전으로 별도 검증한 뒤 버전 파일·CI·잠금 파일을 변경합니다. Unity Editor도 새 버전을 추가 설치해 복사본·별도 브랜치에서 검증하며 복귀 시 이전 Editor와 프로젝트 파일을 함께 복원합니다. Docker DB 데이터는 이미지 버전만 낮춘다고 복원되지 않습니다.

공식 설치 경로·지원 조건과 새 폰트·셸·Codex 절차 확인일: 2026-10-30. Linux 실제 설치·GUI·KVM·USB 연결·프로젝트 복원은 이 문서 작성 환경에서 검증하지 않았습니다.
