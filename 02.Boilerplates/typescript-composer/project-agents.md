<!-- version: v2.3.0 -->
# TypeScript Composer 작업 지침

이 묶음 전체를 관리하는 프로젝트에서는 이 파일을 AGENTS.md로 사용합니다. 생성된 앱에서는 생성기가 출력한 AGENTS.md를 따릅니다. 이 묶음의 관리 지침을 앱 작업 지침으로 복사하지 않습니다.

## 작업 범위

묶음은 typescript-backend·components·docs로 구성됩니다. 묶음 루트는 실행 프로젝트가 아닙니다. typescript-backend에서 형태·프로젝트명으로 npm run compose를 호출하고(묶음 루트 별칭도 지원), 새 프로젝트는 항상 Composer 바로 아래에 생성합니다. 출력 폴더에서 설치·실행합니다. 생성기 변경 시 npm run test:compose와 실제 조합 검사를 수행합니다. [구성품 목록](./components/README.md)·[설계](./docs/maintainers/01-composition-design.md)·[연결 안내](./docs/maintainers/02-assembly-guide.md)를 먼저 확인합니다.


## 작업별 읽기 순서

작업 전 Git 상태·package.json·lock·.nvmrc를 확인하고 아래에서 해당하는 행을 선택합니다. 여러 영역을 바꾸면 관련 행을 함께 적용합니다. 문서 다음에는 실제 설정·호출자·테스트를 읽고 구현과 일치하는지 확인합니다.

| 작업 | 먼저 읽을 문서 → 대상 | 함께 갱신·확인할 것 |
| :--- | :--- | :--- |
| 뼈대·공통 계층 변경 | [설계](./docs/maintainers/01-composition-design.md) → [뼈대 작업 지침](./typescript-backend/project-agents.md) → [뼈대 구조](./typescript-backend/docs/02-boilerplate.md) | 영향받는 base·target·feature, 생성 결과와 회귀 검사 |
| base·target 추가·수정 | [설계](./docs/maintainers/01-composition-design.md) → [연결 안내](./docs/maintainers/02-assembly-guide.md) → [구성품 목록](./components/README.md)에서 대상 README | 진입점·전송 경계·지원 형태·빌드/배포, 생성기와 조합 검사 |
| feature 추가·수정 | [Feature 작성 규칙](./docs/maintainers/03-feature-authoring.md) → 대상 feature README·compose.json·files/docs | 자동 연결·활성화 상태·충돌/복구·추가 전후 회귀 검사 |
| compose·feature 명령 변경 | [설계](./docs/maintainers/01-composition-design.md) → [Feature 작성 규칙](./docs/maintainers/03-feature-authoring.md) → [사용자 명령](./docs/01-getting-started.md) | scripts/compose.mjs·feature.mjs, test/compose.test.mjs, 반출용 .composer 계약 |
| Node·의존성·환경 변경 | [뼈대 환경 준비](./typescript-backend/docs/01-getting-started.md) → 대상 구성품 README·files/docs | manifest·lock·.nvmrc·.env.example, 설치·복귀·지원 범위 |
| 빌드·배포 변경 | [뼈대 빌드·배포](./typescript-backend/docs/03-build-and-release.md) → 대상 구성품 files/docs의 빌드·배포 절차 | 산출물·서명·지원 OS/CPU·데이터 보존·복귀 |
| 문서·경로 변경 | 대상 문서 → [사용자 안내](./README.md)·[연결 안내](./docs/maintainers/02-assembly-guide.md) | 들어오는 링크·웹 메뉴·반출 문서 링크 |

공통 변경과 실제 검사 결과는 [변경 이력](./update.md)에 기록합니다. 생성된 앱의 업무 코드만 바꾸는 경우에는 이 표 대신 앱 내부 AGENTS.md의 작업별 안내를 사용합니다.

## 문서별 책임과 독자

