<!-- version: v0.1.3 -->
# 일반 frontend 구성품

기준 뼈대의 HTTP 인사말 기능에 연결하는 React 화면입니다. 화면·ViewModel·Service·Api·DI와 Vite 설정을 제공합니다. 기준 `typescript-backend`의 `src/backend` 배치와 backend 전용 TypeScript include 설정이 선행되어야 합니다.

## 1. 복사

`files/`의 내용물을 가져온 프로젝트 루트에 복사합니다. 같은 이름의 파일이 있으면 비교·병합합니다. 구성품 원본과 기준 뼈대는 보관하고 새 프로젝트에서 작업합니다.

```text
files/src/frontend/              → 프로젝트/src/frontend/
files/test/frontend/             → 프로젝트/test/frontend/
files/vite.config.ts             → 프로젝트/vite.config.ts
files/tsconfig.frontend.json      → 프로젝트/tsconfig.frontend.json
files/docs/04-frontend.md         → 프로젝트/docs/04-frontend.md
```

macOS·Linux의 예시입니다. 빈 대상 경로인지 확인한 뒤 실제 경로로 바꿉니다. Windows는 파일 탐색기에서 같은 대응으로 복사할 수 있습니다.

```bash
cp -R /path/to/components/01-base/frontend/files/. /path/to/my-project/
cd /path/to/my-project
```

## 2. 패키지와 명령 연결

현재 구성품의 고정 버전을 사용합니다. 프로젝트의 `.nvmrc` Node 환경에서 설치하며 npm이 이 프로젝트의 잠금 파일을 갱신하게 합니다. 다른 프로젝트의 package.json·잠금 파일을 덮어쓰지 않습니다.

```bash
npm install --save-exact react@19.3.0 react-dom@19.3.0
npm install --save-dev --save-exact vite@8.3.5 @types/react@19.3.0 @types/react-dom@19.3.0
npm pkg set 'scripts.dev:frontend=vite --config vite.config.ts'
npm pkg set 'scripts.check:frontend=tsc --noEmit -p tsconfig.frontend.json'
npm pkg set 'scripts.test:frontend=tsx --test test/frontend/*.test.ts'
npm pkg set 'scripts.build:frontend=npm run check:frontend && vite build --config vite.config.ts'
```

기존 backend 명령은 유지합니다.

## 3. 연결과 확인

`main.tsx` → `core/DI` → GreetingViewModel → GreetingService → `apis/Api` → `/api/greeting` → backend의 HTTP Bridge → Usecase 순서로 연결됩니다. 입력·실패·로딩 상태는 ViewModel, HTTP 응답 검증은 Api·Service가 처리합니다.

첫 터미널에서 backend를 시작합니다.

```bash
npm run dev
```

두 번째 터미널도 같은 프로젝트·Node 환경에서 frontend를 시작합니다.

```bash
npm run dev:frontend
```

브라우저에서 `http://127.0.0.1:5173`에 접속해 이름을 입력합니다. Vite의 `/api` 프록시가 `127.0.0.1:3101`로 전달합니다. backend 포트를 바꾸면 vite.config.ts의 프록시 대상도 맞춥니다. 환경 변수는 현재 구성품에서 추가하거나 자동으로 읽지 않습니다. 각 터미널의 Ctrl+C로 종료합니다.

```bash
npm run check
npm test
npm run check:frontend
npm run test:frontend
npm run build
npm run build:frontend
curl 'http://127.0.0.1:5173/api/greeting?name=World'
```

frontend 출력은 `dist/frontend`입니다. backend 출력과 분리하므로 frontend 빌드가 backend를 지우지 않습니다. 프록시는 개발 서버에서만 적용됩니다. 이 단계는 개발 화면 연결까지이며 backend의 정적 화면 제공과 운영 배포는 다음 구성품에서 연결합니다.

## 4. 파일과 수정 지점

- `src/frontend/core/DI`: 기능 객체 생성·주입. Api 구현을 교체할 때 이곳을 수정합니다.
- `scenes/greeting`: 화면·Model·ViewModel·Service. 새 기능은 같은 기능 단위로 추가합니다.
- `apis/api.ts`: HTTP 호출·오류·응답 envelope 검증. Renderer에서 Node 코드를 import하지 않습니다.
- `vite.config.ts`: 개발 주소·프록시·frontend 출력. `tsconfig.frontend.json`은 DOM과 JSX를 포함한 독립 검사입니다.
- `test/frontend`: Service·Api·ViewModel의 정상·오류·재시도 검사입니다.

제거할 때 frontend 실행을 종료하고 추가한 npm scripts·frontend 파일·설정·테스트를 제거합니다. 다른 구성품도 쓰는 패키지는 남기고, 미사용 패키지만 `npm uninstall`로 제거합니다. 사용자 자산·변경 코드는 먼저 보관합니다.

공식 근거: [Vite 개발 프록시](https://vite.dev/config/server-options.html#server-proxy), [Vite 빌드](https://vite.dev/guide/build.html). 이 구성품은 실제 브라우저·Windows/Linux 실행을 검증한 상태가 아닙니다.

## 5. 검증 기록

2026-11-04, macOS 13.7.8 x64·Node 24.22.1에서 기준 뼈대와 files를 별도 임시 폴더에 복사하고 문서의 패키지·scripts 연결을 적용했습니다. backend·frontend 타입 검사와 빌드, backend 테스트 3개·frontend 테스트 4개, Vite 페이지·모듈 응답과 프록시 정상·400·404를 확인했습니다. 원본 구성품 밖으로 runtime 참조는 없습니다. 실제 브라우저 조작·정적 운영 배포·다른 OS는 미검증입니다. npm의 esbuild·fsevents 설치 스크립트 미승인 경고가 남았습니다.
