<!-- version: v1.0.0 -->
# Archify 전역 스킬

[Archify](https://github.com/tt-a1i/archify)는 에이전트가 프로젝트·요구사항을 바탕으로 인터랙티브한 HTML 다이어그램과 설명 페이지를 생성하는 스킬입니다.

## 설치와 확인

Node.js와 npm 실행 환경을 준비합니다. [nvm 안내](../nvm.md)를 참고합니다. 다음 명령은 스킬을 사용자 전역 범위에 설치하며 프로젝트 파일은 변경하지 않습니다.

```bash
npx -y skills@latest add https://archify.si --skill archify --agent codex --agent claude-code --global --yes
```

Windows PowerShell에서도 같은 `npx` 명령을 실행할 수 있습니다. Antigravity 등 다른 에이전트는 [Skills CLI의 지원 목록](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)에 이름이 있는지 확인한 후 `--agent` 값을 추가합니다.

설치 뒤 에이전트를 새로 시작하고 스킬 목록에 `archify`가 표시되는지 확인합니다.

## 사용

에이전트 입력창에서 `$archify`를 호출하거나 자연어로 요청합니다.

```text
$archify 현재 저장소 구조를 분석해 인터랙티브 HTML 아키텍처 다이어그램으로 그려줘.
```

```text
$archify 사용자 인증과 토큰 재발급 흐름을 시퀀스 다이어그램으로 만들어줘.
```

결과 HTML은 프로젝트 폴더에 생성됩니다. 브라우저에서 열어 확인합니다.

## 업데이트·제거

사용자 전역에 설치된 스킬을 업데이트하거나 제거합니다.

```bash
npx skills update --global archify
npx skills remove --global archify
```

ChatGPT에서는 Skills 화면에서 스킬을 설치하거나 업로드합니다. Skills CLI의 전역 경로가 ChatGPT 웹 앱과 공유된다고 가정하지 않습니다. ChatGPT 업로드·공유 기능은 계정과 워크스페이스 설정에 따릅니다. [ChatGPT Skills 안내](https://help.openai.com/en/articles/20001066-skills-in-chatgpt).
