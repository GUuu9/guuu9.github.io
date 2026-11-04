<!-- version: v0.1.0 -->
# 통신 메시지 구성품

TCP·UDP·MQTT를 추가하기 전에 이 문서는 files 내용을 프로젝트에 적용한 상태에서 시작합니다. greeting/message.ts와 test/message.test.ts를 추가하며 새 패키지는 없습니다. 각 통신 연결부가 handleGreetingMessage(Buffer, Usecase)를 호출합니다.

입력은 UTF-8 JSON {"name":"World"}, 최대 4096바이트입니다. 기존 parseName으로 단일 문자열·1~40자를 확인합니다. 응답은 HTTP와 같은 success/payload envelope이고 내부 오류는 일반 문구로 반환합니다. 프로토콜 상태 코드나 Electron 객체를 Usecase에 전달하지 않습니다.

```bash
npm run check
npm test
npm run build
```

다른 통신 구성품이 참조하는 동안 제거하지 않습니다. 프로젝트 README·지침·update.md에 선택한 통신·입력·오류·검증을 기록합니다. 이 샘플은 인증·암호화를 포함하지 않으므로 기본 loopback 실행에서 확인합니다.

## 검증 기록 — 2026-11-04

macOS 13.7.8 x64·Node 24.22.1에서 확인했습니다. 타입 검사·컴파일과 메시지 크기·JSON·이름 검증·내부 오류 상세 비노출 테스트를 통과했습니다. 이 함수는 인증·암호화·속도 제한을 제공하지 않습니다.
