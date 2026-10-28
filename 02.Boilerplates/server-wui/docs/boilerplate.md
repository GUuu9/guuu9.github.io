# 1. 적용 범위와 출처

이 패키지는 server-wui 유형의 독립 실행 샘플이다. [진입 README](../README.md), [작업 지침 보관본](../project-agents.md), [샘플 실행 안내](../boilerplates/minimal/README.md)가 함께 포함된다. 제품의 업무 규칙·운영 문서를 보관하는 패키지가 아니다.

2026-10-28에 접근 가능한 원본 커밋 `c43990098a7e8a2cc839bd1e2213ef711b646603`과 현재 작업 트리·제공된 작업 기록을 참고했다. 출처 경로는 원본 기준 텍스트이며 이 패키지에 존재하는 로컬 링크로 가장하지 않는다:

- `server/package.json`, `server/package-lock.json`, `server/tsconfig.json`, `server/src/index.ts`, `server/src/core/di/registry.ts`.
- `server/src/bridge/systemConfig/`, `server/src/repository/system/`, `server/src/services/file/`, `server/src/services/security/utils/`.
- `webui/package.json`, `webui/package-lock.json`, `webui/tsconfig.json`, `webui/vite.config.ts`, `webui/src/main.ts`.
- `webui/src/core/DI/`, `webui/src/api/`, `webui/src/scenes/wizard/02_type/`, `webui/src/scenes/login/system-config.service.ts`.
- 원본 README·Bridge/API 문서·최근 Git 기록과 `.gitignore`. 접근하지 못한 과거 기록과 라이선스는 추정하지 않았다.

실제 확인한 반복 관례는 생성자 주입, 기능별 역할 접미사, Bridge의 입출력 경계, Repository의 데이터 보관, Service의 I/O, React에서 ViewModel 구독, Service의 런타임 응답 파싱이다. 사용자가 확정한 HTTP 클라이언트의 Service 명칭과 services/utils/config 예제 요구를 반영했다. 새로운 상태 관리·DI 프레임워크를 도입하지 않았다.

# 2. 버전 기준

모든 아래 경로는 **샘플 루트 `boilerplates/minimal/` 기준**이다. 본문의 문서 링크만 설명서 위치에서 계산한다.

| 기준 파일 | 내용과 책임 |
| --- | --- |
| `package.json` | 샘플 버전 1.0.0, ESM, Node >=24.22.1 <25, 실제 scripts와 정확한 직접 패키지 버전 |
| `package-lock.json` | npm이 생성한 전체 의존 트리·무결성·플랫폼별 선택 의존성. 손으로 작성하지 않음 |
| `.nvmrc` | 개발 Node 24.22.1 |
| `tsconfig.json` | ES2022·NodeNext·strict·react-jsx, 기본 noEmit |
| `server/tsconfig.json` | 서버 JS 출력만 dist/server로 생성 |
| `webui/vite.config.ts` | WUI 개발·프록시·dist/webui 빌드 |

Express 5.2.1, React/React DOM 19.3.0, TypeScript 7.0.2, tsx 4.23.12, Vite 8.3.5를 사용한다. Node 타입은 26.2.0이지만 실행 런타임 요구는 Node 24.x다. 새 API를 추가하면 이 런타임에서 실행 가능 여부를 확인한다. 별도의 원본 제품 manifest·버전 값은 가져오지 않았다.

원본은 양쪽 package/lockfile이 분리되어 있지만 샘플은 하나의 설치 단위로 줄였다. 원본 Vite의 허용 범위를 그대로 고정하지 않고 앞선 npm 보안 조회에서 확인한 수정 버전 8.3.5를 선택했다. 보안 점검 결과는 점검 시점 기준이며 향후 갱신 여부는 별도로 확인한다.

# 3. 폴더·파일명과 전체 역할 목록

원본 서버의 기능별 camelCase 폴더와 `.bridge.ts`·`.usecase.ts`·`.repository.ts`·`.service.ts`·`.model.ts`·`.util.ts`를 조사했다. 샘플은 단일 단어 greeting으로 축소했다. 원본 WUI의 `.page.tsx`·`.page.css`·`.viewmodel.ts`·`.model.ts`, 대문자 `core/DI/DI.ts`를 유지한다. 클래스/컴포넌트는 PascalCase, 함수는 camelCase다. 원본 서버 조립 파일명 registry.ts는 최소 함수 조립을 보여주는 core/DI.ts로 축소했으며 전역 규칙으로 강제하지 않는다.

