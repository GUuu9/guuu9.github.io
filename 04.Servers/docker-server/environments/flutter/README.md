<!-- version: v2.0.0 -->
# 서버 Flutter·Android 빌드 작업 영역

이 문서는 **서버 관리자가 만든 SSH 컨테이너에 접속한 developer 사용자**가 실행하는 언어 설정입니다. 개인 PC의 로컬 Docker·Reopen in Container 절차가 아닙니다. 서버 생성·포트·키·볼륨은 [공통 구성](../../guides/docker_container_setup.md)을 따릅니다.


## 범위

이 서버 컨테이너는 Linux 빌드·테스트용입니다. 개인 PC의 USB 기기가 서버에 자동 전달되지 않습니다. privileged와 adb 5037 외부 공개를 기본 구성에 넣지 않습니다. iOS 빌드는 Mac이 필요합니다.

## FVM

```bash
curl -fsSL https://fvm.app/install.sh | bash
```

설치 안내의 PATH를 적용하고 fvm --version으로 확인합니다. 기존 .fvmrc 프로젝트 루트에서:

```bash
fvm install
fvm flutter pub get
fvm flutter analyze
fvm flutter test
fvm flutter doctor -v
```

.fvmrc가 없으면 기존 Flutter 버전을 확인해 fvm use 버전으로 기록합니다. [FVM 가이드](../../../../01.Tools/fvm.md)

## Android 도구

관리자는 프로젝트 Gradle·AGP가 요구하는 JDK·Android Command-line Tools와 필요한 시스템 라이브러리를 이미지에 추가합니다. SDK는 사용자 홈 등 쓰기 가능한 위치로 정하고 ANDROID_HOME과 platform-tools·cmdline-tools PATH를 실제 위치에 맞춥니다. 라이선스는 사용자가 내용을 확인해 동의합니다. 플랫폼·Build Tools·NDK 버전은 프로젝트 기준이며 Android 33으로 일괄 고정하지 않습니다.

설치 후 fvm flutter doctor --android-licenses와 fvm flutter doctor -v로 검사하고 프로젝트별 빌드 옵션으로 fvm flutter build apk를 검증합니다. 사전 에뮬레이터·시스템 이미지는 설치하지 않습니다.

## 실기기

개인 PC 실기기 실행은 로컬 Flutter·Android Studio를 우선합니다. 원격 연결이 필요하면 인증된 네트워크·ADB 서버 연결 대상·터널·기기 승인을 따로 설계해야 합니다. -p 5037:5037은 호스트 adb를 컨테이너로 연결하는 설정이 아닙니다. [ADB 공식 구조](https://developer.android.com/tools/adb)
