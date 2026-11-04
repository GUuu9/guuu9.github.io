<!-- version: v2.0.0 -->
# 데스크톱 빌드·배포

이 문서는 Electron 구성품을 적용한 프로젝트의 배포 기준입니다. HTTP 서버용 배포 절차를 대체합니다. 실제 실행·설치·서명·스토어 제출은 아직 검증되지 않았습니다.

## 빌드와 산출물

프로젝트 .nvmrc의 Node에서 의존성을 복원합니다. 기본 shell은 build:desktop-backend, 일반 화면·게임 조합은 build:desktop을 사용합니다.

```bash
npm ci
npm run build:desktop
npm test
npm run test:frontend
npm run start:desktop
npm run package:desktop
npm run release:desktop
```

화면·game·Preload·IPC 검증 후 package/release로 진행합니다. package:desktop은 OS별 실행 디렉터리, release:desktop은 dmg·nsis·AppImage 설정에 맞는 산출물을 release/에 만듭니다. Electron backend 중간 shell에서는 frontend 테스트 명령이 없으므로 해당 명령은 화면 조합 후 사용합니다.

package.json의 main은 dist/backend/electron.js, Preload는 dist/preload/index.cjs, 화면은 dist/frontend입니다. electron-builder.yml의 appId·productName과 package.json name/productName을 실제 프로젝트 식별자로 확정합니다. 설치 패키지에는 앱의 고정 runtime 의존성을 포함하고 개인 .env·키·사용자 데이터는 포함하지 않습니다.

mac.identity는 null로 설정하여 기본 결과를 미서명으로 생성합니다. 서명할 때만 인증서와 설정을 명시적으로 선택합니다. 별도 게임 조합에서 macOS x64 앱 디렉터리와 ASAR 포함/제외 경계를 확인했으며 dmg·설치·실행·서명 성공을 의미하지 않습니다.

## 지원 범위와 실제 확인

| 구분 | 최소·최대 지원 | 실제 검증 최저·최고 |
| :--- | :--- | :--- |
| 개발·컴파일 | 외부 Node 24.22.1 조건을 따름; OS/CPU의 Electron 실행 조건과 별도 | macOS 13.7.8 x64·Node 24.22.1에서 컴파일·자체 테스트 |
| macOS 앱 | Electron 45.1.0·Chromium·패키저 조건 확인 필요, 제품 최소/최대 미확정 | 창·설치·서명 미검증; arm64 미검증 |
| Windows 앱 | Electron 45.1.0·패키저 조건 확인 필요, 제품 최소/최대 미확정 | x64·arm64 실행/설치 미검증 |
| Linux 앱 | Electron 45.1.0·시스템 라이브러리·AppImage 조건 확인 필요, 배포판/최대 미확정 | 실행·설치 미검증 |

확인일은 2026-11-04이며 컴파일 확인을 지원 OS 보장으로 표시하지 않습니다. [Electron 릴리스](https://www.electronjs.org/releases/stable)에서 고정 버전의 지원 조건을 확인하고 실제 OS·CPU에서 검증한 뒤 제품 지원 범위를 확정합니다. 앱 안에 포함되는 Electron Node와 외부 .nvmrc Node는 다릅니다.

## 배포·보관·업데이트·복귀

1. 앱 식별자·버전·OS/CPU를 확정하고 manifest·lock·소스·빌드 설정을 고정합니다.
2. 해당 OS에서 빌드하고 실제 창·입력·IPC·저장·종료를 확인합니다.
3. 선택한 배포 채널의 서명·공증·계정·인증서를 준비합니다. 비밀은 저장소 밖의 안전한 주입 경로로 관리합니다.
4. 설치 패키지를 시험 설치하고 실제 사용자 권한에서 실행·삭제·데이터 보존을 확인합니다. 스토어를 선택하면 해당 제출 절차와 심사 결과를 별도로 기록합니다.
5. 정상 산출물·hash·OS/CPU·Electron 버전·서명 상태·manifest·lock·설정을 릴리스 단위로 보관합니다.
6. 업데이트·복귀 시 앱과 frontend·Preload를 같은 릴리스로 교체하고 사용자 저장 형식의 전후 호환을 확인합니다. userData는 설치 패키지에 포함된 백업이 아닙니다.

자동 업데이트·스토어 제출·서명 인증서 구성은 구현하지 않았습니다. 게임의 userData/save.json은 앱 종료 후 별도 백업하고, 제거·재설치·식별자 변경 중 임의 삭제하지 않습니다.

공식 근거: [Electron 배포](https://www.electronjs.org/docs/latest/tutorial/application-distribution), [electron-builder](https://www.electron.build/).
