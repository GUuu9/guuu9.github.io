<!-- version: v1.0.0 -->
# Flutter Composer 변경·검증 이력

## 2026-11-05 — 조립형 Flutter 묶음

- 기존 mobile-app의 native 설정·버전·잠금·문서·이미지를 flutter-mobile-application으로 이동했습니다. 과거 검증은 [기존 앱 이력](flutter-mobile-application/update.md)에 보존합니다. native 요구 버전·서명 예시는 임의로 업그레이드하지 않았습니다.
- 공통 base와 android·ios·android-ios target으로 새 앱을 생성합니다. 선택하지 않은 native 폴더·Gemfile·migration 항목은 제외하고 설치 문서는 유지합니다. 이름은 Dart snake_case이며 기존 대상·경로·예약어·심볼릭 링크·개인 설정/캐시/서명 키를 보호합니다.
- greeting-resource는 기존 번들 JSON·Api/Service·MVVM 예제를 옮긴 선택 기능, counter는 SDK 전용 상태/화면 예제입니다. 기능은 DI/화면/해제와 pubspec asset 구간에 자동 연결됩니다. 비동기 작업의 dispose 후 알림도 차단합니다.
- 반출 앱에 로컬 catalog·구현 버전·용도·활성 상태·원본 스냅샷 해시와 feature 명령을 포함합니다. 중복·충돌·잠금·검사 실패 시 소스/pubspec/lock/상태 복구를 구현했습니다. 캐시·빌드 산출물·외부 설치 작업은 복구하지 않습니다.
- 사용자/관리자 문서·작업별 읽기 순서·신규 feature 계약·버전/보안/정상 조합 기록을 추가하고 기존 도구/목록/웹 메뉴를 새 경로로 연결했습니다. 앱 개발은 VS Code, Android Studio는 가상 기기 관리입니다.

## 검증 범위

- Node v26.13.0·macOS x64: 조립기 회귀 검사 5개 통과. 세 target 출력·문서 링크·단독/복수 추가·양방향 순서·중복·사용자 파일 보존·잘못된 입력/경로/선언·심볼릭 링크·충돌·잠금·실패 복구·플랫폼별 검증 명령을 확인했습니다. FVM/native 검증 명령은 이 회귀 검사에서 모의 실행했습니다. .nvmrc의 Node 24.22.1에서는 이번에 실행하지 않았습니다.
- 설치된 Flutter 3.35.7 / Dart 3.9.2·macOS x64의 임시 앱에서 SDK 기본 의존성 오프라인 복원 후 실제 analyze를 확인했습니다. 기능 미선택 1개, greeting-resource 8개, counter 3개 테스트가 통과했습니다. 두 기능 조합(android-ios, both_app)도 analyze·테스트 10개가 통과했습니다. dispose 이후 비동기 완료의 알림 차단 검사를 포함합니다. 앱 이름은 각각 base_app·greeting_app·counter_app이며 target은 android·ios·android입니다.
- 새 외부 pub 의존성을 추가하지 않았습니다. native 소스·Gradle Wrapper·플러그인·SDK/iOS 최소 버전은 기존 설정을 유지했습니다.
- Android APK/AAB·iOS native 빌드·VS Code GUI·에뮬레이터/실기기·서명·스토어·Windows/Linux 실제 실행·Jekyll 화면은 미검증입니다. Android/iOS의 모의 빌드 명령 통과는 이 범위를 보장하지 않습니다.

- JSON/YAML·상대 링크/앵커·코드 펜스·웹 메뉴·공백과 native 파일/이미지 이동 전후 동일성을 확인했습니다. Dart 포맷은 설치된 Dart 3.9.2로 확인했으며 원본에는 pub 복원을 하지 않아 flutter_lints include 해석 경고가 있었고 실제 복사본 분석은 통과했습니다.

## 2026-11-05 — 명령 도움말 통일

- 묶음/뼈대의 npm run help와 compose help/--help를 구분하고 형태·이름·위치·예제·제약을 상세 안내합니다.
- 생성 앱의 help는 feature 목록/추가·검증·충돌/복구 안내로 연결합니다. 도움말은 파일 생성·설치·빌드를 실행하지 않습니다.

- 검증: 두 Composer 회귀 검사 총 12개 통과. 각 묶음 루트/뼈대의 실제 npm run help·compose help 호출과 반출 앱의 help/무변경 상태를 확인했습니다. 도움말 변경으로 native/GUI/배포 검사를 반복하지 않았습니다.

## 2026-11-05 — feature 안내 갱신 완료 조건

- feature 추가/변경 절차에 묶음·뼈대 README, 사용자 가이드, 명령 도움말, 생성 앱 안내, 기능/버전 목록의 동시 갱신을 필수 단계로 명시했습니다.
- 실제 도움말과 기능 활성화 후 사용 문서를 대조하며 안내 갱신 누락은 완료로 처리하지 않습니다. 기존 반출 앱의 자동 문서 갱신을 의미하지 않습니다.
