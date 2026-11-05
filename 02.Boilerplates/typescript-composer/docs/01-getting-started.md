<!-- version: v3.1.0 -->
# 사용자: 형태·feature 선택과 실행

TypeScript Composer 폴더 전체를 내려받거나 복사합니다. Node는 루트 .nvmrc 버전을 사용합니다. 기본 명령 위치는 typescript-backend이며, 생성 위치는 항상 이 폴더의 상위인 Composer 루트입니다. 묶음 자체의 npm install은 필요하지 않습니다.


## 명령 도움말

묶음 루트 또는 뼈대 폴더에서 Node/npm 준비 후 먼저 실행합니다.

```bash
npm run help
npm run compose -- help
```

help는 명령 목록, compose help는 형태별 용도·이름 규칙·생성 위치·예제·후속 준비를 안내합니다. 기존 compose -- --help도 같은 상세 안내입니다. 생성 앱에서는 npm run help로 feature 명령과 검증/복구 범위를 확인합니다.

## 프로젝트 생성

```bash
cd typescript-backend
npm run compose -- web-app my-web
npm run compose -- electron-phaser my-game
npm run compose -- backend-webui my-dashboard
npm run compose -- typescript-backend my-network
```

각 명령은 Composer 바로 아래에 my-web·my-game 등의 프로젝트 폴더를 만듭니다. 폴더명만 영문 소문자·숫자·하이픈으로 입력합니다. ./·../·절대 경로는 받지 않습니다. 묶음 루트의 compose 별칭도 같은 이름을 같은 위치에 생성합니다. 형태와 기능 목록은 [README](../README.md)에 있습니다. 출력은 새 폴더여야 하며 기존 앱의 형태를 덮어 바꾸지 않습니다. 원본 묶음으로 여러 프로젝트를 생성할 수 있습니다.

Windows에서 다른 저장소를 사용하려면 Composer 묶음 전체를 실제 데이터 드라이브에 복사한 뒤 실행합니다.

```powershell
cd "D:\Developer\typescript-composer\typescript-backend"
npm run compose -- web-app my-web
cd ..\my-web
```

결과는 D:\Developer\typescript-composer\my-web입니다.

## 설치·확인·실행

생성한 폴더로 들어가 실행합니다.

```bash
cd ../my-web
npm install
npm run check
npm test
npm run build
npm start
```

첫 npm install이 이 조합의 잠금 파일을 만들며 버전 관리에 포함합니다. 이후 같은 환경 복원은 npm ci입니다. 웹 형태의 npm start는 로컬 preview, Electron은 데스크톱 앱, backend는 HTTP 실행입니다. 종료는 실행 터미널의 Ctrl+C입니다.

생성된 프로젝트는 원본 Composer 없이 독립적으로 사용합니다. API 주소·저장 경로·배포 조건·실제 검증 범위는 해당 프로젝트의 README와 선택 기능 설명서를 확인합니다. Electron은 설치한 실행 파일과 OS 지원 조건도 확인해야 합니다.

## 선택 기능 사용

추가한 통신 기능은 별도 터미널에서 실행합니다. 실행 전에 npm run build를 완료합니다.

```bash
npm run start:tcp
npm run start:udp
npm run start:mqtt
npm run start:socket-io
```

선택한 기능의 명령만 사용합니다. 통신은 기본 앱과 자동으로 동시 실행되지 않습니다. MQTT는 프로젝트의 .env.example을 참고해 실제 .env에 broker 주소·인증을 설정합니다. 웹 앱의 API 주소도 프로젝트 내부 안내에 따라 지정합니다.

game-persistence는 파일 저장 기능을 추가한 틀이며 독립 실행 명령은 없습니다. electron-phaser는 게임의 저장 버튼에 이미 연결되어 있습니다. 다른 앱에서 저장 기능을 사용할 때는 생성된 기능 안내를 따릅니다.

## 생성이 중단된 경우

기존 폴더 오류는 새 프로젝트 이름을 지정합니다. 연결 위치·패키지·파일 충돌 오류는 원본 묶음을 수정한 관리자에게 전달합니다. 검증 단계의 오류는 출력 전에 중단되며, 디스크 쓰기 중 실패한 경우에는 새 대상 폴더 상태를 확인합니다.

```bash
npm run compose -- --help
```

실제 웹 배포·앱 서명·설치·운영 서버 연결은 틀 생성과 별도 작업입니다.

## 생성 후 feature 활성화

생성한 프로젝트 루트에서 실행합니다. Composer 원본 폴더는 필요하지 않습니다.

```bash
npm run feature -- list
npm run feature -- add socket-io
npm run feature -- add tcp,udp,mqtt
```

구현·DI 등 연결·package.json을 자동 반영하고 npm install → check → test → build를 수행합니다. 같은 기능은 중복 적용하지 않습니다. 정적 웹에는 Node 기능을 추가할 수 없습니다. 통신 기능은 추가 후 start:<통신명>으로 별도 실행합니다.

.composer/catalog는 구성품 원본, .composer/state.json은 활성화 내역과 생성 기준입니다. 모두 Git에 포함하고 임의 편집하지 않습니다. 최신 구성품을 자동 다운로드하지 않습니다. 연결 대상 파일에 사용자 수정이 있으면 덮어쓰지 않고 중단합니다.

실패하면 변경 소스·package.json·lock·활성화 내역을 복구합니다. npm 설치 스크립트의 외부 작업, node_modules·빌드 산출물은 복구 범위 밖입니다. 실패 후 필요하면 npm ci와 build를 다시 수행합니다. 기능 제거 명령은 지원하지 않습니다.
