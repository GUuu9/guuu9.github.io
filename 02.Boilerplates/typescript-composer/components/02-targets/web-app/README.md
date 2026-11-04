<!-- version: v0.1.0 -->
# web-app 구성품

frontend 구성품을 적용한 프로젝트를 정적 웹 호스팅에 배포하는 구성입니다. 새 npm 패키지는 추가하지 않습니다. Node는 개발·빌드에 사용하고 배포 결과는 `dist/frontend`의 HTML·JS·CSS입니다.

## 1. 파일 적용

frontend 구성품을 먼저 복사·설치합니다. 이 구성품의 `files/`를 대상 프로젝트에 적용합니다. 기존 Api·DI·Vite 파일은 변경점을 비교해 병합하고 사용자 기능은 보존합니다. `.env.example`은 기존 양식에 내용을 합칩니다.

```text
files/src/frontend/apis/api.ts      → API 기준 주소를 받는 HTTP 호출
files/src/frontend/core/DI/DI.ts     → 공개 설정을 Api에 주입
files/vite.config.ts                → 루트 env 로딩·상대 자산 경로
files/.env.example                  → 공개 API 주소 양식 병합
files/test/frontend/web-api.test.ts → 기준 주소 연결 검사
files/docs/05-web-app.md            → 반입 프로젝트용 설치·배포 설명
```

파일은 탐색기나 편집기로 위 경로에 적용합니다. 외부 구성품 폴더는 완료 프로젝트의 실행에 필요하지 않습니다. backend-webui 구성품은 이 조합의 선행 조건이 아닙니다.

## 2. 설정과 빌드 연결

프로젝트 루트의 `.env.example` 내용을 Git 제외 `.env`에 적용합니다. 기존 .env가 있다면 필요한 키만 추가합니다.

```bash
cp .env.example .env
npm pkg set 'scripts.build:web=npm run build:frontend'
npm pkg set 'scripts.preview:web=vite preview --config vite.config.ts --host 127.0.0.1 --port 4173 --strictPort'
```

`cp`는 .env가 없는 새 프로젝트에서 실행합니다. Windows PowerShell은 `Copy-Item .env.example .env`로 복사할 수 있습니다. 실제 API 주소를 선택합니다.

```bash
# 같은 출처에서 API를 제공하거나 프록시하는 환경
VITE_API_BASE_URL=/api
# 별도 API를 사용하는 경우의 예시 값
# VITE_API_BASE_URL=https://api.example.com/api
```

값은 frontend DI → Api의 baseUrl → 기능별 요청 경로 순서로 연결됩니다. 개발 기본값은 `/api`이며 Vite 개발 프록시를 사용할 수 있습니다. 배포에서는 개발 프록시가 없어지므로 같은 출처 API 경로를 운영 환경에서 제공하거나 실제 HTTPS API 주소를 설정합니다. 예시 주소는 실제 서비스 주소로 바꿉니다.

별도 API 출처는 backend가 배포된 웹 출처에 대한 CORS·인증 정책을 제공해야 합니다. 현재 기준 backend는 CORS가 구현되어 있지 않습니다. 외부 API 연결은 해당 정책을 추가한 후 브라우저에서 확인합니다. 쿠키 인증은 이 구성품에서 추가하지 않습니다.

VITE_ 값은 빌드 결과에 공개됩니다. 비밀 키를 넣지 않습니다. 값을 변경하면 개발 서버 재시작 또는 배포용 재빌드가 필요합니다. 환경 파일을 선언하는 것만으로 운영 중인 JS가 바뀌지 않습니다.

```bash
npm run check:frontend
npm run test:frontend
npm run build:web
npm run preview:web
```

`http://127.0.0.1:4173`에서 빌드된 화면·자산을 확인합니다. preview는 로컬 확인용이며 API 프록시와 운영 서비스 기능을 제공하지 않습니다. API가 준비되지 않으면 인사말 요청은 오류를 표시합니다. 종료는 Ctrl+C입니다.

## 3. 정적 호스팅 배포

배포 대상은 `dist/frontend` 전체입니다. src/backend·Node 실행 파일·.env·node_modules는 업로드하지 않습니다. 빌드 명령은 `npm run build:web`, 출력 디렉터리는 `dist/frontend`, Node는 프로젝트 .nvmrc 기준입니다. frontend를 바꾸거나 공개 API 주소를 바꾼 경우 새로 빌드합니다.

