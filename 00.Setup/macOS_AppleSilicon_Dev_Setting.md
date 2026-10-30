<!-- version: v2.1.1 -->
# macOS Apple Silicon 개발 환경 복원

확인일: 2026-10-28. 초기화 후 기존 프로젝트를 내려받아 개발·빌드할 수 있는 환경을 구성합니다. GitHub·SSH 인증 설정은 다루지 않습니다.

## 1. 시스템과 아키텍처 확인

```bash
sw_vers
uname -m
```

기대 아키텍처는 `arm64`입니다. 터미널과 VS Code는 Apple Silicon 네이티브로 실행합니다. Rosetta 터미널에서 설치한 x86_64 도구와 혼용하지 않습니다. 오래된 Intel 전용 프로젝트가 필요할 때만 Rosetta 환경을 별도로 구성합니다.

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

다음 공통 설치의 [Homebrew 준비](./macOS_Common_Dev_Setting.md#homebrew-준비)에서 보조 패키지 관리 환경을 먼저 구성합니다. 주요 개발 도구는 공식 스크립트·배포판으로 설치하고 Homebrew와 중복 관리하지 않습니다.

## 3. 공통 도구 초기 설치

이후 [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md)을 순서대로 진행합니다.

Docker Desktop·Android Studio·Unity Editor·Flutter SDK를 직접 다운로드할 때는 **Apple Silicon용**을 선택합니다. Apple Silicon과 Intel 사이에서 `node_modules`, `.venv`, 네이티브 빌드 결과를 복사하지 않고 대상 Mac에서 다시 설치합니다.

설치 후 프로젝트 작업은 [공통 문서의 도구별 안내](./macOS_Common_Dev_Setting.md#프로젝트-작업-안내), OS·앱 갱신은 [업데이트 안내](./macOS_Common_Dev_Setting.md#macos와-설치된-앱-업데이트)를 참고합니다.
