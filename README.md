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

- macOS: [개발 환경 설정](./00.Setup/macOS_Dev_Setting.md)
- macOS 설치 이후: [프로젝트 시작·업데이트 안내](00.Setup/macOS_Dev_Setting.md#프로젝트-시작업데이트)에서 해당 Tools 문서로 이동
- [Windows 11](./00.Setup/Windows_Dev_Setting.md)
- [Linux — Ubuntu / Debian](./00.Setup/Linux_Dev_Setting.md)

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

[mobile-app](./02.Boilerplates/mobile-app/README.md) · [server-wui](./02.Boilerplates/server-wui/README.md) · [electron-phaser](./02.Boilerplates/electron-phaser/README.md)

준비 중인 [server](https://github.com/GUuu9/guuu9.github.io/tree/main/02.Boilerplates/server)·[electron-app](https://github.com/GUuu9/guuu9.github.io/tree/main/02.Boilerplates/electron-app)은 GitHub 폴더에서 확인합니다.

[작성 규칙](./02.Boilerplates/authoring-rules.md)과 [프로젝트에 전달할 요청문](./02.Boilerplates/project-request.md)에 따라 기존 프로젝트에서 재사용할 샘플의 규칙을 추출합니다. 원본의 별도 반출 폴더 하나에 문서·지침·실행 샘플을 담아 가져옵니다. [산출물·유형 안내](./02.Boilerplates/README.md)를 참고합니다. 현재 mobile-app·server-wui·electron-phaser의 실행 샘플·시작 가이드·설명서·작업 지침을 제공합니다. server·electron-app은 준비 중입니다.

## 03.Utilities — 편의 앱

- [ComfyUI](./03.Utilities/comfyui.md): GitHub 설치·모델 환경·실행·업데이트
- [Craft 도구](./03.Utilities/craft.md): PhotoCraft·VectorCraft·EffectCraft·FilmCraft 공통 관리
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
