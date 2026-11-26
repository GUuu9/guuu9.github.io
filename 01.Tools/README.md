# 개발 도구 사용 가이드

OS별 설치 순서는 [00.Setup](../00.Setup/OS_Dev_Setting.md)에서 해당 환경 문서를 선택합니다. 여기서는 도구를 역할별로 찾아 OS별 상세 설치·권한·환경 변수·확인·일상 사용·업데이트·복귀·제거를 확인합니다.

Intel Mac은 설치 파일에서 `Intel`, `x86_64` 또는 Intel을 포함한 `Universal`을 선택합니다. Apple Silicon 전용 `arm64` 설치 파일은 사용하지 않습니다. Homebrew는 최신 설치 스크립트가 Intel을 지원하지 않으므로 [Intel 지원 범위와 설치 절차](./brew.md#intel-지원-범위와-버전-선택)를 따릅니다.

## 공통 환경·패키지 관리

| 도구 | 관리 대상 | 읽을 때 |
| :--- | :--- | :--- |
| [기본 패키지·셸·PATH](./shell-environment.md) | OS별 공통 준비·환경 변수 | 설치 전 확인·설정 백업·OS 갱신 |
| [Homebrew](./brew.md) | macOS 보조 패키지·앱 | 패키지 설치·업데이트·Intel 제약 |
| [Oh My Zsh·Oh My Posh](./oh-my-zsh.md) | macOS·Linux zsh 설정과 Windows PowerShell 프롬프트 테마 | 셸 설정·테마·업데이트·복귀 |

## 편집기·플랫폼 개발 도구

| 도구 | 관리 대상 | 읽을 때 |
| :--- | :--- | :--- |
| [편집기 설정](./editor-setup.md) | VS Code 표시 언어·D2Coding·Android Studio 폰트 | OS별 앱 설정 |
| [Xcode·Command Line Tools](./xcode.md) | Apple 개발 도구·SDK | macOS 기본 도구·iOS용 Xcode 설치·선택 |
| [Android Studio·SDK](./android-studio.md) | Android IDE·SDK·기기 도구 | 설치·SDK Manager·OS별 드라이버/권한 |
| [Unity Hub·Editor](./unity.md) | Unity Editor·플랫폼 모듈 | 설치·프로젝트 버전 선택·업데이트·복귀 |

## 언어 런타임·SDK

| 도구 | 관리 대상 | 읽을 때 |
| :--- | :--- | :--- |
| [nvm](./nvm.md) | Node.js 런타임 | TS·React·Electron·서버의 Node 버전 전환 |
| [uv·가상환경](./uv.md) | Python 버전·가상환경·의존성·기존 venv | Python 프로젝트 환경 설정·관리 |
| [FVM](./fvm.md) | Flutter SDK | 프로젝트마다 Flutter 버전 고정 |
| [rustup](./rustup.md) | Rust 툴체인·타깃·컴포넌트 | 프로젝트 버전 고정·전환·업데이트 |
| [Ruby·Bundler·CocoaPods](./ruby.md) | Ruby 버전과 프로젝트별 gem 도구 | Ruby·네이티브 의존성 도구 관리 |
| [JDK](./jdk.md) | Java·Gradle 실행 환경 | 프로젝트별 JDK 선택·병행 유지·업데이트·제거 |

## 빌드·컨테이너 도구

| 도구 | 관리 대상 | 읽을 때 |
| :--- | :--- | :--- |
| [C/C++ 툴체인](./cpp-toolchain.md) | GCC·Clang·MSVC·SDK·CMake | OS별 컴파일러 선택·빌드 환경 재현 |
| [Docker·Compose](./docker.md) | 컨테이너·이미지·볼륨·서비스 | 터미널 접속·실행·업데이트·데이터 보존 |

## 협업·에이전트·문서 관리

| 도구 | 관리 대상 | 읽을 때 |
| :--- | :--- | :--- |
| [Git·GitHub](./github.md) | 소스 기록·공유·리뷰 | 브랜치 작업·PR·태그·복구 |
| [Codex CLI](./codex.md) | Codex 명령줄 앱 | 설치·인증·업데이트·복귀 |
| [Agent Skills·Plugins](./agent-skills/README.md) | 전역 스킬·에이전트별 플러그인 | Ponytail·Archify와 다른 에이전트의 설치·업데이트·제거 |
| [Markdown 디자인·작성](./markdown-style.md) | 표·강조 상자·접기·도식 | 문서 작성·가독성 정리 |
| [도구 제거·잔여 파일 정리](./uninstall-cleanup.md) | 실행 파일·숨김 설정·캐시·데이터 | 잘못 설치한 기능 제거·백업·복원 |

도구 설치 방식은 OS 설정 문서의 순서를 따릅니다. macOS는 도구별 공식 권장 경로를 우선하며, rbenv·ruby-build와 별도 JDK는 Homebrew로 관리합니다. nvm·FVM은 각 공식 설치 방식을 사용합니다. 이미 정상 동작하는 도구를 다른 방식으로 중복 설치하지 않습니다.

nvm·FVM·uv는 런타임이나 SDK를 선택하고, npm·pip 등은 프로젝트 패키지를 관리합니다. 기존 프로젝트는 저장소의 버전 파일과 잠금 파일을 우선합니다.
