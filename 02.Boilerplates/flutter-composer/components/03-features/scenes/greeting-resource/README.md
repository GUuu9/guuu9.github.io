<!-- version: v1.0.0 -->
# 인사 리소스 feature

기능 구현 버전: 0.1.0. Android·iOS·공용에 적용하는 Flutter SDK 전용 화면입니다. 용도·추가 파일·자동 factory는 compose.json과 files를 기준으로 합니다. 선행 feature·외부 패키지·권한은 없습니다.

화면 목록의 인사 리소스를 열고 불러오기 버튼을 누르면 번들 JSON message가 표시됩니다. 잘못된 JSON/빈 message는 안전한 실패 메시지로 표시합니다.

factory가 ViewModel과 필요한 Service/Api를 조립해 AppFeature를 반환합니다. 앱 DI가 객체 수명을 소유하고 종료 시 dispose합니다. 명령이 생성 등록부와 assets를 처리하므로 수동 DI 편집은 하지 않습니다. files/test에서 정상·상태·화면을 검사합니다. 실제 SDK/플랫폼 검사 결과는 묶음 update.md를 확인합니다.

자동 제거는 지원하지 않습니다. 해제/복귀는 추가 전 소스·pubspec/lock·상태로 함께 복구하고 다른 기능의 참조를 확인합니다. 사용자 데이터 파일은 생성하지 않습니다. 수정 시 [작성 규칙](../../../../docs/maintainers/03-feature-authoring.md)을 따릅니다.
