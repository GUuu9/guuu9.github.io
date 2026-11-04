<!-- version: v0.1.0 -->
# MQTT 연결 구성품

선행: 기준 뼈대 → 통신 메시지 구성품입니다. MQTT broker는 별도로 준비한 서버에 접속합니다. 이 구성품은 MQTT client이며 broker를 설치하거나 실행하지 않습니다.

## 1. 복사·설치·설정

이 문서는 files 내용을 프로젝트에 적용한 상태에서 시작합니다. core/mqtt.ts·backend/mqtt.ts·test/mqtt.test.ts가 추가됩니다. .env.example의 키는 기존 .env.example 양식에 합치고 실제 값은 Git 제외 .env에 둡니다. 사용자 이름·비밀번호를 명령·로그에 넣지 않습니다.

```bash
npm install --save-exact mqtt@5.16.1
npm pkg set 'scripts.start:mqtt=node --env-file=.env dist/backend/mqtt.js'
npm run check
npm test
npm run build
npm run start:mqtt
```

.env가 없으면 새로 만들고 공개 양식의 키를 설정합니다. MQTT_URL 기본은 mqtt://127.0.0.1:1883, MQTT_PREFIX는 sample-greeting입니다. prefix는 영문·숫자·_·-로 된 단일 segment입니다. 운영은 mqtts와 인증·broker ACL을 구성하고 인증값은 해당 프로젝트에만 적용합니다.

## 2. 구독과 요청

connect 완료 → prefix/request 구독 → 메시지 검증 → 같은 Usecase → prefix/response 발행 순서입니다. payload는 {"name":"World"}입니다. 다른 MQTT 도구에서 response를 먼저 구독하고 request에 retain=false로 발행합니다. request topic과 response topic을 바꿔 자기 응답을 다시 처리하지 않게 합니다.

샘플은 clean session·QoS 0·응답 retain=false이며 retained 요청은 무시합니다. 재접속 후 명시적으로 다시 구독하고 구독 거절은 실패로 종료합니다. 연결 실패는 오류를 기록하며 1초 간격으로 재접속합니다. 종료 신호는 listener를 해제하고 최대 3초 뒤 강제로 연결을 닫습니다.

여러 client의 요청·응답 상관관계는 구현하지 않았습니다. client별 prefix 또는 correlation ID가 필요한 경우 topic·ACL·계약을 함께 확장합니다. QoS 0의 유실과 중복·순서 정책을 운영 요구에 맞게 검토합니다.

다른 진입점에 붙일 때 MQTT connect로 client 생성 → attachGreetingMqtt(client, 같은 greetingUsecase, prefix) 호출 → error listener 등록 순서로 연결합니다. 종료 시 반환된 detach를 호출하고 client.end로 접속을 닫습니다. 기본 client 생성·환경 로딩 예시는 backend/mqtt.ts를 참고합니다.

## 3. 검증·제거

제공 테스트는 client 대역으로 구독·재접속·retained 거부·응답·해제를 확인합니다. 실제 broker와 TLS·인증·ACL·끊김/복구는 별도 통합 확인 대상입니다. 연결 종료 후 scripts·소스·테스트·불필요한 환경 키를 제거하고 다른 구성품이 사용하지 않을 때만 npm uninstall mqtt를 실행합니다. broker의 사용자·ACL·보존 topic 데이터는 임의 삭제하지 않습니다.

공식 근거: [MQTT.js](https://github.com/mqttjs/MQTT.js), [Node 환경 파일](https://nodejs.org/docs/latest-v24.x/api/cli.html#--env-filefile).

## 검증 기록 — 2026-11-04

macOS 13.7.8 x64·Node 24.22.1에서 확인했습니다. 타입 검사·컴파일과 client 대역의 재구독·retained 거부·해제 테스트, 로컬 MQTT 패킷 시험 서버의 CONNECT/SUBSCRIBE/PUBLISH 왕복을 확인했습니다. 실제 운영 broker·TLS·인증·ACL·장시간 재연결은 미검증입니다.
