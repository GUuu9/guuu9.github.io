<!-- version: v2.1.0 -->
# 갱신 이력

## 2026-11-04 — frontend 조합을 위한 검사 범위 분리

- backend 검사·컴파일 include를 src/backend 및 기존 backend 테스트로 한정했습니다. 추가 구성품의 frontend는 전용 tsconfig로 검사하여 DOM·JSX 설정이 backend에 섞이지 않게 합니다. 앱·도구·의존성 버전은 유지합니다.
- 외부 frontend 구성품을 임시 복사본에 적용하여 backend·frontend 빌드, 기존 backend 테스트 3개와 frontend 테스트 4개, 개발 프록시 정상·400·404를 확인했습니다. 원본 뼈대에 frontend 패키지를 추가하지 않았습니다. 복귀는 이전 tsconfig를 사용하며 데이터 변경은 없습니다.

## 2026-11-04 — 조합용 backend 경로와 연결 경계 정리

- `src/backend`로 소스를 이동하고 테스트 import·npm 진입점·빌드 config 복사·설명서를 함께 갱신했습니다. DI는 Usecase를 반환하고 HTTP 앱은 이를 주입받아 Bridge를 연결합니다.
- 앱 버전 1.0.0·Node·직접/잠금 의존성은 유지했습니다. 출력 진입점은 `dist/backend/index.js`로 변경했습니다. 기존 dist를 덮어 섞지 말고 새 빌드 디렉터리에 빌드합니다. 복귀 시 이전 소스·명령·빌드 결과를 함께 사용하며 사용자 데이터 마이그레이션은 없습니다.
- macOS 13.7.8 x64·Node 24.22.1의 임시 복사본에서 오프라인 npm ci·타입 검사·테스트 3개·빌드를 통과했습니다. 샌드박스 소켓 제한으로 테스트는 권한을 받아 재실행했습니다.
- 소스 없는 별도 임시 폴더의 dist·package.json과 임시 검증용 node_modules 링크로 HTTP 정상·404·포트 충돌·SIGINT/SIGTERM 종료를 확인했습니다. 배포 대상 OS의 runtime 의존성 재설치 검사는 이번에 반복하지 않았습니다.
- npm의 esbuild·fsevents 설치 스크립트 미승인 경고가 남았습니다. 새 패키지 설치·실제 웹 UI·Electron·Windows/Linux 실행은 수행하지 않았습니다.

## 2026-11-04 — 유형 폴더 이름 변경

- server 유형 폴더를 typescript-backend로 변경하고 가져오기 명령·문서 링크·웹 메뉴·유형 규칙을 갱신했습니다. npm 패키지 이름과 실행 코드는 유지합니다.
- 상대 링크·메뉴·공백과 이전 유형 경로의 잔여 참조를 확인했습니다. 폴더 이름 변경만으로 앱 검사를 다시 실행하지 않았습니다.

## 2026-11-04 — 독립 TypeScript HTTP 서버 작성

- 앱 1.0.0, Node 24.22.1, TypeScript·Express·tsx는 기존 server-wui의 직접 버전으로 구성했습니다. frontend·Electron IPC 의존성은 포함하지 않습니다.
- HTTP Bridge/Usecase/Model, core DI, FileService·Repository·utils·config·빌드 복사·종료 신호 처리를 재사용했습니다. 입력·설정 검증과 공통 500 상세 비노출을 유지했습니다.
- 적용은 유형 루트 전체 내보내기와 같은 Node·lock 복원입니다. 기존 정상 커밋·산출물·설정을 보존해 복귀하며 사용자 데이터 마이그레이션은 없습니다.
- 검증 환경: macOS 13.7.8 x86_64, 임시 경로의 Node 24.22.1·npm 11.19.1. 공식 Node archive의 SHA-256을 확인했습니다. npm이 기존 lock에서 서버 전용 의존성 잠금을 재생성했고 임시 복사본에서 npm ci·check·테스트 3개·build를 통과했습니다.
- 소스 없는 dist·manifest·lock 배포 복사본에서 npm ci --omit=dev, HTTP 정상·404, 포트 충돌 시 실패, SIGINT/SIGTERM 정상 종료를 확인했습니다. 테스트에서는 입력 오류·공통 500 상세 비노출·설정 오류도 확인했습니다.
- 일부 캐시 누락으로 최초 오프라인 ci는 중단됐고 registry에서 고정 패키지를 받아 검증했습니다. npm은 esbuild·fsevents 설치 스크립트 미승인 경고를 표시했지만 이 환경의 검사·빌드는 통과했습니다. 경고를 무시하는 설정은 추가하지 않았습니다.
- 문서 링크·앵커·코드 펜스·JSON·메뉴·공백을 정적으로 확인했습니다. 실제 Linux/Windows 운영 배포·인증·TLS·실운영 부하는 미검증입니다.
