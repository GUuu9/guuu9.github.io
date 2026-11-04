<!-- version: v1.1.1 -->
# 구성품과 조합 설계

## 1. 목표와 현재 상태

`typescript-backend`를 출발점으로 소스·npm 패키지·설정을 추가하여 각 형태를 조합합니다. 결과 프로젝트는 폴더 하나로 독립하며 작업공간이나 다른 보일러플레이트를 실행 중 참조하지 않습니다. 모바일은 후속 작업입니다.

현재 복사본은 Express Router를 생성하는 `core/di.ts`, HTTP 앱을 만드는 `core/web-server.ts`, 수신·종료를 담당하는 `index.ts`가 연결된 HTTP 서버입니다. 기준 샘플의 backend 경로 이동과 DI·HTTP 분리는 적용했습니다. 일반 frontend 구성품은 외부 복사·패키지 추가·개발 프록시 연결까지 제공합니다. backend-webui 구성품은 정적 화면 제공까지 구현했습니다. web-app 구성품은 공개 API 설정·정적 빌드·배포 안내까지 제공합니다. Phaser 화면과 web-phaser 저장·웹 빌드 구성품을 추가했습니다. Electron backend·일반 화면·게임 저장·TCP·UDP·MQTT·Socket.IO 구성품도 작성했습니다. 실제 적용 순서는 [구성품 목록](../components/README.md)을 따르고 검증 한계는 각 README를 확인합니다. 구체적인 연결은 [목표 형태별 연결 순서](./02-assembly-guide.md)를 따릅니다.

## 2. 작업공간과 결과 프로젝트

```text
typescript-composer/
├── README.md
├── project-agents.md
├── update.md
├── docs/                    구성·조합 안내
├── typescript-backend/      시작 뼈대
└── components/
    ├── 01-base/             frontend·phaser·electron-backend
    ├── 02-targets/          결과 형태별 연결·배포 구성
    └── 03-features/         communications·services·utils·core
```

새 구성품은 필요한 기능을 작성할 때 추가합니다. 처음에는 파일 복사와 명시적인 수정 절차로 조합합니다. 자동 설치기·플러그인 로더·공용 npm 패키지는 도입하지 않습니다.

결과 프로젝트의 공통 배치는 다음과 같습니다. 선택하지 않은 영역은 만들지 않습니다.

```text
project/
├── src/
│   ├── backend/
│   │   ├── index.ts         HTTP 진입점; 선택 시 electron.ts·tcp.ts·udp.ts·mqtt.ts 추가
│   │   ├── core/            DI·통신 시작·종료 조립
│   │   ├── bridge/기능/     연결 방식별 입력 경계·Usecase·Model
│   │   ├── services/        파일·DB·외부 API 접근
│   │   ├── repository/      필요한 데이터 소유·조회
│   │   ├── utils/           필요한 순수 함수
│   │   └── config/          공개 기본 설정
│   ├── frontend/
│   │   ├── main.tsx         일반 화면 진입점; 게임은 main.ts도 가능
│   │   ├── core/            화면 DI·앱 또는 게임 생성
│   │   ├── scenes/          화면·상태·기능별 처리
│   │   ├── apis/            HTTP·IPC 호출 또는 로컬 구현
│   │   └── resource/        화면·게임 자산
│   ├── preload/            Electron에서 공개할 제한된 API
│   └── shared/             양쪽이 사용하는 계약·메시지 검증
├── test/                   backend·frontend 및 연결 검사
├── docs/                   설치 → 연결 → 개발 → 배포 순서
├── package.json
└── package-lock.json
```

첫 구현 단계에서 기존 `src/*`의 backend 코드를 `src/backend/`로 이동하고 import·테스트·config 복사·실행 명령·문서를 함께 변경했습니다. 이후 조합에서는 backend 위치를 다시 바꾸지 않습니다. 구성품 때문에 빈 폴더나 빈 계층을 만들지 않습니다.

구성품 분류는 복사 대상 코드의 폴더명과 별개입니다. 화면·실행 기반은 base, 최종 연결은 targets, 독립 기능은 features에 둡니다. 게임 파일 저장의 계약·Service·테스트는 03-features/services/game-persistence 한 곳에 두고 electron-phaser target은 IPC·frontend adapter만 제공합니다. base의 DI·수명주기는 해당 실행 구조에 유지합니다.

