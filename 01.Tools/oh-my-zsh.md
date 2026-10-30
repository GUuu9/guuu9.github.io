<!-- version: v1.1.0 -->
# Oh My Zsh 사용·업데이트

Oh My Zsh는 zsh 설정을 테마·플러그인으로 관리하는 프레임워크입니다. 이 가이드는 macOS·Linux의 기본 설치 경로를 기준으로 합니다. 명령은 개인 PC의 zsh 터미널에서 일반 사용자 권한으로 실행합니다. 초기 설치는 [macOS 공통 설치](../00.Setup/macOS_Common_Dev_Setting.md#oh-my-zsh-설치) 또는 [Linux 설치](../00.Setup/Linux_Dev_Setting.md#bash와-선택적-oh-my-zsh)를 따릅니다.

## 일상 사용과 설정

새 zsh 터미널을 열면 `~/.zshrc`에서 자동으로 로드됩니다. `type omz`로 로딩을 확인하고 터미널 종료는 `exit`를 사용합니다. 별도 서비스는 실행하지 않습니다.

`~/.zshrc`의 기존 항목을 편집합니다. 테마·플러그인은 `source "$ZSH/oh-my-zsh.sh"`보다 앞에서 설정해야 하며 같은 항목을 중복 추가하지 않습니다.

```zsh
ZSH_THEME="robbyrussell"
plugins=(git)
```

플러그인 이름은 공백으로 구분합니다. 위 `git`은 기본 포함 플러그인이며 별도 설치가 필요하지 않습니다. macOS에서는 필요하면 `plugins=(git macos)`로 macos 플러그인도 추가합니다. [플러그인별 README](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins)에서 추가되는 별칭·명령을 확인합니다. 변경 후 새 터미널을 열고 필요한 명령과 기존 nvm·PATH 설정을 확인합니다.

테마 변경은 [공식 테마 목록](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)을 참고합니다. 일부 테마는 별도 폰트가 필요하므로 문자가 깨지면 터미널 앱의 폰트 설정을 확인하거나 기본 테마로 복귀합니다.

## 버전 확인·업데이트·복귀

Oh My Zsh는 Git 커밋으로 설치 상태를 기록할 수 있습니다. 업데이트 전 아래 커밋 값을 기록하고 `~/.zshrc`와 `~/.oh-my-zsh` 전체를 별도 위치에 백업합니다. `custom/` 안의 개인 테마·플러그인과 숨김 파일인 `.git`도 포함합니다.

```zsh
git -C "$ZSH" rev-parse HEAD
git -C "$ZSH" status --short
omz update
```

로컬 변경이 있으면 먼저 백업하고 차이를 확인합니다. 업데이트 후 새 터미널에서 `type omz`와 사용하는 플러그인·별칭을 확인합니다. nvm을 사용한다면 `command -v nvm`·`node --version`도 확인합니다. Oh My Zsh 갱신은 OS의 zsh 자체나 Node.js를 갱신하지 않습니다.

문제가 생기면 현재 설정도 보관한 뒤 백업한 `~/.zshrc`와 설치 디렉터리를 함께 복원하고 새 터미널을 엽니다. 설치 전 환경으로 돌아가려면 `~/.zshrc`에서 Oh My Zsh 초기화 블록을 제거하고 개인 PATH·nvm 설정은 유지합니다. 설치 전 백업을 통째로 복원할 때는 설치 이후 추가한 도구 설정도 비교해 보존합니다.

## 문제 해결과 제거

- `omz`를 찾지 못하면 zsh에서 실행 중인지, `ZSH` 경로와 초기화 블록이 올바른지 확인합니다.
- 기존 도구를 찾지 못하면 설치 전 백업과 현재 `~/.zshrc`를 비교해 PATH·nvm 초기화 설정을 복구합니다.
- 제거 전 현재 `~/.zshrc`와 `custom/`을 포함한 설치 디렉터리를 백업합니다. 공식 제거 명령 `uninstall_oh_my_zsh`는 설치 디렉터리를 삭제하고 이전 셸 설정을 복원할 수 있으므로, 이후 추가한 설정과 로그인 셸을 다시 확인합니다.

## 공식 참고 자료

설치 옵션·설정·업데이트·제거 절차 확인일: 2026-10-30. 실제 설치·업데이트 실행 검증과는 구분합니다.

- [공식 저장소: 설치·설정·업데이트·제거](https://github.com/ohmyzsh/ohmyzsh)
- [공식 설치 스크립트와 옵션](https://github.com/ohmyzsh/ohmyzsh/blob/master/tools/install.sh)
- [공식 FAQ](https://github.com/ohmyzsh/ohmyzsh/wiki/FAQ)
