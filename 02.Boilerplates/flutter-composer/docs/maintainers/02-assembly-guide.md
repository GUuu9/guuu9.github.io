<!-- version: v1.0.0 -->
# 결과 형태·연결·검증

| target | 포함/제외 | 먼저 준비할 native 도구 | 확인 |
| :--- | :--- | :--- | :--- |
| android | Android만, ios/Gemfile 제외 | SDK·라이선스·JDK 17·Gradle Wrapper | pub get·analyze·test·debug APK·기기 |
| ios | iOS/Gemfile, android 제외 | macOS·Xcode 초기화·Ruby/Bundler | pub get·analyze·test·simulator 빌드·기기/서명 |
| android-ios | 두 플랫폼 | 두 도구 체계 | 플랫폼별 빌드·기기를 각각 기록 |

플랫폼 원본은 뼈대에 있고 target은 components/02-targets/형태/compose.json의 platforms만 선택합니다. 구현에는 일치 검사가 있으므로 새 형태나 별도 버전 구성을 추가하려면 생성기·선언·테스트를 함께 변경합니다. .metadata의 선택하지 않은 migration 항목도 출력에서 제외합니다.

공통 main → DI → features.g.dart → factory → 화면/상태 연결은 동일합니다. 신규 기능은 factory에서 수명 소유·해제를 등록합니다. pubspec의 관리 asset 구간은 선택 기능들의 assets 합집합으로 생성합니다. Android 전용/iOS 전용 생성은 플랫폼 build 성공이나 스토어 지원 보장이 아닙니다.

native 상세 설치는 출력 앱의 docs/03-android-build.md·04-ios-build.md, 제출은 06-build-and-release.md를 따릅니다. 개발은 VS Code, Android Studio는 가상 기기 생성/관리 용도입니다. 기능 연결을 위해 사용자가 DI·import를 수동 편집하는 절차는 완료로 보지 않습니다.
