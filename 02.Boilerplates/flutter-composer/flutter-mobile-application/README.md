<!-- version: v5.1.0 -->
# Flutter Mobile Application 뼈대

이 폴더는 Flutter Composer의 공통 원본입니다. 원래 mobile-app의 네이티브 설정·문서·버전·잠금 파일을 유지하고 인사 샘플은 greeting-resource feature로 분리했습니다. 폴더를 직접 복사하기보다 묶음에서 compose로 플랫폼을 선택합니다.

```bash
npm run compose -- android-ios my_app
cd ../my_app
```

먼저 Node/npm을 준비합니다. 생성 앱 안의 [환경 준비](docs/01-getting-started.md) → [환경 선택](docs/02-project-environment.md) → Android 또는 iOS 도구 설치 → 의존성 복원 → 실행·검사 순서로 진행합니다.

뼈대 자체를 검사할 때는 FVM 3.35.7을 준비한 이 폴더에서 실행합니다.

```bash
fvm install
fvm flutter pub get
fvm flutter analyze
fvm flutter test
```

실행은 fvm flutter devices 후 fvm flutter run -d 기기ID, 종료는 Ctrl+C입니다. 뼈대는 기능 없는 시작 화면이며 생성 프로젝트에서는 npm run feature -- add greeting-resource,counter로 기능을 추가합니다. Node 조립기 검사는 npm run test:compose입니다.

[구조](docs/05-boilerplate.md)·[빌드·배포](docs/06-build-and-release.md)·[버전 관리](docs/07-version-management.md)·[작업 지침](project-agents.md)·[기존 이력](update.md)을 확인합니다. 뼈대의 Android/iOS 설정값은 제품 식별자·서명을 대신하지 않습니다. APK/iOS 네이티브 빌드·실기기·스토어 제출은 별도 검증입니다.


## 명령 도움말

묶음 루트 또는 뼈대 폴더에서 Node/npm 준비 후 먼저 실행합니다.

```bash
npm run help
npm run compose -- help
```

help는 명령 목록, compose help는 형태별 용도·이름 규칙·생성 위치·예제·후속 준비를 안내합니다. 기존 compose -- --help도 같은 상세 안내입니다. 생성 앱에서는 npm run help로 feature 명령과 검증/복구 범위를 확인합니다.

## 기능 추가

이 원본의 feature 활성화는 compose로 생성한 앱에서 수행합니다. 생성 앱의 README에 list/add 명령과 충돌·복구 안내가 포함됩니다.
