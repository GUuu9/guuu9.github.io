<!-- version: v1.0.0 -->
# Antigravity CLI (agy-cli) 가이드라인

Antigravity CLI(`agy-cli`)는 Google DeepMind 팀이 설계한 강력한 에이전트 기반 코딩 어시스턴트입니다. 이 문서에서는 초기 설치부터 스킬(Skills), 사용자 정의 에이전트(Subagents) 등록, 그리고 플랜(Plan) 모드에서의 최적의 모델 분할 설정법까지 다룹니다.

---

## 목차

1. [설치 및 기본 작동 방식](#1-설치-및-기본-작동-방식)
2. [스킬 (Skills) 구성 및 자동 발견](#2-스킬-skills-구성-및-자동-발견)
3. [사용자 정의 서브에이전트 (Subagents) 등록](#3-사용자-정의-서브에이전트-subagents-등록)
4. [플랜 (Plan) 모드에서의 모델 분할 활용 설정](#4-플랜-plan-모드에서의-모델-분할-활용-설정)
5. [커스텀 규칙 (Rules) 추가 (AGENTS.md)](#5-커스텀-규칙-rules-추가-agentsmd)

---

## 1. 설치 및 기본 작동 방식

`agy-cli`는 일반적으로 Node.js 또는 Python 기반의 어시스턴트 구동 프로그램으로 전역 혹은 로컬 스크립트로 동작합니다.

### 1) 설치
전역 패키지 저장소 또는 로컬 소스 링크를 사용해 설치합니다.
```bash
# 글로벌 설치 예시
curl -fsSL https://antigravity.google/cli/install.sh | bash # mac or linux
irm https://antigravity.google/cli/install.ps1 | iex #windows powershell 
curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd # windows cmd
```

### 2) 앱 데이터 경로
에이전트의 작동 로그, 아티팩트 및 로컬 학습 설정은 다음 디렉토리에 캐싱됩니다.
* **macOS 경로**: `/Users/knetzmac2/.gemini/antigravity-cli`
* **Windows 경로**: `C:\Users\<UserName>\.gemini\antigravity-cli`

---

## 2. 스킬 (Skills) 구성 및 자동 발견

스킬(Skills)은 에이전트에게 특정 워크플로우나 반복 작업을 가르칠 수 있는 일종의 지침 플러그인입니다.

### 1) 스킬의 구조
스킬은 디렉토리 단위로 정의되며 반드시 아래 규칙을 만족해야 합니다.
```
skills/
└── <skill_name>/
    ├── SKILL.md        # 필수: YAML frontmatter + 마크다운 본문
    ├── scripts/        # 선택: 보조 실행 스크립트
    └── references/     # 선택: 대용량 추가 문서
```

#### `SKILL.md` 구성 예시
`SKILL.md`는 상단에 반드시 YAML 헤더(Frontmatter)로 이름과 설명을 명시해야 에이전트가 이를 인식하고 자동 매칭합니다.
```markdown
---
name: "run-docker-build"
description: "Docker를 사용하여 타겟 크로스 컴파일을 수행할 때 작동하는 스킬"
---

# Docker 크로스 컴파일 스킬 가이드
이 스킬이 로드되면 에이전트는 로컬에 설치된 docker 툴체인을 사용하여... 본문 지침(500라인 미만 권장).
```

### 2) 스킬 자동 발견 (Auto-Discovery)
스킬은 다음과 같은 예약된 디렉토리에 배치하면 **별도의 수동 등록 없이 자동으로 로드**됩니다.
* **프로젝트(작업 공간)별 스킬**: 프로젝트 루트 폴더의 `.agents/skills/`
* **글로벌 스킬 (모든 프로젝트 적용)**: `/Users/knetzmac2/.gemini/config/skills/`

> **실전 예시 (hello-helper)**:
> 현재 로컬 프로젝트의 `.agents/skills/hello-helper/` 경로에 헬퍼 스킬 및 스크립트를 구현하여 로드해 두었습니다:
> * [hello-helper SKILL.md](file:///Users/knetzmac2/Desktop/dd/.agents/skills/hello-helper/SKILL.md)
> * [greet.sh 헬퍼 스크립트](file:///Users/knetzmac2/Desktop/dd/.agents/skills/hello-helper/scripts/greet.sh)

---

## 3. 사용자 정의 서브에이전트 (Subagents) 등록 및 호출

`agy-cli` 환경에서 복잡한 임무나 병렬 조사를 처리하기 위해 메인 에이전트 외에 **전문성을 가진 하위 일꾼(서브에이전트)**을 직접 생성하고 조종하는 방법입니다.

이 작업은 크게 **① 정의(Define)**와 **② 호출/실행(Invoke)** 2단계로 진행됩니다.

---

### 1) [Step 1] 서브에이전트의 역할 정의 (`define_subagent`)
이 단계는 에이전트의 '종류(템플릿)'를 등록하는 작업입니다. 특정 프롬프트 권한과 도구(Read/Write)를 지정하여 메인 세션에 선언해 둡니다.

#### 🛠️ CLI 도구/API 호출 예시 (정의)
```json
{
  "name": "db-debugger",
  "description": "데이터베이스 성능 이슈를 분석하고 쿼리를 튜닝하는 에이전트",
  "system_prompt": "너는 DB 튜닝 전문가로서, 읽기/쓰기 도구를 활용해 스키마를 확인하고 인덱스 최적화 방안을 찾는다. 성능 분석 결과는 마크다운 표 형식으로 정리해서 보고해라.",
  "enable_write_tools": true,
  "enable_subagent_tools": true,
  "enable_mcp_tools": false
}
```

---

### 2) [Step 2] 정의된 서브에이전트 실제 호출 (`invoke_subagent`)
정의(Define)가 완료되어 목록에 등록된 서브에이전트에게 **실제 구체적인 명령(Prompt)을 내려서 일꾼을 스폰(Spawn)시키는 작업**입니다.

#### 🚀 호출 예시 (실행 지시)
```json
{
  "Subagents": [
    {
      "TypeName": "db-debugger",
      "Role": "데이터베이스 쿼리 튜너",
      "Prompt": "현재 프로젝트 내부의 schema.sql 파일을 분석하고, 사용자 조회 성능을 높일 수 있는 인덱스 생성 쿼리를 제안해줘."
    }
  ]
}
```
* **결과**: `db-debugger` 에이전트가 백그라운드 태스크로 구동되며, 주어진 프롬프트를 수행한 뒤 메인 에이전트에게 결과를 보고서 형태로 전달합니다.

---

### 3) 내장 기본 서브에이전트 (사전 정의 완료)
매번 정의하지 않아도 `invoke_subagent`로 언제든 호출해서 쓸 수 있는 기본 에이전트들입니다.
* `research`: 읽기 전용 툴체인을 탑재하고 코드베이스 조사, 웹 검색을 수행하는 정보 조사관.
* `self`: 부모의 툴체인 및 시스템 프롬프트 권한을 고스란히 상속받아 코드 작성/명령어 실행 등의 대리 업무를 수행하는 비서.

---

## 4. 플랜 (Plan) 모드에서의 모델 분할 활용 설정

`Plan` 모드는 큰 단위의 리팩토링이나 신규 프로젝트 빌드를 시작하기 전, 에이전트가 수행할 **실행 계획서(Plan Artifact)**를 먼저 작성하고 사용자의 컨펌을 받아 실행하는 정밀 모드입니다. 

효율적인 사용량 관리 및 토큰 한도 절약을 위해, **파일의 단순 읽기/쓰기 작업에는 가볍고 속도가 빠른 Flash 모델**을 지정하고, **고도의 사고와 추론 및 전체 계획 설계에는 Pro 또는 Claude Sonnet 모델**을 사용량(토큰 한도) 상황에 맞게 유동적으로 교체하는 구성을 제안합니다.

### ⚙️ 추천 모델 분할 구성 파일 (`.aider.conf.yml` 또는 `antigravity.json`)

#### 예시 A: [기본/추천] Gemini 3.5 Flash + Gemini Pro 분할 구성
무료 사용 쿼터가 넉넉하고 빠른 Flash 모델과 복잡한 분석용 Pro 모델을 분할 매핑하는 구성입니다.

```yaml
# 1. 파일 단순 조회 및 연구 (Research) -> Gemini 3.5 Flash (Low) 지정
research-model: gemini/gemini-3.5-flash

# 2. 코드 생성 및 단순 수정 작업 (Execution) -> Gemini 3.5 Flash (Low) 지정
execution-model: gemini/gemini-3.5-flash
execution-temperature: 0.0

# 3. 고도의 추론 및 전체 플래닝 설계 (Planning) -> Gemini 3.1 Pro (Low) 지정
plan-model: gemini/gemini-3.1-pro
plan-temperature: 0.2
```

#### 예시 B: Gemini Pro 토큰이 소진되어 Claude Sonnet 4.6 (Thinking) 모델로 긴급 교체하는 구성
Gemini Pro의 일일 쿼터 제한이 도달했을 때, 추론용 코어 모델만 Claude Sonnet으로 신속히 스위칭하는 설정입니다. (단순 IO는 계속 Flash 모델로 토큰 세이브)

```yaml
# 1. 단순 IO 및 파일 읽기/쓰기는 Flash 모델 유지로 토큰 사용 최소화
research-model: gemini/gemini-3.5-flash
execution-model: gemini/gemini-3.5-flash
execution-temperature: 0.0

# 2. 추론 핵심 모델만 Claude Sonnet 4.6 (Thinking) 모델로 상향 스위칭
plan-model: anthropic/claude-3-5-sonnet-20241022  # Claude Sonnet 4.6 (Thinking) 지정
plan-temperature: 0.3
```

---

## 5. 커스텀 규칙 (Rules) 추가 (AGENTS.md)

특정 스타일 가이드나 절대로 지켜야 하는 코딩 컨벤션 규칙이 있다면 `AGENTS.md` 파일에 기록하여 에이전트 행동을 바인딩합니다.

* **적용 위치**:
  * **전역 규칙**: `/Users/knetzmac2/.gemini/config/AGENTS.md`
  * **프로젝트(작업 공간) 규칙**: 프로젝트 루트 폴더 `.agents/AGENTS.md`

> **실전 예시 (AGENTS.md)**:
> 현재 로컬 프로젝트 루트 `.agents/AGENTS.md` 파일에 아래 규칙을 임의 정의하여 적용해 두었습니다.
> * [작업 공간용 AGENTS.md 설정](file:///Users/knetzmac2/Desktop/dd/.agents/AGENTS.md)
>   ```markdown
>   # Antigravity CLI Custom Rules (테스트용 규칙)
>
>   - [Rule 1] 모든 커밋 로그는 한글(Korean)로 통일하여 작성해야 한다.
>   - [Rule 2] 임시 스크립트나 예시 셸 스크립트는 항상 실행 권한(`chmod +x`)을 확보하여 배포한다.
>   - [Rule 3] 프로젝트 문서 및 설명서의 코드 블록에는 해당 플래그나 주석을 한글로 기술한다.
>   ```

