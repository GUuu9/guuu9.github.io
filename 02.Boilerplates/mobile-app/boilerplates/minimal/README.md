# mobile_app_sample

Flutter 3.35.7 기반 Android·iOS용 최소 MVVM 샘플이다. 고정 인사말을 불러오는 버튼 하나로 DI 조립, ViewModel 상태, View 갱신과 오류 처리를 확인한다.

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

`-d 기기ID`는 `devices`에 출력된 ID로 바꾼다. 종료는 터미널에서 Ctrl+C다. iOS는 macOS에서 Xcode 초기화·서명·기기를 별도로 준비한 뒤 `fvm flutter run -d 기기ID`로 실행한다.

Android APK 빌드:

```sh
fvm flutter build apk --debug
```

이 샘플은 생성 당시 Gradle 8.12를 사용한다. 생성 환경에는 JDK 25만 보여 Flutter CLI가 호환 경고를 냈다. Android 빌드에는 Gradle 8.12가 지원하는 JDK(17 이상, 24 미만)를 Android Studio Gradle JDK 또는 `JAVA_HOME`으로 선택한다. 이 샘플의 APK 빌드는 아직 확인하지 않았다.

## 구조와 변경

`lib/main.dart`에서 `core/di/app_dependencies.dart`를 통해 인사 Service와 ViewModel을 만들고 `app.dart`가 ViewModel 수명을 관리한다. `features/greeting/presentation/`의 View는 상태를 표시하고 동작을 ViewModel에 전달한다. 자세한 파일 책임·의존 규칙·새 프로젝트 복사는 [유형 설명서](../../docs/boilerplate.md)를 참고한다.

Android application ID·앱 이름과 iOS Bundle Identifier·표시 이름은 새 프로젝트에 맞춰 바꾼다. `.fvm/`, `android/local.properties`, `ios/Flutter/Generated.xcconfig`, `.dart_tool/`, `build/` 및 서명 키는 버전 관리에 넣지 않는다.

실제 Android/iOS 기동과 IDE GUI는 이 패키지 생성 과정에서 검증하지 않았다.
