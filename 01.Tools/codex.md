<!-- version: v1.0.0 -->
# Codex CLI·Ponytail 관리

Codex CLI의 OS별 초기 설치는 [OS별 Setup](../00.Setup/OS_Dev_Setting.md)을 따릅니다. 이 문서는 개인 PC의 스킬 추가·호출·업데이트·복귀를 다룹니다. Windows 네이티브와 WSL은 설치·인증·설정 위치가 별도이므로 사용할 환경에서 각각 확인합니다.

## Ponytail 스킬 추가

[Ponytail](https://github.com/DietrichGebert/ponytail)은 기존 코드·표준 기능을 먼저 재사용하고 필요한 변경에 집중하도록 돕는 외부 스킬입니다. 제작자의 Codex 설치 안내에 따라 스킬과 라이프사이클 훅을 포함한 플러그인으로 설치합니다. macOS·Linux 터미널 또는 Windows PowerShell의 임의 디렉터리에서 일반 사용자 권한으로 진행합니다. [OS별 Setup](../00.Setup/OS_Dev_Setting.md)에서 Codex 설치·인증과 Node.js 설치를 먼저 완료합니다.

```bash
codex --version
node --version
codex plugin --help
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
codex plugin list
```

`plugin` 하위 명령이 없으면 아래 Codex CLI 업데이트 안내를 적용한 뒤 다시 확인합니다. 이미 설치되어 있으면 중복 설치하지 않고 `codex plugin list`에서 상태를 확인합니다. 기존 프로젝트의 `AGENTS.md`를 Ponytail 파일로 교체할 필요는 없습니다.

1. `codex`를 실행하고 `/hooks`에서 Ponytail이 제공하는 두 라이프사이클 훅의 내용을 검토한 뒤 신뢰하도록 설정합니다. 이는 제작자 설치 안내에 포함된 활성화 단계입니다.
2. 새 스레드를 시작합니다. 데스크톱 앱에서도 사용하려면 앱을 완전히 종료했다가 다시 엽니다.
3. Codex CLI에서 `/skills` 또는 `$`를 입력해 Ponytail 스킬 목록을 확인합니다. 예를 들어 아래 문장을 **Codex 입력창**에 입력하면 현재 변경 내용을 검토합니다. 셸 명령으로 실행하지 않습니다.

```text
$ponytail:ponytail-review 현재 커밋하지 않은 변경 내용을 검토해줘.
```

제작자의 공통 문서에 나오는 `/ponytail-review`는 Codex CLI·IDE에서는 위와 같은 플러그인 네임스페이스가 붙은 스킬로 호출합니다. 실제 목록에 표시된 스킬을 선택합니다. [제작자 명령 안내](https://github.com/DietrichGebert/ponytail#commands) · [OpenAI 스킬 호출 안내](https://learn.chatgpt.com/docs/build-skills#how-chatgpt-and-codex-use-skills).

훅에서 `node: command not found`가 나오면 **비대화형 셸의 PATH**에도 Node가 있는지 확인합니다. nvm은 대화형 터미널에서만 초기화될 수 있으므로, 터미널의 `node --version` 성공만으로 앱·훅에서 인식된다고 판단하지 않습니다. 실행 환경의 PATH를 조정한 뒤 Codex를 재시작하고 훅 오류가 사라지는지 확인합니다. [제작자 선행 조건·Codex 설치 안내](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md#codex).

제거가 필요하면 개인 설정을 별도 보관한 뒤 개인 PC 터미널에서 `codex plugin remove ponytail@ponytail`을 실행하고 Codex를 재시작합니다. 이 명령은 플러그인과 로컬 캐시를 제거합니다. 기존 프로젝트 파일·Codex 인증정보를 삭제하는 절차로 사용하지 않습니다.

확인일: 2026-10-30. 제작자 문서와 로컬 `codex-cli 0.166.0`의 설치·목록·제거 명령 도움말을 확인했습니다. 실제 플러그인 설치·훅 실행은 이번 문서 작성에서 수행하지 않았습니다.

## Codex CLI 업데이트·복귀

업데이트 전 `codex --version`과 설치 방식을 기록하고 개인 설정·필요한 작업 기록을 백업합니다. 인증 파일·토큰을 저장소에 넣지 않습니다. 독립 설치는 OS별 Setup에서 사용한 공식 설치 스크립트를 다시 실행합니다. npm 설치를 유지한다면 해당 Node 환경에서 `npm install -g @openai/codex@latest`로 갱신합니다. 설치 방식을 중복 적용하지 않습니다.

새 터미널에서 버전·인증·스킬 목록과 필요한 훅을 확인합니다. 복귀가 필요하면 이전 공식 릴리스 설치 파일 또는 npm의 기록한 버전을 사용하고 기존 설정과 호환되는지 확인합니다. CLI 업데이트와 Ponytail 플러그인 업데이트는 별개입니다. 플러그인 버전을 변경할 때는 제작자 릴리스·설치 안내와 현재 `codex plugin --help`를 확인하고 변경 전 버전·개인 설정을 보관합니다.

[OpenAI 공식 CLI 안내](https://learn.chatgpt.com/docs/codex/cli) · [OpenAI 스킬 안내](https://learn.chatgpt.com/docs/build-skills) · [Ponytail 공식 릴리스](https://github.com/DietrichGebert/ponytail/releases).
