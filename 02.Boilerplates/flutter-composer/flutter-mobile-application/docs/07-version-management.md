<!-- version: v1.0.0 -->
# 버전·보안·기능 조합 관리

프로젝트 루트에서 앱 버전(pubspec.yaml), Flutter/Dart(.fvmrc), pubspec.lock, 네이티브 도구, feature 구현 버전을 구분합니다. 문서 첫 줄 version은 코드 버전과 별개입니다.

## 업데이트 순서

1. 소스·pubspec/lock·.fvmrc·native 설정·서명·실제 저장 데이터를 별도로 보관하고 마지막 정상 조합을 기록합니다.
2. 공식 권고·지원 종료·스토어 제출 조건을 확인하고 보안 수정/지원 대응/기능 추가를 구분합니다. 권고 URL·영향 패키지/버전·노출 경로·조치 버전·보류 이유/담당/재점검 날짜를 update.md에 기록합니다.
3. 별도 브랜치에서 필요한 최소 버전만 변경합니다. Flutter·Dart·Gradle·AGP·Kotlin·JDK·Xcode·Ruby·CocoaPods를 한꺼번에 올리지 않습니다. 호환 요구가 있으면 관련 항목만 함께 조정합니다. 기존 lock을 삭제하지 않습니다.
4. pub get으로 필요한 lock을 갱신하고 analyze·test·플랫폼 빌드·권한/동의·기기 동작·업데이트 데이터 호환을 확인합니다. 실제 검증한 OS/CPU/기기 범위를 기록합니다.

```bash
fvm flutter --version
fvm flutter pub outdated
fvm flutter analyze
fvm flutter test
```

pub outdated는 최신 버전 정보이며 취약점 검사 전체를 대신하지 않습니다. 실제 pub/native 패키지의 공식 보안 공지와 릴리스 노트도 확인합니다. 외부 악용·지원 종료·제출 차단을 우선 판단하고 미검증 조합을 정상으로 승격하지 않습니다.

## 조합 기록

아래 양식은 미검증 템플릿입니다. 새 버전마다 새 기록을 남기고 통과했던 이전 행을 덮어쓰지 않습니다.

| 항목 | 기록할 값 |
| :--- | :--- |
| 앱 revision/version | 미기입; 미커밋 변경 여부 |
| 원본 스냅샷·base/target 버전 | .composer/state.json의 sourceDigest·base·targetVersion |
| feature ID·버전·용도 | state.json의 features, 각 docs 사용법 |
| 선행·충돌 조건 | 지원 target·함께 검증한 기능·미지원 조합 |
| Flutter/Dart·pub lock | 실제 명령과 버전 파일/lock revision |
| Android 도구 | JDK·Gradle·AGP·Kotlin·SDK/NDK·Build-Tools |
| iOS 도구 | Xcode/SDK·Ruby/Bundler·CocoaPods·서명/배포 대상 |
| 환경·지원 범위 | 개발 OS/CPU, 서비스 최소/최대 OS 또는 상한 미명시/미확정, 공식 근거 |
| 실제 검사 | 날짜·명령·기기/OS·빌드/실행/배포·로그 위치 |
| 상태·한계 | 미검증; 모의 검사·재사용 의존성·실제 검사 구분 |
| 보안 판단·복귀 | 권고·대응/보류·마지막 정상 코드/lock/산출물·데이터 복구 |

## 기능 추가·원본 갱신·복귀

npm run feature -- add는 현재 반출된 catalog에서 기능을 활성화합니다. state에는 버전과 용도를 함께 기록하며 목록의 버전 차이는 거부합니다. catalog 자동 업데이트·업그레이드·제거는 지원하지 않습니다. 직접 catalog나 state 해시만 바꿔 검사를 우회하지 않습니다. 새 원본으로 별도 앱을 생성해 사용자 코드·데이터를 보존하며 변경을 비교·이행합니다.

실패 시 마지막 정상 소스·버전 파일·lock·산출물을 같은 기준으로 복구합니다. 이후 해당 FVM SDK에서 pub get·analyze·test·빌드를 확인합니다. 운영 데이터는 Git 복귀와 별도로 백업·스키마 호환성을 확인합니다. 취약 버전으로 복귀하면 노출 차단·완화책과 수정 재적용 계획도 남깁니다.

공식 근거: [Flutter SDK 보관/지원 확인](https://docs.flutter.dev/install/archive), [pub outdated](https://dart.dev/tools/pub/cmd/pub-outdated), [Android 배포](https://docs.flutter.dev/deployment/android), [iOS 배포](https://docs.flutter.dev/deployment/ios). 현재 고정 조합이 최신 제출 조건을 충족한다는 뜻은 아닙니다.
