<!-- version: v1.3.0 -->
# VS Code·코딩 폰트 설치·설정

macOS·Windows·Linux에서 VS Code·Android Studio와 D2Coding을 설정합니다. 설치된 서체 관리자에서 패밀리 이름을 확인해 각 앱에 지정합니다.

## macOS 폰트·Terminal

Apple Silicon·Intel은 같은 폰트를 사용합니다. 기존 설치가 있으면 서체 관리자(Font Book)에서 패밀리 이름을 확인합니다. 아래 `D2Coding`은 예시 이름입니다.

1. [NAVER 공식 릴리스](https://github.com/naver/d2-coding-font/releases)에서 사용할 Ver 1.x 배포본을 받아 압축을 풉니다.
2. TTF 또는 TTC 중 사용할 파일을 서체 관리자에서 설치합니다.
3. 패밀리 이름을 확인하고 앱을 재시작합니다.
4. macOS 기본 Terminal에서 **Terminal → 설정(Settings, 구버전은 환경설정) → 프로파일(Profiles) → 사용할 프로파일 → 텍스트(Text) → 서체 변경(Change)**을 열고 D2Coding을 선택합니다. 크기는 14pt를 시작값으로 조절합니다.
5. 새 창에도 적용하려면 해당 프로파일을 기본값으로 지정합니다.

[Apple 서체 설치·검증](https://support.apple.com/en-gb/guide/font-book/fntbk1000/mac) · [Terminal 텍스트 설정](https://support.apple.com/en-lb/guide/terminal/trmltxt/mac).

각 앱의 폰트는 별도로 지정합니다. 특수 아이콘이 깨지면 테마가 요구하는 Powerline·Nerd Font를 확인합니다.

## Windows 폰트·Terminal

[NAVER 공식 릴리스](https://github.com/naver/d2-coding-font/releases)에서 D2Coding Ver 1.x를 받고 TTF 또는 TTC를 설치합니다. 설정 → 개인 설정 → 글꼴에서 패밀리 이름을 확인합니다. [Microsoft 폰트 설치 안내](https://support.microsoft.com/en-us/windows/experience/personalization/manage-fonts-in-windows).

Windows Terminal의 **설정 → 기본값(Defaults) 또는 사용할 프로파일 → 모양(Appearance) → 글꼴(Font face)**에서 D2Coding을 선택하고 저장합니다. 크기는 14를 시작값으로 조절합니다. PowerShell·WSL 프로파일이 개별 설정으로 덮어쓰는지도 확인합니다. GUI를 렌더링하는 Windows에 폰트를 설치하며, WSL 터미널용이라고 WSL에만 설치하지 않습니다. 앱 재시작 후 한글·영문·숫자를 확인하고 원본 폰트·기존 설정을 보관합니다. [Terminal 폰트 설정](https://learn.microsoft.com/en-us/windows/terminal/customize-settings/profile-appearance).

## Linux 폰트·터미널

fontconfig 설치 명령은 Ubuntu/Debian에서 관리자 권한으로 실행합니다. 나머지는 일반 사용자 폰트 설정입니다.

[NAVER 공식 릴리스](https://github.com/naver/d2-coding-font/releases)에서 D2Coding Ver 1.x를 받고 TTF 또는 TTC를 설치합니다. 사용자 폰트 디렉터리는 `~/.local/share/fonts`입니다.

```bash
sudo apt install fontconfig
mkdir -p ~/.local/share/fonts
fc-cache -f ~/.local/share/fonts
fc-list : family | sort -u
```

위 캐시 갱신은 파일을 복사한 뒤 실행합니다. GNOME Terminal은 **Preferences → Profiles → 사용할 프로파일 → Text → Custom font**에서 D2Coding을 선택합니다. 다른 터미널은 해당 앱의 폰트 설정을 사용합니다. 앱을 재시작하고 한글·영문·숫자를 확인합니다. 폰트 원본·기존 앱 설정은 보관합니다. [Fontconfig 사용자 폰트 경로](https://fontconfig.pages.freedesktop.org/fontconfig/fontconfig-user.html) · [GNOME Terminal 폰트](https://help.gnome.org/gnome-terminal/app-fonts.html).

## macOS VS Code 설치

[공식 macOS 배포판](https://code.visualstudio.com/docs/setup/mac)을 내려받아 압축을 풀고 Visual Studio Code.app을 Applications로 옮겨 실행합니다. 사용하는 OS·CPU와 호환되는 배포판을 선택합니다. 별도 비공식 curl 설치 스크립트는 사용하지 않습니다.

VS Code 명령 팔레트에서 `Shell Command: Install 'code' command in PATH`를 실행하고 새 터미널에서 `code --version`을 확인합니다.

필요한 작업에 맞춰 확장을 설치합니다.

| 작업 | 확장 |
| :--- | :--- |
| TypeScript·React·Electron | ESLint, Prettier |
| Python | Python, Python Debugger |
| Flutter | Flutter (Dart 확장 포함) |
| C/C++ | C/C++, CMake Tools |
| Rust | rust-analyzer |
| Unity | Unity (Microsoft) |
| 컨테이너 개발 | Dev Containers |

포맷터와 린터는 프로젝트 설정을 우선합니다. [VS Code macOS 설치 안내](https://code.visualstudio.com/docs/setup/mac)

#### VS Code 표시 언어 변경

[공통 표시 언어 안내](#vs-code-표시-언어-변경)에 따라 Korean Language Pack을 설치하고 한국어를 선택한 뒤 재시작합니다.

#### VS Code 편집기·통합 터미널 폰트

D2Coding 설치 후 [편집기·통합 터미널 설정](#vs-code-편집기통합-터미널-폰트)을 각각 적용합니다.

## Windows VS Code 설치

개인 PC PowerShell에서 설치하거나 [공식 Windows 설치 프로그램](https://code.visualstudio.com/docs/setup/windows)을 사용합니다. 같은 앱을 두 경로로 중복 설치하지 않습니다.

```powershell
winget install --id Microsoft.VisualStudioCode -e --source winget
```

새 PowerShell에서 `code --version`을 확인하고 [공통 편집기 설정](editor-setup.md)에 따라 `Ctrl+Shift+P`의 표시 언어 구성으로 한국어를 선택합니다. D2Coding은 편집기·통합 터미널에 각각 적용합니다.

ESLint·Prettier·Python·Python Debugger·Flutter·C/C++·CMake Tools·rust-analyzer·Unity·Dev Containers 확장을 설치합니다. 포맷·린트 설정은 프로젝트 기준을 따릅니다.

## Linux VS Code 설치

[공식 Linux 설치 안내](https://code.visualstudio.com/docs/setup/linux)에 따라 CPU에 맞는 `.deb`를 설치하고 업데이트 저장소 추가 안내를 적용합니다. 새 터미널에서 `code --version`을 확인합니다.

[공통 편집기 설정](editor-setup.md)에 따라 `Ctrl+Shift+P`의 표시 언어 구성으로 한국어를 선택하고 D2Coding을 편집기·통합 터미널에 적용합니다. ESLint·Prettier·Python·Python Debugger·Flutter·C/C++·CMake Tools·rust-analyzer·Unity·Dev Containers 확장을 설치합니다. 포맷·린트 설정은 프로젝트 기준을 따릅니다.

## VS Code 표시 언어 변경

한국어 메뉴를 사용하려면 개인 PC의 VS Code에서 다음을 진행합니다.

1. macOS는 `Cmd+Shift+X`, Windows·Linux는 `Ctrl+Shift+X`로 확장을 열고 Microsoft의 [Korean Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ko)(식별자: `MS-CEINTL.vscode-language-pack-ko`)를 설치합니다.
2. macOS는 `Cmd+Shift+P`, Windows·Linux는 `Ctrl+Shift+P`로 명령 팔레트를 열고 `Configure Display Language`(표시 언어 구성)를 실행합니다.
3. `한국어` / `Korean (ko)`를 선택하고 안내에 따라 VS Code를 재시작합니다. 메뉴가 한국어로 표시되는지 확인합니다.

영어로 돌아가거나 다른 언어로 바꾸려면 같은 명령에서 `English (en)` 또는 원하는 언어를 선택하고 재시작합니다. 원하는 언어가 없으면 해당 Language Pack을 먼저 설치합니다. 한국어가 적용되지 않으면 언어 팩 활성화 여부를 확인하고 표시 언어를 다시 선택합니다.

표시 언어는 명령 팔레트에서 관리하며 프로젝트의 `settings.json`에 `locale`을 추가하지 않습니다. 확인일: 2026-10-30. [공식 표시 언어 안내](https://code.visualstudio.com/docs/configure/locales).

## VS Code 편집기·통합 터미널 폰트

### User Settings: 테마·폰트·보조 사이드바·Copilot

위 OS별 절차로 D2Coding을 설치한 후 명령 팔레트에서 `Preferences: Open User Settings (JSON)`을 열어 **현재 프로파일의 사용자 설정** 객체에 아래 항목을 병합합니다. 같은 키가 있으면 값을 수정하고 기존 파일 전체를 덮어쓰지 않습니다. 개인 UI 취향은 프로젝트 `.vscode/settings.json` 대신 User Settings에 보관합니다.

아래는 요청한 Dark+·D2Coding 크기 13과 보조 사이드바 숨김 설정입니다. 자동 승인 키는 현재 이름으로 반영했습니다. `github.copilot.*` 키는 설치한 Copilot 확장 버전에서 인식하는지 확인하고 적용합니다.

```json
{
    "chat.titleBar.openInAgentsWindow.enabled": false,
    "chat.titleBar.signIn.enabled": false,
    "workbench.colorTheme": "Dark+",
    "editor.fontFamily": "D2Coding, monospace",
    "editor.fontSize": 13,
    "terminal.integrated.fontFamily": "D2Coding",
    "terminal.integrated.fontSize": 13,
    "workbench.secondarySideBar.defaultVisibility": "hidden",
    "chat.tools.global.autoApprove": false,
    "github.copilot.chat.agent.runTasks": false,
    "github.copilot.chat.agent.autoFix": false
}
```

기존 `chat.tools.autoApprove`는 `chat.tools.global.autoApprove`로 교체합니다. 이 설정은 VS Code Chat에 적용되며 Codex 앱·CLI의 승인 정책이나 개별 세션 권한은 바꾸지 않습니다. Copilot 키는 설치된 확장 버전에서 인식하는지 확인합니다.

### 적용 확인과 복귀

1. `Developer: Reload Window` 후 테마·편집기·새 터미널의 폰트와 크기를 확인합니다.
2. 사이드바가 계속 열리면 `View: Toggle Secondary Side Bar Visibility`와 저장된 워크스페이스 레이아웃을 확인합니다.
3. `Unknown Configuration Setting`이면 현재 VS Code·확장 버전의 지원 키를 확인합니다. Copilot 제한은 세션·도구 권한도 확인합니다.
4. 되돌릴 때는 변경한 키만 이전 값으로 복원하거나 제거합니다.

공식 안내: [설정](https://code.visualstudio.com/docs/configure/settings) · [터미널 폰트](https://code.visualstudio.com/docs/terminal/appearance) · [보조 사이드바](https://code.visualstudio.com/docs/configure/custom-layout#secondary-side-bar) · [Chat 자동 승인](https://code.visualstudio.com/updates/v1_104#global-auto-approve).

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

제거 후 숨김 설정·캐시·셸 초기화 항목까지 정리하려면 [도구별 제거·잔여 파일 관리](./uninstall-cleanup.md)를 함께 확인합니다.

## VS Code·폰트 업데이트와 제거

VS Code·확장은 기존 설치 방식으로 갱신합니다. Windows winget 설치는 일반 PowerShell에서 `winget upgrade --id Microsoft.VisualStudioCode -e`, Linux 공식 apt 저장소 설치는 `sudo apt install --only-upgrade code`를 사용합니다. macOS는 앱의 업데이트 기능을 사용하며 기존 OS 지원을 먼저 확인합니다. 폰트·앱 설정은 위 백업·복귀 절차를 따릅니다. 제거와 남은 설정·캐시는 [제거 가이드](./uninstall-cleanup.md)를 확인합니다.
