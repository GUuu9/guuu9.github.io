<!-- version: v1.1.0 -->
# Android Studio·SDK 설치·관리

Android 개발에 필요한 IDE와 SDK 도구를 개인 PC에 준비합니다. Flutter를 사용하지 않는 Android 프로젝트에도 적용됩니다. 일반 사용자로 설치하되 설치기가 요구할 때만 관리자 권한을 사용합니다. 기존 IDE·SDK 경로와 프로젝트 요구 버전을 먼저 확인합니다. ARM·구형 OS의 지원은 공식 설치 페이지에서 별도 확인합니다.

## macOS Android Studio 설치

1. [Android Studio](https://developer.android.com/studio)를 칩에 맞게 설치하고 처음 실행합니다.
2. SDK Manager에서 Android SDK Command-line Tools와 Platform-Tools를 준비하고 SDK 설치 경로를 확인합니다. 프로젝트별 SDK Platform·Build-Tools·NDK·CMake 버전은 복원 단계에서 결정합니다.
3. Device Manager에서 사용할 AVD·시스템 이미지를 추가합니다.
4. 실기기는 개발자 옵션·USB 디버깅을 켜고 연결 허용 창을 승인합니다.

[JDK 선택·유지 관리](jdk.md)에 따라 Android Studio 포함 JDK를 기본으로 두되 프로젝트 Gradle·Android Gradle Plugin의 요구 버전은 복원 때 확인합니다. [Flutter Android 설정](https://docs.flutter.dev/platform-integration/android/setup).

## Windows Android Studio 설치

[Android Studio 공식 Windows 설치 안내](https://developer.android.com/studio/install#windows)에 따라 x64 설치 프로그램을 실행합니다. SDK Manager에서 Command-line Tools·Platform-Tools와 프로젝트가 지정한 SDK Platform·Build-Tools·NDK·CMake를 설치하고 SDK 경로를 기록합니다. Device Manager에서 AVD·시스템 이미지를 추가합니다.

JDK는 Android Studio 포함 버전을 우선하되 프로젝트 Gradle·AGP 요구 조건을 확인합니다. [공통 폰트 안내](editor-setup.md#android-studio-편집기콘솔터미널-폰트)를 적용합니다. Android 실기기는 개발자 옵션·USB 디버깅·연결 허용과 [제조사 공식 USB 드라이버](https://developer.android.com/studio/run/oem-usb)를 준비합니다. Windows SDK·adb·JDK와 WSL의 도구를 혼용하지 않습니다.

## Linux Android Studio 설치

[Android Studio 공식 설치 안내](https://developer.android.com/studio/install#linux)에 따라 배포판·CPU 조건을 확인하고 설치합니다. SDK Manager에서 Command-line Tools·Platform-Tools와 프로젝트가 지정한 SDK Platform·Build-Tools·NDK·CMake를 설치하고 SDK 경로를 기록합니다. Device Manager에서 AVD·시스템 이미지를 추가합니다.

JDK는 Android Studio 포함 버전을 우선하되 프로젝트 Gradle·AGP 요구 조건을 확인합니다. [공통 폰트 안내](editor-setup.md#android-studio-편집기콘솔터미널-폰트)를 적용합니다. Android 실기기는 개발자 옵션·USB 디버깅·연결 허용을 준비하고 [공식 실기기 안내](https://developer.android.com/studio/run/device#setting-up)의 Linux 사용자 권한·udev 규칙을 따릅니다. adb를 상시 root로 실행해 우회하지 않습니다.

Flutter·Dart 플러그인 설치와 Android Studio에서 프로젝트를 생성하는 절차는 [FVM 가이드](./fvm.md#android-studio에서-새-flutter-프로젝트-생성)를 따릅니다.

## SDK 선택·확인과 업데이트·복귀

SDK Manager의 Android SDK Location을 기록하고 Command-line Tools·Platform-Tools를 확인합니다. [SDK·adb·JDK 경로 선택](./fvm.md#android-프로젝트-연결환경-변수)은 Flutter 개발 시 참고하며 다른 프로젝트는 해당 README·Gradle 설정을 우선합니다. NDK·CMake는 Android SDK Manager가 설치하는 버전을 요구할 수 있어 Homebrew CMake로 대체하지 않습니다. 에뮬레이터는 사용할 때만 추가합니다.

Android Studio 자체는 앱 업데이트 기능·공식 배포판으로 갱신합니다. SDK·NDK·Build-Tools는 요구 버전을 병행 설치하고 호환성 확인 전 구버전을 삭제하지 않습니다. IDE 포함 JDK가 바뀌면 [JDK 선택](./jdk.md)과 실제 빌드 JVM을 비교합니다. 실패하면 기록한 IDE·SDK·JDK와 프로젝트 설정으로 복귀합니다. [공식 IDE·SDK 업데이트](https://developer.android.com/studio/intro/update).

제거는 IDE·SDK·AVD·공유 Gradle 캐시를 구분합니다. 프로젝트·adb 키·debug keystore·서명 자료를 보존하고 [도구 제거·잔여 파일](./uninstall-cleanup.md)을 따릅니다.
