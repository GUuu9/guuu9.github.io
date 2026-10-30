<!-- version: v1.2.0 -->
# GitHub 운영 및 프로젝트 협업 가이드

본 문서는 프로젝트의 초기 설정부터 일상적인 개발 작업, 협업 전략, 그리고 저장소 최적화 및 문제 해결까지의 과정을 상황별 흐름에 따라 정리한 기술 매뉴얼입니다.

---

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

확인일: 2026-10-30. 공식 발급·입력·보관 절차를 확인했으며 실제 토큰 발급·저장·인증은 수행하지 않았습니다.

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
로컬 작업물을 올리고 타인의 작업물을 가져옵니다.
```bash
git pull --ff-only origin <branch> # 분기되지 않은 경우에만 최신 코드 반영
git push origin <branch> # 로컬 커밋 올리기
```

---

## 3단계: 협업과 브랜치 전략 (Branching & Merge)

### 3.1 브랜치 생성 및 이동
신규 기능 개발이나 버그 수정을 위해 독립된 공간을 만듭니다.
```bash
git checkout -b feature/<기능명> # 브랜치 생성 및 즉시 이동
git checkout <branch_name>     # 기존 브랜치로 이동
```

### 3.2 병합 (Merge)
작업이 완료된 브랜치를 메인 브랜치에 합칩니다.
1. `git checkout main` (메인으로 이동)
2. `git pull origin main` (최신 상태 유지)
3. `git merge feature/<기능명>` (기능 합치기)

### 3.3 충돌 해결 (Conflict Resolution)
동일한 코드를 여러 명이 수정했을 때 발생합니다.
1. 충돌 파일 열기
2. `<<<<<<<`, `=======`, `>>>>>>>` 영역 중 남길 코드를 결정하여 수정
3. `git add <file>` -> `git commit` 으로 해결 완료

---

## 4단계: 작업 효율화 및 관리 (Efficiency & Maintenance)

### 4.1 작업 임시 저장 (Stash)
급하게 브랜치를 이동해야 하는데 커밋하기엔 이른 경우 사용합니다.
```bash
git stash                # 현재 작업 임시 저장
git stash list           # 저장 목록 확인
git stash pop            # 가장 최근 저장 내용 복구 및 삭제
```

### 4.2 저장소 최적화 (git gc)
저장소의 용량을 줄이고 명령 실행 속도를 높입니다.
```bash
git count-objects -v     # 용량 상태 점검
git gc                   # 일반적인 저장소 정리; 보통 자동 관리에 맡김
```

### 4.3 원격 브랜치 목록 정리 (Prune)
원격에서 이미 삭제된 브랜치가 로컬에 남아있을 때 정리합니다.
```bash
git remote prune origin
```

---

## 5단계: 히스토리 수정 및 복구 (History Management)

### 5.1 커밋 보완 (Amend)
방금 막 수행한 커밋에 파일을 추가하거나 메시지를 바꿀 때 사용합니다.
```bash
git commit --amend --no-edit # 파일만 추가할 때
git commit --amend -m "메시지 수정"
```

### 5.2 특정 커밋만 가져오기 (Cherry-pick)
다른 브랜치의 특정 작업 건만 현재 브랜치로 복사해옵니다.
```bash
git cherry-pick <commit_id>
```

### 5.3 되돌리기 (Reset vs Revert)
- **Reset**: 특정 시점으로 돌아가고 이후 기록을 삭제 (로컬용)
  `git reset --hard <commit_id>`는 추적 파일의 미커밋 변경을 잃을 수 있으므로 백업·상태 확인 없이 실행하지 않습니다.
- **Revert**: 특정 커밋의 작업을 취소하는 '새 커밋' 생성 (협업용/안전)
  `git revert <commit_id>`

### 5.4 사라진 커밋 복구 (Reflog)
실수로 지운 커밋의 ID를 찾아 복구합니다.
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

#### 6.1.2 수동 배포 (gh-pages 브랜치 사용)
`gh-pages` 패키지를 사용하여 편리하게 배포할 수 있습니다.
1. **패키지 설치**: `npm install gh-pages --save-dev`
2. **스크립트 추가** (`package.json`):
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. **배포 실행**: `npm run deploy`

#### 6.1.3 자동 배포 (GitHub Actions)
`.github/workflows/deploy.yml` 파일을 생성하여 `main` 브랜치 푸시 시 자동 배포되도록 설정할 수 있습니다. (추천 방식)

#### 6.1.4 GitHub 저장소 설정
1. 저장소의 **Settings > Pages** 메뉴로 이동합니다.
2. **Build and deployment > Source**를 설정합니다.
   - **Deploy from a branch**: `gh-pages` 브랜치를 선택합니다.
   - (Actions 사용 시) **GitHub Actions**를 선택합니다.
