# 재사용 보일러플레이트

| 묶음 | 내용 | 시작 |
| :--- | :--- | :--- |
| [TypeScript Composer](./typescript-composer/README.md) | backend 뼈대 + 기본 구조·결과 형태·선택 기능 조합 | [구성품 적용 순서](./typescript-composer/components/README.md) |
| [Flutter Composer](./flutter-composer/README.md) | Flutter 뼈대 + Android/iOS target·선택 기능 | [환경 설정·실행](./flutter-composer/docs/01-getting-started.md) |

[작성 규칙](./authoring-rules.md) · [다른 프로젝트에 전달할 요청문](./project-request.md)

## 특정 보일러플레이트만 내려받기

개인 PC에 Git을 준비합니다. macOS는 Git 사용 전에 Command Line Tools 또는 선택한 Xcode의 라이선스·최초 초기화를 확인합니다. [OS별 설정](../00.Setup/OS_Dev_Setting.md)에서 준비할 수 있습니다.

새 다운로드 폴더에서 실행합니다. Git의 partial clone·sparse checkout을 사용하며 실제 템플릿 변경이 원격에 push된 후 받을 수 있습니다.

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/typescript-composer
cd 02.Boilerplates/typescript-composer
```

Windows PowerShell에서도 같은 Git 명령을 사용합니다. 모바일만 받으려면 선택 경로를 02.Boilerplates/flutter-composer으로 바꿉니다. sparse checkout은 저장소의 상위 폴더 구조와 일부 상위 파일을 유지하며 유형 폴더를 다운로드 루트로 평탄화하지 않습니다.

## 가져온 뒤 진행

TypeScript Composer는 묶음을 보관하고 typescript-backend를 새 프로젝트로 내보냅니다. Node 설치·PATH·의존성 복원·기본 실행을 확인한 뒤 base·target·필요한 feature를 적용합니다. 실행은 새 프로젝트 안에서 합니다. [묶음 README](./typescript-composer/README.md)에 내보내기와 전체 순서가 있습니다.

Flutter Composer도 묶음을 보관하고 flutter-mobile-application에서 플랫폼과 이름으로 새 앱을 생성합니다. 새 앱에서 도구·환경을 준비하고 feature를 활성화한 뒤 기기에서 실행합니다. 실제 GUI·실기기·다른 OS의 검증 여부는 각 묶음 기록을 확인합니다.

## 작성·갱신

반출 패키지는 README·project-agents·update·docs와 실행 소스/구성품을 포함합니다. 기존 독립 backend·웹 UI·Electron 유형은 Composer의 뼈대와 조합으로 관리합니다. 완성 프로젝트는 외부 구성품이나 저장소 Setup·Tools에 의존하지 않습니다. 공통 변경은 [Composer 이력](./typescript-composer/update.md), 모바일 변경은 [모바일 이력](./flutter-composer/update.md)에 기록합니다.
