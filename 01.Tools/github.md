<!-- version: v2.0.0 -->
# GitHub 운영 및 프로젝트 협업 가이드

Git 설치, 저장소 사용, GitHub 인증·협업 절차를 안내합니다.

---

## Windows Git 설치

[Git 공식 Windows 설치 안내](https://git-scm.com/install/windows)의 배포처를 사용합니다.

[Windows 기본 환경·PATH](./shell-environment.md#windows-환경-변수path)를 먼저 확인합니다. 기존 도구는 `Get-Command`·`where.exe`로 설치 경로를 확인하고 개인 PC의 일반 PowerShell에서 진행합니다.

```powershell
winget --version
winget install --id Git.Git -e --source winget
```

설치기가 권한을 요구하면 해당 설치에 한해 승인합니다. 새 PowerShell에서 `git --version`을 확인합니다.

## 1단계: 프로젝트 시작하기 (Initial Setup)

### 1.1 최초 환경 설정
컴퓨터에 Git 사용자 정보를 등록합니다.
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 1.2 저장소 준비
- **새 프로젝트 시작**: `git init` -> `git remote add origin <url>`
- **기존 프로젝트 참여**: `git clone <repository_url>`

### 1.3 HTTPS 인증: Username 프롬프트와 토큰

개인 PC의 macOS·Linux 터미널 또는 Windows PowerShell에서 GitHub의 HTTPS 저장소에 접근할 때 적용합니다. Git은 먼저 설치되어 있어야 합니다. `git config user.name`·`user.email`은 커밋 작성자 정보이며 GitHub 로그인 인증과는 별개입니다.

`git clone`·`git pull`·`git push` 중 아래 프롬프트가 나오면 **Username에는 GitHub 계정 사용자명**, **Password에는 Personal Access Token(PAT)**을 입력합니다. Password 입력 중 문자가 화면에 보이지 않아도 정상입니다. GitHub 계정 비밀번호는 Git의 HTTPS 인증에 사용하지 않습니다.

```text
Username for 'https://github.com': <GitHub 사용자명>
Password for 'https://<GitHub 사용자명>@github.com': <발급한 PAT를 이 입력란에 붙여넣기>
```

위는 입력 위치를 설명하는 예시이며 셸 명령이 아닙니다. PAT는 비밀번호 입력란에만 붙여넣고 명령 인자·원격 URL·문서·스크린샷·로그에 넣지 않습니다. [GitHub 공식 토큰 사용 안내](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#using-a-personal-access-token-on-the-command-line).

#### 토큰 발급과 최소 권한

1. GitHub 웹사이트의 프로필 → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**을 엽니다.
2. 용도를 알아볼 이름과 만료일을 정하고 **Resource owner**에 저장소 소유 개인 계정 또는 조직을 선택합니다.
3. **Repository access → Only select repositories**에서 필요한 저장소만 선택합니다.
4. **Repository permissions → Contents**는 비공개 저장소 clone·fetch·pull만 필요하면 **Read-only**, 일반 소스 push도 필요하면 **Read and write**로 설정합니다. 워크플로 파일 변경 등 별도 작업은 필요한 권한을 추가로 확인합니다.
5. 조직이 승인을 요구하면 승인 상태를 확인한 뒤 사용합니다. **Generate token**으로 발급한 값은 안전한 비밀번호 관리자에 보관합니다. 생성 화면을 닫으면 토큰 값을 다시 볼 수 없습니다.

토큰은 계정이 가진 저장소 권한을 넘는 접근 권한을 만들지 않습니다. 외부 협업자 등 fine-grained 토큰의 지원 제한에 해당하면 GitHub의 제한 사항과 조직 정책을 먼저 확인합니다. 필요한 경우에만 classic 토큰을 검토하고 전체 권한을 일괄 부여하지 않습니다. [발급 절차·지원 제한](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

#### 인증정보 보관·교체·확인

이미 Git Credential Manager(GCM)의 브라우저 로그인을 사용 중이면 그 인증 흐름을 유지합니다. GCM은 PAT를 수동 발급하지 않고도 인증을 관리할 수 있습니다. PAT를 직접 입력하는 방식과 구분합니다.

| 환경 | 보관·교체 방법 |
| :--- | :--- |
| macOS | 기존 `osxkeychain` 헬퍼 또는 GCM의 키체인 보관을 사용합니다. 만료된 PAT가 남아 있으면 키체인 접근에서 해당 GitHub 계정 항목만 확인해 갱신하거나 제거한 뒤 재인증합니다. |
| Windows | Git for Windows의 GCM을 사용합니다. 잘못 저장된 인증정보는 Windows 자격 증명 관리자에서 해당 GitHub 계정 항목만 제거하고 재인증합니다. |
| Linux | GCM을 사용한다면 공식 안내에 따라 비밀 저장소도 구성합니다. 설치만으로 안전한 영구 저장소가 준비된다고 가정하지 않습니다. |

기존 인증 구성을 확인하지 않고 `credential.helper`를 일괄 덮어쓰지 않습니다. PAT를 평문 파일에 남기는 `credential.helper store`를 기본 설정으로 사용하지 않습니다. [GitHub 인증정보 보관 안내](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git) · [macOS 키체인 갱신](https://docs.github.com/en/get-started/git-basics/updating-credentials-from-the-macos-keychain).

기존 저장소 폴더에서 읽기 접근을 확인하려면 다음을 실행합니다. 토큰 값은 명령에 포함하지 않습니다.

```bash
git ls-remote origin
```

이 검사는 원격 참조를 조회하며 push 권한까지 검증하지 않습니다. 공개 저장소 조회는 인증 없이 성공할 수 있으므로 PAT 검증 결과로 해석하지 않습니다. 인증을 요구하지 않는 공개 저장소를 clone할 때 프롬프트가 나오면 우선 URL의 철자·소유자·저장소 존재 여부를 확인합니다.

인증 실패 시 토큰 만료·선택한 저장소·Contents 권한·계정 자체 권한·조직 승인/SSO 정책과 저장된 이전 인증정보를 확인합니다. SSH 형식인 `git@github.com:...` 원격은 PAT 대신 SSH 키를 사용합니다. PAT가 노출되면 GitHub 설정에서 즉시 폐기하고 재발급한 뒤 자격증명 저장소도 갱신합니다.

공식 안내: [Fine-grained PAT 발급·사용](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

---

## 2단계: 일상적인 개발 흐름 (Daily Workflow)

### 2.1 변경 사항 확인 및 스테이징
작업 중인 파일의 상태를 확인하고 커밋할 준비를 합니다.
```bash
git status               # 현재 변경된 파일 목록 확인
git add <file>           # 특정 파일 스테이징
git add .                # 변경된 모든 파일 스테이징
```

### 2.2 커밋 (기록 남기기)
의미 있는 단위로 작업 내용을 기록합니다.
```bash
git commit -m "feat: [COMMIT_0000X] 기능 설명"
```

### 2.3 원격 저장소 동기화
로컬 작업물을 올리고 타인의 작업물을 가져옵니다. 미커밋 변경을 유지하면서 원격 업데이트만 받을 때는 [로컬 작업 보존 후 업데이트](#24-로컬-변경을-올리지-않고-github-업데이트-받기)를 먼저 따릅니다.
```bash
git pull --ff-only origin <branch> # 분기되지 않은 경우에만 최신 코드 반영
git push origin <branch> # 로컬 커밋 올리기
```

### 2.4 로컬 변경을 올리지 않고 GitHub 업데이트 받기

개인 PC의 macOS·Linux 터미널 또는 Windows PowerShell에서 **대상 저장소 루트**에서 실행합니다. 아래는 현재 브랜치가 `main`, 원격이 `origin/main`이며 로컬 커밋이 원격보다 앞서 있지 않은 경우입니다. 명령은 한 단계씩 결과를 확인하며 진행하고, 브랜치가 다르면 실제 이름으로 바꿉니다. 이 절차는 commit·push하지 않고 원격 커밋과 로컬 미커밋 변경을 함께 유지합니다.

#### 1. 현재 작업 백업·원격 변경 확인

```bash
git status --short --branch
git diff
git diff --staged
git fetch origin
git log --oneline HEAD..origin/main
git log --oneline origin/main..HEAD
git diff --stat HEAD origin/main
```

수정 파일·미추적 파일과 Git 제외 파일 중 보존할 자료를 **저장소 밖 별도 위치에 복사**하고 원래 스테이징 상태·현재 HEAD도 기록합니다. 이 저장소의 `issues/` 로컬 메모도 별도 백업합니다. 임시 폴더는 영구 백업을 대신하지 않습니다. 원격과 로컬 양쪽에 새 커밋이 있으면 단순 fast-forward가 불가능하므로 아래 병합을 강행하지 말고 프로젝트 정책에 맞는 merge·rebase를 별도 선택합니다.

`fetch`는 원격 추적 정보를 갱신하며 현재 작업 파일을 병합하지 않습니다. HTTPS 인증을 요구하면 [사용자명·PAT 안내](#13-https-인증-username-프롬프트와-토큰)를 따릅니다.

#### 2. 미커밋 작업 임시 보관

```bash
git stash push -u -m "local-work-before-remote-update"
git stash list
git status --short
```

stash 생성 성공을 확인하고 방금 만든 항목을 기록합니다. **보관할 변경이 없어 새 stash가 생성되지 않았다면 기존 stash를 적용하지 않습니다.** `-u`는 미추적 파일까지 보관하지만 ignored 파일은 포함하지 않습니다. ignored 파일을 포함하는 `-a`를 기본으로 사용하지 않습니다. 로컬 `.gitignore` 변경을 stash하면서 제외 규칙이 일시적으로 사라지면 메모가 미추적 파일로 보일 수 있으므로 add·삭제하지 않고 유지합니다.

#### 3. 원격 커밋 반영 후 로컬 작업 복원

```bash
git merge --ff-only origin/main
```

성공한 뒤에만 기록한 stash를 적용합니다. 아래 `'stash@{0}'`은 **방금 만든 stash가 여전히 가장 최근 항목일 때**의 예시이며 중간에 다른 stash를 만들었다면 목록에서 실제 항목을 다시 확인합니다. PowerShell에서도 중괄호가 있는 참조를 따옴표로 감쌉니다.

```bash
git stash apply 'stash@{0}'
git status --short
```

`--ff-only`가 실패하면 stash와 백업을 유지한 채 중단하고 분기 상태를 확인합니다. `reset --hard`로 맞추거나 다시 pull하지 않습니다. `apply`는 stash를 남겨두므로 `pop`보다 복원 내용을 검토하기 쉽습니다. 기존 스테이징 구분까지 복원해야 하면 `apply --index`가 필요할 수 있지만 충돌 시 실패할 수 있으므로 기록한 상태와 별도 비교합니다.

#### 4. 충돌 해결·검증

충돌이 나면 같은 stash를 다시 적용하지 않습니다. 파일의 `<<<<<<<`·`=======`·`>>>>>>>` 구간을 편집해 원격 업데이트와 필요한 로컬 변경을 함께 남긴 뒤 해결한 파일만 `git add`합니다. 예를 들어 이 저장소의 macOS 공통 문서라면 다음과 같습니다.

```bash
git add 00.Setup/macOS_Common_Dev_Setting.md
```

문서 첫 줄 버전도 양쪽 변경 내용을 기준으로 결정합니다. 예를 들어 원격이 `v3.0.0`이고 로컬 변경이 안내 링크 추가라면 `v3.0.1`로 조정할 수 있습니다. 원격의 새 절차를 구버전 내용으로 통째로 덮어쓰지 않습니다. **stash 적용 충돌 해결은 이 단계에서 새 병합 커밋을 만들 필요가 없습니다.**

전체 로컬 변경을 미스테이징 상태로 남기려는 경우에만 `git restore --staged -- .`를 사용합니다. 작업 파일은 유지되지만 원래의 스테이징 구분도 풀리므로 그대로 유지해야 하는 작업에는 일괄 적용하지 않습니다. 마지막으로 백업과 수정·미추적·ignored 파일을 비교하고 확인합니다.

```bash
git diff --check
git diff --name-only --diff-filter=U
git status --short --branch
git diff
git diff --staged
```

충돌 파일 목록이 비어 있고 로컬 변경·메모가 보존됐는지 확인합니다. 문서는 링크·앵커·코드 블록, 실제 설정은 해당 프로젝트의 테스트·빌드도 확인합니다. `issues/` 메모는 `git check-ignore -v issues/gradle-version-management-notes.md`로 제외 상태를 확인할 수 있습니다. 이 경로는 예시이며 실제 로컬 파일로 바꿉니다.

검증이 끝날 때까지 stash와 외부 백업은 유지합니다. 더 이상 필요 없을 때만 `git stash list`로 정확한 항목을 다시 확인한 뒤 `git stash drop 'stash@{0}'`처럼 해당 항목만 제거합니다. `git stash clear`로 전체를 지우지 않습니다.

절차·명령 확인일: 2026-11-02. [fetch](https://git-scm.com/docs/git-fetch) · [stash](https://git-scm.com/docs/git-stash) · [fast-forward 병합](https://git-scm.com/docs/git-merge) · [스테이징 복원](https://git-scm.com/docs/git-restore).

---

## 3단계: 협업과 브랜치 전략 (Branching & Merge)

### 3.1 브랜치 생성 및 이동
```bash
git checkout -b feature/<기능명> # 브랜치 생성 및 즉시 이동
git checkout <branch_name>     # 기존 브랜치로 이동
```

### 3.2 병합 (Merge)
`main`을 갱신한 뒤 작업 브랜치를 병합합니다.

```bash
git switch main
git pull --ff-only origin main
git merge feature/<기능명>
```

### 3.3 충돌 해결 (Conflict Resolution)
충돌 표시를 정리하고 해결한 파일을 스테이징한 뒤 커밋합니다.

---

## 4단계: 작업 효율화 및 관리 (Efficiency & Maintenance)

### 4.1 작업 임시 저장 (Stash)
급한 브랜치 이동과 미커밋 변경 보관은 [원격 업데이트 절차의 stash 보관·복원](#24-로컬-변경을-올리지-않고-github-업데이트-받기)을 따른다. 미추적·ignored 파일 범위와 복원 확인 후 제거 순서를 같은 절에서 관리한다.

### 4.2 저장소 최적화 (git gc)

```bash
git count-objects -v
git gc
```

### 4.3 원격 브랜치 목록 정리 (Prune)

원격에서 삭제한 브랜치 참조를 정리합니다.
```bash
git remote prune origin
```

---

## 5단계: 히스토리 수정 및 복구 (History Management)

### 5.1 커밋 보완 (Amend)

```bash
git commit --amend --no-edit # 파일만 추가할 때
git commit --amend -m "메시지 수정"
```

### 5.2 특정 커밋만 가져오기 (Cherry-pick)

```bash
git cherry-pick <commit_id>
```

### 5.3 되돌리기 (Reset vs Revert)
- **Reset**: 로컬 커밋을 이동합니다. `--hard`는 미커밋 변경도 지우므로 주의합니다.
- **Revert**: 공유 커밋을 취소하는 새 커밋을 만듭니다.
  `git revert <commit_id>`

### 5.4 사라진 커밋 복구 (Reflog)

```bash
git reflog
git branch recovery/<name> <reflog_id> # 복구 브랜치로 먼저 보존
```

---

## 6단계: 프로젝트 표준 (Standards)

### 6.1 GitHub Pages 배포 가이드 (Deployment)
Vite 기반 웹 프로젝트를 GitHub Pages에 배포하여 데모 또는 웹 버전을 공유할 수 있습니다.

#### 6.1.1 프로젝트 설정 (Vite)
GitHub Pages는 하위 경로에서 실행되는 경우가 많으므로 `vite.config.ts` 파일에서 저장소 URL 구조에 맞게 base 경로를 설정합니다. 아래는 상대 경로를 선택한 예시입니다.
```typescript
// vite.config.ts
export default defineConfig({
  base: './', // 빌드된 자산이 상대 경로를 참조하도록 설정
  // ...
});
```

#### 6.1.2 자동 배포 (GitHub Actions)
[Vite 공식 GitHub Pages 배포 예제](https://vite.dev/guide/static-deploy.html#github-pages)의 워크플로를 프로젝트의 `.github/workflows/deploy.yml`에 적용합니다. 기존 워크플로가 있으면 재사용하고 중복 파일을 만들지 않습니다.

1. 저장소의 Settings → Pages → Source에서 **GitHub Actions**를 선택합니다.
2. 공식 예제의 의존성 설치·빌드·산출물 업로드·배포 단계를 사용하되, 대상 브랜치·Node 버전·잠금 파일·출력 경로를 프로젝트에 맞춥니다. `pages: write`·`id-token: write`와 배포 environment 설정도 포함합니다.
3. 변경을 push한 뒤 Actions의 빌드·배포 성공과 실제 Pages URL을 확인합니다. 실패하면 워크플로 로그를 확인하며 파일을 만드는 것만으로 배포가 끝났다고 판단하지 않습니다.

`dist`를 출력하는 npm 기반 Vite 프로젝트 예시입니다. 다른 빌드 도구는 프로젝트 CI를 따릅니다.

#### 6.1.3 SPA 라우팅
- GitHub Pages는 SPA의 클라이언트 사이드 라우팅을 기본적으로 지원하지 않습니다.
- 이를 해결하기 위해 `dist/index.html`을 복사하여 `dist/404.html`을 생성하는 트릭이 필요할 수 있습니다.

## 7. Git 태그(Tag) 관리 및 GitHub Release

릴리스 시점의 소스를 태그로 기록하고 GitHub Release에 설명·배포 파일을 연결한다. 설명을 포함하는 annotated tag는 `git tag -a v1.0.0 -m "릴리스 설명"`으로 만든다. 아래는 lightweight tag와 전송·조회 명령이다.

### 7.1 로컬에서 태그 관리
* **태그 생성**: 현재 커밋 시점에 태그를 생성합니다.
  ```bash
  git tag v0.0.0
  ```
* **태그 목록 조회**:
  ```bash
  git tag
  ```
* **태그 삭제**:
  ```bash
  git tag -d v0.0.0
  ```

### 7.2 원격 저장소 (GitHub) 로 태그 전송 (Push)
기본 `git push` 명령은 태그를 자동으로 업로드하지 않기 때문에 별도의 명령어를 사용해야 합니다.
* **특정 태그 푸시**:
  ```bash
  git push origin v0.0.0
  ```
* **로컬의 모든 태그 푸시**:
  ```bash
  git push origin --tags
  ```
* **원격 태그 삭제**:
  ```bash
  git push origin --delete v0.0.0
  ```

### 7.3 원격 태그 확인·복원

```bash
git ls-remote --tags origin
git fetch origin --tags
git show v1.0.0
git switch --detach v1.0.0
```

출력은 커밋 해시와 refs/tags/태그명으로 구성됩니다. annotated tag는 추가 ^{} 항목이 보일 수 있습니다. detached HEAD에서 수정 내용을 보관하려면 `git switch -c fix/from-v1`로 브랜치를 만듭니다. 태그에서 새 브랜치를 바로 만들려면 `git switch -c fix/from-v1 v1.0.0`을 사용합니다.

`git clone --branch 태그명 저장소URL`도 가능합니다. 태그를 지정하면 detached HEAD로 체크아웃되므로 변경할 경우 브랜치를 만듭니다. 릴리스 태그를 나중에 다른 커밋으로 바꾸기보다 수정 릴리스를 새 태그로 남깁니다.

## 8. Git과 GitHub의 역할·PR 작업 흐름

Git은 로컬 기록·브랜치를, GitHub는 원격 저장소·PR·Issue·Release·Actions를 관리합니다. PR은 작업 브랜치를 push한 뒤 GitHub에서 base·compare를 확인해 엽니다. CI·리뷰 후 병합하고 기본 브랜치를 동기화합니다.

## 9. 작업 보존·취소·복구

```bash
git diff
git diff --staged
git restore --staged 파일명
```

`git restore --staged`는 스테이징만 취소합니다. `git restore 파일명`은 미커밋 변경을 버립니다.

임시 보관·stash 충돌은 [원격 업데이트 전 보존 절차](#24-로컬-변경을-올리지-않고-github-업데이트-받기)를 따릅니다. 공유 커밋 취소에는 revert를 사용합니다.

## 10. 태그·Release·문제 해결

태그는 소스 위치를, Release 첨부 파일은 배포물을 가리킵니다. 자동 배포는 프로젝트 Actions 설정을 확인합니다.

| 상황 | 확인 |
| :--- | :--- |
| 인증 실패 | [HTTPS 사용자명·토큰 입력 및 자격증명 갱신](#13-https-인증-username-프롬프트와-토큰), remote URL·권한·토큰 만료 |
| 파일이 커밋에 안 들어감 | git status·git check-ignore·스테이징 여부 |
| 대소문자 파일 충돌 | OS 파일시스템 차이와 git ls-files 확인 |
| 잘못된 브랜치에서 작업 | 커밋·stash로 보존 후 새 브랜치로 이동 |
| 비밀값을 올림 | 키를 먼저 폐기·재발급. 파일 삭제 커밋만으로 과거 기록에서 제거되지 않음 |

공식 참고: [Git 명령](https://git-scm.com/docs), [restore](https://git-scm.com/docs/git-restore), [reflog](https://git-scm.com/docs/git-reflog), [GitHub PR](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request).

제거 후 숨김 설정·캐시·셸 초기화 항목까지 정리하려면 [도구별 제거·잔여 파일 관리](./uninstall-cleanup.md)를 함께 확인합니다.

Windows winget으로 설치한 Git은 개인 PowerShell에서 `winget upgrade --id Git.Git -e`로 개별 갱신할 수 있습니다. 설치 경로·인증 관리와 프로젝트 호환성을 먼저 확인하고 필요한 관리자 권한은 설치기 안내를 따릅니다.
