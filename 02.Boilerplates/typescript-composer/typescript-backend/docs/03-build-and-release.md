<!-- version: v2.0.0 -->
# TypeScript Server 빌드·운영 배포

로컬 설정·API 검증 후 개발 PC/CI의 프로젝트 루트에서 빌드하고 배포 서버의 릴리스 폴더에서 실행합니다. 서버 자체를 위한 GUI·Electron·브라우저 번들은 없습니다.

## 실행 OS 지원 범위

Node 24.22.1의 공식 바이너리 조건을 기준으로 구분합니다. 패키지·보안 지원·제품 운영 보장은 별도이며 의존성을 바꾸면 재검토합니다. 확인일은 2026-11-04입니다.

| 대상 | 최소 공식 조건 | 최대 지원 | 실제 검증 최저·최고 |
| :--- | :--- | :--- | :--- |
| macOS 개발·로컬 x64·arm64 | macOS 13.5 이상 | 숫자 상한 미명시·제품 상한 미확정 | 개발·로컬 검증 최저/최고 모두 macOS 13.7.8 x64; arm64 미검증 |
| Linux 서버 x64·arm64 | kernel 4.18·glibc 2.28 이상 | 숫자 상한 미명시·배포판별 상한 미확정 | 운영 배포 미검증 |
| Windows 서버 x64 | Windows 10 / Server 2016 이상 | 숫자 상한 미명시·제품 상한 미확정 | 운영 배포 미검증 |

[Node 24.22.1 Platform list](https://github.com/nodejs/node/blob/v24.22.1/BUILDING.md#platform-list). 사용자 웹 OS·브라우저 범위는 이 서버에 포함되지 않습니다. API 클라이언트의 호환 정책은 해당 제품에서 관리합니다. 컨테이너를 선택하면 호스트 kernel·이미지 libc·CPU를 구분합니다.

## 1. 빌드 산출물

[시작 가이드](./01-getting-started.md)의 Node·의존성 환경에서 실행합니다.

```bash
npm ci
npm run check
npm test
npm run build
```

배포 묶음은 dist/ 전체(config 포함), package.json·package-lock.json·.nvmrc입니다. 대상 OS에서 같은 Node로 `npm ci --omit=dev` 후 `npm start`를 실행합니다. 개발 PC의 node_modules를 다른 OS·CPU로 복사하지 않습니다. 실행에 TypeScript·tsx는 필요하지 않습니다. 비밀 없는 docs·지침을 함께 보관할 수 있습니다.

## 2. 운영 준비·배포·확인

현재 샘플은 127.0.0.1:3101 고정이며 환경 변수 HOST·PORT를 자동 사용하지 않습니다. 실제 제품은 바인딩·환경 로딩·인증·권한·요청 제한·TLS·프로세스 관리·로그 보존을 추가하고 검증합니다. 특정 Docker·클라우드·DB를 기본 의존성으로 가정하지 않습니다.

1. 정상 커밋·Node/npm·lock·OS/CPU·릴리스 ID와 산출물 체크섬을 기록합니다.
2. 배포 계정의 새 릴리스 폴더에 묶음을 준비하고 대상 OS에서 런타임 의존성을 설치합니다.
3. 내부 loopback API의 정상·400·404·500 경계와 프로세스 종료를 확인합니다. 선택한 운영 프록시·인증·TLS·방화벽을 함께 검증합니다.
4. 검증 후 운영 트래픽을 새 프로세스로 전환합니다. 이 샘플에는 서비스 등록·프록시·트래픽 전환 명령이 구현되어 있지 않습니다.

로컬 npm start 성공은 운영 인증·외부 접근·지속 실행·배포 성공을 뜻하지 않습니다. 실제 원격 배포는 수행하지 않았습니다.

## 3. 보관·업데이트·복귀

이전 정상 소스·lock·dist/backend/config·Node 버전·실행 설정과 비밀값의 안전한 복구 수단을 보관합니다. 정상 인사말 config는 앱 설정이며 사용자 저장 데이터는 없습니다. 제품에서 DB·파일 쓰기를 추가하면 백업·데이터 호환·마이그레이션 복귀를 별도로 정의합니다.

업데이트는 새 릴리스 폴더에서 검사·빌드·API 확인 후 전환합니다. 실패하면 보관한 이전 묶음과 Node·런타임 의존성·설정으로 되돌려 확인합니다. 공유 SDK·캐시·사용자 데이터를 릴리스 삭제에 함께 지우지 않습니다. 도구 업데이트·런타임 변경·앱 의존성 변경은 구분하고 lock을 삭제하거나 강제 갱신으로 복원하지 않습니다.

공식 근거: [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/) · [Express 운영 보안](https://expressjs.com/en/advanced/best-practice-security.html).