## 3. 기능과 연결부의 경계

```text
HTTP / TCP / UDP / MQTT / IPC
             ↓
기능별 Bridge → Usecase → 필요한 Service·Repository

화면 → ViewModel 또는 게임 처리 → Api → HTTP / IPC / 로컬 구현
```

- Bridge는 외부 메시지 검증과 응답·오류 변환을 맡습니다. 같은 기능에 여러 연결부가 필요하면 `greeting.http.bridge.ts`, `greeting.ipc.bridge.ts`처럼 구분합니다.
- Usecase는 기능 처리를 맡고 Express·Electron·소켓 객체를 직접 참조하지 않습니다. 여러 Bridge가 같은 Usecase를 호출할 수 있습니다.
- DI는 Usecase와 필요한 의존성을 생성합니다. 연결부 등록은 별도로 조립하여 현재처럼 DI가 항상 HTTP Bridge를 반환하는 결합을 풉니다.
- Service·Repository의 파일·DB 접근은 backend에서 수행합니다. 브라우저 코드에서는 Node 전용 구현을 import하지 않습니다.
- shared에는 직렬화 가능한 계약과 양쪽에서 필요한 검증만 둡니다. HTTP 상태 코드·Electron 객체·비밀 설정은 넣지 않습니다. 한쪽에서만 쓰는 모델은 해당 기능에 둡니다.
- frontend는 실제 HTTP·IPC·로컬 호출 차이를 apis에 둡니다. 여러 구현을 교체할 필요가 생긴 기능부터 작은 인터페이스를 사용합니다.

각 실행 진입점이 통신 연결과 구독의 수명을 소유합니다. 시작 실패를 보고하고 종료 시 수신·소켓·구독을 해제합니다. 공통 수명주기 프레임워크는 실제 중복이 생기기 전까지 만들지 않습니다.

## 4. 구성품의 제공 단위

각 구성품은 README, 복사할 소스·설정 예시, 필요한 검사를 함께 제공합니다. 프로젝트의 package.json·잠금 파일을 통째로 덮어쓰지 않습니다.

| 기록 항목 | 내용 |
| :--- | :--- |
| 선행 조건 | 기준 뼈대 버전, 먼저 필요한 구성품, 지원 실행 환경 |
| 추가 파일 | 원본과 대상 경로, 기존 파일과 충돌하는 경우의 수정 위치 |
| npm 의존성 | runtime/dev 구분, 선택 버전의 근거, 설치 명령 |
| 연결 순서 | 설정 → 의존성 생성 → Bridge/Api 등록 → 시작·종료 연결 |
| 환경 설정 | 비밀값 없는 `.env.example`, 실제 읽는 위치와 적용 범위 |
| 확인 | 정상·잘못된 입력·실패·종료 확인 방법과 기대 결과 |
| 제거 | 등록·의존성 해제 순서와 보존할 사용자 데이터 |

설치한 패키지는 npm으로 잠금 파일을 갱신합니다. 서로 다른 잠금 파일을 합치거나 전체 package.json을 복사하지 않습니다. 기존 사용자 파일은 변경할 위치를 안내하며 무조건 덮어쓰지 않습니다.

## 5. 결과 형태별 조합

| 결과 | 추가 구성품 | 시작·산출물·연결 |
| :--- | :--- | :--- |
| `typescript-backend` | 기본 HTTP 연결부 | Node 진입점, backend 출력과 공개 config. HTTP API 제공 |
| `backend-webui` | 일반 frontend + HTTP Api + 정적 화면 제공 | 개발 중 frontend 프록시로 API 연결. 배포 시 backend가 frontend 빌드 결과 제공 |
| `web-app` | 일반 frontend + 웹 빌드·배포 설정 | 정적 frontend 산출물 배포. 필요한 API는 별도 backend 주소로 연결 |
| `web-phaser` | Phaser frontend + 웹 빌드·배포 설정 | 브라우저용 게임·자산 배포. 필요한 서버 기능은 별도 API로 연결 |
| `electron-backend` | Electron Main·Preload·IPC 연결부 | Main 시작·종료와 제한된 IPC API까지 제공하는 중간 구성. 사용자 앱 완성은 화면 연결 후 확인 |
| `electron-app` | electron-backend + 일반 frontend + 패키징 설정 | Main이 창과 Preload를 생성하고 frontend가 공개 IPC API 호출 |
| `electron-phaser` | electron-backend + Phaser frontend + 패키징 설정 | 게임 화면이 같은 IPC 경계로 로컬 기능 호출 |

