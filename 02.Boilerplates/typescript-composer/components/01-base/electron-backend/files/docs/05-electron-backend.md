<!-- version: v0.1.0 -->
# Electron backend 구성품

기준 뼈대에 Main·Preload·제한된 IPC·중간 확인 화면·패키징 설정을 추가합니다. HTTP 진입점은 별도 유지하며 Electron 실행은 HTTP 서버를 시작하지 않습니다.

## 1. 파일·패키지 연결

이 문서는 files 내용을 프로젝트에 적용한 상태에서 시작합니다. 기존 파일은 비교·병합합니다. docs/03-build-and-release.md는 HTTP 배포 설명을 데스크톱 배포 설명으로 대체합니다. 추가되는 경로는 src/backend/electron.ts·bridge/greeting/greeting.ipc.ts 및 handler, src/preload/index.ts, src/shared/desktop.ts, tsconfig.electron.json, desktop-shell, scripts/copy-desktop-shell.mjs, electron-builder.yml, IPC 테스트·이 문서입니다.

프로젝트 루트·.nvmrc Node에서 실행합니다. Electron·esbuild는 기존 샘플 계열에서 고정하고 packager는 공식 npm 버전을 확인했습니다.

```bash
npm install --save-dev --save-exact electron@45.1.0 esbuild@0.28.2 electron-builder@26.18.0
npm pkg set 'main=dist/backend/electron.js'
npm pkg set 'scripts.build:electron=tsc -p tsconfig.electron.json && esbuild src/preload/index.ts --bundle --platform=node --format=cjs --outfile=dist/preload/index.cjs --external:electron && node scripts/copy-config.mjs'
npm pkg set 'scripts.build:desktop-backend=npm run build:electron && node scripts/copy-desktop-shell.mjs'
npm pkg set 'scripts.start:desktop=electron .'
npm pkg set 'scripts.package:desktop=electron-builder --dir' 'scripts.release:desktop=electron-builder'
```

.gitignore에 release/를 추가합니다. 패키징은 다른 프로젝트의 node_modules 링크 대신 대상 프로젝트에서 npm ci로 준비한 독립 의존성을 사용합니다. package.json·lock·소스는 프로젝트 안에서 유지하고 구성품의 외부 경로를 참조하지 않습니다. 설치 스크립트를 차단한 환경에서는 Electron 실행 파일 다운로드를 공식 설치 절차로 승인·완료해야 start/package가 가능합니다. 타입 설치만으로 실행 파일이 준비됐다고 판단하지 않습니다.

## 2. 실행·IPC 경계

```bash
npm run build:desktop-backend
npm test
npm run start:desktop
```

이 단계의 화면은 연결 안내만 표시합니다. 실제 greeting 호출은 일반 frontend를 연결한 뒤 확인합니다. Main → createDI → greeting Usecase를 구성하고 registerGreetingIpc가 허용한 webContents·mainFrame·정확한 로컬 페이지 URL에서만 호출을 받습니다. 입력 검증·내부 오류 상세 비노출을 유지합니다.

Preload는 greet 한 메서드만 노출합니다. 창은 contextIsolation·sandbox 활성, nodeIntegration 비활성이고 새 창·임의 페이지 탐색은 거부합니다. 모든 창 종료 시 앱을 종료하는 샘플이며 macOS 창 재활성화 동작은 추가하지 않습니다. handler는 창 종료·앱 종료 시 해제합니다.

## 3. 패키징·배포·지원

일반 화면 또는 게임 구성품까지 연결한 뒤 빌드·로컬 창 실행을 먼저 확인합니다.

```bash
npm run package:desktop
npm run release:desktop
```

package는 release/에 로컬 실행 묶음을, release는 설정된 OS 형식(macOS dmg·Windows nsis·Linux AppImage)을 생성합니다. 현재 OS용 생성이 기본입니다. mac.identity는 null로 고정하여 로컬 인증서를 자동 선택하지 않으며 기본 결과는 미서명입니다. 실제 서명은 배포자가 명시적으로 설정합니다. electron-builder.yml의 예시 appId·productName을 고유 앱 식별자로 바꾸고 필요하면 CPU 타깃도 고정합니다. 다른 OS 생성·서명·스토어 제출은 추가 도구·인증과 검증이 필요합니다. 인증서·서명 키는 저장소에 넣지 않습니다. 미서명 산출물을 스토어 제출 성공으로 표현하지 않습니다.

개발 빌드 확인 환경은 macOS 13.7.8 x64·외부 Node 24.22.1입니다. 실제 Electron 45 런타임의 OS/CPU 최소·최대, 실제 실행 검증 최저/최고는 아직 미확정/미검증입니다. .nvmrc의 Node와 앱 안에 포함되는 Electron Node를 구분합니다. 배포 전 고정 Electron의 공식 지원 조건과 대상 OS에서 창·Preload·IPC·설치/삭제를 확인합니다.

업데이트 전 정상 release 묶음·manifest·lock·설정을 보관하고 같은 릴리스 단위로 복귀합니다. 삭제 시 앱 사용자 데이터는 따로 보존합니다. 이 기본 구성품은 사용자 데이터 쓰기를 추가하지 않습니다. 제거할 때 main·desktop 명령·Main/Preload/shared·packager 설정·미사용 dev 패키지를 함께 해제합니다.

프로젝트 README·project-agents.md·update.md에 새 실행 경로·보안 경계·검증과 복귀를 기록합니다. 공식 근거: [Electron 보안](https://www.electronjs.org/docs/latest/tutorial/security), [Electron 설치](https://www.electronjs.org/docs/latest/tutorial/installation), [electron-builder 설정](https://www.electron.build/configuration/configuration).

## 검증 기록 — 2026-11-04

macOS 13.7.8 x64·Node 24.22.1에서 확인했습니다. Main·Preload 빌드와 IPC 신뢰/입력/내부 오류 경계 테스트를 통과했습니다. 검증용 npm 설치 스크립트는 생략했고, 별도 게임 조합의 electron-builder가 공식 바이너리를 내려받아 macOS x64 미서명 앱 디렉터리를 생성했습니다. 실제 창·Preload runtime·설치·서명·다른 OS는 미검증입니다.

추가 도구를 포함한 전체 임시 조합의 npm 감사에서 개발 의존성 moderate 15건, runtime 의존성 0건이 보고됐습니다. 강제 갱신하지 않았으며 배포 전 개발 도구의 해결 가능 버전을 재검토해야 합니다.
