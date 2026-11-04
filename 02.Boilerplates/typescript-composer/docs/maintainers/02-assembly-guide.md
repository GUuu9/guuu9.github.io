<!-- version: v2.0.0 -->
# 관리자·AI: 목표 형태별 연결

사용자에게 수동 연결을 요구하는 문서가 아닙니다. 관리자가 자동 조합 규칙을 작성·검증할 때 연결 지점과 역할을 확인합니다. 사용자 흐름은 묶음 루트의 생성 명령을 따릅니다.

현재 구현된 범위는 기준 backend의 경로 정리와 DI·HTTP 연결 분리입니다. [일반 frontend 구성품](../../components/01-base/frontend/README.md)은 외부 파일 복사와 개발 HTTP 연결까지 구현했습니다. [backend-webui 구성품](../../components/02-targets/backend-webui/README.md)은 정적 화면 제공과 API 경계 분리까지 구현했습니다. [web-app 구성품](../../components/02-targets/web-app/README.md)은 공개 API 설정·독립 빌드·웹 배포 절차까지 제공합니다. [Phaser](../../components/01-base/phaser/README.md)와 [web-phaser](../../components/02-targets/web-phaser/README.md)는 게임·저장·정적 빌드까지 제공합니다. 남은 Electron·추가 통신 구성품도 제공합니다. [구성품 목록](../../components/README.md)의 적용 순서와 실제 files·README를 우선합니다. 아래는 연결 구조에 대한 설명입니다. 모든 작업 위치는 가져온 프로젝트 루트입니다.

## 1. 기준 뼈대와 기능 연결

1. `typescript-backend` 전체를 새 프로젝트 폴더로 복사하고 해당 README의 Node 환경에서 `npm ci`를 실행합니다.
2. `src/backend/core/di.ts`에서 FileService → GreetingRepository → GreetingUsecase를 생성합니다. 반환 객체의 `greetingUsecase`가 외부 연결부에 넘길 기능입니다.
3. `src/backend/core/web-server.ts`의 `createApp(dependencies)`가 GreetingBridge를 생성하여 Usecase를 주입하고 Express Router를 등록합니다.
4. `src/backend/index.ts`가 `createApp(createDI())`로 조립한 뒤 수신과 오류·종료를 처리합니다.
5. 새 기능은 같은 방식으로 Usecase를 DI 반환값에 추가하고, HTTP Bridge 생성·라우터 등록을 web-server에 추가합니다. 파일·DB 접근이 필요할 때만 Service·Repository를 추가합니다.

```bash
npm run check
npm test
npm run build
npm start
```

다른 터미널에서 확인하고 실행 터미널의 Ctrl+C로 종료합니다.

```bash
curl 'http://127.0.0.1:3101/api/greeting?name=World'
```

현재 산출물은 `dist/backend/index.js`와 같은 디렉터리의 config입니다. 앱 설정을 변경하면 빌드 결과도 다시 생성합니다.

## 2. backend-webui 연결

먼저 외부 [frontend 구성품](../../components/01-base/frontend/README.md)의 files를 프로젝트에 복사하고 패키지·명령을 연결합니다. 아래 1~3단계는 해당 구성품에서 제공하며, 4단계의 frontend 독립 빌드도 포함합니다. 그다음 [backend-webui 구성품](../../components/02-targets/backend-webui/README.md)의 files를 복사하고 web-server 등록 코드를 변경합니다. 통합 빌드 후 같은 backend 주소에서 화면·자산·API를 확인합니다.

추가 대상은 일반 frontend, HTTP Api, frontend 빌드 설정, backend의 정적 파일 제공 코드입니다. frontend 구현은 base/frontend의 화면·ViewModel·Service·Api를 결과 프로젝트 안으로 가져옵니다.

