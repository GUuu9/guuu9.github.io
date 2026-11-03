<!-- version: v2.0.0 -->
# Ruby·Bundler·CocoaPods

macOS의 Ruby·CocoaPods 설치와 프로젝트별 버전 사용 안내입니다. 기존 프로젝트는 `.ruby-version`, `Gemfile`, `Gemfile.lock`을 우선합니다. 시스템 Ruby에는 `sudo gem install`을 사용하지 않습니다.

## macOS rbenv 최초 설치

[Xcode 라이선스·초기화](./xcode.md#설치-전-개발-도구-준비-순서)와 [Homebrew 설치·PATH](./brew.md#homebrew-설치path)를 먼저 마칩니다. 개인 Mac의 일반 사용자 zsh에서 기존 Ruby를 확인합니다.

```bash
which -a ruby
ruby --version
command -v rbenv
```

기존 rbenv가 없다면 Homebrew로 설치합니다. ruby-build도 함께 설치됩니다.

```bash
brew install rbenv
rbenv --version
```

zsh 초기화를 실행하고, 터미널을 새로 열어 확인합니다.

```bash
rbenv init zsh
type rbenv
rbenv install -l
```

`type rbenv`가 셸 함수를 표시해야 합니다. `rbenv: shell integration not enabled`가 나오면 현재 셸에서 확인합니다.

```zsh
eval "$(rbenv init - zsh)"
type rbenv
```

Intel·구형 macOS에서 Homebrew가 동작하지 않을 때는 [rbenv 공식 Git 설치](https://github.com/rbenv/rbenv#installation)를 사용합니다. 기존 `~/.rbenv`가 있으면 그 위에 clone하지 않습니다.

```bash
git clone https://github.com/rbenv/rbenv.git "$HOME/.rbenv"
"$HOME/.rbenv/bin/rbenv" init zsh
```

새 터미널에서 rbenv를 확인한 뒤 ruby-build를 추가합니다.

```bash
command -v rbenv
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)/plugins/ruby-build"
rbenv install -l
```

Ruby 컴파일에는 Xcode/CLT와 빌드 라이브러리가 필요합니다. [rbenv](https://github.com/rbenv/rbenv) · [ruby-build](https://github.com/rbenv/ruby-build).

## 2. 프로젝트 Ruby 선택·확인

프로젝트에 `.ruby-version`이 있으면 그 버전을 사용합니다. 없으면 Gemfile·Gemfile.lock·CI의 요구를 확인해 Ruby 버전을 정합니다. Flutter와 Ruby 버전은 별도로 관리합니다.

기존 프로젝트 루트에서는 기록된 버전을 설치합니다.

```bash
rbenv install
```

새 프로젝트 루트에서는 실제 버전 번호로 지정합니다.

```bash
rbenv install 목표Ruby버전
rbenv local 목표Ruby버전
```

`.ruby-version`은 Git에 포함합니다. 프로젝트 루트에서 선택 상태를 확인합니다.

```bash
rbenv version
ruby --version
command -v ruby
rbenv which ruby
```

`ruby --version`이 `.ruby-version`과 맞고, `command -v ruby`가 rbenv shim 경로여야 합니다. 맞지 않으면 PATH와 셸 초기화를 확인합니다.

## 3. Gemfile로 CocoaPods 설치·사용

CocoaPods를 사용하는 Flutter 프로젝트의 루트(`pubspec.yaml`과 같은 위치)에 `Gemfile`을 둡니다. 기존 Gemfile·Gemfile.lock은 덮어쓰지 않습니다.

```ruby
source 'https://rubygems.org'

gem 'cocoapods', '= 1.17.0'
```

`1.17.0`은 버전 고정 예시입니다. 기존 프로젝트는 선언과 잠금 파일의 버전을 따릅니다. [CocoaPods 버전](https://rubygems.org/gems/cocoapods/versions/1.17.0) · [Gemfile 안내](https://guides.cocoapods.org/using/a-gemfile.html).

프로젝트 Ruby를 선택한 상태에서 Bundler를 준비합니다. 새 프로젝트는 기본 설치를, 기존 Gemfile.lock은 `BUNDLED WITH`의 실제 버전을 사용합니다.

```bash
gem install bundler
bundle --version
```

기존 잠금 파일의 버전은 다음처럼 지정합니다.

```bash
gem install bundler -v 실제버전
bundle --version
```

Gemfile이 있는 프로젝트 루트에서 CocoaPods를 설치하고 확인합니다.

```bash
bundle config set --local path .local/bundle
bundle install
bundle exec pod --version
```

Gemfile·Gemfile.lock·`.ruby-version`은 공유하고 `.local/`·`.bundle/`은 `.gitignore`에 추가합니다.

Podfile이 있는 `ios/` 폴더에서 앱 의존성을 복원합니다.

```bash
cd ios
bundle exec pod install
```

Flutter iOS 명령은 프로젝트 루트에서 Bundler를 통해 실행합니다.

```bash
bundle exec fvm flutter build ios
```

## 업데이트·복귀·제거

- rbenv 업데이트: `brew upgrade rbenv ruby-build`
- Ruby 버전 추가: `rbenv install 목표Ruby버전` 후 프로젝트의 `.ruby-version` 갱신
- 프로젝트 복귀: 기존 `.ruby-version`과 Gemfile.lock 복원 후 `bundle install`
- Ruby 제거: 사용처를 확인한 뒤 `rbenv uninstall 버전`
- rbenv 제거: Homebrew 설치라면 `brew uninstall rbenv`

CocoaPods 버전 변경은 Gemfile을 수정하고 `bundle update cocoapods` 결과를 확인합니다. [CocoaPods install·update 안내](https://guides.cocoapods.org/using/pod-install-vs-update.html).
