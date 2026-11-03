<!-- version: v1.1.0 -->
# Mobile-app 빌드 산출물·스토어 배포

Android·iOS 앱의 로컬 검증을 마친 뒤 배포할 때 읽습니다. [시작 가이드](./getting-started.md)와 [Android](./android-build.md)·[iOS](./ios-build.md)의 호환 환경을 먼저 준비합니다. 아래 명령은 복사한 Flutter 프로젝트 루트의 일반 사용자 터미널 기준입니다. iOS는 Mac이 필요하며 CocoaPods 사용 시 iOS 명령에 `bundle exec`를 붙입니다. flavor·진입점이 있는 제품은 기존 CI의 인자를 함께 사용합니다.

현재 샘플은 스토어 제출용 완성 구성이 아닙니다. Android release가 debug 키를 사용하므로 배포 전에 교체해야 합니다. iOS 배포 계정·서명도 별도 준비가 필요합니다. 여기서는 절차만 설명하며 실제 등록·결제·업로드를 수행하지 않습니다.

## 서비스 OS 지원 범위

개발 Mac의 macOS와 **앱이 설치되는 Android/iOS**를 구분합니다. 아래 최소값은 현재 파일·고정 SDK의 설정 기준이며 서비스 동작 보장이 아닙니다. 최종 앱의 manifest·번들 메타데이터와 플러그인 요구 조건도 대조해야 합니다.

| 서비스 대상 | 현재 최소 OS 기준 | 최대 지원 OS | 실제 검증 범위·상태 |
| :--- | :--- | :--- | :--- |
| Android | Android 7.0·API 24. `minSdk = flutter.minSdkVersion`과 Flutter 3.35.7의 기본값 | 서비스 정책 미확정. 샘플에 maxSdkVersion 미선언 | APK·AAB 빌드와 실기기 미검증. 지원 확정 전 최소 OS·최신 대상으로 검증 필요 |
| iOS | iOS 13.0. Runner의 IPHONEOS_DEPLOYMENT_TARGET 및 AppFrameworkInfo.plist의 MinimumOSVersion | 서비스 정책 미확정. 배포 가능한 최신 OS와 검증한 최고 OS를 별도 기록 | Simulator·실기기·서명 archive 미검증 |

