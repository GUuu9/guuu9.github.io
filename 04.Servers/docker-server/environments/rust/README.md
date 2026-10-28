<!-- version: v2.0.0 -->
# 서버 Rust 작업 영역

이 문서는 **서버 관리자가 만든 SSH 컨테이너에 접속한 developer 사용자**가 실행하는 언어 설정입니다. 개인 PC의 로컬 Docker·Reopen in Container 절차가 아닙니다. 서버 생성·포트·키·볼륨은 [공통 구성](../../guides/docker_container_setup.md)을 따릅니다. 


## rustup 설치

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup show
```

cargo·툴체인은 개인 홈에 유지됩니다. 프로젝트의 rust-toolchain.toml 또는 rust-toolchain을 우선합니다. 최신 stable 업데이트는 해당 프로젝트의 호환성 검증과 별개입니다.

## 빌드·검증

잠금 파일이 있는 프로젝트에서:

```bash
cargo build --locked
cargo test --locked
cargo fmt --check
cargo clippy --locked
```

fmt·clippy가 필요하면 해당 툴체인에 rustup component add rustfmt clippy로 추가합니다. 네이티브 라이브러리·SSL 개발 헤더가 필요하면 관리자 이미지에 추가합니다. 개인 PC의 rust-analyzer는 원격 작업 영역에 설치합니다. 업데이트 전 툴체인·Cargo.lock을 기록하고 새 버전을 별도로 시험합니다. [Rust 공식 설치](https://rust-lang.org/tools/install/)


프로젝트 툴체인 고정·선택 우선순위·업데이트·복귀는 [rustup 가이드](../../../../01.Tools/rustup.md)를 참고합니다.
