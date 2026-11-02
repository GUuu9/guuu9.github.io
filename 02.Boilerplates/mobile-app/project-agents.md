<!-- version: v1.1.0 -->
# 1. 범위와 작업 루트

이 지침은 `boilerplates/minimal/` Flutter 샘플을 수정하는 새 프로젝트용 보관본이며 이 저장소에 자동 적용되지 않는다. 명령은 샘플 루트에서 실행한다. 전체 실행 안내는 [샘플 README](boilerplates/minimal/README.md), 역할·흐름은 [설명서](docs/boilerplate.md)를 따른다.

# 2. 작업 전 확인

- 적용 지침·Git 상태·변경 파일·Flutter 버전·`pubspec.yaml`·`pubspec.lock`을 확인한다.
- 관련 View·ViewModel·Service·DI 조립·테스트와 호출 관계를 읽고 수정 범위를 정한다.
- `.fvmrc`와 `fvm flutter --version`이 일치하는지 확인한다. 잠금 파일을 삭제하거나 임의로 수작업 수정하지 않는다.

# 3. 구조·명명·의존 경계

- `lib/main.dart`는 시작, `core/di/`는 객체 조립, `features/<feature>/presentation/`은 View·ViewModel, `features/<feature>/data/`는 실제 필요한 데이터 접근을 맡는다.
- View는 ViewModel의 상태를 표시하고 사용자 동작을 전달한다. ViewModel이 데이터 계층 계약을 사용한다. 데이터 계층은 Flutter 화면을 import하지 않는다.
- DI에서 구현체를 주입한다. 화면·ViewModel이 서비스 구현을 직접 만들거나 정적 전역 상태에 의존하지 않는다.
- 작은 앱에 없는 Repository·domain·routing·상태관리 프레임워크를 미리 추가하지 않는다. 실제 요구가 생긴 뒤 구조와 설명서를 함께 갱신한다.
- 현재 샘플은 네트워크·저장소가 없으므로 `GreetingService`의 로컬 구현만 둔다. 이를 제품 데이터 영속성이나 API 예제로 설명하지 않는다.

# 4. 구현 원칙

- 기능의 정상·대기·오류 상태를 구분하고 재시도 가능한 화면 흐름을 유지한다.
- 사용자에게 예외 상세·비밀값을 보여주거나 로그에 기록하지 않는다. 실패를 성공 상태로 숨기지 않는다.
- ViewModel·ChangeNotifier 수명은 앱 조립 경계에서 소유하고 종료 시 dispose한다.
- 새 의존성은 필요성이 확인된 경우에만 추가하고 `pubspec.lock`을 Flutter Pub으로 갱신한다. `.fvm/`, `.dart_tool/`, `build/`, 개인 `local.properties`는 추적하지 않는다.
- Android Gradle·AGP·JDK, Xcode·CocoaPods 버전을 무관하게 함께 올리지 않는다. 기존 프로젝트가 고정한 버전과 지원 조건을 먼저 확인한다.

# 5. 실제 실행·검증 명령

```sh
fvm install
fvm flutter pub get
fvm flutter analyze
fvm flutter test
fvm flutter run
```

Android 빌드에는 Android SDK와 Gradle이 지원하는 JDK, iOS 빌드에는 macOS·Xcode가 필요하다. IDE·에뮬레이터·실기기는 CLI 검사와 구분해 실제 확인했을 때만 보고한다.

# 6. 완료·보고

- 코드·호출자·DI·테스트·설정·문서와 `.fvmrc`/lockfile을 함께 확인한다.
- 상세 설명서의 파일 목록·두 Mermaid 다이어그램·요구사항 대조표를 실제 샘플과 맞춘다.
- 독립 복사본에서 가능한 복원·analyze·test·build 확인을 수행한다. 미실행한 GUI·플랫폼 검사는 사유와 함께 표시한다.
- 코드·설정·의존성·문서 변경 시 유형 루트의 `update.md`에 실제 버전 전후·적용/복귀·검증 결과를 기록한다.
- 사용자 변경·생성 설정·인증 자료를 보존하고, 커밋·push·배포는 요청된 경우에만 한다.

Android/iOS 기능·플러그인 변경 시 권한 선언·런타임 동의·거부 동작, Dart/native 패키지 버전·잠금 파일, 빌드 도구 호환성과 복귀 절차를 설명서의 플랫폼 관리 절차에 맞춰 기록한다. 검증한 OS·기기·앱 업데이트 데이터 보존 결과를 update.md에 남긴다.