Cloudflare Pages를 선택하면 기존 프로젝트를 연결하는 Git 배포에서 프로젝트 루트·빌드 명령·출력 경로·Node 버전·공개 API 환경 변수를 위 기준으로 설정합니다. 플랫폼의 기본 dist 값을 그대로 사용하지 않습니다. 실제 배포는 계정과 대상 프로젝트를 정한 뒤 진행합니다. 현재 구성품은 Pages Functions·Workers API를 포함하지 않습니다.

이 샘플은 클라이언트 라우터를 사용하지 않습니다. 추후 라우터를 넣으면 호스팅의 화면 fallback과 API·없는 자산의 오류 경계를 함께 설정합니다. `base: './'`로 자산 경로를 생성하며 실제 배포 경로에서 로딩을 확인합니다.

서비스 사용자 브라우저 최소 기준은 사용하는 Vite의 빌드 대상과 React 및 Web API를 함께 검토합니다. 특히 현재 Api는 AbortSignal.timeout을 사용합니다. 실제 브라우저별 검증 최저·최고 및 OS 지원 범위는 아직 미확정이며 빌드 성공을 지원 보장으로 해석하지 않습니다.

## 4. 프로젝트 정리·갱신·복귀

정적 웹 앱만 보관하려면 에디터에서 src/backend·backend 전용 test/*.test.ts·tsconfig.build.json·scripts/copy-config.mjs·backend 전용 설명을 정리합니다. backend-webui를 먼저 적용했다면 정적 제공 코드·테스트도 함께 제외합니다. 수정한 기능과 사용자 데이터는 먼저 보관합니다.

```bash
npm uninstall express
npm uninstall --save-dev @types/express
npm pkg set 'scripts.dev=npm run dev:frontend' 'scripts.check=npm run check:frontend' 'scripts.test=npm run test:frontend' 'scripts.build=npm run build:web'
npm pkg delete scripts.start scripts.build:backend-webui
```

기본 tsconfig.json은 다음처럼 frontend 설정을 이어받습니다.

```json
{
  "extends": "./tsconfig.frontend.json"
}
```

 frontend 빌드 도구로 쓰는 Node 타입·tsx·TypeScript·Vite는 유지합니다. 남아 있는 backend 명령·문서는 frontend 기준으로 갱신합니다. backend를 함께 보관하는 프로젝트는 이 정리 단계를 생략하고 frontend 산출물만 배포합니다.

프로젝트 README에 web-app 실행·배포 입구를 연결하고 project-agents.md에 브라우저/Node 경계·공개 환경 변수 규칙을 기록합니다. update.md에는 조합 파일·패키지·설정·검증 결과와 복귀 릴리스를 남깁니다.

업데이트 전 정상 dist/frontend 전체·잠금 파일·공개 빌드 설정을 보관합니다. 복귀는 이전 frontend 산출물을 같은 호스팅 릴리스 단위로 되돌리고 backend API 호환성도 확인합니다. 사용자 저장 데이터는 이 구성품에서 추가하지 않습니다. 제거 시 Api·DI·Vite 변경과 build:web·preview:web 명령을 되돌리고 사용자 변경 파일은 보존합니다.

공식 근거: [Vite 환경 변수](https://vite.dev/guide/env-and-mode.html), [Vite 정적 배포](https://vite.dev/guide/static-deploy.html), [Cloudflare Pages React 배포](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/). 실제 계정 배포·별도 출처 CORS·브라우저 조작은 미검증입니다.

## 5. 검증 기록

2026-11-04, macOS 13.7.8 x64·Node 24.22.1에서 새 임시 프로젝트에 기준 뼈대 → frontend → web-app 파일을 적용했습니다. 기존 고정 패키지의 잠금 파일로 오프라인 npm ci, frontend 타입 검사·빌드와 테스트 5개를 통과했습니다. backend 없이 preview를 실행하여 정적 HTML·상대 경로 JS/CSS 제공과 공개 API 주소의 빌드 반영을 확인했습니다.

실제 브라우저 조작·외부 API/CORS·Cloudflare 계정 배포·Windows/Linux는 미검증입니다. npm의 esbuild·fsevents 설치 스크립트 미승인 경고가 남았습니다. 정적 preview 성공은 원격 배포 성공을 의미하지 않습니다.
