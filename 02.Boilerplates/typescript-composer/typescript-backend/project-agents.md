<!-- version: v2.2.0 -->
# Server 프로젝트 작업 지침 보관본

새 프로젝트에서 이 파일을 AGENTS.md로 복사합니다. 명령과 코드 경로는 package.json이 있는 프로젝트 루트 기준입니다. 문서 저장소에는 자동 적용되는 지침으로 두지 않습니다.

## 작업별 읽기 순서

이 파일은 뼈대 자체의 개발 기준입니다. Composer 명령으로 생성한 앱은 생성된 AGENTS.md를 따릅니다.

| 작업 | 먼저 읽을 문서 | 확인·갱신 |
| :--- | :--- | :--- |
| 설치·Node·환경·의존성 | [환경 준비](./docs/01-getting-started.md) | .nvmrc·manifest·lock·환경 양식·복귀 |
| HTTP·업무 로직·DI·저장 | [구조·개발](./docs/02-boilerplate.md) | 호출자·입력 검증·계층 경계·종료·테스트 |
| 빌드·배포·지원 범위 | [빌드·배포](./docs/03-build-and-release.md) | 산출물·보존·복귀·지원 OS/CPU |
| compose·feature·구성품 | [Composer 작업 지침](../project-agents.md)의 작업별 안내 | 생성기·구성품·반출 결과·회귀 검사 |

여러 영역을 바꾸면 관련 문서를 함께 읽고 [변경 이력](./update.md)에 변경·검사·한계를 기록합니다.

## 개발 규칙

- 작업 전 Git 상태·manifest·lock·.nvmrc와 연결된 호출자·테스트를 읽습니다. 의존성 복원 중 버전 갱신·lock 삭제·프로젝트 초기화를 하지 않습니다.
- 진입점은 src/backend/index.ts, 조립은 core/di.ts, HTTP 연결·404/500은 core/web-server.ts에 둡니다.
- 기능별 bridge 아래 Bridge는 입력 검증·HTTP 응답, Usecase는 처리 순서, Model은 결과 타입을 맡습니다. Service는 I/O, Repository는 실제 필요한 데이터 소유·검증, utils는 순수 함수를 맡습니다.
- HTTP Router와 Electron IPC는 전송 경계입니다. 업무 로직에 Request/Response·ipcMain·BrowserWindow를 주입하지 않습니다. 필요 없는 프레임워크·공통 모듈 인터페이스·빈 계층을 만들지 않습니다.
- 외부 입력은 unknown부터 검사하고 400·404·500을 구분합니다. 예외 상세·개인 경로·비밀값을 응답에 노출하지 않습니다. 새 인증·데이터 쓰기는 실제 요구와 보존·복구 규칙을 먼저 확인합니다.
- 설정은 src/backend/config의 공개 기본값이며 빌드에 복사합니다. 실제 비밀값은 .env.example 양식과 Git 제외 .env로 관리하고 로딩 방법을 문서화합니다. 현재 앱은 .env를 자동으로 읽지 않습니다.
- 시작 가이드는 가져온 프로젝트부터 설치·PATH·버전 확인·의존성 복원·실행·종료를 직접 안내합니다. 패키지 밖 Setup·Tools에 의존하지 않습니다.
- 변경 후 npm run check·npm test·npm run build, 필요한 HTTP 실행·SIGINT/SIGTERM 종료를 확인합니다. 소켓·OS 제약으로 못 한 검사는 구분해 보고합니다.
- 기능·파일·의존성을 바꾸면 docs/02-boilerplate.md의 목록·두 도식·검증표와 update.md를 갱신합니다. 배포 변경은 docs/03-build-and-release.md에 산출물·환경·보존·복귀를 기록합니다.
- 사용자 변경과 데이터는 보존하며 커밋·push·원격 배포는 요청받은 범위에서만 수행합니다.

- 묶음 관리용 scripts/compose.mjs는 npm run compose로 새 프로젝트를 생성합니다. 기존 폴더는 덮어쓰지 않고 구성품 원본을 유지합니다. 변경 시 npm run test:compose와 생성 결과의 명령·링크·검사·빌드를 확인합니다. 생성기와 관련 테스트는 완성 앱에 포함하지 않습니다.
