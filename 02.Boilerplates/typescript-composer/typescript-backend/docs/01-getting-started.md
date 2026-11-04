<!-- version: v2.0.0 -->
# TypeScript Server 프로젝트 설정·실행

코드와 docs를 가져온 프로젝트에서 시작합니다. 아래 명령은 별도 표시가 없으면 `package.json`·`.nvmrc`·`package-lock.json`이 있는 프로젝트 루트의 일반 사용자 터미널에서 실행합니다. **요구 버전 확인 → PC 기본 도구 → Node·npm → 의존성 복원·검사 → 실행·종료** 순서로 진행합니다.

## 0. 선행 도구·준비 순서

| 항목 | 요구·기준 | 완료 확인 |
| :--- | :--- | :--- |
| 런타임 | `.nvmrc`의 Node 24.22.1, package.json의 Node 조건 | node·npm 실제 버전 확인. npm 11.19.1로 검증 |
| 프로젝트 의존성 | package-lock.json | npm ci → 타입 검사·테스트·빌드 |
| 실행 환경 | 로컬 HTTP 서버·curl 또는 HTTP 클라이언트 | 정상·입력 오류·404 응답 확인 |

개발 PC·사용자 OS 지원 조건과 실제 검증 범위는 [배포 가이드](./03-build-and-release.md)에서 확인합니다. TypeScript·tsx는 프로젝트 의존성이며 전역 설치하지 않습니다.

## 1. 가져온 프로젝트 확인

폴더 이름을 원하는 프로젝트 이름으로 바꿔 사용합니다. 루트에 `package.json`, `package-lock.json`, `.nvmrc`, `.env.example`, `docs/`와 src/backend/·test/가 있는지 확인합니다. npm 패키지 이름도 바꾸려면 문서 끝의 이름 변경 절차를 따릅니다. 기존 lockfile을 삭제하거나 프로젝트를 초기화하지 않습니다.

에이전트를 사용할 때만 `project-agents.md`를 같은 루트의 `AGENTS.md`로 복사합니다. 기본 샘플은 비밀값이나 `.env`가 필요하지 않습니다. 환경 변수가 생기면 `.env.example`의 양식을 Git 제외 `.env`에 복사하고 실행 프로세스에 적용할 방법을 기록합니다. `.env` 파일 자체가 Node에서 자동 로딩되지는 않습니다.

## 2. PC 기본 도구 준비

### macOS

Command Line Tools가 없다면 다음 명령을 실행하고 설치 창을 완료합니다.

```bash
xcode-select --install
```

이미 전체 Xcode를 사용하는 Mac에서 라이선스·초기화 오류가 있다면 설치한 앱 경로로 다음을 실행합니다. 해당 관리자 명령은 라이선스 동의와 구성 요소 설치에 사용합니다.

```bash
export DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer"
sudo env DEVELOPER_DIR="$DEVELOPER_DIR" /usr/bin/xcodebuild -license
sudo env DEVELOPER_DIR="$DEVELOPER_DIR" /usr/bin/xcodebuild -runFirstLaunch
```

CLT만 사용하는 경우 위 전체 Xcode 명령은 생략합니다. 준비 후 확인합니다.

```bash
git --version
clang --version
```

