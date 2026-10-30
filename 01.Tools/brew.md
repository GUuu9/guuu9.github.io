<!-- version: v1.1.0 -->
# Homebrew 사용 가이드

확인일: 2026-10-28. macOS의 개발 도구·앱을 패키지로 설치하고 관리합니다. Linux에서도 사용할 수 있지만 이 저장소의 Linux 기본 설정은 apt입니다. 설치와 칩별 지원 조건은 [OS 설정 안내](../00.Setup/OS_Dev_Setting.md)를 따릅니다.

macOS 초기 설치는 공식 설치 스크립트·배포판을 기본으로 하며 Homebrew는 기존 설치나 선택한 패키지를 관리할 때만 사용합니다. Intel의 과거 설치기 절차는 이 문서 하단에 보존합니다. 설치 경로를 전환하더라도 기존 Homebrew·캐시·프로젝트를 일괄 삭제하지 않습니다.

## 용도와 관리 범위

`formula`는 uv·CMake 같은 도구의 설치 정의, `cask`는 VS Code 같은 앱의 설치 정의입니다. `tap`은 추가 패키지 저장소, `bottle`은 사전 빌드 패키지입니다. Homebrew는 Node·Python의 프로젝트별 버전 선택을 대신하지 않습니다. 그 용도로는 nvm·uv를 사용합니다.

## 검색하고 설치하기

```bash
brew search cmake
brew info cmake
brew install cmake
brew install --cask visual-studio-code
brew list --versions
brew list --cask
```

검색 후 `info`에서 설명·홈페이지·지원 조건을 확인합니다. 앱을 이미 직접 설치했다면 중복 설치 전에 기존 관리 방식을 확인합니다. 외부 tap은 출처가 필요한 경우에만 추가합니다.

```text
brew tap 소유자/저장소
brew install 소유자/저장소/패키지
brew untap 소유자/저장소
```

## 설치 위치와 PATH 확인

```bash
brew --prefix
brew config
brew doctor
```

macOS 기본 경로는 Apple Silicon `/opt/homebrew`, Intel `/usr/local`입니다. 명령이 안 보이면 설치 결과의 shellenv 안내와 셸 설정을 확인합니다. `which -a brew`로 여러 설치가 잡히는지 확인하고 Rosetta·네이티브 환경을 혼용하지 않습니다.

## 업데이트와 버전 관리

```bash
brew update
brew outdated
brew upgrade cmake
cmake --version
```

`update`는 brew 자체·패키지 메타데이터를, `upgrade`는 설치된 패키지를 갱신합니다. 도구 업데이트 후 사용하는 프로젝트의 빌드를 확인합니다. 앱은 `brew upgrade --cask 앱이름` 또는 앱의 자체 업데이트 경로를 사용합니다.

`brew pin cmake`는 해당 formula가 일반 upgrade에서 갱신되지 않게 하고 `brew unpin cmake`는 해제합니다. pin은 cask나 모든 의존성까지 동결하지 않으며 과거 설치 파일을 보관하지도 않습니다. `cmake@버전`처럼 버전 formula가 실제 제공되는지는 `brew search`로 확인합니다. 임의 버전을 `brew install 패키지@버전`으로 항상 설치할 수 있는 것은 아닙니다.

Intel은 지원 축소 일정이 있으므로 `brew update` 전 [Intel 안내](../00.Setup/macOS_Intel_Dev_Setting.md)를 확인합니다. brew만 구버전으로 고정해 과거 패키지 전체를 복원할 수는 없습니다.

## 제거·용량 정리

```text
brew uninstall 패키지
brew uninstall --cask 앱이름
brew cleanup --dry-run
```

정리 대상과 기존 버전이 더 이상 필요 없는지 확인한 뒤 `brew cleanup`을 실행합니다. `brew autoremove --dry-run`으로 불필요해진 의존성을 미리 확인할 수 있습니다. 앱 제거가 모든 사용자 데이터까지 지운다는 뜻은 아닙니다. `--zap`은 사용자 설정까지 삭제할 수 있으므로 일반 제거에 일괄 추가하지 않습니다.

## 설치 목록 기록과 복원

