<!-- version: v1.0.2 -->
# 샘플 프로젝트 작업 지침

이 파일은 보관용 지침입니다. 이 패키지를 문서 저장소에 복사해도 자동 적용되지 않습니다. 새 앱에 적용할 때만 이 파일을 새 프로젝트 루트의 `AGENTS.md`로 복사하세요.

## 1. 샘플 범위

- `electron-phaser / local-only`로 분류되는 로컬 전용 Electron 앱의 구조를 기준으로 작업합니다.
- 외부 API 연동은 현재 지원 범위에 포함되지 않습니다. 통신 기능을 추가할 때는 별도 통신 프로필과 요구사항을 정하고 인증·오류 계약·타임아웃 등 필요한 경계를 함께 설계합니다. localhost 개발 서버와 앱 내부 IPC를 원격 API 계층으로 취급하지 않습니다.
- 핵심 예제는 [`boilerplates/minimal/src/renderer/src/app.tsx`](boilerplates/minimal/src/renderer/src/app.tsx)에서 `GreetingApi`를 호출하고, [`boilerplates/minimal/src/backend/bridge/greeting/greeting.usecase.ts`](boilerplates/minimal/src/backend/bridge/greeting/greeting.usecase.ts)가 검증된 결과를 반환하는 흐름입니다.
- 문서 세부사항: [`docs/boilerplate.md`](docs/boilerplate.md).

## 2. 작업 전 확인

- 작업 루트는 `boilerplates/minimal/`입니다. `git status --short --branch`로 사용자 변경을 먼저 확인하고 기존 변경을 덮어쓰거나 초기화하지 않습니다.
- `package.json`, `package-lock.json`, `.nvmrc`를 읽어 런타임과 의존성 기준을 확인합니다.
- 변경 경로의 모든 호출자와 해당 테스트를 찾습니다. 명령은 모두 `boilerplates/minimal/`에서 실행합니다.

## 3. 구조·명명·경계

- `src/backend/` 아래 `core/`, `bridge/`, `services/`로 역할을 나눕니다. 클래스는 `PascalCase`, 구현 파일은 `kebab-case.ts`를 씁니다.
- `src/backend/bridge/<기능>/<기능>.usecase.ts`는 IPC 핸들러에서 발신 창과 입력을 검증하고 결과를 반환합니다. 순수 계산은 `services/`에 두어 테스트합니다.
- `src/backend/core/di/registry.ts`는 backend 모듈을 조립하고, `core/backend-module.ts`는 모듈 계약을 둡니다.
- `src/backend/bridge/<기능>/<기능>.bridge.ts`는 Preload가 제공할 IPC 호출만 구현합니다. Renderer에 `ipcRenderer`, Node API, 임의 채널을 노출하지 않습니다.
- `src/shared/ipc/`는 채널명과 요청·응답 타입을 공유합니다. Renderer와 Main 모두 이 계약을 사용합니다.
- `src/renderer/src/`는 React 화면과 사용자 입력만 처리합니다. 받은 문자열은 React 텍스트로 출력하고 HTML로 해석하지 않습니다.
- 의존 방향은 Renderer → Preload API → IPC → Main Usecase → 순수 로직입니다. Main은 화면 구현을 가져오지 않습니다.

## 4. 구현 원칙

- 씬 기능이 커지면 `scenes/<기능>/<기능>.scene.ts`는 수명주기·입력·조립, `.logic.ts`는 Phaser 없는 순수 게임 규칙, `.ui.ts`는 Phaser 표시 객체 생성·갱신·해제를 담당하도록 분리합니다. Scene이 logic/UI를 호출하고 UI는 콜백으로 동작을 요청합니다. logic은 Scene/UI/React/DOM을 import하지 않습니다. 작은 씬에 빈 logic/UI 파일을 만들지 않습니다.

