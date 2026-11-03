<!-- version: v6.0.0 -->
# macOS 개발 환경 설정

처음 설치하거나 Mac을 다시 설정할 때 사용합니다. **시스템 설정 → 일반 → 정보**에서 칩과 macOS 버전을 확인합니다. 설치 명령·권한·PATH는 각 Tools 문서를 따르며, 설치기가 요구할 때만 관리자 권한을 사용합니다.

## CPU별 확인 사항

| CPU | 확인 사항 |
| :--- | :--- |
| Apple Silicon | 터미널·VS Code를 `arm64`로 실행합니다. Rosetta의 `x86_64` 도구와 혼용하지 않습니다. |
| Intel | macOS·Xcode 지원 범위가 최신 도구 설치를 제한할 수 있습니다. Intel용 배포판이 현재 macOS에서 실행된다고 가정하지 않습니다. 기존 macOS 13.7.8 환경의 Homebrew 제한은 [Intel 설치 안내](../01.Tools/brew.md#과거-공식-설치-스크립트로-신규-설치-시도), Flutter 3.35.7은 [기존 Flutter 기준](../01.Tools/fvm.md#intel-macbook의-flutter-버전-고정), Docker Desktop 4.48.0은 [해당 버전의 제약](../01.Tools/docker.md#intel-ventura의-docker-desktop-4480)을 확인합니다. 이 기록은 모든 Intel Mac의 지원 상한이 아닙니다. |

## 1. 필수 설정

이 저장소의 기본 편집기는 VS Code입니다. 아래 순서로 준비하되 이미 정상 설치된 도구는 재설치하지 않습니다.

| 순서 | 준비 항목 | 설치·설정 안내 |
| :--- | :--- | :--- |
| 1 | 셸·환경 변수·기존 PATH 확인 | [macOS 셸·PATH](../01.Tools/shell-environment.md#macos-셸path-준비) |
| 2 | Git·컴파일 도구 기반 | [개발 도구 선행 확인](../01.Tools/xcode.md#설치-전-개발-도구-준비-순서) → 선택 상태에 따라 CLT 설치 또는 Xcode 라이선스·초기화 → Git·Clang 확인 |
| 3 | 보조 패키지 관리자 Homebrew | [설치·CPU별 PATH](../01.Tools/brew.md#homebrew-설치path). Intel은 과거 설치기와 지원 제한 확인 |
| 4 | VS Code | [macOS 설치](../01.Tools/editor-setup.md#macos-vs-code-설치), [한국어](../01.Tools/editor-setup.md#vs-code-표시-언어-변경) |

2단계에서 라이선스·초기화 오류가 남아 있으면 Homebrew·nvm·Git 다운로드로 넘어가지 않습니다. 전체 Xcode는 iOS 개발에 필요하며 그 외 작업은 정상 Command Line Tools로 진행할 수 있습니다.

Homebrew 준비 후 각 도구의 공식 권장 방식을 따릅니다. rbenv·ruby-build는 brew, nvm·FVM 등은 해당 공식 독립 설치 절차를 사용합니다. Intel에서 설치가 막히면 제한을 기록하고 각 도구의 공식 독립 설치 가능 여부를 확인합니다. 기존 Homebrew·데이터를 삭제해서 우회하지 않습니다.

## 2. 도구별 설정

아래 표에서 도구별 설치 순서를 확인합니다. 프로젝트별 SDK·런타임 버전은 프로젝트 설정을 기준으로 선택합니다. React·TypeScript·Electron은 프로젝트 의존성이므로 전역 설치하지 않습니다.

| 작업 | 필요한 도구와 진행 순서 |
| :--- | :--- |
| 터미널 외형·폰트 | [Oh My Zsh](../01.Tools/oh-my-zsh.md#macos-설치), [D2Coding·Terminal](../01.Tools/editor-setup.md#macos-폰트terminal) → [편집기 폰트·테마](../01.Tools/editor-setup.md#vs-code-편집기통합-터미널-폰트) |
| Node·웹·서버·Electron | [nvm 설치](../01.Tools/nvm.md#macos-nvm-설치) → 프로젝트 요구 Node·npm 선택 |
| Python | [uv 설치](../01.Tools/uv.md#1-설치상태-확인) → 프로젝트에서 Python·가상환경 선택 |
| Flutter Android | [FVM](../01.Tools/fvm.md#macoslinux-fvm-설치) → [Android Studio·SDK](../01.Tools/android-studio.md#macos-android-studio-설치) → [JDK](../01.Tools/jdk.md#os별-설치) 호환 여부 확인 |
| Flutter iOS | [FVM](../01.Tools/fvm.md#macoslinux-fvm-설치) → [전체 Xcode](../01.Tools/xcode.md#전체-xcode-설치초기화) → CocoaPods 사용 프로젝트는 Homebrew → [rbenv·Ruby·Bundler](../01.Tools/ruby.md#macos-rbenv-최초-설치) |
| C/C++ | [Clang·CMake 준비](../01.Tools/cpp-toolchain.md#macos-초기-도구-확인), 필요한 [Homebrew 패키지](../01.Tools/brew.md#3-용도별-필수-설치) |
| USB 시리얼 통신 | [minicom 설치](../01.Tools/brew.md#minicom-설치) |
| Rust | [rustup](../01.Tools/rustup.md#macoslinux-rustup-설치). 네이티브 라이브러리는 프로젝트 요구에 따라 추가 |
| Unity | [Hub 설치·프로젝트 Editor 선택](../01.Tools/unity.md#macos-unity-hub-설치). iOS 대상은 전체 Xcode 추가 |
| 컨테이너 | [Docker Desktop](../01.Tools/docker.md#macos-docker-desktop-설치). Intel·Ventura는 해당 문서의 구버전 제한 확인 |
| Codex·Ponytail | [Codex 설치·인증](../01.Tools/codex.md#macoslinux-codex-cli-설치) → [nvm·Node](../01.Tools/nvm.md#macos-nvm-설치) → [Ponytail 추가](../01.Tools/codex.md#ponytail-스킬-추가) |

## 완료 확인

- [ ] 각 Tools 문서의 설치 순서와 플랫폼 요구 조건을 확인했다.
- [ ] 새 터미널·IDE에서 각 Tools 문서의 버전·실행 경로·확인 결과를 대조했다.
- [ ] 기존 설치와 중복되지 않고 셸·PATH·개인 설정이 보존된다.

도구 인식 확인은 프로젝트 빌드·실행·배포 성공과 별개입니다.

## 프로젝트 시작·업데이트

새 프로젝트는 [보일러플레이트 유형별 시작 가이드](../02.Boilerplates/README.md#처음-실행하는-순서)로 이동합니다. 기존 프로젝트는 README·CI·버전 파일·잠금 파일로 요구 환경을 복원하며 초기 설정을 이유로 SDK·의존성을 일괄 갱신하지 않습니다. 각 도구의 일상 사용·업데이트·복귀·삭제는 연결한 Tools 문서에서 관리합니다. 프로젝트 환경 변수·자격증명·데이터는 별도 보존하고 다른 OS의 node_modules·.venv·네이티브 빌드 결과를 복사하지 않습니다.

macOS 자체 갱신은 [OS 업데이트·보존](../01.Tools/shell-environment.md#os-업데이트와-보존)을 확인합니다.