다음 표는 **샘플의 직접 관리 파일 전체**다. node_modules·vendor·캐시·dist는 제외한다. 파일 경로는 샘플 기준이며, 연결 열은 실제 호출·참조를 뜻한다.

## 버전·설정·스크립트·문서

| 파일 | 역할·주요 책임 | 연결·사용처 |
| --- | --- | --- |
| `README.md` | 독립 설치·개발·API·검증·포트·종료 안내 | 샘플만 복사한 사용자 |
| `package.json` | 버전·의존성·scripts, private 설정 | npm ci/check/test/build/start |
| `package-lock.json` | 실제 npm 생성 설치 트리·무결성 | npm ci |
| `.nvmrc` | Node 24.22.1 지정 | nvm 등 개발 환경 |
| `.gitignore` | node_modules·dist·.env 제외 | Git·반출 파일 선별 |
| `tsconfig.json` | 서버/WUI/테스트 설정·strict 타입 검사 | check, 서버 tsconfig 상속 |
| `server/tsconfig.json` | server/src 입력을 dist/server JS로 emit | build의 tsc -p |
| `webui/vite.config.ts` | defineConfig, WUI root·출력·loopback·strictPort·API proxy | dev:webui, build |
| `scripts/copy-config.mjs` | cpSync로 server/src/config → dist/server/config 복사 | build에서 서버 tsc 뒤 실행 |
| `server/src/config/greeting.json` | 공개 기본 prefix=Hello | FileService → Repository |
| `webui/index.html` | #app DOM·main.tsx 모듈 진입점 | Vite·브라우저 |
| `webui/src/vite-env.d.ts` | vite/client 타입 및 CSS side-effect import 선언 | tsc check |

## 서버

| 파일 | 클래스·함수, 입력 → 처리 → 반환 | 호출자·사용처 |
| --- | --- | --- |
| `server/src/index.ts` | createApp 호출, port 3101 loopback 수신, 수신 오류 처리, SIGINT/SIGTERM 중복 종료 방지·close | dev:server, 빌드 후 start |
| `server/src/core/DI.ts` | createDI: FileService로 JSON 읽기 → Repository 검증/보관 → Usecase/Bridge 생성 | createApp |
| `server/src/core/web-server.ts` | createApp: Express 앱·Bridge 마운트·API 404 envelope·dist/webui 정적 제공 | index.ts, HTTP 테스트 |
| `server/src/bridge/greeting/greeting.bridge.ts` | GreetingBridge: query.name → parseName → 400 오류 또는 usecase 결과의 200 envelope | createDI → createApp |
| `server/src/bridge/greeting/greeting.usecase.ts` | GreetingUsecase.greet: 검증된 name + Repository prefix → Greeting 객체 | GreetingBridge |
| `server/src/bridge/greeting/greeting.model.ts` | Greeting: message 문자열 계약 | GreetingUsecase 반환 타입 |
| `server/src/repository/greeting/greeting.repository.ts` | GreetingRepository: unknown config의 prefix 타입/공백/길이 검증·trim 보관, getPrefix 반환 | createDI, GreetingUsecase |
| `server/src/services/file/file.service.ts` | FileService.readJson: 파일 URL → 동기 파일 읽기·JSON.parse → unknown, 오류 전파 | createDI, FileService 테스트 |
| `server/src/utils/greeting.util.ts` | parseName: unknown → 문자열 trim·1~40 UTF-16 code unit 검사 → string 또는 null, I/O 없음 | GreetingBridge, util 테스트 |
| `server/test/greeting.test.ts` | Node test: 임의 loopback 포트의 성공·400·404, 실제 WUI ViewModel/Service/Api 연결의 성공·오류 상태, util/config 검증, 임시 파일 정상·누락·파손 | npm test |

## WUI

