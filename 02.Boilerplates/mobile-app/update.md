<!-- version: v1.1.0 -->
# 갱신 이력

## 2026-11-02 — Android/iOS 권한·버전 관리 절차 추가

- 이유·변경: 플랫폼별 권한 설정·동의/거부 검증, Dart/native 패키지 기준 파일, 앱 배포 버전과 업데이트·복귀 절차를 설명서와 작업 지침에 추가했습니다.
- 버전: 문서 1.0.0 → 1.1.0. 앱·Flutter·의존성·플랫폼 설정·lockfile은 변경하지 않았습니다.
- 적용·복귀: 문서 변경만 적용합니다. 재설치·데이터 마이그레이션 없음.
- 검증: 실제 Android manifest·iOS Info.plist와 파일 유무 대조, 공식 권한·패키지 문서 확인, 문서 링크·공백 검사. 권한 기능 구현·기기 실행은 수행하지 않았습니다.

## 2026-11-02 — 첫 Flutter MVVM 샘플 추가

- 이유: 원하는 폴더에서 시작해 Android Studio·VS Code에 연결할 수 있는 재사용 mobile-app 샘플을 마련했습니다.
- 변경: Flutter CLI로 Android/iOS 앱 골격 생성, 인사 화면·생성자 주입·ViewModel·상태/위젯 테스트 및 패키지 문서 추가.
- 버전: 앱 1.0.0+1, Flutter 3.35.7, Dart 3.9.2, flutter_lints 5.0.0. 직접 런타임 패키지 추가 없음. 정확한 의존성은 샘플 `pubspec.lock` 기준.
- 적용·복귀: 새 프로젝트 루트에 `boilerplates/minimal/`을 복사하고 FVM에서 `.fvmrc` 버전을 설치합니다. 제품 프로젝트 ID·앱 이름은 적용 시 변경합니다. 영구 데이터·마이그레이션 없음. 이전 상태로 복귀하려면 유형 폴더 변경을 함께 되돌립니다.
- 검증: macOS 13.7.8 x86_64, Flutter 3.35.7·Dart 3.9.2. 독립 임시 복사본에서 오프라인 `flutter pub get`, `flutter analyze` 통과, 단위·위젯 테스트 3개 통과. `.fvmrc`를 FVM CLI로 읽고 링크를 설정하는 검사는 하지 않았다. Android 생성 시 JDK 25와 Gradle 8.12 호환 경고가 있었고 APK 빌드·Android Studio GUI·기기·Xcode/iOS는 미검증.
