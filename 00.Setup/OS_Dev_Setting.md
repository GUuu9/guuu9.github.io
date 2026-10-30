<!-- version: v1.5.0 -->
# OS별 개발 환경 설정 안내

초기화 후 기존 프로젝트의 버전에 맞춰 개발 환경을 복원하고 업데이트할 때 사용하는 문서입니다. 사용하는 OS와 칩에 맞는 문서부터 진행합니다.

| 문서 | 적용 대상 |
| :--- | :--- |
| [macOS Apple Silicon](./macOS_AppleSilicon_Dev_Setting.md) | Apple Silicon Mac의 기본 도구 초기 설치 |
| [macOS Intel](./macOS_Intel_Dev_Setting.md) | Intel Mac의 기본 도구 초기 설치 |
| [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md) | 칩별 기본 설정 후 프로젝트 없이 진행하는 도구 초기 설치 |
| [Windows](./Windows_Dev_Setting.md) | Windows 11 x64·PowerShell 기준 도구 초기 설치·프로젝트 복원·업데이트 |
| [Linux](./Linux_Dev_Setting.md) | Ubuntu / Debian x86_64·bash 기준 도구 초기 설치·프로젝트 복원·업데이트 |

기존 프로젝트의 README·버전 지정·잠금 파일을 우선합니다. 과거 통합 문서는 Git 기록에서 확인할 수 있습니다.

macOS는 **칩별 기본 설정 → 공통 초기 설치**까지만 먼저 진행합니다. 프로젝트를 내려받은 뒤에는 [공통 문서의 도구별 안내](./macOS_Common_Dev_Setting.md#프로젝트-작업-안내)에서 필요한 Tools 가이드를 선택합니다. OS·앱 갱신은 같은 문서의 업데이트 구역을 따르며 초기 설치 순서에 포함하지 않습니다.

macOS 도구는 공식 독립 설치 스크립트·공식 배포판으로 설치하고 도구별 자체 업데이트를 사용합니다. Homebrew는 초기 설정의 필수 단계가 아니며 기존 설치 관리와 과거 Intel 설치기 절차는 [Tools의 선택용 가이드](../01.Tools/brew.md)에 보존합니다.

모든 OS는 **기본 환경·폰트 → VS Code·한국어 → Node → uv → FVM·Android Studio → C/C++·Rust·Unity → Docker → Codex·Ponytail → 초기 설치 확인** 순서로 필요한 도구만 준비합니다. 프로젝트를 받은 뒤에는 각 문서의 프로젝트 작업 안내에서 Tools로 이동합니다. Windows의 WSL은 별도 Linux 환경이며 도구·인증·의존성을 Windows와 혼용하지 않습니다.

공통 앱 설정은 [편집기 언어·폰트](../01.Tools/editor-setup.md), 스킬 추가와 관리는 [Codex·Ponytail](../01.Tools/codex.md) 한 곳에서 관리합니다.
