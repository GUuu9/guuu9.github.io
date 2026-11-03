<!-- version: v1.1.1 -->
# 도구 제거와 숨김 설정·캐시 정리

설치한 기능을 사용하지 않게 됐을 때 실행 파일, 개인 설정, 다운로드 캐시, 프로젝트 데이터를 구분해 정리합니다. 아래는 문서상 절차이며 실제 삭제를 실행하는 작업이 아닙니다. 기본 경로는 후보일 뿐이며 환경 변수·설치 방식·사용자 설정에 따라 달라집니다.

## 제거 순서

1. `command -v 도구명`과 설치 관리자 목록으로 실제 설치 방식·경로를 확인합니다. macOS/Linux는 `type -a 도구명`, Windows PowerShell은 `Get-Command 도구명 -All`로 중복 설치를 확인합니다.
2. 앱·IDE·백그라운드 작업을 종료합니다. 설정·확장 목록·다운로드한 SDK 버전·프로젝트 잠금 파일과 필요한 데이터를 별도 위치에 백업합니다. 제거하려는 런타임을 다른 프로젝트가 사용하는지 확인합니다.
3. 기능 하나만 잘못 설치했다면 해당 플러그인·SDK 버전·패키지만 제거합니다. 프로그램 전체 제거는 설치했던 관리자 또는 공식 제거 프로그램을 사용합니다.
4. 아래 표에서 해당 도구가 소유하는 숨김 파일·설정·캐시 위치를 확인합니다. 설정은 복원용 백업 후 선택적으로 정리하고, 공유 디렉터리는 일괄 삭제하지 않습니다. macOS는 Finder의 `⌘⇧.`으로 숨김 파일을 표시할 수 있습니다.
5. 셸 설정의 해당 도구 초기화·PATH 줄만 편집합니다. `.zshrc`, `.zprofile`, `.bashrc`, PowerShell 프로필이나 사용자 Path 전체를 삭제하지 않습니다. 다른 도구의 환경 변수와 개인 설정을 유지합니다.
6. 새 터미널에서 실행 경로를 다시 확인하고 남겨 둔 프로젝트·도구가 정상 동작하는지 확인합니다. 잘못 정리했다면 같은 설치 방식·버전으로 재설치하고 백업한 설정을 필요한 항목만 복원합니다.

> [!WARNING]
> 숨김 파일의 점(`.`)은 삭제해도 된다는 표시가 아닙니다. `.git`은 저장소 이력, `.ssh`는 키·접속 설정, `.aws` 등은 인증·설정일 수 있습니다. `.*` 패턴으로 홈이나 프로젝트 파일을 일괄 삭제하지 않습니다. 백업에도 토큰·키가 포함될 수 있으므로 공개 저장소에 넣지 않습니다.

## 도구별 제거·잔여 파일 확인

명령은 해당 도구가 정상 설치되어 있을 때 사용하는 예시입니다. 제거 전에 설치 위치와 로컬 `--help`를 확인합니다. 표의 경로는 **자동 삭제 목록이 아닙니다**.

