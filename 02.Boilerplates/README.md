# 재사용 샘플 보일러플레이트

기존 프로젝트에서 검증된 구조·명명·기능 작성 방식을 추출해 **최소 실행 샘플과 그 샘플의 문서·작업 지침**을 관리합니다. 원본 제품의 업무 규칙·전체 소스·프로젝트 문서를 보관하는 공간이 아닙니다.

- [작성 규칙](./authoring-rules.md)
- [다른 프로젝트에 전달할 요청문](./project-request.md)

## 특정 보일러플레이트만 내려받기

Git의 partial clone과 sparse checkout을 함께 사용합니다. 아래는 server-wui 전체 패키지(문서·지침·실행 샘플)를 받는 예시이며 macOS·Linux 셸과 Windows PowerShell에서 같은 Git 명령을 사용할 수 있습니다. Git에 sparse-checkout 지원이 필요합니다.

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/GUuu9/guuu9.github.io.git devguide-samples
cd devguide-samples
git sparse-checkout set 02.Boilerplates/server-wui
cd 02.Boilerplates/server-wui/boilerplates/minimal
npm ci
npm test
npm run build
npm start
```

새 폴더 devguide-samples에서 진행하며 기존 프로젝트 안에서 실행하지 않습니다. Git은 선택한 디렉터리 구조를 유지하므로 유형 폴더가 다운로드 폴더의 루트로 평탄화되지는 않습니다. 기본 cone 모드에서는 저장소 루트와 상위 디렉터리의 파일도 함께 보일 수 있습니다. 다른 유형의 하위 코드는 체크아웃하지 않습니다.

--depth 1은 가져올 이력을 줄이고 --filter=blob:none은 파일 본문을 필요할 때 받도록 요청합니다. 전체 저장소 메타데이터까지 유형별로 분리하는 기능은 아닙니다. 서버가 filter를 지원하지 않으면 전송량이 줄지 않을 수 있습니다.

다른 유형을 받으려면 sparse-checkout set의 경로를 아래 표에서 선택합니다. 현재 실행 샘플이 있는 유형은 server-wui입니다. 원격 저장소에 해당 변경이 push된 이후에 받을 수 있습니다.

| 유형 | 선택 경로 | 현재 상태 |
| :--- | :--- | :--- |
| mobile-app | `02.Boilerplates/mobile-app` | 준비 중 |
| server | `02.Boilerplates/server` | 준비 중 |
| server-wui | `02.Boilerplates/server-wui` | 실행 샘플 포함, 실제 브라우저·다른 OS 미검증 |
| electron-app | `02.Boilerplates/electron-app` | 준비 중 |

다운로드 저장소 루트에서 `git sparse-checkout add 다른경로`로 추가할 수 있습니다. set은 선택 목록을 교체하므로 수정한 파일이 있다면 먼저 보존합니다. 갱신은 같은 저장소에서 변경 상태를 확인한 뒤 `git pull --ff-only`로 진행합니다.

새 프로젝트로 시작하려면 받은 샘플의 내용물(숨김 파일 포함)을 별도 빈 디렉터리에 복사합니다. 원본 다운로드의 .git·node_modules·dist는 복사하지 않고 새 디렉터리에서 의존성을 복원합니다. 다운로드 저장소 자체를 새 프로젝트로 착각해 origin에 push하지 않습니다. 지침·설명서 적용은 유형 README를 따릅니다.

공식 참고: [git clone](https://git-scm.com/docs/git-clone), [git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout).

## 만들고 가져오는 방법

원본 프로젝트에서 boilerplate-export/유형명/ 안에만 결과를 작성합니다. 완료 후 유형명 폴더 하나를 이 저장소의 02.Boilerplates/ 아래로 복사합니다. 문서·샘플은 폴더 밖 원본 프로젝트에 의존하지 않고 복사 후 그대로 사용돼야 합니다.

```text
유형명/
├── README.md
├── project-agents.md
├── docs/
│   └── boilerplate.md
└── boilerplates/
    └── minimal/
        ├── README.md
        └── 실제 소스·버전·의존성·실행·테스트 설정
```

| 파일 | 책임 |
| :--- | :--- |
| README.md | 샘플 소개·구조·버전·빠른 시작·기능 추가 방식·문서 안내 |
| project-agents.md | 샘플을 수정하는 에이전트의 규칙. 새 프로젝트 적용 시 AGENTS.md로 사용 |
| docs/boilerplate.md | 전체 직접 관리 폴더·파일의 이름·역할·주요 구성·연결, 상세 개발·재사용 방법 |
| boilerplates/minimal/ | 독립 복사해 실행·테스트할 수 있는 최소 프로젝트 |

project-agents.md는 이 문서 저장소에 자동 적용되는 지침이 아닙니다. 새 프로젝트로 사용할 때는 샘플 코드·필요한 문서 배치 후 지침을 AGENTS.md로 복사하고 링크를 실제 배치에 맞춥니다.

## 유형

| 유형 | 범위 |
| :--- | :--- |
| [mobile-app](./mobile-app/) | Flutter 모바일 앱 |
| [server](./server/) | 독립 TypeScript 서버 |
| [server-wui](./server-wui/) | TypeScript 서버 + React 웹 UI |
| [electron-app](./electron-app/) | Electron + React + TypeScript 앱 |

server-wui에는 검토한 샘플이 있으며, 다른 유형은 준비 단계입니다. 새 반출본은 검증 후 반입합니다.
