<!-- version: v1.1.0 -->
# Xcode·Command Line Tools 설치·선택

macOS 개인 PC에서 Git·Apple Clang·SDK를 준비합니다. 기본 개발 도구는 Command Line Tools, iOS 개발은 전체 Xcode가 필요합니다. OS·CPU·프로젝트 요구 조건에 맞는 버전을 선택하고 기존 Xcode를 먼저 지우지 않습니다. 아래 명령은 임의 폴더의 개인 터미널 기준입니다.

## 설치 전 개발 도구 준비 순서

Homebrew·nvm·FVM 설치와 Git clone 전에 확인합니다. 전체 Xcode가 모든 개발 작업에 필요한 것은 아니며 **실제로 선택한 개발 도구**가 기준입니다. 기존 `DEVELOPER_DIR`가 있으면 그 값도 확인합니다. 아래 조회는 개인 Mac의 일반 터미널에서 수행합니다.

```bash
xcode-select -p
```

| 현재 상태 | 먼저 할 일 | 다음 단계로 넘어갈 조건 |
| :--- | :--- | :--- |
| 개발 도구 없음 | 다음 절의 Command Line Tools 설치를 완료 | Git·Clang 버전 조회가 오류 없이 동작 |
| Command Line Tools 선택 | 설치 완료·실제 경로 확인. Xcode 전용 라이선스 명령은 실행하지 않음 | Git·Clang 버전 조회가 오류 없이 동작 |
| 전체 Xcode 선택 또는 선택 예정 | 해당 Xcode 설치·라이선스 동의·최초 초기화를 먼저 완료 | 같은 Xcode를 선택한 셸에서 Git·Clang 조회 성공 |

