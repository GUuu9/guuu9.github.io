<!-- version: v1.2.0 -->
# Flutter Composer

이 폴더 전체를 복사해 Android 전용·iOS 전용·공용 Flutter 앱을 생성합니다. 앱 개발은 VS Code, Android Studio는 가상 기기 관리에 사용합니다.


## 명령 도움말

묶음 루트 또는 뼈대 폴더에서 Node/npm 준비 후 먼저 실행합니다.

```bash
npm run help
npm run compose -- help
```

help는 명령 목록, compose help는 형태별 용도·이름 규칙·생성 위치·예제·후속 준비를 안내합니다. 기존 compose -- --help도 같은 상세 안내입니다. 생성 앱에서는 npm run help로 feature 명령과 검증/복구 범위를 확인합니다.

## 선행 도구·내려받기

macOS는 Git 사용 전에 CLT 또는 iOS 개발용 전체 Xcode의 라이선스·최초 초기화를 마칩니다. Git과 Node/npm(.nvmrc)을 준비합니다. [도구 설치·확인](docs/01-getting-started.md)을 먼저 읽습니다. Node는 조립 명령용이며 앱 런타임이 아닙니다. 다운로드는 변경이 원격에 반영된 뒤 가능합니다.

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/flutter-composer
cd 02.Boilerplates/flutter-composer
```

## 생성·실행

| 형태 | 생성 플랫폼 |
| :--- | :--- |
| android | android/만 포함 |
| ios | ios/와 Gemfile만 포함; 실행·빌드는 macOS 필요 |
| android-ios | 두 플랫폼 포함 |

```bash
cd flutter-mobile-application
npm run compose -- android-ios my_app
cd ../my_app
```

이름은 Dart 패키지 규칙의 영문 소문자·숫자·밑줄을 사용합니다. 경로는 입력하지 않습니다. 복사한 Composer 바로 아래 my_app에 생성하며 기존 폴더는 덮어쓰지 않습니다. 루트 별칭도 같은 위치를 사용합니다. 묶음 자체의 npm install은 필요하지 않습니다.

이후 생성 앱의 README와 docs/01-getting-started.md에서 FVM·선택 플랫폼 SDK/JDK/Xcode/Ruby 설치·PATH·버전·기기를 준비합니다. 준비한 앱 루트에서:

```bash
fvm install
fvm flutter pub get
fvm flutter analyze
fvm flutter test
npm run feature -- add greeting-resource,counter
fvm flutter devices
fvm flutter run -d 기기ID
```

종료는 Ctrl+C입니다. feature 없이도 빈 앱이 실행됩니다. 기능 명령은 설치·분석·테스트와 준비된 플랫폼 빌드까지 수행하므로 플랫폼 도구 준비 후 호출합니다.

| feature | 버전 | 용도 |
| :--- | :--- | :--- |
| greeting-resource | 0.1.0 | 기존 번들 JSON·Api/Service·비동기 MVVM 샘플 |
| counter | 0.1.0 | 메모리 상태·ViewModel·화면 샘플 |

[사용자 가이드](docs/01-getting-started.md)에서 명령·충돌·복구를 확인합니다. 관리자/AI는 [작업 지침](project-agents.md)을 먼저 읽습니다. [검증 이력](update.md)은 실행·배포 여부를 구분합니다.

## 보일러플레이트 업데이트

원본 Git이 갱신돼도 개발 중인 앱에는 자동 반영되지 않습니다. [원본 갱신·앱 이행 절차](./flutter-mobile-application/docs/07-version-management.md#git에서-보일러플레이트가-갱신된-경우)를 따라 기존 앱을 보존하고 별도 위치에서 같은 구성을 생성·비교·검증합니다. catalog/state만 교체하거나 앱 폴더를 덮어쓰지 않습니다.
