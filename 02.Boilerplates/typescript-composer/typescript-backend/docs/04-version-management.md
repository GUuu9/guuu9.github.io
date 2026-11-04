<!-- version: v1.0.0 -->
# 버전·업데이트·검증 조합

이 프로젝트 루트에서 수행합니다. 앱 버전, 런타임/패키지 버전, feature 구현 버전, 문서 버전을 구분합니다. 실제 사용하는 값은 .nvmrc·package.json·package-lock.json을 우선합니다.

## 변경 전 확인

```bash
node --version
npm --version
npm ls --depth=0
npm audit
npm audit --omit=dev
```

audit는 알려진 취약점 검사이며 전체 보안 검증이 아닙니다. runtime 결과와 빌드 도구까지 포함한 결과를 따로 검토합니다. 공식 권고·지원 종료·릴리스 노트에서 영향 범위와 조치 버전을 확인합니다. 경고를 없애기 위한 lock 삭제나 npm audit fix --force를 기본 해결책으로 쓰지 않습니다.

## 업데이트·검사

1. 변경 전 소스 revision·manifest/lock·정상 산출물·별도 저장 데이터를 보관합니다. 보안 수정/지원 종료/기능 추가 중 사유와 마지막 정상 조합을 기록합니다.
2. 별도 브랜치에서 대상 패키지와 필요한 최소 의존성만 변경합니다. 직접 의존성은 선택한 정확한 버전을 manifest에 반영하고 npm install로 lock을 함께 갱신합니다. Node 변경은 .nvmrc와 engines도 맞춥니다. 전역 기본 버전은 바꾸지 않습니다.
3. 갱신된 lock으로 아래 명령을 실행하고 HTTP·통신·IPC·저장·종료 등 영향받은 동작을 확인합니다. GUI·실기기·타 OS·운영 배포 확인은 별도로 기록합니다.

```bash
npm ci
npm run check
npm test
npm run build
```

4. 아래 기록을 갱신하고 앱 package.json.version과 update.md에 변경·이행·복귀 방법을 기록합니다. 변경한 API·설정·데이터 형식의 비호환성을 명시합니다.

## 기능·검증 조합 기록

첫 생성 직후에는 미검증입니다. 표의 미기입 값을 실제 결과로 채우고 버전 변경마다 새 기록을 추가합니다. 기능을 추가해도 과거 통과 행을 수정해 새 조합의 성공으로 표시하지 않습니다.

| 항목 | 기록할 값 |
| :--- | :--- |
| 앱 revision·버전 | 미기입; 미커밋 변경 여부도 기록 |
| 원본 Composer revision | 미기입; 미커밋 원본이면 기준 commit과 변경 묶음 보관 |
| target·base | 미기입; 생성 형태와 선택 구성 |
| feature ID·구현 버전·용도 | 미기입; 원본 기능 목록 기준. 문서 version·npm 패키지 버전과 구분 |
| 선행/충돌 조건 | 함께 필요한 feature 버전, 미지원 target·조합 |
| Node·npm·주요 패키지 | 실제 명령 결과와 manifest/lock의 revision |
| 환경 | 개발/빌드 OS·CPU와 서비스 사용자 OS·브라우저를 구분 |
| 지원 범위 | 공식 최소/최대 또는 상한 미명시/미확정, 근거 링크 |
| 실제 검증 범위 | 최저/최고 OS·브라우저·CPU, 확인한 기능 |
| 날짜·검사·근거 | 미기입; 명령·로그·실행 결과, 실제/모의 검사 구분 |
| 상태·미검증·실패 | 미검증; 테스트/빌드/실행/배포를 구분 |
| 복귀 기준 | 마지막 정상 소스·lock·산출물·데이터 복구 기준 |

Composer 생성 앱에서는 .composer/state.json의 활성 ID와 .composer/catalog를 함께 Git에 보관합니다. 이 ID 목록에는 구현 버전이 자동 기록되지 않습니다. 사용한 원본 기능 버전·용도·호환 조건을 위 기록에 별도로 남깁니다. 기존 catalog에 없는 신규 기능이나 버전으로의 갱신은 add 명령의 역할이 아니며, 새 원본과 비교·이행 검증이 필요합니다.

## 보안 판단·복귀

보안 이슈는 권고 URL·영향 패키지/버전·직접/간접 경로·노출 기능·해결 버전·조치/보류 사유·담당·재점검 날짜를 update.md에 기록합니다. 악용 가능성과 외부 노출을 우선 판단하고 개발 의존성의 빌드 위험도 확인합니다.

실패하면 마지막 정상 revision의 소스·manifest·lock을 함께 복구하고 해당 Node에서 npm ci 후 빌드합니다. 새 데이터 형식을 이전 버전이 읽을 수 있는지 확인하고 필요하면 별도 백업을 복구합니다. 운영 데이터에 Git 복귀를 대신 적용하지 않습니다. 취약한 이전 버전으로의 복귀는 노출 차단·완화책과 수정 재적용 계획을 함께 기록합니다.

## 공식 근거

- [npm audit](https://docs.npmjs.com/cli/commands/npm-audit/)
- [npm ci](https://docs.npmjs.com/cli/commands/npm-ci/)
- [Node 릴리스·지원 정책](https://github.com/nodejs/Release)
