<!-- version: v1.9.1 -->
# FVM 사용 가이드

확인일: 2026-11-02. FVM은 프로젝트별 Flutter SDK 버전을 선택합니다. Flutter SDK에는 Dart가 포함되므로 별도 Dart 버전 관리 도구를 추가하지 않고 `fvm dart`로 프로젝트 버전을 사용합니다.

## 관리하는 것과 필요한 외부 도구

> [!IMPORTANT]
> FVM은 Flutter SDK를 관리하지만 Android SDK·JDK·Xcode·CocoaPods·서명 계정을 설치해 주지는 않습니다. 실기기 환경은 [OS 설정 안내](../00.Setup/OS_Dev_Setting.md)를 먼저 진행합니다. iOS 로컬 빌드·서명에는 Mac과 Xcode가 필요합니다.

## SDK 찾기와 설치

```bash
fvm --version
fvm releases
fvm list
```

releases에서 배포 버전을, list에서 로컬 SDK를 확인합니다. 특정 버전이 필요하면 `fvm install 버전`으로 다운로드합니다. 설치만으로 해당 프로젝트의 버전이 바뀌지는 않습니다.

## 기존 프로젝트 복원

프로젝트 루트에 `.fvmrc`가 있으면:

```bash
fvm install
fvm flutter --version
fvm flutter pub get
fvm flutter doctor -v
fvm flutter devices
```

버전 기록이 없다면 README·CI·이전 개발 PC에서 실제 사용하던 Flutter 버전을 확인해 `fvm use 버전`으로 도입합니다. pubspec.yaml의 Dart 범위만으로 정확한 Flutter 버전을 결정할 수는 없습니다. 기존 프로젝트에 곧바로 최신 stable을 지정하지 않습니다.

