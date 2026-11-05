<!-- version: v1.0.0 -->
# Flutter 공통 base

실행 원본은 묶음의 flutter-mobile-application입니다. 코드 사본을 이곳에 중복하지 않습니다. main → AppDependencies → 생성 feature 목록 → AppFeature 화면으로 연결합니다. 선택 기능이 없으면 빈 시작 화면입니다.

lib/core/app.dart는 화면 목록·이동, app_dependencies.dart는 기능 객체의 소유/해제, app_feature.dart는 공통 계약입니다. features.g.dart는 스크립트 전용이며 사용자 코드는 별도 파일에 작성합니다. base 버전은 compose.json에 기록합니다. Android/iOS 설치 원본은 뼈대에 보관하고 target이 선택하지 않은 플랫폼을 제외합니다.
