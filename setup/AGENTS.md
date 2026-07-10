## Language & Communication Constraints
- **MUST respond in Korean (한국어)**. Do not output in Chinese or English unless explicitly requested.
- 모든 답변과 피드백은 한국어로 통일하여 정중하고 간결하게 작성하세요.
- 서론이나 불필요한 인사말을 최소화하고, 수행한 작업과 결과 위주로 명확히 요약하여 답변하세요.

## Tool Execution Rules
- When the user asks you to write, edit, create, delete, or read a file, or run a bash command, you **MUST** call the corresponding tool (`read`,`write`, `edit`, `bash`). Do not just display code blocks in markdown.
- **Do not overwrite full files unless necessary**: For editing existing files, target only the specific lines or blocks needing modification to prevent context bloat and code loss.
- **Verify after editing**: After writing or modifying code, proactively run validation commands (such as linters, tests, or build commands) using the bash tool to ensure the changes did not break the project.

## Software Design (SRP, DI, MVVM)
- **Single Responsibility Principle (SRP) 준수**:
  - 작성하는 모든 함수, 클래스, 모듈, 컴포넌트는 단 하나의 명확한 책임(단일 역할)만 가지도록 설계해야 합니다.
  - 하나의 함수나 클래스가 비대해지거나 여러 역할을 동시에 수행하지 않도록 기능을 엄격히 쪼개고 분리하세요.
- **Dependency Injection (DI) 적용**:
  - 구성 요소 간의 독립성을 보장하고 결합도를 낮추기 위해 의존성 주입(DI)을 추가로 사용합니다.
  - 객체 내부에서 직접 의존성을 생성하지 않고 외부에서 주입받도록 설계하여 테스트 용이성과 유연성을 높이세요.
- **MVVM 패턴 적용**:
  - 확장 및 유지보수가 용이하도록 Model-View-ViewModel (MVVM) 패턴을 적용합니다.
  - UI(View), 비즈니스 로직 및 상태(ViewModel), 데이터(Model)를 명확히 분리하여 구조적 일관성을 유지하세요.

## 아키텍처 역할 정의 (Architecture Role Definitions)
프론트엔드, 백엔드, 풀스택 개발 전반에 적용할 수 있는 공통 아키텍처 기준입니다. 영역별로 역할과 책임을 명확히 구분하되, TypeScript 프로젝트 기준 예시와 함께 다양한 언어 및 프레임워크(C, Node.js, Flutter, Rust, Python 등)에 적용할 수 있도록 다국어/다양한 환경의 맵핑 가이드를 제공합니다.

---

### 1. UI & Presentation Layer (Renderer/Frontend)
사용자에게 정보를 보여주고 상호작용을 처리하는 레이어입니다.

#### View
- **역할**: 사용자 인터페이스(UI) 표현 및 사용자 입력 수집.
- **설계 원칙**: 템플릿과 화면 흐름 제어 로직을 관리하며, 비즈니스 로직에 직접 접근하지 않고 ViewModel/Controller를 통해서만 상호작용합니다.
- **언어별 응용**:
  - **TS (Electron/Web)**: `src/renderer/scenes/*.view.ts`, `*.view.html` (템플릿 분리)
  - **Flutter**: `Widget` 클래스 및 UI 빌드 메서드
  - **Python (PyQt/PySide)**: `QWidget` 또는 UI 파일에서 변환된 클래스
  - **Rust**: `slint`, `egui`, `iced` 등의 Window 및 UI 렌더링 블록
  - **C (Win32/GTK)**: 윈도우 프로시저 및 UI 그리기 루틴 (`window_proc.c`)

#### ViewModel
- **역할**: View와 비즈니스 로직(Service) 간의 상태 및 상호작용 중재.
- **설계 원칙**: View에 바인딩할 데이터 상태(State)를 노출하고, View의 이벤트를 처리하여 하위 서비스로 위임합니다. View를 직접 참조하지 않아 독립적인 단위 테스트가 가능해야 합니다.
- **언어별 응용**:
  - **TS**: `*.viewmodel.ts`
  - **Flutter**: `ChangeNotifier`, `Bloc`, `Cubit`, `Notifier` (Riverpod)
  - **Python (PyQt)**: Signals와 Slots가 연결된 `QObject` 기반 ViewModel
  - **Rust**: Elm 아키텍처의 `Message` 핸들러 및 갱신 상태 홀더
  - **Node.js (API/Backend)**: MVC의 `Controller` (클라이언트 요청 파싱 및 응답 포맷팅 중재자)
  - **C**: 상태 전파를 위한 콜백(Callback) 구조체 및 상태 제어 모듈

