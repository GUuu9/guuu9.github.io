<!-- version: v1.1.0 -->
# Mobile-app 최소 Flutter 보일러플레이트

## 1. 목적

Android·iOS용 Flutter 앱을 새 경로에서 시작할 때 복사해 사용할 수 있는 독립 샘플이다. 인사말을 비동기로 불러오는 한 화면으로 DI·MVVM의 최소 연결을 보여준다. 서버 통신·데이터베이스·인증·배포 서명은 포함하지 않는다.

패키지 폴더 `mobile-app/`을 통째로 복사해도 문서와 샘플을 사용할 수 있다. 실제 샘플은 `boilerplates/minimal/`만 따로 복사해도 실행 안내를 확인할 수 있다.

## 2. 기술과 버전 기준

| 항목 | 기준 |
| :--- | :--- |
| Flutter SDK | `.fvmrc`의 3.35.7 |
| Dart SDK | Flutter에 포함된 3.9.2, `pubspec.yaml`의 SDK 조건 |
| 앱 버전 | `pubspec.yaml`의 1.0.0+1 |
| 직접 패키지 | Flutter SDK와 개발용 `flutter_lints`만 사용 |
| 정확한 패키지 해석 | `pubspec.lock` |
| Android | Flutter 생성 Gradle 구성, Android Gradle Plugin 8.9.1, Gradle 8.12 |
| iOS | Flutter 생성 Xcode Runner 구성; 빌드에는 macOS·Xcode 필요 |

