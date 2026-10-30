<!-- version: v1.0.0 -->
# 편집기 표시 언어·코딩 폰트

개인 PC의 macOS·Windows·Linux에서 VS Code와 Android Studio를 설정합니다. 앱·폰트 설치는 [OS별 Setup](../00.Setup/OS_Dev_Setting.md)을 먼저 따릅니다. 아래 `D2Coding`은 서체 패밀리 이름 예시이며 배포 파일명 `D2Coding-Ver1`과 구분합니다. 설치된 실제 이름이 다르면 그 이름을 사용합니다.

폰트 원본·버전과 기존 앱 설정을 보관하고 같은 패밀리의 TTF·TTC·구버전을 중복 설치하지 않습니다. 교체 후 문제가 생기면 새 폰트를 제거하고 보관한 파일과 앱 설정으로 복귀합니다. 일반 D2Coding이 모든 Nerd Font·Powerline 아이콘을 포함한다고 가정하지 않습니다.

## VS Code 표시 언어 변경

한국어 메뉴를 사용하려면 개인 PC의 VS Code에서 다음을 진행합니다.

1. macOS는 `Cmd+Shift+X`, Windows·Linux는 `Ctrl+Shift+X`로 확장을 열고 Microsoft의 [Korean Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ko)(식별자: `MS-CEINTL.vscode-language-pack-ko`)를 설치합니다.
2. macOS는 `Cmd+Shift+P`, Windows·Linux는 `Ctrl+Shift+P`로 명령 팔레트를 열고 `Configure Display Language`(표시 언어 구성)를 실행합니다.
3. `한국어` / `Korean (ko)`를 선택하고 안내에 따라 VS Code를 재시작합니다. 메뉴가 한국어로 표시되는지 확인합니다.

영어로 돌아가거나 다른 언어로 바꾸려면 같은 명령에서 `English (en)` 또는 원하는 언어를 선택하고 재시작합니다. 원하는 언어가 없으면 해당 Language Pack을 먼저 설치합니다. 한국어가 적용되지 않으면 언어 팩 활성화 여부를 확인하고 표시 언어를 다시 선택합니다.

표시 언어는 명령 팔레트에서 관리하며 프로젝트의 `settings.json`에 `locale`을 추가하지 않습니다. 확인일: 2026-10-30. [공식 표시 언어 안내](https://code.visualstudio.com/docs/configure/locales).

## VS Code 편집기·통합 터미널 폰트

OS별 Setup 문서에서 D2Coding을 설치한 후 명령 팔레트에서 `Preferences: Open User Settings (JSON)`을 열어 기존 객체에 아래 항목을 병합합니다. 기존 설정 파일 전체를 교체하지 않으며, 같은 키가 있으면 값을 수정합니다. 개인 폰트 취향은 사용자 설정에 보관합니다.

```json
{
  "editor.fontFamily": "D2Coding, monospace",
  "editor.fontSize": 14,
  "terminal.integrated.fontFamily": "D2Coding",
  "terminal.integrated.fontSize": 14
}
```

편집기와 통합 터미널의 폰트는 별도 항목입니다. 실제 패밀리 이름이 다르면 두 항목을 함께 바꿉니다. VS Code를 재시작하고 코드 파일과 새 통합 터미널에서 한글·영문·숫자를 확인합니다. 적용되지 않으면 현재 프로파일의 사용자 설정과 워크스페이스·언어별 설정의 덮어쓰기를 확인합니다. [공식 설정 안내](https://code.visualstudio.com/docs/configure/settings) · [통합 터미널 폰트](https://code.visualstudio.com/docs/terminal/appearance).

## Android Studio 편집기·콘솔·터미널 폰트

D2Coding 설치 후 Android Studio를 재시작하고 **macOS: Android Studio → Settings**, **Windows·Linux: File → Settings**(구버전 macOS는 Preferences)를 엽니다. 버전에 따라 메뉴 이름·상속 옵션이 다를 수 있으므로 설정 검색에서 `Font`·`Console Font`·`Terminal`을 찾습니다.

| 적용 영역 | 설정 위치·방법 |
| :--- | :--- |
| 코드 편집기 | **Editor → Font**에서 D2Coding 선택. 크기는 14를 시작값으로 조절 |
| 색 구성표가 편집기 폰트를 별도 지정할 때 | **Editor → Color Scheme → Color Scheme Font**의 별도 지정 옵션을 해제해 Editor Font를 상속하거나 D2Coding 지정 |
| Run·Debug 콘솔 | **Editor → Color Scheme → Console Font**에서 편집기 폰트를 상속하거나 별도 콘솔 폰트로 D2Coding 지정 |
| 내장 Terminal | **Tools → Terminal → Font Settings**가 있으면 D2Coding 지정. 이 항목이 없는 구버전은 Console Font 설정을 확인하고 새 터미널에서 적용 여부 확인 |

내장 Terminal과 Run·Debug 콘솔은 각각 확인합니다. Android Studio의 기반 플랫폼인 IntelliJ IDEA 문서를 참고한 경로이며, 설치된 Android Studio의 버전·터미널 엔진에 따라 표시 항목이 다를 수 있습니다. 편집기·콘솔·새 터미널에서 한글과 `0O 1lI {} [] =>` 표시를 확인합니다. 앱 메뉴·도구 창의 UI 폰트는 위 코드 폰트 설정과 별개입니다.

[Android Studio 설정 안내](https://developer.android.com/studio/intro/studio-config) · [JetBrains 편집기·콘솔 폰트](https://www.jetbrains.com/help/idea/configuring-colors-and-fonts.html) · [JetBrains 터미널 폰트](https://www.jetbrains.com/help/idea/settings-tools-terminal.html#font-settings).
