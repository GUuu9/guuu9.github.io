<!-- version: v4.0.2 -->
# Linux 개발 환경 설정 (Ubuntu / Debian)

지원 중인 Ubuntu LTS 또는 Debian의 x86_64 데스크톱·bash 기준의 최초 설정·재설정 순서입니다. 설치 명령·권한·PATH·업데이트·복귀는 아래 Tools 링크에서 확인합니다. ARM·다른 배포판은 별도 지원 확인이 필요합니다. WSL에서는 Windows VS Code·Docker Desktop 통합을 사용하며 Linux GUI 앱을 중복 설치하지 않습니다. iOS 로컬 빌드는 Mac·Xcode가 필요합니다.

## 1. 필수 설정

개인 PC의 일반 사용자 터미널에서 시작하고 설치기가 요구하거나 Tools에 명시된 작업만 관리자 권한으로 수행합니다. 기존 도구·설정은 먼저 확인합니다.

| 순서 | 준비 항목 | 설치·설정 안내 |
| :--- | :--- | :--- |
| 1 | OS·기본 다운로드·압축 도구·Git | [Linux 기본 패키지](../01.Tools/shell-environment.md#linux-기본-패키지-설치) |
| 2 | 셸·PATH 확인 | [Linux 셸·PATH](../01.Tools/shell-environment.md#linux-셸path-준비) |
| 3 | VS Code·한국어 | [Linux 설치](../01.Tools/editor-setup.md#linux-vs-code-설치) → [표시 언어](../01.Tools/editor-setup.md#vs-code-표시-언어-변경) |

## 2. 도구별 설정

아래 표에서 도구별 설치 순서를 확인합니다. SDK·런타임 버전은 프로젝트 설정을 기준으로 선택합니다.

| 작업 | 필요한 도구와 진행 순서 |
| :--- | :--- |
| 터미널 외형·폰트 | [zsh·Oh My Zsh](../01.Tools/oh-my-zsh.md#linux-설치), [D2Coding](../01.Tools/editor-setup.md#linux-폰트터미널) → [편집기 설정](../01.Tools/editor-setup.md#vs-code-편집기통합-터미널-폰트) |
| Node·웹·서버·Electron | [nvm](../01.Tools/nvm.md#linux-nvm-설치) → 요구 Node·npm |
| Python | [uv](../01.Tools/uv.md#1-설치상태-확인) → 프로젝트 Python·가상환경 |
| Flutter Android | [FVM](../01.Tools/fvm.md#macoslinux-fvm-설치) → [Android Studio·SDK·udev](../01.Tools/android-studio.md#linux-android-studio-설치) → [JDK](../01.Tools/jdk.md#linux-jdk-설치) 호환 여부 확인 |
| C/C++·네이티브 모듈 | [빌드 도구·CMake](../01.Tools/cpp-toolchain.md#linux-cmake-설치) |
| Rust | [필요한 네이티브 빌드 도구](../01.Tools/cpp-toolchain.md#linux-cmake-설치) → [rustup](../01.Tools/rustup.md#macoslinux-rustup-설치) |
| Unity | [Unity Hub](../01.Tools/unity.md#linux-unity-hub-설치) → 프로젝트 Editor·모듈 |
| 컨테이너 | [Docker Desktop](../01.Tools/docker.md#linux-docker-desktop-설치). GUI 없는 서버는 해당 문서의 Engine 경로 |
| Codex·Ponytail | [Codex 설치·인증](../01.Tools/codex.md#macoslinux-codex-cli-설치) → [nvm·Node](../01.Tools/nvm.md#linux-nvm-설치) → [Ponytail](../01.Tools/codex.md#ponytail-스킬-추가) |

정확한 SDK·NDK·Editor·런타임 버전은 프로젝트 기준을 따릅니다. React·TypeScript·Electron은 전역 설치하지 않습니다.

## 완료 확인

- [ ] 각 Tools 문서의 설치 순서와 플랫폼 요구 조건을 확인했다.
- [ ] 새 터미널·IDE에서 각 Tools 문서의 버전·실행 경로·확인 결과를 대조했다.
- [ ] 기존 설치와 중복되지 않고 셸·PATH·개인 설정이 보존된다.

도구 인식 확인은 프로젝트 빌드·실행·배포 성공과 별개입니다.

## 프로젝트 시작·업데이트

새 프로젝트는 [보일러플레이트 유형별 시작 가이드](../02.Boilerplates/README.md#처음-실행하는-순서)로 이동합니다. 기존 프로젝트는 README·CI·버전 파일·잠금 파일로 요구 환경을 복원하며 초기 설정을 이유로 SDK·의존성을 일괄 갱신하지 않습니다. 각 도구의 일상 사용·업데이트·복귀·삭제는 연결한 Tools 문서에서 관리합니다. 프로젝트 환경 변수·자격증명·데이터는 별도 보존하고 다른 OS의 node_modules·.venv·네이티브 빌드 결과를 복사하지 않습니다.

OS 자체 갱신은 [OS 업데이트·보존](../01.Tools/shell-environment.md#os-업데이트와-보존)을 확인합니다.
