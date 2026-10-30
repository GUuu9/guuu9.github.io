<!-- version: v2.1.0 -->
# macOS Intel 개발 환경 복원

확인일: 2026-10-28. 초기화 후 기존 프로젝트를 내려받아 개발·빌드할 수 있는 환경을 구성합니다. GitHub·SSH 인증 설정은 다루지 않습니다.

## 1. 시스템과 아키텍처 확인

```bash
sw_vers
uname -m
```

기대 아키텍처는 `x86_64`입니다. Intel Mac에서는 x86_64 배포판을 선택합니다. macOS와 Xcode 지원 범위 때문에 최신 Flutter·iOS 도구를 설치하지 못할 수 있으므로 프로젝트가 요구하는 macOS·Xcode·SDK의 호환성을 먼저 확인합니다.

OS 업데이트는 해당 Mac에서 지원하며 프로젝트 도구와 호환되는 버전으로 진행합니다. [Xcode 지원 조건](https://developer.apple.com/support/xcode/)을 확인합니다.

## 2. Command Line Tools

```bash
xcode-select --install
```

설치 후 확인합니다. iOS 개발용 전체 Xcode는 공통 설치 가이드에서 준비합니다.

```bash
xcode-select -p
git --version
clang --version
```

Homebrew는 초기 설치에 필요하지 않습니다. 도구는 공식 스크립트·배포판으로 설치합니다. 기존 Homebrew를 유지하거나 과거 Intel 설치기가 필요한 경우에만 [선택용 Homebrew 가이드](../01.Tools/brew.md)를 참고합니다.

## 3. 공통 도구 초기 설치

이후 [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md)을 순서대로 진행합니다.

사용 중인 Intel MacBook의 업데이트 지원 제약으로 Flutter는 **3.35.7**에 고정합니다(2026-10-30 사용자 환경 기준). 공통 안내에서 FVM을 설치한 다음 [Intel MacBook 버전 고정 절차](../01.Tools/fvm.md#intel-macbook의-flutter-버전-고정)를 따라 프로젝트 복원 단계에서 `fvm use 3.35.7`을 적용합니다. FVM 자체 버전과 구분하며 `stable`로 자동 갱신하지 않습니다.

Docker Desktop·Android Studio·Unity Editor·Flutter SDK를 직접 다운로드할 때는 **Intel용**을 선택합니다. Apple Silicon과 Intel 사이에서 `node_modules`, `.venv`, 네이티브 빌드 결과를 복사하지 않고 대상 Mac에서 다시 설치합니다.

설치 후 프로젝트 작업은 [공통 문서의 도구별 안내](./macOS_Common_Dev_Setting.md#프로젝트-작업-안내), OS·앱 갱신은 [업데이트 안내](./macOS_Common_Dev_Setting.md#macos와-설치된-앱-업데이트)를 참고합니다.
