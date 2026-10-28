# 재사용 샘플 보일러플레이트

기존 프로젝트에서 검증된 구조·명명·기능 작성 방식을 추출해 **최소 실행 샘플과 그 샘플의 문서·작업 지침**을 관리합니다. 원본 제품의 업무 규칙·전체 소스·프로젝트 문서를 보관하는 공간이 아닙니다.

- [작성 규칙](./authoring-rules.md)
- [다른 프로젝트에 전달할 요청문](./project-request.md)

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

유형별 폴더는 준비 단계입니다. 새 요청문으로 생성한 독립 패키지를 검증한 뒤 반입합니다.
