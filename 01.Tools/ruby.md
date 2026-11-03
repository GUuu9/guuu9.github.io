<!-- version: v1.0.0 -->
# Ruby·Bundler·CocoaPods 버전 관리

Ruby 프로젝트와 CocoaPods 등 Ruby 기반 도구를 프로젝트별로 복원하는 안내입니다. macOS의 rbenv 최초 설치는 [macOS 초기 준비](../00.Setup/macOS_Common_Dev_Setting.md#ruby-도구가-필요한-경우)를 따릅니다. 기존 Ruby 관리자가 있으면 유지하며 시스템 Ruby에 sudo로 gem을 설치하지 않습니다. Windows·Linux는 [rbenv 지원 환경](https://github.com/rbenv/rbenv#installation)과 해당 프로젝트의 관리 방식을 확인합니다. iOS 로컬 빌드는 macOS·Xcode가 별도로 필요합니다.

## 프로젝트 Ruby 선택·복원

프로젝트 `.ruby-version`·Gemfile의 Ruby 조건에 맞는 **실제 버전**을 설치합니다. `목표Ruby버전`은 자리표시자입니다. CocoaPods를 위해 새 Ruby를 선택하는 경우 Ruby·CocoaPods 지원 범위와 macOS 빌드 조건을 확인하고 선택 버전을 기록합니다.

```bash
rbenv install 목표Ruby버전
rbenv local 목표Ruby버전
```

위 `local`은 새 프로젝트 루트에서 `.ruby-version`을 처음 만들 때만 실행합니다. 기존 파일이 있으면 값을 바꾸지 말고 프로젝트 루트에서 `rbenv install`로 그 버전을 복원합니다. `rbenv shell`·`rbenv global`은 프로젝트 전환 절차에 사용하지 않습니다. 이전 `RBENV_VERSION`이 남아 있으면 버전 파일보다 우선하므로 작업 자식 셸에서 `unset RBENV_VERSION` 후 확인합니다. 자동 전환을 쓰면 프로젝트의 `.envrc`가 프로젝트 안에서 해제·이탈 시 복원합니다.

```bash
ruby --version
rbenv version
command -v ruby
```

### CocoaPods 도구 버전을 프로젝트에 고정

CocoaPods를 쓰는 프로젝트는 **Gemfile·Gemfile.lock으로 도구 버전도 관리**합니다. Ruby가 같아도 CocoaPods 요구 버전은 프로젝트마다 다를 수 있습니다. 기존 Gemfile·잠금 파일은 그대로 복원합니다. 파일이 없는 프로젝트에서 CocoaPods를 새로 도입할 때만 프로젝트 루트에 다음 Gemfile을 작성합니다. `목표CocoaPods버전`은 검증할 실제 버전으로 바꾸며 SwiftPM 전용 샘플에는 만들지 않습니다.

```ruby
source 'https://rubygems.org'
gem 'cocoapods', '= 목표CocoaPods버전'
```

기존 Gemfile.lock의 `BUNDLED WITH`에서 Bundler 버전을 확인해 선택한 Ruby에 설치합니다. 새 프로젝트는 선택 Ruby와 호환되는 실제 Bundler 버전을 정해 기록합니다. 설치할 때 `sudo`를 사용하지 않습니다.

```bash
gem install bundler -v Bundler버전
bundle --version
bundle config set --local path .local/bundle
bundle install
bundle exec pod --version
```

모두 **Gemfile이 있는 프로젝트 루트**에서 실행합니다. `.local/bundle`과 `.bundle/`은 Git 제외 로컬 상태이며 Gemfile·Gemfile.lock은 공유합니다. 다른 프로젝트의 `BUNDLE_GEMFILE`·`BUNDLE_PATH`가 강제되어 있다면 작업 자식 셸에서 원인을 확인·해제하고 이 프로젝트의 설정을 사용합니다. 일반 `gem install cocoapods -v …` 후 `pod`만 실행하는 방식은 특정 프로젝트 버전을 선택해 주지 않으므로 기본 절차에서 제외합니다.

Pod 복원은 `bundle exec pod install`, 특정 Pod 갱신은 `bundle exec pod update Pod이름`입니다. CocoaPods 도구 자체를 바꿀 때는 Gemfile 제약과 `bundle update cocoapods` 결과를 검토합니다. 잠금 파일 삭제로 전체 갱신하지 않습니다. [공식 install·update 구분](https://guides.cocoapods.org/using/pod-install-vs-update.html).

## 업데이트·복귀·제거

rbenv와 ruby-build 자체 갱신은 각 Git 설치 경로에서 미커밋 변경·현재 커밋을 기록한 뒤 공식 릴리스와 변경 사항을 확인해 진행합니다. Ruby 버전 변경과 gem 업데이트는 별도 작업입니다. 관리 도구 갱신만으로 프로젝트 `.ruby-version`을 바꾸지 않습니다.

Ruby를 올릴 때는 이전 버전을 보존하고 새 버전을 병행 설치해 `.ruby-version`·Gemfile·잠금 파일 변경과 프로젝트 테스트를 함께 검토합니다. 복귀는 이전 파일과 Ruby를 선택해 `bundle install`로 복원합니다. 기존 Ruby가 없으면 먼저 재설치해야 합니다.

제거 전 `rbenv versions`와 프로젝트 `.ruby-version`·CI 참조를 확인합니다. 더 이상 쓰지 않는 버전만 `rbenv uninstall 실제버전`으로 제거합니다. 해당 Ruby의 gem도 함께 사라질 수 있으므로 Gemfile·잠금 파일을 보존합니다. 프로젝트 `.local/bundle`·`.bundle`은 복원이 가능한지 확인한 뒤 선택 정리하고 소스·서명 자료는 삭제하지 않습니다. rbenv 자체 제거는 [공식 제거 안내](https://github.com/rbenv/rbenv#uninstalling-rbenv)에 따라 셸 초기화 참조와 설치 경로를 확인합니다.

공식 참고: [rbenv](https://github.com/rbenv/rbenv), [ruby-build](https://github.com/rbenv/ruby-build), [Bundler](https://bundler.io/), [CocoaPods Gemfile](https://guides.cocoapods.org/using/a-gemfile.html).
