<!-- version: v0.1.0 -->
# Service 기능

현재 [게임 파일 저장](./game-persistence/README.md)을 제공합니다. 파일·DB·외부 API 접근을 독립 기능 단위로 추가합니다. 경로·클라이언트·설정은 생성자나 함수 인자로 받고 Electron·화면·HTTP 객체는 Service에 주입하지 않습니다. 오류 전달·동시 작업·데이터 보존·복귀도 구성품 안에서 관리합니다.
