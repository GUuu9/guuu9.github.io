<!-- version: v1.1.1 -->
# Craft 앱: Launcher 사용·Rust 소스 빌드

확인일: 2026-11-03. 일반 사용과 소스 수정·기여 경로를 구분합니다. 앱별 버전·지원 형식·Rust 요구 조건은 각각 확인합니다.

## 1. 일반 사용: ArtCraft Launcher

일반 사용은 [ArtCraft Apps](https://getartcraft.com/apps)에서 **Download Launcher**를 눌러 런처를 내려받아 설치합니다. 런처에서 사용할 앱을 선택해 설치하고 런처 또는 앱 메뉴에서 실행합니다. 런처가 OS·CPU에 맞는 앱을 선택하고 앱 업데이트를 관리하므로 Rust·Git 설치나 소스 빌드는 필요하지 않습니다.

플랫폼별 런처 설치 방식은 공식 [ArtCraft Launcher 안내](https://github.com/storytold/craft-launcher#downloads)를, 앱별 OS·CPU 요구 조건은 [Crafting Apps](https://getartcraft.com/apps)에서 확인합니다.

## 2. 소스 수정·기여: Rust 빌드

소스 코드를 수정하거나 특정 커밋을 실행할 때만 이 경로를 사용합니다. 각 앱의 GitHub 저장소를 clone하고 저장소가 지정한 Rust 툴체인·네이티브 빌드 도구를 준비합니다. 런처 설치 경로와 별개로 관리합니다.

[OS별 개발 환경](../00.Setup/OS_Dev_Setting.md)의 Git·rustup·네이티브 빌드 도구를 먼저 구성합니다. 저장소의 rust-toolchain 파일·Cargo.toml·개발 안내에서 Rust 버전과 OS 라이브러리 조건을 확인합니다.

| 도구 | 용도 | 소스 저장소 |
| :--- | :--- | :--- |
| PhotoCraft | 사진·래스터 이미지 편집 | [GitHub](https://github.com/storytold/photocraft) |
| VectorCraft | 벡터 도형·일러스트 편집 | [GitHub](https://github.com/storytold/vectorcraft) |
| EffectCraft | 모션 그래픽·합성 | [GitHub](https://github.com/storytold/effectcraft) |
| FilmCraft | 비선형 영상 편집 | [GitHub](https://github.com/storytold/filmcraft) |

```bash
git clone https://github.com/storytold/photocraft.git
cd photocraft
cargo run --locked --release -p photocraft
```

위는 PhotoCraft 예시입니다. 다른 도구는 해당 저장소를 clone하고 그 루트에서 아래 명령을 사용합니다.

| 도구 | 저장소 이름 | 실행 명령 |
| :--- | :--- | :--- |
| PhotoCraft | `storytold/photocraft` | `cargo run --locked --release -p photocraft` |
| VectorCraft | `storytold/vectorcraft` | `cargo run --locked --release -p vectorcraft` |
| EffectCraft | `storytold/effectcraft` | `cargo run --locked --release -p effectcraft` |
| FilmCraft | `storytold/filmcraft` | `cargo run --locked --release -p filmcraft` |

EffectCraft README는 확인 시점에 Rust 1.95 이상을 요구합니다. 다른 도구에 같은 최소 버전을 일괄 적용하지 않고 각 저장소 조건을 확인합니다.

위 명령은 각 공식 README의 desktop 패키지에 잠금 파일 유지 옵션을 적용한 실행 방법입니다. 처음에는 컴파일과 의존성 다운로드 시간이 필요합니다. 잠금 파일이 포함된 환경을 유지하려면 `cargo run --locked --release -p photocraft`을 사용하고 실패 원인을 먼저 확인합니다. 저장소에 요구 툴체인이 있으면 해당 버전을 설치하며 최신 stable로 일괄 바꾸지 않습니다.

GUI는 창을 닫아 종료합니다. 터미널 빌드·실행을 중단할 때는 Ctrl+C를 사용합니다. 작업한 문서는 먼저 저장합니다. 소스 빌드의 실행 파일은 사용한 Cargo target 설정에 따라 위치가 달라질 수 있으므로 이 문서에서는 cargo run을 실행 기준으로 사용합니다.

## 3. 첫 실행과 작업 확인

Launcher로 설치했거나 소스 빌드가 끝난 앱에서 확인합니다.

| 도구 | 동작·업데이트 검증 |
| :--- | :--- |
| PhotoCraft | 원본·편집본을 분리하고 저장 후 재열기, 레이어·색상·이미지 크기 확인 |
| VectorCraft | SVG·PDF 가져오기와 내보내기 후 경로·텍스트·폰트 확인 |
| EffectCraft | 프로젝트·외부 소스 보관, 프레임·키프레임·렌더 결과 확인 |
| FilmCraft | 참조 영상·오디오·폰트 보관, 타임라인 길이·프레임률·소리·출력 확인 |

중요한 원본은 복사본으로 열어 호환성을 시험합니다. 앱 설치 폴더나 Cargo target 안에 작업 파일을 보관하지 않습니다. 설정·자동 저장·캐시는 OS별 앱 문서와 실제 설정 화면에서 위치를 확인해 기록합니다. 정확한 위치를 확인하지 않은 상태에서 초기화·캐시 삭제를 수행하지 않습니다.

## 4. 업데이트

### ArtCraft Launcher로 설치한 경우

1. 업데이트 전 작업 파일과 사용자 설정을 백업합니다.
2. 런처에서 설치한 앱의 업데이트를 확인하고 해당 앱을 종료합니다.
3. 런처의 앱 업데이트를 실행한 뒤 앱을 열어 작업 파일 복사본의 편집·저장·내보내기를 확인합니다.

런처 자체의 새 버전은 런처가 안내하는 업데이트를 적용합니다. [공식 안내](https://github.com/storytold/craft-launcher#stay-up-to-date)에 따르면 앱은 설치에 사용한 패키지 형식을 유지해 갱신됩니다.

### Git 소스에서 실행한 경우

```bash
git status
git rev-parse HEAD
git pull --ff-only
cargo run --locked --release -p photocraft
```

업데이트할 앱의 저장소 루트에서 실행하고 마지막 cargo 명령은 위 표의 해당 패키지명으로 바꿉니다. 현재 커밋을 기록하고 로컬 변경을 보존한 뒤 업데이트합니다. 위 pull은 브랜치를 추적하는 설치에 적용합니다. 릴리스 태그에 고정한 설치는 `git fetch --tags` 후 검토한 새 태그를 선택하고 빌드합니다. Rust 버전·빌드 요구사항도 바뀌었는지 확인합니다.

업데이트를 위해 Cargo.lock을 삭제하거나 cargo update를 일괄 실행하지 않습니다. 빌드가 실패하면 요구 툴체인·네이티브 라이브러리·잠금 파일부터 확인합니다.

## 5. 복귀와 문제 해결

실패하면 런처에서 이전 앱 버전으로 복귀할 수 있는지 확인하고 별도 환경에서 재현합니다. 복귀 기능이 있다고 가정하지 않습니다. 소스 실행은 기록한 Git 커밋으로 돌아갑니다. 새 앱에서 저장한 프로젝트가 이전 버전에서 열리지 않을 수 있으므로 **업데이트 전 파일 백업**도 함께 복원합니다. 설정 폴더를 무조건 지워 해결하지 않습니다.

| 상황 | 먼저 확인 |
| :--- | :--- |
| 앱 실행 실패 | 지원 OS·CPU, 다운로드 무결성, 릴리스 알려진 문제 |
| 소스 빌드 실패 | 저장소 Rust 조건·OS 빌드 도구·라이브러리 |
| 글꼴·레이아웃 차이 | 사용 폰트와 릴리스·소스 빌드의 리소스 차이 |
| 파일·내보내기 차이 | 공식 지원 형식·가져오기 경고·작업 복사본 |
| 새 버전만 실패 | 이전·현재 앱 버전과 재현 파일을 비교 |

버그 보고에는 OS·CPU·앱 버전 또는 커밋, 재현 순서와 공개 가능한 최소 파일을 포함합니다. 공개 저장소에 개인 원본·비밀값을 첨부하지 않습니다.
