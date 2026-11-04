<!-- version: v2.0.0 -->
# TypeScript Composer

TypeScript 뼈대에 화면·실행 환경·통신·선택 기능을 조합하는 하나의 보일러플레이트 묶음입니다. 묶음 루트에서 npm install을 실행하는 구조가 아니며, typescript-backend를 새 프로젝트에 복사한 뒤 구성품을 적용합니다. 현재 기준 샘플은 [typescript-backend](./typescript-backend/)입니다.

[구성품·조합 설계](./docs/01-composition-design.md)에서 파일 배치·연결 경계·구현 순서를 확인합니다. 상세 구현 순서는 이 설계를 따릅니다.

[목표 형태별 연결 순서](./docs/02-assembly-guide.md)에서 DI·통신·화면·빌드 연결 절차를 확인합니다.

[구성품 선택·적용 순서](./components/README.md)에서 목표 형태별 조합을 확인합니다.

## 가져오기·프로젝트 시작

개인 PC에 Git을 준비합니다. macOS는 Git 사용 전에 설치한 Command Line Tools 또는 Xcode의 라이선스·초기화를 확인합니다. 묶음을 받은 뒤 프로젝트별 Node 설치·PATH·버전 확인은 [뼈대 시작 가이드](./typescript-backend/docs/01-getting-started.md)를 따릅니다.

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/typescript-composer
cd 02.Boilerplates/typescript-composer
```

변경이 원격에 push된 뒤 사용할 수 있는 다운로드 경로입니다. 내보내기 명령은 위 경로가 Git에 커밋된 상태에서 사용합니다. 만든 임시 ZIP은 확인 후 삭제합니다. 새 프로젝트는 비어 있는 별도 폴더에 typescript-backend의 내용물과 숨김 파일을 복사해 만듭니다. 캐시·빌드 결과·개인 .env는 복사하지 않습니다. components는 선택한 구성품의 files만 해당 프로젝트에 적용합니다.

macOS·Linux에서 묶음 루트 기준 예시입니다. 실제 경로로 바꾸고 기존 프로젝트를 덮어쓰지 않습니다.

```bash
(
  set -euo pipefail
  project_dir="$HOME/Developer/my-app"
  test ! -e "$project_dir"
  mkdir -p "$project_dir"
  git archive HEAD:02.Boilerplates/typescript-composer/typescript-backend | tar -xf - -C "$project_dir"
)
```

Windows PowerShell에서는 실제 데이터 드라이브를 선택합니다.

```powershell
$ProjectDir = "D:\Developer\my-app"
$PackageZip = "$env:TEMP\typescript-composer-seed.zip"
if ((Test-Path $ProjectDir) -or (Test-Path $PackageZip)) { throw "기존 대상이 있습니다." }
git archive --format=zip --output="$PackageZip" HEAD:02.Boilerplates/typescript-composer/typescript-backend
if ($LASTEXITCODE -ne 0) { throw "내보내기 실패" }
Expand-Archive -Path $PackageZip -DestinationPath $ProjectDir
```

새 프로젝트에서 뼈대 시작 가이드로 Node·의존성·기본 실행을 확인하고, [구성품 적용 순서](./components/README.md)에 따라 기본 요소와 결과 형태·선택 기능을 붙입니다. 각 구성품의 반입용 docs도 함께 가져옵니다. 새 프로젝트의 project-agents.md는 AGENTS.md로 사용합니다. 이 묶음 전체를 관리할 때는 [공통 작업 지침](./project-agents.md)을 사용합니다.

[묶음 변경 이력](./update.md). 기존 독립 유형은 뼈대 단독·backend-webui·electron-app·electron-phaser 조합으로 대체합니다. 모바일은 별도 유형입니다.

## 구성품 분류

| 분류 | 관리 대상 |
| :--- | :--- |
| [base](./components/01-base/README.md) | frontend·Phaser·electron-backend의 기본 조합 구조 |
| [targets](./components/02-targets/README.md) | backend-webui·web-app·web-phaser·electron-app·electron-phaser의 최종 연결 |
| [features](./components/03-features/README.md) | 통신·Service·util·선택적 core 기능 |

추가 통신으로 [Socket.IO](./components/03-features/communications/socket-io/README.md)도 제공합니다. 실제 client 왕복·Origin·입력/크기 제한·종료를 확인했습니다.

게임 파일 저장은 [독립 Service](./components/03-features/services/game-persistence/README.md)로 관리하고 electron-phaser target이 가져와 연결합니다. util·core는 분류 기준만 준비했으며 실제 독립 기능이 필요할 때 추가합니다.

## 구성 원칙

프로젝트는 필요한 실행 뼈대에서 시작해, 요구 기능에 맞는 통신 연결부와 기능 코드를 추가하고 진입점·DI에 연결합니다. 구성품은 복사해 독립 실행할 수 있어야 하며, 필요하지 않은 계층이나 패키지는 추가하지 않습니다.

| 구분 | 책임 | 예시 |
| :--- | :--- | :--- |
| 실행 뼈대 | 진입점, 설정, DI, 시작·종료 수명주기 | TypeScript 서버, 브라우저 앱, Electron 앱 |
| 통신 연결부 | 외부 입력을 기능 호출로 연결하고 결과·오류를 전달 | HTTP, TCP, UDP, MQTT, Electron IPC |
| 기능 처리 | 입력 검증 이후의 업무 흐름과 데이터 접근 | Bridge, Usecase, Service, Repository |
| 화면·배포 구성 | 사용자 인터페이스 및 실행·배포 형태 | 웹 UI, Phaser, Electron 패키지 |

HTTP·TCP·UDP·MQTT·IPC는 서로 다른 연결 방식입니다. 같은 기능 처리를 호출할 수 있어도 연결 수명, 메시지 형식, 오류·재연결 처리는 각 연결부가 맡습니다. `util`은 공유할 작은 순수 처리 함수에 사용하며 독립 계층으로 늘리지 않습니다.

## 조합 순서

1. `typescript-backend`를 가져와 공통 구조·버전·의존성을 확인합니다. 실행 대상에 맞춰 필요한 구성품과 진입점·빌드 설정을 추가합니다.
2. 필요한 통신 연결부와 패키지만 추가합니다. 예를 들어 API 서버는 HTTP, 기기 메시지 수신은 TCP·UDP·MQTT, Electron Main과 Renderer 간 연결은 IPC를 선택합니다.
3. 기능별 입력·검증·처리·데이터 접근 코드를 추가하고, 필요한 경우에만 Bridge·Usecase·Service·Repository를 둡니다.
4. 진입점·DI에 연결하고 설정, 정상 흐름, 실패·종료 흐름을 확인합니다.
5. 화면·패키징·배포 구성을 붙이고 해당 조합의 시작·검증·배포 문서를 맞춥니다.

## 조합 형태

```text
typescript-backend
  ├─ + 웹 UI 제공·연결 → backend-webui
  ├─ + 웹 UI + 웹 배포 설정 → web-app
  ├─ + Phaser + 웹 배포 설정 → web-phaser
  └─ + Electron Main·Preload·IPC → electron-backend
       ├─ + 일반 frontend → electron-app
       └─ + Phaser → electron-phaser
