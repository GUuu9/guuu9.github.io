<!-- version: v1.1.0 -->
# 버전·업데이트·검증 조합

이 프로젝트 루트에서 수행합니다. 앱 버전, 런타임/패키지 버전, feature 구현 버전, 문서 버전을 구분합니다. 실제 사용하는 값은 .nvmrc·package.json·package-lock.json을 우선합니다.

## 변경 전 확인

```bash
node --version
npm --version
npm ls --depth=0
npm audit
npm audit --omit=dev
```

audit는 알려진 취약점 검사이며 전체 보안 검증이 아닙니다. runtime 결과와 빌드 도구까지 포함한 결과를 따로 검토합니다. 공식 권고·지원 종료·릴리스 노트에서 영향 범위와 조치 버전을 확인합니다. 경고를 없애기 위한 lock 삭제나 npm audit fix --force를 기본 해결책으로 쓰지 않습니다.

## Git에서 보일러플레이트가 갱신된 경우

생성 앱은 원본 저장소와 독립입니다. 앱에서 git pull은 앱 저장소를 갱신할 뿐 Composer를 갱신하지 않습니다. npm update나 feature add도 원본 업데이트 명령이 아닙니다. 원본 묶음 갱신과 앱 변경 반영을 따로 수행합니다.

### 1. 기존 앱 기준 보관

앱 루트에서 git rev-parse --show-toplevel의 결과가 앱 자체의 저장소 루트인지 먼저 확인합니다. 다운로드 저장소의 상위 .git이 잡히면 앱을 별도 작업 위치로 옮겨 자체 저장소로 관리합니다. Git 관리 전이라면 앱에서 git init 후 추적할 파일·ignore를 검토해 첫 커밋을 만든 다음 진행합니다. 미커밋 작업은 검토해 앱 저장소에 커밋하거나 별도로 보존하고, 서명 키·.env·사용자 데이터는 Git 밖에 백업합니다.

```bash
git status --short
git rev-parse HEAD
npm run feature -- list
git switch -c chore/boilerplate-update
```

브랜치 이름이 이미 있으면 새 이름을 선택합니다. 사용한 Composer commit/tag·형태·앱 package 이름·활성 기능/버전·lock·검증 결과를 update.md에 기록합니다. 원본 revision이 없으면 기존 스냅샷/보관본을 사용하고, 정확한 이전 원본을 복원하지 못한 상태임을 명시합니다. 해시만으로 소스 전체를 복원할 수는 없습니다.

### 2. 원본 묶음을 별도 위치에서 갱신

앱 폴더 밖의 작업 부모 폴더에서 새 이름으로 받습니다. 아래 Git 명령은 Bash·PowerShell에서 동일합니다. Windows는 D:\Developer 등 실제 데이터 드라이브를 사용합니다.

```bash
git clone --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git boilerplate-review
cd boilerplate-review
git sparse-checkout set 02.Boilerplates/typescript-composer
git log -5 --oneline -- 02.Boilerplates/typescript-composer
git rev-parse HEAD
```

최신 commit을 무조건 적용하지 말고 변경 이력·지원 환경·보안 수정·이행 조건을 읽고 대상 commit을 정합니다. 특정 버전은 실제 commit/tag로 git switch --detach를 수행한 뒤 작업합니다. 기존 원본 clone을 재사용한다면 앱과 구분된 깨끗한 원본에서 git remote -v·status를 확인하고 fetch/diff 후 git pull --ff-only를 사용합니다. 앱 폴더나 수정한 catalog에서 원본을 pull하지 않습니다.

### 3. 같은 구성의 새 비교 앱 생성

위 다운로드 저장소 루트에서:

```bash
cd 02.Boilerplates/typescript-composer/typescript-backend
npm run help
npm run compose -- help
npm run compose -- backend-webui my-app
cd ../my-app
```

위 형태·프로젝트 이름은 예시이며 기존 앱과 같은 형태·npm package 이름으로 바꿉니다. 새 다운로드 위치라 기존 앱과 폴더 이름이 같아도 충돌하지 않습니다. 새 앱 README의 도구·환경·의존성을 준비한 뒤 기존 앱과 같은 feature 목록을 활성화합니다.

