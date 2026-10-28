<!-- version: v1.0.1 -->
# 갱신 이력

최신 항목부터 기록합니다. 날짜·이유·변경·버전·적용/복귀·검증을 남기며 문서 버전과 앱 버전은 구분합니다. 아래 과거 실행 결과는 당시 검토 기록이며 이번에 재실행한 결과가 아닙니다.

## 2026-10-29 — 보안 의존성 갱신

- 이유: npm audit에 보고된 취약 의존성을 제거하고 실행 Node와 타입 버전을 맞추기 위해 갱신했습니다.
- 변경·버전: 앱 1.0.0 → 1.0.1. Electron 41.10.3 → 45.1.0, Vite 6.4.3 → 6.4.5, Vitest 3.2.7 → 5.0.5, @types/node 22.13.4 → 24.19.2. Vitest 전환으로 취약 간접 의존성도 갱신·제거했습니다.
- 적용: 샘플 루트에서 npm ci·타입 검사·테스트·빌드를 다시 실행합니다. Node 24.22.1은 유지하며 npm이 생성한 lockfile을 포함했습니다. Electron 바이너리는 첫 실행 시 추가 다운로드가 필요할 수 있습니다. 저장 형식 version 1은 바꾸지 않았습니다. 앱 종료 후 userData/save.json을 백업하세요.
- 복귀: 이전 커밋 e72b58e의 manifest·lockfile을 함께 복원하고 npm ci·재빌드합니다. 저장 데이터는 지우지 않습니다. 구 의존성의 알려진 취약점도 되돌아오므로 운영 적용용 복귀로 권장하지 않습니다.
- 검증: macOS 13 x86_64, Node 24.22.1·npm 11.19.1의 독립 임시 복사본에서 npm ci·테스트 3개·타입 검사·빌드 통과. 전체 의존성 npm audit 보고 0건. Electron 45.1.0 바이너리의 버전을 확인하고 별도 임시 userData를 쓰는 실제 창에서 preload 인사말·점수 저장/조회 IPC와 Phaser canvas 생성·정상 종료를 자동 검사했습니다. 직접 게임 클릭·앱 재실행 후 저장 복원·다른 OS는 미검증. install-script 승인 경고는 남아 있지만 현재 환경의 검사·빌드는 통과했습니다.
- 근거: [Electron 45.1.0 릴리스](https://releases.electronjs.org/release/v45.1.0), [Electron 보안 지침](https://www.electronjs.org/docs/latest/tutorial/security), [Electron 변경 사항](https://www.electronjs.org/docs/latest/breaking-changes), [Vitest 5 전환 안내](https://vitest.dev/guide/migration/). sandboxed preload의 제거된 Node shim은 현재 번들에서 사용하지 않습니다. Vitest 5의 Node/Vite 요구 조건을 충족하며 기존 테스트는 수정 없이 통과했습니다.

## 2026-10-29 — 갱신 이력 관리 도입

- 이유: 버전 문제의 발견과 해결, 보일러플레이트 변경 이유를 추적하기 위해 이력 파일을 추가했습니다.
- 변경: update.md 생성, README 연결과 작업 지침에 이력 갱신 규칙 추가.
- 버전: 앱 package 1.0.0 유지. 런타임·의존성·lockfile은 변경하지 않았습니다. 문서만 수정했습니다.
- 적용/복귀: 재설치·재빌드·데이터 변경이 필요 없습니다. 이전 문서로 복귀해도 실행 환경은 같습니다.
- 검증: 문서 링크·앵커·코드 펜스와 git diff 공백 검사. 실행 테스트·취약점 재점검은 하지 않았습니다.

## 2026-10-28 — 게임 샘플 등록 및 버전 문제 점검

- 이유: Electron·React·Phaser의 로컬 게임·IPC·점수 저장 흐름을 재사용하기 위해 등록하고 반입 검토했습니다.
- 변경: 샘플과 문서 등록, 현재 게임 UI 기준 설명 정정, 목록·다운로드 경로 추가. 커밋 `939aa26`.
- 버전: 앱 1.0.0 신규 등록. Node 24.22.1·Electron 41.10.3·React 19.1.1·Phaser 4.2.1·Vite 6.4.3·TypeScript 5.9.3·Vitest 3.2.7. 반입 검토에서 버전을 올리지 않았습니다. 정확한 의존 트리는 샘플 package-lock.json 기준.
- 적용/복귀: npm ci·타입 검사·빌드 후 Electron으로 실행합니다. userData의 save.json은 앱 소스와 별개입니다. 복귀·재설치 전에 앱을 종료하고 저장 데이터를 백업하며, 구버전 호환성 확인 없이 파일을 지우거나 덮어쓰지 않습니다.
- 검증: macOS x86_64, Node 24.22.1·npm 11.19.1 독립 복사본에서 설치·테스트 3개·타입 검사·빌드·문서 검사 통과. Phaser 번들 500 kB 경고. Electron 창·클릭·저장 후 재실행·다른 OS는 이번 반입 검토에서 미검증.
- 남은 문제: 당시 npm audit에서 취약 패키지 5개(moderate 1·high 2·critical 2)를 보고했습니다. Electron·Vite·Vitest·@vitest/mocker·tinypool이 대상이며 **해결 기록이 아닙니다**. 현재 재점검 결과로 간주하지 않습니다. 사용 전 버전 갱신과 재검증이 필요하며 관련 근거는 [설명서 반입 검토](docs/boilerplate.md#반입-검토-2026-10-28)에 있습니다.
