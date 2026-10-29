<!-- version: v1.4.0 -->
# macOS Intel 개발 환경 복원

확인일: 2026-10-28. 초기화 후 기존 프로젝트를 내려받아 개발·빌드할 수 있는 환경을 구성합니다. GitHub·SSH 인증 설정은 다루지 않습니다.

## 1. 시스템과 아키텍처 확인

```bash
sw_vers
uname -m
```

기대 아키텍처는 `x86_64`입니다. Intel Mac에서는 x86_64 배포판을 선택합니다. 현재 Homebrew에서 Intel은 Tier 3 구성입니다. macOS와 Xcode 지원 범위 때문에 최신 Flutter·iOS 도구를 설치하지 못할 수 있으므로 프로젝트가 요구하는 macOS·Xcode·SDK의 호환성을 먼저 확인합니다.

OS 업데이트는 해당 Mac에서 지원하며 프로젝트 도구와 호환되는 버전으로 진행합니다. [Homebrew 지원 조건](https://docs.brew.sh/Installation)과 [Xcode 지원 조건](https://developer.apple.com/support/xcode/)을 확인합니다.

## 2. Command Line Tools와 Homebrew

```bash
xcode-select --install
```

### Intel 지원 범위와 버전 선택

2026-10-30 재확인 기준으로 Intel Mac은 Tier 3이며, 공식 정책은 2026년 9월 이후 Intel CI와 신규 bottle(사전 빌드 패키지) 제공 중단, 2027년 9월 이후 Intel에서 Homebrew 실행 지원 중단을 예고합니다. 현재 Intel에서 설치하기 위해 특정 구버전을 지정해야 한다는 공식 안내는 없습니다. **brew 자체 버전 고정만으로 패키지 정의·의존성·bottle까지 과거 상태로 복원되지는 않습니다.** [공식 지원 일정](https://brew.sh/2025/11/12/homebrew-5.0.0/), [지원 등급](https://docs.brew.sh/Support-Tiers)

**기존 Homebrew의 실행 지원 일정과 최신 설치 스크립트의 CPU 제한은 별개입니다.** 2026-10-30 확인한 `HEAD/install.sh`는 macOS에서 `arm64`만 허용하며 Intel에서는 `Homebrew on macOS is only supported on Apple Silicon processors!` 메시지로 종료합니다. 따라서 `/bin/bash -c`로 최신 스크립트를 실행하는 방식은 Intel Mac의 신규 설치·재설치 절차로 사용하지 않습니다. [공식 설치 스크립트](https://github.com/Homebrew/install/blob/HEAD/install.sh). 지원 중단을 우회하기 위해 아키텍처 검사를 삭제하거나 임의의 과거 태그를 “마지막 Intel 지원 버전”으로 지정하지 않습니다.

기존에 검증한 구버전 환경을 반드시 보존해야 하면 `brew --version`, macOS·Command Line Tools 버전, 패키지 버전과 설치 파일을 함께 기록합니다. brew만 과거 버전으로 바꾸거나 자동 업데이트만 끄는 방법으로 재현을 보장하지 않습니다. 공식 배포판으로 설치 가능한 VS Code·uv·CMake 등은 Homebrew 없이 설치하는 경로도 검토합니다.

### 신규 설치와 기존 환경 보존

초기화한 Intel Mac에서는 Homebrew 설치를 필수 선행 단계로 두지 않습니다. 공통 문서의 `brew install`·`brew install --cask` 명령을 그대로 실행하지 말고 도구별 공식 Intel 배포판·설치 방법을 사용합니다. Node는 nvm, Flutter는 FVM으로 SDK를 선택하고 macOS·CPU 지원 범위를 별도로 확인합니다. 대체 패키지 관리자가 필요하면 Homebrew 지원 문서에서 안내하는 [MacPorts](https://www.macports.org/)의 지원 환경을 확인합니다. 여기서는 MacPorts 설치나 기존 패키지 자동 이전을 수행하지 않습니다.

이미 Homebrew가 설치되어 있다면 재설치를 위해 삭제하지 않습니다. 먼저 `command -v brew`와 `brew --version`으로 상태를 확인합니다. 아래 PATH 설정·진단은 **기존 `/usr/local/bin/brew`가 있는 경우에만** 적용합니다.

기존 Intel Homebrew의 기본 설치 경로는 `/usr/local`입니다. `~/.zprofile`에 아래 한 줄을 한 번만 추가하고 새 터미널을 엽니다.

```bash
eval "$(/usr/local/bin/brew shellenv)"
```

```bash
brew --prefix
brew doctor
git --version
clang --version
```

`brew --prefix`가 `/usr/local`인지 확인합니다. `brew doctor`의 경고는 내용을 읽고 해당 항목을 해결합니다.

## 3. 개발 도구 설치와 프로젝트 복원

이후 [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md)을 순서대로 진행합니다.

사용 중인 Intel MacBook의 업데이트 지원 제약으로 Flutter는 **3.35.7**에 고정합니다(2026-10-30 사용자 환경 기준). 공통 안내에서 FVM을 설치한 다음 [Intel MacBook 버전 고정 절차](../01.Tools/fvm.md#intel-macbook의-flutter-버전-고정)를 따라 프로젝트에서 `fvm use 3.35.7`을 적용합니다. FVM 자체 버전과 구분하며 `stable`로 자동 갱신하지 않습니다.

Docker Desktop·Android Studio·Unity Editor·Flutter SDK를 직접 다운로드할 때는 **Intel용**을 선택합니다. Apple Silicon과 Intel 사이에서 `node_modules`, `.venv`, 네이티브 빌드 결과를 복사하지 않고 대상 Mac에서 다시 설치합니다.

## 4. macOS·Command Line Tools·Homebrew 업데이트

먼저 작업과 데이터를 백업하고 프로젝트가 요구하는 Xcode·SDK의 지원 조건을 확인합니다. macOS는 **시스템 설정 → 일반 → 소프트웨어 업데이트**에서 업데이트합니다. Command Line Tools 업데이트도 제공되는 항목을 확인해 설치합니다. `xcode-select --install`은 매번 업데이트하는 명령이 아닙니다. [Apple 업데이트 안내](https://support.apple.com/en-us/108382)

먼저 위의 Intel 지원 일정을 확인합니다. 아래 `brew update`는 brew 자체도 갱신하므로 특정 구버전 환경을 보존하는 절차와 함께 실행하지 않습니다. 현재 지원 범위에서 최신 경로를 사용하는 경우에만 Homebrew 자체와 패키지 목록을 갱신하고 대상을 확인합니다.

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

Intel용 업데이트가 더 이상 제공되지 않는 도구는 마지막 호환 버전과 프로젝트 요구 버전을 확인합니다. 업데이트를 위해 Apple Silicon용 바이너리로 교체하지 않습니다.