| 문서 | 독자·작성 내용 |
| :--- | :--- |
| README.md | 사용자: 다운로드·형태/feature 선택·생성·시작 |
| docs/01-getting-started.md | 사용자: 명령·환경 설정·기능 실행·오류 안내 |
| docs/maintainers/01-composition-design.md | 관리자·AI: 구조·역할·의존 방향·구성품 작성·compose.json 패치 규칙 |
| docs/maintainers/02-assembly-guide.md | 관리자·AI: 결과 형태별 연결 지점·수동 조합·검증 |
| docs/maintainers/03-feature-authoring.md | 관리자·AI: 새 feature의 파일·코드·등록·충돌·검사·완료 기준 |
| components/**/README.md | 관리자·AI: 해당 구성품의 파일·설정·설치·연결/해제·실제 검증 |
| components/**/files/docs | 생성된 앱의 설치·사용·배포·보존 안내 |
| update.md | 공통 변경·검증·복귀 이력 |

사용자 문서에 폴더 내부 구조·DI 등록·패치 작성법을 요구하지 않습니다. 형태와 feature 선택만으로 생성이 끝나야 합니다. 내부 구조나 연결 절차를 바꾸면 관리 문서와 생성기를 함께 고치고, 사용자 명령/동작이 달라질 때만 사용자 가이드를 갱신합니다.

feature 추가·수정 작업은 [Feature 작성 규칙](./docs/maintainers/03-feature-authoring.md)을 먼저 읽고 완료 전 검사까지 적용합니다. 적용하지 않은 preset과 기존 feature의 동작을 보존합니다.

## 구성품 관리

01-base는 화면·실행 구조, 02-targets는 최종 형태의 연결·배포, 03-features는 독립 통신·Service·util·core입니다. 번호는 탐색 순서이며 선행 기능은 target보다 먼저 적용할 수 있습니다. 같은 기능 코드를 target에 복제하지 않습니다. 별도 기능이 없는 util·core에 빈 구현을 추가하지 않습니다.

구성품에는 README와 files의 코드·설정·테스트·프로젝트 안에서 읽을 docs를 둡니다. 추가 파일·npm 패키지·DI/진입점·시작/종료·검증·제거·데이터 보존을 명시합니다. 반입 프로젝트는 구성품 원본이나 묶음 밖 문서를 참조하지 않아야 합니다. package.json·lock은 전체 교체 대신 대상 프로젝트에서 갱신합니다.

## 변경과 확인

Git 상태·호출자·선행 구성품·테스트·manifest·잠금 파일을 확인하고 사용자 변경을 보존합니다. 뼈대와 선택 구성품의 files를 임시 프로젝트에 적용하고 해당 README의 타입 검사·테스트·빌드·실행을 확인합니다. 경로만 바꾸면 조합 후 파일 동일성과 링크를 우선 확인합니다.

입력·Origin·IPC 발신자 검증과 내부 오류 비노출·정상 종료를 유지합니다. 개인 .env·키·캐시·node_modules·dist·release는 반입하지 않습니다. 삭제·업데이트·복귀 시 사용자 데이터는 먼저 보존합니다. Electron 기본 설정은 미서명이며 인증서를 자동 선택하지 않습니다.

README·공통 docs·웹 메뉴와 들어오는 링크도 이동/삭제에 맞춰 갱신합니다. 공통 변경은 update.md에 기록하고 구성품의 실제 검증·미검증 이력도 유지합니다. 기존 테스트 통과를 이번 실행이나 다른 OS 지원 보장으로 바꾸지 않습니다. commit·push·원격 배포·서명은 요청된 범위에서 수행합니다.

프로젝트 인자는 경로가 아닌 kebab-case 이름입니다. 출력은 실행 cwd 대신 복사한 Composer 루트를 기준으로 해석합니다. 향후 기존 프로젝트용 명령도 같은 이름 해석을 사용하고 생성기가 기존 대상을 덮어쓰지 않는 규칙을 유지합니다.

feature 추가 시 반출 프로젝트의 scripts/feature.mjs와 .composer/catalog·state.json 계약 및 생성 후 추가/충돌/복구 검사를 함께 유지합니다. 사용자에게 수동 연결을 요구하지 않습니다.
