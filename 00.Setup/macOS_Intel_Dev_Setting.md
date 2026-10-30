<!-- version: v2.2.1 -->
# macOS Intel 개발 환경 복원

확인일: 2026-10-28. 초기화 후 기존 프로젝트를 내려받아 개발·빌드할 수 있는 환경을 구성합니다. GitHub·SSH 인증 설정은 다루지 않습니다.

## 1. 시스템과 아키텍처 확인

```bash
sw_vers
uname -m
```

기대 아키텍처는 `x86_64`입니다. Intel Mac에서는 x86_64 배포판을 선택합니다. macOS와 Xcode 지원 범위 때문에 최신 Flutter·iOS 도구를 설치하지 못할 수 있으므로 프로젝트가 요구하는 macOS·Xcode·SDK의 호환성을 먼저 확인합니다.

OS 업데이트는 해당 Mac에서 지원하며 프로젝트 도구와 호환되는 버전으로 진행합니다. [Xcode 지원 조건](https://developer.apple.com/support/xcode/)을 확인합니다.

## 2. Command Line Tools

```bash
xcode-select --install
```

설치 후 확인합니다. iOS 개발용 전체 Xcode는 공통 설치 가이드에서 준비합니다.

```bash
xcode-select -p
git --version
clang --version
```

다음 공통 설치의 [Homebrew 준비](./macOS_Common_Dev_Setting.md#homebrew-준비)에서 보조 패키지 관리 환경을 먼저 구성합니다. 주요 개발 도구는 공식 스크립트·배포판으로 설치하고 Homebrew와 중복 관리하지 않습니다. Intel은 최신 설치기가 지원하지 않으므로 연결된 과거 공식 설치기 절차와 지원 제한을 먼저 확인합니다.

## 3. 공통 도구 초기 설치

이후 [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md)을 순서대로 진행합니다.

사용 중인 Intel MacBook의 업데이트 지원 제약으로 Flutter는 **3.35.7**에 고정합니다(2026-10-30 사용자 환경 기준). 공통 안내에서 FVM을 설치한 다음 [Intel MacBook 버전 고정 절차](../01.Tools/fvm.md#intel-macbook의-flutter-버전-고정)를 따라 프로젝트 복원 단계에서 `fvm use 3.35.7`을 적용합니다. FVM 자체 버전과 구분하며 `stable`로 자동 갱신하지 않습니다.

Docker Desktop·Android Studio·Unity Editor·Flutter SDK를 직접 다운로드할 때는 **Intel용**을 선택합니다. Apple Silicon과 Intel 사이에서 `node_modules`, `.venv`, 네이티브 빌드 결과를 복사하지 않고 대상 Mac에서 다시 설치합니다.

설치 후 프로젝트 작업은 [공통 문서의 도구별 안내](./macOS_Common_Dev_Setting.md#프로젝트-작업-안내), OS·앱 갱신은 [업데이트 안내](./macOS_Common_Dev_Setting.md#macos와-설치된-앱-업데이트)를 참고합니다.

## 4. Ventura 13.7.8의 Docker Desktop 설치

2026-10-30 확인: 이 Mac은 `macOS 13.7.8`·`x86_64`입니다. Docker Desktop **4.48.0(빌드 207573)**은 macOS 13에 설치 가능한 마지막 버전입니다. [4.48.0 공식 릴리스 노트](https://docs.docker.com/desktop/release-notes/#4480)는 다음 릴리스부터 macOS 14가 필요하다고 명시합니다. 최신 Intel 배포판을 받거나 Homebrew로 설치 경로만 바꿔도 OS 요구 조건은 해결되지 않습니다.

### 설치 파일 선택·검증

개인 Mac에서 다음 순서로 진행합니다. Homebrew는 필요하지 않습니다.

1. 기존 Docker 데이터가 있다면 먼저 백업합니다. 실행 가능한 환경에서는 [Docker 가이드](../01.Tools/docker.md)의 이미지·볼륨 백업을 따릅니다. 앱이 시작되지 않으면 Docker를 완전히 종료한 상태에서 `~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw`를 별도 위치에 복사합니다. 디스크 위치를 변경했다면 실제 위치를 사용하며, bind mount의 호스트 파일은 별도 보관합니다. [공식 백업·복원 안내](https://docs.docker.com/desktop/settings-and-maintenance/backup-and-restore/).
2. [Docker Desktop 4.48.0 Intel 공식 DMG](https://desktop.docker.com/mac/main/amd64/207573/Docker.dmg)를 내려받습니다. arm64 또는 버전이 고정되지 않은 최신 `Docker.dmg` 링크와 구분합니다.
3. 내려받은 파일의 SHA-256을 [동일 빌드 공식 체크섬](https://desktop.docker.com/mac/main/amd64/207573/checksums.txt)과 비교합니다. 아래 명령은 파일이 `~/Downloads/Docker.dmg`에 있을 때의 예시이며 실제 저장 경로·파일명에 맞춥니다.

```bash
shasum -a 256 ~/Downloads/Docker.dmg
```

확인 당시 공식 SHA-256:

```text
fac73a1edc91e6bce5a449e83e3d0b537f19df74c5f51af4705e479cf0d32515
```

체크섬이 다르면 설치하지 않고 다운로드 출처·파일을 다시 확인합니다. 위 주소는 확인일에 HTTP 200으로 응답했지만, Docker는 오래된 설치 파일의 제공을 중단할 수 있습니다. 링크가 사라지면 임의 미러의 파일을 기본 대안으로 사용하지 않습니다.

### 설치·실행·업데이트 주의

1. 기존 Docker와 이를 사용하는 도구를 종료합니다. DMG를 열고 Docker.app을 Applications로 옮깁니다. 기존 앱 교체는 데이터 백업을 마친 뒤 진행합니다. 더 최신 버전에서 사용한 데이터 디스크의 하위 버전 호환성은 보장하지 않습니다.
2. Docker.app을 실행하고 초기 설정·필요한 권한 안내를 완료합니다. 엔진이 준비되면 [공통 설치 문서의 확인 명령](./macOS_Common_Dev_Setting.md#6-docker-desktop-설치)을 실행합니다. `docker version`에 Client와 Server가 모두 표시되어야 합니다. Docker Desktop 앱 버전 4.48.0과 포함된 Engine·Compose 버전은 서로 다릅니다.
3. 앱의 업데이트 설정에서 자동 다운로드·자동 설치 항목이 있으면 끄고 4.48.0을 유지합니다. macOS 13에서는 최신 버전 업데이트를 수락하지 않습니다. 새 버전 전환 전에는 OS 요구 조건과 데이터 백업을 다시 확인합니다.

이 방법은 **지원이 종료된 구버전으로 로컬 개발 환경을 복원하는 방법**입니다. 최신 보안 수정은 포함되지 않습니다. 장기 사용은 해당 Mac에서 공식 지원하는 macOS로 업그레이드한 뒤 지원되는 Docker Desktop을 설치하거나, [Linux Docker 서버](../04.Servers/docker-server/README.md)에서 작업하고 Mac은 SSH·VS Code로 접속하는 구성을 검토합니다. 서버의 볼륨과 소스는 Mac의 기존 로컬 데이터와 별개입니다.

검증 범위: 현재 Mac의 OS·CPU, 공식 지원 변경 내용, DMG HTTP 응답과 공식 체크섬 조회를 확인했습니다. 설치 파일 전체 다운로드·서명 검사·설치·엔진 실행·기존 데이터 복원은 수행하지 않았습니다.
