<!-- version: v1.1.1 -->
# Minimal Server-WUI

Express 서버와 React 화면의 독립 실행 예제다. Name 입력 → Send → HTTP 조회 → 결과 또는 오류 표시를 제공한다. services·utils·config 예제도 포함한다. 이 디렉터리만 복사해 사용할 수 있으며 상위 소스·node_modules·운영 계정은 필요하지 않다.

## 필요한 환경과 버전

Node 24.22.1 이상 24.x와 npm이 필요하다. 개발 Node는 `.nvmrc`, 샘플 버전은 `package.json`의 1.0.1, 설치 버전은 npm이 생성한 `package-lock.json` 기준이다. TypeScript 7.0.2, Express 5.2.1, React 19.3.0, Vite 8.3.5를 사용한다. 별도 SDK·DB·전역 빌드 도구는 필요하지 않다. macOS x86_64에서 검증하며 Linux·Windows/다른 CPU는 미검증이다. npm의 플랫폼별 Vite 의존성 설치가 필요하다.

## 복사·설치·빌드 실행

이 디렉터리 전체를 새 빈 폴더로 복사한다. 숨김 파일과 lockfile을 포함하고 node_modules·dist는 제외한다. 모든 명령은 복사한 샘플 루트에서 실행한다.

```sh
npm ci
npm run check
npm test
npm run build
npm start
```

http://127.0.0.1:3101 에 접속한다. Greeting 제목과 Name 필드의 `World`, Send 버튼이 표시된다. Send 클릭 시 `Hello, World!`, 빈 이름 전송 시 `Name must contain 1–40 characters.` 오류가 표시된다. 요청 실패 시 입력은 유지된다.

종료는 터미널에서 Ctrl+C다. 서버는 SIGINT/SIGTERM에서 수신을 닫는다. 빌드 산출물은 dist/server와 dist/webui다. 빌드 실행 서버는 source 파일을 참조하지 않고 dist의 config를 읽는다.

## 개발 실행과 종료

터미널 1에서:

```sh
npm run dev:server
```

터미널 2에서:

```sh
npm run dev:webui
```

http://127.0.0.1:5173 에 접속한다. `/api` 요청은 Vite가 127.0.0.1:3101로 전달한다. 각 터미널에서 Ctrl+C로 종료한다. 두 서버 모두 loopback 전용이다. 브라우저에서 file://로 HTML을 열지 않는다.

## 포트 충돌과 변경

- 서버 포트: `server/src/index.ts`의 `port = 3101`을 변경하고 `webui/vite.config.ts`의 proxy target 포트도 같은 값으로 바꾼다. 서버·Vite를 재시작한다. 빌드 모드에서는 재빌드 후 변경된 서버 포트로 접속한다.
- 개발 화면 포트: `webui/vite.config.ts`의 `server.port = 5173`을 변경하고 Vite를 재시작한 뒤 그 URL로 접속한다. API target은 서버 포트를 유지한다.
- strictPort로 인해 개발 화면 포트 충돌 시 조용히 다른 포트로 넘어가지 않고 실패한다. 사용 중인 다른 프로세스를 임의 종료하지 않는다.

## 명령과 테스트

| 명령 | 실제 역할 |
| --- | --- |
| `npm ci` | lockfile 기반 의존성 복원 |
| `npm run check` | 서버·WUI·테스트·Vite 설정 타입 검사 |
| `npm test` | 실제 HTTP 정상·입력 오류·404, FileService/config/util, Service/API 파싱, 상태·중복 제출·실패 시 입력 보존 검사 |
| `npm run build` | 타입 검사 → 서버 JS 생성 → config 복사 → Vite 번들 |
| `npm start` | 빌드 서버와 정적 WUI 제공 |
| `npm run dev:server` | tsx watch 서버 |
| `npm run dev:webui` | Vite 개발 화면·API 프록시 |

테스트는 server/test·webui/test에 있고 Node test runner와 tsx를 사용한다. 로컬 임의 포트에서 테스트 서버를 실행한다. 설치에는 npm registry 또는 채워진 npm 캐시가 필요하다. 로컬 소켓을 금지하는 환경에서는 HTTP/tsx 검사가 차단될 수 있다.

## API 확인

```sh
curl 'http://127.0.0.1:3101/api/greeting?name=World'
curl -i 'http://127.0.0.1:3101/api/greeting?name='
```

정상 HTTP 200:

```json
{"success":true,"payload":{"message":"Hello, World!"}}
```

