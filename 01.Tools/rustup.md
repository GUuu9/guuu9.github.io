<!-- version: v1.0.0 -->
# rustup — Rust 툴체인 버전 관리

확인일: 2026-10-28. rustup은 Rust 컴파일러(rustc)·Cargo·표준 라이브러리·컴포넌트·타깃을 관리합니다. 프로젝트 패키지인 crate의 버전은 Cargo.toml·Cargo.lock이 관리합니다. OS별 설치는 [00.Setup](../00.Setup/OS_Dev_Setting.md)을 따릅니다.

## 1. 현재 환경 확인

```bash
rustup --version
rustup show
rustup toolchain list
rustc --version
cargo --version
```

프로젝트 디렉터리에서 실행합니다. 다른 폴더의 결과가 같다고 가정하지 않습니다. Windows는 MSVC 툴체인의 링커·Windows SDK도 필요하며, macOS는 Xcode/Command Line Tools, Linux는 빌드 도구·네이티브 라이브러리가 별도로 필요할 수 있습니다.

## 2. 설치와 선택

다음 1.85.0은 사용법을 설명하는 예시이며 현재 권장 버전이라는 뜻은 아닙니다.

```bash
rustup toolchain install 1.85.0
cargo +1.85.0 --version
```

`cargo +버전 명령`은 그 실행에만 적용합니다. `rustup default 버전`은 프로젝트 지정이 없는 곳에서 사용할 기본값을 바꿉니다. 작업 디렉터리만 바꾸려면 `rustup override set 버전`, 해제는 `rustup override unset`을 사용합니다. override는 로컬 PC에 저장되므로 팀 공유에는 아래 파일을 우선합니다.

## 3. 프로젝트 버전 고정

프로젝트 루트에 rust-toolchain.toml을 두고 Git에 포함합니다. 기존 파일이 있으면 요구사항을 먼저 확인합니다.

```toml
[toolchain]
channel = "1.85.0"
profile = "minimal"
components = ["rustfmt", "clippy"]
```

rustup이 이 파일을 읽어 선택하며 필요한 툴체인·컴포넌트를 설치할 수 있습니다. 폐쇄망·자동 다운로드 제한 환경에서는 미리 준비합니다. `stable`은 업데이트를 따라가는 채널이고 `1.85.0`은 릴리스 고정입니다. nightly가 필요한 프로젝트는 `nightly-YYYY-MM-DD` 형태의 실제 배포 날짜를 지정합니다.

Cargo.toml의 edition은 언어 에디션, rust-version은 최소 지원 Rust 버전 선언입니다. 둘 다 정확한 툴체인 고정을 대신하지 않습니다. Cargo.lock은 패키지 버전 기록이며 컴파일러 고정과는 별개입니다.

## 4. 다른 버전이 선택될 때

명령의 +버전, RUSTUP_TOOLCHAIN 환경 변수, 디렉터리 override, 툴체인 파일, 기본값 등을 확인합니다. 디렉터리 override와 파일은 현재 경로와의 가까운 정도도 영향을 주므로 단순히 파일만 바꿨다고 선택됐다고 판단하지 않습니다.

```bash
rustup show
rustup override list
rustc --version
```

로컬 override가 프로젝트 파일을 가리면 해당 디렉터리에서 unset하고 다시 확인합니다. CI가 별도로 툴체인을 지정하는지도 점검합니다. [공식 선택 규칙](https://rust-lang.github.io/rustup/overrides.html)

## 5. 컴포넌트와 타깃

```bash
rustup component list --installed
rustup component add rustfmt clippy
rustup target list --installed
rustup target add wasm32-unknown-unknown
```

현재 선택된 툴체인에 적용됩니다. 팀 공용 구성은 rust-toolchain.toml의 components·targets에도 기록합니다. 타깃 추가가 외부 링커·C 컴파일러·플랫폼 SDK까지 설치해 주지는 않습니다. 크로스 빌드는 해당 도구를 별도로 준비합니다.

## 6. 업데이트·검증·복귀

rustup 자체 갱신과 프로젝트 툴체인 변경을 구분합니다. 공식 rustup 설치 기준:

```bash
rustup self update
rustup update stable
```

stable을 갱신해도 정확한 릴리스로 고정한 프로젝트가 자동으로 새 버전을 사용하지는 않습니다. 목표 버전을 추가 설치하고 rust-toolchain.toml·CI를 별도 브랜치에서 변경한 뒤 검증합니다.

```bash
rustc --version
cargo build --locked
cargo test --locked
cargo fmt --check
cargo clippy --locked
```

잠금 파일이 있는 프로젝트의 예시입니다. 프로젝트가 요구하는 feature·target·검증 명령도 추가합니다. crate 업데이트는 별도 작업으로 진행하고 복원 중 cargo update를 일괄 실행하지 않습니다.

실패하면 이전 툴체인 파일·CI·의존성 선언·잠금 파일을 복원합니다. 특정 버전 시험은 `cargo +버전 test --locked`로도 할 수 있습니다. 새 버전 확인 전 이전 툴체인은 제거하지 않습니다. 제거는 다른 프로젝트·기본값·override의 사용 여부를 확인한 뒤 `rustup toolchain uninstall 버전`으로 수행합니다.

## 7. 보관과 문제 해결

| 상황 | 확인 |
| :--- | :--- |
| 컴파일러 버전 불일치 | rustup show·override·환경 변수·CI 지정 |
| 링커·헤더 없음 | OS 빌드 도구·SDK·네이티브 의존성 |
| fmt·clippy 없음 | 선택 툴체인의 components |
| 타깃 추가 후 빌드 실패 | 타깃용 링커·SDK·라이브러리 |
| 서버 재생성 후 환경 차이 | 홈의 rustup 환경과 이미지의 시스템 도구 버전을 각각 확인 |

프로젝트에는 툴체인 파일·Cargo.toml·정책에 따른 Cargo.lock·CI 설정을 보관합니다. target 빌드 결과나 사용자 .rustup·.cargo를 프로젝트 소스로 공유하지 않습니다. 서버 배포의 재현은 [이미지 버전·운영 기록](../04.Servers/docker-server/operations.md)도 함께 관리합니다.

공식 참고: [rustup 기본·업데이트](https://rust-lang.github.io/rustup/basics.html), [프로젝트 선택·고정](https://rust-lang.github.io/rustup/overrides.html), [컴포넌트](https://rust-lang.github.io/rustup/concepts/components.html).
