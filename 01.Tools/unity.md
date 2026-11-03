<!-- version: v1.0.1 -->
# Unity Hub·Editor 설치·버전 관리

Unity 프로젝트를 개발할 때만 설치합니다. 개인 PC의 OS·CPU·프로젝트 버전에 맞는 공식 배포판을 사용하고 일반 사용자로 진행하되 설치기가 요구할 때만 관리자 권한을 사용합니다. Hub 자체와 프로젝트의 Editor·플랫폼 모듈은 별도로 관리합니다.

## macOS Unity Hub 설치

[Unity Hub](https://unity.com/download)를 설치하고 실행 여부를 확인합니다. 정확한 Unity Editor 버전·플랫폼 모듈·VS Code 연동은 프로젝트 요구 사항을 확인한 뒤 [아래 Unity 안내](#프로젝트-editor-선택업데이트복귀)에서 진행합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다.

## Windows Unity Hub 설치

Unity가 필요하면 [공식 Unity Hub](https://unity.com/download)를 설치하고 실행만 확인합니다. 정확한 Editor와 빌드 모듈은 프로젝트 복원 때 선택합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다.

## Linux Unity Hub 설치

Unity가 필요하면 [공식 Hub Linux 설치 안내](https://docs.unity.com/en-us/hub/install-hub)의 배포판 지원 조건에 따라 Hub를 설치하고 실행만 확인합니다. 프로젝트 Editor와 빌드 모듈은 이후 선택합니다. Unity 작업만을 위해 최신 .NET SDK를 일괄 설치하지 않습니다.

## 프로젝트 Editor 선택·업데이트·복귀

Hub에서 로그인·라이선스를 활성화하고 `ProjectSettings/ProjectVersion.txt`의 정확한 Editor와 필요한 빌드 모듈을 설치합니다. Unity Android SDK·NDK·OpenJDK는 Hub 모듈을 우선하며 Flutter용 경로로 일괄 덮어쓰지 않습니다. iOS는 Xcode도 필요합니다. Unity External Tools에서 VS Code를 선택하고 Microsoft Unity 확장의 요구 조건에 맞춰 연동합니다.

Editor 갱신은 새 버전을 추가 설치한 뒤 프로젝트 복사본 또는 별도 브랜치로 열어 컴파일·Play Mode·대상 빌드를 확인합니다. 성공 후 ProjectVersion.txt·Packages/manifest.json·Packages/packages-lock.json 변경을 검토합니다. 복귀할 때는 이전 Editor와 업그레이드 전 프로젝트 파일을 함께 복원합니다. [Unity Hub 문서](https://docs.unity.com/en-us/hub).

## Hub 갱신·데이터 보존·제거

Hub는 앱의 업데이트 기능·공식 배포판으로 갱신하고 Editor·모듈 변경과 구분합니다. 제거 전 프로젝트 원본·버전 파일·Packages 잠금 파일·자산과 정상 Editor 버전을 보존합니다. 사용하지 않는 Editor·모듈만 Hub에서 제거하며 프로젝트와 라이선스 관련 개인 설정을 일괄 삭제하지 않습니다. [공식 Hub 안내](https://docs.unity.com/en-us/hub) · [도구 제거·잔여 파일](./uninstall-cleanup.md).
