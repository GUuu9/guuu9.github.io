<!-- version: v1.1.0 -->
# 프로젝트 환경 정의·복원·격리

필요한 도구 버전·설치·환경 변수·복원 절차는 프로젝트 안에 보관합니다. **기본 실행은 FVM과 프로젝트 버전 파일을 사용**하며 direnv·사용자 설정 분리는 필요한 경우에만 추가합니다. 현재 샘플에 임의의 JDK·Ruby·Xcode 버전을 추가하거나 PC 전역 기본값을 변경하는 절차가 아닙니다.

## 프로젝트에 보관할 파일

| 구분 | Git에 보관 | 개인 로컬 파일·상태 |
| :--- | :--- | :--- |
| 환경 설명 | README·docs/environment.md, OS/CPU·실제 버전·설치/확인/복귀 명령 | 비밀값을 제거한 검증 기록 |
| 도구 버전 | `.fvmrc`, Gradle Wrapper·플러그인 선언, 필요 시 `.ruby-version` | 설치된 JDK·SDK·Xcode의 개인 경로 |
| 의존성 | pubspec/lock, 실제 사용하는 Gemfile/lock·Podfile/lock·SPM 설정 | 다운로드 캐시·빌드 산출물 |
| 환경 변수 | **`.env.example`**의 변수 이름·용도·비밀값 없는 예시 | **`.env`**의 실제 값. Git 제외 |
| 선택적 자동 전환 | `.envrc`의 로딩 절차 | `.direnv/`·`.local/`·`.bundle/`. Git 제외 |

`.env.example`을 `.env`로 복사하되 기존 `.env`를 덮어쓰지 않습니다. 필요 없는 변수는 만들지 않으며 주석뿐인 기본 샘플은 `.env` 없이 실행할 수 있습니다. `.env`는 `KEY=value` 데이터이며 셸 명령·`export`·`$(...)`를 넣지 않습니다. 파일이 존재하는 것만으로 Flutter·앱이 자동 로딩하지 않으므로 로딩 방법도 기록합니다. 키·토큰·인증서는 예시 파일에 넣지 않습니다.

## 1. 필요한 요소를 확인하고 설치

