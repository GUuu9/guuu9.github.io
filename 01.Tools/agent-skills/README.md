# Agent Skills·Plugins

이 폴더에서 Ponytail·Archify·PixelFX 같은 스킬과 에이전트 플러그인을 전역으로 설치·업데이트·제거합니다. 프로젝트 저장소에 넣는 기능은 해당 프로젝트에서만 쓸 때 선택합니다.

## 스킬과 플러그인

- **Agent Skill**은 `SKILL.md`와 필요한 자료를 묶은 재사용 가능한 지침입니다. 호환되는 에이전트에는 공통 스킬 관리 도구로 사용자 전역 설치를 할 수 있습니다.
- **Plugin**은 스킬 외에 훅·MCP 연결 등 앱별 기능을 포함할 수 있습니다. 플러그인은 에이전트마다 설치 방식과 지원 기능이 달라, 해당 앱의 플러그인 관리자로 설치합니다.
- 같은 기능을 플러그인과 일반 스킬로 동시에 설치하지 않습니다. 중복 호출이나 서로 다른 버전이 노출될 수 있습니다.

## 전역 스킬 관리

[Vercel Skills CLI](https://github.com/vercel-labs/skills)는 Codex, Claude Code, Antigravity 등 지원 에이전트의 사용자 전역 위치에 스킬을 연결합니다. 기본 설치는 한 곳의 원본을 에이전트별 폴더에서 참조하는 심볼릭 링크 방식입니다. `--copy`는 링크를 사용할 수 없을 때만 선택합니다. 에이전트별 저장 위치가 다르므로 하나의 앱 경로를 모든 도구가 직접 읽는다고 가정하지 않습니다.

```bash
npx skills add <owner>/<repository> --skill <skill-name> --agent codex --agent claude-code --agent antigravity --global
npx skills list --global
npx skills update --global
npx skills remove --global <skill-name>
```

Windows는 PowerShell에서 같은 `npx` 명령을 사용합니다. `--agent`에는 실제로 설치해 사용하는 제품의 CLI 이름을 지정합니다. ChatGPT 앱의 Skills는 이 CLI가 설치하지 않으며, ChatGPT의 Skills 화면에서 설치하거나 ZIP을 업로드해 관리합니다. ChatGPT 기능의 이용 가능 여부는 계정·워크스페이스 정책에 따릅니다.

## 설치할 스킬

| 이름 | 전역 설치·사용·관리 |
| :--- | :--- |
| Ponytail | [스킬·플러그인 안내](./ponytail.md) |
| Archify | [전역 스킬 안내](./archify.md) |
| PixelFX | [전역 스킬 안내](./pixelfx.md) |

설치 전 출처와 권한·실행 내용을 확인합니다. 설치 경로·에이전트 지원은 해당 제품의 공식 안내와 Skills CLI 지원 목록을 다시 확인합니다.

[Vercel Skills CLI 명령·에이전트 목록](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) · [OpenAI Skills](https://help.openai.com/en/articles/20001066-skills-in-chatgpt).
