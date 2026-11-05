<!-- version: v5.0.1 -->
# Flutter 앱 작업 지침

## 범위와 읽기 순서

pubspec.yaml이 있는 앱 루트에서 작업합니다. Composer 관리 지침과 구분하며 생성된 AGENTS.md는 이 파일과 같습니다. 작업 전 Git 상태·버전/lock·관련 호출자·테스트를 읽습니다. 여러 영역을 바꾸면 해당 행을 함께 적용합니다.

| 작업 | 먼저 읽을 문서 | 확인·갱신 |
| :--- | :--- | :--- |
| 설치·실행·IDE | [시작](docs/01-getting-started.md) → [환경](docs/02-project-environment.md) | FVM·Node·PATH·기기·VS Code |
| Android 도구·권한·식별자 | [Android](docs/03-android-build.md) → [배포](docs/06-build-and-release.md) | SDK/JDK·Gradle/AGP·권한·서명 |
| iOS 도구·권한·식별자 | [iOS](docs/04-ios-build.md) → [배포](docs/06-build-and-release.md) | Xcode 초기화·Ruby/Gemfile·배포 대상·서명 |
| 화면·상태·DI·데이터 | [구조](docs/05-boilerplate.md) → docs의 해당 기능 사용법 | 호출자·테스트·해제 |
| feature 활성화 | [README](README.md#기능-추가) → docs의 해당 기능 사용법 | list → add, 충돌/검사/복구 |
| 보안·지원·버전·기능 조합 | [버전 관리](docs/07-version-management.md) | 정상 조합·근거·이행/복귀 |
| 릴리스·스토어 | [배포](docs/06-build-and-release.md) | 산출물·지원 범위·제출·데이터·복귀 |

## 개발 경계

View는 주입된 ViewModel을 사용합니다. 기능 factory/DI가 Service·API·상태를 조립하고 앱 종료 때 해제합니다. 외부 입력을 검증하고 예외·비밀값을 화면에 노출하지 않습니다. 비동기 완료가 dispose 이후 상태를 알리지 않게 처리합니다. 작은 기능에 빈 계층을 추가하지 않습니다.

features.g.dart와 pubspec의 composer:assets 구간, .composer 원본/상태는 스크립트 소유입니다. 사용자 코드는 별도 파일에 작성하며 충돌 검사를 해시 편집으로 우회하지 않습니다. 새 재사용 feature·명령 자체 변경은 Composer 관리자 작업입니다.

선택 플랫폼의 도구만 준비합니다. Xcode 라이선스·초기화는 Git/Homebrew 등 사용 전에 확인합니다. 환경은 프로젝트/자식 셸에서 선택하고 전역 기본값을 바꾸지 않습니다. 실제 .env·키·서명·캐시·local.properties·빌드 결과는 Git에서 제외합니다. 플랫폼 설정·lock을 재초기화/삭제해 문제를 숨기지 않습니다.

## 확인과 보고

변경 후 fvm flutter analyze·test와 영향받는 플랫폼 빌드·기기/권한/저장/종료 동작을 확인합니다. 기능 명령 실패 시 소스/lock/상태 복구와 별개로 캐시·외부 작업 영향도 확인합니다. 문서·version·update.md의 조합/검증/복귀를 갱신하고 모의 검사·실기기·다른 OS·배포 여부를 구분합니다. 커밋·push·배포는 요청된 범위에서만 합니다.

update.md의 새 이력은 제목·소개 바로 아래 맨 위에 추가합니다. 같은 날짜의 새 작업도 기존 항목 위에 두고 검증은 해당 항목의 하위 절에 묶습니다.
