<!-- version: v1.1.0 -->
# JDK 설치 확인·버전 선택·유지 관리

Java·Gradle 등 JDK가 필요한 프로젝트에서 사용합니다. 모든 PC에 추가 JDK가 필요한 것은 아닙니다. 기존 프로젝트의 요구 버전·배포판과 실제 실행 JDK를 먼저 확인합니다. Android Studio 포함 JBR이 요구 조건에 맞으면 재사용합니다. Gradle 실행 JDK와 Java 소스 언어 수준은 별도입니다. [Android JDK 안내](https://developer.android.com/build/jdks) · [Gradle Java 호환 표](https://docs.gradle.org/current/userguide/compatibility.html).

## Windows JDK 설치

Windows x64에서 공식 `.msi`의 정확한 버전·체크섬을 확인합니다. 다른 CPU는 해당 배포판 지원 여부와 설치 형식을 먼저 확인합니다. 일반 PowerShell의 임의 폴더에서 파일명을 바꿔 실행합니다.

```powershell
$JdkMsi = "$env:USERPROFILE\Downloads\실제파일명.msi"
Get-FileHash -Algorithm SHA256 -Path $JdkMsi
```

공식 값과 대조한 뒤 설치 마법사를 실행합니다. 시스템 설치에 필요한 UAC 관리자 승인이 나타날 수 있습니다.

```powershell
msiexec.exe /i "$JdkMsi"
```

설치 마법사의 **Custom Setup**에서 설치 경로와 PATH·JAVA_HOME 옵션을 검토합니다. 이 프로젝트 설치를 위해 공용 PATH·JAVA_HOME을 바꾸지 않도록 해당 옵션을 해제합니다. 설치 완료 후 새 PowerShell을 열어 `java -version`, `javac -version`, `$env:JAVA_HOME`을 확인합니다. 이전 버전이 나오면 프로젝트에 필요한 JDK를 [JDK 선택 기준](#터미널ide의-jdk-선택-확인)에 맞춰 지정합니다. [공식 MSI 설치·옵션](https://adoptium.net/installation/windows).

설치 후 [JDK 선택·유지 관리](jdk.md)에서 프로젝트별 선택과 업데이트·제거 기준을 확인합니다.

## Linux JDK 설치

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

설치 후 [JDK 선택·유지 관리](jdk.md)에서 프로젝트별 선택과 업데이트·제거 기준을 확인합니다.

## OS별 설치

- macOS: Homebrew를 준비한 뒤 [JDK formula 설치](./brew.md#프로젝트용-jdk-설치)를 따릅니다.
- Windows: [공식 MSI 설치](#windows-jdk-설치)를 따릅니다.
- Linux: [공식 아카이브 설치](#linux-jdk-설치)를 따릅니다.

정상 설치를 관리 방식만 바꾸기 위해 교체하지 않습니다. 새 JDK를 병행 설치하고 사용하는 프로젝트를 검증한 뒤 불필요한 이전 설치만 정리합니다.

## 터미널·IDE의 JDK 선택 확인

아래 셸 예시는 macOS Homebrew 설치 기준입니다. Windows·Linux도 프로젝트의 JAVA_HOME이 설치한 JDK 루트를 가리키도록 선택한 뒤 `java -version`·`javac -version`과 실제 빌드 JVM을 비교합니다.

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

여러 프로젝트의 JDK 선택은 프로젝트의 환경 정의에 따라 `.env`에서 관리합니다. `~/.zshrc`·Windows 사용자 JAVA_HOME/PATH를 프로젝트마다 바꾸지 않습니다. 위 export 예시는 검사 후 종료할 별도 터미널에서만 사용하며 자동 복원은 프로젝트 환경 절차를 따릅니다.

- **직접 실행하는 Gradle CLI**: 보통 `JAVA_HOME`, 없으면 PATH의 Java를 사용합니다. 프로젝트·사용자 `gradle.properties`의 `org.gradle.java.home` 또는 Daemon JVM criteria가 있다면 그 설정도 확인합니다.
- **Android Studio의 Gradle 작업**: **Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK**에서 같은 호환 JDK를 선택합니다. Flutter 루트에서 항목이 안 보이면 `android` 프로젝트를 별도로 열어 확인합니다. IDE 자체의 실행 JDK를 바꿀 필요는 없습니다.
- **Flutter 명령과 Flutter IDE 플러그인의 빌드**: `doctor -v`의 Java 경로·버전이 기준입니다. Android Studio 포함 JDK를 선택할 수 있어 JAVA_HOME과 다를 수 있습니다. 기본 doctor 결과가 요구 JDK와 맞으면 표준 FVM 흐름을 유지합니다. 불일치할 때는 공용 사용자 설정을 덮어쓰지 말고 프로젝트별 Flutter 설정 분리 또는 별도 빌드 환경을 검토합니다. IDE Run이 그 실행기를 자동 사용한다고 가정하지 않습니다.

사용자 PC의 절대 경로는 `.env` 등 Git 제외 파일에만 보관하고 공유 Gradle 설정에 넣지 않습니다. CI는 같은 JDK major·정확한 배포판 버전과 선택 절차를 프로젝트에 기록합니다.

선택 변경 후 Wrapper의 `--version`과 doctor를 다시 비교합니다. 기존 Gradle daemon이 남아 있으면 Android 폴더에서 `./gradlew --stop`(Windows는 `.\gradlew.bat --stop`)을 실행한 뒤 재확인할 수 있습니다. 같은 버전의 다른 Gradle 작업도 중단될 수 있어 실행 중인 작업을 먼저 확인합니다.

## Windows·Linux의 업데이트·복귀·제거

새 버전 설치 전에 설치 경로·배포판·정확한 버전·CPU·체크섬과 참조 프로젝트를 기록합니다. Windows MSI는 같은 설치를 갱신할 수 있으므로 독립 버전 병행이 필요하면 [공식 아카이브](https://adoptium.net/installation/archives)를 별도 경로에 보존하는 방식을 검토합니다. Linux 사용자 아카이브도 버전별 폴더를 덮어쓰지 않습니다. 새 환경을 선택해 프로젝트를 검증하고 실패하면 보존한 기존 JDK와 프로젝트 설정으로 복귀합니다.

Windows MSI 제거는 설정의 설치된 앱에서 정확한 배포판·버전을 확인해 진행합니다. 사용자 폴더 아카이브는 더 이상 참조하지 않는 해당 버전 폴더만 선택 정리합니다. 공용 PATH·JAVA_HOME이나 IDE 참조도 확인하며 다른 JDK·Gradle 캐시·프로젝트·서명 자료를 함께 지우지 않습니다.

## macOS JDK 업데이트·유지·제거

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

