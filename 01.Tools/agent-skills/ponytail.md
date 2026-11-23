<!-- version: v1.0.0 -->
# Ponytail 스킬·플러그인

[Ponytail](https://github.com/DietrichGebert/ponytail)은 필요한 범위만 구현하고 변경 영향을 검토하도록 돕는 에이전트 지침입니다. 스킬은 여러 에이전트에 배포할 수 있고, Codex·Claude Code 플러그인은 해당 앱의 훅 등 통합 기능을 추가합니다.

## 공통 스킬로 전역 설치

Codex, Claude Code, Antigravity 등 Skills CLI가 지원하는 에이전트에 스킬을 사용자 전역으로 연결합니다. 이 방식은 `SKILL.md` 기능을 설치하며, Codex 플러그인의 훅은 설치하지 않습니다.

```bash
npx skills add DietrichGebert/ponytail --skill ponytail --agent codex --agent claude-code --agent antigravity --global
```

Antigravity 지원은 해당 버전의 [Skills CLI 에이전트 목록](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)에서 확인합니다. 설치 후 새 대화를 열고 `/skills` 또는 해당 앱의 스킬 목록에서 `ponytail`을 확인합니다. 사용 가능한 명령은 앱에 표시된 항목을 따릅니다.

## 앱 플러그인으로 설치

플러그인 통합 기능이 필요한 경우 공통 스킬과 같은 앱에 중복 설치하지 말고 앱의 플러그인 방식 하나를 사용합니다. Codex는 터미널에서 설치합니다.

```bash
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
codex plugin list
```

Codex에서 `/hooks`를 열고 Ponytail의 라이프사이클 훅을 확인·승인한 뒤 새 세션을 시작합니다. 플러그인 명령을 지원하지 않는 CLI 버전이면 Codex를 업데이트한 후 다시 확인합니다.

Claude Code 플러그인은 Claude Code 입력창에서 실행합니다.

```text
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

ChatGPT의 Skills는 Skills 화면에서 설치하거나 ZIP을 업로드해 관리합니다. Codex·Claude 플러그인 명령은 ChatGPT 입력창에서 실행하지 않습니다. ChatGPT에서 사용할 때는 `SKILL.md` 기반의 Skill로 등록합니다. 이용 가능 여부는 계정·워크스페이스 설정에 따릅니다.

## 사용·업데이트·제거

스킬을 호출할 때는 앱의 스킬 목록에서 실제 표시 이름과 호출 형식을 확인합니다. Codex 플러그인 스킬은 보통 `$ponytail:ponytail-review`처럼 네임스페이스를 포함합니다. Claude Code 플러그인은 제작자가 안내하는 `/ponytail-review` 등 명령을 제공합니다.

공통 Skills CLI 설치는 전역 목록·업데이트·제거 명령을 사용합니다.

```bash
npx skills list --global
npx skills update --global
npx skills remove --global ponytail
```

Codex 플러그인 제거는 아래와 같이 진행하고 Codex를 재시작합니다. Claude Code는 `/plugin`에서 플러그인을 관리합니다.

```bash
codex plugin remove ponytail@ponytail
```

설치·제거 후 다른 스킬, Codex 인증 정보, 프로젝트의 `AGENTS.md`를 일괄 삭제하지 않습니다. 훅에서 `node: command not found`가 나오면 비대화형 환경의 PATH를 확인합니다. [Ponytail 설치 안내](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md) · [명령 안내](https://github.com/DietrichGebert/ponytail#commands).
