<!-- version: v1.0.2 -->
# TypeScript · React · Phaser · Electron 게임 보일러플레이트

역할별 폴더와 프로세스 경계를 갖춘 독립 Electron 샘플입니다. React Renderer에서 연결 확인 버튼을 누르면 고정된 플레이어 이름을 Preload API와 IPC로 Main에 보내고, Main이 요청을 검증해 인사말 또는 오류를 돌려줍니다.

관리 분류는 **`electron-phaser / local-only`**입니다. 앱 실행 중 외부 API나 원격 서버를 사용하지 않습니다. IPC는 같은 앱 내부의 프로세스 간 통신이고, Vite의 localhost 서버는 개발 화면 제공 용도입니다. 의존성 설치에는 인터넷이 필요할 수 있습니다. 외부 API 연동용 샘플은 별도 통신 프로필로 관리하며, 이 샘플에는 인증·HTTP 클라이언트·타임아웃·재시도 정책이 포함되지 않습니다.

원을 클릭해 점수를 올리는 로컬 게임입니다. React가 점수·재시작 버튼을, Phaser가 캔버스·입력·게임 씬을 담당합니다. 데스크톱 연결 확인 버튼은 Preload/IPC/Main의 검증된 왕복 예제입니다.

## 빠른 시작

```bash
cd boilerplates/minimal
npm ci
npm test
npm run typecheck
npm run build
```

개발 실행은 두 터미널에서 합니다.

```bash
# 터미널 1
npm run dev
```

```bash
# 터미널 2
npm run electron:dev
```

기본 Renderer URL은 `http://127.0.0.1:5173`입니다. 창에서 **데스크톱 연결 확인**을 누르면 IPC 결과가 표시됩니다. 종료는 Electron 창을 닫고 Vite 터미널에서 `Ctrl+C`를 누릅니다. 포트 변경은 `vite.config.ts`의 포트와 `src/backend/main.ts`의 개발 URL을 함께 수정합니다.

## 버전·구조

- 기준 환경: macOS 13 x64, Node.js 24.22.1, npm 11.19.1
- 버전 기준: `boilerplates/minimal/.nvmrc`, `package.json`, `package-lock.json`
- 기술: Electron 41, React 19, Phaser 4.2.1, Vite 6, TypeScript 5, Vitest 3
- 구조: `src/backend/{core,bridge,services}`, `src/renderer/src`, `src/shared/ipc`
- 핵심 흐름: React App → Renderer API → Preload Bridge → Main Usecase → Greeting Service → React 결과 출력
- 프로세스 경계·의존 구조·수명주기: [상세 문서 4절](docs/boilerplate.md#4-아키텍처-의존-방향과-대표-데이터-흐름)

## 새 기능 추가 순서

공유 IPC 계약 정의 → Preload Bridge 노출 → Main Usecase에서 발신자와 입력 검증 → Service 로직 및 테스트 작성 → Renderer API/React 화면 연결 순서로 확장합니다. 파일별 역할은 [`docs/boilerplate.md`](docs/boilerplate.md), 보관용 작업 지침은 [`project-agents.md`](project-agents.md)입니다.

## 검증·제약

`npm test`, `npm run typecheck`, `npm run build`를 사용합니다. 샘플에 포함된 실행 코드만 대상으로 검증하며, 패키징·자동 업데이트·코드 서명은 포함하지 않습니다. 현재 검증 기록과 미검증 항목은 [`docs/boilerplate.md`](docs/boilerplate.md) 9절을 갱신합니다.

임시 복사본에서 설치, 2개 테스트, 타입 검사, 빌드, Electron 프로세스 기동 및 종료를 확인했습니다. 버튼을 눌러 IPC 응답이 표시되는 GUI 상호작용은 자동화 연결을 사용할 수 없어 미검증입니다. 현재 셸의 Node 경로 문제로 검증 시 Node 24.22.1을 PATH 앞에 지정했습니다.

새 프로젝트에는 `boilerplates/minimal/`의 내용물을 루트로 복사하고, 필요하면 `project-agents.md`를 새 루트의 `AGENTS.md`로 복사합니다. 지침의 `boilerplates/minimal/...` 링크를 새 루트의 `src/...` 기준으로 바꿔야 합니다.

게임 로직과 리소스 관리 규칙은 상세 문서 4절의 게임 관리 규칙을 따릅니다. 이번 게임 전환 후 GUI 직접 클릭·점수 갱신 검증은 미검증입니다.

게임 전환 후 독립 복사본 검증: `npm ci`, `npm run typecheck`, 기존 IPC 테스트 2개, `npm run build` 통과. Phaser 포함 번들의 500 kB 경고가 있으며 빌드는 성공했습니다. 이번 게임 UI의 실행·직접 조작은 미검증입니다.

저장·리소스 흐름: 시작 시 userData의 GameSave를 IPC로 불러와 검증한 뒤 LoadingScene에서 이미지 리소스를 로드하고 게임에 진입합니다. 점수 저장 버튼으로 현재 점수를 저장하며 다음 실행에 복원합니다. 저장/로드 오류를 표시하고 손상 파일은 자동 초기화하지 않습니다. 상세 경로와 관리 규칙은 docs/boilerplate.md의 저장 데이터와 리소스 수명주기를 참고하세요.

확장 작업은 상세 문서 5절의 데이터 모델·저장 버전·씬 전환·리소스·게임 계산 규칙과 8절의 기능 추가 순서를 따릅니다. 구현된 기능과 앞으로 추가할 계층을 표로 구분하므로 확장 예시 경로를 현재 파일로 오인하지 않도록 합니다.

## 현재 반입 검토 결과 (2026-10-28)

저장 기능을 포함한 독립 복사본에서 테스트 3개·타입 검사·빌드를 통과했습니다. 실제 Electron 창·게임 조작·재실행 후 점수 복원은 이번 검토에서 확인하지 않았습니다. npm audit가 취약 패키지 5개(critical 2개 포함)를 보고했으므로 사용 전 의존성 갱신·재검증이 필요합니다. 버전은 이번 반입에서 변경하지 않았습니다.

변경 날짜·이유·버전 및 검증 이력은 [update.md](update.md)를 참고합니다.