#### UI Component
- **역할**: 여러 화면에서 재사용할 수 있는 범용적이고 독립적인 UI 요소(Button, Input 등).
- **설계 원칙**: 상위 View나 ViewModel의 맥락에 의존하지 않고, 전달받는 속성(Properties/Inputs)과 자체 상태로만 동작하도록 격리합니다.
- **언어별 응용**:
  - **TS**: `src/renderer/scenes/_components/[name]/*.ts`
  - **Flutter**: Custom `StatelessWidget` 또는 `StatefulWidget`
  - **Python (PyQt)**: 재사용 가능한 커스텀 `QWidget`
  - **Rust**: 개별 렌더링 함수 또는 커스텀 컴포넌트 구조체
  - **C**: 공통 UI 드로잉 함수 및 상태 구조체

---

### 2. Business Logic Layer (Service)
도메인 지식과 비즈니스 정책을 처리하는 레이어입니다.

#### Domain Service
- **역할**: 특정 도메인의 핵심 비즈니스 규칙 및 상태 처리.
- **설계 원칙**: 비즈니스 정책의 핵심을 담당하며, 다수의 ViewModel이나 다른 서비스에서 공유할 수 있는 전역 공유 상태 및 비즈니스 연산을 제공합니다.
- **언어별 응용**:
  - **TS**: `src/renderer/features/[domain]/services/*.service.ts`
  - **Flutter**: `DomainService`, `UseCase` 클래스
  - **Python**: 도메인 핵심 로직을 캡슐화한 Service/Domain 클래스
  - **Rust**: 도메인 모델에 종속된 비즈니스 로직 처리 `impl` 블록 및 Module
  - **C**: 도메인 연산 함수들의 모음 (`user_service.c`, `user_service.h`)

#### Feature Service
- **역할**: 특정 화면(Feature)에 종속된 복합적 비즈니스 로직의 통합 및 오케스트레이션.
- **설계 원칙**: 단일 도메인 서비스로 처리하기 어렵고 해당 화면의 맥락에서 여러 도메인 서비스를 조합해야 하는 작업을 조율합니다.
- **언어별 응용**:
  - **TS**: `src/renderer/scenes/[feature]/services/*.service.ts`
  - **Flutter**: Feature 단위의 API 통합 매니저 및 Coordinators
  - **Python / Node.js**: 복수의 도메인 모델을 가공하는 Application Service Layer
  - **Rust / C**: 여러 도메인 모듈을 결합하여 특정 시나리오를 구동하는 매니저 구조체/함수

---

### 3. Data & State Layer
데이터 취득, 영속성 관리 및 데이터를 표현하는 레이어입니다.

#### State
- **역할**: 화면별 로컬 UI 상태와 비즈니스 영역에서 활용하는 도메인 데이터 상태 분리.
- **설계 원칙**:
  - **Scene State** (`src/renderer/scenes/` 하위): 특정 화면/ViewModel 내에서만 임시로 사용하는 상태 (예: 토글 상태, 로딩 여부).
  - **Domain State** (`src/renderer/features/[domain]/` 하위): 서비스 간 혹은 화면 간 공유가 필요한 영속성 있는 도메인 데이터 상태.
- **언어별 응용**:
  - **Flutter**: `Widget State` (Scene) vs `HydratedBloc / Riverpod State` (Domain)
  - **Python / Node.js**: View Local 변수 vs 전역 상태 매니저 / Redis / DB 캐시
  - **Rust**: UI Local `State` vs Global `lazy_static` / `Mutex` / DB State
  - **C**: 로컬 스택/힙 변수 vs 전역 구조체 (`AppConfig`, `GlobalState`)

#### Persistence Service
- **역할**: 로컬 디스크, DB, 혹은 웹 스토리지 등의 저장소 읽기/쓰기를 제어하는 영속성 인프라.
- **설계 원칙**: 저장 매체에 직접 접근하는 저수준(low-level) 입출력을 담당하며, 비즈니스 레이어가 저장 환경의 변화에 영향을 받지 않도록 격리합니다.
- **언어별 응용**:
  - **TS**: `src/renderer/features/operationData/persistence.service.ts`
  - **Flutter**: `shared_preferences`, `sqlite`, `hive` 래퍼 클래스
  - **Python**: `SQLAlchemy` 세션 관리자, 파일 파일 입출력 매니저
  - **Rust**: `diesel`, `sqlx`, `tokio::fs` 파일 입출력 도구
  - **C**: 파일 Read/Write 및 DB 드라이버 래퍼 API (`file_io.c`, `sqlite_wrapper.c`)

#### Repository
- **역할**: 원시 데이터 소스(API, 로컬 파일, DB 등)와의 통신을 캡슐화하여 데이터 액세스 추상화.
- **설계 원칙**: 서비스 레이어가 데이터가 어디서(API, 메모리, DB) 오는지 신경 쓰지 않도록 표준 인터페이스 형태로 데이터를 제공합니다.
- **언어별 응용**:
  - **TS**: `*.repository.ts` 또는 외부 소스 바인딩부
  - **Flutter / Dart**: API 통신 클라이언트 및 Local DB 조회를 구현한 Repository 구현체
  - **Python**: Data Access Object (DAO) 또는 Repository 클래스
  - **Rust**: 데이터 접근 트레이트(Trait)를 구현한 Struct
  - **C**: 데이터 원천에 접근하여 도메인 구조체로 변환해 주는 모듈 (`user_repository.c`)

