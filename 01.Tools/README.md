# 개발 도구 사용 가이드

OS별 도구 설치 순서는 [00.Setup](../00.Setup/OS_Dev_Setting.md)을 참고합니다. 이 폴더는 각 도구의 OS별 설치·권한·환경 변수·확인·일상 사용·업데이트·복귀와 제거를 다룹니다.

| 도구 | 관리 대상 | 읽을 때 |
| :--- | :--- | :--- |
| [Markdown 디자인·작성](./markdown-style.md) | 표·강조 상자·접기·도식 | 문서 작성·가독성 정리 |
| [도구 제거·잔여 파일 정리](./uninstall-cleanup.md) | 실행 파일·숨김 설정·캐시·데이터 | 잘못 설치한 기능 제거·백업·복원 |
| [기본 패키지·셸·PATH](./shell-environment.md) | OS별 공통 준비·환경 변수 | 설치 전 확인·설정 백업·OS 갱신 |
| [Xcode·Command Line Tools](./xcode.md) | Apple 개발 도구·SDK | macOS 기본 도구·iOS용 Xcode 설치·선택 |
| [Android Studio·SDK](./android-studio.md) | Android IDE·SDK·기기 도구 | 설치·SDK Manager·OS별 드라이버/권한 |
| [Unity Hub·Editor](./unity.md) | Unity Editor·플랫폼 모듈 | 설치·프로젝트 버전 선택·업데이트·복귀 |
| [편집기 설정](./editor-setup.md) | VS Code 표시 언어·D2Coding·Android Studio 폰트 | OS별 설치 후 공통 앱 설정 |
| [Codex·Ponytail](./codex.md) | 스킬·플러그인·CLI 갱신 | Ponytail 추가·호출·문제 해결·복귀 |
| [Oh My Zsh](./oh-my-zsh.md) | zsh 테마·플러그인·개인 셸 설정 | macOS·Linux zsh 설정·업데이트·복귀 |
| [Homebrew](./brew.md) | OS에 설치하는 개발 도구·앱 | 패키지 설치·업데이트·진단 |
| [nvm](./nvm.md) | Node.js 런타임 | TS·React·Electron·서버의 Node 버전 전환 |
| [JDK](./jdk.md) | Java·Gradle 실행 환경 | 프로젝트별 JDK 선택·병행 유지·업데이트·제거 |
| [Ruby·Bundler·CocoaPods](./ruby.md) | Ruby 버전과 프로젝트별 gem 도구 | Ruby·네이티브 의존성 도구 복원·업데이트 |
| [FVM](./fvm.md) | Flutter SDK | 프로젝트마다 Flutter 버전 고정 |
| [uv·가상환경](./uv.md) | Python 버전·가상환경·의존성·기존 venv | Python 프로젝트 복원·실행·관리 |
| [Docker·Compose](./docker.md) | 컨테이너·이미지·볼륨·서비스 | 터미널 접속·실행·업데이트·데이터 보존 |
| [rustup](./rustup.md) | Rust 툴체인·타깃·컴포넌트 | 프로젝트 버전 고정·전환·업데이트 |
| [C/C++ 툴체인](./cpp-toolchain.md) | GCC·Clang·MSVC·SDK·CMake | OS별 컴파일러 선택·빌드 환경 재현 |
| [Git·GitHub](./github.md) | 소스 기록·공유·리뷰 | 브랜치 작업·PR·태그·복구 |

macOS 초기 설치는 도구별 공식 권장 방식을 따릅니다. rbenv·ruby-build는 Homebrew, nvm·FVM은 공식 설치 스크립트를 사용합니다. Homebrew도 보조 패키지용으로 초기 설정에서 준비하며 기존에 정상 동작하는 설치를 자동으로 다른 방식으로 전환하거나 중복 설치하지 않습니다. 업데이트는 각 도구의 설치 방식에 맞게 진행합니다.

nvm·FVM·uv는 런타임이나 SDK를 선택합니다. npm·pip 등은 프로젝트 패키지를 관리합니다. venv만으로 Python 자체 버전을 내려받거나 고정할 수는 없습니다. 예시의 버전·파일·브랜치명은 실제 프로젝트에 맞춰 선택합니다.
