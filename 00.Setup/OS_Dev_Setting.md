<!-- version: v2.0.1 -->
# OS별 개발 환경 설정 안내

새 PC의 최초 설치와 기존 PC의 재설정을 안내합니다. Setup은 **필수·선택 항목과 진행 순서**, Tools는 **도구별 OS 설치·권한·환경 변수·확인·일상 사용·업데이트·복귀**를 관리합니다. 기존 프로젝트를 다시 준비하는 경우에만 해당 단계에 “복원”이라는 표현을 사용합니다.

| 사용하는 환경 | 시작 문서 |
| :--- | :--- |
| macOS Apple Silicon | [칩·지원 조건 확인](./macOS_AppleSilicon_Dev_Setting.md) → [공통 설정](./macOS_Common_Dev_Setting.md) |
| macOS Intel | [지원 제한 확인](./macOS_Intel_Dev_Setting.md) → [공통 설정](./macOS_Common_Dev_Setting.md) |
| Windows | [Windows 설정](./Windows_Dev_Setting.md) |
| Ubuntu / Debian | [Linux 설정](./Linux_Dev_Setting.md) |

## 진행 순서

1. OS·CPU·셸·기존 도구와 개인 설정을 확인합니다.
2. OS별 **필수 설정**을 순서대로 진행하고 각 Tools 문서에서 설치·경로를 확인합니다.
3. **선택 설정**에서 사용할 작업만 고릅니다. 선택한 작업의 선행 도구는 먼저 설치합니다.
4. 새 터미널·IDE에서 설치 도구의 경로·버전을 확인합니다.
5. 새 프로젝트는 [유형별 시작 가이드](../02.Boilerplates/README.md#처음-실행하는-순서), 기존 프로젝트는 README·CI·버전 파일·잠금 파일을 기준으로 환경을 준비합니다.

모든 PC에 Node·Python·Flutter·Rust·Docker를 설치할 필요는 없습니다. macOS는 보조 패키지용 Homebrew를 기본 준비 항목으로 두고 각 도구는 공식 권장 설치 방식을 따릅니다. rbenv처럼 Homebrew를 권장하면 brew를 사용하고, nvm처럼 brew를 지원하지 않는 도구는 공식 독립 설치를 사용합니다. 도구 자체 갱신과 프로젝트 SDK·의존성 변경을 구분하며 설치 중 일괄 업데이트하지 않습니다. Windows와 WSL도 별도 환경으로 관리합니다.

## 완료 기준과 문서 이용

설치 확인과 프로젝트 실행·테스트·빌드·배포 성공은 별개입니다. 설치·실행을 실제 수행하지 않은 항목은 검증 완료로 기록하지 않습니다. [Tools 목록](../01.Tools/README.md)에서 도구별 설치·관리·제거 안내를 찾을 수 있습니다.

전체 문서는 공통 웹 레이아웃을 사용하며 CSS 미지원 환경에서도 원문을 읽을 수 있습니다. [Markdown 작성 가이드](../01.Tools/markdown-style.md#웹-디자인-관리)를 따릅니다.
