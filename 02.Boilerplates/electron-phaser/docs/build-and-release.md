<!-- version: v1.0.0 -->
# Electron·Phaser 패키징·배포

[시작 가이드](./getting-started.md)의 게임·IPC·저장 검증을 마친 프로젝트를 배포할 때 사용합니다. 명령은 Node 환경을 선택한 개인 PC 또는 해당 OS의 CI에서 프로젝트 루트 기준으로 실행합니다. 개발 도구의 공통 설치와 프로젝트의 패키징 의존성·서명 설정을 구분합니다.

현재 샘플의 `npm run build`는 JS 번들을 생성할 뿐 설치 패키지를 만들지 않습니다. Forge·maker·publisher·자동 업데이트 설정은 없으며 이 문서에서도 의존성이나 실행 코드를 추가하지 않았습니다. 아래 패키징 단계는 제품에서 해당 설정을 도입한 뒤에만 사용할 수 있습니다.

## 1. 배포 대상·식별자·버전 선택

`package.json`의 이름·앱 버전, 제품 이름·아이콘·앱 식별자, OS/CPU·최소 OS와 배포 채널을 먼저 확정합니다. `.nvmrc`·package-lock.json과 Electron 버전을 유지합니다. Windows·macOS·Linux마다 생성·서명 환경이 다르므로 한 PC에서 모든 결과를 만들 수 있다고 가정하지 않습니다. 네이티브 모듈이 생기면 Electron ABI·대상 CPU별 재빌드도 필요합니다.

| 배포 경로 | 산출물·준비 사항 |
| :--- | :--- |
| macOS 직접 배포 | `.app`을 담은 DMG·ZIP 등 선택 형식, Developer ID 서명·공증·대상 CPU 확인 |
| Mac App Store | MAS용 Electron·sandbox/entitlements·스토어용 서명과 제출 패키지. 직접 배포판과 별도 검증 |
| Windows 직접 배포 | 선택한 maker의 설치 EXE·MSI 등. 앱·설치기 서명과 업데이트 방식 확인 |
| Microsoft Store | 선택한 등록 경로의 패키지/설치기 형식·Identity·Publisher·계정 조건 확인 |
| Linux | 대상 배포판·CPU에 맞는 deb·rpm·Snap 등 선택 형식. 모든 형식을 일괄 생성하지 않음 |

