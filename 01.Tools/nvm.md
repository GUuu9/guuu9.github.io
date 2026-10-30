<!-- version: v1.2.0 -->
# nvm·nvm-windows 사용 가이드

확인일: 2026-10-28. Node.js를 프로젝트 요구 버전에 맞춰 설치·선택합니다. npm은 선택한 Node와 함께 제공되며, React·Electron·TypeScript 패키지는 프로젝트의 package.json과 잠금 파일로 관리합니다.

## 두 도구의 차이

| 항목 | macOS·Linux nvm | Windows nvm-windows |
| :--- | :--- | :--- |
| 구현 | 셸에 로드하는 함수 | Windows 실행 파일·심볼릭 링크 |
| 버전 영향 | 현재 셸 | 다른 Windows 셸에도 영향을 줄 수 있음 |
| 프로젝트 버전 | `.nvmrc`를 `nvm use`로 읽음 | `.nvmrc`를 읽고 버전을 직접 지정 |
| 기본값 | `nvm alias default 버전` | Unix alias 명령을 사용하지 않음 |

WSL은 Windows nvm-windows 대신 WSL 내부에 Unix nvm을 설치합니다. OS별 설치는 [00.Setup](../00.Setup/OS_Dev_Setting.md)을 참고합니다.

## macOS·Linux 기본 흐름

```bash
nvm --version
nvm ls
```

초기 기본 Node 설치는 Setup에서 완료합니다. 기존 프로젝트를 복원할 때는 최신 LTS를 추가 설치하지 않고 요구 버전을 먼저 선택합니다. `.nvmrc`가 있으면 프로젝트 루트에서:

```bash
nvm install
nvm use
```

`.nvmrc`가 없으면 README·engines·CI에서 버전을 찾습니다. 예를 들어 Node 22를 요구하면 `nvm install 22`, `nvm use 22`로 선택합니다. 이 숫자는 예시이며 모든 프로젝트의 권장 버전을 뜻하지 않습니다. 버전 선택 뒤에는 [공통 의존성 복원](#선택한-node로-프로젝트-의존성-복원)으로 이동합니다.

## 프로젝트 버전 고정

macOS·Linux에서는 원하는 버전을 선택한 뒤 `node --version > .nvmrc`로 현재 정확한 버전을 기록할 수 있습니다. Git에 포함하기 전에 프로젝트의 기존 버전 정책을 확인합니다. CI에서도 같은 버전 파일을 사용하게 맞춥니다.

`nvm alias default 버전`은 새 셸의 기본 Node를 정합니다. `.nvmrc`가 있어도 폴더 이동만으로 자동 전환되지는 않으므로 `nvm use`를 실행합니다. 셸 자동 전환 훅은 필요할 때만 추가합니다.

## Windows 기본 흐름

```powershell
nvm version
nvm list
```

프로젝트의 `.nvmrc`·README·engines·CI에서 정확한 요구 버전을 확인합니다. `nvm list`에 없다면 `nvm install 버전`으로 추가하고 `nvm use 버전`으로 선택합니다. 심볼릭 링크 변경에 권한이 필요하면 관리자 PowerShell을 사용합니다.

## 선택한 Node로 프로젝트 의존성 복원

위 OS별 버전 선택을 마친 뒤 프로젝트 루트에서 실행합니다. macOS·Linux·Windows 모두 같은 흐름입니다.

```bash
node --version
npm --version
npm ci
npm run
```

`npm ci`는 npm 프로젝트에 `package-lock.json`이 있을 때 사용합니다. 없다면 기존 README·패키지 관리자를 확인하고 npm 프로젝트일 때만 `npm install`을 사용합니다. 잠금 파일 삭제·재생성이나 의존성 최신화를 복원 절차에 넣지 않습니다. `npm run`으로 실제 스크립트를 확인한 뒤 프로젝트의 실행·테스트·빌드를 진행합니다. PowerShell에서 정책으로 차단되면 `npm.cmd`를 사용합니다.

nvm은 Node 경로를 선택하므로 특정 버전의 `bin` 폴더를 PATH에 영구 고정하지 않습니다. Unix nvm은 설치기가 추가한 `NVM_DIR`·`nvm.sh` 초기화로 로드하며 `which node`만으로 nvm 로딩을 확인하지 말고 `command -v nvm`도 확인합니다. Windows는 설치기가 설정한 `NVM_HOME`·`NVM_SYMLINK`와 사용자/시스템 PATH를 먼저 확인하고 경로를 임의로 바꾸지 않습니다.

## 전역 npm 도구와 Electron

```bash
npm list -g --depth=0
npm prefix -g
```

전역 패키지는 Node 버전 전환 후 동일하게 보이지 않을 수 있습니다. Codex 같은 CLI가 사라지면 현재 Node의 설치 위치부터 확인합니다. TypeScript·React·Electron은 전역 설치하지 않고 프로젝트의 npm scripts로 실행합니다.

Electron 네이티브 모듈은 Node 버전뿐 아니라 Electron ABI·CPU·OS에도 영향을 받습니다. Node 전환 후 프로젝트의 `npm ci`와 postinstall·rebuild 절차를 따릅니다. macOS·Windows·Linux 사이에서 node_modules를 공유하지 않습니다.

## 업데이트·복귀·제거

nvm 자체는 공식 설치 안내의 최신 태그 스크립트를 다시 실행해 갱신합니다. nvm-windows는 공식 새 설치 프로그램을 사용합니다. Node는 새 버전을 추가 설치해 테스트한 뒤 `.nvmrc`·CI를 변경합니다. 새 버전이 실패하면 `nvm use 이전버전`과 기존 잠금 파일로 의존성을 다시 복원합니다.

npm은 선택한 Node에 포함된 버전을 우선합니다. 별도 변경이 필요하면 Node 호환성을 확인한 뒤 `npm install -g npm@버전`으로 갱신하며 nvm에서 sudo npm을 사용하지 않습니다. 프로젝트 패키지는 npm outdated로 확인하고 npm update 또는 npm install 패키지@목표버전으로 변경합니다. manifest·lockfile을 함께 검토하고 실행·테스트·빌드로 검증합니다. 메이저 변경은 해당 도구의 마이그레이션 안내를 따릅니다.

사용 중이 아닌 버전은 `nvm uninstall 버전`으로 제거합니다. Unix nvm은 다른 버전으로 전환한 뒤 제거합니다. 전역 CLI와 기존 프로젝트가 그 버전을 사용하지 않는지 먼저 확인합니다.

## 문제 해결

| 상황 | 확인 |
| :--- | :--- |
| nvm을 찾지 못함 (Unix) | 셸 설정의 NVM_DIR·nvm.sh 로드, 새 터미널, `command -v nvm` |
| Node가 바뀌지 않음 | Unix는 `which -a node`, Windows는 `where.exe node`로 단독 설치·PATH 충돌 확인 |
| npm.ps1 정책 차단 | PowerShell에서 `npm.cmd` 사용. 전역 정책 해제는 피함 |
| Windows 전환 실패 | 설치 경로·심볼릭 링크 경로 충돌·권한 확인 |
| VS Code만 다른 버전 | 새 통합 터미널에서 nvm 선택 후 node·npm 버전 재확인 |

공식 참고: [nvm](https://github.com/nvm-sh/nvm), [nvm-windows](https://github.com/coreybutler/nvm-windows).
