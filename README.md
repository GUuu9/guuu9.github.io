# 개발 환경·작업 가이드

주로 사용하는 개발 환경, 도구 사용법, 프로젝트 규칙과 서버 운영 절차를 기록하는 개인 문서 저장소입니다.

## 문서 선택

| 폴더 | 목적 | 시작 문서 |
| :--- | :--- | :--- |
| 00.Setup | PC 초기화 후 개발 환경 설치·복원·업데이트 | [OS별 설정](./00.Setup/OS_Dev_Setting.md) |
| 01.Tools | 개발 도구의 용도·사용법·버전 관리 | [도구 목록](./01.Tools/README.md) |
| 02.Boilerplates | 프로젝트 구조·파일명·개발 규칙·AGENTS.md | 유형별 폴더 준비 단계 |
| 03.Utilities | 편의 앱의 설치·실행·업데이트 | [유틸리티 목록](./03.Utilities/README.md) |
| 04.Servers | 외부 서버 구축·작업 영역 제공·운영 | [서버 목록](./04.Servers/README.md) |

## 00.Setup — PC 개발 환경

- macOS: [Apple Silicon](./00.Setup/macOS_AppleSilicon_Dev_Setting.md) · [Intel](./00.Setup/macOS_Intel_Dev_Setting.md) → [공통 초기 설치](./00.Setup/macOS_Common_Dev_Setting.md) → [프로젝트 복원](./00.Setup/macos-project-restore.md)
- macOS의 기존 환경 변경: [도구·프로젝트 업데이트](./00.Setup/macos-update.md)
- [Windows 11](./00.Setup/Windows_Dev_Setting.md)
- [Linux — Ubuntu / Debian](./00.Setup/Linux_Dev_Setting.md)

기존 프로젝트의 요구 버전과 잠금 파일을 우선해 실행·빌드 가능한 환경을 복원합니다.

## 01.Tools — 개발 도구

| 관리 대상 | 가이드 |
| :--- | :--- |
| OS 패키지·앱 | [Homebrew](./01.Tools/brew.md) |
| Node.js 버전 | [nvm·nvm-windows](./01.Tools/nvm.md) |
| Flutter SDK 버전 | [FVM](./01.Tools/fvm.md) |
| Python 버전·패키지·가상환경 | [uv](./01.Tools/uv.md) · [venv](./01.Tools/venv.md) |
| 컨테이너·이미지 공유·데이터 보존 | [Docker·Compose](./01.Tools/docker.md) |
| Rust 툴체인 버전 | [rustup](./01.Tools/rustup.md) |
| C/C++ 컴파일러·SDK·빌드 환경 | [C/C++ 툴체인](./01.Tools/cpp-toolchain.md) |
| 소스 기록·협업·복구 | [Git·GitHub](./01.Tools/github.md) |

## 02.Boilerplates — 프로젝트 규칙

[특정 유형만 Git으로 내려받기](./02.Boilerplates/README.md#특정-보일러플레이트만-내려받기)

[mobile-app](./02.Boilerplates/mobile-app/) · [server](./02.Boilerplates/server/) · [server-wui](./02.Boilerplates/server-wui/) · [electron-app](./02.Boilerplates/electron-app/)

[작성 규칙](./02.Boilerplates/authoring-rules.md)과 [프로젝트에 전달할 요청문](./02.Boilerplates/project-request.md)에 따라 기존 프로젝트에서 재사용할 샘플의 규칙을 추출합니다. 원본의 별도 반출 폴더 하나에 문서·지침·실행 샘플을 담아 가져옵니다. [산출물·유형 안내](./02.Boilerplates/README.md)를 참고합니다. 현재 server-wui의 독립 실행 샘플과 설명서·작업 지침을 제공합니다. 다른 유형은 대상 프로젝트 조사 후 추가합니다.

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

저장소를 수정하는 에이전트는 [AGENTS.md](./AGENTS.md)의 문서 관리 규칙을 따릅니다.

문서는 해당 주제의 폴더에서 수정하고, 파일 이동·삭제 시 연결된 상대 링크도 갱신합니다. 공통 실행 설정은 한 곳에서 관리하며 문서에서 참조합니다. 문서 상단의 확인일·버전은 해당 내용을 갱신할 때 함께 수정합니다.

설치·업데이트 명령은 프로젝트 요구 버전과 현재 공식 지원 조건을 확인한 뒤 사용합니다. 문서·Compose 정적 검사와 실제 설치·접속·데이터 복원 검증은 구분합니다. 서버 템플릿의 실제 빌드·접속·복원 검증은 아직 완료하지 않았습니다.
