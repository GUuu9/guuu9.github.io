<!-- version: v3.0.0 -->
# macOS Intel 개발 환경 설정

새 Mac의 최초 설정과 기존 Mac의 재설정에 사용하는 진입 안내입니다. Apple 메뉴의 이 Mac에 관하여에서 OS·칩을 확인하고 [기본 셸·시스템 확인](../01.Tools/shell-environment.md#macos-셸path-준비)에서 실제 아키텍처가 `x86_64`인지 확인합니다. macOS·Xcode 지원 범위가 최신 도구 설치를 제한할 수 있습니다. Intel용 배포판이 있다는 것만으로 현재 macOS에서 실행 가능하다고 판단하지 않습니다.

## 필수 설정 순서

[macOS 공통 설정](./macOS_Common_Dev_Setting.md#1-필수-설정)의 셸·PATH → Command Line Tools → Homebrew → VS Code 순서로 진행합니다. 도구별 설치 명령은 Tools에서 확인합니다. 기존 설치·개인 설정·데이터는 보존합니다.

## 선택 설정

[공통 설정의 작업별 목록](./macOS_Common_Dev_Setting.md#2-선택-설정)에서 사용할 작업만 선택합니다. 지원되는 macOS·CPU와 프로젝트 버전을 먼저 확인하고 도구가 요구하는 선행 조건부터 설치합니다. 다른 CPU의 node_modules·.venv·네이티브 빌드 결과는 옮겨 쓰지 않습니다.

## 사용 중인 Intel MacBook의 제한

기존 기록의 환경은 macOS 13.7.8·x86_64입니다. Homebrew의 최신 설치기와 패키지 지원은 제한되므로 [과거 공식 설치기 안내](../01.Tools/brew.md#과거-공식-설치-스크립트로-신규-설치-시도)를 확인합니다. Flutter 3.35.7은 [기존 환경 기준](../01.Tools/fvm.md#intel-macbook의-flutter-버전-고정)이며 Intel의 최종 지원 버전을 뜻하지 않습니다.

Docker가 필요할 때만 [Ventura용 Docker Desktop 4.48.0](../01.Tools/docker.md#intel-ventura의-docker-desktop-4480)을 확인합니다. 구버전 보안·데이터 호환 제약과 원격 Linux 서버 대안을 함께 확인하며 다른 macOS에 이 버전을 강제하지 않습니다.

## 완료 확인

[공통 완료 확인](./macOS_Common_Dev_Setting.md#완료-확인)을 마친 뒤 [프로젝트 시작·업데이트](./macOS_Common_Dev_Setting.md#프로젝트-시작업데이트)로 이동합니다. 도구 설치와 프로젝트 실행·배포 검증은 구분합니다.
