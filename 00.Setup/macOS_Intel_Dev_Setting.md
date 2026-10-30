<!-- version: v2.0.1 -->
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

### 과거 공식 설치 스크립트로 신규 설치 시도

2026-10-30 확인: 공식 `Homebrew/install`의 커밋 `f4aa1b1ca5b256954dbde0315455fb259cdfc45a`에는 macOS `x86_64` 허용과 `/usr/local` 설치 분기가 남아 있습니다. 최신 설치기가 Intel을 거부할 때 사용할 수 있는 **과거 설치기 후보**이며, 공식 지원 복원이나 모든 Intel Mac에서의 설치 성공을 뜻하지 않습니다. “마지막 Intel 지원 Homebrew 버전”으로 확인한 것도 아닙니다. [고정된 스크립트](https://github.com/Homebrew/install/blob/f4aa1b1ca5b256954dbde0315455fb259cdfc45a/install.sh), [Intel 설치기 지원 제거 변경](https://github.com/Homebrew/install/commit/e078684c4a86a34bc1239e1a0ddcb86d7b9c787b).

이 스크립트는 Homebrew 저장소의 **실행 시점 최신 stable 태그**를 받아 설치하고 `brew update`도 실행합니다. 설치 스크립트만 과거 커밋으로 고정하는 절차이며 Homebrew 본체·formula·bottle을 과거 버전으로 고정하지 않습니다. 향후 본체가 Intel 실행을 중단하면 이 방법으로 해결되지 않습니다.

실행 위치는 Intel Mac의 개인 터미널입니다. `uname -m`이 `x86_64`인지, Command Line Tools가 있는지 확인합니다. 기존 brew가 있으면 재설치하지 말고 먼저 기존 환경을 점검합니다. 설치를 선택하면 스크립트가 `/usr/local`을 변경하고 관리자 암호를 요청할 수 있습니다. 전체 터미널이나 스크립트를 `sudo`로 실행하지 않습니다.

```bash
uname -m
xcode-select -p
command -v brew
```

`command -v brew`가 경로 없이 끝나면 설치가 없는 상태일 수 있습니다. `/usr/local/bin/brew` 존재와 PATH 누락 여부도 확인합니다. 신규 설치가 필요한 경우 다음처럼 임시 디렉터리에 다운로드하고, 실행 전에 내용을 읽습니다.

```bash
brew_install_dir="$(mktemp -d)"
curl -fL 'https://raw.githubusercontent.com/Homebrew/install/f4aa1b1ca5b256954dbde0315455fb259cdfc45a/install.sh' -o "$brew_install_dir/install.sh"
/bin/bash -n "$brew_install_dir/install.sh"
shasum -a 256 "$brew_install_dir/install.sh"
less "$brew_install_dir/install.sh"
```

확인한 SHA-256은 `12479a24be3f5307eecac7cde670fad7118640f031229e964f544b1367b52a41`입니다. 값이 다르거나 다운로드·문법 검사에 실패하면 실행하지 않습니다. 이 해시는 확인한 파일과의 일치 검사이며 별도의 서명 검증은 아닙니다. `less`는 `q`로 종료합니다. 내용을 확인하고 설치를 진행하기로 했다면 같은 터미널에서 실행합니다.

```bash
/bin/bash "$brew_install_dir/install.sh"
```

설치기가 출력한 Next steps를 우선합니다. 성공한 경우 `~/.zprofile` 또는 사용하는 `~/.zshrc` 중 한 곳에 다음을 한 번만 추가하고 새 터미널에서 확인합니다. 두 파일에 중복 추가하지 않습니다.

```bash
eval "$(/usr/local/bin/brew shellenv)"
```

```bash
brew --version
brew --prefix
brew config
brew doctor
```

prefix가 `/usr/local`인지 확인하고 macOS·CLT·Homebrew 버전을 복원 기록에 남깁니다. 설치 도중 실패하면 오류를 확인하고 중단하며 `/usr/local` 전체 삭제·일괄 소유권 변경으로 해결하지 않습니다. 설치 성공 후에도 각 패키지의 Intel·macOS 지원과 소스 빌드 가능 여부는 별도입니다. 기존 환경을 지우고 재설치하는 복귀 절차로 사용하지 않습니다.

검증 범위: 공식 저장소의 변경 이력·고정 스크립트의 Intel 분기·최신 stable 선택·update 호출을 읽고 다운로드 파일의 `bash -n` 및 SHA-256을 확인했습니다. 이 문서 작업에서는 설치기를 실행하거나 `/usr/local`을 변경하지 않았으며 초기화한 Intel Mac에서의 설치 완료·패키지 설치는 미검증입니다.

## 3. 공통 도구 초기 설치

이후 [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md)을 순서대로 진행합니다.

사용 중인 Intel MacBook의 업데이트 지원 제약으로 Flutter는 **3.35.7**에 고정합니다(2026-10-30 사용자 환경 기준). 공통 안내에서 FVM을 설치한 다음 [Intel MacBook 버전 고정 절차](../01.Tools/fvm.md#intel-macbook의-flutter-버전-고정)를 따라 프로젝트 복원 단계에서 `fvm use 3.35.7`을 적용합니다. FVM 자체 버전과 구분하며 `stable`로 자동 갱신하지 않습니다.

Docker Desktop·Android Studio·Unity Editor·Flutter SDK를 직접 다운로드할 때는 **Intel용**을 선택합니다. Apple Silicon과 Intel 사이에서 `node_modules`, `.venv`, 네이티브 빌드 결과를 복사하지 않고 대상 Mac에서 다시 설치합니다.

설치 후 프로젝트 작업은 [공통 문서의 도구별 안내](./macOS_Common_Dev_Setting.md#프로젝트-작업-안내), OS·앱 갱신은 [업데이트 안내](./macOS_Common_Dev_Setting.md#macos와-설치된-앱-업데이트)를 참고합니다.
