<!-- version: v0.1.0 -->
# Phaser 화면 구성품

기준 뼈대에 클릭 게임·Scene·게임 설정·자산·점수 저장 Api를 추가합니다. 일반 frontend와 같은 역할의 대안 구성품이며 React frontend 위에 덮어쓰지 않습니다. 새 뼈대 복사본에 적용합니다. 현재 저장은 메모리이며 새로고침하면 초기화됩니다.

## 1. 복사·설치

이 문서는 구성품 파일을 프로젝트에 복사한 상태에서 시작합니다. src/frontend·test/frontend·vite.config.ts·tsconfig.frontend.json·docs/04-phaser.md가 추가됩니다. 실행 위치는 대상 프로젝트 루트이며 .nvmrc의 Node 환경을 사용합니다.

```bash
npm install --save-exact phaser@4.2.1
npm install --save-dev --save-exact vite@8.3.5
npm pkg set 'scripts.dev:frontend=vite --config vite.config.ts' 'scripts.check:frontend=tsc --noEmit -p tsconfig.frontend.json' 'scripts.test:frontend=tsx --test test/frontend/*.test.ts' 'scripts.build:frontend=npm run check:frontend && vite build --config vite.config.ts'
```

Windows는 탐색기로 files 내용물을 같은 대상 경로에 복사한 뒤 PowerShell에서 같은 npm 명령을 실행합니다. Phaser 버전은 기존 electron-phaser 샘플의 고정 버전을 사용합니다. 잠금 파일은 대상 프로젝트에서 npm으로 갱신하고 다른 프로젝트의 lock을 덮어쓰지 않습니다.

## 2. 연결과 사용

index.html → main.ts → core/di.ts의 PersistenceApi → 저장값 읽기 → createGameConfig → LoadingScene → MainScene 순서입니다. 원을 클릭하면 점수가 올라가고 저장 버튼은 현재 점수를 Api에 전달합니다. Scene은 Electron·Node·Storage에 직접 접근하지 않습니다.

```bash
npm run check:frontend
npm run test:frontend
npm run build:frontend
npm run dev:frontend
```

`http://127.0.0.1:5173`에서 클릭·점수·저장을 확인합니다. 개발 서버는 Ctrl+C로 종료합니다. 자산 로딩 실패·저장 읽기 실패는 화면에 표시하며 잘못된 저장을 자동 초기화하지 않습니다. HMR 교체 시 게임 인스턴스를 destroy하고 DOM 이벤트를 해제합니다.

## 3. 파일 역할·관리

- core/game.config.ts·scene.registry.ts: 게임 크기·Scene 조립과 순서.
- scenes/loading: 자산 로딩과 오류 표시. scenes/main: 게임 입력과 점수 처리·저장 모델 검증.
- resource: 등록할 이미지와 URL. 새로운 자산은 목록과 로딩 Scene에 연결합니다.
- apis/persistence.api.ts: 저장 매체의 경계. 현재는 인스턴스 내부 메모리입니다.
- core/di.ts: 저장 Api 조립. 다른 저장 구현은 이 호출 계약을 유지하며 교체합니다.
- main.ts: 게임 생성·점수 표시·저장 요청과 오류 표시. 프레임워크 공용 추상화는 추가하지 않습니다.

출력은 dist/frontend입니다. 웹 배포·브라우저 영구 저장은 web-phaser 구성품을 추가하고, Electron 저장은 후속 IPC 구성품으로 연결합니다. backend를 함께 제공하려면 HTTP/정적 제공 구성품을 별도로 조합합니다. 이 게임은 기본 실행에 backend가 필요하지 않습니다.

제거 시 추가한 frontend 파일·설정·scripts·테스트를 정리하고 다른 기능이 사용하지 않는 Phaser·Vite만 npm uninstall로 제거합니다. 사용자 코드·게임 자산은 먼저 보관합니다. 프로젝트 README·project-agents.md·update.md에 연결 경계·실행·검증 결과를 기록합니다.

공식 근거: [Phaser 설치](https://docs.phaser.io/phaser/getting-started/installation), [Game 수명주기](https://docs.phaser.io/api-documentation/class/game#destroy). 실제 게임 렌더링·입력은 브라우저에서 별도 확인해야 합니다.

## 검증 기록

2026-11-04, macOS 13.7.8 x64·Node 24.22.1에서 기준 뼈대 → phaser → web-phaser를 별도 임시 폴더에 복사하고 고정 npm 패키지를 설치했습니다. Phaser 단독 구성의 타입 검사, web-phaser 타입 검사·빌드, 저장 모델·복구·손상 데이터 보존·Storage 오류 테스트 3개를 통과했습니다. backend 없이 preview에서 HTML·상대 경로 JS/CSS·번들 SVG 제공을 확인했습니다.

실제 브라우저 Canvas/WebGL 렌더링·클릭·저장 후 새로고침·HMR 화면 검증·원격 배포·Windows/Linux는 미검증입니다. Phaser를 포함한 압축 전 JS는 약 1.37MB이며 Vite 500kB 번들 경고가 남습니다. npm의 esbuild·fsevents 설치 스크립트 미승인 경고도 남았습니다. 코드 분할이나 추가 최적화는 도입하지 않았습니다.
