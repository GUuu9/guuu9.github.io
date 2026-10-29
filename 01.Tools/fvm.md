<!-- version: v1.1.0 -->
# FVM 사용 가이드

확인일: 2026-10-28. FVM은 프로젝트별 Flutter SDK 버전을 선택합니다. Flutter SDK에는 Dart가 포함되므로 별도 Dart 버전 관리 도구를 추가하지 않고 `fvm dart`로 프로젝트 버전을 사용합니다.

## 관리하는 것과 필요한 외부 도구

FVM은 Flutter SDK를 관리하지만 Android SDK·JDK·Xcode·CocoaPods·서명 계정을 설치해 주지는 않습니다. 실기기 환경은 [OS 설정 안내](../00.Setup/OS_Dev_Setting.md)를 먼저 진행합니다. iOS 로컬 빌드·서명에는 Mac과 Xcode가 필요합니다.

## SDK 찾기와 설치

```bash
fvm --version
fvm releases
fvm list
```

releases에서 배포 버전을, list에서 로컬 SDK를 확인합니다. 특정 버전이 필요하면 `fvm install 버전`으로 다운로드합니다. 설치만으로 해당 프로젝트의 버전이 바뀌지는 않습니다.

## 기존 프로젝트 복원

프로젝트 루트에 `.fvmrc`가 있으면:

```bash
fvm install
fvm flutter --version
fvm flutter pub get
fvm flutter doctor -v
fvm flutter devices
```

버전 기록이 없다면 README·CI·이전 개발 PC에서 실제 사용하던 Flutter 버전을 확인해 `fvm use 버전`으로 도입합니다. pubspec.yaml의 Dart 범위만으로 정확한 Flutter 버전을 결정할 수는 없습니다. 기존 프로젝트에 곧바로 최신 stable을 지정하지 않습니다.

새 프로젝트를 stable로 시작하려면 `fvm use stable`로 선택한 뒤 생성된 `.fvmrc`와 실제 버전을 확인합니다. 재현성이 필요하면 구체적인 릴리스 버전으로 고정합니다.

## Intel MacBook의 Flutter 버전 고정

사용 중인 Intel MacBook은 macOS·개발 도구 업데이트 지원 제약으로 **Flutter SDK 3.35.7**을 복원 기준으로 사용합니다(2026-10-30 사용자 환경 기준). `3.35.7`은 FVM 자체 버전이 아니라 FVM으로 관리하는 Flutter 버전입니다. 이 환경에서는 `stable`이나 최신 버전으로 자동 전환하지 않습니다.

FVM 설치 후 해당 Flutter 프로젝트 루트에서 실행합니다.

```bash
fvm install 3.35.7
fvm use 3.35.7
fvm flutter --version
fvm flutter pub get
fvm flutter doctor -v
fvm flutter analyze
fvm flutter test
```

`.fvmrc`의 선택 버전과 `fvm flutter --version`이 3.35.7인지 확인하고 Android·iOS 실기기 빌드도 확인합니다. 기존 프로젝트가 다른 SDK를 요구하면 `.fvmrc`를 곧바로 덮어쓰지 않고 Dart·패키지·Xcode 호환성을 확인한 뒤 전환합니다. VS Code도 아래 SDK 경로 설정을 사용합니다.

이 고정은 해당 MacBook의 환경 기준이며 모든 Intel Mac의 공식 최종 지원 버전을 뜻하지 않습니다. OS·Xcode 환경을 바꿔 버전을 올릴 때는 실기기 검증 후 고정을 변경합니다. [Flutter SDK 아카이브](https://docs.flutter.dev/install/archive), [FVM 버전 선택 명령](https://fvm.app/documentation/guides/basic-commands).

## Git에 보관할 파일

| 파일 | 관리 방법 |
| :--- | :--- |
| `.fvmrc` | 프로젝트 Flutter 선택 정보이므로 커밋 |
| `.fvm/` | SDK 링크·캐시이므로 gitignore |
| pubspec.yaml | 직접 의존성·SDK 조건을 커밋 |
| pubspec.lock | 앱 프로젝트의 실제 의존성 버전으로 커밋 |
| `.vscode/settings.json` | 팀 공용 SDK 경로만 검토해 공유 |

`.fvm/` 안에 소스·비밀키를 보관하지 않습니다. 기존 `.gitignore`에 규칙이 있는지 확인하고 필요한 경우 `.fvm/`을 추가합니다.

## VS Code 연동과 일상 작업

Flutter 확장을 설치하고 프로젝트 설정의 SDK 경로를 `.fvm/flutter_sdk`로 지정합니다. 기존 settings.json에 아래 키를 병합하며 다른 설정을 덮어쓰지 않습니다.

```json
{
  "dart.flutterSdkPath": ".fvm/flutter_sdk"
}
```

SDK를 전환한 뒤 IDE가 이전 버전을 사용하면 창·Dart 분석 서버를 다시 로드하고 SDK 표시를 확인합니다. 터미널은 전역 flutter 대신 아래처럼 실행합니다.

```bash
fvm flutter analyze
fvm flutter test
fvm flutter run -d 기기ID
fvm dart --version
```

Android 기기 빌드 확인은 `fvm flutter build apk`, iOS는 Mac에서 프로젝트 서명 설정 후 `fvm flutter build ios`를 사용합니다. 프로젝트 flavor·환경 인자가 있으면 README대로 추가합니다.

## 업데이트와 되돌리기

FVM 자체는 설치 경로에 맞춰 갱신합니다. 독립 설치 스크립트는 다시 실행하고 Windows 독립 패키지는 공식 새 패키지로 교체합니다. Homebrew 설치는 해당 formula를 upgrade합니다. 여러 설치 방식을 중복 적용하지 않습니다.

Flutter 변경은 현재 버전을 기록한 뒤 `fvm use 목표버전`으로 적용합니다. pub get·analyze·test·Android/iOS 실기기 실행을 확인하고 `.fvmrc`, pubspec.lock, 네이티브 프로젝트 변경을 검토합니다. 실패하면 `fvm use 이전버전`과 업데이트 전 프로젝트 파일로 돌아갑니다. SDK 캐시 내부에서 flutter upgrade를 실행해 고정 버전을 바꾸지 않습니다.

SDK 변경과 패키지 변경은 별도로 진행합니다. 패키지만 바꾸려면 `fvm flutter pub outdated`로 확인하고 `fvm flutter pub upgrade`를 실행합니다.

## 정리·진단

`fvm remove 버전`은 로컬 SDK를 제거합니다. 다른 프로젝트나 global SDK가 사용하지 않는지 확인한 뒤 실행합니다. 프로젝트 버전은 `.fvmrc`로 다시 설치할 수 있지만 다운로드 시간이 필요합니다.

SDK가 잘못 선택되면 프로젝트 루트와 `.fvmrc`, `fvm list`, `fvm flutter --version`을 차례로 확인합니다. Windows 링크 권한 문제는 개발자 모드와 공식 FVM 안내를 확인합니다. doctor의 Android·Xcode 오류는 FVM 재설치로 해결하려 하지 말고 해당 플랫폼 도구를 점검합니다.

공식 참고: [설치](https://fvm.app/documentation/getting-started/installation), [명령어](https://fvm.app/documentation/guides/basic-commands), [VS Code 연동](https://fvm.app/documentation/guides/vscode).
