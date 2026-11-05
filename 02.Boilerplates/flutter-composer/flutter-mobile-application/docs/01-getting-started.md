<!-- version: v5.0.0 -->
# Flutter 모바일 프로젝트 설정·실행

코드와 docs를 가져온 프로젝트에서 시작합니다. 아래 명령은 별도 표시가 없으면 `pubspec.yaml`이 있는 프로젝트 루트의 일반 사용자 터미널에서 실행합니다. 기존 `.fvmrc`·잠금 파일·플랫폼 설정을 유지하며 **요구 버전 확인 → PC 기본 도구 → FVM·Flutter → Android/iOS 설정 → 의존성 복원 → 기기 실행** 순서로 진행합니다.

## 0. 선행 도구·준비 순서

| 대상 | 이 샘플의 기준 | 준비 순서 |
| :--- | :--- | :--- |
| 공통 | Flutter 3.35.7 / Dart 3.9.2 | Git·압축 도구 → FVM → 프로젝트 Flutter |
| Android | JDK 17, AGP 8.11.1, Kotlin 2.2.20, Gradle 8.14, min API 28·compile/target 36 | SDK·JDK → PATH → Android Studio 가상 기기 → 라이선스·기기 |
| iOS | 최소 iOS 15.0, 개발 확인값 Xcode 15.2·SDK 17.2 | Mac·전체 Xcode → 라이선스·초기화 → 프로젝트 Ruby·Bundler·CocoaPods → 서명·기기 |
| CocoaPods | Ruby 3.3.13, Bundler 2.5.23, CocoaPods 1.16.2 | rbenv → Ruby → 루트 Gemfile 설치 |

