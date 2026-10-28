<!-- version: v1.0.0 -->
# Linux 개발 환경 복원·업데이트 (Ubuntu / Debian)

확인일: 2026-10-28. 지원 중인 Ubuntu LTS 또는 Debian의 데스크톱 환경을 기준으로 합니다. 명령은 bash 기준입니다. 다른 배포판·ARM 환경은 패키지와 Docker Desktop·Android Studio·Unity의 지원 여부를 먼저 확인합니다.

## 1. OS·빌드 도구·VS Code

```bash
cat /etc/os-release
uname -m
sudo apt update
apt list --upgradable
sudo apt upgrade
sudo apt install build-essential git curl ca-certificates unzip xz-utils zip cmake pkg-config
```

OS 메이저 업그레이드는 백업과 프로젝트 호환성 확인 후 배포판 공식 절차로 별도 진행합니다. 설치·업데이트가 재시작을 요구하면 재시작합니다.

[VS Code 공식 Linux 안내](https://code.visualstudio.com/docs/setup/linux)에 따라 CPU에 맞는 deb 패키지를 설치하고, 업데이트 저장소를 추가하는 안내를 적용합니다. 이후 `sudo apt update`, `sudo apt install --only-upgrade code`로 갱신하고 `code --version`을 확인합니다.

확장은 ESLint·Prettier·Python·Flutter·C/C++·CMake Tools·rust-analyzer·Unity 중 필요한 것만 설치하고 Extensions 화면에서 업데이트합니다. 프로젝트의 포맷·린트 설정을 우선합니다.

## 2. Node.js·uv·FVM·Rust·Codex CLI

### nvm + npm

[공식 nvm 설치 안내](https://github.com/nvm-sh/nvm#installing-and-updating)의 스크립트를 사용합니다.

```bash
touch ~/.bashrc
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | PROFILE="$HOME/.bashrc" bash
source ~/.bashrc
nvm install --lts
node --version
npm --version
```

기존 프로젝트에 `.nvmrc`가 있으면 `nvm install`, `nvm use`를 실행합니다. 없으면 README·engines·CI의 요구 버전으로 `nvm install 버전`, `nvm use 버전`을 실행합니다. apt의 Node.js와 혼용하지 않고 `sudo npm`을 사용하지 않습니다.

nvm 업데이트는 공식 안내에서 최신 릴리스 태그를 확인해 설치 스크립트를 재실행합니다. Node는 `nvm install 목표버전`으로 추가하고 검증 후 `.nvmrc`·CI를 변경합니다. 기본값 변경은 `nvm alias default 버전`, 복귀는 `nvm use 이전버전`입니다.

### uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

설치 안내의 PATH 설정을 적용한 뒤 새 터미널에서 `uv --version`을 확인합니다. 독립 설치한 uv 업데이트는 `uv self update`입니다. [uv 설치·업데이트](https://docs.astral.sh/uv/getting-started/installation/)

가상환경 활성화는 `source .venv/bin/activate`, 종료는 `deactivate`입니다. 시스템 Python과 전역 pip는 변경하지 않습니다.

### FVM

```bash
curl -fsSL https://fvm.app/install.sh | bash
```

설치 결과의 PATH 설정을 적용해 `fvm --version`을 확인합니다. 업데이트도 동일한 스크립트를 사용합니다. [FVM 공식 설치 안내](https://fvm.app/documentation/getting-started/installation)

Android 실기기 접근에 권한 오류가 있으면 배포판의 Android udev 규칙·사용자 권한 설정을 확인합니다. adb를 상시 root로 실행해서 우회하지 않습니다. Unity·Android Studio는 지원되는 배포판·CPU용 공식 패키지로 설치합니다.

### Rust·C/C++

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup show
```

프로젝트 rust-toolchain 파일을 우선하고 잠금 파일이 있으면 `cargo build --locked`, `cargo test --locked`로 확인합니다. C/C++는 프로젝트 CMake 프리셋을 우선합니다. 일반 CMake 프로젝트는 `cmake -S . -B build`, `cmake --build build`로 검증합니다. 빌드 도구 업데이트는 apt로 수행하고 새 빌드 디렉터리에서 확인합니다. [Rust 설치](https://rust-lang.org/tools/install/)

### Codex CLI

[OpenAI 공식 안내](https://learn.chatgpt.com/docs/codex/cli)의 독립 설치 방식을 사용합니다.

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

PATH 안내를 적용한 뒤 `codex --version`, `codex`로 실행하고 인증합니다. 업데이트도 같은 스크립트를 사용합니다. npm 설치를 선택한 경우에는 해당 Node 환경에서 `npm install -g @openai/codex@latest`로 설치·업데이트하며 독립 설치와 중복 적용하지 않습니다.

## 3. Docker Desktop 설치

[Docker Desktop Linux 설치 안내](https://docs.docker.com/desktop/setup/install/linux/)에서 지원 배포판·CPU·KVM 가상화 조건을 확인하고 해당 배포판 패키지와 설치 절차를 따릅니다. GUI 없는 서버는 Desktop 대신 해당 배포판의 Docker Engine 공식 설치 절차를 사용합니다.

Desktop은 별도 VM과 `desktop-linux` context를 사용합니다. 기존 호스트 Engine의 이미지·컨테이너·볼륨이 자동 공유되지 않습니다. `docker context ls`와 `docker context show`로 대상을 확인합니다. 포트 충돌을 피하도록 기존 Engine과 Desktop 중 사용할 환경을 명확히 합니다.

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
