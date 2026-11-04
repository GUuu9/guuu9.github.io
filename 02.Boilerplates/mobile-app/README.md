<!-- version: v3.1.0 -->
# Mobile-app 최소 Flutter 보일러플레이트

## 1. 목적

Android·iOS용 Flutter 앱을 새 경로에서 시작할 때 복사해 사용할 수 있는 독립 샘플이다. 인사말을 비동기로 불러오는 한 화면으로 DI·MVVM의 최소 연결을 보여준다. 서버 통신·데이터베이스·인증·배포 서명은 포함하지 않는다.

Flutter 프로젝트 파일과 문서는 `mobile-app/`에 함께 둔다. 이 폴더 전체를 새 프로젝트 루트로 복사하면 코드와 `docs/`를 바로 사용할 수 있다.

프로젝트를 가져온 뒤 [요구 버전·진행 순서](docs/01-getting-started.md#0-선행-도구준비-순서)를 확인한다. 처음 사용한다면 [프로젝트 설정·실행](docs/01-getting-started.md)를 순서대로 읽는다. 아래 구조·버전 표는 진행 중 참고 자료다.

## 2. 기술과 버전 기준

| 항목 | 기준 |
| :--- | :--- |
| Flutter SDK | `.fvmrc`의 3.35.7 |
| Dart SDK | Flutter에 포함된 3.9.2, `pubspec.yaml`의 SDK 조건 |
| 앱 버전 | `pubspec.yaml`의 1.0.0+1 |
| 직접 패키지 | Flutter SDK와 개발용 `flutter_lints`만 사용 |
| 정확한 패키지 해석 | `pubspec.lock` |
| Android | AGP 8.11.1, Kotlin Plugin 2.2.20, Gradle 8.14, JDK 17; min API 28·compile/target API 36 |
| iOS | Deployment Target 15.0; Xcode 15.2·iOS SDK 17.2 조합은 다른 작업 위치에서 확인 |

Flutter 3.35.7은 이 샘플의 기준 버전이지 최신 버전이나 모든 PC의 호환 보장이 아니다. SDK 버전 선택·복원은 [FVM 공식 문서](https://fvm.app/documentation/guides/basic-commands)를 따른다. `.fvmrc`의 JSON과 버전 값은 확인했지만, FVM CLI가 이 파일을 읽어 SDK를 선택하는 실행은 이 패키지 검증에서 수행하지 않았다.

## 3. 프로젝트 가져오기

아래 절차는 이 문서 저장소에서 새 프로젝트를 가져올 때 사용한다. 이미 프로젝트 폴더를 받았다면 [프로젝트 설정·실행](docs/01-getting-started.md)부터 진행한다. macOS에서 Git이 라이선스 오류를 내면 시작 가이드의 Apple 개발 도구 준비를 먼저 완료한다.

### 1. 유형 패키지 가져오기

개인 PC에서 `git --version`을 확인합니다. 없다면 [공식 Git 설치](https://git-scm.com/install/)를 먼저 진행합니다. 임의 작업 부모 폴더에서 아래 명령을 실행합니다. `devguide-samples`는 기존에 없는 새 다운로드 폴더입니다. Git 명령은 macOS·Linux·Windows PowerShell에서 동일합니다.

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/mobile-app
cd 02.Boilerplates/mobile-app
```

현재 위치는 유형 패키지 루트입니다. 공개 저장소 다운로드 명령에 토큰을 넣지 않습니다. 코드와 문서를 모두 받으며 Flutter 새 프로젝트 생성 명령으로 샘플을 덮어쓰지 않습니다. [Git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout).

### 2. 원하는 새 폴더로 복사

macOS·Linux는 **유형 패키지 루트**에서 다음 묶음을 실행합니다. 기존 대상이 있으면 중단하며 다른 폴더를 선택합니다. 예시 앱 이름은 원하는 이름으로 바꿉니다.

아래 명령은 **Git에 커밋된 HEAD의 템플릿만** 내보냅니다. 작업 폴더의 `.env`·캐시·빌드 결과·미커밋 변경은 가져오지 않습니다. 필요한 문서·`.env.example`도 함께 받으며 기존 대상이 있으면 중단합니다. 변경 중인 템플릿은 먼저 검토·커밋한 뒤 사용합니다.

```bash
(
  set -euo pipefail
  project_dir="$HOME/Developer/my_app"
  repository_root="$(git rev-parse --show-toplevel)"
  test ! -e "$project_dir"
  mkdir -p "$project_dir"
  git -C "$repository_root" archive HEAD:02.Boilerplates/mobile-app | tar -xf - -C "$project_dir"
)
```

Windows PowerShell도 유형 패키지 루트에서 Git의 ZIP 내보내기를 사용합니다. 아래 대상 이름과 Downloads의 ZIP 이름은 예시이며 기존 파일이 있으면 중단합니다. git 명령 실패 시 이어서 압축을 풀지 않습니다.

```powershell
$ProjectDir = "$env:USERPROFILE\Developer\my_app"
$RepositoryRoot = git rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0) { throw "Git 저장소 루트 확인 실패" }
$PackageZip = "$env:TEMP\mobile-app.zip"
if ((Test-Path $ProjectDir) -or (Test-Path $PackageZip)) { throw "기존 대상이 있습니다. 새 경로를 선택하세요." }
git -C "$RepositoryRoot" archive --format=zip --output="$PackageZip" HEAD:02.Boilerplates/mobile-app
if ($LASTEXITCODE -ne 0) { throw "mobile-app 내보내기 실패" }
Expand-Archive -Path $PackageZip -DestinationPath $ProjectDir
```

확인 후 위에서 만든 임시 ZIP만 정리합니다. 다른 앱·SDK·캐시는 삭제하지 않습니다. mobile-app 폴더 전체를 새 프로젝트 루트로 가져오므로 `pubspec.yaml`, `lib/`, `android/`, `ios/`, `docs/`, README와 지침이 한 폴더에 놓입니다. 에이전트를 사용할 때만 `project-agents.md`를 같은 폴더의 `AGENTS.md`로 복사합니다.

## 4. VS Code에서 개발

프로젝트 루트를 VS Code로 엽니다. Flutter 확장(게시자 Dart Code)을 설치하면 Dart 확장도 설치됩니다. 프로젝트 `.vscode/settings.json`의 `dart.flutterSdkPath`를 `.fvm/flutter_sdk`로 지정하고 Flutter 버전을 확인합니다.

코드 편집·분석·테스트·실행·디버깅·Hot Reload는 VS Code에서 수행합니다. Android Studio는 Android 가상 기기 생성·관리 용도로 사용합니다. SDK 패키지는 프로젝트 터미널의 명령행 도구로 준비합니다. 설치·기기 선택·F5 실행은 [시작 가이드 6절](docs/01-getting-started.md#6-ide기기-연결실행)을 따릅니다.

## 5. 핵심 구조와 기능 추가

```text
lib/main.dart                                  앱 시작
lib/core/di/app_dependencies.dart             객체 조립·수명 소유
lib/features/greeting/data/greeting_service.dart  인사 데이터 계약·로컬 구현
lib/features/greeting/presentation/            인사 View·ViewModel
test/features/greeting/presentation/            상태·화면 테스트
android/                                        Android 앱·Gradle 구성
ios/                                            Xcode Runner·리소스 구성
```

화면은 ViewModel의 상태와 명령을 표시하고, ViewModel은 Service 인터페이스를 사용한다. 앱 시작 지점의 DI 구성만 객체를 만든다. 상세 의존 방향·전체 파일 목록·흐름은 [보일러플레이트 설명서 3·4절](docs/05-boilerplate.md#3-폴더파일명과-전체-역할-목록)에서 확인한다.

새 화면은 `lib/features/기능명/presentation/`에 View와 ViewModel을 함께 둔다. 외부 데이터 접근이 실제로 필요할 때만 `data/`에 Service 또는 Repository를 추가하고, 새 객체 생성은 DI 구성과 테스트에 연결한다. 화면에서 직접 API·파일·전역 객체를 만들지 않는다.

## 6. 검사·실행·빌드

복사한 `mobile-app` 폴더가 Flutter 프로젝트 루트다. 환경 준비를 마친 뒤 이 위치에서 실행한다. 프로젝트 격리를 적용한 경우 FVM 직접 호출과 로컬 실행기를 섞지 않는다.

```bash
fvm install
fvm flutter pub get
fvm flutter analyze
fvm flutter test
fvm flutter devices
fvm flutter run -d 기기ID
```

`기기ID`는 `fvm flutter devices` 결과로 바꾼다. 실행 종료는 Ctrl+C다. 플랫폼 도구 준비와 새 폴더로 가져오는 순서는 [시작 가이드](docs/01-getting-started.md)를 따른다.

Android·iOS 버전 조합은 별도 작업 위치에서 정상 동작을 확인한 설정을 반영했다. 이 저장소의 샘플은 업데이트 후 APK·iOS 빌드를 다시 실행하지 않았다. Xcode 15.2·iOS SDK 17.2는 개발·기기 검증 기록이며 현재 App Store 제출 조건을 충족하지 않는다.

## 7. 보안·변경 경계

인사 서비스는 외부 통신 없이 고정된 문자열을 반환한다. 실패 상세를 화면에 노출하지 않는 예제를 포함한다. 제품 데이터·비밀값·서명 키는 없다. `.fvm/`, `android/local.properties`, Xcode 생성 설정과 빌드 산출물은 Git에 넣지 않는다. Android 앱 식별자·iOS Bundle Identifier·앱 이름은 새 제품에 맞게 바꾼다.

## 8. 패키지 구성·재사용

| 경로 | 내용 |
| :--- | :--- |
| [README.md](README.md) | 패키지 입구·빠른 시작 |
| [project-agents.md](project-agents.md) | 새 프로젝트에 복사해 `AGENTS.md`로 쓸 작업 지침 보관본 |
| [docs/05-boilerplate.md](docs/05-boilerplate.md) | 파일 역할·아키텍처·재사용·검증 기록 |
| [update.md](update.md) | 버전·변경 이력 |
| `lib/`, `test/`, `android/`, `ios/` | Flutter 코드·테스트·Android/iOS 프로젝트 파일 |

프로젝트에 적용할 때는 이 README의 Git archive로 코드·문서·지침·이력을 내보낸 뒤 `project-agents.md`를 새 루트 `AGENTS.md`로 복사한다. 시작 가이드의 표준 배치로 문서도 함께 가져오면 링크를 조정할 필요가 없다. [상세 재사용 절차](docs/05-boilerplate.md#8-새-프로젝트로-복사치환)를 따른다.

## 9. 검증·제약

Flutter 3.35.7·Dart 3.9.2로 샘플을 생성했다. 오프라인 의존성 복원, 정적 분석, 테스트 3개가 통과했다. Android Studio GUI·에뮬레이터·실기기, Android APK 빌드, Xcode/iOS 빌드는 이 저장소에서 확인하지 않았다. 별도 작업 위치의 정상 동작 조합과 현재 저장소 검증 결과는 [설명서 9절](docs/05-boilerplate.md#9-예외검증-결과와-요구사항-대조표)에 구분해 기록한다.

공식 참고: [Flutter 앱 아키텍처](https://docs.flutter.dev/app-architecture/guide), [Flutter 테스트](https://docs.flutter.dev/testing/overview), [Flutter 프로젝트 생성](https://docs.flutter.dev/reference/create-new-app), [Flutter 라이선스](https://github.com/flutter/flutter/blob/3.35.7/LICENSE).

플랫폼별 권한 선언·동의 처리, 패키지/네이티브 버전 기준과 업데이트·복귀는 [플랫폼 관리 절차](docs/05-boilerplate.md#플랫폼별-권한패키지버전-업데이트)를 따른다.

## 플랫폼별 프로젝트 빌드 참고

[프로젝트 환경 정의·복원·격리](docs/02-project-environment.md)에 따라 버전 파일·개인 환경·설치 명령을 프로젝트 루트에서 관리합니다. Flutter SDK 복원 후 Android·iOS에 필요한 빌드 환경과 버전을 선택합니다. 두 가이드 모두 이 mobile-app 패키지 안에 포함되어 별도 복사 후에도 읽을 수 있습니다.

1. [Android 프로젝트 빌드·버전 관리](docs/03-android-build.md): Gradle Wrapper·AGP·JDK·SDK 설치 구분, 호환 조합·검증·복귀.
2. [iOS 프로젝트 빌드·버전 관리](docs/04-ios-build.md): Xcode·CocoaPods/SwiftPM·iPhone 연결·서명·배포 조건·복귀.

필요한 플랫폼만 선택하며 Android 다음에 반드시 iOS 환경을 설치할 필요는 없습니다. 샘플 코드·버전 고정·잠금 파일은 이 문서 추가로 변경하지 않았습니다.

## 빌드 산출물과 배포

로컬 검증 후 [Mobile-app 빌드 산출물·스토어 배포](docs/06-build-and-release.md)에서 배포 준비·산출물·서명 또는 운영 설정·검증·업데이트·복귀를 확인합니다. 문서 추가는 샘플에 배포 기능이 구현되었다는 뜻이 아닙니다.

개발 도구 설치 전에 [서비스 OS 지원 범위](docs/06-build-and-release.md#서비스-os-지원-범위)에서 최소 OS·최대 지원 상태·실제 검증 범위를 확인합니다. SDK·패키지 변경 시 이 범위를 다시 대조합니다.