빈 값·공백·중복 name·40자 초과는 HTTP 400:

```json
{"success":false,"payload":"Name must contain 1–40 characters."}
```

없는 API는 404다. 요청 처리 중 예상하지 못한 예외는 서버 로그에 기록하고 HTTP 500과 `{"success":false,"payload":"Internal server error."}`를 반환한다. 내부 오류 상세는 응답에 포함하지 않는다. WUI HTTP 제한 시간은 5초다.

## Services·Utils·Config의 연결

`server/src/config/greeting.json`의 prefix는 공개 기본값이다. FileService가 부팅 시 JSON을 읽고 GreetingRepository가 구조를 검증·보관한다. Bridge는 utils의 parseName으로 입력을 정규화·검증하고 Usecase는 Repository prefix로 인사말을 반환한다. config 변경은 재시작 후 반영한다. 파일 누락·파손·잘못된 prefix는 시작 실패이며 자동 복구하지 않는다. 빌드는 config를 dist에 복사한다.

FileService는 I/O, util은 I/O 없는 함수, Repository는 데이터 소유·검증, Usecase는 결과 생성, Bridge는 HTTP 경계다. WUI의 Page는 구독·이벤트, ViewModel은 상태·비동기 흐름, Service는 endpoint·응답 검증, Api는 fetch·공통 envelope 검증이다.

## 독립 범위와 제외 사항

HTTP 읽기 전용 로컬 예제다. 인증·TLS·세션·영구 쓰기·외부 DB는 없다. 운영용 서버 설정을 대신하지 않는다. 단일 package와 dist 출력, NodeNext의 `.js` import, 서버 config 복사·추적 테스트는 독립 예제를 위한 선택이다.

## 검증 상태

2026-10-28, macOS 13.7.8 (Darwin), x86_64, Node v24.22.1·npm 11.19.1에서 유형 폴더 전체를 임시 위치로 복사해 검증했다. 복사본 샘플에서 npm ci(검증 캐시 사용), 테스트 6개, 타입 검사·빌드를 통과했다. 실제 클라이언트 상태→API→서버→성공/오류 상태, 빌드 서버의 API·HTML·JS/CSS 제공, 개발 모드 프록시, SIGTERM/SIGINT 종료를 확인했다. npm 설치에 esbuild/fsevents install-script 승인 경고가 있었지만 현재 플랫폼의 빌드·실행은 통과했다. 다른 플랫폼 설치 시 해당 정책을 확인한다.

브라우저 접근 호스트가 사용 불가여서 실제 화면 렌더링·클릭·오류 표시의 GUI 검증은 하지 못했다. HTTP·비UI 검사로 화면 확인을 대신했다고 주장하지 않는다. Linux·Windows와 다른 CPU는 미검증이다. 이 README의 실행 안내에는 상위 문서가 필요하지 않다.

## 이번 문서 보완 범위

유형 폴더의 설명서에 실제 폴더·계층 대응, 허용·금지 의존, 조립·수명주기, 정상·오류 흐름과 구조도·요구사항 대조표를 보완했다. 샘플 실행 코드·의존성·설정은 변경하지 않았다. 위 실행 기록은 기존 검증 결과이며 이번 문서 수정으로 새 브라우저·플랫폼 실행을 검증한 것은 아니다.

## 오류 처리 보강 검증 (2026-10-28)

독립 복사본에서 Node 24.22.1·npm 11.19.1로 캐시 기반 npm ci, 테스트 7개, 타입 검사·빌드를 통과했다. 공통 500 응답의 내부 상세 비노출, 통신 실패 후 입력 보존·loading 해제·재시도, 비JSON 응답 거부를 검사했다. 타임아웃은 오류 주입으로 검사했으며 실제 5초 경과·브라우저·다른 OS는 이번에 검증하지 않았다.

## 보안·버전 점검 (2026-10-29)

앱 package 버전은 1.0.1입니다. 독립 복사본에서 npm ci·테스트(7개)·타입 검사·빌드를 통과했고 전체 의존성 npm audit는 보고된 취약점 0건입니다. 이는 점검 시점의 알려진 npm 공지 기준이며 모든 보안 문제의 부재를 의미하지 않습니다. 실행 기준에 맞춰 Node 타입을 24.19.2로 정렬했고 나머지 직접 의존성은 유지했습니다. 실제 브라우저·다른 OS는 이번에 확인하지 않았습니다. 버전 변경 이유·적용/복귀는 유형 폴더의 update.md에서 관리합니다.
