<!-- version: v4.2.0 -->
# TypeScript Composer

웹·데스크톱·게임·backend 프로젝트를 원하는 형태와 기능으로 생성합니다. **이 폴더 전체를 복사한 뒤 typescript-backend에서 형태와 프로젝트 이름을 입력합니다.**


## 명령 도움말

묶음 루트 또는 뼈대 폴더에서 Node/npm 준비 후 먼저 실행합니다.

```bash
npm run help
npm run compose -- help
```

help는 명령 목록, compose help는 형태별 용도·이름 규칙·생성 위치·예제·후속 준비를 안내합니다. 기존 compose -- --help도 같은 상세 안내입니다. 생성 앱에서는 npm run help로 feature 명령과 검증/복구 범위를 확인합니다.

## 내려받기

이미 폴더를 복사했다면 이 단계는 생략합니다. Git과 .nvmrc의 Node 24.22.1을 준비합니다. 도구가 없으면 [Node 환경 준비](./typescript-backend/docs/01-getting-started.md#2-pc-기본-도구-준비)를 확인합니다. macOS는 Git 사용 전에 설치한 개발 도구의 라이선스·초기화를 완료합니다.

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/typescript-composer
cd 02.Boilerplates/typescript-composer
```

다운로드 명령은 해당 변경이 원격에 반영된 뒤 사용할 수 있습니다.

## 형태 선택

| 형태 | 만들 프로젝트 |
| :--- | :--- |
| typescript-backend | HTTP API backend |
| backend-webui | backend와 웹 화면을 함께 제공하는 앱 |
| web-app | 웹 호스팅에 배포할 웹 앱 |
| web-phaser | 웹 호스팅에 배포할 Phaser 게임 |
| electron-backend | Electron 기반 앱의 시작 틀 |
| electron-app | 일반 데스크톱 앱 |
| electron-phaser | 데스크톱 Phaser 게임 |

## 생성·시작

먼저 backend·웹 화면 형태를 생성하고, 프로젝트에서 필요한 feature를 추가합니다.

```bash
cd typescript-backend
npm run compose -- backend-webui my-app
cd ../my-app
npm install
npm run check
npm test
npm run build
npm start
```

위 명령은 복사한 묶음의 `typescript-composer/my-app` 폴더를 생성합니다. 이름은 영문 소문자·숫자·하이픈을 사용합니다. 경로는 입력하지 않습니다. 묶음 루트의 compose 별칭에서도 같은 이름과 생성 위치를 사용합니다.

기존 폴더는 덮어쓰지 않으므로 새 이름을 지정합니다. 생성기는 뼈대와 구성품을 보존합니다. 최초 npm install로 잠금 파일을 생성하고 이후 복원은 npm ci를 사용합니다.

| feature | 추가 기능 |
| :--- | :--- |
| tcp | TCP 통신 |
| udp | UDP 통신 |
| mqtt | MQTT broker 연결 |
| socket-io | Socket.IO 통신 |
| game-persistence | 게임 파일 저장 |

프로젝트에서 여러 기능을 추가할 때는 `npm run feature -- add tcp,udp,mqtt`처럼 쉼표로 구분합니다. 이 기능들은 Node 실행 형태에서 사용하며 정적 웹 형태에는 추가하지 않습니다. electron-phaser에는 파일 저장이 기본 포함됩니다.

[사용자 가이드](./docs/01-getting-started.md)에서 기능 실행·환경 설정·출력 경로를 확인합니다. 실제 앱 사용·배포는 생성된 프로젝트의 README를 따릅니다.

묶음을 수정하는 관리자·AI는 [작업 지침](./project-agents.md)을 사용합니다. [검증·변경 이력](./update.md)은 별도로 관리합니다.

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

## 보일러플레이트 업데이트

원본 Git이 갱신돼도 개발 중인 앱에는 자동 반영되지 않습니다. [원본 갱신·앱 이행 절차](./typescript-backend/docs/04-version-management.md#git에서-보일러플레이트가-갱신된-경우)를 따라 기존 앱을 보존하고 별도 위치에서 같은 구성을 생성·비교·검증합니다. catalog/state만 교체하거나 앱 폴더를 덮어쓰지 않습니다.