Flutter 3.35.7은 이 샘플의 기준 버전이지 최신 버전이나 모든 PC의 호환 보장이 아니다. SDK 버전 선택·복원은 [FVM 공식 문서](https://fvm.app/documentation/guides/basic-commands)를 따른다. `.fvmrc`의 JSON과 버전 값은 확인했지만, FVM CLI가 이 파일을 읽어 SDK를 선택하는 실행은 이 패키지 검증에서 수행하지 않았다.

## 3. 새 폴더에 복사하고 실행하기

기존 프로젝트가 아닌 새 대상 경로를 고른다. 예시는 macOS·Linux 셸에서 패키지 루트 `mobile-app/` 기준이다. 대상 이름은 아직 존재하지 않아야 한다.

```sh
mkdir -p "$HOME/Developer"
test ! -e "$HOME/Developer/my_app"
cp -R boilerplates/minimal "$HOME/Developer/my_app"
cd "$HOME/Developer/my_app"
fvm install
fvm flutter --version
fvm flutter pub get
fvm flutter analyze
fvm flutter test
```

Windows는 파일 탐색기에서 `boilerplates/minimal` 폴더 내용을 숨김 파일 포함해 새 대상 폴더로 복사한다. FVM 사용 환경이 준비된 뒤 대상 폴더에서 같은 FVM 명령을 실행한다. `.fvmrc`가 3.35.7을 선택한다. Flutter SDK를 `PATH` 전역에서 바꾸지 않는다.

## 4. Android Studio와 VS Code에서 열기

IDE에서 복사한 `my_app` 폴더 자체를 연다. 상위 `mobile-app` 문서 폴더나 `android/` 하위 폴더만 열지 않는다.

- Android Studio: Flutter 플러그인을 설치하고 Flutter SDK 경로를 프로젝트의 `.fvm/flutter_sdk` 절대 경로로 지정한다. IDE에 표시된 버전과 `fvm flutter --version`을 맞춘다.
- VS Code: Flutter 확장을 설치하고 Dart 확장이 `.fvm/flutter_sdk`를 선택했는지 확인한다. 필요하면 프로젝트 `.vscode/settings.json`에 `"dart.flutterSdkPath": ".fvm/flutter_sdk"`를 설정한다.
- IDE가 FVM 심볼릭 링크를 실제 버전 캐시 경로로 바꾸면 다음 버전 선택 때 자동 반영되지 않을 수 있다. IDE 설정의 경로·표시 버전을 확인하고 프로젝트 SDK 경로를 다시 지정한다.

자세한 공통 연결 안내는 [FVM의 Android Studio 안내](https://fvm.app/documentation/guides/android-studio), [VS Code 안내](https://fvm.app/documentation/guides/vscode)를 따른다. Android SDK·JDK 설치와 에뮬레이터·실기기 설정은 이 보일러플레이트에 포함하지 않는다.

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

화면은 ViewModel의 상태와 명령을 표시하고, ViewModel은 Service 인터페이스를 사용한다. 앱 시작 지점의 DI 구성만 객체를 만든다. 상세 의존 방향·전체 파일 목록·흐름은 [보일러플레이트 설명서 3·4절](docs/boilerplate.md#3-폴더파일명과-전체-역할-목록)에서 확인한다.

새 화면은 `lib/features/기능명/presentation/`에 View와 ViewModel을 함께 둔다. 외부 데이터 접근이 실제로 필요할 때만 `data/`에 Service 또는 Repository를 추가하고, 새 객체 생성은 DI 구성과 테스트에 연결한다. 화면에서 직접 API·파일·전역 객체를 만들지 않는다.

## 6. 검사·실행·빌드

샘플 작업 루트에서 실행한다.

```sh
fvm flutter analyze
fvm flutter test
fvm flutter run
fvm flutter build apk --debug
```

`run`은 Android 기기 또는 에뮬레이터를 선택해 시작하고 Ctrl+C로 종료한다. iOS는 macOS에서 Xcode 초기화·서명·기기를 별도로 준비한다. APK 빌드는 Android SDK와 Gradle 호환 JDK가 필요하다. 이 패키지 작성 당시 테스트와 분석은 통과했지만, 현재 PC의 Android Studio JDK 25와 생성 Gradle 8.12 조합 경고 때문에 Android 빌드와 실제 기동은 확인하지 못했다.

## 7. 보안·변경 경계

인사 서비스는 외부 통신 없이 고정된 문자열을 반환한다. 실패 상세를 화면에 노출하지 않는 예제를 포함한다. 제품 데이터·비밀값·서명 키는 없다. `.fvm/`, `android/local.properties`, Xcode 생성 설정과 빌드 산출물은 Git에 넣지 않는다. Android 앱 식별자·iOS Bundle Identifier·앱 이름은 새 제품에 맞게 바꾼다.

## 8. 패키지 구성·재사용

| 경로 | 내용 |
| :--- | :--- |
| [README.md](README.md) | 패키지 입구·빠른 시작 |
| [project-agents.md](project-agents.md) | 새 프로젝트에 복사해 `AGENTS.md`로 쓸 작업 지침 보관본 |
| [docs/boilerplate.md](docs/boilerplate.md) | 파일 역할·아키텍처·재사용·검증 기록 |
| [update.md](update.md) | 버전·변경 이력 |
| [boilerplates/minimal/](boilerplates/minimal/README.md) | Flutter 코드·테스트·Android/iOS 플랫폼 파일 |

프로젝트에 적용할 때는 `boilerplates/minimal/` 폴더를 새 프로젝트 루트에 복사한 뒤 `project-agents.md`를 새 루트 `AGENTS.md`로 복사한다. 문서를 함께 보관한다면 실제 배치에 맞게 상대 링크를 조정한다. [상세 재사용 절차](docs/boilerplate.md#8-새-프로젝트로-복사치환)를 따른다.

## 9. 검증·제약

Flutter 3.35.7·Dart 3.9.2로 샘플을 생성했다. 오프라인 의존성 복원, 정적 분석, 테스트 3개가 통과했다. Android Studio GUI·에뮬레이터·실기기, Android APK 빌드, Xcode/iOS 빌드는 확인하지 않았다. 명령과 상태별 상세 결과는 [설명서 9절](docs/boilerplate.md#9-예외검증-결과와-요구사항-대조표)에 있다.

공식 참고: [Flutter 앱 아키텍처](https://docs.flutter.dev/app-architecture/guide), [Flutter 테스트](https://docs.flutter.dev/testing/overview), [Flutter 프로젝트 생성](https://docs.flutter.dev/reference/create-new-app), [Flutter 라이선스](https://github.com/flutter/flutter/blob/3.35.7/LICENSE).

플랫폼별 권한 선언·동의 처리, 패키지/네이티브 버전 기준과 업데이트·복귀는 [플랫폼 관리 절차](docs/boilerplate.md#플랫폼별-권한패키지버전-업데이트)를 따른다.