```

모든 조합은 `typescript-backend`의 구조와 기능 연결 방식을 기준으로 구성합니다. 구성품에는 추가할 소스·npm 의존성·설정과 연결 순서를 함께 기록합니다.

| 결과 명칭 | 연결부·실행·배포 형태 |
| :--- | :--- |
| `typescript-backend` | 기준 서버 뼈대. 현재 샘플은 HTTP API를 제공 |
| `backend-webui` | 관리하는 서버에서 backend와 웹 UI를 제공 |
| `web-app` | 웹 UI를 웹 호스팅에 배포. 서버 기능은 필요한 경우 별도 backend로 연결 |
| `web-phaser` | Phaser 화면·게임 코드를 브라우저에서 실행하고 웹에 배포 |
| `electron-backend` | Electron Main·Preload·IPC 연결부. 화면을 붙이기 전 backend 구성 |
| `electron-app` | Main·Preload·IPC와 일반 frontend를 데스크톱 앱으로 패키징 |
| `electron-phaser` | Main·Preload·IPC와 Phaser를 데스크톱 게임으로 패키징 |

명칭은 일반 웹 화면에 `app`, Phaser 게임 화면에 `phaser`를 사용하고, 실행 환경은 `web`·`electron`으로 구분합니다. `backend-webui`는 서버가 웹 UI를 함께 제공하는 형태입니다. `web-phaser`는 PokéRogue처럼 브라우저에서 실행·배포하는 게임 형태를 가리킵니다.

브라우저용 산출물에는 Node 전용 서버·파일 I/O 코드를 포함하지 않습니다. Electron의 기능 처리는 Main에 연결하고 화면은 Preload·IPC를 통해 호출합니다. 각 조합의 진입점과 의존성은 해당 실행 환경에 맞춥니다.

모바일은 별도 후속 작업으로 미루며 현재 조합·구현 범위에서 제외합니다.

## 단계별 진행

각 단계는 독립 실행과 확인이 가능한 결과로 마무리하고 다음 단계로 넘어갑니다.

| 순서 | 작업 | 완료 기준 |
| :--- | :--- | :--- |
| 1 | 기준 뼈대와 구성품 계약 정리 | 추가·연결 지점, 의존성, 책임, 검사 방법이 문서화됨 |
| 2 | `typescript-backend`를 기준 샘플로 정리 | 단독 설치·검사·테스트·빌드·실행이 유지됨 |
| 3 | 일반 frontend와 `backend-webui` 연결 | HTTP 요청·응답과 정적 화면 제공 확인 |
| 4 | `web-app` 구성 | frontend 독립 빌드·웹 배포 경계 확인 |
| 5 | Phaser와 `web-phaser` 구성 | 브라우저 게임·자산·저장 연결 확인 |
| 6 | `electron-backend` 구성 | Main·Preload·IPC 등록·검증·종료 확인 |
| 7 | `electron-app`·`electron-phaser` 구성 | 화면·게임 연결과 패키징 준비 |
| 8 | TCP·UDP·MQTT 구성품 추가 | 각 통신의 정상·오류·해제 확인 |

처음부터 코드 생성기나 공용 패키지를 만들지 않습니다. 실제로 같은 구성품을 반복해서 결합하게 되면 복사 가능한 구성품의 경계와 패키지 공유 중 어느 쪽이 나은지 다시 판단합니다.

## 현재 검증 범위

모든 계획 구성품의 소스·복사 파일·연결·설치·검증·제거·반입용 설명서를 작성했습니다. 별도 조합에서 일반 Electron 화면/통신은 테스트 12개, Electron 게임은 테스트 7개와 Main·Preload·frontend 빌드를 통과했습니다. TCP·UDP loopback과 MQTT 패킷 왕복도 확인했습니다. 앞선 웹 구성품의 정적 자산·개발 프록시 검사 기록은 각 README에 있습니다.

macOS x64 게임 앱의 미서명 디렉터리 생성과 ASAR 경계도 확인했습니다. Electron 창·설치 파일·서명·스토어, 브라우저 게임 조작, 운영 broker·외부 배포·다른 OS는 미검증입니다. 개발 의존성 moderate 15건과 Phaser 번들 크기 경고가 남아 있습니다. 현재 결과를 운영 배포 완료나 전체 플랫폼 지원 보장으로 표시하지 않습니다.
