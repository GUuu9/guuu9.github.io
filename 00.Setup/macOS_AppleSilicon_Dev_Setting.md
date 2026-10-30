<!-- version: v2.0.0 -->
# macOS Apple Silicon 개발 환경 복원

확인일: 2026-10-28. 초기화 후 기존 프로젝트를 내려받아 개발·빌드할 수 있는 환경을 구성합니다. GitHub·SSH 인증 설정은 다루지 않습니다.

## 1. 시스템과 아키텍처 확인

```bash
sw_vers
uname -m
```

기대 아키텍처는 `arm64`입니다. 터미널과 VS Code는 Apple Silicon 네이티브로 실행합니다. Rosetta 터미널에서 설치한 x86_64 도구와 혼용하지 않습니다. 오래된 Intel 전용 프로젝트가 필요할 때만 Rosetta 환경을 별도로 구성합니다.

OS 업데이트는 해당 Mac에서 지원하며 프로젝트 도구와 호환되는 버전으로 진행합니다. [Homebrew 지원 조건](https://docs.brew.sh/Installation)과 [Xcode 지원 조건](https://developer.apple.com/support/xcode/)을 확인합니다.

## 2. Command Line Tools와 Homebrew

```bash
xcode-select --install
```

설치가 끝난 뒤 [Homebrew 공식 설치 안내](https://brew.sh/)의 스크립트를 실행합니다.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 결과의 Next steps를 우선합니다. 기본 설치 경로는 `/opt/homebrew`입니다. `~/.zprofile`에 아래 한 줄을 한 번만 추가하고 새 터미널을 엽니다.

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```

```bash
brew --prefix
brew doctor
git --version
clang --version
```

`brew --prefix`가 `/opt/homebrew`인지 확인합니다. `brew doctor`의 경고는 내용을 읽고 해당 항목을 해결합니다.

## 3. 공통 도구 초기 설치

이후 [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md)을 순서대로 진행합니다.

Docker Desktop·Android Studio·Unity Editor·Flutter SDK를 직접 다운로드할 때는 **Apple Silicon용**을 선택합니다. Apple Silicon과 Intel 사이에서 `node_modules`, `.venv`, 네이티브 빌드 결과를 복사하지 않고 대상 Mac에서 다시 설치합니다.

## 설치 다음 단계

칩별 기본 설정 뒤에는 [공통 도구 초기 설치](./macOS_Common_Dev_Setting.md)까지만 진행합니다. 프로젝트를 내려받은 뒤 [프로젝트 복원](./macos-project-restore.md), 설치된 환경을 변경할 때 [업데이트](./macos-update.md)를 선택합니다. OS·Command Line Tools·Homebrew 업데이트 명령도 업데이트 문서로 분리했습니다.
