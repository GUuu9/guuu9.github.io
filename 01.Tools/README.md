# 개발 도구 사용 가이드

OS 설치·초기 복원은 [00.Setup](../00.Setup/OS_Dev_Setting.md)을 참고합니다. 이 폴더는 도구의 역할, 프로젝트 작업 흐름, 업데이트와 문제 해결을 다룹니다.

| 도구 | 관리 대상 | 읽을 때 |
| :--- | :--- | :--- |
| [Oh My Zsh](./oh-my-zsh.md) | zsh 테마·플러그인·개인 셸 설정 | macOS 셸 설정·업데이트·복귀 |
| [Homebrew](./brew.md) | OS에 설치하는 개발 도구·앱 | 패키지 설치·업데이트·진단 |
| [nvm](./nvm.md) | Node.js 런타임 | TS·React·Electron·서버의 Node 버전 전환 |
| [FVM](./fvm.md) | Flutter SDK | 프로젝트마다 Flutter 버전 고정 |
| [venv](./venv.md) | Python 패키지 격리 환경 | 기존 pip·requirements.txt 프로젝트 |
| [uv](./uv.md) | Python 버전·가상환경·의존성 | Python 프로젝트 복원·실행·관리 |
| [Docker·Compose](./docker.md) | 컨테이너·이미지·볼륨·서비스 | 터미널 접속·실행·업데이트·데이터 보존 |
| [rustup](./rustup.md) | Rust 툴체인·타깃·컴포넌트 | 프로젝트 버전 고정·전환·업데이트 |
| [C/C++ 툴체인](./cpp-toolchain.md) | GCC·Clang·MSVC·SDK·CMake | OS별 컴파일러 선택·빌드 환경 재현 |
| [Git·GitHub](./github.md) | 소스 기록·공유·리뷰 | 브랜치 작업·PR·태그·복구 |

macOS 초기 설치는 공식 스크립트·공식 배포판을 기본으로 합니다. 각 도구 문서의 업데이트 절차를 따르며 Homebrew는 기존 설치와 선택한 패키지 관리용으로 남깁니다.

nvm·FVM·uv는 런타임이나 SDK를 선택합니다. npm·pip 등은 프로젝트 패키지를 관리합니다. venv만으로 Python 자체 버전을 내려받거나 고정할 수는 없습니다. 예시의 버전·파일·브랜치명은 실제 프로젝트에 맞춰 선택합니다.
