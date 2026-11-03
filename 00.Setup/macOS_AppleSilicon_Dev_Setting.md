<!-- version: v3.0.0 -->
# macOS Apple Silicon 개발 환경 설정

새 Mac의 최초 설정과 기존 Mac의 재설정에 사용하는 진입 안내입니다. Apple 메뉴의 이 Mac에 관하여에서 OS·칩을 확인하고 [기본 셸·시스템 확인](../01.Tools/shell-environment.md#macos-셸path-준비)에서 실제 아키텍처가 `arm64`인지 확인합니다. 터미널·VS Code를 Apple Silicon 네이티브로 실행하고 Rosetta의 x86_64 도구와 혼용하지 않습니다.

## 필수 설정 순서

[macOS 공통 설정](./macOS_Common_Dev_Setting.md#1-필수-설정)의 셸·PATH → Command Line Tools → Homebrew → VS Code 순서로 진행합니다. 도구별 설치 명령은 Tools에서 확인합니다. 기존 설치·개인 설정·데이터는 보존합니다.

## 선택 설정

[공통 설정의 작업별 목록](./macOS_Common_Dev_Setting.md#2-선택-설정)에서 사용할 작업만 선택합니다. 지원되는 macOS·CPU와 프로젝트 버전을 먼저 확인하고 도구가 요구하는 선행 조건부터 설치합니다. 다른 CPU의 node_modules·.venv·네이티브 빌드 결과는 옮겨 쓰지 않습니다.

## 완료 확인

[공통 완료 확인](./macOS_Common_Dev_Setting.md#완료-확인)을 마친 뒤 [프로젝트 시작·업데이트](./macOS_Common_Dev_Setting.md#프로젝트-시작업데이트)로 이동합니다. 도구 설치와 프로젝트 실행·배포 검증은 구분합니다.