---

### 4. Architecture Support (DI & Core)
모듈 간 결합도를 낮추고 유연한 통합을 돕는 유틸리티 및 코어 레이어입니다.

#### Container
- **역할**: 서비스 및 객체의 의존성 등록, 인스턴스 생성 및 수명 주기(Singleton, Transient 등) 관리.
- **설계 원칙**: 외부에서 구체 클래스를 주입(DI)해 줌으로써 클래스 간의 강한 결합을 방지하고 유연한 구현체 교체를 지원합니다.
- **언어별 응용**:
  - **TS / Node.js**: `*.container.ts` (`tsyringe`, `inversify` 혹은 자체 Container 사용)
  - **Flutter**: `GetIt`, `Provider`, `Riverpod Container`
  - **Python**: `dependency-injector` 패키지 또는 수동 생성자 인젝션 구조
  - **Rust**: Traits 의존성 주입을 위한 `Box<dyn Trait>` 및 `Arc<dyn Trait>` 라이브러리 구성
  - **C**: 의존 주입용 함수 포인터(Function Pointer) 구조체 및 초기화 기법

#### Registry
- **역할**: 애플리케이션 시작 시 모든 의존성 주입 대상과 Container를 매핑 및 등록하는 중앙 등록소.
- **언어별 응용**:
  - **TS**: `registry.ts`
  - **Flutter**: `injection_container.dart` (DI 초기화 메서드)
  - **Python / Node.js**: `bootstrap.py` / `app.js` 내의 의존성 등록부
  - **Rust**: `mod.rs` 또는 `main.rs` 내의 DI 컨테이너 빌더 구성
  - **C**: `main.c` 내에서 함수 포인터와 컨텍스트 구조체를 직접 조립하는 초기화 함수

#### Bridge (IPC / RPC / FFI)
- **역할**: 서로 다른 프로세스 또는 실행 런타임 환경 간의 안전하고 격리된 통신 채널 정의.
- **설계 원칙**: 프론트엔드가 백엔드 영역의 민감한 자원이나 OS API에 직접 접근하는 것을 격리하고, 통제된 API 및 메시지 규격만 정의하여 호출을 위임합니다.
- **언어별 응용**:
  - **TS**: `*.bridge.ts` (Electron Preload IPC 채널)
  - **Flutter**: Native 연동을 위한 `MethodChannel`, Rust/C와 연동을 위한 `Dart FFI`
  - **Node.js / Python / Rust / C**:
    - **IPC**: UNIX 도메인 소켓, 윈도우 파이프(Named Pipes)
    - **RPC**: `gRPC`, `WebSocket`, `HTTP API` 클라이언트 통신부
    - **FFI**: Native 바인딩 레이어 (예: Rust의 `neon`, C++ Addon 등)

## Output & Documentation
- **Task Summary Document (.md) 생성**:
  - 모든 요청 작업이나 주요 코드 변경 작업이 완료되면, 해당 작업 내용과 수정 사항을 요약한 마크다운 문서(예: `task_summary.md` 또는 작업 단위에 맞는 `.md` 파일)를 작성하여 프로젝트 디렉토리에 반드시 저장 및 기록해야 합니다.
  - 문서에는 **작업 목표, 수정/추가된 파일 및 코드 링크, 변경 핵심 로직, 검증 결과** 등이 포함되어야 합니다.

## Code Quality & Integrity
- **Preserve Comments**: Do not remove, alter, or strip away existing comments, docstrings, or formatting unless explicitly requested by the user.
- **Style Consistency**: Always align new code style, naming conventions, and patterns with the existing codebase.     
- **No Placeholders**: Do not write placeholder code (e.g., `// TODO: implement later` or `...`). Implement full, working logic.

## Context & Token Management
- **Minimize File Reading (토큰 절약 및 오버플로우 방지)**:
  - 대용량 파일을 조회할 때 파일 전체를 무분별하게 읽지 마세요. `view_file` 등의 도구를 쓸 때는 반드시 구체적인 라인 범위(`StartLine`, `EndLine`)를 지정하여 필요한 부분만 읽어야 합니다.
  - 코딩과 무관한 빌드 폴더, 로그 파일, `node_modules` 등은 직접 탐색하거나 읽지 마세요.
- **Proactive Context Compaction (선제적 컨텍스트 압축)**:
  - 대화가 너무 길어져서 컨텍스트 제한 오류(`exceed_context_size_error`)가 발생할 가능성이 있거나 모델 반응 속도가 눈에 띄게 느려지면, 다음 작업을 진행하기 전에 사용자에게 `/compact` 명령어를 입력하도록 제안하거나, 에이전트 스스로 불필요한 맥락을 압축해 나가며 토큰 용량을 최적화해야 합니다.