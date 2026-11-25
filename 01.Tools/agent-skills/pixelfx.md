<!-- version: v1.0.0 -->
# PixelFX 전역 스킬

PixelFX는 게임용 픽셀 아트 효과를 찾고, 색상이나 움직임을 조정하고, 스프라이트 시트로 내보내는 스킬입니다. [PixelFX 공식 저장소](https://github.com/patch-gg/pixelfx)

## 설치와 확인

Node.js와 npm이 설치된 PC의 터미널에서 실행합니다. 아래 예시는 현재 사용자 계정의 Codex와 Claude Code에 전역으로 설치합니다. 하나만 사용한다면 해당 앱의 `--agent` 옵션만 남깁니다. [Skills CLI 공식 안내](https://github.com/vercel-labs/skills)

```bash
npx skills add patch-gg/pixelfx --skill pixelfx --agent codex --agent claude-code --global
npx skills list --global
```

목록에서 `pixelfx`를 확인한 뒤 에이전트를 다시 시작합니다.

## 사용과 관리

에이전트에 “pixelfx 스킬로 픽셀 아트 불꽃 효과를 찾아 스프라이트 시트로 내보내줘”처럼 요청합니다. 전역으로 설치되는 것은 에이전트 스킬입니다. 효과 렌더링에는 PixelFX 라이브러리와 Node.js가 필요하며, 게임에서 효과 코드를 직접 사용할 때는 프로젝트 의존성을 별도로 관리합니다. [PixelFX 스킬 원문](https://github.com/patch-gg/pixelfx/blob/main/skills/pixelfx/SKILL.md)

```bash
npx skills update --global pixelfx
npx skills remove --global pixelfx
```
