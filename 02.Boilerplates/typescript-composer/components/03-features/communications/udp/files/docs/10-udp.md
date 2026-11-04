<!-- version: v0.1.0 -->
# UDP 연결 구성품

선행: 기준 뼈대 → 통신 메시지 구성품입니다. 이 문서는 files 내용을 프로젝트에 적용한 상태에서 시작합니다. core/udp.ts·backend/udp.ts·test/udp.test.ts가 추가되고 npm 패키지는 없습니다.

```bash
npm pkg set 'scripts.dev:udp=tsx watch src/backend/udp.ts' 'scripts.start:udp=node dist/backend/udp.js'
npm run check
npm test
npm run build
npm run start:udp
```

127.0.0.1:3103에서 데이터그램 하나를 JSON 요청 하나로 처리합니다. 입력은 최대 4096바이트이며 응답은 보낸 주소·포트로 전송합니다. macOS/Linux에서는 다음으로 로컬 요청을 보낼 수 있습니다.

```bash
printf '%s' '{"name":"World"}' | nc -u 127.0.0.1 3103
```

UDP는 유실·순서·중복을 보장하지 않습니다. 이 읽기 전용 샘플은 재전송·중복 제거를 구현하지 않습니다. 상태 변경 요청에는 요청 ID·중복 방지·재시도 정책을 별도로 정합니다. 종료 신호는 소켓을 닫습니다. 원격 노출 시 발신자 인증·요청 제한과 응답 증폭 위험을 다뤄야 합니다.

다른 진입점에 합칠 때 createGreetingUdp(같은 greetingUsecase) 후 socket.bind를 호출하고 그 진입점의 종료 처리에서 socket.close를 수행합니다. 별도 udp.ts를 동시에 실행하지 않습니다. 제거는 실행 종료 후 scripts·소스·테스트를 해제하고 공통 메시지 사용 여부를 확인합니다. 사용자 데이터 쓰기는 없습니다. [Node dgram](https://nodejs.org/docs/latest-v24.x/api/dgram.html) 기준이며 실제 원격 통신은 미검증입니다.

## 검증 기록 — 2026-11-04

macOS 13.7.8 x64·Node 24.22.1에서 확인했습니다. 타입 검사·컴파일과 실제 loopback UDP의 정상·잘못된 JSON·크기 제한·소켓 종료 테스트를 통과했습니다. 원격·유실·중복·부하는 미검증입니다.
