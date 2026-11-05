<!-- version: v1.0.0 -->
# 구성품 목록

관리자/AI용입니다. 사용자는 묶음 README의 compose와 앱 feature 명령만 사용합니다. [설계](../docs/maintainers/01-composition-design.md)·[작성 규칙](../docs/maintainers/03-feature-authoring.md)을 먼저 확인합니다.

| 순서 | 구성 |
| :--- | :--- |
| [01-base/flutter](01-base/flutter/README.md) | 공통 실행 뼈대·DI·화면/수명 계약 |
| [02-targets](02-targets/README.md) | Android·iOS·공용 출력 |
| [03-features](03-features/README.md) | 선택 기능·사용 문서·테스트 |

실제 기능 적용은 target 생성 후 앱의 명령으로 수행합니다. 폴더 번호는 관리/탐색 순서이며 기능 파일 수동 복사가 사용자 절차가 아닙니다.
