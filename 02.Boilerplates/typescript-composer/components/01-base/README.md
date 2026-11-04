<!-- version: v0.1.0 -->
# 기본 조합 요소

[frontend](./frontend/README.md)·[Phaser](./phaser/README.md)는 화면 구조의 대안이며 [electron-backend](./electron-backend/README.md)는 Main·Preload·IPC 실행 구조입니다. 기준 뼈대에 필요한 구조를 붙인 뒤 targets의 결과 형태를 선택합니다.

각 구조의 DI·진입점·수명주기는 이곳에 유지합니다. 새 기본 구조는 기존 결과의 이름이 아니라 제공하는 화면·실행 영역을 기준으로 추가합니다. [전체 적용 순서](../README.md)를 따릅니다.
