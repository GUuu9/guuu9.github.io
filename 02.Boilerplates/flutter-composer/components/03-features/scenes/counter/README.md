<!-- version: v1.0.0 -->
# 카운터 feature

기능 구현 버전: 0.1.0. Android·iOS·공용에 적용하는 Flutter SDK 전용 화면입니다. 용도·추가 파일·자동 factory는 compose.json과 files를 기준으로 합니다. 선행 feature·외부 패키지·권한은 없습니다.

화면 목록의 카운터를 열고 추가 버튼을 누르면 값이 증가합니다. 앱 수명 동안 상태를 유지하고 앱 종료 후에는 초기화됩니다. 영구 저장 기능이 아닙니다.

factory가 ViewModel과 필요한 Service/Api를 조립해 AppFeature를 반환합니다. 앱 DI가 객체 수명을 소유하고 종료 시 dispose합니다. 명령이 생성 등록부와 assets를 처리하므로 수동 DI 편집은 하지 않습니다. files/test에서 정상·상태·화면을 검사합니다. 실제 SDK/플랫폼 검사 결과는 묶음 update.md를 확인합니다.

자동 제거는 지원하지 않습니다. 해제/복귀는 추가 전 소스·pubspec/lock·상태로 함께 복구하고 다른 기능의 참조를 확인합니다. 사용자 데이터 파일은 생성하지 않습니다. 수정 시 [작성 규칙](../../../../docs/maintainers/03-feature-authoring.md)을 따릅니다.
