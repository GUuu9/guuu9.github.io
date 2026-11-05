<!-- version: v1.0.1 -->
# 버전·호환성·보안 업데이트 관리

Composer·구성품을 유지보수하는 개발자와 AI의 규칙입니다. 앱 내부의 실제 업데이트는 [프로젝트 관리 절차](../../typescript-backend/docs/04-version-management.md)를 따릅니다. 자동 업데이트·취약점 검사 서비스는 이 규칙으로 설치되지 않습니다.

## 버전의 구분

| 대상 | 기록 위치·변경 기준 |
| :--- | :--- |
| Composer 원본 | Git commit/tag와 update.md. 미커밋 변경은 기준 commit과 미커밋 상태를 함께 기록 |
| 앱 | package.json.version과 앱 update.md. Composer와 별도 릴리스 |
| feature 구현·연결 계약 | 아래 목록의 기능 버전과 해당 README의 변경 이력 |
| Node·npm·npm 패키지 | .nvmrc·engines·manifest·lock 및 조합 기록의 실제 실행 버전 |
| 문서 | 첫 줄 version. 기능 버전과 별개이며 설명만 바뀌면 구현 버전을 올리지 않음 |

feature 버전은 major.minor.patch로 관리합니다. 오류 수정은 patch, 기존 사용법을 보존한 기능 추가는 minor, API·DI·IPC·설정·저장 형식·필수 지원 환경의 비호환 변경은 major입니다. 0.x에서도 비호환 변경을 변경 이력에 명시합니다. 패키지 버전 변경만으로 기능 호환성을 보장하지 않습니다.

## Feature 목록

아래 v0.1.0은 이번 규칙 도입 시 부여한 초기 관리 버전입니다. npm 배포 버전이나 전체 조합 검증 완료 표시가 아닙니다. 구현·compose.json·대상 연결이 바뀌면 이 목록과 해당 README에 버전·변경점·이전 버전에서의 적용/복귀를 기록합니다.

| ID | 기능 버전 | 용도 | 선행/제약·직접 의존성의 기준 위치 |
| :--- | :--- | :--- | :--- |
| common | 0.1.0 | TCP·UDP·MQTT 공용 메시지 계약 | 독립 선택 대상 아님. communications/common |
| tcp | 0.1.0 | TCP 요청·응답 예제 | common. [README](../../components/03-features/communications/tcp/README.md)·compose.json |
| udp | 0.1.0 | UDP 메시지 예제 | common. [README](../../components/03-features/communications/udp/README.md)·compose.json |
| mqtt | 0.1.0 | broker 기반 publish/subscribe | common·외부 broker. [README](../../components/03-features/communications/mqtt/README.md)·compose.json |
| socket-io | 0.1.0 | Socket.IO 이벤트·ack 통신 | [README](../../components/03-features/communications/socket-io/README.md)·compose.json |
| game-persistence | 0.1.0 | 게임 데이터 파일 저장 | DI 연결, electron-phaser 기본 포함. [README](../../components/03-features/services/game-persistence/README.md)·compose.json |

현재 이 목록은 문서로 관리합니다. .composer/state.json의 features는 ID 목록이며 기능 버전 잠금 장치가 아닙니다. 앱 반출 시 사용한 원본 commit/tag와 이 목록의 사본을 앱 관리 문서에 기록하고, 실제 반출된 .composer/catalog를 함께 보관합니다. 원본을 수정해도 기존 앱의 catalog는 갱신되지 않습니다.

신규 feature 등록 시 ID·버전·기능/용도·지원 target·선행 기능/호환 버전·패키지·연결 계약·데이터 형식·충돌/미지원 조합을 기록합니다. 전체 Node 형태에 대한 정책상 허용과 실제 검증된 조합을 구분합니다. [작성 규칙](./03-feature-authoring.md)의 생성 후 추가 검사도 수행합니다.

## 정상 동작 조합 기록

조합의 기준은 target + base + feature ID/버전 + 원본 revision + manifest/lock + Node/npm + OS/CPU입니다. 개별 기능 테스트 통과를 모든 feature 조합의 통과로 확대하지 않습니다.

