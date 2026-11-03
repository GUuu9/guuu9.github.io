<!-- version: v1.2.1 -->
# Oh My Zsh 사용·업데이트

Oh My Zsh는 zsh 설정을 테마·플러그인으로 관리하는 프레임워크입니다. 이 가이드는 macOS·Linux의 기본 설치 경로를 기준으로 합니다. 명령은 개인 PC의 zsh 터미널에서 일반 사용자 권한으로 실행합니다. 초기 설치는 [macOS 공통 설치](#macos-설치) 또는 [Linux 설치](#linux-설치)를 따릅니다.

## macOS 설치

Apple Silicon·Intel 모두 [Command Line Tools](./xcode.md#command-line-tools-설치)와 [셸 설정 파일](./shell-environment.md#macos-셸path-준비)을 준비한 뒤, 개인 Mac의 **zsh 터미널**에서 일반 사용자 권한으로 진행합니다. Oh My Zsh는 zsh의 테마·플러그인을 관리하는 도구이며 Homebrew는 필요하지 않습니다. 아래는 기본 경로 `~/.zshrc`·`~/.oh-my-zsh`를 사용하는 경우입니다. `ZDOTDIR`나 별도 셸 관리 도구를 사용 중이면 기존 설정 경로와 로딩 구성을 먼저 확인합니다.

```zsh
zsh --version
git --version
curl --version
cp -p ~/.zshrc ~/.zshrc.backup-$(date +%Y%m%d-%H%M%S)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc --skip-chsh
```

공식 설치기의 `--keep-zshrc`로 기존 설정을 보존하고 `--skip-chsh`로 로그인 셸 변경을 생략합니다. 이미 `~/.oh-my-zsh`가 있다면 재설치하지 말고 [사용·업데이트 가이드](oh-my-zsh.md)를 확인합니다.

기존 `~/.zshrc`를 편집해 아래 블록을 한 번만 추가합니다. 기존 Oh My Zsh 설정이 있다면 중복 추가하지 않습니다. `--keep-zshrc`는 초기화 설정을 자동으로 넣지 않으므로 이 단계가 필요합니다. nvm 초기화·개인 PATH·별칭은 보존하고, 개인 별칭으로 기본 별칭을 덮어쓰려면 아래 블록 뒤에 둡니다.

```zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source "$ZSH/oh-my-zsh.sh"
```

새 터미널을 열어 아래 결과에 `omz is a shell function`이 표시되는지 확인합니다. 로그인 셸이 zsh가 아니라면 먼저 `zsh`를 실행한 뒤 확인합니다.

```zsh
type omz
```

공식 안내: [설치](https://github.com/ohmyzsh/ohmyzsh#basic-installation) · [설치기 옵션](https://github.com/ohmyzsh/ohmyzsh/blob/master/tools/install.sh).

## Linux 설치

기본 명령은 bash와 `~/.bashrc` 기준입니다. zsh를 사용할 때만 `sudo apt install zsh` 후 `zsh`를 실행합니다. Oh My Zsh를 추가한다면 [공식 설치 안내](https://github.com/ohmyzsh/ohmyzsh#basic-installation)에 따라 기존 설정을 보존합니다. 아래는 **zsh 터미널**에서 실행합니다.

```zsh
touch ~/.zshrc
cp -p ~/.zshrc ~/.zshrc.backup-$(date +%Y%m%d-%H%M%S)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc --skip-chsh
```

`--keep-zshrc`는 초기화 블록을 자동 추가하지 않습니다. 기존 `~/.zshrc`에 아래 블록이 없으면 한 번만 추가한 뒤 새 zsh에서 `type omz`를 확인합니다. 로그인 셸은 위 명령으로 변경하지 않습니다. 터미널의 셸 설정에서 zsh를 선택할 경우도 기존 PATH·nvm 설정을 보존합니다.

```zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source "$ZSH/oh-my-zsh.sh"
```

Linux nvm 설치는 bash용이므로 zsh에서는 `PROFILE="$HOME/.zshrc"`로 지정하고 `source ~/.zshrc`로 적용합니다.

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

- [공식 저장소: 설치·설정·업데이트·제거](https://github.com/ohmyzsh/ohmyzsh)
- [공식 설치 스크립트와 옵션](https://github.com/ohmyzsh/ohmyzsh/blob/master/tools/install.sh)
- [공식 FAQ](https://github.com/ohmyzsh/ohmyzsh/wiki/FAQ)

제거 후 숨김 설정·캐시·셸 초기화 항목까지 정리하려면 [도구별 제거·잔여 파일 관리](./uninstall-cleanup.md)를 함께 확인합니다.
