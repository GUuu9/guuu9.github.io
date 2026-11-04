<!-- version: v0.2.0 -->
# Socket.IO 통신 구성품

기준 뼈대에 Socket.IO 서버를 추가합니다. HTTP 서버에 연결해 polling·WebSocket 이벤트를 받고 같은 GreetingUsecase를 호출합니다. Socket.IO 전용 client가 필요하며 일반 WebSocket client와 직접 호환되지 않습니다. 통신 공통 메시지 구성품은 필수가 아닙니다. 여기서는 Socket.IO의 객체 입력을 기존 parseName으로 직접 검증합니다.

## 1. 파일·패키지 연결

files 내용을 가져온 프로젝트 루트에 복사하고 기존 파일은 비교·병합합니다.

```text
files/src/backend/core/socket-io.ts → HTTP 서버에 이벤트 등록
files/src/backend/socket-io.ts      → 별도 서버 진입점
files/test/socket-io.test.ts        → 실제 client 왕복·오류·종료 검사
files/docs/12-socket-io.md          → 프로젝트 안에서 읽는 설명
```

프로젝트 루트·.nvmrc의 Node 환경에서 실행합니다. 버전은 공식 Socket.IO 설치 문서와 npm에서 확인한 4.8.4로 고정합니다. 잠금 파일은 대상 프로젝트에서 갱신합니다.

```bash
npm install --save-exact socket.io@4.8.4
npm install --save-dev --save-exact socket.io-client@4.8.4
npm pkg set 'scripts.dev:socket-io=tsx watch src/backend/socket-io.ts' 'scripts.start:socket-io=node dist/backend/socket-io.js'
npm run check
npm test
npm run build
npm run start:socket-io
```

별도 진입점은 127.0.0.1:3104에서 HTTP API와 /socket.io 연결을 함께 제공합니다. 종료는 Ctrl+C입니다. Express 앱에 app.use로 Socket.IO를 등록하는 방식이 아니라 Node HTTP server에 attach합니다.

## 2. 이벤트와 client 사용

client의 greeting 이벤트 객체 `{ name: 'World' }` → 입력 검증 → greetingUsecase.greet → acknowledgement 순서입니다. 성공은 `{ success: true, payload: { message: 'Hello, World!' } }`, 실패는 `{ success: false, payload: '설명' }`입니다. 응답 callback이 없는 요청은 처리하지 않습니다. 내부 예외 상세는 로그에만 남깁니다.

Node에서 연결을 빠르게 확인할 수 있습니다. 실행 위치는 패키지를 설치한 프로젝트 루트입니다.

```bash
node --input-type=module -e 'import { io } from "socket.io-client"; const socket = io("http://127.0.0.1:3104"); try { console.log(await socket.timeout(5000).emitWithAck("greeting", { name: "World" })); } finally { socket.disconnect(); }'
```

브라우저 frontend에서 사용하면 socket.io-client를 runtime 의존성으로 설치합니다.

```bash
npm install --save-exact socket.io-client@4.8.4
```

frontend의 apis에서 io(서버주소)를 만들고 이벤트 전송·ack timeout·응답 envelope 검증을 처리합니다. DI에서 기능 Service에 전달하며 화면·게임은 socket을 직접 생성하지 않습니다. 공개 서버 주소는 해당 웹 조합의 .env.example 양식과 실제 로딩 코드로 연결합니다. 구독을 추가하면 동일한 handler로 off하고 화면/앱을 해제할 때 disconnect합니다.

client는 기본 재연결을 제공하지만 서버가 명시적으로 끊거나 종료된 경우의 재시도와 요청 재전송 정책은 앱에서 정해야 합니다. 이 읽기 전용 샘플은 세션 복구·영구 큐·중복 제거·room·namespace·로그인을 추가하지 않습니다. 상태 변경 이벤트에는 요청 ID·중복 처리 정책을 별도로 정의합니다.

## 3. 기존 HTTP 서버에 함께 연결

backend-webui 등 기존 HTTP 주소를 사용하려면 별도 socket-io.ts를 실행하지 않고 원래 진입점의 서버 생성·종료를 다음 구조로 변경합니다.

