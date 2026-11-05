<!-- version: v1.1.0 -->
# Flutter feature 작성 규칙

새 기능을 작성하는 관리자·AI는 이 문서와 실제 composer-core.mjs·feature.mjs·테스트·Git 상태를 먼저 읽습니다. [버전 규칙](./04-version-and-update-policy.md)에 따라 기능·문서·패키지 버전을 구분합니다.

## 배치·선언

```text
components/03-features/scenes/기능-id/
├── README.md
├── compose.json
└── files/
    ├── lib/scenes/기능명/
    ├── test/scenes/기능명/
    └── docs/NN-feature.md
```

분류는 scenes·services·utils·core 등 실제 책임에 맞게 정하고 빈 기능을 만들지 않습니다. 신규 경로는 전역에서 충돌하지 않아야 합니다. docs 번호도 같이 선택할 기능과 충돌하지 않게 합니다. 현재 제공 기능 문서는 08·09이며 다음 기능은 10부터 사용합니다.

```json
{
  "id": "counter",
  "version": "0.1.0",
  "description": "메모리 카운터·화면 예제",
  "targets": ["android", "ios", "android-ios"],
  "entry": "scenes/counter/counter_feature.dart",
  "factory": "createCounterFeature",
  "assets": []
}
```

ID는 소문자 kebab-case, entry는 lib 기준 Dart 파일, factory는 해당 파일의 최상위 함수입니다. 스크립트는 폴더를 탐색하므로 코드의 ID 목록을 따로 중복 등록하지 않습니다. 현재 계약은 화면을 가진 AppFeature이며 순수 service/util만 독립 추가하려면 공통 계약과 검사부터 확장합니다. 현재 선언에 없는 dependencies·patches·requires 등의 필드를 임의 추가해 동작한다고 안내하지 않습니다.

## 코드·자동 연결

1. factory에서 API·Service·ViewModel을 조립하고 AppFeature(id/title/screen/dispose)를 반환합니다. Scene에서 Service 구현을 직접 생성하지 않습니다. 작은 카운터에 빈 API·Service 계층은 만들지 않습니다.
2. 재사용 템플릿의 package import는 mobile_app_sample 기준이며 생성/활성화 때 앱 package 이름으로 바뀝니다. 상대 import는 활성 앱 안에서 해결합니다.
3. files는 전용 lib/test/docs 경로만 추가합니다. lib/core·pubspec·native 전체를 덮어쓰지 않습니다. 필요한 resource 파일과 assets 선언을 함께 추가합니다. 개인 설정·symlink·서명·캐시는 제외합니다.
4. add가 생성 등록부 import/factory·DI 목록·화면 이동·dispose·pubspec asset을 자동 반영해야 합니다. 사용자가 연결 코드를 고치게 하지 않습니다.
5. 외부 입력 검증·안전한 실패·재시도·해제를 구현하고 dispose 후 비동기 알림을 막습니다. 데이터·권한·패키지가 필요하면 먼저 구현/병합 지원을 확장하고 동의/거부·저장 호환/복귀를 함께 정의합니다.
6. README는 기능 버전·용도·지원 target·선행 조건·권한/패키지·코드/계약·검사·해제/데이터 보존을, files/docs는 앱 내부 사용법을 설명합니다. 원본 묶음 밖 링크를 앱 docs에 넣지 않습니다.

## 등록·검사·완료

기능을 추가하면 구성품 목록·묶음 README의 사용자 목록·버전 목록·웹 메뉴·작업 지침·update.md를 갱신합니다. 앱에는 catalog snapshot이 전달되며 기존 앱이 새 기능을 자동 다운로드하지 않습니다.

```bash
npm run test:compose
```

임시 묶음/앱에서 다음을 검사합니다.

- 세 target의 미선택 출력과 기존 기능 동작 유지
- 단독·복수·추가 순서 양쪽·중복 호출, 실제 화면/DI/asset·dispose 연결
- 같은 파일/문서 충돌·생성 연결부 수정·잘못된 경로/심볼릭 링크·미지원 형태의 무변경 중단
- pub get·analyze·test·빌드 실패 시 소스/pubspec/lock/상태 복구 및 동시 실행 잠금
- 깨끗한 복사본에서 실제 FVM SDK·pub get·analyze·test와 선택 플랫폼 빌드·기기 동작

모의 FVM 성공을 실동작 검증으로 표시하지 않습니다. GUI·실기기·macOS 외 OS·서명·스토어 미검증은 구분해 기록합니다. 버전별 정상/실패 조합을 보존하고 검증되지 않은 조합을 지원 보장으로 확대하지 않습니다.

## 사용자 안내 갱신·완료 조건

feature 추가·용도/버전·지원 형태·사용 명령 변경 시 코드 등록 후 아래 안내를 같은 작업에서 갱신합니다. 문서와 도움말 갱신이 빠졌다면 기능 추가를 완료로 처리하지 않습니다.

| 갱신 대상 | 반영할 내용 |
| :--- | :--- |
| 묶음 README.md·뼈대 README.md | npm run help → npm run compose -- help 안내 유지, 기능 목록·용도·선택 예제 갱신 |
| docs/01-getting-started.md | 기능 추가 명령·선행 환경·지원 형태·검증/복구·도움말 진입 순서 |
| compose.mjs의 명령/상세 도움말 | npm run help·compose help/--help의 기능 목록·용도·제약·예제 |
| feature.mjs의 앱 도움말 | 생성 앱의 npm run help에 필요한 기능 명령·검증/복구·예제 |
| 생성기 README 출력·files/docs | 앱 내부의 기능 목록/사용 안내·필요 환경·추가 후 확인과 복귀 |
| 구성품/버전 목록·해당 README·update.md | 기능 ID·구현 버전·용도·호환 조합·실제 검사·이행/복귀 |

완료 전 실제 묶음/뼈대의 npm run help와 npm run compose -- help, 새로 생성한 앱의 npm run help를 호출해 문서·선언과 대조합니다. 새 기능 활성화 후 해당 사용 문서의 링크·명령·설명도 확인합니다. 도움말의 무변경 회귀 검사를 유지하고 상대 링크·앵커·코드 펜스·웹 메뉴·git diff --check를 검사합니다. 기존에 반출된 앱의 문서는 자동 갱신되지 않으므로 원본 변경과 기존 앱 이행을 구분합니다.
