# Server-WUI 최소 보일러플레이트

## 1. 목적과 핵심 동작

Express 서버와 React WUI를 독립 실행하는 작은 TypeScript 예제다. Name에 이름을 입력하고 Send를 누르면 서버에서 `Hello, World!`를 받아 표시한다. 잘못된 요청은 화면에 오류로 표시하며 입력은 보존한다. FileService·순수 util·JSON config도 같은 흐름에 포함한다.

이 `server-wui` 폴더 하나를 다른 저장소의 `02.Boilerplates/` 아래에 그대로 복사할 수 있다. 원본 제품의 소스·계정·장비·개인 경로는 필요하지 않다.

## 2. 기술과 버전 기준

Node 24.22.1 이상 24.x, npm, TypeScript·Express·React·Vite를 사용한다. 샘플 버전과 패키지 고정 버전은 [package.json](boilerplates/minimal/package.json), 정확한 의존 트리는 [package-lock.json](boilerplates/minimal/package-lock.json), 개발 Node 버전은 [.nvmrc](boilerplates/minimal/.nvmrc)를 기준으로 한다. 별도 제품 버전 파일은 필요하지 않아 만들지 않았다.

## Git으로 이 유형만 받기

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/server-wui
cd 02.Boilerplates/server-wui
```

이후 아래 빠른 시작을 진행한다. 원격 저장소에 이 패키지가 push돼 있어야 하며 루트·상위 디렉터리의 안내 파일도 함께 보일 수 있다. 다른 유형 선택·갱신·새 프로젝트로 복사하는 방법은 [다운로드 안내](../README.md#특정-보일러플레이트만-내려받기)를 참고한다.

## 3. 빠른 시작

이 반출 패키지 루트에서:

```sh
cd boilerplates/minimal
npm ci
npm run build
npm start
```

http://127.0.0.1:3101 에 접속해 Send를 누른다. 종료는 Ctrl+C다. 개발 모드의 두 터미널 실행 순서와 포트 변경은 [샘플 README](boilerplates/minimal/README.md)에 있다.

## 4. 핵심 구조

```text
README.md                 반출 패키지 진입 안내
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

타입 검사, 실제 로컬 HTTP/비UI 테스트, 서버 JS·config 및 WUI 번들을 생성한다. 산출물은 샘플 안의 dist다. node_modules·캐시·dist는 반출 파일에 포함하지 않는다.

## 7. 작업 지침 적용

[project-agents.md](project-agents.md)는 문서 저장소에서 자동 적용되지 않도록 보관한 이름이다. 새 프로젝트에 적용할 때:

1. `boilerplates/minimal/`의 내용물(숨김 파일 포함)을 새 프로젝트 루트에 복사한다.
2. 이 파일을 새 프로젝트 루트의 `AGENTS.md`로 복사한다.
3. `docs/boilerplate.md`를 새 프로젝트의 같은 경로로 복사한다.
4. 새 AGENTS의 문서 링크 `docs/boilerplate.md`는 그대로 유효하다. `boilerplates/minimal/README.md` 링크는 새 배치에 맞춰 `README.md`로 바꾸고, `작업 루트` 설명도 새 루트로 수정한다.
5. 복사한 설명서의 파일 링크는 현재 `../boilerplates/minimal/` 기준이므로 새 프로젝트에서는 `../` 기준으로 바꾼다. 문서를 다른 위치에 두면 실제 배치에 맞춰 함께 조정한다.

반출 패키지 그대로 보관·실행할 때는 이 수정이 필요 없다. 코드 경로·명령은 항상 샘플 작업 루트 기준이다.

## 8. 상세 안내

- [보일러플레이트 설명서](docs/boilerplate.md): 출처·전체 역할 목록·의존 방향·명명·명령·경계.
- [샘플 작업 지침](project-agents.md): 변경 전 확인과 완료 기준.
- [독립 샘플 실행 안내](boilerplates/minimal/README.md): 설치·개발·API·테스트·포트·종료.

## 9. 검증 상태와 제약

최종 검증 환경·명령·결과는 [설명서 9절](docs/boilerplate.md#9-예외와-검증-결과)에 기록한다. 이 예제는 로컬 읽기 전용 조회이며 인증·TLS·영구 저장·업데이트를 제공하지 않는다. 운영 서비스를 위한 보안 구성을 대신하지 않는다. 타 OS/CPU와 브라우저 검증 여부는 각각 구분해 보고한다. 원본 코드·자산 전체의 재배포 라이선스는 확인하지 않았으며 이 패키지는 제품 자산을 포함하지 않는다.
