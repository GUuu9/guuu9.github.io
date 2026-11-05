<!-- version: v1.3.0 -->
# Feature 작성 규칙

이 문서는 TypeScript Composer의 feature를 추가·수정하는 관리자와 AI가 따르는 기준입니다. 사용자는 루트의 compose 명령으로 선택하며, 생성 후 DI·import·설정 등록을 수동으로 고쳐야 하는 상태는 완료로 보지 않습니다. 실제 제품의 업무 로직 작성은 별개입니다.

## 1. 추가 전에 정할 것

1. 기존 구성품·실행 코드·compose.mjs·테스트·Git 상태를 확인합니다. 같은 기능이 있으면 재사용합니다.
2. 기능 ID, 책임, 지원하는 결과 형태, 선행 구성품, 생성 파일, 수정 파일을 정합니다.
3. 시작·종료·오류·저장 데이터·제거 시 보존할 항목을 정합니다. 적용하지 않은 프로젝트의 기본 동작은 바꾸지 않습니다.
4. 실행 구조 자체는 01-base, 결과 형태의 adapter·배포 연결은 02-targets, 독립 기능은 03-features에 둡니다. 충돌 검사를 피하려고 feature를 다른 분류에 등록하지 않습니다.

현재 생성기는 모든 --features를 Node 기능으로 취급하며 web-app·web-phaser에서는 거부합니다. 브라우저 기능 지원이나 새로운 선행 의존성 체계가 필요하면 생성기·가이드·테스트를 먼저 확장합니다. 지원되지 않는 조합을 이름만 등록해 허용하지 않습니다.

## 2. 폴더·파일 계약

```text
components/03-features/분류/기능-id/
├── README.md                 관리자용 책임·선행 조건·적용/해제·검증
├── compose.json              패키지·명령·기존 파일 패치
└── files/                    생성 프로젝트 루트에 적용할 내용
    ├── src/                  기능 소스
    ├── test/                 기능과 연결 검사
    ├── docs/NN-feature.md    생성된 앱의 설정·사용·보존 안내
    └── .env.example          필요한 경우에만 공개 환경 양식
```

- 분류는 communications·services·utils·core 중 실제 책임으로 선택합니다. 기능 ID와 새 폴더는 소문자 kebab-case이며 전역에서 구분 가능해야 합니다.
- 파일명·클래스·export·이벤트·명령·환경 키·저장 키는 기능을 식별할 수 있게 정합니다. 다른 기능의 일반적인 index.ts·config.ts를 대체하지 않습니다.
- files에는 새 파일을 넣습니다. 기존 DI·진입점·package.json·tsconfig 전체를 복사해 덮어쓰지 않습니다.
- 동일 기능의 계약·처리는 한 곳에서 관리합니다. target은 해당 기능을 가져와 연결하고 구현을 복제하지 않습니다.
- 심볼릭 링크, 개인 설정·비밀값·캐시·node_modules·dist·release를 넣지 않습니다. 생성된 프로젝트는 Composer나 다른 프로젝트를 import하지 않습니다.
- 문서 번호는 함께 선택할 구성품과 충돌하지 않게 정합니다. 기존 번호를 일괄 변경하지 않고 링크·메뉴·생성 후 읽는 순서도 확인합니다.

## 3. 코드와 의존 방향

| 종류 | 작성 위치와 책임 |
| :--- | :--- |
| 통신 | backend/core의 연결 조립과 기능별 Bridge. 메시지·발신자 검증 후 Usecase 호출 |
| Service | backend/services/기능. 파일·DB·외부 API 접근. 경로·client·설정을 인자로 받음 |
| util | 실제 사용하는 영역의 utils. 상태·I/O 없이 입력을 결과로 변환 |
| 선택 core | 초기화·수명주기 등 기반 기능. 기존 DI·진입점을 통째로 대체하지 않음 |
| 공유 계약 | 실제 양쪽에서 필요할 때 src/shared. 플랫폼 객체·비밀·Node 전용 I/O는 제외 |

Bridge는 전송 형식을 처리하고 Usecase는 기능 흐름을 처리합니다. Service·util이 화면·HTTP Request/Response·Electron window를 import하지 않습니다. frontend는 Node backend를 직접 import하지 않고 HTTP·IPC 등의 Api 경계를 사용합니다.

