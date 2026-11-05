<!-- version: v1.0.0 -->
# Flutter Composer 설계

Flutter 공통 실행 뼈대는 flutter-mobile-application 하나입니다. components/01-base/flutter에는 원본 ID/버전과 책임을, 02-targets에는 android·ios·android-ios의 플랫폼 선언을, 03-features에는 독립 코드/테스트/사용 문서를 둡니다. 네이티브 원본을 플랫폼별로 중복 복제하지 않습니다.

compose는 target·Dart package 이름만 받아 묶음 바로 아래 새 폴더를 생성합니다. 기존 대상·경로·예약어·심볼릭 링크·개인 설정·캐시·서명 키를 거부/제외하고 SDK 설치/배포는 수행하지 않습니다. 선택하지 않은 native 폴더와 Android 전용의 Gemfile을 제외하며 공통 docs는 유지합니다. 앱 식별자·서명은 명시적으로 사용자가 제품화합니다.

생성 앱은 feature.mjs·composer-core.mjs와 .composer/features 원본을 보유합니다. add는 신규 기능 파일을 추가하고 생성기 소유 features.g.dart·pubspec 관리 asset 구간만 갱신합니다. 목록·DI·화면·dispose는 feature factory 계약으로 연결합니다. 사용자 source 파일을 통째로 재생성하지 않습니다. 같은 신규 경로·관리 파일 수정·미지원 형태는 쓰기 전에 중단합니다.

추가 명령은 프로젝트 잠금으로 동시 실행을 막습니다. pub get·analyze·test·선택 플랫폼 native 빌드 후에만 활성 상태를 기록합니다. 실패하면 추가 소스·pubspec/lock·상태를 복구합니다. 캐시·빌드 결과·외부 설치 부작용은 복원하지 않습니다. 비정상 종료는 자동 복구를 보장하지 않으므로 Git diff·잠금과 .composer 상태를 먼저 점검합니다.

외부 pub 의존성·권한·native 패치·선행 feature 자동 계산은 현재 구현하지 않습니다. 이를 요구하는 새 기능은 선언만 늘리지 말고 안전한 계획/병합/복구와 플랫폼 회귀 검사를 먼저 구현합니다. 현재 기능은 Flutter SDK만 사용합니다.

작업별 안내는 [관리 지침](../../project-agents.md), 연결은 [target 안내](./02-assembly-guide.md), 신규 기능은 [작성 규칙](./03-feature-authoring.md)을 따릅니다.
