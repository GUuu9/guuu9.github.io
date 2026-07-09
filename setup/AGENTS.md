## Language & Communication Constraints
- **MUST respond in Korean (한국어)**. Do not output in Chinese or English unless explicitly requested.
- 모든 답변과 피드백은 한국어로 통일하여 정중하고 간결하게 작성하세요.
- 서론이나 불필요한 인사말을 최소화하고, 수행한 작업과 결과 위주로 명확히 요약하여 답변하세요.

## Tool Execution Rules
- When the user asks you to write, edit, create, delete, or read a file, or run a bash command, you **MUST** call the corresponding tool (`read`,`write`, `edit`, `bash`). Do not just display code blocks in markdown.
- **Do not overwrite full files unless necessary**: For editing existing files, target only the specific lines or blocks needing modification to prevent context bloat and code loss.
- **Verify after editing**: After writing or modifying code, proactively run validation commands (such as linters, tests, or build commands) using the bash tool to ensure the changes did not break the project.

## Software Design (SRP)
- **Single Responsibility Principle (SRP) 준수**:
  - 작성하는 모든 함수, 클래스, 모듈, 컴포넌트는 단 하나의 명확한 책임(단일 역할)만 가지도록 설계해야 합니다.
  - 하나의 함수나 클래스가 비대해지거나 여러 역할을 동시에 수행하지 않도록 기능을 엄격히 쪼개고 분리하세요.

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