DI에서 의존성을 조립하고 기존 객체·반환 필드를 유지합니다. 시작 파일은 생성·등록·수신·구독을 소유하고 종료 시 handler·listener·소켓·진행 중인 저장을 정리합니다. 서버 생성 함수의 import만으로 수신을 시작하지 않습니다. 단독 실행이 필요하면 별도 진입점과 start:<기능> 명령을 제공합니다.

외부 입력은 unknown에서 검사하고 내부 오류 상세·비밀값을 응답에 넣지 않습니다. 기존 검증·오류 처리·정상 종료를 이동 중 삭제하지 않습니다. 단순 함수에 불필요한 DI·Service·빈 계층을 추가하지 않습니다.

## 4. 새 파일 예시

아래는 Node용 순수 util의 작성 양식입니다. 실제 구성품이 이미 제공된다는 의미는 아닙니다.

```text
utils/label-formatter/
├── README.md
├── compose.json
└── files/
    ├── src/backend/utils/label-formatter.util.ts
    ├── test/label-formatter.test.ts
    └── docs/NN-label-formatter.md
```

```typescript
// src/backend/utils/label-formatter.util.ts
export function formatLabel(value: string): string {
  return value.trim();
}
```

```typescript
// test/label-formatter.test.ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatLabel } from '../src/backend/utils/label-formatter.util.js';

test('Label formatter trims surrounding spaces', () => {
  assert.equal(formatLabel('  Hello  '), 'Hello');
});
```