Android 값의 근거는 [Flutter 3.35.7의 FlutterExtension](https://github.com/flutter/flutter/blob/3.35.7/packages/flutter_tools/gradle/src/main/kotlin/FlutterExtension.kt)입니다. 같은 SDK의 compileSdk·targetSdk 기본값은 36이며 **최대 실행 OS가 아닙니다**. 샘플의 AGP 호환성 제약은 [Android 버전 조합](./android-build.md#호환되는-버전-조합-고르기)을 확인합니다. [Android min/target/max 구분](https://developer.android.com/guide/topics/manifest/uses-sdk-element)에 따라 검증한 최고 OS를 기록하려고 maxSdkVersion을 새로 추가하지 않습니다.

[Flutter 현재 지원 표](https://docs.flutter.dev/reference/supported-platforms)는 표시된 Flutter 버전의 정책입니다. 이를 고정된 3.35.7의 지원 범위로 그대로 옮기지 않습니다. Flutter·플러그인·Xcode를 바꾸면 최소 OS가 높아질 수 있으므로 각 릴리스에서 앱 설정·네이티브 의존성·실제 산출물을 다시 확인합니다.

개발 환경은 기존 기록상 macOS 13.7.8·Intel x86_64에서 Flutter 분석·테스트를 확인한 범위입니다. 이것은 iOS 서비스 지원 범위나 현재 App Store 제출 가능한 Xcode·SDK 조건이 아닙니다. OS를 올리지 못하면 지원되는 별도 빌드 환경이 필요한지도 검토합니다.

## 1. 앱 식별자·버전·의존성 확정

| 항목 | 프로젝트에서 관리할 기준 |
| :--- | :--- |
| Android 앱 식별자 | `android/app/build.gradle.kts`의 `applicationId`. `namespace`와 역할을 구분하며 예시 `com.example`를 제품 ID로 교체 |
| iOS 앱 식별자 | Runner target의 Bundle Identifier와 Apple에 등록한 Bundle ID·Team 일치 |
| 앱 버전 | `pubspec.yaml`의 `version: 표시버전+빌드번호`. Android versionName/versionCode, iOS 버전·빌드번호와 생성 결과 대조 |
| SDK·의존성 | `.fvmrc`·pubspec.lock·Gradle Wrapper/플러그인·Gemfile/lock·Podfile/lock 또는 SwiftPM 잠금 파일 |
| 배포 기록 | 소스 커밋·빌드 인자·OS/CPU·도구 버전·산출물 체크섬·테스트 결과·스토어 트랙 |

이미 등록한 앱의 식별자는 새 예시값으로 바꾸지 않습니다. 재업로드는 각 스토어의 버전·빌드번호 규칙을 따릅니다. 빌드 도중 의존성을 최신화하거나 잠금 파일을 삭제하지 않습니다. [Android 버전·패키징](https://docs.flutter.dev/deployment/android), [iOS 식별자·버전](https://docs.flutter.dev/deployment/ios).

## 2. Android: 서명 준비 → AAB → Google Play

### 배포 서명 준비

1. 새 앱인지 기존 앱 업데이트인지 확인합니다. 기존 키가 있으면 새로 만들기 전에 사용 이력과 인증서 지문을 대조합니다.
2. [공식 서명 절차](https://developer.android.com/studio/publish/app-signing)에 따라 업로드 키와 Play App Signing의 앱 서명 키를 구분합니다. Play가 배포하는 앱의 인증서와 로컬 업로드 인증서는 다를 수 있으므로 외부 API 인증서 등록에도 맞는 지문을 사용합니다.
3. [Flutter의 keystore 참조·Gradle 설정](https://docs.flutter.dev/deployment/android)에 따라 기존 Kotlin DSL에 release signing config를 연결합니다. 샘플의 `signingConfigs.getByName("debug")`를 그대로 제출하지 않습니다. 키 생성은 새 키가 실제 필요한 경우에만 진행합니다.
4. keystore·비밀번호·`android/key.properties`는 Git 제외와 별도 암호화 백업을 확인합니다. CI에서는 보안 저장소에서 주입합니다. ignore만으로 이미 커밋된 비밀이 제거되지는 않습니다.

### 산출물 생성·검증

분석·테스트와 release 서명 구성이 끝난 뒤 실행합니다.

```bash
fvm flutter analyze
fvm flutter test
fvm flutter build appbundle --release
```

기본 단일 앱 출력은 `build/app/outputs/bundle/release/app-release.aab`입니다. flavor·Flutter 버전에 따라 실제 로그의 경로를 확인합니다. AAB는 스토어 배포용 묶음이며 휴대폰에 그대로 설치하는 APK가 아닙니다. [공식 bundletool 검사](https://developer.android.com/tools/bundletool) 또는 Play 테스트 트랙으로 생성·설치 결과를 확인합니다. APK 직접 배포가 필요한 경우에만 별도로 생성합니다.

```bash
fvm flutter build apk --release --split-per-abi
```

APK 출력은 `build/app/outputs/flutter-apk/`에서 확인하고 기기 CPU에 맞는 파일을 선택합니다. 직접 배포도 서명·업데이트 호환 검증이 필요합니다. debug 실행 성공을 release 성공으로 보지 않습니다.

### 등록·테스트·제출

[Play Console 앱 등록 안내](https://support.google.com/googleplay/android-developer/answer/9859152)에 따라 개발자 계정·앱 레코드·패키지명을 준비합니다. 대상 API·네이티브 라이브러리 등 제출 조건은 [현재 Play 요구 사항](https://developer.android.com/google/play/requirements/target-sdk)과 Console 검증 결과를 확인하며 샘플의 SDK 값을 정책 충족으로 간주하지 않습니다.

스토어 설명·아이콘·스크린샷·개인정보처리방침·데이터 보안·콘텐츠 등급·앱 접근 정보 등 해당 항목을 실제 동작에 맞춰 작성합니다. 내부/비공개 테스트 트랙에 AAB를 업로드하고 처리·검사 결과, 설치·로그인·권한·결제(사용 시)·기존 버전 위 업데이트를 확인합니다. 계정별 테스트·프로덕션 접근 조건을 충족한 뒤 심사·출시 범위와 일정을 선택합니다. 다른 Android 스토어는 해당 스토어의 허용 형식·서명·정책을 별도 확인합니다.

## 3. iOS: 배포 설정 → archive·IPA → App Store Connect

Apple Developer Program 자격과 App Store Connect 권한을 준비하고 Bundle ID·앱 레코드를 연결합니다. Runner의 Team·배포 서명·entitlements·provisioning과 앱 아이콘·권한·privacy 정보를 점검합니다. [App Store 제출 조건](https://developer.apple.com/app-store/submitting/)의 현재 Xcode·SDK 요구를 확인합니다. 오래된 macOS에서 로컬 빌드가 되더라도 제출이 가능하다는 뜻은 아닙니다.

서명·의존성 복원과 분석·테스트 후 Mac의 프로젝트 루트에서:

```bash
fvm flutter build ipa --release
```

CocoaPods 프로젝트는 `bundle exec fvm flutter build ipa --release`를 사용합니다. 기본 archive는 `build/ios/archive/`의 `.xcarchive`, 내보낸 IPA는 `build/ios/ipa/`에서 확인합니다. `--no-codesign` 빌드는 제출용 IPA 검증을 대신하지 않습니다. [Flutter 공식 iOS 배포 안내](https://docs.flutter.dev/deployment/ios)에 따라 Xcode Organizer에서 archive를 검증·배포하거나 지원되는 업로드 도구로 IPA를 전송합니다. export 방식·ExportOptions.plist는 제품의 배포 경로에 맞게 관리하고 다른 프로젝트의 서명 설정을 복사하지 않습니다.

[Apple 업로드 절차](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/)에 따라 빌드 처리 결과를 확인한 뒤 TestFlight에서 실제 설치·업데이트·권한·데이터 보존을 검사합니다. App Store Connect에서 앱 버전에 해당 빌드를 연결하고 설명·스크린샷·개인정보·연령 등급·수출 규정·심사 접근 정보 등 필요한 항목을 완료합니다. 테스트 업로드와 App Review 제출·출시는 별도 단계입니다.

## 4. 보관·업데이트·복귀

AAB·APK·IPA·archive를 소스와 구분해 접근 제한된 릴리스 저장소에 보관합니다. Android 난독화 mapping·네이티브 심볼, iOS dSYM, Flutter 난독화를 사용했다면 대응 심볼도 해당 빌드와 함께 보존합니다. 서명 키·인증서 개인 키·비밀번호는 산출물과 별도 보안 저장소에 백업합니다. 체크섬은 개인 Mac에서 `shasum -a 256 실제파일`, Linux에서 `sha256sum 실제파일`, PowerShell에서 `Get-FileHash -Algorithm SHA256 실제파일`로 기록할 수 있습니다.

업데이트는 정상 소스·잠금 파일·도구 조합에서 새 버전/빌드번호로 생성해 테스트 트랙·TestFlight를 먼저 확인합니다. 배포 중 문제가 생기면 가능한 출시 중단 수단을 확인하고 수정 빌드를 새 번호로 제출합니다. 이미 설치된 앱을 과거 바이너리로 자동 되돌릴 수 있다고 가정하지 않습니다. 서버 API·로컬 데이터 마이그레이션의 하위 호환도 검사합니다. keystore·서명 자격·과거 archive를 빌드 캐시와 함께 삭제하지 않습니다.

확인일: 2026-11-03. 공식 문서와 샘플 설정을 대조했습니다. release 빌드·서명·스토어 등록·업로드·심사는 미검증입니다.

OS 범위 확인일: 2026-11-03. 저장소 설정과 고정 버전의 공식 근거를 대조했으며 최소·최대 OS에서 새 실행 검증은 수행하지 않았습니다.