```bash
brew bundle dump --file=Brewfile
brew bundle check --file=Brewfile
```

생성한 Brewfile을 검토하고 새 환경에서 `brew bundle --file=Brewfile`로 설치합니다. Brewfile은 목록 관리용이며 정확한 과거 버전의 재현을 보장하는 잠금 파일이 아닙니다. 프로젝트의 Node·Python·Flutter 버전은 별도 파일로 관리합니다.

## 자주 겪는 문제

| 상황 | 확인 순서 |
| :--- | :--- |
| command not found | 새 터미널 → shellenv·PATH → brew 실제 설치 위치 |
| 링크 충돌 | `brew info`, 충돌 경로 소유 도구 확인. 강제 overwrite부터 하지 않음 |
| 설치 실패 | `brew doctor`, OS·CLT 지원 조건, 패키지 로그 확인 |
| Intel 소스 빌드가 오래 걸림 | 해당 OS·CPU bottle 유무와 패키지 지원 조건 확인 |
| 업데이트 후 프로젝트 실패 | 도구·의존성 변경을 확인하고 기록한 버전·배포 경로로 복구 가능성 확인 |

공식 참고: [명령 매뉴얼](https://docs.brew.sh/Manpage), [설치·지원 조건](https://docs.brew.sh/Installation).

## Intel 지원 범위와 버전 선택

2026-10-30 재확인 기준으로 Intel Mac은 Tier 3이며, 공식 정책은 2026년 9월 이후 Intel CI와 신규 bottle(사전 빌드 패키지) 제공 중단, 2027년 9월 이후 Intel에서 Homebrew 실행 지원 중단을 예고합니다. 현재 Intel에서 설치하기 위해 특정 구버전을 지정해야 한다는 공식 안내는 없습니다. **brew 자체 버전 고정만으로 패키지 정의·의존성·bottle까지 과거 상태로 복원되지는 않습니다.** [공식 지원 일정](https://brew.sh/2025/11/12/homebrew-5.0.0/), [지원 등급](https://docs.brew.sh/Support-Tiers)

**기존 Homebrew의 실행 지원 일정과 최신 설치 스크립트의 CPU 제한은 별개입니다.** 2026-10-30 확인한 `HEAD/install.sh`는 macOS에서 `arm64`만 허용하며 Intel에서는 `Homebrew on macOS is only supported on Apple Silicon processors!` 메시지로 종료합니다. 따라서 `/bin/bash -c`로 최신 스크립트를 실행하는 방식은 Intel Mac의 신규 설치·재설치 절차로 사용하지 않습니다. [공식 설치 스크립트](https://github.com/Homebrew/install/blob/HEAD/install.sh). 지원 중단을 우회하기 위해 아키텍처 검사를 삭제하거나 임의의 과거 태그를 “마지막 Intel 지원 버전”으로 지정하지 않습니다.

기존에 검증한 구버전 환경을 반드시 보존해야 하면 `brew --version`, macOS·Command Line Tools 버전, 패키지 버전과 설치 파일을 함께 기록합니다. brew만 과거 버전으로 바꾸거나 자동 업데이트만 끄는 방법으로 재현을 보장하지 않습니다. 공식 배포판으로 설치 가능한 VS Code·uv·CMake 등은 Homebrew 없이 설치하는 경로도 검토합니다.

## 신규 설치와 기존 환경 보존

초기화한 Intel Mac에서는 Homebrew 설치를 필수 선행 단계로 두지 않습니다. 도구별 설치에서 Homebrew를 기본 경로로 선택하지 말고 도구별 공식 Intel 배포판·설치 방법을 사용합니다. Node는 nvm, Flutter는 FVM으로 SDK를 선택하고 macOS·CPU 지원 범위를 별도로 확인합니다. 대체 패키지 관리자가 필요하면 Homebrew 지원 문서에서 안내하는 [MacPorts](https://www.macports.org/)의 지원 환경을 확인합니다. 여기서는 MacPorts 설치나 기존 패키지 자동 이전을 수행하지 않습니다.

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

## 과거 공식 설치 스크립트로 신규 설치 시도

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
