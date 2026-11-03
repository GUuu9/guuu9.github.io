<!-- version: v2.0.0 -->
# Mobile-app 가져오기부터 실행까지

새 PC·새 폴더에서 **유형 받기 → 프로젝트 복사 → Flutter 복원 → 플랫폼 도구 설치 → 프로젝트 환경 적용 → 의존성 복원 → 기기 실행·검증** 순서로 진행합니다. Android·iOS 중 필요한 플랫폼만 준비합니다. 기존 앱 복원이라면 다운로드·새 폴더 복사를 건너뛰고 해당 앱의 README·CI·버전 파일을 우선합니다.

## 0. 선행 도구·준비 순서

개발 도구 설치 전에 [서비스 OS 지원 범위](./06-build-and-release.md#서비스-os-지원-범위)에서 최소 OS·최대 지원 상태·실제 검증 범위를 확인합니다. SDK·패키지 변경 시 이 범위를 다시 대조합니다.

코드를 받기 위한 PC 공통 준비와 프로젝트를 받은 뒤의 도구 설치를 구분합니다. 모든 도구를 다운로드 전에 설치할 필요는 없지만, 각 명령의 선행 도구가 준비된 뒤 다음 단계로 진행합니다.

| 단계·조건 | 선행 도구 | 확인·다음 작업 |
| :--- | :--- | :--- |
| 다운로드 전 공통 필수 | Git·다운로드/압축 도구, macOS는 아래 Apple 개발 도구 준비 | Git 동작 확인 → 1절 유형 다운로드·2절 복사 |
| Flutter 공통 필수 | FVM → `.fvmrc`의 Flutter·포함 Dart | 3절 SDK 복원·버전 확인. 별도 Dart·전역 Gradle 불필요 |
| Android 선택 시 필수 | Android Studio·SDK/Platform-Tools → Gradle·AGP와 호환되는 JDK | 4절 Android 가이드 → doctor·라이선스·기기 확인. 호환 JBR이 있으면 추가 JDK 불필요 |
| iOS 선택 시 필수 | macOS·전체 Xcode·라이선스/초기화·iOS SDK | 4절 iOS 가이드에서 선택 경로·서명·기기 준비. CLT만으로 iOS 빌드 불가 |
| CocoaPods 사용 시만 | Xcode 빌드 도구·라이선스 → Homebrew·rbenv → 프로젝트 Ruby → 지정 Bundler → Gemfile/lock의 CocoaPods | Ruby·gem 복원 후 Flutter iOS 명령도 bundle exec 사용 |
| 코드 편집 선택 | VS Code+Flutter 확장 또는 Android Studio+Flutter/Dart 플러그인 | 6절 프로젝트 FVM SDK 연결. CLI만 사용할 때 IDE는 필수 아님 |

FVM·Android Studio·JDK·Xcode·Ruby 설치는 저장소의 `01.Tools/`에서 도구별로 관리합니다. 패키지 단독 사용 시에도 아래 단계와 Android/iOS 가이드의 공식 링크로 준비할 수 있습니다. macOS의 별도 JDK를 Homebrew로 관리한다면 Apple 개발 도구 → Homebrew → 요구 JDK formula 순서입니다.

### macOS에서 다운로드 전에 확인

Git·nvm 등 설치 도구가 사용할 Apple 개발 도구를 먼저 준비합니다. Command Line Tools만 쓰면 설치 완료 후 Git·Clang을 확인합니다. **선택한 도구가 전체 Xcode라면 해당 Xcode의 라이선스 동의·최초 초기화를 먼저 완료**하고 같은 Developer 경로의 셸에서 확인합니다. 자세한 명령은 저장소의 `01.Tools/xcode.md`, 이 패키지만 받은 경우 [Apple 개발 도구 안내](https://developer.apple.com/library/archive/technotes/tn2339/_index.html)와 [Xcode 초기화·라이선스 안내](https://docs.flutter.dev/platform-integration/ios/setup)를 따릅니다. 설치·라이선스 오류가 남아 있으면 Git clone·Homebrew·nvm·FVM 설치로 넘어가지 않습니다. 웹·Android 개발에 전체 Xcode를 강제하지 않습니다.

```bash
git --version
clang --version
```

위 명령은 준비가 끝난 개인 Mac의 일반 터미널에서 실행합니다. macOS rbenv는 공식 권장 Homebrew 방식으로 준비하며 Homebrew가 필요한 경우 이 확인 뒤에 준비하고, 프로젝트별 JDK·Ruby 등을 설치합니다. 설치 명령은 Tools 또는 공식 안내에서 확인하며 도구 이름만으로 이미 준비되었다고 판단하지 않습니다.

## 1. 유형 패키지 가져오기

개인 PC에서 `git --version`을 확인합니다. 없다면 [공식 Git 설치](https://git-scm.com/install/)를 먼저 진행합니다. 임의 작업 부모 폴더에서 아래 명령을 실행합니다. `devguide-samples`는 기존에 없는 새 다운로드 폴더입니다. Git 명령은 macOS·Linux·Windows PowerShell에서 동일합니다.

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/mobile-app
cd 02.Boilerplates/mobile-app
```

현재 위치는 유형 패키지 루트입니다. 공개 저장소 다운로드 명령에 토큰을 넣지 않습니다. 코드와 문서를 모두 받으며 Flutter 새 프로젝트 생성 명령으로 샘플을 덮어쓰지 않습니다. [Git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout).

## 2. 원하는 새 폴더로 복사

macOS·Linux는 **유형 패키지 루트**에서 다음 묶음을 실행합니다. 기존 대상이 있으면 중단하며 다른 폴더를 선택합니다. 예시 앱 이름은 원하는 이름으로 바꿉니다.

아래 명령은 **Git에 커밋된 HEAD의 템플릿만** 내보냅니다. 작업 폴더의 `.env`·캐시·빌드 결과·미커밋 변경은 가져오지 않습니다. 필요한 문서·`.env.example`도 함께 받으며 기존 대상이 있으면 중단합니다. 변경 중인 템플릿은 먼저 검토·커밋한 뒤 사용합니다.

```bash
(
  set -euo pipefail
  project_dir="$HOME/Developer/my_app"
  repository_root="$(git rev-parse --show-toplevel)"
  test ! -e "$project_dir"
  mkdir -p "$project_dir"
  git -C "$repository_root" archive HEAD:02.Boilerplates/mobile-app/boilerplates/minimal | tar -xf - -C "$project_dir"
  git -C "$repository_root" archive HEAD:02.Boilerplates/mobile-app docs update.md project-agents.md | tar -xf - -C "$project_dir"
)
```

Windows PowerShell도 유형 패키지 루트에서 Git의 ZIP 내보내기를 사용합니다. 아래 대상 이름과 Downloads의 ZIP 이름은 예시이며 기존 파일이 있으면 중단합니다. git 명령 실패 시 이어서 압축을 풀지 않습니다.

```powershell
$ProjectDir = "$env:USERPROFILE\Developer\my_app"
$RepositoryRoot = git rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0) { throw "Git 저장소 루트 확인 실패" }
$CodeZip = "$env:TEMP\mobile-app-code.zip"
$DocsZip = "$env:TEMP\mobile-app-docs.zip"
if ((Test-Path $ProjectDir) -or (Test-Path $CodeZip) -or (Test-Path $DocsZip)) { throw "기존 대상이 있습니다. 새 경로를 선택하세요." }
git -C "$RepositoryRoot" archive --format=zip --output="$CodeZip" HEAD:02.Boilerplates/mobile-app/boilerplates/minimal
if ($LASTEXITCODE -ne 0) { throw "코드 내보내기 실패" }
git -C "$RepositoryRoot" archive --format=zip --output="$DocsZip" HEAD:02.Boilerplates/mobile-app docs update.md project-agents.md
if ($LASTEXITCODE -ne 0) { throw "문서 내보내기 실패" }
Expand-Archive -Path $CodeZip -DestinationPath $ProjectDir
Expand-Archive -Path $DocsZip -DestinationPath $ProjectDir
```

확인 후 위에서 만든 두 임시 ZIP만 정리합니다. 다른 앱·SDK·캐시는 삭제하지 않습니다. 새 앱의 프로젝트 루트는 복사된 버전 파일·소스·README가 있는 폴더입니다. 문서는 `docs/`, 지침 보관본은 `project-agents.md`, 이력은 `update.md`로 함께 보관하며 링크를 다시 고칠 필요가 없습니다. 에이전트를 사용할 때만 보관본을 같은 폴더의 AGENTS.md로 복사합니다. 작업 루트 표기는 패키지에서는 minimal, 새 앱에서는 새 루트를 뜻합니다.

실제 환경 값이 필요할 때만 프로젝트 루트에서 `.env.example`을 `.env`로 복사해 채웁니다. 이미 있는 `.env`는 유지합니다. 예시 파일에는 키·토큰·개인 값을 넣지 않으며 `.env`는 Git에서 제외합니다. `.env`가 존재한다고 앱·Flutter·Node가 자동으로 읽는 것은 아닙니다. 필요한 로딩 방법은 해당 프로젝트 문서에 명시합니다.

```bash
if [ ! -e .env ]; then
  cp .env.example .env
fi
```

Windows에서는 `if (-not (Test-Path .env)) { Copy-Item .env.example .env }`를 사용합니다. 기본 샘플은 추가 비밀값이 필요하지 않아 이 단계를 생략할 수 있습니다. [Git archive](https://git-scm.com/docs/git-archive).

## 3. FVM 설치·Flutter 복원

이미 FVM이 있으면 재설치하지 않습니다. macOS·Linux의 일반 터미널에서 공식 설치기를 사용합니다. 작업 위치는 임의 폴더입니다.

```bash
curl -fsSL https://fvm.app/install.sh | bash
```

설치기가 안내한 PATH 설정을 반영하고 새 터미널에서 `fvm --version`을 확인합니다. Windows는 [FVM 공식 독립 배포 패키지](https://fvm.app/documentation/getting-started/installation)에서 지원 OS/CPU용 패키지를 받아 사용자 도구 폴더에 풀고 실행 파일 폴더를 사용할 셸에 제공합니다. 이미 있는 다른 설치 경로와 중복하지 않습니다. 이는 FVM 실행 도구 준비이며 Flutter SDK를 공용 버전으로 바꾸는 단계가 아닙니다.

**새 프로젝트 루트**에서 기록된 SDK를 복원합니다.

```bash
fvm install
fvm flutter --version
```

`.fvmrc`의 Flutter 3.35.7과 포함 Dart 버전을 확인합니다. Dart를 따로 설치하거나 `fvm use stable`로 기존 선택을 바꾸지 않습니다. OS가 이 버전을 지원하지 않으면 설치 오류를 숨기지 말고 프로젝트의 호환 조합을 검토합니다. [FVM 설치·버전 복원](https://fvm.app/documentation/getting-started/installation).

## 4. 필요한 플랫폼 도구 설치

먼저 [프로젝트 환경 파일의 책임](./02-project-environment.md#프로젝트에-보관할-파일)을 읽고, 선택 플랫폼에 필요한 실제 버전·개인 경로를 확인합니다. 이 단계에서는 설치까지만 진행하고 앱 실행·업데이트는 아직 하지 않습니다.

- **Android**: [Android 빌드 가이드](./03-android-build.md)의 역할·기존 환경 확인·공통 설치 안내·프로젝트 JDK 선택·SDK 복원·호환 조합 확인 순서로 진행합니다. Android Studio의 SDK Manager에서 요구 SDK·Platform-Tools를 준비합니다. Mac의 별도 JDK는 Homebrew의 요구 major formula로 설치하고 프로젝트 환경 파일에서 선택합니다. Gradle·AGP는 프로젝트 파일에서 복원하므로 전역 Gradle을 설치하지 않습니다.
- **iOS**: Mac에서만 [iOS 빌드 가이드](./04-ios-build.md)의 공통 Xcode 설치 안내·프로젝트별 선택을 진행합니다. 프로젝트에 CocoaPods 의존성이 있을 때만 Ruby·Bundler·CocoaPods를 준비하고, SwiftPM만 사용하면 불필요한 Podfile을 만들지 않습니다. iOS 앱 실행이 필요하지 않은 PC에 Xcode·CocoaPods를 설치하지 않습니다.

개인 경로·설치 버전은 프로젝트 문서와 로컬 파일에 기록하며 공용 JAVA_HOME·Xcode 선택·Ruby 기본값을 바꾸지 않습니다. 샘플의 Android APK·iOS 빌드는 아직 검증되지 않았으므로 문서의 조합만으로 성공을 보장하지 않습니다.

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

복사한 **my_app 루트**를 IDE에서 엽니다. Android Studio의 Flutter SDK 경로와 VS Code의 `dart.flutterSdkPath`를 이 프로젝트의 `.fvm/flutter_sdk`로 지정합니다. IDE의 doctor·Gradle JDK·Xcode가 터미널의 정상 조합과 같으면 표준 Run을 사용합니다. 선택적 실행기·CocoaPods Bundler를 사용하는 프로젝트는 같은 환경의 통합 터미널 명령을 먼저 사용하고 IDE Run도 그 환경을 상속하는지 별도 검증합니다.

Android는 휴대폰 USB 디버깅·컴퓨터 승인을 준비하거나 에뮬레이터를 시작합니다. Mac의 기기 인식 자체에는 Windows OEM USB 드라이버가 필요하지 않습니다. iPhone은 [iOS 기기 연결·서명](./04-ios-build.md#simulatoriphone-실행과-서명)에 따라 신뢰·Developer Mode·Team을 준비합니다. Simulator와 실기기는 선택 가능한 대안입니다.

```bash
fvm flutter devices
fvm flutter run -d 기기ID
```

`기기ID`를 실제 출력값으로 바꾸며 프로젝트 flavor·환경 인자가 있다면 추가합니다. 인사말 버튼의 정상·대기·오류 동작을 확인하고 터미널의 `q` 또는 Ctrl+C로 실행을 종료합니다. Android APK는 `fvm flutter build apk --debug`, iOS의 서명 없는 컴파일 확인은 Mac에서 `fvm flutter build ios --no-codesign`입니다. CocoaPods 프로젝트는 iOS 명령에 `bundle exec`를 추가합니다. 기기 실행·서명 archive·App Store/Play 업로드는 각각 별도 검증이며 자동으로 진행하지 않습니다.

## 7. 다음 개발·업데이트·정리

이제 [아키텍처·기능 작성 설명서](./05-boilerplate.md)를 읽고 화면·ViewModel·Service·DI를 확장합니다. 환경 변경 후에는 프로젝트 진입·하위 폴더·이탈·다른 프로젝트에서 도구 선택이 복원되는지 확인하고 docs/environment.md·update.md에 결과를 기록합니다. 불필요한 도구 삭제는 다른 프로젝트 참조와 이전 버전 복귀 수단을 먼저 확인하며 앱 데이터·서명 자료·공유 SDK를 함께 삭제하지 않습니다.

배포할 때는 [빌드 산출물·스토어 배포](./06-build-and-release.md)를 이어서 읽습니다. 로컬 기기 실행 성공과 스토어 제출 검증은 구분합니다.

확인일: 2026-11-03. 실제 샘플 버전 파일·설치 공식 문서·문서 연결을 확인했습니다. 이번 변경에서 FVM 설치·Flutter 분석/테스트·플랫폼 빌드·실기기·IDE를 새로 검증하지 않았습니다. 과거 검증 결과는 유형 README·update.md에서 확인합니다.
