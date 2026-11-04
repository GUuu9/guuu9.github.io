<!-- version: v0.1.0 -->
# Electron 일반 화면 연결

선행 순서는 기준 뼈대 → 일반 frontend → electron-backend → 이 구성품입니다. web-app·backend-webui는 필요하지 않습니다.

## 1. 복사·연결

이 문서는 files 내용을 프로젝트에 적용한 상태에서 시작합니다. src/frontend/apis/api.ts·index.html·vite.config.ts와 test/frontend/greeting.test.ts는 변경점을 병합합니다. HTTP 테스트는 IPC 테스트로 바꾸고 Service·ViewModel 검증은 유지합니다. 추가 desktop.d.ts·ipc-api.test.ts도 복사합니다. 새 npm 패키지는 없습니다.

화면 → Service → Api.get → window.desktop.greet → Preload → IPC Bridge → 같은 GreetingUsecase 순서입니다. 화면이 Node나 ipcRenderer 전체에 접근하지 않습니다. DI는 기존 new Api()를 유지하며 호출 구현만 교체합니다. 인사말 외 HTTP 기능은 이 Api에 자동 연결되지 않으므로 기능별 공개 IPC 메서드를 추가합니다.

```bash
npm pkg set 'scripts.build:desktop=npm run build:electron && npm run build:frontend'
npm run build:desktop
npm test
npm run test:frontend
npm run start:desktop
```

Main이 빌드된 로컬 frontend를 읽고 상대 자산 경로와 CSP를 적용합니다. 개발 서버 URL을 Electron에 직접 로드하는 경로는 추가하지 않습니다. 수정 후 다시 build:desktop으로 확인합니다. shell 복사 명령을 실행하면 현재 frontend를 대체하므로 일반 화면 조합에서는 build:desktop-backend 대신 build:desktop을 사용합니다.

## 2. 완료·패키지·정리

실제 창에서 이름 입력·정상 응답·입력 오류·창 닫기·재실행을 확인한 뒤 package:desktop·release:desktop을 실행합니다. 산출물·OS·CPU·Electron 버전·서명 상태를 기록하고 사용자 OS에서 설치·실행을 검증합니다. 지원 범위·서명·보관·복귀는 반입된 Electron backend 문서와 같은 기준입니다.

제거 시 HTTP Api·이전 테스트·Vite·index를 정상 버전으로 되돌리고 desktop 타입·테스트·명령을 해제합니다. 사용자 기능을 덮어쓰지 않습니다. 프로젝트 README·지침·이력에 결과 명칭 electron-app과 빌드/검증 상태를 기록합니다.

## 검증 기록 — 2026-11-04

macOS 13.7.8 x64·Node 24.22.1에서 확인했습니다. 별도 일반 화면 조합에서 Main·Preload·frontend 빌드와 backend/통신 테스트 9개·frontend 테스트 3개를 통과했습니다. 실제 창 조작·패키지 생성·설치·서명·다른 OS는 미검증입니다.

추가 도구를 포함한 전체 임시 조합의 npm 감사에서 개발 의존성 moderate 15건, runtime 의존성 0건이 보고됐습니다. 강제 갱신하지 않았으며 배포 전 개발 도구의 해결 가능 버전을 재검토해야 합니다.
