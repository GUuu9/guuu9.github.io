<!-- version: v1.1.0 -->
# Flutter Composer 사용 순서

이미 묶음을 복사한 위치에서 시작합니다. macOS는 아래 Node 설치 전에 [Apple 개발 도구 준비](../flutter-mobile-application/docs/01-getting-started.md#2-pc-기본-도구-준비)를 먼저 완료합니다. iOS를 개발하면 전체 Xcode·라이선스·최초 초기화를 먼저 수행합니다. 다른 OS는 Git을 준비합니다.


## 명령 도움말

묶음 루트 또는 뼈대 폴더에서 Node/npm 준비 후 먼저 실행합니다.

```bash
npm run help
npm run compose -- help
```

help는 명령 목록, compose help는 형태별 용도·이름 규칙·생성 위치·예제·후속 준비를 안내합니다. 기존 compose -- --help도 같은 상세 안내입니다. 생성 앱에서는 npm run help로 feature 명령과 검증/복구 범위를 확인합니다.

## Node 준비

macOS·Linux는 기존 nvm을 사용합니다. 없다면 공식 설치기를 확인해 설치합니다.

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ ! -s "$NVM_DIR/nvm.sh" ] || . "$NVM_DIR/nvm.sh"
```

묶음 루트에서 프로젝트 버전을 설치·선택하고 확인합니다. 전역 기본값은 바꾸지 않습니다.

```bash
nvm install --no-use
nvm use
node --version
npm --version
```

Windows는 [Node 공식 배포](https://nodejs.org/en/download)의 .nvmrc 버전·CPU용 ZIP과 SHASUMS256.txt를 대조해 D:\Developer\tools 아래에 풉니다. D는 실제 데이터 드라이브입니다. 해당 작업 PowerShell에만 실제 경로를 적용합니다.

```powershell
$env:Path = "D:\Developer\tools\실제Node폴더명;$env:Path"
node --version
npm --version
```

[공식 nvm](https://github.com/nvm-sh/nvm). 별도 npm 의존성 설치는 필요 없습니다.

## 생성 후 앱 준비

```bash
cd flutter-mobile-application
npm run compose -- android my_android
npm run compose -- ios my_ios
npm run compose -- android-ios my_app
cd ../my_app
```

선택한 명령 하나만 사용해도 됩니다. 이름은 소문자 snake_case이며 경로·예약어·기존 대상은 거부합니다. 선택 플랫폼 폴더만 생성하지만 설치/배포 설명서는 함께 보관합니다. 생성은 SDK 설치나 native 빌드를 하지 않습니다.

앱의 docs/01-getting-started.md를 따라 FVM → 선택 플랫폼 도구 → 프로젝트 환경 → pub get·analyze·test → 기기 실행을 진행합니다. Android 전용은 Xcode/Ruby를 설치하지 않습니다. iOS 전용은 Android SDK/JDK를 설치하지 않습니다. iOS 실행·빌드는 Mac이 필요합니다.

## 기능 활성화

플랫폼 환경 준비를 끝낸 앱 루트에서:

```bash
npm run feature -- list
npm run feature -- add greeting-resource,counter
```

기능 코드·테스트·사용 문서·asset을 추가하고 lib/core/features.g.dart의 생성/화면/해제 연결과 pubspec의 관리 asset 구간을 갱신합니다. 사용자 파일을 편집할 필요가 없습니다. 생성 파일·관리 구간은 수정하지 않습니다. 현재 기능은 SDK만 사용하며 외부 pub 패키지·네이티브 권한을 요구하지 않습니다.

기존 활성 기능의 구현은 다시 덮어쓰지 않습니다. 같은 기능 재호출은 변경하지 않으며 파일·문서 경로 충돌/생성 연결부 수정은 쓰기 전에 거부합니다. 앱 이름 변경 후에는 pubspec과 상태의 이름을 임의로 따로 바꾸지 말고 새 프로젝트로 이행합니다.

pub get → analyze → test → Android debug APK, macOS에서는 iOS simulator debug 빌드까지 확인합니다. iOS Gemfile을 사용하는 빌드는 Bundler 환경에서 수행합니다. Mac 외 iOS 빌드는 생략·미검증을 표시합니다. 실제 기기·서명·스토어 제출은 자동화하지 않습니다.

실패하면 추가 소스·pubspec/lock·활성 내역을 복구합니다. 빌드 결과·캐시·외부 설치 부작용은 복구 범위가 아닙니다. 변경 전 상태로 pub get과 빌드를 다시 확인합니다. .composer의 원본·버전·해시·활성 내역도 Git에 포함합니다. 기능 제거·버전 자동 갱신·target 전환은 지원하지 않습니다.

작업이 비정상 종료되어 잠금이 남았다면 실행 중인 feature 프로세스가 없는지 먼저 확인합니다. Git diff와 상태/소스의 일관성을 확인·복구한 뒤 .composer/feature.lock만 정리하고 재시도합니다. 활성 작업의 잠금을 삭제하지 않습니다.
