<!-- version: v1.0.1 -->
# TypeScript React Phaser Electron Game Starter

통신 프로필: **local-only**. 앱 실행에는 외부 서버가 필요하지 않습니다. 내부 IPC와 개발용 localhost Vite 서버를 사용하며, 외부 API 연동 기능은 포함하지 않습니다. 최초 의존성 설치에는 인터넷 연결이 필요할 수 있습니다.

React 화면에서 연결 확인을 요청하면 Main이 IPC 발신자를 확인하고 1~40자 입력 규칙을 검증한 뒤 인사말이나 오류를 반환하는 최소 데스크톱 앱입니다.

## 요구 환경

- Node.js 24.22.1 (`.nvmrc`), npm 11.19.1
- Electron 41.10.3을 실행할 수 있는 데스크톱 OS/CPU 환경. 실제 기준 검증 환경은 macOS 13 Ventura x86_64이며, 다른 조합은 이 패키지에서 검증하지 않았습니다.
- 별도 SDK·DB는 필요하지 않습니다. 첫 설치 시 npm registry와 Electron 바이너리 다운로드 연결이 필요합니다.

## 설치·실행

```bash
npm ci
npm test
npm run typecheck
npm run build
```

개발 모드는 두 터미널을 사용합니다.

```bash
# 터미널 1
npm run dev
```

```bash
# 터미널 2
npm run electron:dev
```

앱 창에서 **데스크톱 연결 확인**을 누릅니다. 성공 메시지 또는 입력 오류가 React 화면에 보입니다. 종료 시 Electron 창을 닫고 Vite 터미널에서 `Ctrl+C`를 누릅니다. 개발 기본 URL은 `http://127.0.0.1:5173`입니다. 포트 변경 시 `vite.config.ts`의 `server.port`와 `src/backend/main.ts`의 URL을 같이 수정합니다.

`npm run electron:start`는 프로덕션 Renderer 파일을 로드하는 로컬 실행 명령입니다. 패키징은 설정되어 있지 않습니다.

## 테스트·빌드와 독립 실행 범위

- `npm test`: 이름 입력의 정상·오류 경계 검사
- `npm run typecheck`: Renderer/공유 타입 및 Main/Preload 타입 검사
- `npm run build`: Vite, Main TypeScript, Preload 번들 생성
- 운영 DB, 외부 API, 상위 프로젝트 경로, 사용자 자격증명은 사용하지 않습니다.
- 세부 아키텍처 설명은 반출 유형 폴더의 `docs/boilerplate.md`에 있습니다. 이 README는 minimal 폴더만 복사해도 기본 실행 안내로 사용할 수 있습니다.

현재 검증에서는 복사한 샘플의 `npm ci`, 테스트 2개, 타입 검사, 빌드와 `electron:start`/`electron:dev` 프로세스 기동·종료가 통과했습니다. GUI 자동화가 연결되지 않아 버튼을 눌러 응답을 확인하는 단계는 미검증입니다. 검증 플랫폼은 macOS 13 x86_64입니다.

## 게임 사용 방법

Phaser 캔버스의 파란 원을 클릭하면 점수가 올라갑니다. React의 다시 시작 버튼은 기존 게임을 해제하고 새 라운드를 만듭니다. 데스크톱 연결 확인은 Electron 내부 IPC 왕복을 확인합니다. Electron 저장 데이터 로드가 게임 시작 조건이므로 Electron으로 실행해야 합니다. 게임 전환 후 실제 클릭·점수 갱신 GUI 확인은 미검증입니다.

게임 전환 후 독립 복사본 검증: `npm ci`, `npm run typecheck`, 기존 IPC 테스트 2개, `npm run build` 통과. Phaser 포함 번들의 500 kB 경고가 있으며 빌드는 성공했습니다. 이번 게임 UI의 실행·직접 조작은 미검증입니다.

저장·리소스 흐름: 시작 시 userData의 GameSave를 IPC로 불러와 검증한 뒤 LoadingScene에서 이미지 리소스를 로드하고 게임에 진입합니다. 점수 저장 버튼으로 현재 점수를 저장하며 다음 실행에 복원합니다. 저장/로드 오류를 표시하고 손상 파일은 자동 초기화하지 않습니다. 상세 경로와 관리 규칙은 docs/boilerplate.md의 저장 데이터와 리소스 수명주기를 참고하세요.

## 현재 반입 검토 결과 (2026-10-28)

저장 기능을 포함한 독립 복사본에서 테스트 3개·타입 검사·빌드를 통과했습니다. 실제 Electron 창·게임 조작·재실행 후 점수 복원은 이번 검토에서 확인하지 않았습니다. npm audit가 취약 패키지 5개(critical 2개 포함)를 보고했으므로 사용 전 의존성 갱신·재검증이 필요합니다. 버전은 이번 반입에서 변경하지 않았습니다.
