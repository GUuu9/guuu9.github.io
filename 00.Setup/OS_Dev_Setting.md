<!-- version: v1.4.0 -->
# OS별 개발 환경 설정 안내

초기화 후 기존 프로젝트의 버전에 맞춰 개발 환경을 복원하고 업데이트할 때 사용하는 문서입니다. 사용하는 OS와 칩에 맞는 문서부터 진행합니다.

| 문서 | 적용 대상 |
| :--- | :--- |
| [macOS Apple Silicon](./macOS_AppleSilicon_Dev_Setting.md) | Apple Silicon Mac의 기본 도구 초기 설치 |
| [macOS Intel](./macOS_Intel_Dev_Setting.md) | Intel Mac의 기본 도구 초기 설치 |
| [macOS 공통 개발 도구 설정](./macOS_Common_Dev_Setting.md) | 칩별 기본 설정 후 프로젝트 없이 진행하는 도구 초기 설치 |
| [macOS 프로젝트 복원](./macos-project-restore.md) | 초기 설치 후 프로젝트별 버전·의존성·실행·실기기 확인 |
| [macOS 업데이트](./macos-update.md) | 설치된 OS·도구와 프로젝트 SDK·의존성 변경 |
| [Windows](./Windows_Dev_Setting.md) | Windows 11 x64·PowerShell 기준 개발 환경 복원·업데이트 |
| [Linux](./Linux_Dev_Setting.md) | Ubuntu / Debian·bash 기준 개발 환경 복원·업데이트 |

기존 프로젝트의 README·버전 지정·잠금 파일을 우선합니다. 과거 통합 문서는 Git 기록에서 확인할 수 있습니다.

macOS는 **칩별 기본 설정 → 공통 초기 설치**까지만 먼저 진행합니다. 프로젝트를 내려받은 뒤 복원 문서에서 해당 유형만 선택하며 업데이트 문서는 초기 설치 순서에 포함하지 않습니다.
