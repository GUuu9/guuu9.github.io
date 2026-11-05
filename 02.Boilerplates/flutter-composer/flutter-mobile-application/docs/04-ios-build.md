<!-- version: v3.1.1 -->
# iOS 프로젝트 빌드·버전 관리

Flutter 앱의 iOS 개발 환경을 복원하고 Xcode·네이티브 의존성·서명·기기 연결을 관리하는 가이드입니다. **iOS 로컬 빌드는 macOS와 전체 Xcode가 필요**합니다. Command Line Tools만으로는 부족하며 Windows·Linux의 Flutter 설치만으로 iOS를 빌드할 수 없습니다. 아래 명령은 표시가 없으면 개인 Mac의 Flutter 프로젝트 루트에서 일반 사용자로 실행합니다. 실제 설치는 [Flutter 공식 iOS 환경 설정](https://docs.flutter.dev/platform-integration/ios/setup), Flutter 복원은 [FVM 공식 가이드](https://fvm.app/documentation/guides/basic-commands)을 먼저 따릅니다.

이 문서는 Flutter 모바일 앱 패키지의 프로젝트 빌드 절차입니다. [프로젝트 환경 정의·격리](./02-project-environment.md)에 따라 개인 경로·도구 선택을 프로젝트에 한정합니다. 기본은 표준 FVM 호출이며 로컬 실행기는 필요한 경우에만 선택합니다. Android 환경은 [Android 빌드·버전 관리](./03-android-build.md)를 참고합니다.

## 설치 도구와 버전 기준

| 구성 | 역할 | 선택·기록 위치 |
| :--- | :--- | :--- |
| Flutter·Dart | 앱 빌드·Dart 실행 | `.fvmrc`, pubspec.yaml·pubspec.lock |
| Xcode | iOS 빌드·서명·기기 디버깅 | 앱 버전·빌드 번호·선택한 Developer 경로, CI의 Xcode 설정 |
| iOS SDK·Swift | iOS API·Swift 컴파일 | 선택한 Xcode에 포함. 독립 설치한 Swift를 Flutter iOS 빌드에 임의 주입하지 않음 |
| Deployment Target | 앱이 지원하는 최소 iOS | Runner의 Minimum Deployments/Build Settings, 의존성이 요구하면 Podfile 등도 대조 |
| Simulator runtime | 가상 기기의 iOS 실행 환경 | Xcode Settings의 Components/Platforms에서 필요한 버전만 설치 |
| CocoaPods | Pod 기반 네이티브 의존성 | 사용하는 경우 Podfile·Podfile.lock, 도구 버전은 Gemfile·Gemfile.lock |
| Swift Package Manager | Swift package 의존성 | Xcode 통합 기능, 실제 사용 프로젝트의 Package.resolved·패키지 선언 |
| 서명·Capabilities | 개발·배포 권한과 앱 식별 | Bundle Identifier·Team·entitlements, 인증서·profile은 안전한 별도 보관 |

**iOS SDK 버전과 Deployment Target은 다릅니다.** 새 SDK로 빌드하면서 더 오래된 iOS를 지원할 수 있지만 Xcode·Flutter·플러그인이 허용하는 최소 버전을 함께 확인해야 합니다. 최소 지원 버전을 올리면 기존 구형 기기 사용자가 업데이트를 받지 못할 수 있습니다. [Xcode 지원 표의 SDK·Deployment Target 구분](https://developer.apple.com/xcode/system-requirements/).

## 별도 작업 위치에서 정상 동작 확인된 환경

아래 도구 조합은 사용자가 다른 작업 위치에서 정상 동작을 확인한 값입니다. 이 보일러플레이트 사본에서 Xcode·iOS 빌드를 다시 실행한 결과는 아닙니다.

| 항목 | 확인된 값 |
| :--- | :--- |
| iOS 최소 Deployment Target | 15.0 |
| Xcode / iOS SDK | 15.2 / 17.2 |
| Ruby / CocoaPods / Bundler | 3.3.13 / 1.16.2 / 2.5.23 |

Xcode 15.2는 iOS SDK 17.2를 포함하며 macOS 13.5 이상에서 실행됩니다. [Xcode 15.2 릴리스 노트](https://developer.apple.com/documentation/xcode-release-notes/xcode-15_2-release-notes). CocoaPods를 사용하지 않는 프로젝트에는 Ruby·Bundler·CocoaPods가 필요하지 않습니다.

이 조합은 개발·기기 테스트의 확인 기록입니다. 2026-04-28부터 App Store Connect 업로드에는 Xcode 26 이상과 iOS 26 SDK 이상이 필요하므로, 이 조합으로 현재 스토어 제출을 진행할 수 없습니다. 제출 직전에는 [Apple의 SDK 최소 요구사항](https://developer.apple.com/news/upcoming-requirements/?id=04282026a)을 다시 확인합니다.

## Xcode 설치·선택·확인

[Xcode 공식 배포](https://developer.apple.com/xcode/)에서 개발 Mac과 기기 iOS를 지원하는 Xcode를 설치합니다. App Store 또는 Apple Developer의 [과거 다운로드](https://developer.apple.com/download/all/)를 사용합니다. 과거 `.xip`을 풀어 Applications로 옮길 때 기존 Xcode를 덮어쓰지 말고 이름을 구분합니다. 예를 들어 Xcode 15.2는 `/Applications/Xcode_15.2.app`으로 보관할 수 있습니다. OS·CPU·기기 조건은 [Xcode 지원 표](https://developer.apple.com/xcode/system-requirements/)에서 확인합니다.

아래는 실제 설치한 앱 경로로 바꿔 프로젝트 터미널에서 실행합니다. 첫 두 관리자 명령은 해당 Xcode의 라이선스 검토·동의와 최초 구성 요소 설치를 수행합니다. 전역 xcode-select를 바꾸지 않고 이 작업 셸에서 Xcode를 선택합니다.

```bash
export DEVELOPER_DIR="/Applications/Xcode_15.2.app/Contents/Developer"
sudo env DEVELOPER_DIR="$DEVELOPER_DIR" /usr/bin/xcodebuild -license
sudo env DEVELOPER_DIR="$DEVELOPER_DIR" /usr/bin/xcodebuild -runFirstLaunch
xcodebuild -version
xcodebuild -showsdks
xcrun --find swift
```

Xcode 15.2 확인 환경을 재현한다면 출력이 Xcode 15.2·iOS SDK 17.2인지 확인합니다. 다른 Xcode를 선택했다면 실제 버전을 기록하고 Flutter·플러그인·기기 호환성을 확인합니다. Xcode를 한 번 열고 **Settings → Platforms/Components**에서 사용할 iOS Simulator runtime을 설치합니다. 메뉴 이름은 Xcode 버전에 따라 다를 수 있습니다. 라이선스·초기화 오류가 없어야 Homebrew·Ruby 설치로 넘어갑니다. [Flutter Xcode 초기화](https://docs.flutter.dev/platform-integration/ios/setup).

실제 DEVELOPER_DIR는 Git 제외 `.env`에 기록하며 각 작업 셸에 위 export로 적용합니다. `exit`로 자식 셸을 종료하거나 이전 값을 복원합니다. Dock에서 연 IDE는 이 셸 환경을 자동 상속하지 않으므로 같은 Xcode 선택인지 확인합니다.

## CocoaPods·Swift Package Manager 복원

프로젝트가 실제 사용하는 방식을 먼저 확인합니다. Flutter 버전·플러그인에 따라 SwiftPM·CocoaPods 또는 혼합 구성이 가능하며, 최신 Flutter 가이드만 보고 기존 프로젝트를 일괄 전환하지 않습니다. FVM의 Flutter 3.35.7 고정도 네이티브 의존성 관리자와 Xcode 버전까지 고정하지는 않습니다. [Flutter SwiftPM 지원·CocoaPods fallback](https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers).

### CocoaPods를 사용하는 프로젝트

[시작 가이드의 Homebrew 설치·PATH](./01-getting-started.md#2-pc-기본-도구-준비)를 마친 Mac의 일반 사용자 zsh에서 확인합니다. 기존 rbenv가 있으면 재설치하지 않습니다.

```bash
command -v rbenv
ruby --version
```

rbenv가 없다면 설치합니다. ruby-build도 함께 준비됩니다.

```bash
brew install rbenv
rbenv init zsh
```

터미널을 새로 열어 프로젝트 폴더로 돌아오고, 현재 셸에 통합이 적용되지 않았다면 다음을 실행합니다.

```bash
eval "$(rbenv init - zsh)"
type rbenv
rbenv install -l
```

`type rbenv`가 셸 함수를 표시해야 합니다. Intel·구형 macOS에서 brew 설치가 불가능하고 rbenv가 아직 없다면 공식 Git 설치를 사용합니다. 기존 `~/.rbenv` 위에 clone하지 않습니다.

```bash
git clone https://github.com/rbenv/rbenv.git "$HOME/.rbenv"
"$HOME/.rbenv/bin/rbenv" init zsh
```

새 터미널에서 rbenv를 확인하고 ruby-build가 없다면 추가합니다.

```bash
command -v rbenv
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)/plugins/ruby-build"
rbenv install -l
```

Ruby 빌드에 필요한 라이브러리는 선택 OS·Ruby의 [ruby-build 권장 빌드 환경](https://github.com/rbenv/ruby-build/wiki#suggested-build-environment)을 확인합니다. brew를 사용할 수 있는 Mac의 기본 라이브러리는 다음처럼 준비합니다. 구형 OS에서 이 패키지들의 설치 성공까지 보장하지는 않습니다.

```bash
brew install openssl@3 readline libyaml gmp autoconf
```

프로젝트 루트에 `.ruby-version`이 이미 있으면 `rbenv install`로 그 버전을 설치합니다. 파일이 없는 이 샘플의 첫 설정에서는 전달받은 확인 버전으로 설치·선택합니다.

```bash
rbenv install 3.3.13
rbenv local 3.3.13
rbenv version
ruby --version
command -v ruby
```

Ruby 3.3.13과 rbenv shims 경로인지 확인하고 생성한 `.ruby-version`을 Git에 보관합니다. `rbenv global`로 다른 프로젝트의 기본값을 바꾸지 않습니다. 시스템 Ruby에 `sudo gem install`을 실행하지 않습니다. [rbenv 설치·프로젝트 선택](https://github.com/rbenv/rbenv) · [CocoaPods Gemfile](https://guides.cocoapods.org/using/a-gemfile.html).

### Flutter 빌드까지 같은 CocoaPods 환경 사용

샘플 루트의 [Gemfile](../Gemfile)은 전달받은 정상 동작 조합의 CocoaPods 1.16.2를 고정합니다. 프로젝트 Ruby를 선택한 뒤 같은 루트에서 처음 준비합니다.

```bash
gem install bundler -v 2.5.23
bundle _2.5.23_ install
bundle exec pod --version
```

마지막 출력은 `1.16.2`인지 확인합니다. 최초 설치로 생성된 `Gemfile.lock`은 Git에 함께 보관하고 이후에는 그 잠금 파일로 `bundle install`을 실행합니다. Gemfile만으로 Ruby·Bundler 버전이나 전이 의존성 전체가 고정되지는 않습니다. 이 샘플에는 아직 설치로 생성한 Gemfile.lock이 없습니다.

Flutter도 필요한 경우 내부에서 `pod install`을 호출합니다. 수동 Pod 복원만 Bundler로 감싸고 Flutter 빌드는 일반 호출로 바꾸면 도구 버전이 달라질 수 있습니다. **CocoaPods 사용 프로젝트의 iOS 명령은 프로젝트 루트에서 다음처럼 통일**합니다.

```bash
bundle exec fvm flutter pub get
bundle exec fvm flutter doctor -v
bundle exec fvm flutter build ios --no-codesign
```

직접 Pod를 복원해야 할 때는 Podfile이 있는 `ios`에서 `bundle exec pod install`을 실행합니다. Bundler가 상위 프로젝트 Gemfile을 찾는지 확인하며 별도 배치는 해당 프로젝트의 `BUNDLE_GEMFILE` 설정을 따릅니다. 선택적 로컬 Flutter 실행기를 쓰면 `bundle exec ./scripts/flutter …`로 실행합니다. 기기 실행·IPA 빌드에도 같은 규칙을 적용하고 IDE가 이 환경을 자동 사용하는 것으로 간주하지 않습니다.

복원은 `bundle install`·`bundle exec pod install`, 특정 Pod 업데이트는 `bundle exec pod update Pod이름`입니다. CocoaPods 도구 갱신은 Gemfile 제약 변경과 `bundle update cocoapods` 결과를 검토합니다. 잠금 파일 삭제로 전체 갱신하지 않습니다. [CocoaPods Gemfile·실행 규칙](https://guides.cocoapods.org/using/a-gemfile.html) · [Pod install과 update](https://guides.cocoapods.org/using/pod-install-vs-update.html) · [Flutter의 Pod 호출 구현](https://github.com/flutter/flutter/blob/3.35.7/packages/flutter_tools/lib/src/macos/cocoapods.dart).

### Swift Package Manager를 사용하는 프로젝트

Xcode에 포함되어 있어 별도 CLI 패키지를 설치하지 않습니다. 프로젝트가 정한 패키지 요구 범위·Package.resolved를 유지하고 Xcode의 패키지 해석 결과를 확인합니다. 초기 복원에서 **Update to Latest Package Versions**로 전체 갱신하지 않습니다. 프로젝트가 CocoaPods와 혼합되어 있다면 Podfile·Podfile.lock도 계속 관리합니다. 의존성 관리자 전환은 별도 작업으로 검증하고 기존 설정을 먼저 삭제하지 않습니다. 이 저장소 샘플처럼 해당 파일이 아직 없다면 버전 관리 목적으로 임의 생성하지 않습니다.

## Simulator·iPhone 실행과 서명

### Simulator에서 먼저 실행

Xcode에서 필요한 iOS Simulator runtime과 가상 기기를 준비한 뒤 Simulator 앱을 실행합니다. 실기기용 provisioning·Developer Mode 없이 앱 기본 동작을 확인할 수 있지만 푸시·카메라 등 실제 기능의 지원 범위는 다릅니다.

```bash
fvm flutter devices
fvm flutter run -d 기기ID
```

`기기ID`는 목록의 실제 Simulator ID로 교체합니다. Simulator와 실기기의 빌드 아키텍처·플러그인 지원이 다르므로 Simulator 성공만으로 실기기 검증을 마치지 않습니다.

### iPhone을 USB로 연결

1. 데이터 전송 케이블로 iPhone과 Mac을 직접 연결하고 잠금을 해제합니다. Mac·iPhone에서 연결·컴퓨터 신뢰를 요청하면 본인 장치인지 확인하고 승인합니다.
2. Xcode의 **Window → Devices and Simulators**에서 iPhone이 보이고 준비가 끝났는지 확인합니다. 기기 iOS와 선택 Xcode의 Device Support가 맞아야 합니다.
3. iOS 16 이상에서 개발용 실행이 필요하면 **설정 → 개인정보 보호 및 보안 → 개발자 모드**를 켜고 재시작·승인을 완료합니다. 메뉴가 없다면 Xcode 연결·페어링부터 확인합니다. [Apple Developer Mode](https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device).
4. 기본 Flutter 앱은 `ios/Runner.xcworkspace`를 Xcode에서 엽니다. CocoaPods 통합 프로젝트는 `.xcodeproj`만 열지 않습니다. 프로젝트가 다른 workspace·scheme을 지정하면 그 설정을 따릅니다.
5. Xcode 계정 설정에 개발용 Apple 계정을 추가하고 Runner target의 **Signing & Capabilities**에서 Team·고유 Bundle Identifier를 선택합니다. 자동 서명을 쓰면 **Automatically manage signing**을 확인하고 필요한 capability가 계정·profile과 맞는지 확인합니다. 기존 배포 앱의 Bundle ID·Team을 새 예시값으로 바꾸지 않습니다.
6. `fvm flutter devices`에서 iPhone의 실제 ID를 확인하고 `fvm flutter run -d 기기ID`로 실행합니다. CocoaPods 사용 프로젝트는 `bundle exec`를 앞에 붙입니다. 기기에서 개발자 앱 신뢰를 추가 요구하면 설정 안내에 따라 승인합니다.

개인 무료 계정은 제한된 기기 테스트에 사용할 수 있지만 기능·provisioning 제약이 있습니다. TestFlight·App Store 배포에는 Apple Developer Program 등 해당 배포 자격이 필요합니다. 계정 비밀번호·개인 키·인증서 export 비밀번호를 Git·셸 설정·공유 로그에 기록하지 않습니다. [Flutter iOS 기기 설정·서명](https://docs.flutter.dev/platform-integration/ios/setup).

VS Code는 FVM SDK 경로를 지정한 로컬 Flutter 창에서 **Flutter: Select Device**로 iPhone을 선택하고 F5를 사용합니다. VS Code가 Xcode의 서명·기기 준비를 대신하지는 않습니다.

이후 예시의 Flutter 명령에도 CocoaPods 사용 시 `bundle exec`를 추가합니다.

## 앱 권한·버전·배포 확인

- **권한**: 플러그인 공식 iOS 안내에 따라 Info.plist의 자원별 UsageDescription과 실제 사용 이유를 작성합니다. Capabilities·entitlements·privacy manifest가 필요한지도 확인합니다. 선언과 런타임 사용자 동의는 별도이며 허용·거부·철회·복귀를 기기에서 검사합니다. 서명 오류를 해결하려고 capability를 임의 제거하지 않습니다.
- **앱 버전**: `pubspec.yaml`의 `version: 이름+빌드번호`와 CI의 build-name/build-number 인자를 확인하고 archive 결과의 CFBundleShortVersionString·CFBundleVersion을 대조합니다. 이미 업로드한 빌드번호를 그대로 재사용하지 않습니다.
- **서명 빌드·배포**: 개발 기기 실행, archive 생성, App Store Connect 업로드·심사는 각각 별도 확인입니다. 인증서를 안전하게 준비한 환경에서 프로젝트 flavor·export 설정에 맞춰 `fvm flutter build ipa`를 사용하고 생성 archive·IPA를 확인합니다. TestFlight 설치·권한·기존 데이터 유지도 확인합니다. 이 문서 작성은 업로드 권한을 뜻하지 않습니다.

[Flutter iOS 배포](https://docs.flutter.dev/deployment/ios) · [Apple 보호 자원 접근](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources).

## 업데이트·검증·복귀와 Intel Mac 제약

1. 정상 커밋·미커밋 변경과 macOS/CPU·Flutter·Xcode 버전/빌드 번호·iOS SDK·Deployment Target·의존성 잠금 파일을 기록합니다. 서명 인증서의 개인 키와 계정 복구 수단은 별도로 안전하게 백업하고 키체인 항목을 먼저 삭제하지 않습니다.
2. macOS → 사용 가능한 Xcode → Flutter·플러그인 지원 → 기기 iOS 지원 → App Store 제출 요구를 대조합니다. 구형 macOS에서 과거 Xcode를 설치할 수 있다는 것과 현재 스토어에 제출할 수 있다는 것은 다릅니다.
3. Xcode·Flutter·Dart 패키지·CocoaPods/SwiftPM 의존성 변경을 구분합니다. 필요하면 구버전 Xcode를 보존한 채 새 버전을 별도 설치·선택합니다. 기존 잠금 파일로 복원하고 언어·최소 OS·권한·privacy 변경을 검토합니다.
4. 프로젝트 루트에서 분석·테스트 후 Simulator·서명 실기기·배포 빌드를 각각 확인합니다.

```bash
fvm flutter doctor -v
fvm flutter pub get
fvm flutter analyze
fvm flutter test
fvm flutter build ios --no-codesign
```

`--no-codesign`은 서명 없는 컴파일 확인이며 iPhone 설치·App Store 제출 성공을 뜻하지 않습니다. 테스트가 없는 프로젝트는 실제 검사 범위를 기록합니다. 실제 기기의 권한·플러그인·기존 설치본 위 업데이트·데이터 보존과 필요 시 release archive·TestFlight를 따로 검증합니다.

5. 실패하면 미커밋 작업을 보존하고 코드·pubspec/lock·Podfile/lock·Gemfile/lock·SPM 설정·Xcode 프로젝트를 변경 전 기준으로 되돌립니다. FVM·Xcode 선택도 복원합니다. 앱 데이터 형식을 바꿨다면 도구 복귀와 별도로 데이터 복구·하위 호환을 검토합니다. 이미 배포했다면 과거 IPA를 단순 덮어쓰는 대신 새 빌드번호로 수정 배포합니다. `ios/` 재생성·lockfile 삭제·인증서 폐기·DerivedData 전체 삭제를 첫 해결책으로 사용하지 않습니다.

2026-11-03 확인 시 Apple은 **2026-04-28부터 Xcode 26 이상·iOS 26 SDK 이상**으로 빌드한 앱을 업로드하도록 요구합니다. 이는 Deployment Target을 iOS 26으로 올리라는 뜻은 아닙니다. 실제 제출 직전에 [Apple의 현재·예정 요구](https://developer.apple.com/news/upcoming-requirements/)를 다시 확인합니다.

사용 중인 Intel MacBook의 Flutter 3.35.7 고정만으로 새 Xcode·스토어 요구를 충족하지는 않습니다. 해당 Mac이 요구 macOS/Xcode를 지원하지 않으면 지원되는 다른 Mac·macOS CI에서 빌드하는 경로가 필요하며, 그 환경에서도 같은 Flutter·플러그인의 새 Xcode 호환성을 검증해야 합니다. 현재 Intel Mac 전체의 최종 지원 버전을 단정하지 않습니다. [Xcode 시스템·기기 지원 표](https://developer.apple.com/xcode/system-requirements/) · [2026년 SDK 제출 요구](https://developer.apple.com/news/upcoming-requirements/?id=04282026a).

## 문제 해결 순서

| 증상 | 먼저 확인 |
| :--- | :--- |
| Xcode를 못 찾거나 라이선스 오류 | 전체 Xcode 설치, xcode-select·DEVELOPER_DIR·초기화 상태 |
| iPhone이 목록에 없음·사용 불가 | 케이블·잠금·신뢰·Developer Mode, Xcode와 기기 iOS 지원 범위 |
| 서명·provisioning 실패 | Team·Bundle ID·기기 등록·계정 자격·profile·entitlements |
| Pod 버전 충돌 | Flutter 플러그인 요구·Deployment Target·Podfile.lock·CocoaPods/Ruby 선택 |
| Swift package 해석 실패 | 선택 Xcode, 패키지 요구·Package.resolved·네트워크·인증 설정 |
| 지원 iOS 최소 버전 오류 | 앱·확장 target·의존성 요구 비교. 올릴 때 지원 기기 범위 검토 |
| Simulator만 성공 | 실기기 아키텍처·플러그인·서명·기기 OS 조건을 별도 확인 |
| 스토어 업로드 거부 | SDK/Xcode 제출 요구·앱/빌드번호·서명·privacy·capability 검증 결과 |

## 공식 참고

확인일: 2026-11-03. 공식 문서와 대조했으며 Xcode 설치·기기 연결·서명 빌드·업로드는 수행하지 않았습니다.

- [Flutter iOS 설정](https://docs.flutter.dev/platform-integration/ios/setup)
- [Flutter iOS 빌드·배포](https://docs.flutter.dev/deployment/ios)
- [Flutter Swift Package Manager](https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers)
- [CocoaPods 시작·Ruby 환경](https://guides.cocoapods.org/using/getting-started.html)
- [CocoaPods install과 update](https://guides.cocoapods.org/using/pod-install-vs-update.html)
- [Xcode 지원 조건](https://developer.apple.com/xcode/system-requirements/)

스토어 제출용 산출물·서명·등록·테스트 배포·업데이트는 [Mobile-app 빌드·스토어 배포](./06-build-and-release.md)에서 이어서 확인합니다.