Android Studio에서 새 앱을 만들 때는 아래 [프로젝트 생성·SDK 연결](#android-studio에서-새-flutter-프로젝트-생성)을 따릅니다. 기존 프로젝트는 새로 생성하지 않고 해당 프로젝트 루트를 엽니다.

## Android Studio에서 새 Flutter 프로젝트 생성

개인 PC의 macOS·Windows·Linux에서 Android Studio로 Flutter 코드를 작성하거나 새 앱을 만들 때 진행합니다. [OS별 초기 설치](../00.Setup/OS_Dev_Setting.md)의 FVM·Android Studio를 먼저 준비합니다. Android SDK 관리만 한다면 Flutter 플러그인은 필수가 아닙니다.

### Flutter·Dart 플러그인 준비

1. macOS는 **Android Studio → Settings**, Windows·Linux는 **File → Settings**에서 **Plugins → Marketplace**를 엽니다.
2. **Flutter** 플러그인을 설치하고 Dart 플러그인 설치를 요청하면 함께 설치합니다. 이미 설치되어 있으면 활성화 여부만 확인합니다.
3. 안내에 따라 Android Studio를 재시작합니다. Flutter 프로젝트 생성 메뉴가 보이지 않으면 Plugins의 설치·활성화 상태와 현재 IDE 버전의 플러그인 호환성을 확인합니다.

[Flutter 공식 플러그인 설치 안내](https://docs.flutter.dev/tools/android-studio#install-the-flutter-plugin).

### SDK 준비·프로젝트 생성·버전 고정

아래 **3.35.7은 사용 중인 Intel MacBook 기준**입니다. 다른 PC는 OS·개발 도구와 호환되는 목표 Flutter 버전으로 바꾸며 모든 환경에 같은 버전을 강제하지 않습니다. 먼저 프로젝트 밖의 개인 터미널에서 SDK만 설치하고 설치 위치를 확인합니다.

```bash
fvm install 3.35.7
fvm list
```

1. Android Studio의 시작 화면이나 File → New에서 **New Flutter Project**를 선택합니다. IDE 버전에 따라 New Project 창에서 **Flutter**를 선택할 수 있습니다.
2. **Flutter SDK path**에 위에서 설치한 버전의 실제 SDK 루트 폴더를 지정합니다. Android SDK·FVM 실행 파일·Flutter의 `bin` 폴더와 구분합니다. 아직 프로젝트가 없으므로 `.fvm/flutter_sdk` 링크를 이 단계에 사용하지 않습니다.
3. 프로젝트 이름·저장 위치·조직명과 필요한 플랫폼을 선택해 생성합니다. 저장 위치는 새 프로젝트용 경로를 사용하고 기존 프로젝트에 덮어쓰지 않습니다.
4. 생성이 끝나면 **생성된 프로젝트 루트**의 터미널에서 같은 버전을 고정합니다.

```bash
fvm use 3.35.7
fvm flutter --version
```

5. Android Studio의 **Settings → Languages & Frameworks → Flutter → Flutter SDK path**를 이 프로젝트의 `.fvm/flutter_sdk`로 끝나는 **절대 경로**로 바꾸고 Apply를 누릅니다. `.fvmrc`·IDE 표시 버전·위 버전 출력이 같은지 확인합니다. `fvm global` 설정이나 셸 PATH만으로 IDE가 자동 변경된다고 가정하지 않습니다.
6. 아래 [Git에 보관할 파일](#git에-보관할-파일)에 따라 `.fvmrc`를 보관하고 `.fvm/`은 제외합니다. [Android 연결·환경 변수](#android-프로젝트-연결환경-변수) 또는 macOS의 iOS 연결로 이어가 기기에서 실행합니다.

Android Studio의 새 프로젝트 마법사는 **Project location**에 원하는 새 폴더 경로를 입력합니다. 같은 작업은 이미 설치된 FVM 버전으로 부모 폴더에서 생성할 수 있습니다.

```bash
mkdir -p "$HOME/Developer"
cd "$HOME/Developer"
fvm install 3.35.7
fvm spawn 3.35.7 create --empty my_app
cd my_app
fvm use 3.35.7
fvm flutter pub get
```

`$HOME/Developer`와 `my_app`은 예시이므로 원하는 부모 경로·소문자 밑줄 형식의 앱 이름으로 바꿉니다. 대상 폴더가 이미 있으면 덮어쓰지 말고 새 경로를 고릅니다. `.fvmrc`를 만든 뒤 같은 프로젝트 루트를 Android Studio와 VS Code에서 열고 아래 IDE SDK 설정을 확인합니다. DI·MVVM 샘플로 시작하려면 [mobile-app 보일러플레이트](../02.Boilerplates/mobile-app/README.md)의 복사 절차를 사용합니다.

SDK 전환 후 IDE가 이전 버전을 계속 표시하면 저장된 경로가 실제 버전 캐시로 바뀌었는지 확인하고 `.fvm/flutter_sdk` 링크를 다시 지정합니다. 기존 프로젝트도 SDK 복원 후 이 IDE 설정을 적용하되 새 프로젝트 생성 마법사는 실행하지 않습니다.

플러그인 설치·생성·SDK 경로 확인일: 2026-10-30. [Flutter 공식 프로젝트 생성](https://docs.flutter.dev/reference/create-new-app#android-studio) · [FVM의 Android Studio 연동](https://fvm.app/documentation/guides/android-studio). 실제 IDE 조작·프로젝트 생성은 이 문서 작성에서 수행하지 않았습니다.

## Intel MacBook의 Flutter 버전 고정

사용 중인 MacBook은 macOS 버전·개발 도구 호환성을 고려해 **Flutter SDK 3.35.7**을 기존 복원 기준으로 유지합니다(2026-10-30 사용자 환경 기준). 이 값은 설치 가능한 Flutter 버전의 상한을 검증한 결과가 아닙니다. `3.35.7`은 FVM 자체 버전이 아니라 FVM으로 관리하는 Flutter 버전입니다. 이 환경에서는 `stable`이나 최신 버전으로 자동 전환하지 않습니다.

FVM 설치 후 해당 Flutter 프로젝트 루트에서 실행합니다.

```bash
fvm install 3.35.7
fvm use 3.35.7
fvm flutter --version
fvm flutter pub get
fvm flutter doctor -v
fvm flutter analyze
fvm flutter test
```

`.fvmrc`의 선택 버전과 `fvm flutter --version`이 3.35.7인지 확인하고 Android·iOS 실기기 빌드도 확인합니다. 기존 프로젝트가 다른 SDK를 요구하면 `.fvmrc`를 곧바로 덮어쓰지 않고 Dart·패키지·Xcode 호환성을 확인한 뒤 전환합니다. VS Code도 아래 SDK 경로 설정을 사용합니다.

이 고정은 해당 MacBook의 환경 기준이며 모든 Intel Mac의 공식 최종 지원 버전을 뜻하지 않습니다. OS·Xcode 환경을 바꿔 버전을 올릴 때는 실기기 검증 후 고정을 변경합니다. [Flutter SDK 아카이브](https://docs.flutter.dev/install/archive), [FVM 버전 선택 명령](https://fvm.app/documentation/guides/basic-commands).

## Git에 보관할 파일

| 파일 | 관리 방법 |
| :--- | :--- |
| `.fvmrc` | 프로젝트 Flutter 선택 정보이므로 커밋 |
| `.fvm/` | SDK 링크·캐시이므로 gitignore |
| pubspec.yaml | 직접 의존성·SDK 조건을 커밋 |
| pubspec.lock | 앱 프로젝트의 실제 의존성 버전으로 커밋 |
| `.vscode/settings.json` | 팀 공용 SDK 경로만 검토해 공유 |

`.fvm/` 안에 소스·비밀키를 보관하지 않습니다. 기존 `.gitignore`에 규칙이 있는지 확인하고 필요한 경우 `.fvm/`을 추가합니다.

## VS Code 연동과 일상 작업

Flutter 확장을 설치하고 프로젝트 설정의 SDK 경로를 `.fvm/flutter_sdk`로 지정합니다. 기존 settings.json에 아래 키를 병합하며 다른 설정을 덮어쓰지 않습니다.

```json
{
  "dart.flutterSdkPath": ".fvm/flutter_sdk"
}
```

SDK를 전환한 뒤 IDE가 이전 버전을 사용하면 창·Dart 분석 서버를 다시 로드하고 SDK 표시를 확인합니다. 터미널은 전역 flutter 대신 아래처럼 실행합니다.

```bash
fvm flutter analyze
fvm flutter test
fvm flutter run -d 기기ID
fvm dart --version
```

Android 기기 빌드 확인은 `fvm flutter build apk`, iOS는 Mac에서 프로젝트 서명 설정 후 `fvm flutter build ios`를 사용합니다. 프로젝트 flavor·환경 인자가 있으면 README대로 추가합니다.

## Android 프로젝트 연결·환경 변수

macOS·Windows·Linux 모두 위 [기존 프로젝트 복원](#기존-프로젝트-복원)으로 SDK 선택·pub get을 마친 뒤 진행합니다. Android Studio SDK Manager에서 프로젝트 compileSdk·빌드 설정에 맞는 SDK Platform·Build-Tools를 추가합니다. NDK·CMake는 프로젝트나 플러그인이 요구하는 버전을 선택하고 AVD·시스템 이미지는 필요할 때만 설치합니다. USB 드라이버·udev 권한 등 OS별 준비는 [Setup](../00.Setup/OS_Dev_Setting.md)을 따릅니다.

FVM은 Flutter SDK만 선택하며 Gradle·AGP·JDK·Android SDK를 함께 고정하지 않습니다. 기존 프로젝트의 Wrapper·플러그인 선언·CI를 우선하고 실제 JDK는 `fvm flutter doctor -v`로 확인합니다. mobile-app 샘플을 적용하는 경우의 상세 예시는 [프로젝트 Android 빌드 관리](../02.Boilerplates/mobile-app/docs/android-build.md)에 있습니다.

### Android SDK·JDK 경로 선택

SDK Manager에 표시된 **Android SDK Location**이 기준입니다. 아래는 기본 설치 경로 예시이며 실제 경로가 다르면 바꿉니다.

| OS | SDK 경로 예시 | 영구 설정 위치 |
| :--- | :--- | :--- |
| macOS | `$HOME/Library/Android/sdk` | 사용하는 zsh의 `~/.zshrc` |
| Linux | `$HOME/Android/Sdk` | bash는 `~/.bashrc`, zsh는 `~/.zshrc` |
| Windows | `%LOCALAPPDATA%\Android\Sdk` | 사용자 환경 변수 편집 화면 |

SDK를 자동 탐지한다면 별도 환경 변수는 필수가 아닙니다. 다른 CLI가 요구하면 `ANDROID_HOME`에 **SDK 루트**를 지정하고, adb를 경로 없이 실행할 때만 PATH에 그 아래 `platform-tools`를 추가합니다. `ANDROID_SDK_ROOT`는 폐기 예정 변수이므로 새로 추가하지 않습니다. 이미 있다면 두 값이 같은 SDK를 가리키는지 확인합니다.

아래는 **macOS 기본 경로를 현재 zsh에 적용**하는 예시입니다. Linux는 SDK Manager에서 기본 경로를 확인한 뒤 첫 줄을 `export ANDROID_HOME="$HOME/Android/Sdk"`로 바꿉니다. 영구 적용은 OS별 Setup의 환경 변수 안내에 따라 설정 파일에 한 번만 추가합니다.

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
adb --version
```

Windows에서는 아래가 **현재 PowerShell에만** 적용됩니다. 영구 적용은 사용자 변수 `ANDROID_HOME`과 사용자 `Path`의 `%ANDROID_HOME%\platform-tools` 항목으로 설정하고 앱을 재시작합니다.

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:Path"
adb --version
```

환경 변수는 작업 자식 셸이나 해당 프로젝트가 정한 로딩 방식에만 적용하고 다른 프로젝트의 공용 설정은 바꾸지 않습니다. mobile-app의 [환경 정의·격리](../02.Boilerplates/mobile-app/docs/project-environment.md)는 선택 가능한 적용 예시이며 FVM의 선행 조건이 아닙니다. Flutter에서 SDK를 찾지 못할 때도 공용 사용자 설정을 바꾸기 전에 실제 SDK 경로와 프로젝트 로컬 설정을 확인합니다. `JAVA_HOME`을 사용하는 CLI Gradle 작업에서는 프로젝트 Gradle·AGP와 호환되는 **JDK 루트(bin 폴더 아님)**를 지정하고 Android Studio의 Gradle JDK 설정도 맞춥니다. Flutter가 사용하는 JDK는 `fvm flutter doctor -v`로 따로 확인합니다. Android Studio 포함 JDK를 우선하되 모든 프로젝트에 특정 JDK·`JAVA_HOME`을 일괄 강제하지 않습니다.

환경 변수·JDK 선택 확인일: 2026-10-30. [Android 환경 변수](https://developer.android.com/tools/variables) · [Gradle JDK 선택](https://developer.android.com/build/jdks). SDK 경로·개인 환경 설정·인증정보는 프로젝트의 공용 설정으로 커밋하지 않습니다.

### 라이선스·실기기 확인

USB 디버깅·연결 허용과 OS별 권한을 확인한 뒤 프로젝트 루트에서 실행합니다.

```bash
fvm flutter doctor --android-licenses
fvm flutter doctor -v
fvm flutter devices
```

출력에 표시된 실제 기기 ID로 `fvm flutter run -d 기기ID`를 실행합니다. VS Code는 위 [SDK 경로 설정](#vs-code-연동과-일상-작업)을 사용합니다. [Flutter Android 설정](https://docs.flutter.dev/platform-integration/android/setup).

## macOS 실기기 프로젝트 연결

FVM·Android Studio 준비는 [macOS 초기 설치](../00.Setup/macOS_Common_Dev_Setting.md#4-flutter-도구-fvmandroid-studioxcode)를 먼저 완료합니다. Android만 개발한다면 전체 Xcode·CocoaPods·Apple 서명 계정은 필요하지 않습니다. iOS를 개발할 때 Xcode 초기화까지 진행합니다. 아래 작업은 프로젝트를 내려받은 뒤 해당 루트에서 진행합니다. SDK 선택·pub get은 위 [기존 프로젝트 복원](#기존-프로젝트-복원)을 따릅니다.

### Android

개인 MacBook에 Android 휴대폰을 **USB로 직접 연결**해 Flutter 앱을 실행하는 절차입니다. Intel·Apple Silicon 모두 같은 연결 흐름을 사용합니다. 원격 SSH·컨테이너에서 실행하는 Flutter에 Mac의 USB 기기가 자동 전달되는 절차는 아닙니다.

#### 1. Mac의 SDK와 케이블 준비

공통 [Android 프로젝트 연결·환경 변수](#android-프로젝트-연결환경-변수)에 따라 프로젝트 SDK·JDK와 라이선스를 먼저 확인합니다. Android Studio의 **Tools → SDK Manager → SDK Tools**에서 **Android SDK Platform-Tools**가 설치되어 있어야 합니다. `adb`는 여기에 포함되므로 Homebrew로 중복 설치하지 않습니다. macOS는 Windows용 OEM USB 드라이버를 따로 설치하지 않습니다.

충전 전용이 아닌 **데이터 전송이 가능한 케이블**을 준비하고, 처음에는 허브 대신 Mac에 직접 연결합니다. 아래 명령은 Mac의 일반 사용자 터미널에서 실행하며 `sudo`는 사용하지 않습니다. SDK 경로는 SDK Manager의 Android SDK Location을 기준으로 위 환경 변수 절에서 설정합니다.

#### 2. 휴대폰에서 개발자 옵션과 USB 디버깅 허용

1. 휴대폰의 **설정 → 휴대전화 정보 → 빌드 번호**를 7번 누릅니다. Samsung Galaxy는 보통 **휴대전화 정보 → 소프트웨어 정보 → 빌드 번호**에 있으며, 기종·Android 버전에 따라 위치가 다릅니다. 잠금 PIN을 요구하면 휴대폰에서 입력합니다.
2. 설정의 **개발자 옵션 → USB 디버깅**을 켭니다. 부트로더 잠금 해제·OEM 잠금 해제는 이 작업에 필요하지 않습니다.
3. 화면 잠금을 푼 상태로 USB 케이블을 Mac에 연결합니다. 휴대폰에 **USB 디버깅을 허용하시겠습니까?**라는 RSA 승인 창이 나타나면 본인 Mac인지 확인하고 허용합니다. 개인 Mac에서만 필요한 경우 항상 허용을 선택합니다.
4. 승인 창이 바로 나타나지 않으면 다음 단계의 `adb devices -l`을 실행하고 휴대폰 화면을 다시 확인합니다. USB 연결 모드 변경이 필요한 기종은 파일 전송 모드도 확인하되, 파일 전송 허용만으로 디버깅 승인이 완료된 것은 아닙니다.

#### 3. ADB 인식 확인 후 Flutter 실행

Mac의 **Flutter 프로젝트 루트**에서 실행합니다.

```bash
adb devices -l
fvm flutter devices
```

ADB 목록에서 해당 휴대폰의 상태가 `device`이고 Flutter 목록에도 Android 기기가 나타나면 연결된 상태입니다. 기기 ID는 출력된 실제 값을 사용합니다. 아래 `DEVICE_ID`는 바꿔 넣을 자리표시자입니다.

```bash
fvm flutter run -d DEVICE_ID
```

처음 실행하면 프로젝트의 Gradle 의존성 다운로드·빌드·앱 설치에 시간이 걸릴 수 있습니다. 실행 중 터미널에서 `r`은 hot reload, `R`은 hot restart, `q`는 실행 세션 종료입니다. 케이블을 빼도 설치된 앱·앱 데이터는 자동 삭제되지 않습니다.

#### 4. Android Studio·VS Code에서 기기 선택

- **Android Studio**: [프로젝트 SDK 연결](#android-studio에서-새-flutter-프로젝트-생성)을 마친 Flutter 프로젝트에서 실행 대상 목록의 휴대폰을 선택하고 Run을 누릅니다. 에뮬레이터를 새로 만들 필요는 없습니다.
- **VS Code**: [FVM SDK 경로](#vs-code-연동과-일상-작업)를 설정한 프로젝트에서 명령 팔레트의 **Flutter: Select Device**로 휴대폰을 선택하고 F5로 디버깅을 시작합니다. 프로젝트의 기존 launch 설정·flavor·환경 인자가 있으면 그대로 사용합니다.

두 IDE 모두 원격 창이 아닌 **Mac에서 연 로컬 프로젝트 창**을 기준으로 합니다. IDE에 기기가 보이지 않으면 먼저 같은 Mac의 터미널에서 ADB·Flutter 목록을 확인합니다.

#### 5. 연결되지 않을 때 확인 순서

| 증상 | 확인할 내용 |
| :--- | :--- |
| `adb: command not found` | SDK Manager의 Platform-Tools 설치와 `ANDROID_HOME`·PATH를 확인. SDK 기본 경로를 쓴다면 `"$HOME/Library/Android/sdk/platform-tools/adb" devices -l`로 PATH 문제인지 구분 |
| ADB 목록이 비어 있음 | 데이터 케이블·Mac USB 포트·휴대폰 잠금·USB 디버깅을 확인하고 직접 재연결 |
| `unauthorized` | 휴대폰의 RSA 승인 창 확인. 창이 안 뜨면 개발자 옵션에서 USB 디버깅 승인 취소 후 다시 연결·승인. 이 취소는 다른 컴퓨터의 기존 승인에도 영향을 줌 |
| `offline` | 잠금 해제 후 케이블을 다시 연결하고 ADB 목록 재확인 |
| ADB는 `device`, Flutter에는 없음 | `fvm flutter doctor -v`의 Android toolchain 오류와 Flutter가 사용하는 Android SDK 경로를 확인 |
| 기기는 선택되지만 빌드 실패 | 연결 문제와 구분해 Gradle·AGP·JDK·SDK·프로젝트 의존성 오류를 확인. 연결 복구를 위해 Flutter 버전이나 잠금 파일을 임의 변경하지 않음 |

재연결로 해결되지 않으면 Mac에서 아래처럼 ADB 서버를 재시작할 수 있습니다. 실행 중인 **다른 Android 디버깅 세션도 끊어지므로** 작업을 멈춘 뒤 진행합니다.

```bash
adb kill-server
adb start-server
adb devices -l
```

개발을 마치면 IDE·터미널의 디버깅을 종료한 뒤 케이블을 분리합니다. 필요하지 않을 때는 휴대폰의 USB 디버깅을 끄고, 더 이상 신뢰하지 않는 컴퓨터는 USB 디버깅 승인을 취소합니다. Mac의 `~/.android/adbkey*`를 일반 장애 해결의 첫 단계로 삭제하지 않습니다.

USB 연결 절차 확인일: 2026-11-03. 공식 문서와 대조했으며 실제 휴대폰 연결·앱 설치는 수행하지 않았습니다. [Android 실기기 연결·macOS 조건](https://developer.android.com/studio/run/device) · [개발자 옵션·USB 디버깅](https://developer.android.com/studio/debug/dev-options) · [Flutter Android 설정](https://docs.flutter.dev/platform-integration/android/setup).

### iOS

Mac의 호환 Xcode·iOS SDK를 준비하고 `xcodebuild -version`·`fvm flutter doctor -v`로 실제 선택을 확인합니다. 기기 연결·서명은 [Flutter 공식 iOS 설정](https://docs.flutter.dev/platform-integration/ios/setup)을 따릅니다. CocoaPods를 사용하는 기존 프로젝트는 [Ruby·Bundler 공통 관리](./ruby.md)에 따라 Gemfile·lock과 Bundler 실행 규칙, SwiftPM 프로젝트는 해당 패키지 설정을 유지합니다. FVM은 Xcode·의존성 관리자·서명 계정을 관리하지 않습니다.

mobile-app 샘플의 설치·복원·빌드 예시는 [iOS 프로젝트 가이드](../02.Boilerplates/mobile-app/docs/ios-build.md)에 있습니다. 다른 Flutter 앱이 이 보일러플레이트·direnv·별도 실행기를 도입할 필요는 없습니다.

## 업데이트와 되돌리기

FVM 자체는 설치 경로에 맞춰 갱신합니다. macOS 독립 설치는 `curl -fsSL https://fvm.app/install.sh | bash`로 다시 실행하며 fvm --version을 확인합니다. 목표 FVM 버전이 있으면 공식 설치 안내의 버전 인자를 사용합니다. Windows 독립 패키지는 공식 새 패키지로 교체합니다. Homebrew 설치는 해당 formula를 upgrade합니다. 여러 설치 방식을 중복 적용하지 않습니다.

Flutter 변경은 현재 버전을 기록한 뒤 `fvm use 목표버전`으로 적용합니다. pub get·analyze·test·Android/iOS 실기기 실행을 확인하고 `.fvmrc`, pubspec.lock, 네이티브 프로젝트 변경을 검토합니다. 실패하면 `fvm use 이전버전`과 업데이트 전 프로젝트 파일로 돌아갑니다. SDK 캐시 내부에서 flutter upgrade를 실행해 고정 버전을 바꾸지 않습니다.

SDK 변경과 패키지 변경은 별도로 진행합니다. 패키지만 바꾸려면 `fvm flutter pub outdated`로 확인하고 `fvm flutter pub upgrade`를 실행합니다.

## 정리·진단

`fvm remove 버전`은 로컬 SDK를 제거합니다. 다른 프로젝트나 global SDK가 사용하지 않는지 확인한 뒤 실행합니다. 프로젝트 버전은 `.fvmrc`로 다시 설치할 수 있지만 다운로드 시간이 필요합니다.

SDK가 잘못 선택되면 프로젝트 루트와 `.fvmrc`, `fvm list`, `fvm flutter --version`을 차례로 확인합니다. Windows 링크 권한 문제는 개발자 모드와 공식 FVM 안내를 확인합니다. doctor의 Android·Xcode 오류는 FVM 재설치로 해결하려 하지 말고 해당 플랫폼 도구를 점검합니다.

공식 참고: [설치](https://fvm.app/documentation/getting-started/installation), [명령어](https://fvm.app/documentation/guides/basic-commands), [FVM Flutter 실행·spawn](https://fvm.app/documentation/guides/running-flutter), [VS Code 연동](https://fvm.app/documentation/guides/vscode).

제거 후 숨김 설정·캐시·셸 초기화 항목까지 정리하려면 [도구별 제거·잔여 파일 관리](./uninstall-cleanup.md)를 함께 확인합니다.