3. 배포가 완료되면 상단에 생성된 URL을 확인합니다.

#### 6.1.5 주의사항 (SPA 라우팅)
- GitHub Pages는 SPA의 클라이언트 사이드 라우팅을 기본적으로 지원하지 않습니다. 
- 이를 해결하기 위해 `dist/index.html`을 복사하여 `dist/404.html`을 생성하는 트릭이 필요할 수 있습니다.

## 7. Git 태그(Tag) 관리 및 GitHub Release

소프트웨어 배포(릴리즈) 시점에 코드 상태를 고정해두고 싶을 때 Git 태그를 사용하며, 이를 GitHub의 Release 기능과 연동하여 다운로드 패키지를 관리할 수 있습니다.

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

Git은 로컬 소스 기록·브랜치를, GitHub는 원격 저장소·Pull Request·Issue·Release·Actions를 제공합니다. Git 설치·업데이트는 [OS 설정](../00.Setup/OS_Dev_Setting.md)을 따릅니다. GitHub 계정 비밀번호를 Git 인증용 토큰처럼 입력하거나 토큰을 원격 URL에 저장하지 않습니다.

1. 저장소를 clone하고 기본 브랜치에서 `git pull --ff-only`로 최신 상태를 확인합니다.
2. `git switch -c feature/작업명`으로 브랜치를 만들고 파일을 수정합니다.
3. `git diff`, `git status`를 확인하고 필요한 파일만 add한 뒤 커밋합니다.
4. `git push -u origin 브랜치명`으로 올립니다.
5. GitHub에서 base(반영 대상)·compare(작업 브랜치)를 확인해 PR을 만듭니다. 동작 변경·검증 결과를 적고 CI·리뷰를 확인합니다.
6. 프로젝트 정책에 따라 병합한 뒤 로컬 기본 브랜치를 동기화합니다. 병합 방식에 따라 Git이 병합 여부를 판단하는 결과가 다를 수 있으므로 로컬 브랜치 삭제 전 PR 반영을 확인합니다.

push가 거절되면 fetch 후 분기 상태를 확인합니다. 습관적으로 force push하지 않습니다. pull --ff-only가 실패하면 작업을 보존하고 프로젝트가 정한 merge·rebase 방식을 선택합니다.

## 9. 작업 보존·취소·복구

```bash
git diff
git diff --staged
git restore --staged 파일명
```

위 restore --staged는 작업 파일을 유지한 채 스테이징을 취소합니다. `git restore 파일명`은 미커밋 파일 변경을 버리므로 내용 확인·백업 후 사용합니다.

미추적 파일도 임시 보관하려면 `git stash push -u -m "작업 메모"`를 사용합니다. ignored 파일은 포함되지 않습니다. 복원은 `git stash apply`로 먼저 확인하고 문제가 없으면 `git stash drop`으로 제거합니다. stash 충돌도 파일을 검토해 해결해야 합니다.

공유 커밋 취소는 revert를 우선합니다. amend·rebase는 커밋 ID를 바꾸므로 이미 공유한 기록에는 팀 정책 없이 적용하지 않습니다. reflog는 로컬 참조 이동 기록이며 만료되므로 백업을 대신하지 못합니다. 복구할 커밋을 찾으면 reset보다 recovery 브랜치로 먼저 보존합니다.

## 10. 태그·Release·문제 해결

annotated tag는 `git tag -a v1.0.0 -m "릴리스 설명"`, 전송은 `git push origin v1.0.0`으로 합니다. GitHub Releases에서 해당 태그와 변경 설명·빌드 산출물을 연결합니다. 태그는 소스 위치이고 Release 첨부 파일은 별도로 업로드하는 배포물입니다. PR 머지나 태그만으로 자동 배포되는지는 Actions 설정에 달려 있습니다.

| 상황 | 확인 |
| :--- | :--- |
| 인증 실패 | [HTTPS 사용자명·토큰 입력 및 자격증명 갱신](#13-https-인증-username-프롬프트와-토큰), remote URL·권한·토큰 만료 |
| 파일이 커밋에 안 들어감 | git status·git check-ignore·스테이징 여부 |
| 대소문자 파일 충돌 | OS 파일시스템 차이와 git ls-files 확인 |
| 잘못된 브랜치에서 작업 | 커밋·stash로 보존 후 새 브랜치로 이동 |
| 비밀값을 올림 | 키를 먼저 폐기·재발급. 파일 삭제 커밋만으로 과거 기록에서 제거되지 않음 |

공식 참고: [Git 명령](https://git-scm.com/docs), [restore](https://git-scm.com/docs/git-restore), [reflog](https://git-scm.com/docs/git-reflog), [GitHub PR](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request).
