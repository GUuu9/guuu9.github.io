<!-- version: v1.0.0 -->
# Flutter Composer 관리 지침

이 묶음의 관리자·AI용입니다. 출력 앱은 자체 AGENTS.md를 사용합니다. 변경 전 Git 상태·버전/lock·관련 코드·호출자·테스트·구성품을 확인합니다. 사용자 변경/삭제를 복원하지 않습니다.

| 작업 | 먼저 읽을 문서 | 함께 갱신·확인 |
| :--- | :--- | :--- |
| 뼈대·공통 계층 | [설계](docs/maintainers/01-composition-design.md) → [앱 구조](flutter-mobile-application/docs/05-boilerplate.md) | DI·수명·기능 미선택·세 target 출력 |
| target·플랫폼 | [연결](docs/maintainers/02-assembly-guide.md) → 대상 플랫폼 설치/배포 문서 | 선언·native 원본·지원 범위·조합 검사 |
| feature 추가·수정 | [작성 규칙](docs/maintainers/03-feature-authoring.md) → 대상 README/compose.json | 자동 연결·소유 파일·권한/패키지·중복/충돌/복구 |
| compose·feature 명령 | [설계](docs/maintainers/01-composition-design.md) → [작성 규칙](docs/maintainers/03-feature-authoring.md) → [사용자 가이드](docs/01-getting-started.md) | scripts·테스트·catalog/state·반출 앱 |
| 보안·버전·지원·업데이트 | [버전 규칙](docs/maintainers/04-version-and-update-policy.md) | 원본/기능 버전·정상 조합·이행/복귀 |
| 문서·경로 | 대상 문서 → [사용자 입구](README.md) | 들어오는 링크·웹 메뉴·반출 문서 |

공통 base는 flutter-mobile-application에만 두고 구성품의 files는 새 앱에 반입할 독립 코드·테스트·docs입니다. 생성 앱은 Composer 외부 파일을 참조하지 않습니다. 사용자 문서에 수동 DI/import 편집을 요구하지 않습니다. feature 작성 시 자동 연결·충돌·검증·복구까지 구현합니다.

생성 파일/관리 asset 구간과 사용자 파일의 소유를 구분합니다. 검사를 우회하는 통째 덮어쓰기·실패 무시·해시 수정을 하지 않습니다. 외부 입력·비동기 dispose·권한/동의·개인 설정/서명 제외와 데이터 보존을 유지합니다. 전역 SDK·도구를 프로젝트 작업으로 바꾸지 않습니다.

변경 후 npm run test:compose, 임시 출력의 실제 Flutter pub get·analyze·test와 필요한 플랫폼 빌드/기기 확인을 수행합니다. 새 의존성을 추가하면 깨끗한 설치도 검사합니다. 못 한 GUI/플랫폼/스토어는 미검증으로 기록합니다. README·docs·웹 메뉴·update.md의 링크/버전/실제 결과를 맞추고 git diff --check를 수행합니다. 커밋·push·배포는 요청 범위에서만 합니다.