먼저 [시작 가이드](./getting-started.md)에서 유형 받기·프로젝트 내보내기·FVM 복원을 수행합니다. [Android](./android-build.md#jdk-설치선택) 또는 [iOS](./ios-build.md) 중 필요한 플랫폼만 준비하고 실제 버전·설치 경로 선택 방법을 docs/environment.md에 기록합니다. 폴더 진입 시 설치·업데이트·삭제하지 않습니다.

macOS의 JDK는 필요한 major의 brew formula를 설치하고 `brew --prefix openjdk@17`로 실제 위치를 확인합니다. `.env`에는 그 결과를 바탕으로 완성한 절대 경로를 적습니다. 같은 formula의 patch 갱신은 다른 프로젝트에도 적용될 수 있으므로 Android 가이드의 유지·복귀 기준을 따릅니다.

Ruby가 필요한 프로젝트는 `.ruby-version`을 사용합니다. `rbenv shell`·`rbenv global`로 프로젝트를 전환하지 않습니다. 이전에 설정한 `RBENV_VERSION`이 있으면 버전 파일보다 우선하므로 원인을 확인하고 작업 자식 셸 안에서 해제합니다. CocoaPods는 Gemfile·Gemfile.lock과 `bundle exec`로 선택하고 Flutter의 iOS 빌드도 같은 Bundler 환경에서 실행합니다.

## 2. 기본 환경과 선택적 폴더별 로딩

### 기본: 작업 셸에만 적용

macOS·Linux는 평소 터미널에서 `bash --noprofile --norc`로 자식 셸을 열고 설치된 실제 경로로 환경을 적용합니다. 아래는 macOS Android 예시이며 iOS만 개발한다면 JDK·Android 변수는 생략하고 `DEVELOPER_DIR`만 선택합니다.

```bash
export JAVA_HOME="$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
fvm flutter doctor -v
```

Windows는 프로젝트 루트의 PowerShell에서 `powershell.exe -NoProfile -NoExit`로 자식 셸을 연 뒤 실제 JDK 경로를 지정합니다. 필요한 값은 개인 `.env`와 일치시킵니다. Linux도 해당 설치 경로로 바꿉니다.

```powershell
$env:JAVA_HOME = "C:\실제JDK폴더"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
fvm flutter doctor -v
```

같은 자식 셸에서 시작 가이드의 복원·실행 명령을 수행하고 종료할 때 `exit`합니다. 부모 셸·다른 프로젝트의 환경 변수는 바뀌지 않습니다. **doctor가 표시하는 Java·SDK가 실제 요구에 맞는지 확인**합니다. Flutter는 사용자 설정·Android Studio JDK를 우선할 수 있어 JAVA_HOME만으로 선택이 보장되지는 않습니다. 불일치하면 공용 설정을 덮어쓰지 말고 아래 선택적 분리 또는 별도 개발 사용자·지원되는 빌드 환경을 사용합니다.

### 선택: direnv로 진입·이탈 시 자동 전환

환경 변수를 자주 전환하는 macOS·Linux 셸에서만 추가합니다. 공식 설치기를 일반 사용자 터미널에서 한 번 실행하고 설치기가 안내한 실행 파일 경로를 확인합니다.

```bash
curl -fsSL https://direnv.net/install.sh | bash
```

zsh는 `~/.zshrc`에 `eval "$(direnv hook zsh)"` 한 줄만 추가하고 새 터미널에서 `direnv version`을 확인합니다. 기존 Oh My Zsh direnv hook과 중복하지 않습니다. bash는 공식 hook 안내를 따릅니다. 프로젝트별 값은 셸 공용 설정에 넣지 않습니다.

`.env.example`의 플랫폼별 경로 항목을 필요한 것만 `.env`에 채웁니다. `.envrc`는 다음과 같이 로딩하며 경로가 없는 플랫폼은 건너뜁니다.

```bash
dotenv_if_exists .env
unset RBENV_VERSION BUNDLE_GEMFILE
if [[ -n "${JAVA_HOME:-}" ]]; then
  test -x "$JAVA_HOME/bin/java" || return 1
  PATH_add "$JAVA_HOME/bin"
fi
if [[ -n "${ANDROID_HOME:-}" ]]; then
  test -x "$ANDROID_HOME/platform-tools/adb" || return 1
  PATH_add "$ANDROID_HOME/platform-tools"
fi
```

두 unset은 프로젝트 안에서만 기존 강제 선택을 해제해 Ruby·Bundler가 프로젝트 버전 파일을 읽게 합니다. direnv는 프로젝트 밖에서 이전 환경을 복원합니다. 신뢰할 수 있는 `.envrc`와 `.env`를 검토한 뒤 `direnv allow .`를 실행합니다. `.env`·`.direnv/`·`.local/`·`.bundle/`는 Git에서 제외합니다. [설치](https://direnv.net/docs/installation.html) · [셸 hook](https://direnv.net/docs/hook.html) · [dotenv·PATH_add](https://direnv.net/man/direnv-stdlib.1.html).

## 3. 선택적 Flutter 사용자 설정 분리

기본 FVM·IDE 경로로 호환 JDK를 이미 사용한다면 이 절은 필요하지 않습니다. **macOS·Linux의 Flutter 3.35.7에서 프로젝트별 Flutter 설정을 따로 유지해야 할 때만** 아래 실행기를 도입합니다. 다른 Flutter 버전·네이티브 Windows에 이 구현을 일반화하지 않습니다.

이 버전은 XDG_CONFIG_HOME을 지원하지만 `~/.flutter_settings`가 있으면 그 파일이 우선합니다. 아래 실행기는 해당 경우 중단합니다. 기존 사용자 설정을 삭제·덮어쓰거나 HOME을 바꾸지 않고 별도 개발 사용자·CI 등 분리 환경을 선택합니다. [Flutter 설정 경로 구현](https://github.com/flutter/flutter/blob/3.35.7/packages/flutter_tools/lib/src/base/config.dart).

프로젝트의 `scripts/flutter`에 저장하고 `chmod +x scripts/flutter`로 실행 가능하게 합니다.

```bash
#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"
if [[ -e "$HOME/.flutter_settings" ]]; then
  printf '%s\n' '기존 Flutter 사용자 설정이 우선하므로 격리 실행을 중단합니다.' >&2
  exit 1
fi
export XDG_CONFIG_HOME="$project_root/.local/flutter-config"
mkdir -p "$XDG_CONFIG_HOME"
exec fvm flutter "$@"
```

환경을 적용한 프로젝트 루트에서 `./scripts/flutter config --jdk-dir "$JAVA_HOME"`를 한 번 실행하고 doctor·빌드도 같은 실행기를 사용합니다. 필요한 Android SDK 지정도 같은 실행기의 `config --android-sdk`로 수행합니다. `.local/flutter-config/settings`에만 기록되는지 확인합니다. CocoaPods 사용 시 `bundle exec ./scripts/flutter …`로 감쌉니다. 실행기를 쓰는 빌드와 일반 FVM 호출을 섞지 않습니다.

## 4. IDE·CI·외부 영향 확인

기본 IDE 실행은 프로젝트 `.fvm/flutter_sdk`와 호환 Gradle JDK·Xcode를 선택하고 IDE의 doctor 결과를 터미널과 비교한 뒤 사용합니다. [VS Code 기본 실행](https://docs.flutter.dev/tools/vs-code) · [FVM Android Studio 연결](https://fvm.app/documentation/guides/android-studio).

선택적 실행기·Bundler 환경은 IDE Run에 자동 적용되지 않습니다. 해당 구성을 선택한 프로젝트는 우선 같은 환경의 IDE 통합 터미널에서 명시 명령으로 실행합니다. IDE Run까지 도입하려면 그 Run/task가 같은 환경·명령을 사용하는지 검증해 docs/environment.md에 남깁니다. 네이티브 Windows에서는 이 실행기를 만들라는 선행 조건 없이 기본 FVM 절차를 사용하고, 공유 사용자 설정과 요구 JDK가 충돌하면 분리 빌드 환경이 필요하다고 명시합니다.

CI는 프로젝트 버전·잠금 파일로 설치하고 필요한 비밀값은 CI 비밀 저장소에서 주입합니다. direnv hook·개인 경로를 전제하지 않습니다. 공유 SDK·캐시·daemon·키체인·기기까지 프로젝트 폴더만으로 격리되지는 않습니다. 삭제 전 다른 프로젝트 참조와 복귀 가능성을 확인하며 프로젝트 삭제에 공유 도구·서명 자료를 포함하지 않습니다.

## 검증·기록

기본 흐름은 실제 doctor·Wrapper JVM·Xcode·분석·테스트·플랫폼 빌드를 구분해 확인합니다. 자동 전환을 도입했다면 진입·하위 폴더·이탈·다른 프로젝트에서 환경 복원을 검사합니다. 선택적 실행기는 임시 경로·가짜 FVM으로 인자·공백 경로·기존 사용자 설정에서 중단·부모 환경 불변을 자체 검사합니다. 비밀값 전체를 출력하는 env 덤프는 남기지 않습니다.

확인일: 2026-11-03. 공식 문서·Flutter 3.35.7 구현과 예시 실행기를 확인했습니다. SDK 설치·IDE·실기기·플랫폼 빌드·네이티브 Windows 동작은 실제 검증과 구분합니다.