| 도구 | 기능·본체 제거 | 숨김 파일·설정·캐시와 보존 기준 |
| :--- | :--- | :--- |
| Homebrew 패키지 | formula는 `brew uninstall 패키지`, cask는 `brew uninstall --cask 앱이름` | 패키지 자체 제거와 앱 사용자 설정은 다름. 아래 Homebrew 절차로 소유 파일 확인. Homebrew 전체를 삭제해 다른 패키지까지 제거하지 않음 |
| JDK | Homebrew formula는 `brew uninstall openjdk@17`처럼 필요한 major만 제거. 다른 설치 방식은 해당 배포판 방식으로 정리 | 다른 프로젝트·IDE·CI의 JAVA_HOME·Gradle JDK와 Flutter 로컬 설정 참조부터 확인. `~/.gradle`·Android SDK·다른 JDK·서명 자료를 함께 지우지 않음. 설치·유지·복귀는 [JDK 관리](./jdk.md#macos-jdk-업데이트유지제거) 참고 |
| CMake | Homebrew 설치는 `brew uninstall cmake`; CMake.app/압축 배포판은 설치했던 앱·전용 디렉터리만 제거 | 별도 추가한 CMake PATH 줄 확인. `~/.cmake`는 사용자 패키지 등록 정보를 포함할 수 있어 내용 확인 후 정리. 프로젝트 CMakeLists.txt·프리셋 보존. Android SDK 내부 CMake는 SDK Manager에서 별도로 관리 |
| minicom | Homebrew 설치는 `brew uninstall minicom` | `~/.minirc.*` 같은 개인 시리얼 프로필, 지정한 로그·캡처 파일을 백업 후 선택 정리. 다른 시리얼 프로그램·USB 드라이버는 별도 구성 |
| IINA | Homebrew 설치는 `brew uninstall --cask iina` | cask 정의의 zap 경로에서 앱별 설정·캐시 후보 확인. 영상 파일·재생목록은 보존 여부를 따로 선택 |
| Unix nvm | Node 버전은 `nvm uninstall 버전`; 전체 제거는 공식 수동 제거 안내 | 실제 `NVM_DIR`(기본 `~/.nvm`)에 SDK·전역 npm 도구도 있음. 초기화 줄과 자동 전환 hook을 함께 정리. `.nvmrc`, package.json·lock은 프로젝트 요구사항이므로 유지 |
| nvm-windows | Windows 설치된 앱의 nvm 제거 프로그램 사용 | `NVM_HOME`, `NVM_SYMLINK`, 사용자/시스템 Path의 해당 항목 확인. Unix nvm의 `~/.nvm` 삭제 절차를 적용하지 않음 |
| FVM | SDK 하나는 `fvm remove 버전`; 본체는 공식 FAQ의 설치 방식별 제거 절차 | `fvm list`에서 실제 캐시 위치 확인. `.fvm/`은 프로젝트 SDK 링크, `.fvmrc`는 복원에 필요한 버전 선언. 공유 SDK 캐시·global 링크·IDE SDK 경로를 함께 확인하고 다른 앱이 쓰는 SDK는 유지 |
| uv | CLI 도구 하나는 `uv tool uninstall 도구명`; 본체는 설치 방식별 공식 제거 절차 | 제거 전에 `uv cache dir`, `uv python dir`, `uv tool dir`로 경로 기록. 캐시 정리는 `uv cache clean`. 관리 Python·도구 환경 삭제는 별도 선택이며 프로젝트 `.venv`가 그 Python을 참조할 수 있음. pyproject.toml·uv.lock·.python-version 유지 |
| venv | 환경을 deactivate하고 해당 프로젝트의 실제 가상환경 폴더만 제거 | `.venv`가 소스·데이터 폴더가 아닌지 확인하고 requirements/lock을 먼저 보존. Python 자체나 다른 프로젝트 환경은 별도 |
| rustup | 툴체인 하나는 `rustup toolchain uninstall 버전`; 전체는 `rustup self uninstall` | `RUSTUP_HOME`·`CARGO_HOME`(일반적으로 `~/.rustup`, `~/.cargo`) 소유 범위 확인. Cargo에는 별도 설치 CLI·인증 설정도 있을 수 있음. rust-toolchain.toml·Cargo.toml·Cargo.lock 유지 |
| Oh My Zsh | 백업 후 `uninstall_oh_my_zsh` | 실제 `ZSH` 디렉터리(일반적으로 `~/.oh-my-zsh`)의 custom 테마·플러그인과 `.zshrc` 백업. 제거기의 과거 설정 복원 후 이후 추가한 PATH·nvm 설정 보존 여부 확인 |
| VS Code | 설치 관리자 또는 macOS 앱 제거 | 공식 제거 안내의 OS별 사용자 데이터·확장 디렉터리 확인. macOS 기본 `~/Library/Application Support/Code`, `~/.vscode`는 별도 선택 정리. 프로젝트 `.vscode`에는 팀 설정이 있으므로 앱 제거와 함께 삭제하지 않음. Settings Sync 재연결 시 설정이 복원될 수 있음 |
| Ruby·rbenv·CocoaPods | 사용하는 설치 방식과 버전을 확인한 뒤 [Ruby 도구 관리](./ruby.md#업데이트복귀제거)에 따라 선택 제거 | `.ruby-version`·Gemfile·잠금 파일을 보존. 공유 Ruby·gem과 다른 프로젝트의 참조를 먼저 확인 |
| Android Studio | 설치 방식에 맞춰 IDE 제거; SDK·에뮬레이터는 관리자에서 별도 제거 | IDE의 실제 설정·plugin·cache 경로를 공식 안내로 확인. `~/.android`에는 AVD·adb 키·debug keystore 등이 있을 수 있음. `~/.gradle`은 여러 프로젝트가 공유. SDK Manager의 Android SDK Location과 프로젝트 의존 확인 후 선택 정리 |
| Docker | 컨테이너·이미지는 도구 가이드대로 선택 제거; Desktop은 공식 제거 기능 사용 | `~/.docker`는 CLI context·인증 설정을 포함할 수 있음. volume·bind mount·Desktop VM 데이터는 백업을 먼저 결정. 앱 제거를 볼륨 백업으로 간주하거나 `down -v`/일괄 prune으로 시작하지 않음 |
| Codex·Ponytail | 플러그인만 제거하려면 [Codex 가이드](./codex.md)의 플러그인 제거 절차 | Codex 사용자 디렉터리에는 인증·설정·기록·다른 스킬이 있을 수 있으므로 플러그인 제거를 위해 통째로 삭제하지 않음. 본체는 실제 설치 방식의 제거 절차 확인 |
| Git·GitHub | Git은 실제 설치 관리자에서 제거; 인증 해제는 사용한 자격 증명 관리자에서 해당 계정만 선택 | `~/.gitconfig`, 프로젝트 `.git`, SSH 키·GitHub 토큰은 별도 데이터. 도구 제거 시 저장소·공유 키를 삭제하지 않음. 서버에 등록된 토큰·키 폐기는 로컬 파일 삭제와 별도 |

## Homebrew: 패키지와 잔여 설정 분리

먼저 설치 내용을 확인합니다. 패키지명은 실제 이름으로 바꿉니다.

```text
brew info 패키지명
brew list 패키지명
brew uses --installed 패키지명
brew cat --cask 앱이름
```

formula 제거 전에는 사용하는 다른 패키지·프로젝트를 확인합니다. cask는 `brew cat --cask`에서 `uninstall`과 `zap` 항목을 읽어 어떤 사용자 경로를 정리하는지 확인합니다. 해당 항목이 모든 개인 파일을 찾아주는 것은 아닙니다.

```text
brew uninstall 패키지명
brew uninstall --cask 앱이름
brew cleanup --dry-run
brew autoremove --dry-run
```

앱 설정도 폐기하기로 결정하고 백업·공유 경로 확인을 마쳤다면, 그 앱에 한해 `brew uninstall --cask --zap 앱이름`을 선택할 수 있습니다. zap은 다른 앱과 공유하는 파일까지 제거할 수 있습니다. cache 정리와 사용하지 않는 의존성 제거도 dry-run 결과를 읽고 실제 대상이 불필요할 때만 실행합니다.

Homebrew 자체를 잘못 설치한 경우에는 [공식 설치 저장소의 제거 안내](https://github.com/Homebrew/install#uninstall-homebrew)를 확인합니다. 다른 도구가 함께 설치돼 있다면 먼저 패키지 목록·설정과 대체 실행 경로를 기록합니다.

## 새 도구 문서에서 관리할 제거 정보

새 도구·기능의 설치 안내에는 다음을 함께 기록합니다.

- 설치 방식과 본체·플러그인·SDK 버전 하나를 제거하는 공식 절차
- 실제 경로 확인 방법과 앱 종료·백업 대상
- 생성한 dotfile·설정·캐시·로그·데이터의 소유 범위와 공유 여부
- 셸 초기화·PATH·환경 변수·IDE 참조 중 정리할 항목
- 제거 후 확인과 재설치·설정 복원 방법

## 공식 참고

확인일: 2026-11-02. 실제 제거 명령은 실행하지 않았습니다.

- [Homebrew uninstall·cleanup](https://docs.brew.sh/Manpage), [cask zap와 공유 파일 주의](https://docs.brew.sh/Cask-Cookbook)
- [nvm 제거](https://github.com/nvm-sh/nvm#uninstalling--removal), [FVM 제거 FAQ](https://fvm.app/documentation/getting-started/faq#how-to-uninstall-fvm)
- [uv 제거](https://docs.astral.sh/uv/getting-started/installation/#uninstallation), [uv 저장 경로](https://docs.astral.sh/uv/reference/storage/)
- [rustup 제거](https://rust-lang.github.io/rustup/installation/), [Oh My Zsh 제거](https://github.com/ohmyzsh/ohmyzsh#uninstalling-oh-my-zsh)
- [VS Code 제거](https://code.visualstudio.com/docs/setup/uninstall), [Android Studio 설정 위치](https://developer.android.com/studio/intro/studio-config)
