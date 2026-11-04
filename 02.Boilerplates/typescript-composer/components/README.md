<!-- version: v2.0.1 -->
# 관리자·AI: 구성품 선택·적용

사용자는 루트 README의 형태·feature 명령을 사용합니다. 이 문서는 구성품을 작성·수정하는 관리자와 AI를 위한 목록입니다.

구성품은 기본 구조를 붙이는 base, 결과 형태로 마무리하는 targets, 독립 기능을 추가하는 features로 구분합니다. [npm compose 명령](../docs/01-getting-started.md)으로 선택·복사·연결을 자동 적용할 수 있습니다. 수동으로 적용할 때는 아래 선행 순서와 각 구성품 README를 따릅니다.

```text
components/
├── 01-base/
│   ├── frontend/
│   ├── phaser/
│   └── electron-backend/
├── 02-targets/
│   ├── backend-webui/
│   ├── web-app/
│   ├── web-phaser/
│   ├── electron-app/
│   └── electron-phaser/
└── 03-features/
    ├── communications/     common·tcp·udp·mqtt·socket-io
    ├── services/           game-persistence
    ├── utils/              독립 순수 함수의 추가 위치
    └── core/               독립 기반 기능의 추가 위치
```

| 분류 | 책임 | 추가 기준 |
| :--- | :--- | :--- |
| [base](./01-base/README.md) | 화면·게임·Electron 실행 구조 | 결과 형태를 만들 때 기반으로 선택 |
| [targets](./02-targets/README.md) | 기본 구성품을 연결하고 실행·배포 형태 확정 | 선택한 결과에 필요한 adapter·설정만 제공 |
| [features](./03-features/README.md) | 통신·Service·util·선택적 core 기능 | 필요한 프로젝트에 독립적으로 추가·제거 |

번호는 기본 구조 → 결과 형태 → 추가 기능을 찾아보는 분류 순서입니다. 설치 순서는 아래 조합별 선행 조건을 따릅니다. 예를 들어 electron-phaser는 파일 저장 feature를 target보다 먼저 적용합니다.

## 결과별 적용 순서

| 결과 형태 | 적용 순서 |
| :--- | :--- |
| backend-webui | [frontend](./01-base/frontend/README.md) → [backend-webui](./02-targets/backend-webui/README.md) |
| web-app | [frontend](./01-base/frontend/README.md) → [web-app](./02-targets/web-app/README.md) |
| web-phaser | [Phaser](./01-base/phaser/README.md) → [web-phaser](./02-targets/web-phaser/README.md) |
| electron-backend | [Electron backend](./01-base/electron-backend/README.md) |
| electron-app | [frontend](./01-base/frontend/README.md) → [Electron backend](./01-base/electron-backend/README.md) → [일반 화면 IPC](./02-targets/electron-app/README.md) |
| electron-phaser | [Phaser](./01-base/phaser/README.md) → [Electron backend](./01-base/electron-backend/README.md) → [게임 파일 저장](./03-features/services/game-persistence/README.md) → [게임 IPC](./02-targets/electron-phaser/README.md) |

추가 통신은 [공통 메시지](./03-features/communications/common/README.md) 뒤에 [TCP](./03-features/communications/tcp/README.md)·[UDP](./03-features/communications/udp/README.md)·[MQTT](./03-features/communications/mqtt/README.md) 중 필요한 것을 선택합니다. 기본 예시는 별도 진입점이며 한 프로세스로 합칠 때의 등록·종료 지점도 각 문서에 있습니다. 브라우저는 Node TCP/UDP를 직접 사용할 수 없습니다.

[Socket.IO](./03-features/communications/socket-io/README.md)는 별도 공통 메시지 구성품 없이 기본 뼈대에 적용합니다. HTTP 서버에 이벤트를 붙이고 polling·WebSocket client와 acknowledgement로 통신합니다.

## 새 구성품 추가

feature 작성은 [전용 작성 규칙](../docs/maintainers/03-feature-authoring.md)을 기준으로 합니다. 폴더·코드·DI·패키지·조합 검사와 완료 기준을 한 순서로 확인합니다.

기본 구조를 늘리면 base, 결과 형태의 연결·배포 차이는 targets, 선택 기능은 features의 해당 역할 아래에 둡니다. 파일이 core나 services에 들어간다는 이유만으로 분리하지 않습니다. 독립적으로 가져올 수 있는 기능 단위를 기준으로 합니다. 실행 환경에 종속된 DI·Scene 조립은 해당 base에 유지합니다.

각 구성품에는 README와 files의 소스·설정·검사·반입용 docs를 둡니다. README는 선행 구성품 → 복사 경로 → npm 패키지 → 연결/해제 지점 → 확인 → 데이터 보존/복귀를 안내합니다. package.json·lock은 통째로 교체하지 않고 대상 프로젝트에서 갱신합니다. 범용 Service·util은 targets를 import하지 않으며 필요한 입력·의존성을 호출자에게 받습니다.

완성 프로젝트는 외부 components 경로를 참조하지 않습니다. README·project-agents.md·update.md에도 결과 명칭·실행·배포·검증을 기록합니다. 같은 기능 코드는 features 한 곳에서 관리하고 targets는 이를 가져와 연결합니다. 자동 조합용 feature는 compose.json에 DI·기존 파일의 명시적 패치와 패키지·명령을 선언합니다. files의 기존 경로 충돌은 중단하며 상세 규칙은 [관리자 작성 안내](../docs/maintainers/01-composition-design.md)를 따릅니다.

## 검증 범위

이번 분류 변경은 반입 후 소스·설정·테스트가 이전 조합과 동일한지 대조했습니다. 이전 빌드·테스트·미서명 macOS x64 앱 디렉터리·통신 검증 이력은 각 구성품에 보존했습니다. 실제 GUI·설치/서명·운영 broker·다른 OS는 미검증이며 개발 의존성 moderate 15건과 Phaser 번들 크기 경고도 기존과 같습니다.
