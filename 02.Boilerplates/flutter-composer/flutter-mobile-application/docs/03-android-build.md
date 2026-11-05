<!-- version: v3.1.1 -->
# Android 프로젝트 빌드·버전 관리

Flutter 앱의 Android 빌드가 PC·IDE 업데이트 뒤 깨지거나 새 개발 PC에서 재현되지 않을 때 사용하는 가이드입니다. 개인 PC의 macOS·Windows·Linux와 CI에서 **기존 프로젝트가 사용하는 버전 조합을 먼저 복원**합니다. Flutter 선택은 [FVM 공식 가이드](https://fvm.app/documentation/guides/basic-commands), 기기 연결은 [Android 실기기 연결 공식 안내](https://developer.android.com/studio/run/device)을 따릅니다. 아래 명령은 별도 표시가 없으면 Flutter 프로젝트 루트의 일반 사용자 터미널에서 실행합니다. 아래는 기본 FVM 명령입니다. 선택적 프로젝트 실행기를 도입한 경우에만 해당 호출로 대체합니다. `android` 폴더의 직접 Wrapper 호출은 작업 셸 환경을 상속합니다.

이 문서는 Flutter 모바일 앱 패키지의 프로젝트 빌드 절차입니다. 먼저 [프로젝트 환경 정의·격리](./02-project-environment.md)에 따라 로컬 경로·환경 변수와 실행 범위를 정합니다. Android와 iOS를 함께 관리한다면 [iOS 빌드·버전 관리](./04-ios-build.md)를 이어서 확인합니다.

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

## 처음 설치: SDK·JDK·PATH

[시작 가이드](./01-getting-started.md)의 PC 기본 도구·FVM 설치를 마친 프로젝트에서 진행합니다.

### 1. 가상 기기용 Android Studio 설치

[Android Studio 다운로드](https://developer.android.com/studio)에서 개발 PC의 OS·CPU용 설치기를 받습니다. macOS는 DMG의 앱을 Applications로 옮기고, Windows는 설치 마법사에서 설치 경로를 정하며, Linux는 압축 파일을 도구 폴더에 풀어 `android-studio/bin/studio` 또는 배포본의 `studio.sh`로 실행합니다. 첫 실행의 Setup Wizard를 완료합니다. 코드 개발은 VS Code에서 하며 Android Studio는 Virtual Device Manager를 사용하기 위해 준비합니다. 실기기만 사용하고 SDK 명령행 도구를 준비했다면 Android Studio 설치는 생략할 수 있습니다. 최신 설치기가 OS·CPU를 지원하지 않으면 [공식 archive](https://developer.android.com/studio/archive)에서 호환 릴리스를 선택합니다. 과거 릴리스의 새 AGP·SDK 지원은 별도로 확인합니다. [OS별 설치·선행 라이브러리](https://developer.android.com/studio/install).

### 2. 프로젝트 SDK 패키지 설치

[Android Studio 배포 페이지](https://developer.android.com/studio#command-tools)의 **Command line tools only**에서 OS용 압축 파일을 받습니다. 프로젝트 SDK 루트를 macOS는 `~/Library/Android/sdk`, Linux는 `~/Android/Sdk`, Windows는 `D:\Developer\Android\Sdk`처럼 지정합니다.

압축을 풀어 `bin`, `lib`, `NOTICE.txt`, `source.properties`가 SDK 루트의 `cmdline-tools/latest/` 바로 아래에 오도록 옮깁니다. 예를 들어 `cmdline-tools/latest/bin/sdkmanager`(Windows는 sdkmanager.bat)가 있어야 합니다. 기존 SDK 파일을 덮어쓰지 않습니다. JDK·PATH를 준비한 뒤 5절의 명령으로 프로젝트 패키지를 설치합니다. [공식 SDK 명령행 도구 배치](https://developer.android.com/tools/sdkmanager).

이 샘플은 확인된 Command-line Tools 12.0과 sdkmanager 사용 절차를 유지합니다. 최신 공식 도구의 Android CLI 전환은 별도 변경으로 검증하며 초기 설정 중 도구를 임의 전환하지 않습니다.

### 3. JDK 17 설치·선택

Android Studio 포함 JDK가 17이면 그 실제 Home 경로를 재사용할 수 있습니다. 다른 major이면 다음처럼 별도 JDK 17을 설치합니다. Gradle·AGP는 프로젝트 Wrapper와 설정으로 받으므로 별도 전역 설치하지 않습니다.

macOS는 준비된 Homebrew로 설치합니다. 공용 Java 링크를 만들지 않습니다.

```bash
brew install openjdk@17
export JAVA_HOME="$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home"
```

Intel·구형 macOS에서 brew 패키지를 설치할 수 없다면 [Temurin 17 배포](https://adoptium.net/temurin/releases/?version=17)에서 macOS·CPU용 과거/호환 아카이브를 받아 공식 SHA-256과 비교하고 도구 폴더에 풉니다. 압축 내부의 `Contents/Home`을 JAVA_HOME으로 지정합니다. 지원 OS 확인 없이 최신 archive가 실행된다고 가정하지 않습니다.

Windows는 같은 배포 페이지에서 Windows·CPU용 JDK 17 ZIP을 받아 예를 들어 `D:\Developer\tools\jdk-17`로 풉니다. `bin\java.exe`가 그 바로 아래 있는지 확인합니다. Linux도 Linux·CPU용 JDK 17 tar.gz를 받아 도구 폴더에서 다음처럼 풉니다. 파일명은 다운로드한 실제 이름으로 바꿉니다.

```bash
mkdir -p "$HOME/Developer/tools"
tar -xzf /다운로드/실제-jdk17.tar.gz -C "$HOME/Developer/tools"
```

다운로드한 파일의 SHA-256은 macOS `shasum -a 256 파일명`, Linux `sha256sum 파일명`, Windows `Get-FileHash 파일명 -Algorithm SHA256`으로 공식 값과 비교합니다. [Homebrew JDK 17](https://formulae.brew.sh/formula/openjdk@17) · [Temurin 압축 설치](https://adoptium.net/installation/archives/).

### 4. 프로젝트 작업 셸의 PATH 적용

프로젝트 터미널에서 `bash` 또는 `powershell.exe -NoProfile -NoExit`로 작업 자식 셸을 열고 적용합니다. 종료 시 `exit`하면 부모 셸 환경으로 돌아갑니다. 다음 경로는 SDK Manager·압축 해제 위치에 맞게 바꿉니다. `.env`에는 완성한 개인 절대 경로를 기록하고 아래 명령으로 현재 작업 셸에 적용합니다.

macOS:

```bash
export JAVA_HOME="$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

Linux:

```bash
export JAVA_HOME="$HOME/Developer/tools/실제-jdk17폴더"
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

Windows PowerShell:

```powershell
$env:JAVA_HOME = "D:\Developer\tools\jdk-17"
$env:ANDROID_HOME = "D:\Developer\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
```

VS Code에서 실행하는 빌드는 아래 작업 셸의 JDK와 Flutter가 실제 선택한 Java를 사용합니다. Android Studio의 Gradle JDK 설정은 이 실행 환경을 정하지 않습니다. Flutter가 실제로 고른 Java는 아래 doctor 출력으로 확인합니다. 다른 Java를 고르면 [프로젝트별 Flutter 설정 분리](./02-project-environment.md#3-선택적-flutter-사용자-설정-분리)를 적용한 뒤 모든 Flutter 명령을 그 실행기로 통일합니다.

### 5. 설치·라이선스·기기 확인

프로젝트 작업 셸에서 SDK 패키지를 설치합니다. 아래는 초기 압축을 푼 latest 도구 경로이며 기존 설치 경로가 다르면 바꿉니다.

```bash
"$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$ANDROID_HOME" "platform-tools" "platforms;android-36" "build-tools;35.0.0" "ndk;27.0.12077973" "cmdline-tools;12.0"
```

Windows PowerShell:

```powershell
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat" "--sdk_root=$env:ANDROID_HOME" "platform-tools" "platforms;android-36" "build-tools;35.0.0" "ndk;27.0.12077973" "cmdline-tools;12.0"
```

설치 중 라이선스를 검토·동의합니다. 이후 버전 목록은 설치된 `cmdline-tools/12.0/bin/sdkmanager --list`로 확인합니다. API 36 Platform은 현재 제공되는 revision이 설치되므로 기존 rev. 2와 다르면 기록합니다. 가상 기기의 Emulator·CPU별 시스템 이미지는 Android Studio Virtual Device Manager에서 기기를 만들 때 받습니다. Platform 33·34는 이 샘플의 필수 패키지가 아닙니다.

프로젝트 루트에서:

```bash
java -version
adb --version
fvm flutter doctor --android-licenses
fvm flutter doctor -v
```

Java 17·선택 SDK 경로를 확인하고 표시되는 라이선스를 검토·동의합니다. macOS·Linux는 `(cd android && ./gradlew --version)`, Windows는 `android`에서 `.\gradlew.bat --version`으로 Gradle 8.14와 JVM 17을 확인합니다.

실기기는 휴대폰의 개발자 옵션 → USB 디버깅을 켜고 데이터 케이블로 연결한 뒤 잠금을 풀어 컴퓨터의 디버깅 키를 승인합니다. Windows는 제조사 요구 USB 드라이버를 설치합니다. `adb devices -l`에서 `device`인지 확인합니다. `unauthorized`이면 휴대폰 승인 창을 확인합니다. 에뮬레이터는 Android Studio **Device Manager → Create Device**에서 설치한 이미지를 선택해 생성·시작합니다.

```bash
adb devices -l
fvm flutter devices
```

기기가 보이면 [시작 가이드의 의존성 복원·실행](./01-getting-started.md#5-프로젝트-환경-확인의존성-복원)으로 돌아갑니다. [Flutter Android 설정](https://docs.flutter.dev/platform-integration/android/setup) · [Android 실기기](https://developer.android.com/studio/run/device).

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

아래 최초 설치 절차에서 JDK 17을 준비하고 [프로젝트 환경 정의](./02-project-environment.md)에 실제 경로를 기록합니다. 직접 Wrapper·IDE·Flutter가 같은 JDK를 사용하는지 확인합니다.

- 직접 Wrapper 실행: `--version`의 JVM·Java home을 확인합니다. JAVA_HOME 외에도 `org.gradle.java.home`·Daemon JVM criteria가 영향을 줄 수 있습니다.
- VS Code: 프로젝트 루트의 통합 터미널에서 JAVA_HOME·doctor·Wrapper JVM을 확인합니다. F5 실행의 Java 선택도 doctor 결과와 비교합니다.
- Flutter: `fvm flutter doctor -v`의 Java 경로·버전을 확인합니다. JAVA_HOME과 다르면 [선택적 Flutter 설정 분리](./02-project-environment.md#3-선택적-flutter-사용자-설정-분리)를 검토하며 IDE Run이 자동으로 이를 사용한다고 가정하지 않습니다.

선택 후 doctor와 Wrapper를 다시 비교합니다. 기존 daemon을 중지해야 하면 실행 중인 작업을 확인한 뒤 Android 폴더에서 `./gradlew --stop`(Windows는 `.\gradlew.bat --stop`)을 사용합니다. 같은 버전의 다른 Gradle 작업도 중단될 수 있습니다. JDK 업데이트·제거는 다른 참조 프로젝트까지 확인하고 진행하며, 프로젝트별 환경 변수만으로 공유 Homebrew formula의 patch 업데이트를 격리할 수는 없습니다.

## 호환되는 버전 조합 고르기

1. 프로젝트 Flutter 버전·플러그인의 Android 요구 사항을 확인합니다.
2. 선택할 AGP 릴리스 문서에서 요구 Gradle·JDK·지원 Android API를 확인합니다.
3. 해당 Gradle의 Java 호환 표에서 **Gradle 실행용 JDK** 지원 범위를 확인합니다. AGP의 최소 조건만 맞추고 JDK를 무조건 최신으로 올리지 않습니다.
4. Kotlin 플러그인과 Android Studio의 AGP 지원 범위, SDK·NDK 요구 사항도 대조합니다.

현재 샘플 설정은 별도 작업 위치에서 정상 동작을 확인한 조합을 반영합니다. 이 저장소 사본의 Android 빌드는 다시 실행하지 않았습니다.

| 항목 | 샘플 설정·확인값 |
| :--- | :--- |
| Flutter / Dart | 3.35.7 / 3.9.2 (`.fvmrc`, `pubspec.lock`) |
| AGP / Kotlin Plugin / Gradle Wrapper | 8.11.1 / 2.2.20 / 8.14 |
| Gradle 실행 JDK | 17 |
| Android API | minSdk 28, compileSdk 36, targetSdk 36 |
| SDK Manager 패키지 | Platform 36 (rev. 2), Build-Tools 35.0.0, NDK 27.0.12077973, Command-line Tools 12.0 (`apkanalyzer` 포함) |
| 추가 설치 패키지 | Platform 33 (rev. 3), Platform 34 (rev. 3) |

AGP 8.11은 Gradle 최소 8.13·JDK 17·API 36을 요구하며 기본 Build-Tools 35.0.0·NDK 27.0.12077973을 사용합니다. Kotlin Plugin 2.2.20은 Gradle 8.14·AGP 8.11.1까지 fully supported 범위에 포함됩니다. Gradle 8.14는 JDK 17로 실행할 수 있습니다. [AGP 8.11 호환 조건](https://developer.android.com/build/releases/agp-8-11-0-release-notes) · [Kotlin Gradle 호환 표](https://kotlinlang.org/docs/gradle-configure-project.html) · [Gradle Java 호환 표](https://docs.gradle.org/current/userguide/compatibility.html).

Platform 36·Build-Tools·Command-line Tools는 SDK Manager에서 준비합니다. `apkanalyzer`를 직접 사용한다면 Command-line Tools 설치 경로의 `apkanalyzer` 실행 파일도 확인합니다. Platform 33·34는 확인된 작업 환경에 추가로 설치돼 있었으며 이 샘플은 API 36으로 빌드합니다.

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
| CLI 성공·IDE 실패 또는 반대 | doctor Java·Wrapper JVM·VS Code 실행 환경의 차이 |
| Android Studio 업데이트 직후 실패 | 포함 JBR 변경, AGP·Gradle 호환성. 프로젝트 버전부터 무조건 올리지 않음 |

ADB 연결 성공과 Android 빌드 성공은 별도입니다. 휴대폰이 `device` 상태라면 빌드 오류를 해결하기 위해 USB 인증이나 기기 데이터를 초기화하지 않습니다.

## 공식 참고

확인일: 2026-11-04. 공식 호환 문서와 샘플 설정을 대조했습니다. 버전 조합은 사용자가 다른 작업 위치에서 정상 동작을 확인한 기록입니다. 이 저장소 사본에서 JDK 설치·Gradle 다운로드·APK 빌드는 수행하지 않았습니다.

- [Android Java·Gradle JDK 선택](https://developer.android.com/build/jdks)
- [AGP 릴리스·호환 정보](https://developer.android.com/build/releases)
- [Gradle Java 호환 표](https://docs.gradle.org/current/userguide/compatibility.html)
- [Gradle Wrapper 갱신](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- [Flutter Java·Gradle 문제 진단](https://docs.flutter.dev/release/breaking-changes/android-java-gradle-migration-guide): 과거 릴리스의 예시 버전을 현재 프로젝트에 그대로 적용하지 않음

스토어 제출용 산출물·서명·등록·테스트 배포·업데이트는 [Mobile-app 빌드·스토어 배포](./06-build-and-release.md)에서 이어서 확인합니다.