1. 화면 코드를 `src/frontend`에 배치합니다. frontend에 React·React DOM, 개발 도구에 Vite·관련 타입을 추가하는 버전과 설치 명령은 구성품 구현 시 확정합니다.
2. `src/frontend/apis`에 HTTP 호출을 둡니다. 인사말 조회는 `/api/greeting?name=...`를 호출하고 성공·실패 응답을 검사합니다. 화면이 직접 fetch하지 않고 기능 Service가 Api를 호출하도록 DI에 연결합니다.
3. frontend 개발 서버는 `/api`를 backend의 `127.0.0.1:3101`로 프록시합니다. 개발 중에는 backend와 frontend를 각각 실행합니다.
4. frontend 빌드 출력은 `dist/frontend`로 고정합니다. Node 컴파일 대상에는 frontend를 넣지 않고 frontend 전용 타입 검사·빌드 설정으로 나눕니다.
5. backend의 web-server에 API Router → API 404 → 정적 파일 제공 → 필요한 SPA 화면 경로 처리 → 최종 404·오류 처리 순서로 연결합니다. API 404는 `/api` 범위에만 적용하여 화면 요청을 가로막지 않게 합니다.
6. 정적 디렉터리는 실행 cwd 대신 빌드 파일 위치 기준 URL로 찾습니다. backend 빌드 후 frontend도 빌드하고 Node 진입점을 실행합니다.
7. 인사말 정상·입력 오류·API 404, 화면 직접 진입, 자산 로딩을 확인합니다. 정적 화면 배포에 개발 서버를 사용하지 않습니다.

```text
화면 → ViewModel → Service → HttpApi
                                ↓ /api
                         HTTP Bridge → Usecase
```

## 3. web-app 연결

[web-app 구성품](../../components/02-targets/web-app/README.md)의 파일을 frontend 위에 적용합니다. Api·DI·Vite 설정은 변경점을 병합하고 환경 변수 양식과 프로젝트 내부 설명서도 함께 가져옵니다. 아래 절차의 명령·배포·제거 방법은 해당 구성품 문서에 있습니다.

1. backend-webui에서 만든 일반 frontend와 HTTP Api를 재사용합니다. Vite는 frontend만 빌드하고 출력은 `dist/frontend`로 유지합니다.
2. 로컬 처리만 필요한 앱은 로컬 Api 구현을 frontend DI에 주입합니다. 서버 기능이 필요하면 HTTP Api에 배포 backend의 주소를 주입합니다.
3. API 주소는 공개 설정으로 관리합니다. frontend 빌드에 포함되는 값은 사용자에게 공개되므로 비밀 키를 넣지 않습니다. 설정 파일을 선언하는 것과 실제로 읽어 Api에 전달하는 구현을 함께 작성합니다.
4. 별도 API 출처를 사용하는 경우 backend에 허용 출처·인증 방식을 설정합니다. 개발 프록시는 배포 결과에 포함되지 않습니다.
5. 정적 호스팅에는 `dist/frontend`만 배포합니다. 자산 기본 경로·SPA 경로 설정은 선택한 호스팅에 맞춥니다. backend 기능이 있으면 별도 실행 환경에 배포합니다.
6. backend를 사용하지 않는 프로젝트는 Node 진입점·서버 설정·Express 등 미사용 코드와 의존성을 제거하고 frontend 명령·문서를 맞춥니다. shared 계약은 실제로 쓰는 것만 남깁니다.
7. 배포 경로에서 새로고침·자산·API 정상/실패를 확인합니다. 호스팅 서비스의 설치·배포 명령은 서비스 선정 단계에서 공식 문서로 확인합니다.

## 4. web-phaser 연결

기준 뼈대의 새 복사본에 [Phaser 화면 구성품](../../components/01-base/phaser/README.md)을 먼저 적용하고, [web-phaser 구성품](../../components/02-targets/web-phaser/README.md)의 저장 Api·Vite 설정을 병합합니다. 일반 frontend·web-app은 선행 조건이 아닙니다. 각 files에 반입 프로젝트용 설명서도 포함됩니다.

