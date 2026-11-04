<!-- version: v3.0.0 -->
# TypeScript · React · Phaser · Electron 게임 보일러플레이트

역할별 폴더와 프로세스 경계를 갖춘 독립 Electron 샘플입니다. React Renderer에서 연결 확인 버튼을 누르면 고정된 플레이어 이름을 Preload API와 IPC로 Main에 보내고, Main이 요청을 검증해 인사말 또는 오류를 돌려줍니다.

관리 분류는 **`electron-phaser / local-only`**입니다. 앱 실행 중 외부 API나 원격 서버를 사용하지 않습니다. IPC는 같은 앱 내부의 프로세스 간 통신이고, Vite의 localhost 서버는 개발 화면 제공 용도입니다. 의존성 설치에는 인터넷이 필요할 수 있습니다. 외부 API 연동용 샘플은 별도 통신 프로필로 관리하며, 이 샘플에는 인증·HTTP 클라이언트·타임아웃·재시도 정책이 포함되지 않습니다.

원을 클릭해 점수를 올리는 로컬 게임입니다. React가 점수·재시작 버튼을, Phaser가 캔버스·입력·게임 씬을 담당합니다. 데스크톱 연결 확인 버튼은 Preload/IPC/Main의 검증된 왕복 예제입니다.

프로젝트를 가져온 뒤 [요구 버전·준비 순서](docs/01-getting-started.md#0-선행-도구준비-순서)를 확인한다. 처음 사용한다면 [프로젝트 설정·실행](docs/01-getting-started.md)를 먼저 읽고, 환경 구성·실행을 마친 뒤 아래 구조·확장 설명으로 이어간다.

## 빠른 시작

[프로젝트 설정·실행](docs/01-getting-started.md)를 다음 순서로 따른다.

1. 가져온 프로젝트의 버전·환경 확인.
2. `.nvmrc`의 Node·npm 준비와 데스크톱 OS/CPU 조건 확인.
3. `npm ci`로 프로젝트 의존성·Electron 바이너리 복원.
4. 테스트·타입 검사·빌드.
5. 두 터미널에서 Vite·Electron 실행, 게임·IPC·저장 확인, 종료.

각 단계의 명령·작업 위치와 포트·저장 데이터는 시작 가이드와 [실행 안내](docs/02-running.md)에서 확인한다. GUI가 없는 서버에서 실행 성공을 가정하지 않는다.

## 버전·구조

- 기준 환경: macOS 13 x64, Node.js 24.22.1, npm 11.19.1
- 버전 기준: `.nvmrc`, `package.json`, `package-lock.json`
- 기술: Electron 45.1.0, React 19, Phaser 4.2.1, Vite 6.4.5, TypeScript 5, Vitest 5.0.5
- 구조: `src/backend/{core,bridge,services}`, `src/renderer/src`, `src/shared/ipc`
- 핵심 흐름: React App → Renderer API → Preload Bridge → Main Usecase → Greeting Service → React 결과 출력
- 프로세스 경계·의존 구조·수명주기: [상세 문서 4절](docs/03-boilerplate.md#4-아키텍처-의존-방향과-대표-데이터-흐름)

## 새 기능 추가 순서

공유 IPC 계약 정의 → Preload Bridge 노출 → Main Usecase에서 발신자와 입력 검증 → Service 로직 및 테스트 작성 → Renderer API/React 화면 연결 순서로 확장합니다. 파일별 역할은 [`docs/03-boilerplate.md`](docs/03-boilerplate.md), 보관용 작업 지침은 [`project-agents.md`](project-agents.md)입니다.

## 검증·제약

`npm test`, `npm run typecheck`, `npm run build`를 사용합니다. 샘플에 포함된 실행 코드만 대상으로 검증하며, 패키징·자동 업데이트·코드 서명은 포함하지 않습니다. 현재 검증 기록과 미검증 항목은 [`docs/03-boilerplate.md`](docs/03-boilerplate.md) 9절을 갱신합니다.

임시 복사본에서 설치, 2개 테스트, 타입 검사, 빌드, Electron 프로세스 기동 및 종료를 확인했습니다. 버튼을 눌러 IPC 응답이 표시되는 GUI 상호작용은 자동화 연결을 사용할 수 없어 미검증입니다. 현재 셸의 Node 경로 문제로 검증 시 Node 24.22.1을 PATH 앞에 지정했습니다.

새 프로젝트는 이 README의 Git archive로 코드·docs·지침·이력을 함께 가져옵니다. 에이전트를 쓰는 경우에만 지침 보관본을 같은 루트의 AGENTS.md로 복사하며 기본 배치의 링크를 다시 수정할 필요는 없습니다.

게임 로직과 리소스 관리 규칙은 상세 문서 4절의 게임 관리 규칙을 따릅니다. 이번 게임 전환 후 GUI 직접 클릭·점수 갱신 검증은 미검증입니다.

게임 전환 후 독립 복사본 검증: `npm ci`, `npm run typecheck`, 기존 IPC 테스트 2개, `npm run build` 통과. Phaser 포함 번들의 500 kB 경고가 있으며 빌드는 성공했습니다. 이번 게임 UI의 실행·직접 조작은 미검증입니다.

저장·리소스 흐름: 시작 시 userData의 GameSave를 IPC로 불러와 검증한 뒤 LoadingScene에서 이미지 리소스를 로드하고 게임에 진입합니다. 점수 저장 버튼으로 현재 점수를 저장하며 다음 실행에 복원합니다. 저장/로드 오류를 표시하고 손상 파일은 자동 초기화하지 않습니다. 상세 경로와 관리 규칙은 docs/03-boilerplate.md의 저장 데이터와 리소스 수명주기를 참고하세요.

확장 작업은 상세 문서 5절의 데이터 모델·저장 버전·씬 전환·리소스·게임 계산 규칙과 8절의 기능 추가 순서를 따릅니다. 구현된 기능과 앞으로 추가할 계층을 표로 구분하므로 확장 예시 경로를 현재 파일로 오인하지 않도록 합니다.

## 현재 반입 검토 결과 (2026-10-28)

저장 기능을 포함한 독립 복사본에서 테스트 3개·타입 검사·빌드를 통과했습니다. 실제 Electron 창·게임 조작·재실행 후 점수 복원은 이번 검토에서 확인하지 않았습니다. 당시 npm audit는 취약 패키지 5개(critical 2개 포함)를 보고했습니다. 이 과거 결과는 2026-10-29 보안 갱신 전 기록입니다. 현재 결과는 아래 보안 갱신 기록을 참고합니다.

변경 날짜·이유·버전 및 검증 이력은 [update.md](update.md)를 참고합니다.

## 보안·버전 점검 (2026-10-29)

앱 package 버전은 1.0.1입니다. 독립 복사본에서 npm ci·테스트(3개)·타입 검사·빌드를 통과했고 전체 의존성 npm audit는 보고된 취약점 0건입니다. 이는 점검 시점의 알려진 npm 공지 기준이며 모든 보안 문제의 부재를 의미하지 않습니다. Electron 45.1.0·Vite 6.4.5·Vitest 5.0.5와 Node 타입 24.19.2를 사용합니다. Electron 45.1.0의 창 기동·종료, preload IPC 인사말, 임시 userData의 저장·조회, Phaser 캔버스 생성은 자동 점검했습니다. 직접 게임 클릭·앱 재실행 후 저장 복원·다른 OS는 미검증입니다. 버전 변경 이유·적용/복귀는 [update.md](update.md)에서 관리합니다.

## 빌드 산출물과 배포

로컬 검증 후 [Electron·Phaser 패키징·배포](docs/04-build-and-release.md)에서 배포 준비·산출물·서명 또는 운영 설정·검증·업데이트·복귀를 확인합니다. 문서 추가는 샘플에 배포 기능이 구현되었다는 뜻이 아닙니다.

개발 도구 설치 전에 [서비스 OS 지원 범위](docs/04-build-and-release.md#서비스-os-지원-범위)에서 최소 OS·최대 지원 상태·실제 검증 범위를 확인합니다. SDK·패키지 변경 시 이 범위를 다시 대조합니다.

## 프로젝트 가져오기

이미 프로젝트 폴더를 받았다면 [프로젝트 설정·실행](docs/01-getting-started.md)부터 진행합니다. 아래는 이 문서 저장소에서 템플릿을 처음 가져오는 절차입니다. macOS Git에 라이선스 오류가 있다면 시작 가이드의 PC 기본 도구 준비를 먼저 마칩니다.

### 1. 유형 패키지 가져오기

개인 PC에서 `git --version`을 확인합니다. Git이 없다면 [공식 설치 안내](https://git-scm.com/install/)에 따라 OS용 Git을 먼저 준비합니다. 아래는 임의의 작업 부모 폴더에서 실행하며 `devguide-samples`는 존재하지 않는 새 폴더 이름이어야 합니다. macOS·Linux·Windows PowerShell에서 같은 Git 명령을 사용합니다.

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/electron-phaser
cd 02.Boilerplates/electron-phaser
```

이제 유형 패키지 루트입니다. 공개 저장소 다운로드에는 토큰을 명령에 넣을 필요가 없습니다. 개인 변경이 있는 다운로드 저장소의 업데이트는 먼저 보존 후 `git pull --ff-only`로 수행합니다. 복사해 독립 개발한 앱에 이 pull을 적용하는 것은 아닙니다. [Git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout).

### 2. 새 프로젝트 폴더 준비

아래는 **유형 패키지 루트**에서 macOS·Linux 셸로 실행합니다. 예시 대상 이름을 바꾸고 다운로드 폴더나 기존 앱 안에 덮어쓰지 않습니다. 묶음 전체가 실패 즉시 중단하도록 서브셸에서 실행합니다.

아래 명령은 **Git에 커밋된 HEAD의 템플릿만** 내보냅니다. 작업 폴더의 `.env`·캐시·빌드 결과·미커밋 변경은 가져오지 않습니다. 필요한 문서·`.env.example`도 함께 받으며 기존 대상이 있으면 중단합니다. 변경 중인 템플릿은 먼저 검토·커밋한 뒤 사용합니다.

```bash
(
  set -euo pipefail
  project_dir="$HOME/Developer/my_desktop_game"
  repository_root="$(git rev-parse --show-toplevel)"
  test ! -e "$project_dir"
  mkdir -p "$project_dir"
  git -C "$repository_root" archive HEAD:02.Boilerplates/electron-phaser | tar -xf - -C "$project_dir"
)
```

Windows PowerShell도 유형 패키지 루트에서 Git의 ZIP 내보내기를 사용합니다. 아래 대상 이름과 Downloads의 ZIP 이름은 예시이며 기존 파일이 있으면 중단합니다. git 명령 실패 시 이어서 압축을 풀지 않습니다.

```powershell
$ProjectDir = "$env:USERPROFILE\Developer\my_desktop_game"
$RepositoryRoot = git rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0) { throw "Git 저장소 루트 확인 실패" }
$PackageZip = "$env:TEMP\electron-phaser.zip"
if ((Test-Path $ProjectDir) -or (Test-Path $PackageZip)) { throw "기존 대상이 있습니다. 새 경로를 선택하세요." }
git -C "$RepositoryRoot" archive --format=zip --output="$PackageZip" HEAD:02.Boilerplates/electron-phaser
if ($LASTEXITCODE -ne 0) { throw "유형 내보내기 실패" }
Expand-Archive -Path $PackageZip -DestinationPath $ProjectDir
```

확인 후 위에서 만든 임시 ZIP만 정리합니다. 다른 앱·SDK·캐시는 삭제하지 않습니다. 새 앱의 프로젝트 루트는 복사된 버전 파일·소스·README가 있는 폴더입니다. 문서는 `docs/`, 지침 보관본은 `project-agents.md`, 이력은 `update.md`로 함께 보관하며 링크를 다시 고칠 필요가 없습니다. 에이전트를 사용할 때만 보관본을 같은 폴더의 AGENTS.md로 복사합니다. 작업 루트 표기는 패키지와 새 앱 모두 프로젝트 루트를 뜻합니다.
