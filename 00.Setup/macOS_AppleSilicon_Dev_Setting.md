<!-- version: v1.1.0 -->
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

## 3. 개발 도구 설치와 프로젝트 복원

이후 [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md)을 순서대로 진행합니다.

Docker Desktop·Android Studio·Unity Editor·Flutter SDK를 직접 다운로드할 때는 **Apple Silicon용**을 선택합니다. Apple Silicon과 Intel 사이에서 `node_modules`, `.venv`, 네이티브 빌드 결과를 복사하지 않고 대상 Mac에서 다시 설치합니다.

## 4. macOS·Command Line Tools·Homebrew 업데이트

먼저 작업과 데이터를 백업하고 프로젝트가 요구하는 Xcode·SDK의 지원 조건을 확인합니다. macOS는 **시스템 설정 → 일반 → 소프트웨어 업데이트**에서 업데이트합니다. Command Line Tools 업데이트도 제공되는 항목을 확인해 설치합니다. `xcode-select --install`은 매번 업데이트하는 명령이 아닙니다. [Apple 업데이트 안내](https://support.apple.com/en-us/108382)

Homebrew 자체와 패키지 목록을 갱신하고 업데이트 대상을 확인합니다.

```bash
brew update
brew outdated
```

설치된 도구 중 필요한 것만 선택해 업데이트합니다. 예를 들어:

```bash
brew upgrade uv cmake pkgconf
brew doctor
```

전체 패키지를 한꺼번에 바꾸는 `brew upgrade`는 프로젝트 호환성을 확인할 수 있을 때 사용합니다. 업데이트 후 `brew --prefix`, `uname -m`, `clang --version`을 다시 확인합니다. Xcode를 갱신했다면 공통 문서의 Xcode 초기 설정도 확인합니다.

개별 언어·앱은 [공통 문서의 업데이트 절차](./macOS_Common_Dev_Setting.md#9-도구와-프로젝트-업데이트)를 따릅니다. [Homebrew 명령 안내](https://docs.brew.sh/Manpage)
