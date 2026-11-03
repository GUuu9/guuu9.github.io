<!-- version: v1.5.1 -->
# Android 프로젝트 빌드·버전 관리

Flutter 앱의 Android 빌드가 PC·IDE 업데이트 뒤 깨지거나 새 개발 PC에서 재현되지 않을 때 사용하는 가이드입니다. 개인 PC의 macOS·Windows·Linux와 CI에서 **기존 프로젝트가 사용하는 버전 조합을 먼저 복원**합니다. Flutter 선택은 [FVM 공식 가이드](https://fvm.app/documentation/guides/basic-commands), 기기 연결은 [Android 실기기 연결 공식 안내](https://developer.android.com/studio/run/device)을 따릅니다. 아래 명령은 별도 표시가 없으면 Flutter 프로젝트 루트의 일반 사용자 터미널에서 실행합니다. 아래는 기본 FVM 명령입니다. 선택적 프로젝트 실행기를 도입한 경우에만 해당 호출로 대체합니다. `android` 폴더의 직접 Wrapper 호출은 작업 셸 환경을 상속합니다.

이 문서는 mobile-app 패키지의 프로젝트 빌드 절차입니다. 먼저 [프로젝트 환경 정의·격리](./project-environment.md)에 따라 로컬 경로·환경 변수와 실행 범위를 정합니다. Android와 iOS를 함께 관리한다면 [iOS 빌드·버전 관리](./ios-build.md)를 이어서 확인합니다.

## 무엇을 설치하고 어디에서 버전을 정하는가

| 구성 | 역할 | 설치·버전 기준 |
| :--- | :--- | :--- |
| Flutter·Dart | Flutter 빌드와 Dart 실행 | FVM과 `.fvmrc`; Dart는 Flutter에 포함 |
| JDK | Gradle을 실행하는 Java 환경·컴파일 도구 | Android Studio 포함 JBR/JDK 또는 별도 JDK. 실제 경로·버전 기록 |
| Gradle | Android 빌드 작업 실행 | `android/gradlew`·`gradlew.bat`과 `android/gradle/wrapper/gradle-wrapper.properties` |
| AGP | Gradle에 Android 빌드 기능 제공 | 보통 `android/settings.gradle(.kts)`의 `com.android.application` 버전 |
| Kotlin Gradle Plugin | Kotlin 코드 빌드 | 보통 같은 settings 파일의 `org.jetbrains.kotlin.android` 버전 |
| Android SDK | Android API·패키징·기기 연결 도구 | SDK Manager의 Platform·Build-Tools·Platform-Tools |
| NDK·CMake | 네이티브 C/C++ 코드 빌드 | 프로젝트·플러그인이 요구할 때 SDK Manager에서 해당 버전 추가 |

구형 프로젝트는 AGP·Kotlin 버전이 `android/build.gradle`의 buildscript에 있고, 다른 프로젝트는 `gradle/libs.versions.toml` 같은 version catalog를 사용합니다. 이미 선언한 위치를 찾아 수정하며 새 선언을 중복 추가하지 않습니다. AGP·Kotlin은 Gradle이 저장소에서 받는 플러그인이므로 PC에 별도 실행 파일로 설치하지 않습니다.

`minSdk`는 실행 가능한 최소 Android API, `compileSdk`는 컴파일 API, `targetSdk`는 앱이 대상으로 선언하는 API·동작 기준입니다. 이 숫자는 Gradle·JDK 버전과 다릅니다. `sourceCompatibility`·`targetCompatibility`·Kotlin `jvmTarget`도 **Gradle 실행 JDK**와 다른 설정입니다. Java 언어 수준이 11이라고 해서 Gradle 실행용 JDK도 11이어야 하는 것은 아닙니다. [Android의 Java·JDK 구분](https://developer.android.com/build/jdks).

## 기존 환경 확인·복원

1. README·CI·정상 빌드 이력과 `.fvmrc`, pubspec/lock, Gradle 설정·Wrapper를 확인합니다. 복원 중 SDK·AGP·Gradle을 최신으로 바꾸지 않습니다.
2. [FVM 공식 복원 절차](https://fvm.app/documentation/guides/basic-commands) 후 Android Studio의 **Tools → SDK Manager**에서 프로젝트가 요구하는 SDK Platform·Build-Tools와 Platform-Tools를 설치합니다. NDK·CMake는 필요한 경우만 추가합니다. SDK 경로는 SDK Manager의 Android SDK Location을 기준으로 `ANDROID_HOME`에 지정합니다. `adb`를 직접 실행하려면 그 아래 `platform-tools`를 PATH에 추가합니다. 라이선스는 프로젝트 루트에서 `fvm flutter doctor --android-licenses`로 확인합니다. [Android 환경 변수](https://developer.android.com/tools/variables).
3. 아래 JDK 선택을 완료한 뒤 프로젝트 Wrapper를 사용합니다. Wrapper가 지정 Gradle을 처음 받을 때는 네트워크가 필요합니다. Flutter 프로젝트에 `brew install gradle` 등 전역 Gradle 설치는 필요하지 않습니다. Wrapper 스크립트·JAR·properties는 Git에 보관합니다. [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html).

```bash
fvm flutter --version
fvm flutter doctor -v
java -version
```

macOS·Linux에서는 프로젝트 루트에서:

```bash
(cd android && ./gradlew --version)
```

Windows PowerShell에서는 프로젝트의 `android` 폴더로 이동해:

```powershell
.\gradlew.bat --version
```

출력의 Gradle 버전과 JVM·Java home을 기록합니다. `java -version`만으로 Flutter가 사용하는 JDK를 판단하지 않습니다. Wrapper 실행도 지정 배포판을 다운로드할 수 있으며, 빌드 성공을 뜻하지 않습니다.

## JDK 설치·선택

호환 JDK가 이미 있으면 재사용합니다. 별도 설치가 필요하면 저장소의 `00.Setup/` OS별 설치 안내와 `01.Tools/jdk.md`의 공통 관리 절차를 먼저 확인합니다. macOS는 Homebrew의 요구 major formula, Windows는 [공식 MSI](https://adoptium.net/installation/windows), Linux는 [공식 아카이브](https://adoptium.net/installation/archives)를 사용하며 중복 설치하지 않습니다. 이 패키지만 가져온 경우에도 해당 공식 안내에서 OS·CPU 조건을 확인할 수 있습니다.

설치 후 [프로젝트 환경 정의·격리](./project-environment.md)에 실제 JAVA_HOME을 기록하고 작업 셸에서 선택합니다. 공용 셸 설정이나 다른 프로젝트의 JDK를 바꾸지 않습니다. macOS Homebrew JDK는 `$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home`처럼 실제 formula 경로를 사용하며, 17은 프로젝트 요구 버전으로 바꿉니다.

- 직접 Wrapper 실행: `--version`의 JVM·Java home을 확인합니다. JAVA_HOME 외에도 `org.gradle.java.home`·Daemon JVM criteria가 영향을 줄 수 있습니다.
- Android Studio: **Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK**에서 같은 호환 JDK를 선택합니다. 필요하면 `android` 폴더를 별도 프로젝트로 엽니다.
- Flutter: `fvm flutter doctor -v`의 Java 경로·버전을 확인합니다. JAVA_HOME과 다르면 [선택적 Flutter 설정 분리](./project-environment.md#3-선택적-flutter-사용자-설정-분리)를 검토하며 IDE Run이 자동으로 이를 사용한다고 가정하지 않습니다.

선택 후 doctor와 Wrapper를 다시 비교합니다. 기존 daemon을 중지해야 하면 실행 중인 작업을 확인한 뒤 Android 폴더에서 `./gradlew --stop`(Windows는 `.\gradlew.bat --stop`)을 사용합니다. 같은 버전의 다른 Gradle 작업도 중단될 수 있습니다. JDK 업데이트·제거는 다른 참조 프로젝트까지 확인하고 진행하며, 프로젝트별 환경 변수만으로 공유 Homebrew formula의 patch 업데이트를 격리할 수는 없습니다.

## 호환되는 버전 조합 고르기

1. 프로젝트 Flutter 버전·플러그인의 Android 요구 사항을 확인합니다.
2. 선택할 AGP 릴리스 문서에서 요구 Gradle·JDK·지원 Android API를 확인합니다.
3. 해당 Gradle의 Java 호환 표에서 **Gradle 실행용 JDK** 지원 범위를 확인합니다. AGP의 최소 조건만 맞추고 JDK를 무조건 최신으로 올리지 않습니다.
4. Kotlin 플러그인과 Android Studio의 AGP 지원 범위, SDK·NDK 요구 사항도 대조합니다.

현재 저장소 mobile-app 샘플 파일은 **AGP 8.9.1·Gradle 8.12·Kotlin 2.1.0**을 선언합니다. AGP 8.9 공식 조건은 Gradle 최소 8.11.1·JDK 17이며, Gradle 8.12는 JDK 25로 실행하는 조합을 지원하지 않습니다. 이 샘플의 JDK 25 경고를 해결하려면 도구 전체를 올리기 전에 호환 JDK 17을 선택하는 것이 첫 확인 단계입니다. 이는 실제 APK 빌드 성공이 검증된 조합이라는 뜻은 아닙니다.

AGP 8.9의 공식 최대 지원 API는 35입니다. 앱 설정이 `flutter.compileSdkVersion`처럼 Flutter 기본값을 참조하면 실제 값도 확인해야 합니다. 더 높은 API를 요구할 때 AGP·Gradle·JDK를 함께 검토하며 샘플을 최신 정책에 맞는 완성 조합으로 간주하지 않습니다. [AGP 8.9 호환 조건](https://developer.android.com/build/releases/agp-8-9-0-release-notes) · [Gradle Java 호환 표](https://docs.gradle.org/current/userguide/compatibility.html).

프로젝트 README나 CI에는 정상 확인한 조합을 다음처럼 기록합니다. 빈칸은 실제 확인값으로 채우며 예시를 그대로 정상 상태로 표시하지 않습니다.

```text
Flutter/Dart: .fvmrc 및 실제 버전
JDK: 배포판·버전·CPU, 로컬 선택 방법/CI 설정
Gradle/AGP/Kotlin: Wrapper와 플러그인 선언값
Android: minSdk/compileSdk/targetSdk, Build-Tools, 필요한 NDK/CMake
검증: OS/CPU, debug/release, 기기 Android API, 정상 커밋
```

## 업데이트·검증·이전 버전 복귀

1. 작업 브랜치에서 정상 커밋·미커밋 변경을 보존하고 현재 조합을 기록합니다. 서명 키·비밀번호는 별도 안전한 위치에 보관하고 Git·명령 출력에 넣지 않습니다.
2. 목적을 정합니다. Studio 업데이트, JDK 보안 패치, target API 변경, Flutter·플러그인 업데이트를 한 번에 섞지 않습니다. 호환성 때문에 함께 바꿔야 하는 AGP·Gradle·JDK는 하나의 변경 단위로 다룹니다.
3. AGP·Kotlin 선언과 SDK 요구를 검토하고, Gradle은 Android 폴더에서 Wrapper task로 목표 버전을 지정합니다. 아래 `목표버전`은 공식 호환 표에서 정한 값으로 교체합니다.

```bash
./gradlew wrapper --gradle-version 목표버전
```

현재 JDK로 기존 Wrapper가 실행되지 않으면 먼저 기존 Gradle과 호환되는 JDK를 선택합니다. Wrapper 생성 파일 전체의 diff를 확인하고 공식 Wrapper 안내에 따라 필요하면 갱신한 Wrapper task를 다시 실행합니다. `distributionSha256Sum`을 관리하는 프로젝트는 새 배포판의 공식 체크섬도 맞춥니다. Windows는 `gradlew.bat`을 사용합니다. Android Studio의 AGP Upgrade Assistant를 쓴 경우에도 변경 파일과 Flutter 지원 조건을 검토합니다.

4. Flutter 루트로 돌아와 기존 의존성을 복원하고 빌드·실행을 확인합니다.

```bash
fvm flutter pub get
fvm flutter doctor -v
fvm flutter analyze
fvm flutter test
fvm flutter build apk --debug
fvm flutter devices
```

테스트가 없는 프로젝트는 실제 검사 범위를 기록하고 프로젝트 CI·flavor·환경 인자를 우선합니다. 기기를 선택해 `fvm flutter run -d 기기ID`로 실행하고 권한·플러그인·네이티브 기능을 확인합니다. debug 성공만으로 배포 성공을 판단하지 않으며 배포용 프로젝트는 서명·비밀정보를 안전하게 준비한 환경에서 release AAB와 스토어 검사도 수행합니다.

5. 실패하면 보존한 변경을 유지하면서 버전 선언·Wrapper 파일·lockfile을 업데이트 전 기준으로 복원하고 FVM·JDK 선택도 이전 값으로 되돌립니다. Git 강제 reset, `android/` 재생성, 전체 `.gradle`·SDK·lockfile 삭제는 기본 복구 절차로 사용하지 않습니다. 이전 도구·SDK는 복귀 검증이 끝날 때까지 남겨 둡니다.

## 오류를 볼 때 구분할 것

| 오류·상황 | 먼저 확인 |
| :--- | :--- |
| `JAVA_HOME`이 잘못되었거나 Java 없음 | 실제 JDK 루트·실행 파일과 터미널 환경 |
| AGP가 특정 Java 이상 요구 | AGP 최소 JDK와 실제 빌드 JDK |
| `Unsupported class file major version` | 실제 JDK와 Wrapper Gradle 호환 범위, 관련 플러그인 요구 |
| SDK Platform·NDK 없음 | 프로젝트 요구 버전을 SDK Manager로 추가. 기존 설치를 일괄 제거하지 않음 |
| CLI 성공·IDE 실패 또는 반대 | doctor Java·Wrapper JVM·IDE Gradle JDK의 차이 |
| Android Studio 업데이트 직후 실패 | 포함 JBR 변경, AGP·Gradle 호환성. 프로젝트 버전부터 무조건 올리지 않음 |

ADB 연결 성공과 Android 빌드 성공은 별도입니다. 휴대폰이 `device` 상태라면 빌드 오류를 해결하기 위해 USB 인증이나 기기 데이터를 초기화하지 않습니다.

## 공식 참고

확인일: 2026-11-03. 공식 문서·저장소 샘플 설정을 대조했습니다. 이 문서 작성 중 JDK 설치·Gradle 다운로드·APK 빌드는 수행하지 않았습니다.

- [Android Java·Gradle JDK 선택](https://developer.android.com/build/jdks)
- [AGP 릴리스·호환 정보](https://developer.android.com/build/releases)
- [Gradle Java 호환 표](https://docs.gradle.org/current/userguide/compatibility.html)
- [Gradle Wrapper 갱신](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- [Flutter Java·Gradle 문제 진단](https://docs.flutter.dev/release/breaking-changes/android-java-gradle-migration-guide): 과거 릴리스의 예시 버전을 현재 프로젝트에 그대로 적용하지 않음

스토어 제출용 산출물·서명·등록·테스트 배포·업데이트는 [Mobile-app 빌드·스토어 배포](./build-and-release.md)에서 이어서 확인합니다.
