<!-- version: v1.0.0 -->
# TypeScript Composer 변경 이력

## 2026-11-04 — 조립형 보일러플레이트 묶음 통합

- 묶음 명칭을 TypeScript Composer로 정하고 99.Boilerplates에서 02.Boilerplates/typescript-composer로 이동했습니다. 뼈대와 base·targets·features를 한 단위로 내려받습니다.
- 공통 README·작업 지침·변경 이력을 추가하고, 저장소의 목록·작성 규칙·요청문·탐색 메뉴를 새 묶음 기준으로 갱신했습니다. 모바일 유형은 별도로 유지합니다.
- 기존 독립 TypeScript backend·server-wui·Electron 유형은 뼈대 단독과 해당 조합으로 대체합니다. 기존 사용자의 프로젝트를 자동 변환하거나 의존성을 업그레이드하지 않습니다.
- 코드·직접 버전·잠금 파일은 이번 이동에서 변경하지 않습니다. 이전 템플릿 프로젝트에 새 경로·파일을 통째로 덮어쓰지 말고 새 빈 프로젝트에 선택 구성품을 적용합니다. 복귀는 이전 소스·manifest·lock·산출물을 같은 릴리스로 사용하며 사용자 저장 데이터는 별도 보관합니다.
- 이동 전후 실행 파일·설정·테스트 내용 동일성, 링크·앵커·메뉴·설정·공백을 확인했습니다. 이번 이동으로 실행 테스트를 반복하지 않으며 실제 빌드·통신·미서명 앱 묶음 이력은 아래 파일을 유지합니다. 현재 PATH에 Jekyll CLI가 없어 웹 빌드·화면 검증은 수행하지 않았습니다.

## 이전 작성·검증 이력

- [기준 뼈대 이력](./typescript-backend/update.md): 독립 HTTP·backend 경로·DI 분리와 기존 실행 결과.
- [구성품 목록](./components/README.md): base·targets·features의 코드와 개별 검증 기록.
- 일반 화면·게임·웹 배포·파일 저장·TCP·UDP·MQTT·Socket.IO 구성품은 2026-11-04에 작성·점검했습니다. 구성품별 환경·테스트·실행 결과는 각 README의 기록을 따릅니다.
- 실제 GUI·설치/서명·외부 운영 배포·다른 OS는 미검증입니다. Electron 개발 도구를 포함한 전체 임시 조합의 moderate 15건 및 Phaser 번들 크기 경고는 해결된 것으로 표시하지 않습니다.