오류가 없으면 다음 Node 설치로 넘어갑니다. 이 샘플의 기본 실행을 위해 전체 Xcode·Homebrew를 추가 설치할 필요는 없습니다. [Apple 개발 도구](https://developer.apple.com/library/archive/technotes/tn2339/_index.html).

### Windows

[Git for Windows](https://git-scm.com/install/windows)의 OS/CPU용 설치기를 실행하고 새 PowerShell에서 `git --version`을 확인합니다. Node ZIP은 아래 절차에 따라 `D:\Developer\tools`에 보관합니다. D 드라이브는 실제 데이터 드라이브로 바꿉니다. 별도 PowerShell 7 없이 기본 Windows PowerShell로도 진행할 수 있습니다.

### Linux

Ubuntu/Debian의 일반 터미널에서 기본 도구를 준비합니다. 다른 배포판은 해당 패키지 관리자의 동등 패키지를 사용합니다.

```bash
sudo apt-get update
sudo apt-get install git curl ca-certificates xz-utils
git --version
```

네이티브 모듈을 추가해 소스 빌드가 필요해졌다면 그 모듈의 요구에 따라 C/C++·Python 등을 추가합니다. 현재 샘플은 외부 DB·Docker·JDK를 요구하지 않습니다.

## 3. Node·npm 환경 준비

새 프로젝트 폴더로 이동합니다. 버전은 **`.nvmrc`의 24.22.1**과 package.json·package-lock.json이 기준이며, npm 11.19.1로 이 샘플을 검증했습니다. 플랫폼·CPU별 지원을 확인하고 다른 Node로 복원하면서 잠금 파일을 다시 만들지 않습니다. TypeScript·tsx는 프로젝트 의존성이므로 전역 설치하지 않습니다.

### macOS·Linux

nvm이 이미 있으면 재설치하지 않습니다. 없다면 일반 사용자 터미널의 임의 폴더에서 공식 설치기를 사용하고 설치기가 기록한 셸 초기화 위치를 확인합니다.

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

새 터미널에서 nvm 초기화가 적용되지 않았다면 아래를 현재 셸에서 실행합니다. 설치기가 셸 설정에 같은 내용을 기록했는지도 확인합니다. 사용자 지정 NVM_DIR가 있으면 그 경로를 유지합니다.

```bash
export NVM_DIR="$HOME/.nvm"
[ ! -s "$NVM_DIR/nvm.sh" ] || . "$NVM_DIR/nvm.sh"
```

nvm을 확인하고 **새 프로젝트 루트**로 이동해 실행합니다.

```bash
nvm --version
nvm install --no-use
nvm exec "$(cat .nvmrc)" node --version
nvm exec "$(cat .nvmrc)" npm --version
```

이후 명령도 아래처럼 `nvm exec`로 실행하면 부모 셸의 Node 선택을 바꾸지 않습니다. `nvm alias default`나 다른 Node 설치의 npm 전역 갱신으로 프로젝트 환경을 맞추지 않습니다. nvm 최초 설치의 셸 hook과 Node 다운로드 캐시는 PC 도구 준비로 구분합니다. npm 버전이 기존 검증값과 다르면 차이를 기록하고 프로젝트 검사 결과를 확인하며 무조건 전역 npm을 덮어쓰지 않습니다. [nvm 공식 설치·버전 실행](https://github.com/nvm-sh/nvm).

### Windows PowerShell

프로젝트 간 영향을 줄이려면 공용 Node 링크·시스템 PATH를 전환하는 대신 [Node 공식 배포](https://nodejs.org/en/download)에 있는 `.nvmrc` 버전의 Windows CPU용 ZIP을 사용자 도구 폴더에 풀고 그 경로를 작업 프로세스에만 제공합니다. 공식 배포 파일과 SHASUMS256.txt를 대조합니다.

```powershell
$NodeZip = "$env:USERPROFILE\Downloads\실제Node파일명.zip"
Get-FileHash -Algorithm SHA256 -Path $NodeZip
```

공식 값과 대조한 뒤 압축을 풉니다. 이미 같은 폴더가 있으면 덮어쓰지 않고 설치 상태를 먼저 확인합니다.

```powershell
Expand-Archive -Path $NodeZip -DestinationPath "D:\Developer\tools"
```

새 프로젝트 루트의 PowerShell에서 설치된 **실제 폴더명**으로 실행합니다. 자식 PowerShell이 종료되면 부모 PATH는 유지됩니다.

```powershell
pwsh -NoProfile -NoExit -Command '$env:Path = "D:\Developer\tools\실제Node폴더명;" + $env:Path'
```

PowerShell 7의 `pwsh`가 없다면 같은 위치에서 `powershell.exe -NoProfile -NoExit -Command`로 자식 Windows PowerShell을 엽니다. 그 안에서 `node --version`·`npm --version`과 `.nvmrc`를 대조하고 다음 단계의 npm 명령을 직접 사용합니다. 작업이 끝나면 `exit`합니다. 네이티브 Windows와 WSL의 Node·node_modules를 혼용하지 않습니다.

## 4. 프로젝트 의존성 복원·검사

새 프로젝트 루트의 macOS·Linux 셸에서:

```bash
nvm exec "$(cat .nvmrc)" npm ci
nvm exec "$(cat .nvmrc)" npm run check
nvm exec "$(cat .nvmrc)" npm test
nvm exec "$(cat .nvmrc)" npm run build
```

Windows는 위에서 연 Node 환경의 자식 PowerShell에서 `nvm exec …` 접두부 없이 같은 npm 명령을 실행합니다. `npm ci`는 lockfile을 기준으로 복원하며 기존 node_modules를 교체합니다. package-lock.json을 삭제하거나 npm install로 버전 갱신을 대신하지 않습니다. 설치 스크립트 오류·네트워크·CPU 의존성 오류는 숨기지 않고 원인을 확인합니다. [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

## 5. 실행·종료·결과 확인

빌드한 프로젝트 루트에서 실행합니다. Windows는 준비한 Node 자식 PowerShell에서 npm 명령만 사용합니다.

```bash
nvm exec "$(cat .nvmrc)" npm start
```

다른 터미널에서 확인합니다. Windows PowerShell에서는 curl 대신 `curl.exe`를 사용합니다.

```bash
curl 'http://127.0.0.1:3101/api/greeting?name=World'
curl -i 'http://127.0.0.1:3101/api/greeting?name='
curl -i 'http://127.0.0.1:3101/api/missing'
```

정상 응답은 HTTP 200과 `{"success":true,"payload":{"message":"Hello, World!"}}`입니다. 빈 이름은 400, 없는 API는 404입니다. UI·IPC·브라우저 실행은 필요하지 않습니다. 종료는 서버 터미널의 Ctrl+C이며 SIGINT·SIGTERM에서 HTTP 수신을 닫습니다.

개발 중 자동 재시작은 다음 명령을 사용합니다.

```bash
nvm exec "$(cat .nvmrc)" npm run dev
```

기본 주소는 `127.0.0.1:3101`입니다. 포트를 바꾸려면 `src/backend/index.ts`의 port를 수정하고 개발 서버를 재시작하거나 재빌드합니다. 환경 변수 PORT를 자동으로 읽지는 않습니다. 처음부터 외부 주소로 바인딩하지 않습니다.

## 6. 개발·갱신·정리

새 프로젝트 README와 docs/01-getting-started.md에 실제 설치 OS/CPU·Node/npm·환경 변수 이름·복원·검증·종료·복귀를 남깁니다. 필요한 환경 변수가 생기면 `.env.example`과 Git 제외 `.env`·프로젝트 실행 범위를 함께 정의하며 시스템 PATH·전역 패키지를 변경하지 않습니다. 지금 필요하지 않은 `.env`나 SDK는 만들지 않습니다.

이후에는 [구조·개발 규칙](./02-boilerplate.md)을 읽고 기능을 추가합니다. 갱신은 코드·manifest/lock의 정상 기준을 보존한 작업 브랜치에서 진행하고 검사·실행 후 [갱신 이력](../update.md)을 남깁니다. 초기 복원에 npm update·npm audit fix --force를 섞지 않습니다. 다른 프로젝트가 쓰는 Node·공유 캐시는 앱 폴더와 함께 삭제하지 않습니다.

배포할 때는 [빌드 산출물·배포 가이드](./03-build-and-release.md)를 이어서 읽습니다. 로컬 실행 성공과 배포 검증은 구분합니다.

설치 절차 확인일: 2026-11-04. 프로젝트 스크립트·버전 파일과 공식 설치 안내를 대조했습니다. 이번 문서 변경에서 의존성 설치·앱 실행·GUI·다른 OS를 새로 검증하지 않았습니다. 실제 검증 범위는 update.md에 기록합니다.

## 프로젝트 이름 변경

가져온 폴더 이름을 원하는 프로젝트 이름으로 바꾸고 그 폴더에서 명령을 실행합니다. 폴더 이름 변경만으로 실행 경로를 수정할 필요는 없습니다. npm 패키지 이름도 바꾸려면 `package.json`의 `name`과 `package-lock.json`의 최상위 `name`·`packages[""].name`을 같은 npm 이름(예: `my-project`)으로 맞춥니다. 잠금 파일을 삭제하거나 의존성 버전을 바꾸지 않습니다.