Android/iOS 중 개발할 플랫폼을 준비합니다. 위 값은 사용자가 다른 위치에서 확인한 조합이며 이 사본의 네이티브 빌드는 미검증입니다. Xcode 15.2는 현재 App Store 제출 도구 요구를 충족하지 않습니다. 개발 PC와 서비스 OS·스토어 요구는 [배포 문서](./06-build-and-release.md#서비스-os-지원-범위)에서 구분합니다.

## 1. 프로젝트 루트 확인

`pubspec.yaml`, `.fvmrc`, `lib/`, `docs/`와 선택한 플랫폼 폴더가 있는지 확인합니다. Android 전용에는 ios/Gemfile이, iOS 전용에는 android가 없습니다. 설치·빌드 명령도 선택 플랫폼만 수행합니다. 폴더 이름은 원하는 프로젝트 이름으로 바꿀 수 있습니다. Dart 패키지명·Android applicationId·iOS Bundle ID 변경은 [복사·치환 기준](./05-boilerplate.md#8-새-프로젝트로-복사치환)을 따릅니다. 프로젝트를 다시 생성하거나 기존 플랫폼 폴더를 덮어쓰지 않습니다.

에이전트를 사용할 때만 `project-agents.md`를 같은 루트의 `AGENTS.md`로 복사합니다. 개인 환경 값은 `.env.example`을 복사한 Git 제외 `.env`에 기록합니다. 기존 `.env`는 유지하며 파일 자체가 환경 변수를 자동 적용하지는 않습니다.

## 2. PC 기본 도구 준비

### macOS: Apple 개발 도구 → Homebrew

Android만 개발하고 전체 Xcode가 없다면 다음 명령으로 Command Line Tools를 설치하고 설치 창을 완료합니다.

```bash
xcode-select --install
```

iOS도 개발한다면 먼저 [iOS 가이드의 Xcode 설치·라이선스·초기화](./04-ios-build.md#xcode-설치선택확인)를 완료합니다. 전체 Xcode 설치 후 CLT를 따로 설치할 필요는 없습니다. 이후 확인합니다.

```bash
git --version
clang --version
```

오류가 없으면 Homebrew가 없는 PC에서만 설치합니다.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치기가 출력한 Next steps를 따릅니다. 기본 경로에서는 CPU에 맞는 한 줄을 현재 셸에 적용하고, 같은 줄을 `~/.zprofile`에 한 번만 추가합니다.

```bash
# Apple Silicon
eval "$(/opt/homebrew/bin/brew shellenv)"
# Intel: 위 줄 대신 사용
# eval "$(/usr/local/bin/brew shellenv)"
brew --version
```

Intel·구형 macOS는 현재 Homebrew·패키지 지원을 보장하지 않습니다. 기존 brew를 재설치하지 말고 Android Studio·Xcode의 공식 과거 배포본과 각 플랫폼 가이드의 대안을 확인합니다. [Homebrew 설치](https://brew.sh/) · [Apple 개발 도구](https://developer.apple.com/library/archive/technotes/tn2339/_index.html).

### Windows·Linux

Windows는 [Git for Windows](https://git-scm.com/install/windows)의 OS/CPU용 설치기를 실행하고 새 PowerShell에서 `git --version`을 확인합니다. 도구·SDK 보관 경로는 예를 들어 `D:\Developer\tools`, `D:\Developer\Android\Sdk`처럼 OS 드라이브 밖으로 지정합니다. 아래 예시의 D 드라이브는 실제 드라이브로 바꿉니다.

Ubuntu/Debian은 일반 터미널에서 관리자 권한으로 기본 패키지를 설치합니다. 다른 배포판은 해당 패키지 관리자의 동등 패키지를 사용합니다.

```bash
sudo apt-get update
sudo apt-get install git curl unzip xz-utils zip libglu1-mesa
git --version
```

## 3. FVM 설치·Flutter 복원

macOS·Linux에서 FVM이 없을 때 설치합니다.

```bash
curl -fsSL https://fvm.app/install.sh | bash
```

기본 설치 위치라면 현재 셸에서 다음을 실행합니다. 설치기가 다른 경로를 안내했다면 해당 경로의 bin으로 바꿉니다. 같은 export 한 줄을 zsh는 `~/.zshrc`, bash는 `~/.bashrc`에 한 번만 추가합니다. 기존 다른 방식의 FVM 설치와 중복하지 않습니다.

```bash
export PATH="$HOME/fvm/bin:$PATH"
fvm --version
```

Windows는 [FVM standalone 배포](https://github.com/leoafarias/fvm/releases)에서 Windows·CPU용 압축 파일을 받아 `D:\Developer\tools\fvm`에 풉니다. `fvm.exe`가 있는 실제 디렉터리를 현재 PowerShell에 추가합니다.

```powershell
$env:Path = "D:\Developer\tools\fvm;$env:Path"
fvm --version
```

매번 사용할 도구 경로는 Windows의 **환경 변수 → 사용자 Path**에 한 번 추가하고 새 터미널에서 확인합니다. JDK·SDK 버전 선택은 이후 프로젝트 셸에서 설정합니다. [FVM 공식 설치](https://fvm.app/documentation/getting-started/installation).

프로젝트 루트에서 SDK를 설치합니다.

```bash
fvm install
fvm flutter --version
```

Flutter 3.35.7 / Dart 3.9.2인지 확인합니다. Dart·전역 Gradle은 따로 설치하지 않습니다. SDK 설치 전 OS/CPU 요구와 설치 오류를 확인하며 `fvm use stable`로 기준 버전을 바꾸지 않습니다.

## 4. 플랫폼 설정 완료

[프로젝트 환경 정의](./02-project-environment.md#프로젝트에-보관할-파일)를 읽고 다음 중 개발할 플랫폼의 설치·PATH·버전·기기 확인을 끝냅니다. 두 플랫폼을 개발한다면 둘 다 수행합니다.

1. [Android 설정](./03-android-build.md#처음-설치-sdkjdkpath): SDK 명령행 도구 → JDK 17 → PATH·SDK 패키지 → 가상 기기 또는 실기기 → 라이선스·기기.
2. [iOS 설정](./04-ios-build.md#xcode-설치선택확인): 전체 Xcode·라이선스·초기화 → rbenv·Ruby → Gemfile 설치 → Simulator/iPhone·서명.

그 다음 아래 단계로 돌아옵니다. 이 문서 묶음만으로 설치·확인을 진행할 수 있으며 외부 공식 링크는 다운로드와 근거 확인에 사용합니다.

## 5. 프로젝트 환경 확인·의존성 복원

[환경 가이드 2절](./02-project-environment.md#2-기본-환경과-선택적-폴더별-로딩)의 작업 자식 셸에서 실제 SDK·JDK·Xcode를 선택합니다. macOS·Linux·네이티브 Windows 모두 아래 **기본 FVM 명령**으로 시작합니다. direnv와 로컬 실행기 작성은 필수가 아닙니다.

```bash
fvm flutter doctor -v
fvm flutter pub get
fvm flutter analyze
fvm flutter test
```

doctor의 실제 Java·SDK가 프로젝트와 맞지 않으면 공용 사용자 설정부터 바꾸지 않습니다. [필요한 경우의 Flutter 설정 분리](./02-project-environment.md#3-선택적-flutter-사용자-설정-분리) 또는 지원되는 별도 빌드 환경을 선택합니다. 선택적 실행기를 도입했다면 위·아래 Flutter 호출을 모두 그 실행기로 바꾸고 혼용하지 않습니다.

iOS 프로젝트가 CocoaPods를 사용하면 [Ruby·Bundler·Pod 복원](./04-ios-build.md#cocoapodsswift-package-manager-복원)을 수행하고 **이후 Flutter의 iOS 실행·빌드도** 프로젝트 루트에서 `bundle exec fvm flutter …`로 실행합니다. SwiftPM만 쓰는 프로젝트와 Android 작업은 이 접두부가 필요하지 않습니다. 잠금 파일을 삭제하거나 초기 복원 중 전체 업그레이드하지 않습니다.

## 6. IDE·기기 연결·실행

1. [VS Code 배포](https://code.visualstudio.com/download)에서 PC OS·CPU용 설치기를 받아 설치하고 **File → Open Folder**로 프로젝트 루트를 엽니다.
2. Extensions에서 **Flutter**(Dart Code)를 설치합니다. Dart 확장도 함께 설치됩니다.
3. **Preferences: Open Workspace Settings (JSON)**에서 기존 설정에 아래 항목을 추가합니다. 사용자 공용 설정 대신 프로젝트 설정을 사용합니다.

```json
{
  "dart.flutterSdkPath": ".fvm/flutter_sdk"
}
```

4. **Flutter: Run Flutter Doctor**를 실행해 Flutter 3.35.7과 Java·Android SDK·Xcode 경로를 터미널 결과와 비교합니다.
5. Android 가상 기기는 Android Studio의 Welcome 화면 **More Actions → Virtual Device Manager**에서 생성·시작합니다. 버전에 따라 Device Manager로 표시됩니다. 코드 프로젝트를 Android Studio에서 열거나 Flutter 플러그인을 설치할 필요는 없습니다.
6. VS Code 상태 표시줄의 기기 이름 또는 **Flutter: Select Device**로 실행 대상을 선택하고 F5로 디버깅합니다. 중단점·Hot Reload를 확인하고 Shift+F5로 종료합니다. 에뮬레이터 자체를 종료하려면 에뮬레이터 창을 닫습니다.

선택적 Flutter 실행기·CocoaPods Bundler를 사용한다면 먼저 같은 환경의 VS Code 통합 터미널에서 아래 명령을 실행합니다. F5가 그 실행기나 Bundler 환경을 자동 적용한다고 가정하지 않습니다. [Flutter VS Code 실행·디버깅](https://docs.flutter.dev/tools/vs-code) · [FVM VS Code 설정](https://fvm.app/documentation/guides/vscode).

Android는 휴대폰 USB 디버깅·컴퓨터 승인을 준비하거나 에뮬레이터를 시작합니다. Mac의 기기 인식 자체에는 Windows OEM USB 드라이버가 필요하지 않습니다. iPhone은 [iOS 기기 연결·서명](./04-ios-build.md#simulatoriphone-실행과-서명)에 따라 신뢰·Developer Mode·Team을 준비합니다. Simulator와 실기기는 선택 가능한 대안입니다.

```bash
fvm flutter devices
fvm flutter run -d 기기ID
```

`기기ID`를 실제 출력값으로 바꾸며 프로젝트 flavor·환경 인자가 있다면 추가합니다. 기본 앱의 기능 목록을 확인하고, greeting-resource를 추가했다면 인사말 버튼의 정상·대기·오류 동작을 확인하고 터미널의 `q` 또는 Ctrl+C로 실행을 종료합니다. Android APK는 `fvm flutter build apk --debug`, iOS의 서명 없는 컴파일 확인은 Mac에서 `fvm flutter build ios --no-codesign`입니다. CocoaPods 프로젝트는 iOS 명령에 `bundle exec`를 추가합니다. 기기 실행·서명 archive·App Store/Play 업로드는 각각 별도 검증이며 자동으로 진행하지 않습니다.

## 7. 다음 개발·업데이트·정리

이제 [아키텍처·기능 작성 설명서](./05-boilerplate.md)를 읽고 화면·ViewModel·Service·DI를 확장합니다. 환경 변경 후에는 프로젝트 진입·하위 폴더·이탈·다른 프로젝트에서 도구 선택이 복원되는지 확인하고 이 환경 문서와 update.md에 결과를 기록합니다. 불필요한 도구 삭제는 다른 프로젝트 참조와 이전 버전 복귀 수단을 먼저 확인하며 앱 데이터·서명 자료·공유 SDK를 함께 삭제하지 않습니다.

배포할 때는 [빌드 산출물·스토어 배포](./06-build-and-release.md)를 이어서 읽습니다. 로컬 기기 실행 성공과 스토어 제출 검증은 구분합니다.

설치 절차 확인일: 2026-11-04. 공식 설치 문서와 프로젝트 파일을 대조했습니다. 이번 변경에서 FVM 설치·Flutter 분석/테스트·플랫폼 빌드·실기기·IDE를 새로 검증하지 않았습니다. 과거 검증 결과는 유형 README·update.md에서 확인합니다.

## 8. feature 명령용 Node 준비

앱 런타임은 Flutter이며 Node는 기능 조립 스크립트에만 사용합니다. 이 절의 명령은 앱 루트에서 실행합니다.


macOS·Linux는 기존 nvm을 사용합니다. 없다면 공식 설치기를 확인해 설치합니다.

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ ! -s "$NVM_DIR/nvm.sh" ] || . "$NVM_DIR/nvm.sh"
```

묶음 루트에서 프로젝트 버전을 설치·선택하고 확인합니다. 전역 기본값은 바꾸지 않습니다.

```bash
nvm install --no-use
nvm use
node --version
npm --version
```

Windows는 [Node 공식 배포](https://nodejs.org/en/download)의 .nvmrc 버전·CPU용 ZIP과 SHASUMS256.txt를 대조해 D:\Developer\tools 아래에 풉니다. D는 실제 데이터 드라이브입니다. 해당 작업 PowerShell에만 실제 경로를 적용합니다.

```powershell
$env:Path = "D:\Developer\tools\실제Node폴더명;$env:Path"
node --version
npm --version
```

[공식 nvm](https://github.com/nvm-sh/nvm). 별도 npm 의존성 설치는 필요 없습니다.


준비 후 npm run feature -- list와 npm run feature -- add greeting-resource,counter를 사용합니다. 첫 add 전에 플랫폼 도구 설치·라이선스·기본 분석/테스트를 완료합니다. 상세 충돌·복구·상태 관리는 README의 기능 추가와 [버전 관리](./07-version-management.md)를 따릅니다.