| 파일 | 클래스·함수, 입력 → 처리 → 반환 | 호출자·사용처 |
| --- | --- | --- |
| `webui/src/main.tsx` | 렌더링 밖 createDI, #app 확인, StrictMode/DIProvider/GreetingPage 렌더 | index.html |
| `webui/src/core/DI/DI.ts` | createDI: Api → GreetingService → GreetingViewModel, Dependencies 타입 export | main.tsx, Provider 타입 |
| `webui/src/core/DI/DIProvider.tsx` | DIProvider로 Context 공급, useDI가 누락 시 throw | main.tsx, GreetingPage |
| `webui/src/core/DI/observable.ts` | Observable: getSnapshot 안정 참조, subscribe/unsubscribe, 부분 상태 병합·구독 알림 | GreetingViewModel, useSyncExternalStore |
| `webui/src/api/api.ts` | Api.get: path → /api fetch, 5초 제한·no-store·HTTP/envelope 검사 → unknown payload 또는 throw. fetch 주입 가능 | GreetingService, API 테스트 |
| `webui/src/scenes/greeting/greeting.model.ts` | GreetingState: name/message/error/loading | GreetingViewModel |
| `webui/src/scenes/greeting/greeting.service.ts` | GreetingService.greet: name URL encoding → Api 조회 → message 문자열 런타임 검사 → string | GreetingViewModel, Service 테스트 |
| `webui/src/scenes/greeting/greeting.viewmodel.ts` | GreetingViewModel: name 변경, loading 동안 중복 차단, 성공 message/실패 error 갱신, 입력 보존 | Page, ViewModel 테스트 |
| `webui/src/scenes/greeting/greeting.page.tsx` | GreetingPage: 상태 구독·Name 입력·Send submit·status/alert 표시 | main.tsx |
| `webui/src/scenes/greeting/greeting.page.css` | Greeting 화면·입력·버튼·오류·disabled 스타일 | GreetingPage import |
| `webui/test/greeting.test.ts` | Node test: URL encoding·응답 파싱·오류 envelope·중복 제출·실패 입력 보존 | npm test |

이 표 외 반출 패키지의 직접 관리 파일은 루트 README.md, project-agents.md, 이 docs/boilerplate.md다. 각각 안내·보관용 지침·전체 설명을 맡으며 샘플 실행에는 필요하지 않다.

# 4. 의존 방향과 대표 데이터 흐름

## 시작

서버 `index.ts → createApp → createDI`가 설정을 읽는다. FileService는 unknown JSON을 반환하고 Repository는 구조를 검사해 prefix를 보관한다. DI가 Repository → Usecase → Bridge를 주입한다. 설정 실패 시 수신을 시작하지 않는다. 부팅 시 작은 설정 파일을 한 번 읽는 예제라 동기 I/O를 선택했다. 요청별 파일 읽기에 확장할 경우 비동기 방식과 동시성 요구를 따로 검토한다.

WUI `index.html → main.tsx → createDI → DIProvider → GreetingPage`로 연결된다. 외부 상태의 stable snapshot을 useSyncExternalStore가 구독한다. 서비스는 React에 의존하지 않는다.

## 요청과 성공·실패

1. Page의 Send가 ViewModel.submit을 호출한다. loading이면 중복 제출을 막는다.
2. Service가 name을 encodeURIComponent로 인코딩하고 Api에 조회를 위임한다.
3. Api는 같은 origin의 `/api/greeting`에 요청한다. 개발 시 Vite proxy가 서버로 전달한다.
4. Bridge가 parseName으로 query를 검증한다. 오류이면 HTTP 400·success=false·문구를 반환한다.
5. 정상 요청은 Usecase가 Repository prefix로 Greeting 객체를 생성하고 Bridge가 200·success=true로 감싼다.
6. Api는 envelope/HTTP를, Service는 payload를 검사한다. 성공 message 또는 실패 error가 ViewModel 상태에 반영된다. Page는 role=status/alert로 표시한다. 실패 시 name·이전 message는 유지한다.

컴파일 시 타입을 양쪽에서 하나로 공유하는 별도 패키지는 없다. 서버 모델과 WUI 파서를 함께 갱신해야 한다. 데이터 타입을 공유해도 런타임 검증이 없어지는 것은 아니다.

# 5. 기능 작성 규칙

- 샘플의 greeting 기능을 하나의 기준으로 읽고 필요한 역할만 추가한다. 메모리 소유 데이터가 없으면 Repository를 만들지 않는다. HTTP 통신 클라이언트는 Service다.
- Server는 Bridge의 HTTP 검증·응답, Usecase의 업무, Repository의 데이터 소유·검증을 구분한다. 범용 I/O는 services, 순수 보조 함수는 utils에 둔다. config에는 공개 기본값만 둔다.
- WUI는 Page에서 직접 fetch하지 않고 ViewModel 명령 → Service → Api를 사용한다. model은 상태/계약, CSS는 해당 화면의 표현을 맡는다.
- constructor injection과 core 조립 지점을 재사용한다. 새로운 DI·라우팅·상태 관리 패키지는 필요가 확인될 때만 검토한다.
- 같은 기능의 endpoint·양쪽 타입·런타임 파서·호출자·테스트를 함께 수정한다. 실패를 성공으로 숨기거나 입력을 초기화하지 않는다.
- 로컬 TS 모듈 import는 NodeNext 빌드의 .js 확장자를 사용한다. 클래스/React 컴포넌트는 PascalCase, 일반 함수·메서드는 camelCase다. core/DI의 대소문자를 보존한다.
- 새 기능은 server/test 또는 webui/test에 정상·오류의 작은 검사를 추가한다. 비UI 검사를 브라우저 검사라고 보고하지 않는다.

