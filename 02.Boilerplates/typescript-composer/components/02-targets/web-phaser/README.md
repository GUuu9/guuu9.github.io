<!-- version: v0.1.0 -->
# web-phaser 구성품

Phaser 구성품을 브라우저 저장과 정적 웹 배포 형태로 전환합니다. 일반 frontend·web-app은 선행 조건이 아닙니다. 추가 npm 패키지와 환경 변수는 없습니다.

## 1. 파일 적용·명령 연결

Phaser 구성품을 복사·설치한 프로젝트에 files 내용을 적용합니다. apis/persistence.api.ts·vite.config.ts는 기존 파일과 비교해 교체하고 test/frontend/web-save.test.ts·docs/05-web-phaser.md를 추가합니다. 원본 구성품 폴더를 실행 중 참조하지 않습니다.

```bash
npm pkg set 'scripts.build:web=npm run build:frontend' 'scripts.preview:web=vite preview --config vite.config.ts --host 127.0.0.1 --port 4173 --strictPort'
npm run check:frontend
npm run test:frontend
npm run build:web
npm run preview:web
```

프로젝트 루트·.nvmrc Node 환경에서 실행합니다. `http://127.0.0.1:4173`에서 원 클릭 → 저장 → 새로고침 → 점수 복구를 확인합니다. 종료는 Ctrl+C입니다. preview는 로컬 확인용입니다.

## 2. 저장 연결·데이터 보존

main.ts → DI의 PersistenceApi → localStorage 순서로 연결됩니다. key는 `web-phaser.save.v1`, 값은 version:1·0 이상의 안전한 정수 score입니다. 새로운 앱에서 사용하면 key를 프로젝트 식별자로 바꿔 같은 출처의 다른 앱과 구분합니다. 브라우저 Storage는 경로가 아닌 출처 기준으로 공유됩니다.

저장이 없으면 0점에서 시작합니다. 잘못된 JSON·버전·점수는 오류로 처리하며 원래 저장값을 덮어쓰지 않습니다. 저장 차단·용량 초과도 성공으로 숨기지 않습니다. 오류로 시작이 중단되면 브라우저 개발자 도구에서 해당 key의 값을 먼저 보관하고 원인을 확인합니다. 복구가 불가능하여 초기화할 때만 해당 key를 명시적으로 삭제합니다. localStorage 전체 삭제를 기본 해결책으로 사용하지 않습니다.

브라우저 데이터 삭제·비공개 모드 종료·도메인/프로토콜/포트 변경으로 저장이 없어지거나 접근 출처가 달라질 수 있습니다. 자동 서버 백업·동기화는 구현하지 않았습니다. 저장 형식을 바꾸면 버전과 이전 데이터 변환·복귀 정책을 함께 추가합니다.

## 3. 웹 배포·지원 범위

업로드 대상은 dist/frontend 전체입니다. backend·.env·node_modules는 포함하지 않습니다. Cloudflare Pages 등 정적 호스팅에는 프로젝트 루트·Node .nvmrc 기준, 빌드 명령 npm run build:web, 출력 dist/frontend를 설정합니다. 실제 계정 배포는 별도 작업입니다. Pages Functions·게임 서버는 포함하지 않습니다.

base는 ./로 생성하여 자산을 상대 경로로 제공합니다. 기본 게임에 화면 라우터는 없어 SPA fallback을 추가하지 않습니다. 배포 후 실제 경로의 게임·자산·입력·저장/복귀를 확인합니다. build 성공은 Canvas/WebGL·GPU·터치·브라우저 호환 검증을 의미하지 않습니다. 사용자 OS·브라우저 최소/최대 지원과 실제 검증 최저/최고는 아직 미확정입니다.

업데이트 전 정상 dist/frontend·잠금 파일·빌드 설정을 보관하고 릴리스 단위로 교체합니다. 복귀 시 이전 JS가 현재 저장 형식을 읽을 수 있는지 확인합니다. 로컬 저장값은 정적 배포 묶음에 포함되지 않으므로 사용자 데이터 백업으로 표현하지 않습니다.

정적 게임만 남기려면 backend 소스·전용 테스트·build 설정을 보관 후 정리하고 미사용 express·타입 의존성을 npm uninstall로 제거합니다. 기본 dev/check/test/build 명령은 frontend 명령을 호출하도록 맞추고 기본 tsconfig는 tsconfig.frontend.json을 extends합니다. backend를 함께 개발한다면 유지하고 frontend 산출물만 배포합니다.

구성품 제거는 저장 Api를 이전 구현으로 되돌리고 웹 build/preview 명령·추가 테스트·문서를 해제합니다. 사용자의 localStorage 값을 임의로 삭제하지 않습니다. README·project-agents.md·update.md에 결과 명칭·파일·버전·배포·데이터 보존·검증/복귀를 기록합니다.

공식 근거: [Vite 정적 배포](https://vite.dev/guide/static-deploy.html), [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/). 실제 원격 배포·브라우저 게임 조작은 미검증입니다.

## 검증 기록

2026-11-04, macOS 13.7.8 x64·Node 24.22.1에서 기준 뼈대 → phaser → web-phaser를 별도 임시 폴더에 복사하고 고정 npm 패키지를 설치했습니다. Phaser 단독 구성의 타입 검사, web-phaser 타입 검사·빌드, 저장 모델·복구·손상 데이터 보존·Storage 오류 테스트 3개를 통과했습니다. backend 없이 preview에서 HTML·상대 경로 JS/CSS·번들 SVG 제공을 확인했습니다.

실제 브라우저 Canvas/WebGL 렌더링·클릭·저장 후 새로고침·HMR 화면 검증·원격 배포·Windows/Linux는 미검증입니다. Phaser를 포함한 압축 전 JS는 약 1.37MB이며 Vite 500kB 번들 경고가 남습니다. npm의 esbuild·fsevents 설치 스크립트 미승인 경고도 남았습니다. 코드 분할이나 추가 최적화는 도입하지 않았습니다.