```bash
npm run feature -- add socket-io
```

예시 기능은 실제 활성 목록으로 바꾸고, 기본 포함 기능·이름 변경·미지원 조합은 새 원본 안내를 따릅니다. 이 명령은 설치·검사·빌드를 수행합니다. 기존 앱의 실제 .env·서명·데이터를 새 비교 앱에 통째로 복사하지 않습니다.

### 4. 변경 반영 방식 선택

| 변경 범위 | 반영 방식 |
| :--- | :--- |
| 문서·독립 버그 수정 | 기존 앱의 업데이트 브랜치에 해당 차이만 반영. 기존 catalog/state는 유지하고 부분 적용한 원본 commit·파일을 기록 |
| 생성기·feature 원본·공통 연결·의존 계약 변경 | 새 비교 앱을 이행 후보로 삼아 기존 업무 코드를 병합하고 검증. catalog/state/스크립트를 따로 떼어 기존 앱에 덮어쓰지 않음 |

가능하면 이전 원본으로 생성한 미수정 앱, 새 원본으로 생성한 앱, 현재 개발 앱의 세 상태를 비교합니다. 이전→새 원본 차이가 보일러플레이트 변경이고 이전 원본→개발 앱 차이가 사용자 변경입니다. VS Code 비교에서 겹치는 부분은 직접 검토합니다. 이전 버전이 compose를 지원하지 않으면 당시 보관본을 비교 기준으로 사용합니다. 이전 원본이 없다면 현재 앱과 최신 원본의 차이를 모두 원본 변경으로 취급하지 않습니다.

이행 후보에는 업무 코드·제품 식별자·앱/빌드 버전·공개 설정·자산·테스트·CI·필요한 문서를 선택적으로 반영합니다. 개인 설정/키는 로컬에서 다시 연결합니다. 기존 manifest/lock의 사용자 의존성을 기준으로 새 필수 변경만 병합하고 패키지 관리자로 lock을 갱신합니다. lock을 삭제하거나 새 예제 lock으로 통째 교체하지 않습니다. 앱의 Git 이력·remote도 유지하며 다운로드 저장소의 .git을 앱으로 가져오지 않습니다.

새 후보의 생성 연결부·catalog·state는 서로 일치하는 묶음으로 유지합니다. 사용자 변경은 소유가 분리된 파일에서 병합하고 관리 파일/해시를 수정해 충돌을 숨기지 않습니다. 기존 파일에 맞춘 연결을 직접 변경했다면 후속 feature add가 중단될 수 있으므로 별도 복사본에서 실제 추가 경로도 확인합니다. 이미 활성 기능의 재호출은 무변경이므로 신규 추가 경로 검증을 대신하지 못합니다.

### 5. 검증·전환·복귀 기록

아래 업데이트 검사와 관련 실행·권한/데이터·선택 플랫폼 빌드를 수행합니다. 통과한 후보의 코드·lock·catalog/state·도구 스크립트·문서를 앱의 업데이트 브랜치에 함께 반영하고 Git diff를 검토합니다. 원본 변경과 사용자 변경을 분리한 커밋, 적용/보류한 항목, 이전/새 원본 revision, 실제 조합·검사·이행/복귀를 update.md에 남깁니다. 일부만 적용했다면 전체 최신 버전 이행 완료로 표시하지 않습니다.

기존 앱 작업 폴더와 정상 릴리스는 검증 완료까지 보관합니다. native/운영 데이터는 별도 백업으로 복구하며 후보가 실패했다고 기존 앱을 강제 reset하거나 디렉터리 전체로 덮어쓰지 않습니다. 자동 보일러플레이트 업데이트/병합 명령은 현재 제공하지 않습니다.

