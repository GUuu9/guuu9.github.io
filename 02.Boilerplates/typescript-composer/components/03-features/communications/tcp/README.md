<!-- version: v0.1.0 -->
# TCP 연결 구성품

선행: 기준 뼈대 → 통신 메시지 구성품입니다. `files/`를 프로젝트 루트에 복사합니다. core/tcp.ts·backend/tcp.ts·test/tcp.test.ts를 추가합니다. Node net을 사용하여 npm 패키지는 추가하지 않습니다.

```bash
npm pkg set 'scripts.dev:tcp=tsx watch src/backend/tcp.ts' 'scripts.start:tcp=node dist/backend/tcp.js'
npm run check
npm test
npm run build
npm run start:tcp
```

별도 TCP 서버가 127.0.0.1:3102에서 수신합니다. 기존 HTTP 실행과 독립입니다. 다음 명령은 macOS/Linux 개인 PC의 다른 터미널에서 실행합니다.

```bash
printf '%s\n' '{"name":"World"}' | nc 127.0.0.1 3102
```

JSON 한 개 뒤에 LF를 붙이며 응답도 LF 단위입니다. 분할 도착은 버퍼로 조립합니다. 연결별 미처리 버퍼 4096바이트·동시 연결 32개·유휴 10초로 제한합니다. 출력 backpressure가 생기면 연결을 종료합니다. 대량 메시지·신뢰성 보장은 제품 프로토콜에서 확장합니다. 종료 신호는 수신과 기존 연결을 정리합니다.

복수 통신을 하나의 프로세스에 붙이려면 기존 진입점에서 createGreetingTcp(createDI 결과의 greetingUsecase)를 만들고 server.listen을 호출합니다. 해당 진입점의 종료 handler에 close를 추가하고 별도 backend/tcp.ts를 동시에 실행하지 않습니다. 포트 충돌·종료·인증 요구를 함께 검증합니다.

제거는 프로세스 종료 → scripts·소스·테스트 해제 순서이며 공통 메시지는 다른 통신이 쓰면 남깁니다. 데이터 쓰기는 없습니다. [Node net](https://nodejs.org/docs/latest-v24.x/api/net.html) 기준입니다. 실제 원격 연결·TLS는 미검증입니다.

## 검증 기록 — 2026-11-04

macOS 13.7.8 x64·Node 24.22.1에서 확인했습니다. 타입 검사·컴파일과 실제 loopback TCP의 분할 메시지·잘못된 JSON·크기 제한·연결 종료 테스트를 통과했습니다. 원격·TLS·장시간 부하는 미검증입니다.