- 실행한 날짜·명령·결과·최저/최고 실제 검증 OS/브라우저·CPU·검증 로그 위치를 기록합니다.
- 상태는 미검증 / 정적 검사 통과 / 테스트·빌드 통과 / 실제 실행 확인 / 배포 확인 / 실패로 구분하고 검사 범위를 함께 적습니다.
- 새로 npm ci한 결과와 기존 node_modules 재사용·모의 npm 결과를 구분합니다.
- 통과 기록은 새 버전으로 덮어쓰지 않고 새 행을 추가합니다. 실패 조합·원인·마지막 정상 조합도 보존합니다.
- 기록 양식은 [프로젝트 관리 절차](../../typescript-backend/docs/04-version-management.md)를 사용합니다. 기존 update.md·구성품 README의 과거 결과는 근거로 연결하되 현재 재검증으로 표시하지 않습니다.

현재 전체 조합에 대한 새 검증은 수행하지 않았습니다. [기존 검증 이력](../../update.md)을 참고하며, 과거 재사용 의존성·모의 npm·GUI/타 OS 미검증 한계를 유지합니다.

## 보안·지원 업데이트 순서

1. 공식 보안 권고/GHSA/CVE·릴리스 노트·지원 종료 일정을 확인합니다. 영향 버전·직접/간접 의존 경로·runtime/빌드도구·노출 경로·조치 버전을 기록합니다. npm audit 0건만으로 안전하다고 판정하지 않습니다.
2. 외부에서 악용 가능한 취약점·배포 차단은 우선 대응합니다. 단순 개발 도구 경고도 빌드/공급망 위험을 확인합니다. 보류하면 이유·완화책·담당·재점검 날짜를 기록합니다. EOL 전에 지원되는 버전으로 전환을 검증합니다.
3. 별도 브랜치에서 도구 자체·Node/SDK·프로젝트 패키지·feature 계약 변경을 구분합니다. 보안 수정에 불필요한 전체 업그레이드를 섞지 않습니다.
4. 뼈대 manifest/lock·루트/뼈대 .nvmrc·생성기에 고정된 패키지·feature compose.json 중 영향받는 위치를 함께 갱신합니다. 다른 프로젝트의 전역 기본값은 바꾸지 않습니다.
5. 깨끗한 생성 조합과 기존 앱의 feature 추가, 기존 기능·충돌 보호·실패 복구를 검사합니다. 변경 feature 단독·기존 조합·공유 연결부를 쓰는 target을 확인합니다. 새 lock으로 설치·check·test·build·관련 실동작을 검사합니다.
6. 기능 버전·호환 조합·보안 판단·미검증 범위·복귀 기준을 기록한 후 릴리스합니다. 기존 앱에는 자동 반영되지 않으므로 별도 이행 변경으로 처리합니다.

기존 앱의 활성 소스만 업그레이드하고 catalog를 방치하면 후속 add가 이전 기준을 재현하거나 충돌할 수 있습니다. catalog·생성 스크립트·상태의 갱신은 자동 지원하지 않습니다. 검증된 새 Composer로 별도 프로젝트를 생성해 변경을 비교하고, 업무 코드·데이터를 보존하며 이행합니다. state의 해시만 고쳐 충돌 검사를 우회하지 않습니다.

## 공식 근거

확인일: 2026-11-05. 특정 현재 버전의 안전성·지원 여부를 전부 확인했다는 뜻은 아닙니다.

- [Node 릴리스·지원 정책](https://github.com/nodejs/Release)
- [npm audit](https://docs.npmjs.com/cli/commands/npm-audit/)
- [npm ci](https://docs.npmjs.com/cli/commands/npm-ci/)

기존 앱의 원본 반영은 [원본 갱신·앱 이행 절차](../../typescript-backend/docs/04-version-management.md#git에서-보일러플레이트가-갱신된-경우)를 따릅니다. 부분 버그 수정과 catalog/연결 계약을 포함한 전체 이행을 구분하고 이전 원본·새 원본·사용자 코드의 차이를 보존합니다.