# 6. 정확한 실행·검증 명령

작업 위치는 모두 반출 패키지의 `boilerplates/minimal/`이다. Node 24.22.1 이상 24.x·npm이 필요하며 설치에는 registry 또는 채워진 캐시, HTTP 테스트에는 로컬 소켓 권한이 필요하다.

```sh
npm ci
npm run check
npm test
npm run build
npm start
```

check는 tsc --noEmit, test는 tsx와 Node test runner, build는 check → 서버 tsc → config 복사 → WUI 번들, start는 dist/server/index.js다. lint·패키징·배포 스크립트는 없다. build는 dist/webui를 비우며 직접 관리 파일을 그 안에 두지 않는다.

개발은 터미널 1에서 `npm run dev:server`, 터미널 2에서 `npm run dev:webui`다. 각각 Ctrl+C로 종료한다. 빌드 화면 URL은 http://127.0.0.1:3101, 개발 화면은 http://127.0.0.1:5173 이다. 서버 API는 두 방식 모두 같은 서버를 사용한다.

포트 충돌 시 `server/src/index.ts`의 port와 `webui/vite.config.ts`의 proxy target을 함께 맞춘다. 개발 화면 포트는 Vite server.port를 바꾼다. 설정 변경 뒤 프로세스를 재시작하고 빌드 실행이면 재빌드한다. 임의로 다른 프로세스를 종료하지 않는다.

# 7. 보안과 변경 경계

- 이 샘플은 loopback HTTP 읽기 전용 기능이다. 인증·TLS·역할·로그·영구 저장을 생략했으며 운영 보안의 모범 구성으로 주장하지 않는다. 외부 공개 전 별도 설계가 필요하다.
- 입력은 string 단일 값·trim·길이를 검사하고 Service는 서버 응답을 검사한다. React는 결과를 텍스트로 표시하며 HTML 삽입을 사용하지 않는다. config는 시작 시 검증하고 누락·파손을 숨기지 않는다.
- 설정 파일 경로는 코드 내부 URL이며 HTTP 입력으로 경로를 받지 않는다. FileService는 읽기만 제공한다. 파일 업로드·쓰기·실행·외부 URL 요청 기능은 없다.
- config·문서·로그에 자격증명·개인값을 넣지 않는다. .env는 ignored이며 이 예제에서는 사용하지 않는다. lockfile·test·config는 포함하고 node_modules·캐시·dist는 반출하지 않는다.
- 원본 제품·업무 규칙·프로토콜·화면 순서·고정 배포 경로·자산을 일반 지침으로 옮기지 않는다. 원본 파일은 이 패키지의 실행 의존성이 아니다.
- npm 패키지의 라이선스는 각 패키지 고지를 따른다. 원본 전체의 재배포 권한은 확인하지 않았으며 새 샘플의 라이선스를 임의로 선언하지 않는다.

# 8. 새 프로젝트로 복사·치환하는 방법

문서 보관은 이 `server-wui` 유형 폴더 전체를 `02.Boilerplates/` 아래로 복사한다. 이 경우 모든 링크·실행 경로는 변경 없이 유지된다.

실제 프로젝트를 시작할 때는:

1. `boilerplates/minimal/` 내용물(숨김 파일 포함)을 새 루트로 복사하고 npm ci를 수행한다.
2. package 이름·버전과 greeting 모델·endpoint·문구·config를 제품 요구로 치환한다. package 변경 시 npm으로 lockfile을 동기화한다.
3. project-agents.md를 새 루트 AGENTS.md로 복사한다. 이 설명서를 docs/boilerplate.md로 가져온다면 AGENTS의 docs 링크는 그대로 쓰고 샘플 README 링크는 README.md로 고친다. 이 설명서의 `../boilerplates/minimal/` 링크는 `../`로 바꾸며 작업 루트 문구도 조정한다.
4. 프로젝트에 필요하지 않은 샘플 기능은 해당 호출자·DI·검사까지 함께 제거한다. 제품별 저장·권한·통신은 필요가 확인된 뒤 추가한다.
5. 복사 후 check/test/build와 UI 정상·오류를 검증한다. 반출 패키지 전체를 보관하는 경우와 새 프로젝트 배치 변경을 혼동하지 않는다.

