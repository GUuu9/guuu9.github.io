<!-- version: v1.4.0 -->
# 1. 범위와 작업 루트

이 지침은 `boilerplates/minimal/` Flutter 샘플을 수정하는 새 프로젝트용 보관본이며 이 저장소에 자동 적용되지 않는다. 명령은 샘플 루트에서 실행한다. 전체 실행 안내는 실행 루트의 `README.md`, 역할·흐름은 [설명서](docs/boilerplate.md)를 따른다.

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

# 프로젝트 환경 관리

- 필요한 설치 요소·정확한 버전·공식 설치 명령·실행 위치·환경 변수·검증·복귀·삭제 영향을 프로젝트 README와 docs/environment.md에 기록한다. 실제 사용하는 버전 파일·잠금 파일을 우선하며 불필요한 관리자를 추가하지 않는다.
- 공용 버전 요구·로딩 양식은 Git에 보관하고 개인 경로·비밀값·캐시는 `.env`·`.local/` 등 Git 제외 파일로 둔다. 관련 ignore를 함께 갱신한다.
- 프로젝트 작업을 위해 셸 전역 JAVA_HOME/PATH·rbenv global·사용자 Flutter config·전역 Xcode 선택을 바꾸지 않는다. 환경은 프로젝트 및 하위 폴더에서만 적용하고 이탈 시 복원을 확인한다. IDE·CI의 별도 선택도 검사한다.
- 도구의 설정 우선순위 때문에 격리를 보장할 수 없으면 공유 설정을 임의 변경하지 말고 중단·분리 환경 선택과 한계를 기록한다. 폴더 진입 시 설치·갱신·삭제하지 않는다. 공유 SDK·Ruby·JDK·Xcode 삭제 전 다른 프로젝트 참조와 복귀 가능성을 확인한다.

시작 안내는 가져오기·새 폴더 복사 → 도구 설치·프로젝트 환경 선택 → 잠금 파일로 의존성 복원 → 실행·종료 → 검증 순서를 유지한다. 처음 사용하는 사람의 진입점은 docs/getting-started.md이며 구조 설명·개발 규칙은 이후에 연결한다. 필요한 설치 명령·위치·권한·버전 확인은 프로젝트 안에서 문서화하고, 기존 프로젝트의 공용 설정·잠금 파일을 초기 복원을 위해 바꾸지 않는다. 샘플만 분리해도 필요한 최소 준비와 실행 절차가 README에 남도록 한다.

공유 환경 양식은 `.env.example`, 개인 실제 값은 Git 제외 `.env`로 관리한다. 새 앱에는 Git에 기록된 템플릿만 내보내고 캐시·빌드 결과·개인 설정을 복사하지 않는다. 명령은 패키지에서는 minimal, 적용 후에는 새 프로젝트 루트에서 실행한다.

Ruby는 프로젝트 `.ruby-version`으로 선택하고 `rbenv shell`·global을 기본 전환에 사용하지 않는다. CocoaPods가 필요한 경우 Gemfile·Gemfile.lock과 Bundler로 고정하고, iOS Flutter 실행·빌드도 `bundle exec` 안에서 수행한다. direnv·특정 Flutter 버전용 로컬 실행기는 선택 사항으로 유지한다.

## 빌드·배포 작업

배포 관련 변경은 [빌드·배포 가이드](docs/build-and-release.md)에 대상·식별자·버전·산출물·서명/운영 설정·검증·보관·복귀를 함께 갱신합니다. 미구현 패키징·운영 설정을 완료로 주장하지 않고 로컬 빌드와 실제 배포 검증을 구분합니다. 자격증명은 Git에 넣지 않으며 원격 게시·업로드·배포는 요청받은 범위에서만 수행합니다.
