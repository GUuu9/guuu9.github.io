# 개발 환경·작업 가이드

주로 사용하는 개발 환경, 도구 사용법, 프로젝트 규칙과 서버 운영 절차를 기록하는 개인 문서 저장소입니다.

## 문서 선택

| 폴더 | 목적 | 시작 문서 |
| :--- | :--- | :--- |
| 00.Setup | PC 최초 설정·재설정의 도구별 순서 | [OS별 설정](./00.Setup/OS_Dev_Setting.md) |
| 01.Tools | 개발 도구의 OS별 설치·설정·사용법·버전 관리 | [도구 목록](./01.Tools/README.md) |
| 02.Boilerplates | 프로젝트 구조·파일명·개발 규칙·AGENTS.md | [보일러플레이트 목록](./02.Boilerplates/README.md) |
| 03.Utilities | 편의 앱의 설치·실행·업데이트 | [유틸리티 목록](./03.Utilities/README.md) |
| 04.Servers | 외부 서버 구축·작업 영역 제공·운영 | [서버 목록](./04.Servers/README.md) |

작성 중인 내용과 오류 기록은 [issues 안내](./issues/README.md)에 따라 로컬에 보관합니다.

## 00.Setup — PC 개발 환경

| 환경 | 설정 문서 | 문서 버전 | 문서 점검 | 실제 설치·실행 | 점검일 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Windows 11 x64 | [Windows 설정](./00.Setup/Windows_Dev_Setting.md) | v5.1.0 | 구조·링크 검사 통과 | 미검증 | 2026-11-03 |
| macOS Apple Silicon | [macOS 설정](./00.Setup/macOS_Dev_Setting.md#cpu별-확인-사항) | v6.1.0 | 구조·링크 검사 통과 | Apple Silicon 기기 미검증 | 2026-11-03 |
| macOS Intel | [macOS 설정](./00.Setup/macOS_Dev_Setting.md#cpu별-확인-사항) | v6.1.0 | 구조·링크 검사 통과 | Intel Mac·macOS 13.7.8 확인, 전체 설치 흐름 미검증 | 2026-11-03 |
| Linux Ubuntu / Debian x86_64 | [Linux 설정](./00.Setup/Linux_Dev_Setting.md) | v5.0.0 | 구조·링크 검사 통과 | 미검증 | 2026-11-03 |

문서 점검은 버전·코드 블록·내부 링크를 확인한 결과입니다. 실제 설치·빌드 성공을 뜻하지 않습니다. macOS 설치 이후 프로젝트별 시작·업데이트는 [안내](./00.Setup/macOS_Dev_Setting.md#프로젝트-시작업데이트)에서 Tools 문서로 이어집니다.

각 OS 문서의 설치 명령·PATH·확인 순서를 따라 설정합니다. 상세 사용·버전 관리는 Tools에서, 새 프로젝트 시작은 해당 보일러플레이트에서 진행합니다. 기존 프로젝트는 요구 버전과 잠금 파일을 우선합니다.

## 01.Tools — 개발 도구

| 관리 대상 | 가이드 |
| :--- | :--- |
| 편집기 표시 언어·폰트 | [VS Code·Android Studio](./01.Tools/editor-setup.md) |
| Codex 스킬·플러그인 | [Codex·Ponytail](./01.Tools/codex.md) |
| zsh 테마·플러그인·셸 설정 | [Oh My Zsh](./01.Tools/oh-my-zsh.md) |
| 보조 패키지·앱 관리(macOS 초기 준비) | [Homebrew](./01.Tools/brew.md) |
| Node.js 버전 | [nvm·nvm-windows](./01.Tools/nvm.md) |
| Flutter SDK 버전 | [FVM](./01.Tools/fvm.md) |
| Python 버전·패키지·가상환경 | [uv·가상환경](./01.Tools/uv.md) |
| 컨테이너·이미지 공유·데이터 보존 | [Docker·Compose](./01.Tools/docker.md) |
| Rust 툴체인 버전 | [rustup](./01.Tools/rustup.md) |
| C/C++ 컴파일러·SDK·빌드 환경 | [C/C++ 툴체인](./01.Tools/cpp-toolchain.md) |
| 소스 기록·협업·복구 | [Git·GitHub](./01.Tools/github.md) |

## 02.Boilerplates — 프로젝트 규칙

[특정 유형만 Git으로 내려받기](./02.Boilerplates/README.md#특정-보일러플레이트만-내려받기)

[TypeScript Composer](https://github.com/GUuu9/typescript-composer) · [Flutter Composer](https://github.com/GUuu9/flutter-composer)

TypeScript Composer는 backend 뼈대에 웹 UI·Phaser·Electron과 통신·Service를 조합하는 하나의 묶음입니다. Flutter Composer는 Android·iOS·공용 target과 선택 기능으로 별도 조립합니다. 코드는 각 독립 저장소에서 관리하고 이곳에는 사용·추가 안내를 둡니다. [작성 규칙](./02.Boilerplates/authoring-rules.md)과 [반출 요청문](./02.Boilerplates/project-request.md)을 따릅니다.

## 03.Utilities — 편의 앱

- [ComfyUI](./03.Utilities/comfyui.md): GitHub 설치·모델 환경·실행·업데이트
- [ArtCraft Launcher·Craft 도구](./03.Utilities/craft.md): Craft 앱 설치·업데이트와 소스 빌드
- [Firefox·Chrome](./03.Utilities/browsers.md): OS별 설치·실행·업데이트

## 04.Servers — 외부 서버

[Docker 작업 영역 서버](./04.Servers/docker-server/README.md)는 서버용 PC의 관리자가 사용자별 컨테이너를 만들고, 사용자가 개인 PC의 SSH·VS Code로 접속하는 구성입니다.

1. [서버 준비](./04.Servers/docker-server/guides/docker_remote_dev_env.md)
2. [사용자 작업 영역 생성·접속](./04.Servers/docker-server/guides/docker_container_setup.md)
3. [작업 영역 종류·이미지 선택](./04.Servers/docker-server/workspace-types.md): RStudio·JupyterLab·브라우저 IDE·Android
4. [버전·업데이트·백업·복구](./04.Servers/docker-server/operations.md)

실행 설정은 공통 [Dockerfile](./04.Servers/docker-server/Dockerfile)과 [Compose](./04.Servers/docker-server/compose.yaml)를 기준으로 사용합니다. 언어별 설정은 서버 안내의 환경 목록에서 선택합니다.

## 문서 관리

문서의 표·강조 상자·접기 적용은 [Markdown 디자인·작성 가이드](./01.Tools/markdown-style.md)를 따릅니다.

저장소를 수정하는 에이전트는 [AGENTS.md](./AGENTS.md)의 문서 관리 규칙을 따릅니다.

문서는 해당 주제의 폴더에서 수정하고, 파일 이동·삭제 시 연결된 상대 링크도 갱신합니다. 공통 실행 설정은 한 곳에서 관리하며 문서에서 참조합니다. 문서 상단의 확인일·버전은 해당 내용을 갱신할 때 함께 수정합니다.

설치·업데이트 명령은 프로젝트 요구 버전과 현재 공식 지원 조건을 확인한 뒤 사용합니다. 문서·Compose 정적 검사와 실제 설치·접속·데이터 복원 검증은 구분합니다. 서버 템플릿의 실제 빌드·접속·복원 검증은 아직 완료하지 않았습니다.