공식 근거: [Git pull](https://git-scm.com/docs/git-pull), [VS Code 비교·소스 관리](https://code.visualstudio.com/docs/sourcecontrol/overview).

## 업데이트·검사

1. 변경 전 소스 revision·manifest/lock·정상 산출물·별도 저장 데이터를 보관합니다. 보안 수정/지원 종료/기능 추가 중 사유와 마지막 정상 조합을 기록합니다.
2. 별도 브랜치에서 대상 패키지와 필요한 최소 의존성만 변경합니다. 직접 의존성은 선택한 정확한 버전을 manifest에 반영하고 npm install로 lock을 함께 갱신합니다. Node 변경은 .nvmrc와 engines도 맞춥니다. 전역 기본 버전은 바꾸지 않습니다.
3. 갱신된 lock으로 아래 명령을 실행하고 HTTP·통신·IPC·저장·종료 등 영향받은 동작을 확인합니다. GUI·실기기·타 OS·운영 배포 확인은 별도로 기록합니다.

```bash
npm ci
npm run check
npm test
npm run build
```

4. 아래 기록을 갱신하고 앱 package.json.version과 update.md에 변경·이행·복귀 방법을 기록합니다. 변경한 API·설정·데이터 형식의 비호환성을 명시합니다.

## 기능·검증 조합 기록

첫 생성 직후에는 미검증입니다. 표의 미기입 값을 실제 결과로 채우고 버전 변경마다 새 기록을 추가합니다. 기능을 추가해도 과거 통과 행을 수정해 새 조합의 성공으로 표시하지 않습니다.

| 항목 | 기록할 값 |
| :--- | :--- |
| 앱 revision·버전 | 미기입; 미커밋 변경 여부도 기록 |
| 원본 Composer revision | 미기입; 미커밋 원본이면 기준 commit과 변경 묶음 보관 |
| target·base | 미기입; 생성 형태와 선택 구성 |
| feature ID·구현 버전·용도 | 미기입; 원본 기능 목록 기준. 문서 version·npm 패키지 버전과 구분 |
| 선행/충돌 조건 | 함께 필요한 feature 버전, 미지원 target·조합 |
| Node·npm·주요 패키지 | 실제 명령 결과와 manifest/lock의 revision |
| 환경 | 개발/빌드 OS·CPU와 서비스 사용자 OS·브라우저를 구분 |
| 지원 범위 | 공식 최소/최대 또는 상한 미명시/미확정, 근거 링크 |
| 실제 검증 범위 | 최저/최고 OS·브라우저·CPU, 확인한 기능 |
| 날짜·검사·근거 | 미기입; 명령·로그·실행 결과, 실제/모의 검사 구분 |
| 상태·미검증·실패 | 미검증; 테스트/빌드/실행/배포를 구분 |
| 복귀 기준 | 마지막 정상 소스·lock·산출물·데이터 복구 기준 |

Composer 생성 앱에서는 .composer/state.json의 활성 ID와 .composer/catalog를 함께 Git에 보관합니다. 이 ID 목록에는 구현 버전이 자동 기록되지 않습니다. 사용한 원본 기능 버전·용도·호환 조건을 위 기록에 별도로 남깁니다. 기존 catalog에 없는 신규 기능이나 버전으로의 갱신은 add 명령의 역할이 아니며, 새 원본과 비교·이행 검증이 필요합니다.

## 보안 판단·복귀

보안 이슈는 권고 URL·영향 패키지/버전·직접/간접 경로·노출 기능·해결 버전·조치/보류 사유·담당·재점검 날짜를 update.md에 기록합니다. 악용 가능성과 외부 노출을 우선 판단하고 개발 의존성의 빌드 위험도 확인합니다.

실패하면 마지막 정상 revision의 소스·manifest·lock을 함께 복구하고 해당 Node에서 npm ci 후 빌드합니다. 새 데이터 형식을 이전 버전이 읽을 수 있는지 확인하고 필요하면 별도 백업을 복구합니다. 운영 데이터에 Git 복귀를 대신 적용하지 않습니다. 취약한 이전 버전으로의 복귀는 노출 차단·완화책과 수정 재적용 계획을 함께 기록합니다.

## 공식 근거

- [npm audit](https://docs.npmjs.com/cli/commands/npm-audit/)
- [npm ci](https://docs.npmjs.com/cli/commands/npm-ci/)
- [Node 릴리스·지원 정책](https://github.com/nodejs/Release)
