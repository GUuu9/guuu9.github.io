# AGENTS_CORE_GUIDE.md (AI Model Optimized Version)

## I. Global Operating Directives & Constraints
**[Language]** All output must be consistently in Korean, except when explicitly translating instructions for the model's internal logic. Minimize unnecessary greetings or conversational filler.
**[Tool Usage Mandate]** When file operations are required (writing, editing, creating), and a template exists or is provided: The structure MUST follow the designated template. If no template is available, then use the corresponding tool call (`read`, `write`, `edit`, `bash`). Direct output of code blocks without a function call is forbidden.

### File Modification Principles
1.  **Minimum Scope Editing:** When modifying an existing file, target only the minimum required lines/blocks to restrict the scope of change.
2.  **Unique Anchor Rule (Mandatory):** The text provided as `oldText` **MUST** be globally unique within the entire file. Generic or repeated phrases are forbidden.
3.  **Atomic Editing:** All changes within a single `edit` call must be distinct, non-overlapping, and logically grouped into an atomic unit.
4.  **[Stability Fallback]**: If repeated attempts to use `edit` fail due to anchoring ambiguity or scope issues, the process MUST switch to writing all modified content to a temporary file (e.g., `*_edit_fallback.md`). After verification, this temp file must then replace the original file using the `write` tool.

## II. Architectural Constraints (The Core Ruleset)
All design decisions must strictly adhere to these principles:

### 1. Single Responsibility Principle (SRP)
*   **Constraint:** Every function, class, module, or component must possess only one clear, isolated responsibility.
*   **Action:** If a unit of code grows too large or attempts multiple roles, it MUST be forcibly split into separate units/modules.

### 2. Dependency Injection (DI)
*   **Constraint:** Object coupling must be minimized by preventing direct object instantiation.
*   **Action:** All external dependencies MUST be defined via an Interface and injected externally. This ensures testability and flexibility.

### 3. MVVM Pattern Enforcement
*   **Structure:** View $\to$ ViewModel $\to$ Service/Repository $\to$ Model (Data) must be strictly maintained.
    *   **View:** Responsible only for UI rendering and input capture. Must not access business logic directly.
    *   **ViewModel:** Manages the state and interaction mediation between the View and the Services. It MUST NOT reference the View, allowing for isolated unit testing.
    *   **Model/State:** Defines data structures and persistence states.

### 4. Layered Roles & Responsibilities (Domain Omission)

| Layer | Component | Responsibility (Role) | Mandatory Constraint |
| :--- | :--- | :--- | :--- |
| **Presentation** | View / UI Component | Rendering the user interface and handling interactions. Maximizes reusability. | Must only interact via ViewModel. Must operate in isolation based on received properties/inputs. |
| **Business Logic** | Feature Service | Orchestrates complex, feature-specific business logic integration. | Combines multiple foundational services to manage context-dependent operations. |
| **Data Access** | Repository | Encapsulates communication with raw data sources (API, DB, File). Provides data abstraction. | Must expose data through standard interfaces, shielding the Service Layer from knowing the source of data (API, Memory, DB, etc.). |

## III. Development Quality & Integrity Checks
- **Preserve Comments**: Do not remove, alter, or strip away existing comments, docstrings, or formatting unless explicitly requested by the user.
- **Style Consistency**: Always align new code style, naming conventions, and patterns with the existing codebase.     
- **No Placeholders**: Do not write placeholder code (e.g., `// TODO: implement later` or `...`). Implement full, working logic.

## IV. Code Optimization & Conciseness (Ponytail's Ladder)
The code must be the shortest and most efficient possible solution. Follow this ladder:

1.  **[YAGNI Check]** Does it need to exist at all? (Delete unnecessary abstractions/classes immediately.)
2.  **[Reuse Check]** Is there similar helper, utility pattern already in codebase? (Do not re-implement.)
3.  **[Stdlib Check]** Can the Standard Library handle it? (Use it first.)
4.  **[Native Check]** Can Native Platform features (e.g., `<input type=\"date\">`, CSS) cover it? (Prefer usage.)
5.  **[Dependency Check]** Can an already installed dependency solve it? (Avoid adding new dependencies.)
6.  **[One-Line Check]** Is it solvable in one line of code? (Write as concisely as possible.)
7.  **[Final Resort]** Only write the minimum code required for functionality after passing all checks.

**Special Directive:** When implementing a feature, MUST leave behind **ONE runnable check**. This is a protective guard that fails if the logic breaks.
*   *(Example: `assert`-based `demo()` or simple `test_*.py`)*

## V. Tool Usage & Workflow Execution
- **Minimize File Reading (Token Saving & Overflow Prevention)**:
  - When querying large files, do not read the entire file unnecessarily. Use specific line ranges (`StartLine`, `EndLine`) when using tools like `view_file`.
  - Do not browse or read build folders, log files, or `node_modules` unrelated to coding.
- **Proactive Context Compaction (Context Optimization)**:
  - If the conversation history becomes too long (risk of context size error) or model response speed noticeably degrades, proactively suggest the user use `/compact`, or optimize token usage by compressing irrelevant context.

# AGENTS_CORE_GUIDE.md - Best Practices for Reliable Code Modification via Tools

## Preventing 'oldText' Matching Errors
(Core Principle: Read $\\rightarrow$ Identify Anchor $\\rightarrow$ Edit)

`oldText` matching errors occur when the target string is not unique or when the change scope is ambiguous. Adhering to these principles ensures stable modification.

### 1. Unique Anchors are Mandatory (The Uniqueness Rule)
The text provided as `oldText` **must be globally unique** within the file. Generic phrases or repeated code snippets will cause failures.
*   **Solution:** Always use a highly specific 'Anchor'—a combination of boilerplate, function signatures, and dedicated comments (`// FIXME: Unique ID`) that guarantees singularity.

### 2. Atomic & Cohesive Changes (The Scope Rule)
1.  **Non-Overlapping:** Each `oldText` segment must be distinct; they cannot touch or overlap with other segments in the same edit call.
2.  **Cohesion:** Group all logically related modifications into a single, atomic edit block to maintain transactional integrity.

### 3. The Safe Workflow (The Lazy Way)
Always follow this sequence:
1.  **`read`**: Use `read` first. This is mandatory context gathering.
2.  **Identify Anchor:** Manually pinpoint and extract the most unique, non-generic text from the target block to use as the sole `oldText`.
3.  **Edit:** Execute the change using this unique anchor.

***

> **Ponytail Tip:** When in doubt, do not attempt an edit based on a common string. Isolate a small piece of code and manually confirm it is the only place that exact sequence appears in the file before calling `edit`.