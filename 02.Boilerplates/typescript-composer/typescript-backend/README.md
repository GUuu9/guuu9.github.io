<!-- version: v2.0.1 -->
# TypeScript Server 보일러플레이트

Express HTTP API를 제공하는 기본 서버입니다. 진입점·core 조립·기능별 Bridge/Usecase·Service 경계를 유지합니다. Electron의 IPC·Preload·BrowserWindow는 전송 방식에 붙는 구성이라 이 HTTP 서버에는 포함하지 않습니다. UI·DB·인증·TLS·배포 자동화는 없습니다.

## 시작

프로젝트를 가져왔다면 [프로젝트 설정·실행](docs/01-getting-started.md)을 먼저 읽습니다. Node는 `.nvmrc`의 24.22.1, 의존성은 package.json·package-lock.json 기준입니다. 폴더 이름을 바꿔 사용하고 코드·docs를 같은 루트에 유지합니다.

도구 준비 후 프로젝트 루트에서:

```bash
npm ci
npm run check
npm test
npm run build
npm start
```

macOS·Linux는 시작 가이드의 `nvm exec "$(cat .nvmrc)" npm …`로 같은 Node를 선택합니다. Windows는 프로젝트 Node를 PATH에 둔 작업 PowerShell에서 실행합니다. `http://127.0.0.1:3101/api/greeting?name=World`를 호출하면 Hello, World!가 포함된 JSON을 반환합니다. 종료는 Ctrl+C입니다.

## 구조·개발

```text
src/backend/index.ts                   HTTP 시작·종료
src/backend/core/                      앱 구성·DI
src/backend/bridge/greeting/           HTTP 입력 경계·Usecase·Model
src/backend/repository/greeting/       검증된 prefix 소유
src/backend/services/file/             파일 I/O
src/backend/utils/                     이름 정규화
src/backend/config/greeting.json       공개 인사말 설정
scripts/copy-config.mjs         빌드 설정 복사
test/greeting.test.ts           HTTP·설정·I/O 검사
```

새 기능은 bridge/기능에 경계·Usecase·Model을 두고 필요한 Service·Repository만 추가합니다. core/di.ts에서 Usecase까지 조립하고, core/web-server.ts에서 Bridge 생성·라우터 연결을 수행합니다. 전체 파일 역할·정상/오류 흐름·의존 규칙은 [구조 문서](docs/02-boilerplate.md)를 따릅니다. `project-agents.md`는 새 앱에서 AGENTS.md로 복사할 보관본입니다.

[빌드·운영 배포](docs/03-build-and-release.md) · [검증·변경 이력](update.md). 로컬 HTTP 실행은 운영 배포 검증을 대신하지 않습니다.

## 프로젝트 가져오기

이미 받은 프로젝트에서는 이 절을 건너뜁니다. Git이 없다면 OS용 [Git 설치기](https://git-scm.com/install/)를 사용합니다. macOS는 시작 가이드의 CLT 또는 선택 Xcode 라이선스·초기화가 먼저 완료되어야 합니다. 개인 PC의 새 다운로드 폴더에서 실행합니다.

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/typescript-composer
cd 02.Boilerplates/typescript-composer/typescript-backend
```

유형 루트에서 Git에 커밋된 템플릿만 새 앱으로 내보냅니다. 기존 대상·개인 .env·캐시·미커밋 변경은 가져오지 않습니다.

```bash
(
  set -euo pipefail
  project_dir="$HOME/Developer/my_server"
  repository_root="$(git rev-parse --show-toplevel)"
  test ! -e "$project_dir"
  mkdir -p "$project_dir"
  git -C "$repository_root" archive HEAD:02.Boilerplates/typescript-composer/typescript-backend | tar -xf - -C "$project_dir"
)
```

Windows PowerShell에서는 데이터 드라이브의 새 폴더로 내보냅니다. D는 실제 드라이브로 바꿉니다.

```powershell
$ProjectDir = "D:\Developer\my_server"
$RepositoryRoot = git rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0) { throw "저장소 루트 확인 실패" }
$PackageZip = "$env:TEMP\server-template.zip"
if ((Test-Path $ProjectDir) -or (Test-Path $PackageZip)) { throw "기존 대상이 있습니다." }
git -C "$RepositoryRoot" archive --format=zip --output="$PackageZip" HEAD:02.Boilerplates/typescript-composer/typescript-backend
if ($LASTEXITCODE -ne 0) { throw "내보내기 실패" }
Expand-Archive -Path $PackageZip -DestinationPath $ProjectDir
```

내보낸 파일을 확인한 뒤 만든 임시 ZIP만 삭제합니다. 새 폴더에서 [시작 가이드](docs/01-getting-started.md)를 진행합니다.
