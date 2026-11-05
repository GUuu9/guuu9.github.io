# Composer 사용·보일러플레이트 제작

Composer 코드·구성품·상세 개발 규칙·변경 이력은 각 독립 저장소에서 관리합니다. 이 문서 저장소에는 선택·다운로드·업데이트와 보일러플레이트 추출/신규 제작 안내를 둡니다.

| Composer | 용도 | 저장소 |
| :--- | :--- | :--- |
| TypeScript Composer | backend·웹·Electron·Phaser 형태와 선택 기능 | [GUuu9/typescript-composer](https://github.com/GUuu9/typescript-composer) |
| Flutter Composer | Android·iOS·공용 모바일 앱과 선택 기능 | [GUuu9/flutter-composer](https://github.com/GUuu9/flutter-composer) |

## 특정 보일러플레이트만 내려받기

Git·Node/npm을 준비합니다. macOS는 Git·Homebrew·nvm 전에 선택한 CLT 또는 전체 Xcode의 라이선스·최초 초기화를 완료합니다. 설치는 선택한 Composer의 [TypeScript 환경 준비](https://github.com/GUuu9/typescript-composer/blob/main/typescript-backend/docs/01-getting-started.md) 또는 [Flutter 환경 준비](https://github.com/GUuu9/flutter-composer/blob/main/flutter-mobile-application/docs/01-getting-started.md)를 따릅니다. Windows는 D:\Developer 등 실제 데이터 드라이브의 작업 부모 폴더에서 시작합니다.

필요한 Composer 하나만 선택해 받습니다. 같은 이름의 폴더가 이미 있으면 덮어쓰지 말고 기존 저장소의 remote/status를 먼저 확인합니다.

```bash
git clone https://github.com/GUuu9/typescript-composer.git
cd typescript-composer
npm run help
npm run compose -- help
```

Flutter를 사용할 때는 대신:

```bash
git clone https://github.com/GUuu9/flutter-composer.git
cd flutter-composer
npm run help
npm run compose -- help
```

Bash·PowerShell에서 같은 Git/npm 명령을 사용합니다. clone한 폴더 자체가 Composer 루트이며 02.Boilerplates 상위 경로는 없습니다. .nvmrc의 Node를 사용하며 묶음 자체 npm install은 필요하지 않습니다. 상세 설치·형태·기능 목록은 해당 저장소 README를 우선합니다.

## 가져온 뒤 진행

1. help로 형태·이름·출력 위치를 확인하고 compose로 새 프로젝트를 생성합니다.
2. 생성 앱 폴더로 이동해 앱 내부 README의 도구/SDK·환경·의존성을 준비합니다.
3. 앱의 npm run help로 확인한 기능을 feature add로 활성화하고 실행·검사합니다.

앱은 원본 Composer와 별도 저장소로 관리합니다. compose는 생성 성공 시 Composer 루트 .gitignore에 /프로젝트명/을 자동 등록합니다. 앱 폴더 안에서 별도로 git init·첫 커밋·remote 연결을 수행하고 Composer Git에는 앱을 추가하지 않습니다. 이미 추적 중인 파일은 ignore만 추가해도 제외되지 않습니다.

## 생성 앱과 부모 Composer

현재 두 Composer는 생성 앱을 해당 Composer 바로 아래에 두고 개발합니다. 구성품 원본을 앱의 .composer/catalog 또는 .composer/features에 복사하지 않습니다. TypeScript의 기능 추가는 부모의 typescript-backend·components를, Flutter는 components/03-features를 사용합니다. 앱 Git에는 .composer/state.json의 원본 해시·활성 기능·충돌 검사 상태와 도구 스크립트를 보관합니다.

앱의 실행·빌드는 원본 Composer 없이 가능합니다. 기능 추가에는 생성 당시 부모 원본이 필요하며, 뼈대·구성품의 공개 파일과 문서를 포함한 원본 해시가 다르거나 원본이 없으면 중단합니다. 앱만 다른 위치로 옮기면 기능 추가는 사용할 수 없으며 Composer 전체를 상대 배치 그대로 옮기면 계속 사용할 수 있습니다.

Composer를 갱신해도 앱은 자동 변경되지 않지만 후속 기능 추가는 해시 불일치로 중단될 수 있습니다. 갱신 전에 생성 당시 원본을 보존하고 원본 복원 또는 새 앱 생성·비교·이행으로 진행합니다. 기존 사본 방식 앱은 자동 전환하거나 .composer 사본을 삭제하지 않습니다. 세부 계약과 이행 절차는 각 Composer 내부 문서를 따릅니다.

## 전체 변경 확인·업데이트

받은 **Composer 루트**에서 실행합니다. 아래 main은 기본 브랜치 예시이며 실제 추적 브랜치가 다르면 바꿉니다.

```bash
git status --short
git remote -v
git fetch origin
git log --oneline HEAD..origin/main
git diff --stat HEAD origin/main
git diff HEAD origin/main
```

비교 범위는 Composer 전체이므로 현재 쓰지 않는 base·target·feature의 변경도 포함합니다. 구성품만 살펴보려면:

```bash
git diff HEAD origin/main -- components/01-base components/02-targets components/03-features
```

로컬 변경을 먼저 보존하고 변경 이력·지원 조건·보안 수정·이행 방법을 검토합니다. 확인한 origin/main을 반영한 뒤 검사합니다.

```bash
git merge --ff-only origin/main
npm run help
npm run test:compose
```

충돌·이력 분기로 실패하면 중단하고 변경을 비교합니다. 강제 reset·전체 덮어쓰기로 해결하지 않습니다. 기존 sparse/subtree·캐시 방식은 새 저장소에 재사용하지 않고 새 경로로 clone합니다.

기존 앱에 업데이트를 반영하려면 각 Composer의 버전 관리 문서대로 이전 원본·새 원본·사용자 코드를 비교합니다. 앱의 코드·lock·원본 해시·상태·도구·데이터와 필요한 이전 Composer 원본을 보존하며 이행·검증합니다. 기존 사본 방식 앱은 catalog도 보존하며 state 해시만 고쳐 검사를 우회하지 않습니다. Composer 갱신을 앱 업데이트 완료로 표시하지 않습니다.

## 기존 Composer 확장

base·target·feature의 추가/수정은 해당 Composer 저장소 내부 작업 지침·작성 규칙을 따릅니다. 위 저장소 링크에서 최신 기준을 확인하며 이 문서 저장소에서 세부 확장 계약을 중복 관리하지 않습니다.

## 기존 프로젝트 추출·신규 보일러플레이트 제작

- [작성 규칙](./authoring-rules.md): 기존 프로젝트 추출과 신규 제작의 범위·구조·문서·검사 기준
- [작업 요청문](./project-request.md): 작업 유형·목적·언어/플랫폼·단독형/조립형·출력 위치를 정해 개발자/AI에게 전달

추출 결과는 원본 프로젝트의 boilerplate-export/유형명/에, 신규 제작은 지정한 새 폴더에 작성합니다. 결과 코드는 별도 저장소에서 관리하며 이 안내 저장소에 복제하지 않습니다. 신규 제작을 기존 Composer 확장으로 강제하거나 단독형에 생성기를 필수화하지 않습니다.