1. `src/frontend/core`에서 Phaser 게임과 Scene 목록을 생성하고 진입점에서 게임을 시작합니다. 일반 UI용 React는 게임에서 실제 사용하는 경우에만 추가합니다.
2. Scene과 자산을 `src/frontend/scenes`, `resource`에 둡니다. 기존 electron-phaser의 Scene·게임 설정을 참고하되 Electron 전용 import를 가져오지 않습니다.
3. 저장·조회는 Scene에서 파일이나 IPC에 직접 연결하지 않고 기능별 Api를 통해 호출합니다. 브라우저 로컬 저장 또는 HTTP 구현을 frontend 조립 지점에 주입합니다.
4. 게임 종료·화면 재생성 때 이벤트·타이머·게임 인스턴스를 해제합니다. 저장 실패와 저장 데이터 검증을 구현에 포함합니다.
5. web-app과 같은 frontend 전용 빌드·배포 흐름에 연결합니다. 하위 경로 자산 로딩과 실제 브라우저 입력·화면·저장/복귀를 확인합니다.

## 5. electron-backend 연결

[Electron backend 구성품](../../components/01-base/electron-backend/README.md)의 files와 패키지·scripts 연결을 적용합니다. Main 진입점은 backend/electron.ts로 추가하며 기존 HTTP index.ts와 독립 실행합니다. 기본 실행은 빌드된 로컬 페이지로 제한합니다.

1. Electron 개발 의존성과 Main·Preload 빌드 설정을 추가합니다. 버전은 구현 시 기존 샘플 및 공식 지원 조건과 대조해 선택합니다.
2. backend의 Node HTTP 진입점을 Electron Main 진입점으로 전환합니다. `app.whenReady()` 이후 `createDI()`로 기능을 만들고 IPC handler를 등록합니다. HTTP 연결부는 실제 요구가 있는 경우에만 별도로 시작합니다.
3. 기능별 IPC Bridge가 허용 채널·발신자·입력을 검사하고 같은 Usecase를 호출합니다. Usecase에는 Electron event 객체를 전달하지 않습니다.
4. `src/shared`에 채널명·요청/응답 타입·필요한 메시지 검증을 둡니다. HTTP 오류 응답을 그대로 IPC 예외로 노출하지 않고 IPC에 맞게 오류를 변환합니다.
5. `src/preload`에서 contextBridge로 기능별 메서드만 공개합니다. Renderer에 ipcRenderer 전체나 파일 접근 권한을 노출하지 않습니다.
6. Main의 종료·재등록 시 handler·구독·열린 자원을 해제합니다. 화면을 붙이기 전에는 IPC 등록·입력·오류 처리 검사를 완료하고 사용자 앱 실행 검증과 구분합니다.

## 6. electron-app 연결

[일반 화면 IPC 구성품](../../components/02-targets/electron-app/README.md)을 frontend → electron-backend 순서 적용 후 가져옵니다. 실제 Vite 설정은 file URL용 상대 경로와 CSP를 사용하며 개발 URL을 Main에 로드하는 경로는 구현하지 않았습니다. 아래 개발 서버 방식은 필요 시 추가할 확장입니다.

1. 일반 frontend를 `src/frontend`에 배치합니다. 기능 Service가 사용하는 Api를 HTTP 구현에서 Preload 호출 구현으로 교체하고 frontend DI에 연결합니다.
2. Main이 BrowserWindow를 생성하며 빌드된 Preload 경로를 지정합니다. contextIsolation·sandbox를 활성화하고 Renderer의 nodeIntegration을 비활성화합니다.
3. 개발 중에는 로컬 frontend 개발 서버를, 배포에서는 빌드된 frontend 파일을 로드합니다. 탐색·새 창은 허용 정책을 정의하고 IPC 발신자 검증과 함께 적용합니다.
4. Main·Preload·frontend를 각각 빌드합니다. package.json의 main과 실제 Main 출력 경로를 맞추고 패키지에 Preload·frontend·공개 config·실제 runtime 의존성이 포함되는지 확인합니다.
5. 창 실행 → 화면 요청 → Preload → IPC Bridge → Usecase → 결과/오류 표시 흐름을 확인합니다. 창 닫기·다시 열기·앱 종료도 확인합니다.
6. OS별 패키저·서명 방식은 별도 선정하고 빌드·설치 패키지 생성·설치 후 실행 결과를 구분하여 기록합니다.

