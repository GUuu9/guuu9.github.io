<!-- version: v1.0.0 -->
# 버전·보안·호환성 관리

base·target·feature의 구현/연결 버전은 각각 compose.json에 기록합니다. sourceDigest는 반출 파일의 SHA-256 스냅샷 식별자이며 Git revision과 별개입니다. 앱 pubspec.version·Flutter/Dart·pub/native 패키지·문서 version은 서로 구분합니다.

오류 수정은 patch, 호환 기능 추가는 minor, API·DI·권한/설정·저장 형식·필수 지원 환경의 비호환 변경은 major로 올립니다. 문서 설명 수정만으로 구현 버전을 올리지 않습니다. 0.x의 비호환 변경도 명시합니다.

| 대상 | 초기 관리 버전 | 용도·제약 |
| :--- | :--- | :--- |
| flutter-mobile-application base | 0.1.0 | Flutter DI·화면 목록·수명 |
| android / ios / android-ios target | 각각 0.1.0 | native 플랫폼 선택, 각 도구 설치 필요 |
| greeting-resource | 0.1.0 | 번들 JSON·MVVM, 추가 권한/외부 패키지 없음 |
| counter | 0.1.0 | 메모리 상태·화면, 종료 시 초기화 |

초기 버전 부여는 전체 플랫폼 검증 완료 표시가 아닙니다. 새 기능은 ID·용도·버전·지원 target·선행/충돌·권한/패키지·데이터 계약과 이행/복귀를 등록합니다. 목록·기능 README·compose.json을 함께 갱신합니다.

보안/지원 변경은 공식 권고·EOL·스토어 조건 → 영향 버전/노출 기능 판단 → 별도 브랜치 최소 변경 → 고정 SDK·manifest/lock·native 설정·지원 범위 갱신 → 생성/기존 add 회귀·실제 빌드/기기 → 새 조합 기록 순서입니다. 보류하면 이유·완화책·담당·재점검 날짜를 기록합니다. Flutter·Gradle·JDK·Xcode·Ruby를 무관하게 일괄 갱신하지 않습니다.

정상 조합의 키는 원본 스냅샷/revision + base/target + feature ID/버전 + pub/native lock + Flutter/Dart/도구 + OS/CPU/기기입니다. [앱 관리 양식](../../flutter-mobile-application/docs/07-version-management.md)에 실제 검사 날짜·명령·로그·결과·한계·마지막 정상 조합·데이터 복귀를 기록합니다. 생성/모의 검사·분석/테스트·native 빌드·기기·스토어를 구분하고 이전 통과/실패 기록은 보존합니다.

기존 앱의 catalog/state·스크립트 자동 업데이트는 지원하지 않습니다. 새 원본으로 별도 앱을 생성해 비교·이행합니다. state 버전/해시만 바꿔 충돌 검사를 우회하지 않습니다. 실제 코드·lock·데이터·공유 설치 요소의 호환성을 확인합니다. 취약 버전 복귀는 노출 완화와 수정 재적용 계획이 필요합니다.

공식 근거: [Flutter SDK 보관](https://docs.flutter.dev/install/archive), [Android 배포](https://docs.flutter.dev/deployment/android), [iOS 배포](https://docs.flutter.dev/deployment/ios), [Dart pub](https://dart.dev/tools/pub). 확인일 2026-11-05: 특정 현재 버전의 모든 보안/지원 조건을 재검증한 것은 아닙니다.
