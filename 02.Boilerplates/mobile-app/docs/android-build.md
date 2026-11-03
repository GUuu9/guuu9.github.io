<!-- version: v1.4.0 -->
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

### 우선 기존 JDK 확인

Android Studio에는 IDE 실행용 JBR이 포함되어 있습니다. 이 JDK가 프로젝트의 **AGP 최소 JDK 조건과 Gradle 실행 지원 범위**에 모두 맞으면 재사용합니다. Android Studio만 업데이트해도 포함 JDK가 바뀔 수 있으므로 호환된다고 가정하지 않습니다.

맞는 JDK가 없다면 macOS는 **Homebrew의 major별 OpenJDK formula**, Windows·Linux는 아래 공식 배포판 절차로 추가합니다. 기존 JDK를 먼저 삭제하지 않고 다른 프로젝트가 사용하는 경로·배포판을 확인합니다. 프로젝트가 특정 배포판·정확한 patch를 요구하면 그 조건을 우선하며 설치 관리자만 바꾸기 위해 정상 조합을 임의 교체하지 않습니다.

### macOS: Homebrew로 필요한 JDK 설치

[공식 Homebrew 설치·요구 조건](https://docs.brew.sh/Installation)에 따라 Homebrew 설치·PATH 준비를 먼저 완료한 개인 Mac의 일반 사용자 터미널에서 진행합니다. 아래는 **프로젝트가 JDK 17을 요구하는 예시**이며 작업 위치는 임의 폴더입니다. `brew install`에는 sudo를 사용하지 않습니다.

```bash
brew --version
brew --prefix
brew info openjdk@17
HOMEBREW_NO_INSTALL_UPGRADE=1 HOMEBREW_NO_INSTALL_CLEANUP=1 brew install openjdk@17
brew list --versions openjdk@17
"$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home/bin/java" -version
"$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home/bin/javac" -version
```

설치 명령의 두 환경 변수는 해당 실행에서 기존 formula의 자동 업그레이드와 자동 cleanup을 막습니다. 이미 호환 JDK가 있으면 설치를 반복하지 않고 재사용합니다. 다만 새 의존성 설치·필요한 연관 패키지 갱신까지 완전히 격리하지는 않습니다.

다른 프로젝트가 JDK 21을 요구하면 `brew info openjdk@21`로 조건을 확인한 뒤 `brew install openjdk@21`로 **추가**할 수 있습니다. 모든 major를 미리 설치하지 않습니다. `openjdk` 무버전 formula를 최신 JDK 공용 기본값으로 연결하지 않습니다.

versioned formula는 keg-only입니다. 시스템 `/Library/Java/JavaVirtualMachines`에 링크하거나 `brew link --force`하지 않고 다음 절의 JAVA_HOME으로 직접 선택합니다. 따라서 `/usr/libexec/java_home -V` 목록에 없더라도 Homebrew 설치가 실패한 것은 아닙니다. Apple Silicon·Intel 경로를 하드코딩하지 않고 `brew --prefix openjdk@17`의 실제 결과를 사용합니다.

이미 Temurin PKG·SDKMAN·다른 brew cask로 설치한 JDK가 있다면 경로·사용 프로젝트부터 확인합니다. 사용할 관리 방식 하나를 선택하고 **전환한 프로젝트가 정상 빌드되는 것을 확인한 뒤** 이전 설치가 불필요한지 판단합니다. 기존 설치 파일·개인 설정·SDK를 일괄 삭제하지 않습니다.

formula 확인일: 2026-11-03. [openjdk@17](https://formulae.brew.sh/formula/openjdk@17) · [openjdk@21](https://formulae.brew.sh/formula/openjdk@21). 현재 macOS bottle 목록에는 Intel·Ventura가 없습니다. 해당 환경에서는 소스 빌드와 전체 Xcode·의존성이 필요하거나 설치가 실패할 수 있으며 성공을 보장하지 않습니다. 프로젝트에 필요한 JDK를 brew로 구할 수 없다면 지원되는 환경을 선택하거나 공식 배포판을 별도 대안으로 검토하고, 같은 프로젝트에 두 방식을 중복 적용하지 않습니다.

### Windows: 공식 MSI 설치

Windows x64에서 공식 `.msi`의 정확한 버전·체크섬을 확인합니다. 다른 CPU는 해당 배포판 지원 여부와 설치 형식을 먼저 확인합니다. 일반 PowerShell의 임의 폴더에서 파일명을 바꿔 실행합니다.

```powershell
$JdkMsi = "$env:USERPROFILE\Downloads\실제파일명.msi"
Get-FileHash -Algorithm SHA256 -Path $JdkMsi
```

공식 값과 대조한 뒤 설치 마법사를 실행합니다. 시스템 설치에 필요한 UAC 관리자 승인이 나타날 수 있습니다.

```powershell
msiexec.exe /i "$JdkMsi"
```

설치 마법사의 **Custom Setup**에서 설치 경로와 PATH·JAVA_HOME 옵션을 검토합니다. 이 프로젝트 설치를 위해 공용 PATH·JAVA_HOME을 바꾸지 않도록 해당 옵션을 해제합니다. 설치 완료 후 새 PowerShell을 열어 `java -version`, `javac -version`, `$env:JAVA_HOME`을 확인합니다. 이전 버전이 나오면 프로젝트에 필요한 JDK를 아래 선택 기준에 맞춰 지정합니다. [공식 MSI 설치·옵션](https://adoptium.net/installation/windows).

### Linux: 사용자 폴더에 공식 아카이브 설치

공식 배포 페이지에서 Linux·CPU·libc 지원 조건에 맞는 JDK `.tar.gz`를 받습니다. 배포판에 이미 호환 JDK가 있다면 재사용하며 패키지 설치와 이 방식을 중복 적용하지 않습니다. 아래는 관리자 권한 없이 별도 JDK를 보관하는 [공식 아카이브 방식](https://adoptium.net/installation/archives)입니다. 일반 사용자 터미널의 임의 폴더에서 파일명을 바꿉니다.

```bash
JDK_ARCHIVE="$HOME/Downloads/실제파일명.tar.gz"
sha256sum "$JDK_ARCHIVE"
tar -tzf "$JDK_ARCHIVE"
```

공식 SHA-256과 대조하고 압축 내부의 최상위 폴더명을 확인합니다. 같은 JDK 폴더가 대상 위치에 이미 있으면 덮어쓰지 말고 기존 설치를 먼저 확인합니다.

```bash
mkdir -p "$HOME/.local/share/jdks"
tar -xzf "$JDK_ARCHIVE" -C "$HOME/.local/share/jdks"
export JAVA_HOME="$HOME/.local/share/jdks/실제압축해제폴더명"
export PATH="$JAVA_HOME/bin:$PATH"
java -version
javac -version
```

`JAVA_HOME`은 `bin/java`가 아니라 그 상위 JDK 루트입니다. 위 선택은 현재 셸에만 적용됩니다. 영구적인 프로젝트 선택은 `.env`에서 관리하고 셸 공용 설정 파일에는 프로젝트 값을 추가하지 않습니다. CI는 같은 아카이브·체크섬 또는 기존 CI의 JDK 설치 기능으로 동일 버전을 선택합니다.

### macOS에서 터미널·IDE·Flutter 선택 맞추기

Homebrew에서 설치한 JDK 17의 버전과 경로를 확인합니다. 다른 major를 쓴다면 formula 이름을 바꿉니다.

```bash
brew list --versions openjdk@17
brew --prefix openjdk@17
```

아래는 **JDK 17이 필요한 프로젝트의 예시**입니다. 해당 JDK를 먼저 설치해야 하며, 현재 터미널에만 적용됩니다. 모든 프로젝트에 17을 강제하지 않습니다.

```bash
export JAVA_HOME="$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
java -version
```

여러 프로젝트의 JDK 선택은 [프로젝트 환경 정의·격리](./project-environment.md)에 따라 `.env`에서 관리합니다. `~/.zshrc`·Windows 사용자 JAVA_HOME/PATH를 프로젝트마다 바꾸지 않습니다. 위 export 예시는 검사 후 종료할 별도 터미널에서만 사용하며 자동 복원은 프로젝트 환경 절차를 따릅니다.

- **직접 실행하는 Gradle CLI**: 보통 `JAVA_HOME`, 없으면 PATH의 Java를 사용합니다. 프로젝트·사용자 `gradle.properties`의 `org.gradle.java.home` 또는 Daemon JVM criteria가 있다면 그 설정도 확인합니다.
- **Android Studio의 Gradle 작업**: **Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK**에서 같은 호환 JDK를 선택합니다. Flutter 루트에서 항목이 안 보이면 `android` 프로젝트를 별도로 열어 확인합니다. IDE 자체의 실행 JDK를 바꿀 필요는 없습니다.
- **Flutter 명령과 Flutter IDE 플러그인의 빌드**: `doctor -v`의 Java 경로·버전이 기준입니다. Android Studio 포함 JDK를 선택할 수 있어 JAVA_HOME과 다를 수 있습니다. 기본 doctor 결과가 요구 JDK와 맞으면 표준 FVM 흐름을 유지합니다. 불일치할 때는 공용 사용자 설정을 덮어쓰지 말고 [선택적 Flutter 설정 분리](./project-environment.md#3-선택적-flutter-사용자-설정-분리) 또는 별도 빌드 환경을 검토합니다. IDE Run이 그 실행기를 자동 사용한다고 가정하지 않습니다.

사용자 PC의 절대 경로는 `.env` 등 Git 제외 파일에만 보관하고 공유 Gradle 설정에 넣지 않습니다. CI는 같은 JDK major·정확한 배포판 버전과 선택 절차를 프로젝트에 기록합니다.

선택 변경 후 Wrapper의 `--version`과 doctor를 다시 비교합니다. 기존 Gradle daemon이 남아 있으면 Android 폴더에서 `./gradlew --stop`(Windows는 `.\gradlew.bat --stop`)을 실행한 뒤 재확인할 수 있습니다. 같은 버전의 다른 Gradle 작업도 중단될 수 있어 실행 중인 작업을 먼저 확인합니다.

### macOS JDK 업데이트·유지·제거

`openjdk@17`과 `openjdk@21`은 다른 major를 병행 설치하지만 같은 formula의 patch를 프로젝트별로 독립 선택하는 관리자는 아닙니다. `opt` 경로는 업그레이드하면 새 keg를 가리키므로 환경 변수를 분리해도 같은 formula를 쓰는 프로젝트의 JDK가 함께 바뀔 수 있습니다. formula 이름뿐 아니라 **실제 java 버전·CPU·배포판·정상 빌드 커밋**을 프로젝트 문서에 기록합니다.

업데이트 전에 모든 참조 프로젝트·CI와 일정을 맞추고 실행 중인 IDE·빌드를 종료합니다. 복귀가 필요하면 현재 실제 경로도 기록합니다.

```bash
brew list --versions openjdk@17
(cd "$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home" && pwd -P)
brew update
brew outdated openjdk@17
HOMEBREW_NO_INSTALL_CLEANUP=1 brew upgrade openjdk@17
```

마지막 명령은 **선택한 formula와 필요한 의존성을 갱신**하며 해당 실행의 자동 cleanup을 막습니다. 보존한 구버전 keg가 실제 남아 있는지 확인하고 프로젝트별 analyze·test·Android 빌드를 수행합니다. 되돌릴 때는 기록한 기존 keg의 Contents/Home을 `.env`에서 직접 선택해 확인합니다. 과거 keg를 cleanup했다면 Homebrew가 임의의 옛 patch를 다시 설치해 준다고 보장할 수 없습니다. 정확한 patch의 장기 재현이 필수인 프로젝트는 별도 공식 아카이브·CI 환경 보존 전략을 문서화합니다.

`brew pin openjdk@17`은 공유 formula의 일반 업그레이드를 막는 보류 수단이며 해제는 `brew unpin openjdk@17`입니다. 이것도 다른 프로젝트에 영향을 주므로 개인 프로젝트만의 잠금 파일로 취급하지 않습니다. 의존성·캐시·과거 설치 파일까지 보존하는 기능은 아닙니다.

제거 전 아래 참조를 확인합니다. `brew uses`는 brew 패키지 관계만 보여 주며 프로젝트·IDE·CI의 JAVA_HOME 참조까지 찾아 주지 않습니다.

```bash
brew uses --installed openjdk@17
brew list --versions openjdk@17
```

다른 프로젝트가 더 이상 사용하지 않고 복귀도 필요 없는 경우에만 다음 명령을 사용합니다.

```bash
brew uninstall openjdk@17
brew cleanup --dry-run
```

프로젝트 `.env`·IDE Gradle JDK·Flutter 로컬 설정에서 삭제한 JDK를 가리키는 값도 수정합니다. `~/.gradle`·Android SDK·다른 JDK·서명 키는 함께 삭제하지 않습니다. 시스템 Java 링크를 별도로 만들었던 경우 실제 링크 대상을 확인하고 그 링크만 정리하며 이 가이드의 기본 설치에서는 만들지 않습니다. [Homebrew 명령·pin·cleanup](https://docs.brew.sh/Manpage).

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
