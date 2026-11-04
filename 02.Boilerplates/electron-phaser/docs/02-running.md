<!-- version: v2.0.0 -->
# TypeScript React Phaser Electron Game Starter

통신 프로필: **local-only**. 앱 실행에는 외부 서버가 필요하지 않습니다. 내부 IPC와 개발용 localhost Vite 서버를 사용하며, 외부 API 연동 기능은 포함하지 않습니다. 최초 의존성 설치에는 인터넷 연결이 필요할 수 있습니다.

React 화면에서 연결 확인을 요청하면 Main이 IPC 발신자를 확인하고 1~40자 입력 규칙을 검증한 뒤 인사말이나 오류를 반환하는 최소 데스크톱 앱입니다.

## 설치 명령 전 선행 확인

macOS는 Command Line Tools 설치 또는 선택한 전체 Xcode의 라이선스 동의·최초 초기화를 먼저 완료하고 `git --version`·`clang --version`이 오류 없이 동작하는지 확인합니다. 라이선스 오류가 남아 있으면 Git·nvm·FVM 설치를 계속하지 않습니다. 공통 명령은 [Apple 개발 도구](https://developer.apple.com/library/archive/technotes/tn2339/_index.html)와 [Xcode 라이선스·초기화](https://docs.flutter.dev/platform-integration/ios/setup)를 따릅니다. CLT만 사용하는 경우 전체 Xcode 전용 명령은 실행하지 않습니다.

필수는 Git → .nvmrc의 Node·npm → 프로젝트 의존성·Electron 실행 환경 순서입니다. 실제 창 실행에는 지원 OS/CPU·GUI·런타임 라이브러리가 필요합니다. 네이티브 모듈의 빌드 도구와 배포 서명 도구는 해당 작업을 할 때 추가하며 기본 로컬 실행에 전체 Xcode·DB·Docker를 강제하지 않습니다.

## 시작 순서·Node 준비

이 유형 폴더를 숨김 파일·`.nvmrc`·잠금 파일 포함해 새 프로젝트 루트로 복사한다. 기존 node_modules·dist·개인 설정·`.git`은 복사하지 않는다. 유형 패키지 전체를 받은 경우 유형 패키지의 시작 가이드를 먼저 읽는다. 이 유형 폴더를 전달받았다면 아래 Node 준비 후 본문의 설치·실행 순서로 진행할 수 있다.

macOS·Linux에서 nvm이 없을 때만 개인 일반 터미널에서 공식 설치기를 실행한다.

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

새 터미널의 **복사한 프로젝트 루트**에서 Node를 준비한다.

```bash
nvm install --no-use
nvm exec "$(cat .nvmrc)" node --version
nvm exec "$(cat .nvmrc)" npm --version
```

아래 모든 npm 명령은 `nvm exec "$(cat .nvmrc)" npm …`로 실행하면 부모 셸의 Node 선택을 바꾸지 않는다. 두 터미널 실행도 각각 같은 프로젝트 루트에서 적용한다. npm 전역 갱신·공용 Node default 변경은 하지 않는다. 네이티브 Windows는 [Node 공식 배포](https://nodejs.org/en/download)의 해당 버전 ZIP을 설치해 작업 자식 PowerShell의 PATH에서만 선택하고 같은 npm 명령을 실행한다. nvm-windows의 공용 링크 전환을 프로세스 격리로 설명하지 않는다. 자세한 설치·체크섬·자식 셸 명령은 [시작 가이드](01-getting-started.md)에 있다. [nvm 공식 설치·사용](https://github.com/nvm-sh/nvm).

현재 샘플에는 비밀 환경 변수·외부 서비스가 필요하지 않다. 필요한 값이 생기면 프로젝트 01-getting-started.md와 비밀값 없는 예시·Git 제외 로컬 설정으로 관리한다. 먼저 아래 요구 버전과 OS/CPU를 확인한 뒤 의존성 복원·검사·실행으로 진행한다.

## 요구 환경

- Node.js 24.22.1 (`.nvmrc`), npm 11.19.1
- Electron 45.1.0을 실행할 수 있는 데스크톱 OS/CPU 환경. 실제 기준 검증 환경은 macOS 13 Ventura x86_64이며, 다른 조합은 이 패키지에서 검증하지 않았습니다.
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
- 세부 아키텍처 설명은 반출 유형 폴더의 `docs/03-boilerplate.md`에 있습니다. 유형 폴더 전체를 가져오면 이 문서와 코드를 함께 사용할 수 있습니다.

현재 검증에서는 복사한 샘플의 `npm ci`, 테스트 2개, 타입 검사, 빌드와 `electron:start`/`electron:dev` 프로세스 기동·종료가 통과했습니다. GUI 자동화가 연결되지 않아 버튼을 눌러 응답을 확인하는 단계는 미검증입니다. 검증 플랫폼은 macOS 13 x86_64입니다.

## 게임 사용 방법

Phaser 캔버스의 파란 원을 클릭하면 점수가 올라갑니다. React의 다시 시작 버튼은 기존 게임을 해제하고 새 라운드를 만듭니다. 데스크톱 연결 확인은 Electron 내부 IPC 왕복을 확인합니다. Electron 저장 데이터 로드가 게임 시작 조건이므로 Electron으로 실행해야 합니다. 게임 전환 후 실제 클릭·점수 갱신 GUI 확인은 미검증입니다.

게임 전환 후 독립 복사본 검증: `npm ci`, `npm run typecheck`, 기존 IPC 테스트 2개, `npm run build` 통과. Phaser 포함 번들의 500 kB 경고가 있으며 빌드는 성공했습니다. 이번 게임 UI의 실행·직접 조작은 미검증입니다.

저장·리소스 흐름: 시작 시 userData의 GameSave를 IPC로 불러와 검증한 뒤 LoadingScene에서 이미지 리소스를 로드하고 게임에 진입합니다. 점수 저장 버튼으로 현재 점수를 저장하며 다음 실행에 복원합니다. 저장/로드 오류를 표시하고 손상 파일은 자동 초기화하지 않습니다. 상세 경로와 관리 규칙은 docs/03-boilerplate.md의 저장 데이터와 리소스 수명주기를 참고하세요.

## 현재 반입 검토 결과 (2026-10-28)

저장 기능을 포함한 독립 복사본에서 테스트 3개·타입 검사·빌드를 통과했습니다. 실제 Electron 창·게임 조작·재실행 후 점수 복원은 이번 검토에서 확인하지 않았습니다. 당시 npm audit는 취약 패키지 5개(critical 2개 포함)를 보고했습니다. 이 과거 결과는 2026-10-29 보안 갱신 전 기록입니다. 현재 결과는 아래 보안 갱신 기록을 참고합니다.

## 보안·버전 점검 (2026-10-29)

앱 package 버전은 1.0.1입니다. 독립 복사본에서 npm ci·테스트(3개)·타입 검사·빌드를 통과했고 전체 의존성 npm audit는 보고된 취약점 0건입니다. 이는 점검 시점의 알려진 npm 공지 기준이며 모든 보안 문제의 부재를 의미하지 않습니다. Electron 45.1.0·Vite 6.4.5·Vitest 5.0.5와 Node 타입 24.19.2를 사용합니다. Electron 45.1.0의 창 기동·종료, preload IPC 인사말, 임시 userData의 저장·조회, Phaser 캔버스 생성은 자동 점검했습니다. 직접 게임 클릭·앱 재실행 후 저장 복원·다른 OS는 미검증입니다. 버전 변경 이유·적용/복귀는 유형 폴더의 update.md에서 관리합니다.

환경 변수 양식은 `.env.example`로 공유하고 실제 값은 Git 제외 `.env`로 관리합니다. 기본 실행에는 추가 값이 필요하지 않습니다. 새 앱은 [시작 가이드](01-getting-started.md)의 Git archive 절차로 만들며 작업 폴더의 `.env`·캐시·빌드 결과를 통째로 복사하지 않습니다.
