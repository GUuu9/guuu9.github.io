<!-- version: v1.6.1 -->
# Server-WUI 최소 보일러플레이트

다운로드 전에 [선행 도구·준비 순서](docs/getting-started.md#0-선행-도구준비-순서)를 확인한다. 처음 사용한다면 [가져오기부터 실행까지](docs/getting-started.md)를 먼저 읽고, 환경 구성·실행을 마친 뒤 아래 구조·확장 설명으로 이어간다.

## 1. 목적과 핵심 동작

Express 서버와 React WUI를 독립 실행하는 작은 TypeScript 예제다. Name에 이름을 입력하고 Send를 누르면 서버에서 `Hello, World!`를 받아 표시한다. 잘못된 요청은 화면에 오류로 표시하며 입력은 보존한다. 예상하지 못한 요청 처리 예외는 내부 상세를 노출하지 않는 공통 500 응답으로 처리한다. FileService·순수 util·JSON config도 같은 흐름에 포함한다.

이 `server-wui` 폴더 하나를 다른 저장소의 `02.Boilerplates/` 아래에 그대로 복사할 수 있다. 설치와 실행에 필요한 파일이 모두 포함되어 있다.

## 2. 기술과 버전 기준

Node 24.22.1 이상 24.x, npm, TypeScript·Express·React·Vite를 사용한다. 샘플 버전과 패키지 고정 버전은 [package.json](boilerplates/minimal/package.json), 정확한 의존 트리는 [package-lock.json](boilerplates/minimal/package-lock.json), 개발 Node 버전은 [.nvmrc](boilerplates/minimal/.nvmrc)를 기준으로 한다.

## Git으로 이 유형만 받기

[시작 가이드 1절](docs/getting-started.md#1-유형-패키지-가져오기)에서 Git 다운로드 명령부터 진행한다. 기존 다운로드와 새 앱 폴더를 구분하고, 앱을 받을 때 Node나 의존성 업데이트를 섞지 않는다.

## 3. 빠른 시작

[가져오기부터 실행까지](docs/getting-started.md)를 다음 순서로 따른다.

1. 유형 다운로드·새 프로젝트 폴더 복사.
2. `.nvmrc`에 맞는 Node·npm 준비와 프로젝트 실행 환경 확인.
3. `npm ci`로 의존성 복원.
4. 타입 검사·테스트·빌드.
5. 서버·화면 실행, 정상/오류 동작 확인, 종료.

개발 모드·포트·환경 변수는 시작 가이드의 해당 단계에서 [샘플 README](boilerplates/minimal/README.md)로 연결한다. 환경 준비 이전에 npm 명령을 실행하지 않는다.

## 4. 핵심 구조

```text
README.md                 샘플 패키지 진입 안내
project-agents.md         샘플 작업 지침 보관본 (자동 적용 안 됨)
docs/boilerplate.md        전체 파일 역할·흐름·재사용·검증
boilerplates/minimal/      독립 실행 단위
  package.json            버전·의존성·실행/검사 스크립트
  scripts/                빌드 시 config 복사
  server/src/             HTTP·업무·데이터·파일 서비스·util·config
  server/test/            HTTP·입력·설정 테스트
  webui/src/              React Page·ViewModel·Service·API·DI
  webui/test/             상태·응답 검증 테스트
```

직접 관리하는 모든 파일과 연결 관계는 [설명서 3절](docs/boilerplate.md#3-폴더파일명과-전체-역할-목록)에 있다.

### 아키텍처 요약

브라우저는 Page·ViewModel·Service·Api로 화면/상태/통신을 구분하고, Node는 Bridge·Usecase·Repository·FileService로 HTTP/처리/설정 보관/I/O를 구분한다. 객체 생성은 각 core/DI.ts에 모으고 양쪽 실행 영역은 HTTP로 연결한다. 서로의 실행 소스를 import하지 않는다.

허용·금지 의존, 시작·실패·종료·구독 해제와 실제 경로의 두 Mermaid 그림은 [설명서 아키텍처](docs/boilerplate.md#4-아키텍처와-대표-데이터-흐름)에 있다. 문서와 실행 검증의 완료 범위는 [요구사항 대조표](docs/boilerplate.md#요구사항-대조표)에서 확인한다.

## 5. 새 기능 추가 순서

1. 입력·정상 응답·오류를 정하고 greeting 흐름을 읽는다.
2. 서버의 `bridge/<feature>`에 필요한 Bridge·Usecase·Model을 두고 데이터가 필요할 때만 Repository를 만든다. I/O는 Service, 순수 보조 처리는 utils에 둔다.
3. `server/src/core/DI.ts`와 `web-server.ts`에서 조립·라우터를 연결한다.
4. WUI의 `scenes/<feature>`에 Page·ViewModel·Service·Model과 CSS를 만들고 `webui/src/core/DI/DI.ts`에서 주입한다. 응답은 런타임 검증한다.
5. 진입 화면에 연결하고 서버·WUI의 정상/오류 테스트를 추가한다. 빈 계층이나 불필요한 옵션은 만들지 않는다.

## 6. 검사와 빌드

샘플 루트 `boilerplates/minimal/`에서:

```sh
npm run check
npm test
npm run build
```

타입 검사, 실제 로컬 HTTP/비UI 테스트, 서버 JS·config 및 WUI 번들을 생성한다. 산출물은 샘플 안의 dist다. node_modules·캐시·dist는 공유 파일에 포함하지 않는다.

## 7. 작업 지침 적용

[project-agents.md](project-agents.md)는 문서 저장소에서 자동 적용되지 않도록 보관한 이름이다. 새 프로젝트에 적용할 때:

[시작 가이드](docs/getting-started.md)의 내보내기 절차는 코드와 docs·project-agents.md·update.md를 새 앱 루트에 배치한다. 에이전트 사용 시 보관본만 같은 루트의 AGENTS.md로 복사한다. 기본 문서 배치에서 링크 수정은 필요하지 않으며 실행 루트는 패키지의 minimal 또는 새 앱 루트다.

## 8. 상세 안내

- [보일러플레이트 설명서](docs/boilerplate.md): 전체 역할 목록·의존 방향·명명·명령·경계.
- [샘플 작업 지침](project-agents.md): 변경 전 확인과 완료 기준.
- [독립 샘플 실행 안내](boilerplates/minimal/README.md): 설치·개발·API·테스트·포트·종료.

## 9. 검증 상태와 제약

최종 검증 환경·명령·결과는 [설명서 9절](docs/boilerplate.md#9-예외와-검증-결과)에 기록한다. 이 예제는 로컬 읽기 전용 조회이며 인증·TLS·영구 저장·업데이트를 제공하지 않는다. 운영 서비스를 위한 보안 구성을 대신하지 않는다. 타 OS/CPU와 브라우저 검증 여부는 각각 구분해 보고한다.

변경 날짜·이유·버전 및 검증 이력은 [update.md](update.md)를 참고합니다.

## 보안·버전 점검 (2026-10-29)

앱 package 버전은 1.0.1입니다. 독립 복사본에서 npm ci·테스트(7개)·타입 검사·빌드를 통과했고 전체 의존성 npm audit는 보고된 취약점 0건입니다. 이는 점검 시점의 알려진 npm 공지 기준이며 모든 보안 문제의 부재를 의미하지 않습니다. 실행 기준에 맞춰 Node 타입을 24.19.2로 정렬했고 나머지 직접 의존성은 유지했습니다. 실제 브라우저·다른 OS는 이번에 확인하지 않았습니다. 버전 변경 이유·적용/복귀는 [update.md](update.md)에서 관리합니다.

## 빌드 산출물과 배포

로컬 검증 후 [Server-WUI 빌드·운영 배포](docs/build-and-release.md)에서 배포 준비·산출물·서명 또는 운영 설정·검증·업데이트·복귀를 확인합니다. 문서 추가는 샘플에 배포 기능이 구현되었다는 뜻이 아닙니다.

개발 도구 설치 전에 [서비스 OS 지원 범위](docs/build-and-release.md#서비스-os브라우저-지원-범위)에서 최소 OS·최대 지원 상태·실제 검증 범위를 확인합니다. SDK·패키지 변경 시 이 범위를 다시 대조합니다.
