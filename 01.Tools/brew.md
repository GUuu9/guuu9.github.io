<!-- version: v1.0.1 -->
# Homebrew 사용 가이드

확인일: 2026-10-28. macOS의 개발 도구·앱을 패키지로 설치하고 관리합니다. Linux에서도 사용할 수 있지만 이 저장소의 Linux 기본 설정은 apt입니다. 설치와 칩별 지원 조건은 [OS 설정 안내](../00.Setup/OS_Dev_Setting.md)를 따릅니다.

2026-10-30 확인: 최신 공식 macOS 설치 스크립트는 Apple Silicon만 허용하므로 Intel Mac에서는 해당 명령으로 신규 설치·재설치할 수 없습니다. 기존 설치의 지원 일정과 구분하며 [Intel Mac 안내](../00.Setup/macOS_Intel_Dev_Setting.md#신규-설치와-기존-환경-보존)를 따릅니다. 아래 brew 명령은 실행 가능한 기존 설치가 있다는 전제입니다. [공식 설치 스크립트](https://github.com/Homebrew/install/blob/HEAD/install.sh).

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