```text
화면 → Service → IpcApi → Preload의 제한된 메서드
                                 ↓ IPC
                          IPC Bridge → Usecase
```

## 7. electron-phaser 연결

[게임 IPC 구성품](../../components/02-targets/electron-phaser/README.md)을 Phaser → electron-backend → [게임 파일 저장 Service](../../components/03-features/services/game-persistence/README.md) 순서 적용 후 가져옵니다. 웹 저장 구성품 없이 같은 게임 코드를 연결할 수 있습니다. Preload import·Main handler 등록의 정확한 수정 코드는 구성품 문서에 있습니다.

1. electron-backend에 web-phaser의 게임·Scene·자산을 붙입니다.
2. 게임이 사용하는 저장·조회 Api를 Preload 호출 구현으로 주입합니다. 브라우저용 저장 구현은 웹 빌드에서 계속 사용합니다.
3. Main·Preload·창·패키징은 electron-app과 같은 경계로 연결합니다. 게임 코드에는 Electron·Node import를 넣지 않습니다.
4. 웹과 Electron 각각에서 자산 로딩·입력·저장/복귀·오류를 확인합니다. 앱 종료 시 게임 이벤트와 Main 자원이 정리되는지도 확인합니다.

## 8. 추가 통신 연결

[공통 메시지](../../components/03-features/communications/common/README.md)를 먼저 적용하고 [TCP](../../components/03-features/communications/tcp/README.md)·[UDP](../../components/03-features/communications/udp/README.md)·[MQTT](../../components/03-features/communications/mqtt/README.md)를 선택합니다. 기본은 별도 진입점이며 한 프로세스에 합칠 때는 해당 진입점의 시작·종료 조립을 함께 수정합니다.

TCP·UDP·MQTT는 위 화면·배포 형태에 필요한 통신 기능으로 추가합니다. 서버·클라이언트·broker 역할은 구성품마다 명시합니다.

1. backend의 기능별 Bridge에 메시지 검증과 Usecase 호출을 작성합니다. 인사말 예시라면 검증한 이름을 `greetingUsecase.greet(name)`에 전달합니다.
2. core의 통신 조립 코드에 연결·수신·구독을 등록하고 DI의 Usecase를 전달합니다.
3. 진입점에서 해당 연결을 시작하고 실패를 보고합니다. 종료 시 수신·구독·소켓을 닫습니다.
4. TCP의 메시지 경계·크기 제한, UDP의 유실·중복 정책, MQTT의 topic·QoS·재구독 정책을 각 구성품 문서에 작성합니다.
5. 전역 설정을 바꾸지 않고 프로젝트 설정에서 주소·포트·인증을 선택합니다. 필요한 패키지와 환경 변수는 실제 구성품 구현 시 함께 추가합니다.

독립 기능은 features에서 가져오고 대상 환경에 연결하는 코드만 targets에 둡니다. 서비스·순수 함수·core를 파일 위치만 보고 분리하지 않으며, 실제로 따로 적용할 수 있는 기능 단위로 추가합니다.

Socket.IO는 [구성품 설명](../../components/03-features/communications/socket-io/README.md)의 files를 가져와 HTTP server에 attach합니다. 기본 포트는 3104이며, 기존 HTTP와 합칠 때 같은 DI 결과를 전달하고 종료에서 io.close를 호출합니다. TCP·UDP·MQTT의 Buffer 메시지 구성품은 선행 조건이 아닙니다.

각 조합 완료 시 해당 프로젝트 안의 README·docs·project-agents.md·update.md를 갱신합니다. 이 묶음의 설계 문서를 가져온 프로젝트의 필수 외부 설명서로 남기지 않습니다.