재사용할 것은 구조·역할 분리·주입·상태 구독·검증 경계다. 기존 제품의 데이터·자격증명·업무 계약·브랜딩은 가져오지 않는다.

# 9. 예외와 검증 결과

원본과의 차이는 다음과 같다. 단일 package/lockfile, 단순 core/DI 함수, NodeNext/.js import와 dist 서버 빌드, 읽기 전용 FileService와 공개 config, 샘플 전용 추적 테스트를 추가했다. 원본의 복잡한 초기화·종료 모듈 목록·보안·장비 통신·파일 무결성·공유 화면은 가져오지 않았다. 원본에 npm test가 없다는 이유로 샘플 검사를 생략하지 않았다. 새 아키텍처로 원본을 변경한 것이 아니다.

최종 실행 기록은 아래에 갱신한다. 실제 브라우저 접근 도구는 호스트 사용 불가 오류로 연결되지 않아 UI 렌더링·Send 클릭·오류 표시의 브라우저 검증은 현재 미검증이다. 타입 검사·API 응답·ViewModel 상태 검사를 브라우저 동작 확인으로 표현하지 않는다. 다른 OS/CPU 및 배포 검증도 하지 않는다.

## 이번 반출본의 검증 기록

- 확인일: 2026-10-28. 실행 환경: macOS 13.7.8 (Darwin), x86_64, Node v24.22.1, npm 11.19.1. Node는 셸 PATH에서 해당 버전을 선택해 실행했다. 개인 경로는 패키지에 기록하지 않았다.
- 잠금 생성: 샘플 루트에서 `npm install --package-lock-only --offline --ignore-scripts --cache <검증용 캐시>`로 실제 npm 생성 package-lock.json을 만들었다. 임의로 lockfile을 작성하지 않았다.
- 유형 폴더 전체를 임시 위치로 복사했다. 그 복사본에서 모든 Markdown 상대 링크 존재·코드 펜스 짝·JSON 파싱·설명서 전체 파일 목록과 실제 샘플 파일의 일치를 확인했다.
- 복사본의 샘플 루트에서 `npm ci --offline --cache <검증용 캐시>`로 설치 복원을 확인했다. registry에서 이미 받은 npm 캐시만 재사용했고 상위 node_modules·소스는 사용하지 않았다. 일반 설치 안내는 `npm ci`다. 설치 시 esbuild/fsevents의 미승인 install-script 경고가 있었지만 플랫폼 패키지로 현재 환경의 검사·빌드는 통과했다. 다른 플랫폼에서는 해당 의존성 설치 정책을 확인해야 한다.
- `npm test`: **6개 통과**. 실제 HTTP 정상·잘못된 요청·404와 WUI 상태→Service→Api→서버→결과/오류 상태, util/config/FileService 오류, API 응답 검증, 중복 제출·실패 입력 보존을 확인했다.
- `npm run build`: 전체 타입 검사, 서버 JS와 config 복사, Vite 번들 통과.
- `node dist/server/index.js`(npm start의 실제 진입 명령)로 기동해 API·HTML·생성 JS/CSS 파일 제공을 확인했다. SIGTERM 종료 코드 0을 확인했다.
- `npm run dev:server`, `npm run dev:webui`를 별도 프로세스로 기동해 개발 HTML과 Vite `/api` 프록시를 확인했고 SIGINT로 둘 다 종료했다. 임시 폴더·설치·빌드 파일은 정리했다.
- `git diff --check` 및 9절 설명서·6절 지침 구조 검사를 수행했다. 반출 폴더에는 node_modules·캐시·dist를 남기지 않았다. 원본 루트 README·AGENTS·제품 소스·package/lockfile·배포 설정은 이번 작업에서 수정하지 않았다.
- 브라우저 실제 검증은 Computer Use의 브라우저 호스트 사용 불가 오류로 미실행이다. GUI 확인 성공을 주장하지 않는다. Linux/Windows·다른 CPU·외부 배포도 미검증이다.