[Electron 배포 개요](https://www.electronjs.org/docs/latest/tutorial/application-distribution) · [MAS 가이드](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide) · [Windows Store 가이드](https://www.electronjs.org/docs/latest/tutorial/windows-store-guide). 스토어에서 현재 허용하는 형식·버전 규칙은 해당 등록 화면과 공식 문서에서 다시 확인합니다.

## 2. 빌드 → 패키징 설정 → 설치 패키지

현재 샘플에서 실행 가능한 검사는 다음과 같습니다.

```bash
npm ci
npm test
npm run typecheck
npm run build
```

`dist/renderer/`와 `dist-electron/`은 중간 빌드 결과입니다. `npm run electron:start`도 로컬 실행이며 배포 패키지가 아닙니다. Renderer의 IPC 의존성 때문에 Renderer만 정적 웹사이트로 게시해 같은 기능을 제공할 수 없습니다.

제품에 패키징을 도입할 때는 [Forge의 기존 프로젝트 가져오기](https://www.electronforge.io/import-existing-project)를 참고해 로컬 devDependency·필요한 maker와 설정을 manifest·잠금 파일에 함께 기록합니다. 가져오기 도구가 기존 Vite·Main·Preload 설정을 자동 보존한다고 가정하지 않고 diff를 검토합니다. 샘플의 `main` 경로, Renderer·Preload·이미지 리소스 포함, 개발 파일·비밀·테스트·캐시 제외, 실제 런타임 의존성 포함을 확인합니다.

Forge를 선택해 **제품에서 설정한 뒤**에는 [공식 CLI](https://www.electronforge.io/cli)의 `package`로 실행 번들, `make`로 선택 maker의 배포 파일을 생성할 수 있습니다. 프로젝트에 등록한 스크립트·OS/CPU 인자로 실행하고 기본 `out/` 또는 설정한 출력 경로를 기록합니다. 아직 없는 `npm run make`를 샘플 기본 명령으로 안내하지 않습니다. `publish`는 원격 게시 단계이므로 패키지 생성과 분리합니다.

## 3. 서명·스토어 제출·직접 배포

- **macOS 직접 배포**: [서명·공증 안내](https://www.electronjs.org/docs/latest/tutorial/code-signing)에 따라 Developer ID·hardened runtime·필요 entitlements를 구성하고 공증·staple 결과를 검증합니다. 다른 Mac에서 다운로드한 실제 파일의 Gatekeeper 실행까지 확인합니다.
- **Mac App Store**: MAS 가이드에 따라 앱 ID·sandbox 권한·스토어용 인증서/profile과 제출용 패키지를 구성합니다. App Store Connect에서 앱 레코드·상품 정보·심사 정보를 완료합니다. 직접 배포판의 서명·공증만으로 MAS 제출이 끝나지 않습니다.
- **Windows**: 직접 배포의 앱·설치기 코드 서명과 Store 제출 방식의 서명·Identity 요구를 구분합니다. [Microsoft Store 등록 개요](https://learn.microsoft.com/en-us/windows/apps/publish/)에서 선택 경로를 확인하고 Partner Center의 제품 정보·패키지 검증·심사를 진행합니다.
- **Linux**: 선택 저장소·스토어의 패키지 메타데이터·권한·서명 정책을 따릅니다. 예를 들어 Snap을 선택한 경우에만 [Electron Snap 가이드](https://www.electronjs.org/docs/latest/tutorial/snapcraft)로 구성합니다.

자격증명은 CI 보안 저장소·OS 키체인에서 제공하고 인증서 개인 키·토큰·비밀번호를 config·소스·로그에 넣지 않습니다. `.env.example`에는 변수 이름과 비밀 없는 예시만 둡니다. 스토어용 설명·스크린샷·개인정보·등급·라이선스 고지는 실제 앱 동작과 일치해야 합니다.

## 4. 설치 검증·업데이트·복귀

각 OS/CPU의 깨끗한 테스트 환경에서 설치·첫 실행·리소스 로드·IPC·게임·점수 저장·재실행·제거를 확인합니다. 앱에 포함된 리소스 위치는 개발 폴더와 다를 수 있고 설치 폴더는 쓰기 불가일 수 있습니다. 저장은 userData를 유지하고, 앱 이름·식별자 변경으로 저장 경로가 달라지는지도 검사합니다. 기존 배포판 위 설치로 사용자 데이터 보존을 검증합니다.

자동 업데이트는 현재 미구현입니다. 필요할 때만 [Electron 업데이트 안내](https://www.electronjs.org/docs/latest/tutorial/updates)에 따라 대상 형식·서명·업데이트 메타데이터·서버를 선택합니다. 스토어 배포판은 해당 스토어의 업데이트 경로와 충돌하지 않게 합니다.

릴리스별 소스 커밋·앱/Electron/Node 버전·잠금 파일·OS/CPU·빌드 설정·서명 결과·설치 파일 체크섬을 보관합니다. 서명 자격은 별도 보안 백업하고 같은 파일명·버전의 공개 파일을 다른 내용으로 덮어쓰지 않습니다. 문제가 생기면 게시 범위를 중단·조정하고 새 버전으로 수정 배포합니다. 이전 설치기로 복귀할 때도 최신 userData 형식을 구버전이 읽을 수 있는지 확인하고 백업 없이 데이터를 초기화하지 않습니다.

확인일: 2026-11-03. 공식 배포 안내와 샘플 스크립트를 대조했습니다. maker 설치·패키징·서명·공증·스토어 제출·자동 업데이트는 수행하지 않았습니다.
