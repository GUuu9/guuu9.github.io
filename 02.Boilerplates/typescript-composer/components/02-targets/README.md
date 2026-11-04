<!-- version: v0.1.1 -->
# 최종 조합 요소

| 결과 | 연결·마무리 책임 |
| :--- | :--- |
| [backend-webui](./backend-webui/README.md) | backend의 화면·자산 제공 |
| [web-app](./web-app/README.md) | 웹 UI의 API 설정·정적 배포 |
| [web-phaser](./web-phaser/README.md) | 브라우저 저장·게임 웹 배포 |
| [electron-app](./electron-app/README.md) | 일반 화면의 IPC 연결·앱 빌드 |
| [electron-phaser](./electron-phaser/README.md) | 게임의 IPC·파일 저장 연결·앱 빌드 |

기본 구조나 독립 Service를 복제하지 않고 [base](../01-base/README.md)·[features](../03-features/README.md)의 선행 구성품에 연결합니다. 결과별 순서는 [전체 적용 순서](../README.md)에 있습니다.
