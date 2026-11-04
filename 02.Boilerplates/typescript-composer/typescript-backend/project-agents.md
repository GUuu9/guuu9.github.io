<!-- version: v2.0.0 -->
# Server 프로젝트 작업 지침 보관본

새 프로젝트에서 이 파일을 AGENTS.md로 복사합니다. 명령과 코드 경로는 package.json이 있는 프로젝트 루트 기준입니다. 문서 저장소에는 자동 적용되는 지침으로 두지 않습니다.

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