전체 Xcode를 사용하는 경우 [전체 Xcode 설치·초기화](#전체-xcode-설치초기화)를 먼저 마치고, 확인할 셸에서 `DEVELOPER_DIR`를 그 앱의 실제 `Contents/Developer` 경로로 지정합니다. 초기화 명령에만 지정한 환경 변수는 다음 명령에 남지 않습니다. 공용 xcode-select를 바꿀 필요는 없습니다. iOS 빌드 전에는 전체 Xcode 선택·초기화가 필요하지만, Command Line Tools만으로 Git이 정상 동작하는 Android·웹 개발에 전체 Xcode를 강제하지 않습니다.

위 준비를 마친 **같은 셸**에서 확인합니다.

```bash
git --version
clang --version
```

라이선스·최초 실행·잘못된 Developer 경로 오류가 남아 있으면 다음 설치·다운로드를 진행하지 않습니다. 오류를 sudo로 우회하거나 정상 Command Line Tools를 삭제하지 말고 선택 경로와 해당 Xcode 초기화를 확인합니다. Xcode를 새로 설치·업데이트한 뒤에도 이 순서를 다시 확인합니다. [Apple 개발 도구 선택·설치](https://developer.apple.com/library/archive/technotes/tn2339/_index.html) · [Flutter의 Xcode 초기화·라이선스 안내](https://docs.flutter.dev/platform-integration/ios/setup).

## Command Line Tools 설치

이미 전체 Xcode를 사용 중이면 이 설치를 반복하기 전에 위 준비 순서에서 해당 Xcode의 초기화를 확인합니다. 개발 도구가 없는 경우 설치 대화상자의 다운로드·설치가 끝날 때까지 기다립니다.

```bash
xcode-select --install
```

설치 후 확인합니다. iOS 개발용 전체 Xcode는 다음 절에서 준비합니다.

```bash
xcode-select -p
git --version
clang --version
```

기본 도구가 준비되면 [Homebrew 준비](brew.md#homebrew-설치path)에서 보조 패키지 관리 환경을 먼저 구성합니다. 주요 개발 도구는 공식 스크립트·배포판으로 설치하고 Homebrew와 중복 관리하지 않습니다.

## 전체 Xcode 설치·초기화

nvm 설치기의 Git 호출이나 Homebrew 설치가 미동의 Xcode 라이선스로 중단되지 않도록 **Homebrew·Oh My Zsh·nvm보다 먼저** 확인합니다. 전체 Xcode가 설치되어 있다면 아래 라이선스·초기화를 완료합니다. Command Line Tools만 사용하는 경우 Xcode 전용 명령은 실행하지 않고 `git --version`·`clang --version`이 오류 없이 동작하는지 확인합니다.

1. iOS 개발이 필요하면 [Apple 공식 배포처](https://developer.apple.com/xcode/)와 [Xcode 지원 표](https://developer.apple.com/xcode/system-requirements/)에서 해당 macOS·CPU가 지원하는 버전을 확인해 설치합니다. App Store의 받기/설치를 사용하거나 [과거 공식 배포판](https://developer.apple.com/download/all/)의 `.xip`을 열어 압축 해제한 앱을 `/Applications`로 옮깁니다. 과거 배포판은 Apple 계정 로그인이 필요할 수 있습니다. Command Line Tools만으로는 iOS 개발이 되지 않습니다.
2. Xcode를 한 번 열고 필수 구성요소와 iOS 플랫폼 지원을 설치합니다. Simulator 런타임은 사전 설치하지 않습니다.
3. 아래 명령으로 설치한 Xcode의 초기 설정과 라이선스를 확인합니다. 전역 Xcode 선택은 바꾸지 않습니다. 설치 경로가 다르면 실제 경로로 바꿉니다.

```bash
sudo env DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -license
sudo env DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer" xcodebuild -runFirstLaunch
```

초기 설정 전용으로 연 일반 사용자 셸에서 같은 Xcode를 선택하고 확인합니다. 경로가 다르면 실제 앱 경로로 바꿉니다. 이 선택은 현재 셸과 이후 자식 프로세스에만 적용됩니다.

```bash
export DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer"
xcodebuild -version
git --version
clang --version
```

확인이 끝나면 이 셸에서 필요한 다운로드·설치를 이어갑니다. 작업 후 셸을 종료하면 부모 환경은 유지됩니다. 기존 셸에서 값을 변경했다면 이전 값을 복원하고 원래 없었다면 `unset DEVELOPER_DIR`로 해제합니다. 이후 프로젝트에서는 `.env`의 `DEVELOPER_DIR`로 실제 Xcode를 선택합니다. 설치·초기화만으로 전역 선택이 변경되지는 않으며 GUI 앱이 셸 환경 변수를 자동 상속한다고 가정하지 않습니다.

iPhone의 컴퓨터 신뢰·Developer Mode를 준비합니다. CocoaPods·프로젝트 Signing Team·서명 계정·실기기 빌드는 [FVM 가이드](fvm.md#macos-실기기-프로젝트-연결)에서 확인합니다. 계정·인증서는 문서에 기록하지 않습니다. [Flutter iOS 설정](https://docs.flutter.dev/platform-integration/ios/setup).

## 프로젝트별 선택·업데이트·복귀

프로젝트 셸의 `DEVELOPER_DIR`로 설치한 실제 Xcode의 `Contents/Developer` 경로를 선택하고 `xcodebuild -version`·`xcodebuild -showsdks`·`xcrun swift --version`으로 확인합니다. 공용 xcode-select 변경은 다른 프로젝트에도 영향을 줍니다. GUI 앱은 셸 환경을 자동 상속하지 않을 수 있으므로 실제 선택을 별도 확인합니다.

OS·Xcode 갱신 전 정상 버전·SDK·프로젝트 커밋과 서명 자격을 보존합니다. 새 Xcode를 별도 앱 이름으로 병행 설치해 프로젝트 빌드·기기·서명을 검증한 뒤 전환하고, 실패하면 보존한 이전 앱과 프로젝트 설정으로 복귀합니다. iOS 플랫폼·Simulator runtime은 Xcode Settings의 Components/Platforms에서 필요한 버전만 설치합니다. `xcode-select --install`은 매번 업데이트하는 명령이 아닙니다.

불필요한 Xcode·runtime만 확인해 제거하고 다른 프로젝트의 SDK·서명 인증서·키체인·앱 데이터를 함께 삭제하지 않습니다. [Apple Xcode 지원 표](https://developer.apple.com/xcode/system-requirements/) · [Apple Command Line Tools](https://developer.apple.com/library/archive/technotes/tn2339/_index.html).

이번 문서 이동에서 실제 Xcode·Command Line Tools 설치·라이선스 동의·빌드·복귀는 수행하지 않았습니다.
