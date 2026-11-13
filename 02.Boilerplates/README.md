# Composer 사용·보일러플레이트 제작

Composer 코드·구성품·상세 규칙·변경 이력은 각 독립 저장소에서 관리합니다. 이 문서 저장소에는 선택·다운로드·업데이트와 보일러플레이트 추출/신규 제작 안내를 둡니다.

| Composer | 용도 | 저장소 |
| :--- | :--- | :--- |
| TypeScript Composer v0.0.0 | backend·React·Electron·Phaser 기본 형태 생성, 추가 기능 수동 연결 | [GUuu9/typescript-composer](https://github.com/GUuu9/typescript-composer) |
| Flutter Composer v0.0.0 | Android·iOS·공용 빈 Flutter 앱 | [GUuu9/flutter-composer](https://github.com/GUuu9/flutter-composer) |

## TypeScript Composer 내려받기·생성

Git과 Composer의 `.nvmrc`에 지정한 Node 24.22.1을 준비합니다. macOS는 Git·Homebrew·nvm 전에 선택한 CLT 또는 전체 Xcode의 라이선스·최초 초기화를 완료합니다. Windows는 D:\Developer 등 실제 데이터 드라이브의 작업 부모 폴더에서 시작합니다. 같은 이름의 폴더가 있으면 덮어쓰지 말고 기존 remote/status부터 확인합니다.

Composer 자체에는 설치할 외부 의존성이 없습니다. Composer 루트에서 실행합니다. 아래 Git/npm 명령은 Bash·PowerShell에서 같습니다.

```bash
git clone https://github.com/GUuu9/typescript-composer.git
cd typescript-composer
npm run compose
```

구성 → 프로젝트 이름 → 생성 확인 순서로 질문합니다. 프로젝트 이름은 소문자로 시작하는 1~64자의 소문자·숫자·하이픈입니다. 추가 통신·Service는 생성 후 수동으로 적용합니다.

| 구성 | 화면·실행 환경 | 기본 연결 |
| :--- | :--- | :--- |
| typescript-backend | Node backend | 없음 |
| web-app | React | 없음 |
| web-phaser | React + Phaser | 없음 |
| backend-webui | Node + React 통합 제공 | HTTP |
| electron-app | Electron Main + React | IPC |
| electron-phaser | Electron Main + React + Phaser | IPC |

형태에 필요한 HTTP·IPC는 생성 시 연결합니다. backend-webui는 통합 제공형이며, 분리 배포는 backend와 웹 앱을 따로 생성해 연결합니다. Electron 단독 backend는 내부 base이며 공개 선택 항목이 아닙니다. 추가 HTTP·TCP·UDP·MQTT·Socket.IO·logger는 구성품 문서를 따라 소스·의존성·환경 설정·DI·수명을 수동 연결합니다.

새 앱은 `project/<name>`에 생성됩니다. 생성 명령은 독립 Git 초기화 후 install → check → test → build를 수행하고 성공한 구성만 활성화합니다. 자동 commit·remote·push는 하지 않습니다. 기존 경로는 덮어쓰지 않으며 실패·취소 시 소스·lock·진단을 보존합니다.

### 생성 후 실행·재검증

생성한 앱 루트에서 앱 README의 설정을 준비합니다. 아래 my-app은 입력한 프로젝트 이름으로 바꿉니다.

```bash
cd project/my-app
npm run dev
```

Ctrl+C로 종료합니다. `dev`는 개발 실행, `npm start`는 빌드 결과 실행입니다. 웹 단독의 start는 로컬 preview이며 운영 서버가 아닙니다. Electron은 최초 실행 전에 앱 루트에서 다음을 수행합니다.

```bash
npm run setup:electron
```

실패 원인을 수정했거나 구성을 다시 확인할 때는 앱 루트에서 실행합니다. 소스를 재출력하지 않고 설치부터 전체 검사를 반복하며 성공 후 상태를 활성화합니다.

```bash
npm run verify
```

실제 `.env`는 사용자가 작성하며 자동 생성·재작성하지 않습니다. `.env.example`에는 선택한 키와 설명만 두고 실행 설정으로 로드하지 않습니다. OS 환경 변수가 우선하며 브라우저에는 허용된 공개 값만 전달합니다.

Composer 루트의 다음 명령으로 `project/` 안에서 함께 열 앱을 선택해 VS Code workspace를 만들 수 있습니다. 생성한 `typescript-composer.local.code-workspace`는 로컬 파일이며 앱 코드·Git을 변경하지 않습니다.

```bash
# typescript-composer/에서 실행
npm run workspace
```

추가 기능은 [수동 기능 계약](https://github.com/GUuu9/typescript-composer/blob/main/docs/contracts/manual-features-contract.md)을 따릅니다. feature add·자동 DI 연결·원본 해시 일치 검사는 제공하지 않습니다. 전체 사용법은 [README](https://github.com/GUuu9/typescript-composer/blob/main/README.md)·[AGENTS](https://github.com/GUuu9/typescript-composer/blob/main/AGENTS.md)·[문서 색인](https://github.com/GUuu9/typescript-composer/blob/main/docs/README.md)을 확인합니다.

## Flutter Composer 내려받기

Flutter는 FVM과 `.fvmrc`의 Flutter 3.35.7/Dart 3.9.2를 준비합니다. Composer/앱에 Node/npm을 요구하지 않습니다.

```bash
git clone https://github.com/GUuu9/flutter-composer.git
cd flutter-composer
fvm dart run scripts/compose.dart
```

플랫폼(Android·iOS·공용) → 조직 식별자 → 프로젝트/package 이름 → 최종 요약 확인 순서입니다. 공식 Flutter 도구로 선택한 플랫폼만 `project/<name>`에 생성하고 확인된 Android/iOS 설정·빈 앱·문서를 적용합니다. 생성 시 설치·분석·테스트·네이티브 빌드·Git 초기화는 수행하지 않습니다. 앱 README 순서로 환경 준비·의존성 설치·실행·검증을 진행합니다.

추가 기능은 API·BLE·TCP·UDP·MQTT·log의 [수동 추가 안내](https://github.com/GUuu9/flutter-composer/blob/main/docs/02-manual-features.md)를 따릅니다. 생성기는 기능 소스 대신 안내 문서를 앱에 포함합니다. 필요한 소스·테스트를 복사하고 패키지 버전·OS 권한·DI 등록·초기화·사용·종료를 직접 연결합니다. `core/app.dart`는 앱 진입을 유지하고 `core/di.dart`가 의존성을 조립합니다.

현재 버전은 사용자가 Android·iOS 실행을 확인한 조합입니다. 설치된 도구와 다르다는 이유로 일괄 갱신하지 않고, 동작 문제가 있으면 앱 문서에서 경로·설정·호환성을 확인한 뒤 필요한 버전만 변경하고 재검증합니다. 상세 버전·검증 범위는 [Flutter README](https://github.com/GUuu9/flutter-composer/blob/main/README.md)·[AGENTS](https://github.com/GUuu9/flutter-composer/blob/main/AGENTS.md)와 앱 내부 문서를 따릅니다. TypeScript의 자동 설치/검증·verify를 Flutter에 적용하지 않습니다.

### Flutter 프로젝트 workspace

Composer 루트에서 번호로 함께 열 프로젝트를 선택합니다. Enter로 취소하며 기존 파일은 확인 후 교체합니다.

```bash
# flutter-composer/에서 실행
fvm dart run scripts/workspace.dart
```

생성된 `flutter-composer.local.code-workspace`를 VS Code에서 엽니다. Composer와 선택 앱을 함께 표시하는 로컬 파일이며 앱 코드·Git은 변경하지 않습니다.

## 저장소와 기존 앱 보호

두 Composer는 독립 Git 저장소입니다. 생성 앱도 별도 저장소로 관리하며 부모는 `/project/*`·`!/project/.gitkeep`으로 앱을 제외합니다. 이미 추적한 파일은 ignore만 추가해도 제외되지 않습니다.

Composer를 갱신해도 기존 앱은 자동 이행하지 않습니다. 두 Composer의 기존 `project/` 앱·Git·데이터·설정은 수정·삭제·설치·시험 대상으로 사용하지 않습니다. 재현이 필요하면 별도 임시 경로의 새 앱을 사용하고 기존 앱 이행은 별도 요청으로 다룹니다. 생성 앱은 원본 Composer 없이 실행·빌드할 수 있으며 추가 기능의 원본이 필요할 때 구성품을 가져와 비교·반영합니다.

## Composer 전체 변경 확인·업데이트

받은 Composer 루트에서 실행합니다. main은 브랜치 예시이며 실제 추적 브랜치가 다르면 바꿉니다.

```bash
git status --short
git remote -v
git fetch origin
git log --oneline HEAD..origin/main
git diff --stat HEAD origin/main
git diff HEAD origin/main
```

현재 사용하지 않는 구성품도 전체 비교에 포함됩니다. TypeScript 구성품의 변경만 보려면 다음처럼 확인합니다.

```bash
git diff HEAD origin/main -- components/00-common components/01-base components/02-targets components/03-features
```

로컬 변경을 보존하고 README·AGENTS·update.md와 이행 조건을 검토한 뒤 확인한 브랜치를 반영합니다.

```bash
git merge --ff-only origin/main
```

충돌·이력 분기로 실패하면 중단하고 비교합니다. 강제 reset·전체 덮어쓰기로 해결하지 않습니다. 업데이트 후 명령은 각 Composer의 현재 안내를 따릅니다. TypeScript는 기본적으로 짧은 구문·diff 검사만 수행하며 설치·전체 조합·통신·GUI 검사를 자동 실행하지 않습니다. 검사가 필요하면 관련 문서의 경로·명령·선행 조건·목적을 확인하고 요청한 범위에서 수행합니다. 미검증 기록을 이번 검증 완료로 바꾸지 않습니다.

## 기존 Composer 확장·신규 제작

기존 Composer 확장은 해당 저장소의 AGENTS·README·계약을 먼저 읽습니다. `00-common → 01-base → 02-targets`는 초기 형태를 구성하고 `03-features`는 수동 추가할 기능 원본을 관리합니다. TypeScript 형태에 필수인 HTTP·IPC 연결과 선택 기능의 수동 추가를 구분합니다. 세부 명명·폴더·DI·수명 계약은 각 Composer에서 관리합니다.

- [작성 규칙](./authoring-rules.md): 기존 프로젝트 추출·신규 제작의 범위·문서·검사 기준
- [작업 요청문](./project-request.md): 목적·언어/플랫폼·단독형/조립형·출력 위치를 전달하는 양식

추출 결과는 원본 프로젝트의 boilerplate-export/유형명/에, 신규 제작은 지정한 새 폴더에 작성합니다. TypeScript v0.0.0이 역추출 명령을 제공한다는 뜻은 아닙니다. 결과 코드는 별도 저장소에서 관리하고 이 문서 저장소에 복제하지 않습니다.
