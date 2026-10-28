<!-- version: v1.2.1 -->
# 1. 샘플 범위

TypeScript Express 서버와 React WUI의 이름 조회 샘플을 관리한다. 이 파일은 지침 보관본이며 자동 적용 AGENTS가 아니다. 명령과 코드 경로는 `boilerplates/minimal/`을 작업 루트로 한다. 상세 설명은 [보일러플레이트](docs/boilerplate.md), 실행 안내는 [샘플 README](boilerplates/minimal/README.md)를 참고한다. 새 프로젝트에 적용할 때 파일명·링크 조정은 [패키지 README](README.md)를 따른다.

# 2. 작업 전 확인

- 적용 지침과 git status를 확인하고 사용자 변경을 보존한다.
- 수정할 함수의 호출자·타입·설정·테스트까지 읽고 영향 범위를 정한다.
- 샘플 패키지 밖의 소스·node_modules·운영 환경·개인 절대 경로에 의존하지 않는다.

# 3. 구조·명명·경계

- Server: `.bridge.ts`는 요청 검증·HTTP 응답, `.usecase.ts`는 업무, `.repository.ts`는 메모리 데이터·검증, `.service.ts`는 I/O, `utils/*.util.ts`는 순수 보조 처리다.
- `server/src/core/DI.ts`에서 객체를 조립하고 `web-server.ts`에서 HTTP에 연결한다. `index.ts`는 수신·종료를 맡는다.
- WUI: `.page.tsx` → `.viewmodel.ts` → `.service.ts` → `api/Api` 흐름이다. 타입은 `.model.ts`, 스타일은 `.page.css`에 둔다. API 클라이언트를 Repository라고 부르지 않는다.
- `webui/src/core/DI/DI.ts`의 대소문자를 유지한다. DI는 렌더링 밖에서 한 번 생성하고 Page는 `useDI`·`useSyncExternalStore`로 상태·명령을 연결한다.
- NodeNext 서버 빌드를 위해 로컬 TS 모듈 import의 `.js` 확장자를 유지한다. 존재하지 않는 역할 파일은 미리 만들지 않는다.

- 의존 규칙은 [아키텍처 4절](docs/boilerplate.md#4-아키텍처와-대표-데이터-흐름)을 따른다. Page의 직접 fetch·파일 접근, Usecase의 Express 응답 처리, Repository/Service의 화면/Bridge 역참조, WUI의 서버 소스 import를 추가하지 않는다.
- import/type 의존과 HTTP 호출을 구분한다. 테스트의 양쪽 코드 연결을 실행 코드로 옮기지 않는다.
- config는 listen 전 검증하고 Repository가 보관한다. ViewModel은 화면 상태를, Observable은 구독자를 소유한다. 새 비동기 자원·쓰기·장기 연결을 추가하면 실패·종료·해제 경로와 테스트도 함께 설계한다.

# 4. 구현 원칙

- 최소한의 완결 변경으로 호출자·타입·설정·검사를 함께 반영한다. 불필요한 추상화·패키지·생성기를 추가하지 않는다.
- HTTP 입력과 외부 응답·config를 런타임 검증한다. 타입 단언으로 검증을 대체하지 않는다. 실패를 성공으로 숨기지 않는다.
- 예상하지 못한 요청 처리 예외는 공통 500 처리로 전달한다. 상세는 서버에 기록하고 응답에는 내부 메시지·스택을 포함하지 않는다.
- 실패 시 입력값과 사용 가능한 이전 결과를 보존한다. loading 동안 중복 요청을 막는다.
- 비밀값을 config·로그·문서에 넣지 않는다. 이 샘플의 HTTP는 loopback에만 바인딩한다. 외부 노출은 인증·TLS·권한 설계를 포함한 별도 작업이다.
- config 읽기는 부팅 시 한 번 수행한다. 파일 누락·잘못된 JSON·스키마 오류를 임의 기본값으로 숨기지 않는다.
- 테스트와 config는 추적하고 node_modules·dist·.env는 제외한다. 생성 lockfile은 수작업으로 수정하지 않는다.

# 5. 실제 실행·검증 명령

아래는 모두 샘플 작업 루트에서 실행한다.

```sh
npm ci
npm run check
npm test
npm run build
npm start
```

개발은 두 터미널에서 각각 `npm run dev:server`, `npm run dev:webui`를 실행하고 각각 Ctrl+C로 종료한다. 포트 변경 시 index.ts의 port와 Vite proxy를 함께 변경한다. 정상 조회·잘못된 요청·화면의 오류 표시를 확인한다. 비단순 로직은 server/test 또는 webui/test에 작은 검사를 추가한다. 문서만 수정할 때는 링크·명령·diff를 확인한다.

# 6. 완료·보고

- 관련 타입·호출자·테스트·설정·문서·lockfile 누락과 생성 파일·비밀값 혼입을 확인한다. 구조·기능 변경 시 파일 역할 표·아키텍처·[요구사항 대조표](docs/boilerplate.md#요구사항-대조표)를 실제 코드에 맞춰 갱신한다. 문서 충족과 실행 검증을 구분한다.
- 샘플을 따로 복사해 설치·검사·빌드·기동·종료가 가능한지 확인한다. 패키지 내 문서 링크도 복사본에서 검사한다.
- 실제 명령·환경·결과와 미검증·위험을 구분한다. 타입 검사나 HTTP 성공을 브라우저 화면 검증으로 표현하지 않는다.
- 관계없는 파일은 변경하지 않는다. 커밋·원격 쓰기·배포는 요청 범위에서만 수행한다.

샘플 코드·설정·의존성·문서를 갱신하면 유형 폴더 루트의 `update.md`에 날짜·변경 이유·버전 전후(미변경 포함)·적용/복귀 영향·실제 검증과 미검증을 기록합니다. 새 프로젝트에 지침을 적용할 때는 해당 프로젝트의 갱신 이력 파일 위치에 맞춥니다.
