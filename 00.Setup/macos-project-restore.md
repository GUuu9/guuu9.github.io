<!-- version: v1.0.0 -->
# macOS 기존 프로젝트 복원

[초기 도구 설치](./macOS_Common_Dev_Setting.md)를 완료한 뒤 사용하는 프로젝트 유형의 절만 진행합니다. 프로젝트를 내려받은 후 README·CI·버전 파일·잠금 파일을 읽고 작업 루트를 확인합니다. 명령은 별도 표시가 없으면 **해당 프로젝트 루트**에서 실행합니다. 예시의 버전·기기ID·서비스명은 실제 값으로 바꿉니다.

의존성 업그레이드·잠금 파일 삭제·SDK 일괄 최신화는 복원에 포함하지 않습니다. 다른 PC나 칩에서 node_modules·.venv·네이티브 빌드 결과를 복사하지 않습니다. 도구나 버전을 바꾸려는 경우에는 [업데이트 가이드](./macos-update.md)를 별도로 진행합니다.

## 1. TypeScript·React·Electron·서버

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

## 2. Python

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

## 3. Flutter·Android·iOS 실기기

FVM·Android Studio·Xcode는 초기 설치 가이드에서 준비합니다. 사용 중인 Intel MacBook은 Flutter 3.35.7 고정 기준을 적용하며 [FVM 안내](../01.Tools/fvm.md#intel-macbook의-flutter-버전-고정)에 따라 기존 프로젝트 요구 버전과의 호환성을 먼저 확인합니다.

기존 `.fvmrc`가 있는 프로젝트는:

```bash
fvm install
fvm flutter --version
fvm flutter pub get
```

FVM을 사용하지 않던 프로젝트는 README·CI·기존 개발 환경에서 사용하던 Flutter 버전을 확인한 뒤 `fvm use 버전`으로 지정합니다. `pubspec.yaml`의 Dart SDK 범위만으로 정확한 Flutter 버전을 알 수는 없습니다. 버전 변경은 별도로 검증합니다.

`.fvmrc`는 버전 관리하고 SDK 캐시인 `.fvm/`은 Git에서 제외합니다. VS Code에서 Flutter SDK 경로를 프로젝트의 `.fvm/flutter_sdk`로 지정합니다. 이후 CLI는 `fvm flutter`와 `fvm dart`를 사용합니다.

### Android 프로젝트 연결

SDK Manager에서 프로젝트의 compileSdk·빌드 설정에 맞는 Android SDK Platform·Build-Tools를 추가합니다. NDK·CMake는 프로젝트나 플러그인이 요구하는 정확한 버전을 설치합니다. 에뮬레이터는 필요할 때만 추가합니다. USB 실기기를 연결한 후:

```bash
fvm flutter doctor --android-licenses
fvm flutter doctor -v
fvm flutter devices
```

Android Studio의 포함 JDK를 우선 사용합니다. 기존 Gradle·Android Gradle Plugin이 호환되지 않으면 프로젝트 요구 JDK를 별도로 선택합니다. SDK가 탐지되지 않을 때만 `fvm flutter config --android-sdk "$HOME/Library/Android/sdk"`로 실제 설치 경로를 지정합니다.

[Flutter Android 실기기 설정](https://docs.flutter.dev/platform-integration/android/setup)

### iOS 프로젝트 연결

CocoaPods가 필요한 프로젝트에서 Gemfile이 없다면 사용 가능한 Homebrew 환경에서 `brew install cocoapods`로 설치합니다. Homebrew가 없는 경우 프로젝트가 요구하는 Ruby·CocoaPods 구성 방법부터 확인합니다.

기존 프로젝트에 `Gemfile`이 있으면 CocoaPods는 해당 Ruby·Bundler 버전을 따릅니다. 시스템 Ruby에 `sudo gem install`하는 방식은 기본 절차에서 제외합니다.

iPhone을 연결하고 컴퓨터 신뢰·Developer Mode를 설정합니다. 실기기 실행 시 Xcode에서 개발 계정과 프로젝트 Signing Team을 선택하고 서명을 구성합니다. 계정·인증서는 문서에 기록하지 않습니다.

```bash
fvm flutter doctor -v
fvm flutter devices
```

목록의 기기 ID로 `fvm flutter run -d 기기ID`를 실행합니다. iOS 서명과 플러그인 빌드까지 성공해야 복원이 완료됩니다. 시뮬레이터가 필요해지면 Xcode에서 런타임을 별도로 추가합니다.

[Flutter iOS 실기기 설정](https://docs.flutter.dev/platform-integration/ios/setup)

## 4. C/C++

Command Line Tools의 Clang과 [초기 설치에서 준비한](./macOS_Common_Dev_Setting.md) CMake·pkgconf를 사용합니다. `CMakePresets.json`과 프로젝트의 툴체인·라이브러리 설치 절차를 우선합니다. 프리셋이 없는 일반적인 CMake 프로젝트의 예시는 다음과 같습니다.

```bash
cmake -S . -B build
cmake --build build
```

다른 칩에서 생성한 CMake 캐시·빌드 디렉터리는 재사용하지 않습니다. Intel 전용 라이브러리 때문에 실패하면 의존성의 아키텍처부터 확인합니다.

## 5. Rust

프로젝트의 `rust-toolchain.toml` 또는 `rust-toolchain`을 우선합니다. 잠금 파일이 있는 기존 프로젝트에서:

```bash
cargo build --locked
cargo test --locked
```

## 6. Unity C#

설치한 Unity Hub에서 로그인·라이선스를 활성화합니다. 프로젝트의 `ProjectSettings/ProjectVersion.txt`에 기록된 정확한 Editor 버전을 Hub에서 설치합니다. 프로젝트를 최신 Editor로 자동 업그레이드하지 않습니다.

빌드 대상에 필요한 모듈만 추가합니다. Unity Android 개발에 쓰는 SDK·NDK·OpenJDK는 해당 Editor의 Hub 모듈을 우선하며 Flutter용 경로로 일괄 덮어쓰지 않습니다. iOS는 Xcode도 필요합니다.

Unity의 External Tools에서 VS Code를 외부 에디터로 선택하고 Microsoft Unity 확장의 요구 조건에 맞춰 연동합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다. 확장·프로젝트가 요구하면 해당 SDK를 추가합니다.

확인은 프로젝트 열기 → 컴파일 오류 확인 → Play Mode → 필요한 대상 빌드 순으로 진행합니다. [Unity Hub 문서](https://docs.unity.com/en-us/hub)

## 7. Docker 프로젝트

프로젝트에 Compose 설정이 있으면 README에 따라 환경 변수 파일을 준비하고 실행합니다.

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=100
```

중지는 `docker compose down`으로 합니다. 데이터가 필요하면 볼륨을 삭제하는 `down -v`는 사용하지 않습니다. 컨테이너 셸 연결은 `docker compose exec 서비스명 sh`로 진행합니다.

Apple Silicon에서는 arm64 또는 멀티 아키텍처 이미지를 우선합니다. amd64 전용 이미지는 필요할 때만 `--platform linux/amd64`를 사용하며, 에뮬레이션으로 실행·빌드가 모두 보장되지는 않습니다. 호스트의 `node_modules`·`.venv`를 컨테이너에서 재사용하지 않습니다.

Dev Containers 설정이 있는 프로젝트는 VS Code에서 해당 설정을 재사용합니다. 상세 구성은 [Docker 개발 환경 문서](../04.Servers/docker-server/guides/docker_container_setup.md)를 참고합니다.

## 8. 프로젝트 복원 완료 확인

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