```typescript
import { createServer } from 'node:http';
import { createDI } from './core/di.js';
import { createApp } from './core/web-server.js';
import { attachGreetingSocketIo } from './core/socket-io.js';

const dependencies = createDI();
const server = createServer(createApp(dependencies));
const io = attachGreetingSocketIo(server, dependencies.greetingUsecase, [
  'http://127.0.0.1:3101',
  'http://127.0.0.1:5173',
]);
server.listen(3101, '127.0.0.1');
```

기존 진입점의 error listener·중복 종료 방지는 유지하고, 종료에서 server.close 대신 io.close(callback)를 호출합니다. io.close는 client 연결과 연결된 HTTP 서버도 닫으므로 둘을 중복 종료하지 않습니다. 실제 오류·종료 처리 예시는 backend/socket-io.ts에 있습니다. 해당 진입점을 빌드·실행해 기존 화면·API와 Socket.IO를 함께 확인합니다.

## 4. Origin·운영·보존

기본 허용 Origin은 127.0.0.1의 5173·3104 주소입니다. 실제 frontend의 scheme·host·port를 allow 목록에 명시합니다. allowRequest로 polling뿐 아니라 WebSocket handshake도 검사합니다. Origin이 없는 Node/native client는 허용하므로 이 검사는 사용자 인증이 아닙니다. 원격 공개 시 로그인·권한·속도/연결 제한·TLS를 추가합니다. payload 상한은 4096바이트이며 초과하면 연결이 끊길 수 있습니다.

다른 출처의 브라우저는 허용 Origin을 맞춰야 합니다. web-app의 API URL 설정은 HTTP 호출용이므로 Socket.IO 서버 주소에 자동 적용되지 않습니다. 역방향 프록시는 /socket.io polling·Upgrade 경로를 유지해야 하고, 여러 서버로 늘리면 adapter·sticky session 조건을 검토합니다. Electron에서 연결할 때도 원격 주소·권한·CSP connect-src를 명시적으로 구성합니다.

사용자 데이터 쓰기는 없습니다. 업데이트 전 정상 소스·manifest·lock·서버/프록시 설정을 보관하고 client/server 이벤트 계약을 함께 확인합니다. 제거는 실행 종료 → attach와 종료 handler 해제 → 추가 scripts·파일·테스트·설정 제거 → 미사용 socket.io와 socket.io-client를 npm uninstall 하는 순서입니다. 다른 기능의 client 의존성은 유지합니다.

README·project-agents.md·update.md에 추가한 포트·Origin·이벤트·실행·검증·복귀를 기록합니다. 실제 인증정보는 프로젝트 .env에 두고 Git에서 제외하며 공개 frontend 설정에 넣지 않습니다.

공식 근거: [설치](https://socket.io/docs/v4/server-installation/), [서버 설정](https://socket.io/docs/v4/server-options/), [종료 API](https://socket.io/docs/v4/server-api/#serverclosecallback), [client options](https://socket.io/docs/v4/client-options/).

## 검증 기록 — 2026-11-04

macOS 13.7.8 x64·Node 24.22.1의 새 임시 프로젝트에 기준 뼈대와 files를 복사하고 Socket.IO/server client 4.8.4를 설치했습니다. 타입 검사·빌드, 기존 테스트 3개와 Socket.IO 통합 테스트 2개를 통과했습니다. 실제 polling·WebSocket ack 왕복, 허용/거부 Origin, 잘못된 입력·크기 제한·내부 오류 상세 비노출·응답 callback 누락·HTTP API 유지·client 정리를 확인했습니다.

빌드된 별도 진입점의 HTTP 정상/404·포트 충돌·SIGINT/SIGTERM 종료도 확인했습니다. npm 설치 감사는 0건이었고 기존 esbuild·fsevents 설치 스크립트 미승인 경고는 남았습니다. 실제 브라우저·역방향 프록시·TLS·로그인·다중 노드·부하·Windows/Linux는 미검증입니다.

## 기능 버전

구현·연결 계약 초기 관리 버전: 0.1.0 (2026-11-05). 문서 version과 별개이며 전체 조합 검증 완료를 뜻하지 않습니다. 변경 시 Composer의 버전·업데이트 규칙에 따라 변경점·호환 조건·검증·이행/복귀를 함께 기록합니다.
