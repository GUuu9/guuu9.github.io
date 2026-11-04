<!-- version: v1.0.1 -->
# Electron 게임 연결

선행 순서는 기준 뼈대 → Phaser 화면 → electron-backend → game-persistence Service → 이 구성품입니다. 일반 frontend·web-phaser·electron-app은 필요하지 않습니다.

선행 기능: [게임 파일 저장 Service](../../03-features/services/game-persistence/README.md). Service 코드는 이 target에 중복 보관하지 않습니다.

## 1. 복사·저장 연결

`files/`를 프로젝트 루트에 복사합니다. 게임의 PersistenceApi·index·Vite를 비교·교체하고 Main 저장 IPC·Preload 확장·frontend 저장 adapter를 추가합니다. shared/game-save·PersistenceService·파일 저장 테스트는 선행 game-persistence 기능에서 가져옵니다. 새 npm 패키지는 없습니다.

src/preload/index.ts에 다음 import를 추가합니다.

```typescript
import './game-save.js';
```

src/backend/electron.ts에 import를 추가합니다.

```typescript
import { registerPersistenceIpc } from './bridge/persistence/persistence.ipc.js';
```

기존 cleanup = registerGreetingIpc(...) 줄을 다음으로 교체합니다.

```typescript
const removeGreeting = registerGreetingIpc(window, page, greetingUsecase);
const removePersistence = registerPersistenceIpc(window, page, app.getPath('userData'));
cleanup = () => { removeGreeting(); removePersistence(); };
```

main.ts → PersistenceApi → window.gameSave → Preload → 저장 IPC → PersistenceService 순서입니다. shared/game-save가 Main·Renderer의 저장 계약이며 frontend 모델 파일은 이 계약을 재노출합니다. Main은 신뢰한 frame·입력만 처리하고 임의 파일 경로를 받지 않습니다.

## 2. 빌드·검사

```bash
npm pkg set 'scripts.build:desktop=npm run build:electron && npm run build:frontend'
npm run build:desktop
npm test
npm run test:frontend
npm run start:desktop
```

원을 클릭하고 저장한 다음 창 종료·앱 재실행으로 점수 복구를 확인합니다. 웹의 localStorage 테스트를 가져왔다면 제거하고 game-persistence.test.ts의 파일 저장 검사로 교체합니다. 실제 창 입력·WebGL·재실행은 별도 GUI 확인 대상입니다.

## 3. 데이터·배포·복귀

저장은 app.getPath('userData')/save.json입니다. 앱 이름·식별자 변경 시 사용자 데이터 경로가 바뀔 수 있으므로 electron-builder.yml과 package.json을 제품 기준으로 확정합니다. userData 전체의 권한을 바꾸거나 공용 디렉터리를 사용하지 않습니다.

동시 저장은 직렬화하고 임시 파일 후 rename으로 교체합니다. 종료 직전에는 진행 중인 저장을 기다립니다. 손상 JSON은 자동 초기화하지 않으며 원본을 보관합니다. 오류가 나면 앱을 종료하고 save.json·남은 save.json.tmp를 별도로 백업하여 확인합니다. 이전 정상 파일을 되돌릴 때 앱이 종료된 상태인지 확인합니다.

package:desktop·release:desktop 전에 게임·저장·복귀를 확인합니다. 지원 OS/CPU·서명·산출물 보관은 Electron backend 문서의 기준을 따릅니다. 이전 버전 복귀 시 현재 저장 version을 읽을 수 있는지 확인합니다. 제거할 때 저장 IPC·Preload import·Main 등록·추가 테스트를 해제하고 사용자 save.json은 보존합니다. 프로젝트 README·지침·이력에 결과 명칭과 실제 검증 범위를 기록합니다.

## 검증 기록 — 2026-11-04

macOS 13.7.8 x64·Node 24.22.1에서 확인했습니다. 별도 게임 조합에서 Main·Preload·게임 빌드와 backend 테스트 5개·frontend 테스트 2개를 통과했습니다. macOS x64 미서명 앱 디렉터리 생성과 ASAR의 Main·Preload·화면·config 포함, src·.env 제외를 확인했습니다. 실제 창·게임 입력·앱 재실행·설치 파일·서명·다른 OS는 미검증입니다. Phaser 번들 약 1.37MB의 크기 경고가 남습니다.

추가 도구를 포함한 전체 임시 조합의 npm 감사에서 개발 의존성 moderate 15건, runtime 의존성 0건이 보고됐습니다. 강제 갱신하지 않았으며 배포 전 개발 도구의 해결 가능 버전을 재검토해야 합니다.
