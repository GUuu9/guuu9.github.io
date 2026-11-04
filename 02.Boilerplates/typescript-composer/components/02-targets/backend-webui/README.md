<!-- version: v0.1.2 -->
# backend-webui 구성품

기준 backend에 frontend 구성품을 붙인 프로젝트를 같은 HTTP 주소에서 API와 화면을 제공하는 `backend-webui`로 전환합니다. frontend의 `dist/frontend` 빌드와 `src/backend` 배치가 선행 조건입니다. Express는 기준 뼈대에 있어 추가 npm 패키지는 없습니다.

## 1. 파일 복사

`files/`의 내용물을 대상 프로젝트 루트에 복사합니다. 기존 파일이 있으면 비교·병합합니다.

```text
files/src/backend/core/frontend.ts → src/backend/core/frontend.ts
files/test/frontend-serving.test.ts → test/frontend-serving.test.ts
files/docs/05-backend-webui.md       → docs/05-backend-webui.md
```

macOS·Linux에서는 실제 경로로 바꿔 실행합니다. Windows는 파일 탐색기로 같은 대응으로 복사할 수 있습니다.

```bash
cp -R /path/to/components/02-targets/backend-webui/files/. /path/to/my-project/
cd /path/to/my-project
```

## 2. HTTP 연결

`src/backend/core/web-server.ts`에 import를 추가합니다.

```typescript
import { createFrontendRouter } from './frontend.js';
```

기존 `app.use(greetingBridge.path, greetingBridge.router)` 다음의 전체 경로 404 처리 부분을 아래로 바꿉니다. 기존 공통 500 handler는 이 코드 아래에 유지합니다.

```typescript
app.use('/api', (_request, response) => {
  response.status(404).json({ success: false, payload: 'API not found.' });
});
app.use(createFrontendRouter());
app.use((_request, response) => {
  response.status(404).json({ success: false, payload: 'Not found.' });
});
```

연결 순서는 API Router → API 전용 404 → frontend 정적 제공 → 나머지 404 → 기존 500 handler입니다. API 오류가 화면 HTML로 바뀌지 않습니다. 현재 화면은 클라이언트 라우팅을 사용하지 않으므로 SPA fallback은 추가하지 않습니다. 없는 화면·자산은 404로 유지합니다.

정적 경로는 실행 파일 기준으로 찾아 cwd에 의존하지 않습니다. 빌드된 `dist/backend/core/frontend.js`가 `dist/frontend`를 제공합니다. Node 소스·config·.env가 들어 있는 상위 디렉터리를 정적 경로로 설정하지 않습니다. index가 없으면 앱 조립 시 실패합니다.

## 3. 빌드·확인

frontend 설치 문서의 scripts를 추가한 상태에서 조합 빌드 명령을 등록합니다. 기존 backend build는 유지합니다.

```bash
npm pkg set 'scripts.build:backend-webui=npm run build && npm run build:frontend'
npm run build:backend-webui
npm run check
npm test
npm run test:frontend
npm start
```

개발 중 Vite와 backend를 나눠 실행하는 흐름은 기존 frontend 문서를 따릅니다. 완성된 화면 제공 확인은 위처럼 빌드 후 npm start로 진행합니다. frontend 변경 후에는 다시 빌드합니다.

다른 터미널에서 같은 주소의 화면·자산·API를 확인합니다.

```bash
curl -I http://127.0.0.1:3101/
curl 'http://127.0.0.1:3101/api/greeting?name=World'
curl -i http://127.0.0.1:3101/api/missing
curl -i http://127.0.0.1:3101/assets/missing.js
```

브라우저에서 `http://127.0.0.1:3101`에 접속하고 입력·응답·오류를 확인합니다. 종료는 실행 터미널의 Ctrl+C입니다. API 상대 경로가 같은 backend로 연결되어 운영 시 Vite 프록시가 필요하지 않습니다.

## 4. 배포·보존·제거

배포 묶음에 `dist/backend`, `dist/frontend`, package.json·package-lock.json·.nvmrc를 함께 보관합니다. 대상 환경의 같은 Node에서 `npm ci --omit=dev` 후 npm start로 실행합니다. frontend 정적 파일은 빌드 산출물이어서 Vite 실행이 필요하지 않습니다. 현재 loopback 바인딩·인증·TLS 범위는 기준 backend와 같습니다. 외부 운영 배포는 별도 운영 구성이 필요합니다.

업데이트 전 정상 dist 전체·잠금 파일·실행 설정을 보관하고 새 릴리스 디렉터리에 빌드·배포합니다. 복귀 시 backend와 frontend를 같은 릴리스 단위로 되돌립니다. 사용자 데이터 쓰기는 추가하지 않습니다.

제거 시 정적 제공 import·등록을 해제하고 기본 전체 404를 복구합니다. 추가 build:backend-webui script와 구성품 소스·테스트·문서를 제거합니다. 다른 frontend 구성도 쓰는 화면·패키지는 유지하고 사용자 변경 파일은 먼저 보관합니다.

조합 완료 후 프로젝트 README에 결과 명칭·시작·문서 링크를, project-agents.md에 정적 제공 경계와 빌드·검사 명령을, update.md에 연결 변경·검증·복귀를 기록합니다.

공식 근거: [Express 정적 파일 제공](https://expressjs.com/en/starter/static-files.html). 실제 브라우저·외부 운영 배포·Windows/Linux 실행은 미검증입니다.

## 5. 검증 기록

2026-11-04, macOS 13.7.8 x64·Node 24.22.1에서 새 임시 프로젝트에 기준 뼈대 → frontend → backend-webui 파일을 복사하고 문서의 연결 변경을 적용했습니다. 조합 manifest·잠금 파일로 오프라인 npm ci, 양쪽 타입 검사·빌드, backend 테스트 5개·frontend 테스트 4개를 통과했습니다.

빌드된 서버를 다른 cwd에서 실행해 화면 HTML·JS/CSS 자산·API 정상/400/404, 없는 화면·자산·숨김 파일·backend config 미노출과 SIGTERM 정상 종료를 확인했습니다. 실제 브라우저 조작·설치 패키지·원격 운영 배포·다른 OS는 미검증입니다. npm의 esbuild·fsevents 설치 스크립트 미승인 경고는 남아 있습니다.
