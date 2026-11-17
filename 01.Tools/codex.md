<!-- version: v1.2.0 -->
# Codex CLI·Ponytail·Archify 관리

Codex CLI의 OS별 설치·인증·스킬 추가·호출·업데이트·복귀를 다룹니다. 명령은 개인 PC의 임의 폴더에서 일반 사용자로 실행하며 npm 방식은 먼저 [Node 환경](./nvm.md)을 준비합니다. Windows 네이티브와 WSL은 설치·인증·설정 위치가 별도이므로 사용할 환경에서 각각 확인합니다.

## macOS·Linux Codex CLI 설치

Node 버전 전환과 별개로 사용할 수 있도록 [OpenAI 공식 안내](https://learn.chatgpt.com/docs/codex/cli)의 독립 설치 방식을 사용합니다.

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

설치 안내에 따라 PATH를 적용하고 새 터미널에서 확인합니다.

```bash
codex --version
codex
```

처음 실행할 때 안내에 따라 인증합니다. API 키나 토큰을 셸 설정·저장소에 직접 기록하지 않습니다. 기존 npm 설치를 유지하려면 `npm install -g @openai/codex`도 가능하지만 nvm의 Node 버전에 따라 전역 패키지 설치 위치가 달라집니다. 두 설치 방식을 중복 적용하지 않습니다.

#### Ponytail·Archify 스킬 추가

위 Codex 인증과 Node 설치를 마친 뒤 [Ponytail 안내](#ponytail-스킬-추가) 또는 [Archify 안내](#archify-스킬-추가)를 진행합니다.

## Windows Codex CLI 설치

선택한 Node 환경에서 [OpenAI 공식 CLI 안내](https://learn.chatgpt.com/docs/codex/cli)의 npm 설치 방식을 사용합니다. Windows 네이티브 PowerShell에서 실행합니다.

```powershell
npm install -g @openai/codex
codex --version
codex
```

처음 실행할 때 인증합니다. PowerShell 정책으로 `npm.ps1`·`codex.ps1`이 차단되면 각각 `npm.cmd`·`codex.cmd`를 사용합니다. nvm으로 Node를 바꾸면 전역 설치가 보이지 않을 수 있으므로 설치한 Node 버전·경로를 기록합니다. API 키·토큰을 저장소에 기록하지 않습니다.

Node 설치·Codex 인증 후 [Ponytail 안내](#ponytail-스킬-추가) 또는 [Archify 안내](#archify-스킬-추가)를 진행합니다.

## Ponytail 스킬 추가

[Ponytail](https://github.com/DietrichGebert/ponytail)은 기존 코드·표준 기능을 먼저 재사용하고 필요한 변경에 집중하도록 돕는 외부 스킬입니다. 제작자의 Codex 설치 안내에 따라 스킬과 라이프사이클 훅을 포함한 플러그인으로 설치합니다. macOS·Linux 터미널 또는 Windows PowerShell의 임의 디렉터리에서 일반 사용자 권한으로 진행합니다. 위 Codex 설치·인증과 [Node.js 설치](./nvm.md)를 먼저 완료합니다.

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

확인일: 2026-10-30. 제작자 문서와 `codex-cli 0.166.0`의 설치·목록·제거 명령을 확인했습니다.

## Archify 스킬 추가

[Archify](https://github.com/tt-a1i/archify)는 코드베이스·요구사항·프롬프트를 분석해 인터랙티브한 독립형 HTML/SVG 다이어그램과 원페이지 설명서(one-page explainer)를 생성하는 에이전트 스킬입니다. 시스템 아키텍처, 워크플로, 시퀀스, 데이터 흐름, 상태 전이, ERD, 클래스, 타임라인 및 변경 비교(`archify compare`) 생성을 지원합니다.

위 Codex CLI 설치·인증과 [Node.js(npx) 환경](./nvm.md)을 먼저 준비합니다.

### 1. 설치와 선행 조건

스킬 패키지 도구(`skills`)를 사용해 Codex용 전역 스킬로 설치합니다. macOS·Linux 터미널 또는 Windows PowerShell에서 실행합니다.

```bash
npx -y skills add tt-a1i/archify --skill archify --agent codex --global --copy --yes
```

간편형 전역 설치는 아래 명령도 가능합니다.

```bash
npx skills add tt-a1i/archify -g
```

영구 설치 없이 1회성으로 사용하려면 임시 실행 명령을 사용합니다.

```bash
npx skills use tt-a1i/archify@archify --agent codex
```

### 2. 설치 상태 확인

Codex CLI를 실행하고 `/skills` 또는 `$`를 입력해 등록된 스킬 목록에 `archify`가 나타나는지 확인합니다.

```bash
codex
```

### 3. 기본 사용법

Codex 입력창에서 `$archify` 또는 자연어로 다이어그램 생성을 지시합니다. 셸 명령이 아니므로 **Codex 입력창**에 입력합니다.

```text
$archify 현재 저장소의 구조를 분석해서 인터랙티브 HTML 아키텍처 다이어그램으로 그려줘.
```

```text
$archify 사용자 인증 및 토큰 재발급 흐름을 시퀀스 다이어그램 HTML 파일로 작성해줘.
```

실행이 완료되면 독립형 `.html` 파일(예: `architecture.html`)이 프로젝트에 생성됩니다. 생성된 파일은 브라우저에서 열어 노드 검색, 상하류 링크 추적, 다크·라이트 테마 전환, 정적/동적 토글, SVG·PNG 내보내기를 바로 사용할 수 있습니다.

### 4. 업데이트·제거

최신 버전으로 업데이트하려면 전역 설치 명령을 다시 실행하거나 업데이트 명령을 사용합니다.

```bash
npx skills update archify -g
```

제거하려면 스킬 제거 명령을 실행합니다. 기존 프로젝트 파일이나 Codex 인증 정보는 삭제되지 않습니다.

```bash
npx skills remove archify -g
```

확인일: 2026-11-17. [공식 저장소](https://github.com/tt-a1i/archify)의 설치 안내와 `skills` CLI 명령을 확인했습니다.

## Codex CLI 업데이트·복귀

업데이트 전 `codex --version`과 설치 방식을 기록하고 개인 설정·필요한 작업 기록을 백업합니다. 인증 파일·토큰을 저장소에 넣지 않습니다. 독립 설치는 위 공식 설치 스크립트를 다시 실행합니다. npm 설치를 유지한다면 해당 Node 환경에서 `npm install -g @openai/codex@latest`로 갱신합니다. 설치 방식을 중복 적용하지 않습니다.

새 터미널에서 버전·인증·스킬 목록과 필요한 훅을 확인합니다. 복귀가 필요하면 이전 공식 릴리스 설치 파일 또는 npm의 기록한 버전을 사용하고 기존 설정과 호환되는지 확인합니다. CLI 업데이트와 Ponytail·Archify 등 외부 스킬 업데이트는 별개입니다. 스킬 버전을 변경할 때는 각 제작자 릴리스·설치 안내를 확인하고 변경 전 버전·개인 설정을 보관합니다.

[OpenAI 공식 CLI 안내](https://learn.chatgpt.com/docs/codex/cli) · [OpenAI 스킬 안내](https://learn.chatgpt.com/docs/build-skills) · [Ponytail 공식 릴리스](https://github.com/DietrichGebert/ponytail/releases) · [Archify 공식 저장소](https://github.com/tt-a1i/archify).

제거 후 숨김 설정·캐시·셸 초기화 항목까지 정리하려면 [도구별 제거·잔여 파일 관리](./uninstall-cleanup.md)를 함께 확인합니다.
