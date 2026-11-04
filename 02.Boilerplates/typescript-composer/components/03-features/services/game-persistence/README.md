<!-- version: v1.1.0 -->
# 게임 파일 저장 Service

게임 저장 계약과 Node 파일 저장 처리를 제공합니다. Electron·HTTP·화면에 의존하지 않으며 호출자가 데이터 디렉터리를 전달합니다. 현재 계약은 version:1·0 이상의 안전한 정수 score입니다.

## 1. 복사·확인

files 내용을 대상 프로젝트 루트에 복사합니다. 기존 파일은 비교·병합합니다. 기준 뼈대의 .nvmrc Node·npm 의존성 복원이 선행되며 추가 npm 패키지는 없습니다.

```text
files/src/shared/game-save.ts → src/shared/game-save.ts
files/src/backend/services/persistence/persistence.service.ts → 같은 경로
files/test/game-persistence.test.ts → test/game-persistence.test.ts
files/docs/06-game-persistence.md → docs/06-game-persistence.md
```

```bash
npm run check
npm test
npm run build
```

TypeScript는 Service에서 import한 shared 계약도 dist/shared로 출력합니다. Electron 조합에서는 build:electron을 사용합니다.

## DI 등록

자동 조합은 compose.json의 패치로 아래 연결을 적용합니다. 수동으로 추가하면 src/backend/core/di.ts에 다음 import를 넣습니다.

```typescript
import { fileURLToPath } from 'node:url';
import { PersistenceService } from '../services/persistence/persistence.service.js';
```

createDI의 인자와 반환 객체를 확장하고 기존 greetingUsecase 조립은 유지합니다.

```typescript
export function createDI(dataDirectory = fileURLToPath(new URL('../../../.local/game-save/', import.meta.url))) {
  // 기존 file·config·repository·usecase 생성 코드를 유지합니다.
  const gamePersistence = new PersistenceService(dataDirectory);
  return { greetingUsecase: usecase, gamePersistence };
}
```

Node 기본 경로는 프로젝트의 .local/game-save이며 Git에서 제외합니다. 실제 저장은 save를 호출할 때 발생합니다. 다른 경로는 createDI(directory)로 선택하고 종료 시 gamePersistence.flush를 기다립니다. Electron 게임 target은 userData 경로를 DI에 전달한 뒤 같은 인스턴스를 IPC에 주입합니다.

## 2. 연결·사용

호출자의 DI 또는 조립 지점에서 생성하고 필요한 Usecase·adapter에 전달합니다. directory는 해당 프로젝트가 실제로 사용할 데이터 경로입니다. 모든 작업 위치는 프로젝트 루트입니다.

```typescript
import { PersistenceService } from './services/persistence/persistence.service.js';
const persistence = new PersistenceService(directory);
await persistence.save({ version: 1, score: 4 });
const saved = await persistence.load();
await persistence.flush();
```

import 예시는 src/backend 진입점 기준입니다. 일반 Node 앱은 호출자가 선택한 디렉터리, Electron 앱은 Main에서 app.getPath('userData')를 전달합니다. Service 자체는 Electron을 import하지 않습니다. 종료 전에 flush를 기다려 진행 중인 저장을 마무리합니다. 게임용 IPC 등록·발신자 검증은 electron-phaser target에서 연결합니다.

## 3. 데이터 보존·복귀·제거

파일은 directory/save.json이며 저장은 큐로 직렬화하고 save.json.tmp 작성 후 rename으로 교체합니다. 파일이 없으면 0점, 손상 JSON·잘못된 계약·읽기/쓰기 실패는 오류입니다. 호출자는 오류를 표시하며 손상 파일을 자동 초기화하지 않습니다.

복귀·업데이트 전에 호출자를 종료하고 save.json과 남은 tmp를 별도로 보관합니다. 이전 코드가 현재 저장 버전을 읽을 수 있는지 확인한 뒤 복구합니다. 디렉터리 이름·앱 식별자를 바꿀 때 이전 데이터 경로도 확인합니다.

제거는 호출자·DI 등록 해제 → 파일/테스트/계약 참조 정리 순서입니다. 다른 구성품이 참조하는 shared 계약은 유지하고 사용자 데이터는 임의 삭제하지 않습니다. 프로젝트 docs·README·지침·update.md에 선택한 경로·검증·복귀를 기록합니다.

## 검증 이력

기존 Electron 게임 구성품에서 코드·계약·테스트를 그대로 분리했습니다. 기존 테스트는 동시 저장 직렬화·값 복구·손상 데이터 보존·잘못된 입력 거부를 확인했습니다. 이번 이동은 이전/이후 조합 파일의 내용 동일성을 확인했으며 실행 테스트는 반복하지 않았습니다. OS별 실제 파일 권한·중단 복구·GUI 검증은 기존과 같이 미검증입니다.

## 기능 버전

구현·연결 계약 초기 관리 버전: 0.1.0 (2026-11-05). 문서 version과 별개이며 전체 조합 검증 완료를 뜻하지 않습니다. 변경 시 Composer의 버전·업데이트 규칙에 따라 변경점·호환 조건·검증·이행/복귀를 함께 기록합니다.