- 신뢰 경계인 IPC 입력은 항상 런타임 검증합니다. TypeScript 타입만으로 입력을 신뢰하지 않습니다.
- IPC 응답은 성공과 실패를 구별할 수 있게 반환하고, UI에는 사용자에게 안전한 오류만 보여줍니다.
- 기존 최소 구조를 유지하고 요청되지 않은 계층·의존성·설정은 추가하지 않습니다.
- 동작을 추가하거나 바꿀 때 최소한의 회귀 테스트를 추가합니다. 이 샘플의 테스트는 `src/backend/services/{greeting,persistence}/`의 `.service.test.ts`입니다.

## 5. 실행·검증 명령

모든 명령은 `boilerplates/minimal/` 작업 루트에서 실행합니다.

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run dev             # 터미널 1
npm run electron:dev    # 터미널 2
npm run electron:start  # 빌드 후 파일 기반 Renderer 실행
```

개발 포트는 `vite.config.ts`의 `server.port`이고, 개발 URL은 `src/backend/main.ts`에 있습니다. 변경 시 둘을 함께 맞춥니다. 자세한 복사 절차 및 확인 결과는 [`docs/boilerplate.md`](docs/boilerplate.md)를 참고합니다.

## 6. 완료·보고

- 테스트, 타입 검사, 빌드 결과를 확인하고 실패·미실행 항목을 분리해 보고합니다.
- 파일 목록과 명령을 문서에 반영합니다. 생성된 `node_modules/`, `dist/`, `dist-electron/`은 반출하지 않습니다.
- 사용자 변경과 작업 범위 밖 파일을 보존합니다. 이 샘플의 적용 범위 밖인 배포 패키징과 플랫폼별 GUI 동작은 완료로 주장하지 않습니다.

React는 UI와 Phaser 인스턴스 수명주기를, Phaser Scene은 게임 입력·객체·라운드 점수를 소유합니다. React effect 해제 시 `game.destroy(true)`를 호출합니다. Scene은 React나 Electron을 import하지 않으며 필요한 UI 알림은 콜백으로 전달합니다. 게임 설정은 `src/renderer/src/core/game.config.ts`, 씬은 `scenes/main/main.scene.ts`에서 관리합니다. 정적 리소스는 씬 preload에서 등록하고 생성된 객체·리스너·타이머는 씬 종료 수명주기에 맞춰 해제합니다.

저장·리소스 흐름: 시작 시 userData의 GameSave를 IPC로 불러와 검증한 뒤 LoadingScene에서 이미지 리소스를 로드하고 게임에 진입합니다. 점수 저장 버튼으로 현재 점수를 저장하며 다음 실행에 복원합니다. 저장/로드 오류를 표시하고 손상 파일은 자동 초기화하지 않습니다. 상세 경로와 관리 규칙은 docs/boilerplate.md의 저장 데이터와 리소스 수명주기를 참고하세요.

확장 작업에서는 docs/boilerplate.md 5절과 8절을 확인합니다. 정적 정의·영구 저장·실행 중 상태를 분리하고 ID로 연결합니다. 저장 변경은 검증과 쓰기 성공 뒤 확정하며 미래 버전·손상 파일은 자동 덮어쓰지 않습니다. 씬/리소스 등록과 메뉴 연결을 각각 확인하고 종료 후 비동기 응답·이벤트·사용 중 텍스처 해제를 점검합니다. 확장 예시의 save/Store·마이그레이션·제작 도구는 아직 구현되지 않았으므로 필요한 기능을 추가할 때 실제 코드·테스트·문서를 함께 작성합니다.

샘플 코드·설정·의존성·문서를 갱신하면 유형 폴더 루트의 `update.md`에 날짜·변경 이유·버전 전후(미변경 포함)·적용/복귀 영향·실제 검증과 미검증을 기록합니다. 새 프로젝트에 지침을 적용할 때는 해당 프로젝트의 갱신 이력 파일 위치에 맞춥니다.
