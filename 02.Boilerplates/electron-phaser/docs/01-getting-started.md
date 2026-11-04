<!-- version: v3.0.0 -->
# Electron·Phaser 가져오기부터 실행까지

처음 사용하는 개인 PC에서 **유형 받기 → 새 프로젝트 복사 → Node 환경 준비 → 의존성 복원 → 실행·종료 → 검증** 순서로 진행합니다. 유형 폴더 자체가 프로젝트 루트입니다. 이 폴더 전체를 원하는 프로젝트 이름의 새 폴더로 가져옵니다. 기존 프로젝트를 복원한다면 가져오기·새 폴더 복사는 건너뛰고 그 프로젝트의 버전 파일과 CI를 우선합니다.

## 0. 선행 도구·준비 순서

개발 도구 설치 전에 [서비스 OS 지원 범위](./04-build-and-release.md#서비스-os-지원-범위)에서 최소 OS·최대 지원 상태·실제 검증 범위를 확인합니다. SDK·패키지 변경 시 이 범위를 다시 대조합니다.

코드를 받기 위한 PC 공통 준비와 프로젝트를 받은 뒤의 도구 설치를 구분합니다. 모든 도구를 다운로드 전에 설치할 필요는 없지만, 각 명령의 선행 도구가 준비된 뒤 다음 단계로 진행합니다.

| 단계·조건 | 선행 도구 | 확인·다음 작업 |
| :--- | :--- | :--- |
| 다운로드 전 공통 필수 | Git·다운로드/압축 도구, macOS는 아래 Apple 개발 도구 준비 | Git 동작 확인 → 1절 다운로드·2절 복사 |
| 설치·빌드 필수 | macOS/Linux nvm 또는 Windows 프로젝트용 Node → `.nvmrc`의 Node·npm | 3절 버전 확인 → npm ci·검사·빌드 |
| Electron 실행 필수 | 대상 Electron이 지원하는 OS/CPU·데스크톱 GUI·필요 런타임 라이브러리 | 5절 실제 창·IPC·게임·저장 확인. GUI 없는 서버의 빌드 성공과 구분 |
| 네이티브 모듈이 요구할 때만 | OS용 C/C++ 도구·SDK 및 모듈의 요구 도구 | Electron ABI·대상 CPU 조건 확인 후 복원. 전체 Xcode·Python 등을 무조건 설치하지 않음 |
| 코드 편집 선택 | VS Code·필요 확장 | 전역 Electron·TypeScript·Phaser는 설치하지 않음 |
| 패키징·배포 시 추가 | 선택 maker·OS별 서명/공증 도구·배포 자격 | 로컬 검증 후 빌드·배포 가이드. macOS 서명·공증은 전체 Xcode 등 공식 선행 조건 별도 확인 |

Git·nvm·편집기·네이티브 빌드 도구 설치는 저장소의 `01.Tools/`에서 관리합니다. 패키지 단독 사용은 아래 공식 설치 안내를 따릅니다. [Electron 설치·바이너리 안내](https://www.electronjs.org/docs/latest/tutorial/installation)에 따라 필요한 OS 라이브러리·다운로드 조건을 확인합니다. Homebrew·Docker·DB는 이 로컬 샘플의 직접 실행 의존성이 아닙니다.

### macOS에서 다운로드 전에 확인

Git·nvm 등 설치 도구가 사용할 Apple 개발 도구를 먼저 준비합니다. Command Line Tools만 쓰면 설치 완료 후 Git·Clang을 확인합니다. **선택한 도구가 전체 Xcode라면 해당 Xcode의 라이선스 동의·최초 초기화를 먼저 완료**하고 같은 Developer 경로의 셸에서 확인합니다. 자세한 명령은 저장소의 `01.Tools/xcode.md`, 이 패키지만 받은 경우 [Apple 개발 도구 안내](https://developer.apple.com/library/archive/technotes/tn2339/_index.html)와 [Xcode 초기화·라이선스 안내](https://docs.flutter.dev/platform-integration/ios/setup)를 따릅니다. 설치·라이선스 오류가 남아 있으면 Git clone·Homebrew·nvm·FVM 설치로 넘어가지 않습니다. 웹·Android 개발에 전체 Xcode를 강제하지 않습니다.

```bash
git --version
clang --version
```

위 명령은 준비가 끝난 개인 Mac의 일반 터미널에서 실행합니다. Homebrew가 필요한 경우 이 확인 뒤에 준비하고, 프로젝트별 JDK·Ruby 등을 설치합니다. 설치 명령은 Tools 또는 공식 안내에서 확인하며 도구 이름만으로 이미 준비되었다고 판단하지 않습니다.

## 1. 유형 패키지 가져오기

개인 PC에서 `git --version`을 확인합니다. Git이 없다면 [공식 설치 안내](https://git-scm.com/install/)에 따라 OS용 Git을 먼저 준비합니다. 아래는 임의의 작업 부모 폴더에서 실행하며 `devguide-samples`는 존재하지 않는 새 폴더 이름이어야 합니다. macOS·Linux·Windows PowerShell에서 같은 Git 명령을 사용합니다.

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/electron-phaser
cd 02.Boilerplates/electron-phaser
```

이제 유형 패키지 루트입니다. 공개 저장소 다운로드에는 토큰을 명령에 넣을 필요가 없습니다. 개인 변경이 있는 다운로드 저장소의 업데이트는 먼저 보존 후 `git pull --ff-only`로 수행합니다. 복사해 독립 개발한 앱에 이 pull을 적용하는 것은 아닙니다. [Git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout).

## 2. 새 프로젝트 폴더 준비

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

실제 환경 값이 필요할 때만 프로젝트 루트에서 `.env.example`을 `.env`로 복사해 채웁니다. 이미 있는 `.env`는 유지합니다. 예시 파일에는 키·토큰·개인 값을 넣지 않으며 `.env`는 Git에서 제외합니다. `.env`가 존재한다고 앱·Flutter·Node가 자동으로 읽는 것은 아닙니다. 필요한 로딩 방법은 해당 프로젝트 문서에 명시합니다.

```bash
if [ ! -e .env ]; then
  cp .env.example .env
fi
```

Windows에서는 `if (-not (Test-Path .env)) { Copy-Item .env.example .env }`를 사용합니다. 기본 샘플은 추가 비밀값이 필요하지 않아 이 단계를 생략할 수 있습니다. [Git archive](https://git-scm.com/docs/git-archive).

## 3. Node·npm 환경 준비

새 프로젝트 폴더로 이동합니다. 버전은 **`.nvmrc`의 24.22.1**과 package.json·package-lock.json이 기준이며, npm 11.19.1은 기존 검증 기록입니다. 플랫폼·CPU별 지원을 확인하고 다른 Node로 복원하면서 잠금 파일을 다시 만들지 않습니다. Electron·TypeScript·Vite 등은 프로젝트 의존성이므로 전역 설치하지 않습니다.

### macOS·Linux

nvm이 이미 있으면 재설치하지 않습니다. 없다면 일반 사용자 터미널의 임의 폴더에서 공식 설치기를 사용하고 설치기가 기록한 셸 초기화 위치를 확인합니다.

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

새 터미널에서 nvm을 확인하고 **새 프로젝트 루트**로 이동해 실행합니다.

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
Expand-Archive -Path $NodeZip -DestinationPath "$env:LOCALAPPDATA\dev-sdks"
```

새 프로젝트 루트의 PowerShell에서 설치된 **실제 폴더명**으로 실행합니다. 자식 PowerShell이 종료되면 부모 PATH는 유지됩니다.

```powershell
pwsh -NoProfile -NoExit -Command '$env:Path = "$env:LOCALAPPDATA\dev-sdks\실제Node폴더명;" + $env:Path'
```

PowerShell 7의 `pwsh`가 없다면 같은 위치에서 `powershell.exe -NoProfile -NoExit -Command`로 자식 Windows PowerShell을 엽니다. 그 안에서 `node --version`·`npm --version`과 `.nvmrc`를 대조하고 다음 단계의 npm 명령을 직접 사용합니다. 작업이 끝나면 `exit`합니다. 네이티브 Windows와 WSL의 Node·node_modules를 혼용하지 않습니다.

## 4. 프로젝트 의존성 복원·검사

새 프로젝트 루트의 macOS·Linux 셸에서:

```bash
nvm exec "$(cat .nvmrc)" npm ci
nvm exec "$(cat .nvmrc)" npm run typecheck
nvm exec "$(cat .nvmrc)" npm test
nvm exec "$(cat .nvmrc)" npm run build
```

Windows는 위에서 연 Node 환경의 자식 PowerShell에서 `nvm exec …` 접두부 없이 같은 npm 명령을 실행합니다. `npm ci`는 lockfile을 기준으로 복원하며 기존 node_modules를 교체합니다. package-lock.json을 삭제하거나 npm install로 버전 갱신을 대신하지 않습니다. 설치 스크립트 오류·네트워크·CPU 의존성 오류는 숨기지 않고 원인을 확인합니다. [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

## 5. 실행·종료·결과 확인

GUI 데스크톱의 두 터미널에서 각각 프로젝트 루트로 이동합니다. Windows는 준비한 Node 환경의 자식 PowerShell을 두 개 열고 npm 명령만 실행합니다.

```bash
# 터미널 1: 개발 화면 서버
nvm exec "$(cat .nvmrc)" npm run dev
```

```bash
# 터미널 2: Electron 창
nvm exec "$(cat .nvmrc)" npm run electron:dev
```

기본 Renderer URL은 `http://127.0.0.1:5173`이며 이 주소만 브라우저에서 여는 것으로 Electron IPC를 검증하지 않습니다. Electron 창에서 데스크톱 연결 확인·원 클릭·점수 저장을 확인하고 재실행 후 복원도 확인합니다. 종료는 Electron 창을 닫고 두 터미널에 남은 프로세스를 Ctrl+C로 종료합니다. 빌드 화면의 로컬 실행은 `npm run electron:start`입니다. 패키징·설치기·배포 서명은 아직 포함하지 않습니다.

별도 DB·외부 API·비밀값·`.env`는 필요하지 않습니다. userData의 저장 파일은 소스나 node_modules와 다르므로 업데이트·프로젝트 삭제 전에 저장 경로를 확인해 백업합니다. 실제 위치·포트 변경·샘플 구조는 프로젝트 루트의 `README.md`와 [상세 설명서](./03-boilerplate.md)를 따릅니다.

## 6. 개발·갱신·정리

새 프로젝트 README와 docs/environment.md에 실제 설치 OS/CPU·Node/npm·환경 변수 이름·복원·검증·종료·복귀를 남깁니다. 필요한 환경 변수가 생기면 `.env.example`과 Git 제외 `.env`·프로젝트 실행 범위를 함께 정의하며 시스템 PATH·전역 패키지를 변경하지 않습니다. 지금 필요하지 않은 `.env`나 SDK는 만들지 않습니다.

이후에는 [구조·개발 규칙](./03-boilerplate.md)을 읽고 기능을 추가합니다. 갱신은 코드·manifest/lock의 정상 기준을 보존한 작업 브랜치에서 진행하고 검사·실행 후 [갱신 이력](../update.md)을 남깁니다. 초기 복원에 npm update·npm audit fix --force를 섞지 않습니다. 다른 프로젝트가 쓰는 Node·공유 캐시는 앱 폴더와 함께 삭제하지 않습니다.

배포할 때는 [빌드 산출물·배포 가이드](./04-build-and-release.md)를 이어서 읽습니다. 로컬 실행 성공과 배포 검증은 구분합니다.

확인일: 2026-11-03. 저장소 스크립트·버전 파일과 공식 설치·명령 안내를 대조했습니다. 이번 문서 변경에서 의존성 설치·앱 실행·GUI·다른 OS를 새로 검증하지 않았습니다. 과거 검증 결과는 유형 README·update.md에서 별도로 확인합니다.

## 프로젝트 이름 변경

가져온 폴더 이름을 원하는 프로젝트 이름으로 바꾸고 그 폴더에서 명령을 실행합니다. 폴더 이름 변경만으로 실행 경로를 수정할 필요는 없습니다. npm 패키지 이름도 바꾸려면 `package.json`의 `name`과 `package-lock.json`의 최상위 `name`·`packages[""].name`을 같은 npm 이름(예: `my-project`)으로 맞춥니다. 잠금 파일을 삭제하거나 의존성 버전을 바꾸지 않습니다.

Electron 앱 이름은 userData 저장 경로에도 영향을 줄 수 있습니다. 기존 앱의 패키지 이름을 바꾸기 전 저장 데이터를 백업하고 새 경로로의 이전을 준비합니다. 배포용 제품 이름·아이콘·앱 식별자는 배포 가이드에서 따로 설정합니다.