이 util은 검증된 내부 문자열을 받으며 외부 입력 검사는 호출 경계가 맡습니다. 새 파일만 추가하므로 compose.json은 `{}`로 시작할 수 있습니다. 현재 backend 검사는 test/*.test.ts를 수집합니다. 테스트·소스를 다른 영역에 놓으면 해당 tsconfig·검사 명령에 포함되는지 확인합니다.

## 5. compose.json과 기존 파일 연결

지원하는 필드는 dependencies·devDependencies·scripts·patches입니다. 아래 값은 작성 양식이며 실제 코드의 원문과 패키지 버전을 지정해야 합니다.

```json
{
  "dependencies": {},
  "devDependencies": {},
  "scripts": {},
  "patches": [
    {
      "file": "src/backend/core/di.ts",
      "find": "수정할 원문",
      "replace": "기존 내용을 보존하며 등록을 추가한 원문"
    }
  ]
}
```

1. 기존 파일 변경은 patches로 선언합니다. find는 비어 있지 않고 적용 시점의 파일에 정확히 한 번 존재해야 합니다.
2. import 추가 → 객체 생성 → 반환/등록 → 시작·종료 연결을 필요한 순서로 적용합니다. 새 인스턴스를 중복 생성하지 않습니다.
3. 수정 범위를 좁혀 기존 등록·반환 필드·오류 처리·다른 feature 코드를 보존합니다. 전체 파일 교체, 다른 기능 제거, 검사 우회용 문자열 변경을 하지 않습니다.
4. 여러 feature가 같은 위치를 쓰면 다음 패치가 사용할 원문을 보존하거나 선행 순서를 명시적으로 구현합니다. 독립 기능은 적용 순서를 바꿔도 필요한 등록이 모두 남는지 확인합니다.
5. find 불일치·중복은 템플릿 변화나 충돌입니다. 수동 확인 없이 느슨한 일괄 치환·실패 무시로 통과시키지 않습니다.

실제 DI 추가와 경로 주입은 [game-persistence 선언](../../components/03-features/services/game-persistence/compose.json)을 참고합니다. Service를 등록하고 기존 greetingUsecase를 보존하며 Electron target이 같은 인스턴스를 받습니다. [Socket.IO 선언](../../components/03-features/communications/socket-io/compose.json)은 패키지·별도 실행 명령의 예입니다.

현재 생성기는 feature 파일의 기존 경로 충돌을 거부합니다. .env.example은 이어 붙이고, 동일한 패키지/명령 값은 허용하며 다른 값은 거부합니다. 임의의 TypeScript 코드를 의미적으로 병합하지 않습니다.

## 6. 패키지·설정·데이터

- 기존 패키지·Node 기능을 먼저 사용합니다. 새 의존성은 공식 배포처·용도·고정 버전·runtime/dev 구분을 확인하여 선언합니다.
- package.json·lock을 구성품에서 전체 교체하지 않습니다. 생성된 새 조합의 첫 npm install로 lock을 만들고 이후 npm ci로 복원합니다. 기존 프로젝트의 lock 삭제를 업그레이드 방법으로 사용하지 않습니다.
- 다른 기능의 scripts·패키지 버전을 바꾸지 않습니다. 호환되지 않으면 지원 범위를 명시하고 해당 조합이 중단되도록 검사합니다.
- 환경 키에 기능 구분을 두고 .env.example에는 비밀값 없는 양식만 작성합니다. 같은 키의 서로 다른 기본값은 작성자가 확인합니다. 현재 생성기는 환경 키 중복이나 의미적 충돌까지 검사하지 않습니다.
- 환경 파일의 실제 로딩·설정 전달을 함께 구현합니다. 전역 환경·공용 PATH·다른 프로젝트 기본값을 바꾸지 않습니다.
- 경로·저장 키·포트·이벤트 이름을 구분합니다. 저장 버전 변경은 데이터 변환·백업·복귀를 정의하고 오류 시 원본을 임의 초기화하지 않습니다.

## 7. 생성기·문서 등록 순서

1. 기능 폴더의 README·compose.json·files를 작성합니다.
2. typescript-backend/scripts/compose.mjs의 featurePaths에 ID와 03-features 경로를 등록합니다. CLI 도움말도 맞춥니다.
3. 선행 기능이 있으면 선택/순서 로직도 함께 구현합니다. 현재 requires 같은 임의 필드는 자동 처리되지 않습니다. TCP·UDP·MQTT 공통 기능의 기존 선택 처리를 참고합니다.
4. 파일 경로가 새 영역이면 컴파일·테스트·빌드 복사·패키징 포함 범위를 확인합니다. 문서에만 등록하고 실제 생성에 빠지는 파일이 없어야 합니다.
5. 사용자는 루트 README의 feature 목록과 생성 명령으로 선택할 수 있게 합니다. 구조·작성법은 이 관리 문서와 구성품 README, 앱 사용법은 files/docs에 둡니다.
6. project-agents·관리 문서·웹 메뉴·update.md와 들어오는 링크를 갱신합니다. 날짜는 실제 확인한 날이고 과거 검증 이력은 보존합니다.

## 8. 완료 전 검사

| 경우 | 확인할 결과 |
| :--- | :--- |
| feature 미선택 | 기존 preset의 출력·명령·동작에 불필요한 변화가 없음 |
| feature 단독 선택 | 새 파일·패키지·DI·설정·진입점이 빠짐없이 연결됨 |
| 같은 feature 재선택 | 현재 CLI의 중복 ID 거부와 암묵적 선행 기능 중복 제거가 유지됨 |
| 기존 기능과 함께 선택 | 양쪽 등록·명령·계약·사용자 데이터 경계가 유지됨 |
| 같은 파일을 수정하는 기능 | 적용 순서 양쪽과 실제 반환/등록 결과 확인; 불가 조합은 명시적으로 거부 |
| 충돌·잘못된 입력 | 대상 생성 전 중단하고 기존 프로젝트·원본을 변경하지 않음 |
| 정상·실패·종료 | 정상 결과, 입력·I/O 오류, listener/handler 해제·저장 마무리 확인 |
| 생성 결과 | 타입·테스트·빌드·실행/산출물과 외부 Composer 참조 부재 확인 |

묶음 루트에서 `npm run test:compose`를 실행하고 기능 추가·충돌·비선택 회귀 검사를 생성기 테스트에 남깁니다. 묶음의 뼈대·구성품을 임시 Composer에 복사하고 이름만 지정해 그 루트 아래 새 프로젝트를 생성한 뒤 npm install·check·test·build와 관련 실행을 확인합니다. 새 의존성이 있으면 기존에 다른 패키지가 많이 설치된 node_modules만으로 검증을 끝내지 않습니다.

파일·DI 필드·포트·환경 키·종료 처리가 의미적으로 충돌하는지는 작성자와 조합 테스트가 확인해야 합니다. 생성기 통과만으로 구조 보존이 보장되는 것은 아닙니다. 못 한 OS·GUI·원격·부하 검사는 완료로 표시하지 않습니다. 생성 후 추가 명령은 아래 계약과 검사를 따릅니다.

## 프로젝트 내 추가 명령 대응

새 feature는 최초 compose뿐 아니라 반출된 프로젝트의 `npm run feature -- add <이름>`으로도 연결되어야 합니다. 구현을 files에, 기존 함수의 연결을 compose.json의 정확한 단일 패치로 선언합니다. 수동 import·DI·preload·shared 편집을 사용자 완료 조건으로 남기지 않습니다. 형태별 추가 연결은 생성기의 target 분기에 구현하고 지원하지 않는 형태는 쓰기 전에 거부합니다.

feature 명령은 로컬 .composer/catalog로 새 조합을 재현하고 기존 생성 기준과 비교합니다. 사용자 변경이 있는 갱신 대상은 거부하며 기존 활성 기능을 유지합니다. 전체 사용자 파일을 강제로 교체하거나 충돌 검사를 우회하지 않습니다. .composer의 원본·상태·명령 스크립트도 반출 계약에 포함합니다.

완료 검사에는 생성 후 추가·복수 순차 추가·중복 호출·DI 등 자동 연결·사용자 수정 보존/충돌 중단·검사 실패 시 소스/manifest/lock/상태 복구·미지원 target 거부를 포함합니다. 실제 npm install·check·test·build와 관련 실행도 별도로 확인하고 모의 npm 검사와 구분해 기록합니다. 의존성 설치 스크립트·node_modules·빌드 결과의 부작용은 rollback으로 복원된다고 설명하지 않습니다.

## 버전·호환성 등록

새 기능과 변경 기능은 [버전·업데이트 규칙](./04-version-and-update-policy.md)에 따라 기능 ID·구현 버전·용도·지원 target·선행/충돌 버전·패키지·데이터 계약을 등록합니다. 기능 버전과 문서 version을 구분하고 단독·복수 feature 조합의 실제 검증과 미검증 범위를 기록합니다. 보안/지원 변경은 권고 근거·이행·복귀도 함께 기록합니다.

## 사용자 안내 갱신·완료 조건

feature 추가·용도/버전·지원 형태·사용 명령 변경 시 코드 등록 후 아래 안내를 같은 작업에서 갱신합니다. 문서와 도움말 갱신이 빠졌다면 기능 추가를 완료로 처리하지 않습니다.

| 갱신 대상 | 반영할 내용 |
| :--- | :--- |
| 묶음 README.md·뼈대 README.md | npm run help → npm run compose -- help 안내 유지, 기능 목록·용도·선택 예제 갱신 |
| docs/01-getting-started.md | 기능 추가 명령·선행 환경·지원 형태·검증/복구·도움말 진입 순서 |
| compose.mjs의 명령/상세 도움말 | npm run help·compose help/--help의 기능 목록·용도·제약·예제 |
| feature.mjs의 앱 도움말 | 생성 앱의 npm run help에 필요한 기능 명령·검증/복구·예제 |
| 생성기 README 출력·files/docs | 앱 내부의 기능 목록/사용 안내·필요 환경·추가 후 확인과 복귀 |
| 구성품/버전 목록·해당 README·update.md | 기능 ID·구현 버전·용도·호환 조합·실제 검사·이행/복귀 |

완료 전 실제 묶음/뼈대의 npm run help와 npm run compose -- help, 새로 생성한 앱의 npm run help를 호출해 문서·선언과 대조합니다. 새 기능 활성화 후 해당 사용 문서의 링크·명령·설명도 확인합니다. 도움말의 무변경 회귀 검사를 유지하고 상대 링크·앵커·코드 펜스·웹 메뉴·git diff --check를 검사합니다. 기존에 반출된 앱의 문서는 자동 갱신되지 않으므로 원본 변경과 기존 앱 이행을 구분합니다.
