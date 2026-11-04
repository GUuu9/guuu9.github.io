<!-- version: v0.2.0 -->
# 선택 기능

| 분류 | 관리 대상 | 현재 구성 |
| :--- | :--- | :--- |
| communications | 외부 통신 경계·연결 수명 | common·[TCP](./communications/tcp/README.md)·[UDP](./communications/udp/README.md)·[MQTT](./communications/mqtt/README.md)·[Socket.IO](./communications/socket-io/README.md) |
| [services](./services/README.md) | 파일·DB·외부 API I/O | game-persistence |
| [utils](./utils/README.md) | 상태·I/O 없는 독립 순수 함수 | 아직 별도 구성품 없음 |
| [core](./core/README.md) | 선택적으로 추가할 기반 기능 | 아직 별도 구성품 없음 |

새 기능은 실제로 필요한 시점에 해당 분류 아래 기능명 폴더로 추가합니다. 대상 프로젝트의 폴더 위치와 구성품 분류는 다를 수 있습니다. 예를 들어 통신 구현은 src/backend/core로 복사해도 communications에서 관리합니다. 빈 구현·예제용 기능을 미리 추가하지 않습니다.

각 기능의 선행 조건과 적용 순서를 명시하고 결과 형태와 무관하게 추가·제거할 수 있도록 합니다. 플랫폼별 연결부는 targets에, 실제 독립 처리는 해당 features 구성품에 둡니다.
