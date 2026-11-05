<!-- version: v1.0.0 -->
# 카운터

기능 버전 0.1.0. Flutter SDK만 사용하며 Android/iOS의 추가 권한·native 패키지는 없습니다.

화면 목록의 카운터를 열고 추가 버튼을 누르면 값이 증가합니다. 앱 수명 동안 상태를 유지하고 앱 종료 후에는 초기화됩니다. 영구 저장 기능이 아닙니다.

lib/scenes 아래 해당 기능의 Scene·ViewModel과 factory를 확인합니다. greeting-resource는 lib/apis·lib/resource의 번들 접근/검증도 사용합니다. 기능 목록·DI·해제·asset 등록은 명령이 적용했습니다. 생성 연결 파일을 직접 수정하지 않습니다.

앱 루트에서 fvm flutter analyze·test와 선택 플랫폼 빌드·기기 동작을 확인합니다. 실제/미검증 범위와 버전 변경은 update.md 및 docs/07-version-management.md의 버전 관리에 기록합니다. 자동 제거는 지원하지 않으며 추가 전 코드·lock·활성 상태를 함께 복구합니다. 영구 사용자 데이터는 없습니다.
