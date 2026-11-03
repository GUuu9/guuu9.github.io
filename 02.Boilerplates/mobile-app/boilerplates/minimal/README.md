# mobile_app_sample

Flutter 3.35.7 기반 Android·iOS용 최소 MVVM 샘플이다. 고정 인사말을 불러오는 버튼 하나로 DI 조립, ViewModel 상태, View 갱신과 오류 처리를 확인한다.

## 설치 명령 전 선행 확인

macOS는 Command Line Tools 설치 또는 선택한 전체 Xcode의 라이선스 동의·최초 초기화를 먼저 완료하고 `git --version`·`clang --version`이 오류 없이 동작하는지 확인합니다. 라이선스 오류가 남아 있으면 Git·nvm·FVM 설치를 계속하지 않습니다. 공통 명령은 [Apple 개발 도구](https://developer.apple.com/library/archive/technotes/tn2339/_index.html)와 [Xcode 라이선스·초기화](https://docs.flutter.dev/platform-integration/ios/setup)를 따릅니다. CLT만 사용하는 경우 전체 Xcode 전용 명령은 실행하지 않습니다.

필수는 Git → FVM·프로젝트 Flutter SDK이며 Dart는 포함됩니다. Android 대상은 SDK·호환 JDK, iOS 대상은 Mac·전체 Xcode가 추가 필수입니다. CocoaPods를 사용할 때만 Ruby·Bundler·CocoaPods를 준비합니다. 편집기 확장은 IDE 선택에 따라 설치합니다.

## 처음 시작할 때

유형 패키지 전체가 있다면 유형 패키지의 시작 가이드에서 다운로드·새 폴더 복사·플랫폼 도구 설치·프로젝트 환경 적용을 먼저 진행한다. 이 minimal 폴더만 받은 경우에도 아래 준비 조건을 확인한 뒤 복원·검사·기기 실행 순서로 읽는다. FVM이 없다면 macOS·Linux의 일반 터미널에서 `curl -fsSL https://fvm.app/install.sh | bash`로 공식 설치하고 새 터미널에서 `fvm --version`을 확인한다. Windows 독립 설치와 지원 조건은 [FVM 공식 안내](https://fvm.app/documentation/getting-started/installation)를 따른다.

[Android 공식 SDK·기기 준비](https://docs.flutter.dev/platform-integration/android/setup), [iOS 공식 Xcode·기기 준비](https://docs.flutter.dev/platform-integration/ios/setup)에서 필요한 플랫폼만 설치한다. 전체 패키지의 환경·Android·iOS 가이드에는 프로젝트 격리와 구체적인 설치 명령이 있다. 다른 프로젝트의 공용 JDK·Flutter 설정·Xcode 선택을 바꾸는 대신 로컬 설정을 준비한다. 격리 실행기를 도입했다면 아래 `fvm flutter` 호출을 프로젝트의 실행기로 대체하며 IDE Run도 같은 환경인지 따로 확인한다.

## 준비 조건

- Flutter 3.35.7 / Dart 3.9.2. `.fvmrc`로 선택한다.
- 작성·CLI 검증 host: macOS 13.7.8, Intel x86_64. 다른 OS·CPU에서 이 샘플의 실행·빌드는 확인하지 않았다.
- Android 실행은 Android SDK·호환 JDK·에뮬레이터 또는 디버깅 허용 기기가 필요하다.
- iOS 실행은 macOS·Xcode·iOS Simulator 또는 개발 설정된 기기가 필요하다.
- 개발 의존성 `flutter_lints`를 제외하면 Flutter SDK 외 패키지를 사용하지 않는다. `pubspec.lock`을 커밋한다.

## 의존성 복원·검사

이 디렉터리를 새 프로젝트 루트로 사용한다. FVM 설치 후:

```sh
fvm install
fvm flutter --version
fvm flutter pub get
fvm flutter analyze
fvm flutter test
```

예상 버전은 Flutter 3.35.7, 테스트 결과는 3개 통과다.

이 패키지에서는 FVM CLI의 `.fvmrc` 인식과 SDK 링크 설정을 직접 실행해 확인하지 않았다. FVM 명령은 연결한 공식 문서대로 사용하고 `fvm flutter --version` 출력으로 실제 선택 버전을 확인한다.

## 실행·종료

Android Studio에서 프로젝트 루트를 열고 FVM이 설치한 프로젝트 SDK를 선택한다. Android SDK Manager에서 필요한 SDK·Build-Tools를 설치하고 에뮬레이터를 시작하거나 USB 디버깅을 허용한 Android 기기를 연결한다.

```sh
fvm flutter devices
fvm flutter run -d 기기ID
```

`-d 기기ID`는 `devices`에 출력된 ID로 바꾼다. 종료는 터미널에서 Ctrl+C다. iOS는 macOS에서 Xcode 초기화·서명·기기를 별도로 준비한 뒤 `fvm flutter run -d 기기ID`로 실행한다. CocoaPods를 쓰는 프로젝트는 Gemfile·lock으로 복원하고 Flutter의 iOS 실행·빌드에도 `bundle exec`를 붙여 같은 도구 버전을 사용한다.

Android APK 빌드:

```sh
fvm flutter build apk --debug
```

이 샘플은 생성 당시 Gradle 8.12를 사용한다. 생성 환경에는 JDK 25만 보여 Flutter CLI가 호환 경고를 냈다. Android 빌드에는 Gradle 8.12가 지원하는 JDK(17 이상, 24 미만)를 Android Studio Gradle JDK 또는 `JAVA_HOME`으로 선택한다. 이 샘플의 APK 빌드는 아직 확인하지 않았다.

## 구조와 변경

`lib/main.dart`에서 `core/di/app_dependencies.dart`를 통해 인사 Service와 ViewModel을 만들고 `app.dart`가 ViewModel 수명을 관리한다. `features/greeting/presentation/`의 View는 상태를 표시하고 동작을 ViewModel에 전달한다. 자세한 파일 책임·의존 규칙·새 프로젝트 복사는 유형 패키지의 설명서를 참고한다.

Android application ID·앱 이름과 iOS Bundle Identifier·표시 이름은 새 프로젝트에 맞춰 바꾼다. `.fvm/`, `android/local.properties`, `ios/Flutter/Generated.xcconfig`, `.dart_tool/`, `build/` 및 서명 키는 버전 관리에 넣지 않는다.

실제 Android/iOS 기동과 IDE GUI는 이 패키지 생성 과정에서 검증하지 않았다.

환경 변수 양식은 `.env.example`로 공유하고 실제 값은 Git 제외 `.env`로 관리합니다. 기본 실행에는 추가 값이 필요하지 않습니다. 새 앱은 유형 시작 가이드의 Git archive 절차로 만들며 작업 폴더의 `.env`·캐시·빌드 결과를 통째로 복사하지 않습니다.
