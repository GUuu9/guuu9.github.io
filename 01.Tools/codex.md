<!-- version: v2.0.1 -->
# Codex CLI 설치·관리

Codex CLI의 설치·인증·업데이트·복귀를 다룹니다. Ponytail·Archify 등 스킬과 플러그인은 [Agent Skills·Plugins](./agent-skills/README.md)에서 에이전트별 전역 설치와 관리를 확인합니다.

## macOS·Linux

[OpenAI 공식 설치 안내](https://learn.chatgpt.com/docs/codex/cli)의 독립 설치 방식을 사용합니다. Node 버전 전환과 별도로 Codex CLI를 사용할 수 있습니다.

설치 스크립트는 실행 환경의 CPU 아키텍처에 맞는 패키지를 선택합니다. 직접 릴리스 파일을 받는 Intel Mac은 `x86_64-apple-darwin` 빌드를 선택하고 Apple Silicon용 `aarch64-apple-darwin` 빌드는 사용하지 않습니다. [공식 Codex 릴리스](https://github.com/openai/codex/releases)

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex --version
codex
```

처음 실행할 때 안내에 따라 인증합니다. API 키나 토큰을 셸 설정·저장소에 기록하지 않습니다. 기존 npm 설치를 유지하려면 `npm install -g @openai/codex`도 가능하지만 nvm의 Node 버전에 따라 전역 패키지 위치가 달라집니다. 설치 방식을 중복 적용하지 않습니다.

## Windows

PowerShell에서 [OpenAI 공식 CLI 안내](https://learn.chatgpt.com/docs/codex/cli)의 npm 설치 방식을 사용합니다.

```powershell
npm install -g @openai/codex
codex --version
codex
```

처음 실행할 때 인증합니다. PowerShell 정책으로 `npm.ps1`·`codex.ps1`이 차단되면 각각 `npm.cmd`·`codex.cmd`를 사용합니다. nvm으로 Node를 바꾸면 전역 설치가 보이지 않을 수 있으므로 설치한 Node 버전·경로를 기록합니다. API 키·토큰을 저장소에 기록하지 않습니다.

## 업데이트·복귀·제거

업데이트 전 `codex --version`과 설치 방식을 기록하고 개인 설정·필요한 작업 기록을 백업합니다. 독립 설치는 공식 설치 스크립트를 다시 실행합니다. npm 설치는 해당 Node 환경에서 `npm install -g @openai/codex@latest`로 갱신합니다. 새 터미널에서 버전·인증·사용할 스킬을 확인합니다.

복귀가 필요하면 이전 공식 릴리스 설치 파일 또는 npm의 기록한 버전을 사용하고 개인 설정과 호환되는지 확인합니다. 제거 후 설정·캐시 정리가 필요하면 [도구별 제거·잔여 파일 관리](./uninstall-cleanup.md)를 참고합니다.

[OpenAI Codex CLI](https://learn.chatgpt.com/docs/codex/cli) · [Codex 스킬 안내](https://learn.chatgpt.com/docs/build-skills).