웹 배포형은 backend 실행 파일을 정적 호스팅에 포함하지 않습니다. 기준 뼈대에서 frontend를 조합한 뒤 frontend만 별도로 빌드·배포합니다. 사용하지 않는 backend와 Node 의존성을 제거하는 절차도 함께 제공합니다. frontend 자산과 코드에는 비밀값을 넣지 않습니다.

`backend-webui`의 API 404와 화면 경로 처리는 구분합니다. SPA를 사용하는 경우에만 화면 경로 fallback을 추가하며 API 오류를 HTML로 바꾸지 않습니다. 별도 출처 API의 주소·인증·CORS는 해당 배포 구성에서 명시합니다.

Electron은 Renderer의 Node 접근을 제한하고 Preload가 허용한 기능만 공개합니다. IPC 입력·발신자 검증은 Main 경계에서 수행합니다. HTTP 서버를 Electron 기본 실행의 필수 요소로 두지 않습니다.

## 6. 통신 구성품 확장

| 연결부 | 구성품이 정해야 할 내용 |
| :--- | :--- |
| HTTP | 경로·메서드·입력·상태 코드·요청 제한·서버 종료 |
| TCP | 서버/클라이언트 역할·메시지 경계·크기 제한·연결/재연결·종료 |
| UDP | 송수신 역할·메시지 형식·크기 제한·유실/중복 처리 요구·종료 |
| MQTT | broker/client 역할·topic·payload·QoS·재연결/재구독·인증·종료 |
| Socket.IO | HTTP 서버 연결·이벤트/ack·Origin·payload 제한·client 해제 |
| IPC | 허용 채널·공개 API·입력/발신자 검증·handler 등록/해제 |

TCP·UDP는 Node 기본 모듈 사용을 우선하고 MQTT 등 외부 패키지는 실제 구현 단계에서 공식 문서와 호환성을 확인해 선택합니다. 전송 방식에 필요한 규칙을 하나의 만능 메시지 규격으로 강제하지 않습니다.

## 7. 구현 순서와 완료 기준

1. **뼈대 정리**: backend 경로를 고정하고 DI·HTTP 조립 경계를 분리합니다. 기존 인사말·입력 오류·설정 오류·시작·종료 동작을 유지합니다.
2. **일반 frontend와 backend-webui**: base/frontend로 HTTP 인사말을 연결합니다. 프록시·정적 산출물·API 오류·화면 경로를 확인합니다.
3. **web-app**: 같은 frontend를 backend와 분리 빌드합니다. 정적 제공과 외부 API 연결 조건을 확인합니다.
4. **Phaser와 web-phaser**: 브라우저 게임 화면·자산 로딩·저장 연결 경계를 구성합니다. 웹 실행을 먼저 확인합니다.
5. **electron-backend**: 기존 electron-phaser의 Main·Preload·IPC를 참고하여 기능 호출을 연결합니다. HTTP 없는 실행과 IPC 오류·종료를 확인합니다.
6. **electron-app·electron-phaser**: 일반 화면·게임 화면을 각각 연결하고 OS별 패키징을 준비합니다. 빌드·창 실행·패키지 실행 결과를 구분합니다.
7. **추가 통신**: TCP·UDP·MQTT는 구성품별로 하나씩 진행합니다. 각 구성품의 정상·오류·해제와 기존 조합에 미치는 영향을 확인합니다.

단계마다 변경 파일·의존성·연결 절차·검증 결과를 해당 프로젝트의 docs·update.md에 기록합니다. 기존 기능의 오류 처리와 입력 검증을 이동 중 유지하고, 미검증 실행 환경을 완료로 표시하지 않습니다. 계획된 모든 구성품의 코드·연결 절차를 작성했습니다. 기준 뼈대의 이력은 update.md, 구성품과 조합의 검증 결과는 각 구성품 README에 기록합니다. 실제 GUI·설치·운영 검증은 미완료입니다.
