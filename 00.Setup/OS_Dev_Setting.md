<!-- version: v1.6.0 -->
# OS별 개발 환경 설정 안내

초기화 후 기존 프로젝트의 버전에 맞춰 개발 환경을 복원하고 업데이트할 때 사용하는 문서입니다. 사용하는 OS와 칩에 맞는 문서부터 진행합니다.

| 문서 | 적용 대상 |
| :--- | :--- |
| [macOS Apple Silicon](./macOS_AppleSilicon_Dev_Setting.md) | Apple Silicon Mac의 기본 도구 초기 설치 |
| [macOS Intel](./macOS_Intel_Dev_Setting.md) | Intel Mac의 기본 도구 초기 설치 |
| [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md) | 칩별 기본 설정 후 프로젝트 없이 진행하는 도구 초기 설치 |
| [Windows](./Windows_Dev_Setting.md) | Windows 11 x64·PowerShell 기준 도구 초기 설치·프로젝트 복원·업데이트 |
| [Linux](./Linux_Dev_Setting.md) | Ubuntu / Debian x86_64·bash 기준 도구 초기 설치·프로젝트 복원·업데이트 |

> [!IMPORTANT]
> 기존 프로젝트의 README·버전 지정·잠금 파일을 우선합니다. 과거 통합 문서는 Git 기록에서 확인할 수 있습니다.

macOS는 **칩별 기본 설정 → 공통 초기 설치**까지만 먼저 진행합니다. 프로젝트를 내려받은 뒤에는 [공통 문서의 도구별 안내](./macOS_Common_Dev_Setting.md#프로젝트-작업-안내)에서 필요한 Tools 가이드를 선택합니다. OS·앱 갱신은 같은 문서의 업데이트 구역을 따르며 초기 설치 순서에 포함하지 않습니다.

macOS 도구는 공식 독립 설치 스크립트·공식 배포판으로 설치하고 도구별 자체 업데이트를 사용합니다. 보조 패키지용 Homebrew는 공통 초기 설정에서 먼저 준비합니다. 기존 설치 관리와 과거 Intel 설치기 절차는 [Homebrew 가이드](../01.Tools/brew.md)에 보존하며 Intel의 설치·패키지 지원 제한을 구분합니다.

모든 OS는 **기본 환경·폰트 → VS Code·한국어 → Node → uv → FVM·Android Studio → C/C++·Rust·Unity → Docker → Codex·Ponytail → 초기 설치 확인** 순서로 필요한 도구만 준비합니다. 프로젝트를 받은 뒤에는 각 문서의 프로젝트 작업 안내에서 Tools로 이동합니다. Windows의 WSL은 별도 Linux 환경이며 도구·인증·의존성을 Windows와 혼용하지 않습니다.

공통 앱 설정은 [편집기 언어·폰트](../01.Tools/editor-setup.md), 스킬 추가와 관리는 [Codex·Ponytail](../01.Tools/codex.md) 한 곳에서 관리합니다.

## Setup 웹 디자인과 원문 보기

GitHub Pages의 Jekyll 빌드에서는 Setup 6개 문서에만 전용 레이아웃·CSS를 적용합니다. 화면 목차·본문 폭·표/코드의 가로 스크롤·밝은/어두운 모드·인쇄 스타일을 제공하며, CSS 없이도 제목·표·목록·명령을 읽을 수 있습니다. 이모지·외부 폰트·JavaScript는 추가하지 않습니다.

- 스타일: [setup.css](./assets/setup.css)
- 웹 레이아웃: [setup.html](../_layouts/setup.html)
- 빌드 설정: [_config.yml](../_config.yml)

웹 진입 경로는 `/00.Setup/OS_Dev_Setting.html`입니다. `baseurl`이 있는 프로젝트 사이트에서는 해당 접두 경로를 붙입니다. Setup 안의 문서 링크는 빌드 시 HTML 링크로 변환하고, 다른 파트로 나가는 링크는 GitHub 원문으로 연결합니다. 설정의 `setup_source_url`은 저장소·브랜치가 바뀌면 함께 수정합니다. 개인 보관용 `issues/`는 웹 빌드에서 제외합니다.

GitHub 저장소·일반 Markdown 뷰어에서는 기존 `.md`를 그대로 읽으며 이 CSS는 적용되지 않습니다. Jekyll/GitHub Pages 환경이 준비된 경우에만 레이아웃이 적용됩니다. 이미 Jekyll을 사용하는 로컬 환경은 저장소 루트에서 `jekyll build --destination /private/tmp/setup-site-preview`로 생성 후 결과를 확인할 수 있습니다. 이 문서 변경은 사이트 게시나 PC에 Jekyll을 설치하는 절차를 실행하지 않습니다.

공식 참고: [GitHub Pages와 Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll), [Markdown front matter 생략 플러그인](https://github.com/benbalter/jekyll-optional-front-matter), [상대 링크 변환](https://github.com/benbalter/jekyll-relative-links).
