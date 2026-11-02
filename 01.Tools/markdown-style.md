<!-- version: v1.2.0 -->
# Markdown 문서 디자인·작성 가이드

이 저장소의 설치·사용·운영 문서를 GitHub에서 읽기 쉽게 구성하는 기준입니다. 내용과 명령을 먼저 정확히 작성한 뒤 제목·표·강조·접기를 적용합니다. 별도 테마나 CSS 설치는 필요하지 않습니다.

## 지원 범위와 선택 기준

| 요소 | 적합한 용도 | 이 저장소의 적용 기준 |
| :--- | :--- | :--- |
| 제목·목록 | 문서 탐색·실행 순서 | 문서 제목은 H1, 큰 단계는 H2, 세부 항목은 H3. 번호·기존 제목 앵커 유지 |
| 표 | OS·도구·버전·역할 비교 | 긴 실행 절차는 표 밖에 두고 차이와 선택 기준만 비교 |
| 굵게·코드 | 핵심 조건·파일명·명령 | 문장 전체를 반복 강조하지 않고 선택에 필요한 부분만 표시 |
| GitHub 알림 상자 | 필수 조건·데이터 손실·복원 주의 | 문서당 핵심 1~2개를 우선. 상자를 연달아 배치하거나 목록·접기 안에 중첩하지 않음 |
| details·summary | 선택적 호환 절차·긴 보충 설명 | 읽지 않아도 기본 흐름을 수행할 수 있는 내용에 사용 |
| Mermaid | 실제 구조·의존 방향·데이터 흐름 | 기존 코드와 일치하는 작은 도식. 장식용 도식은 추가하지 않음 |
| 이미지 | UI 위치·결과 화면 | 설명용 대체 텍스트와 상대 경로 사용. 개인정보·토큰을 가림 |
| 배지 | 빌드·검증 등 확인 가능한 상태 표시 | 필요한 경우에만 사용하고 날짜·버전을 여러 README에 중복 관리하지 않음 |

GitHub 알림은 일반 Markdown의 인용문을 확장한 문법입니다. VS Code 미리보기·다른 뷰어에서는 단순 인용문으로 보일 수 있고 Mermaid 지원도 다를 수 있습니다. GitHub Pages는 사용하는 렌더러·테마에 따라 표시가 달라집니다. 저장소 Markdown에 임의 CSS·JavaScript를 넣어 동일한 디자인을 보장하지 않습니다.

제목·본문·목록·접기 제목에는 이모지를 사용하지 않습니다. 배지는 사용할 수 있지만 실제 확인 가능한 상태를 나타낼 때만 추가하며, 배지의 대체 텍스트에도 의미를 명확히 씁니다.

## 알림 상자

GitHub는 NOTE·TIP·IMPORTANT·WARNING·CAUTION을 지원합니다. 본문에 이미 있는 핵심 조건을 상자로 바꾸며 같은 문장을 주변에 다시 복제하지 않습니다.

| 종류 | 사용할 때 |
| :--- | :--- |
| NOTE | 훑어볼 때 알아야 하는 배경·지원 범위 |
| TIP | 작업을 간단히 만드는 선택적 방법 |
| IMPORTANT | 성공에 필요한 필수 조건·버전·실행 위치 |
| WARNING | 실행 전에 확인할 호환성·데이터 손실 가능성 |
| CAUTION | 선택에 따른 부작용·복구하기 어려운 작업 |

원문:

```markdown
> [!IMPORTANT]
> 기존 프로젝트는 README·버전 파일·잠금 파일을 우선합니다.
```

표시 예:

> [!IMPORTANT]
> 기존 프로젝트는 README·버전 파일·잠금 파일을 우선합니다.

상자 안에서도 짧은 문장으로 이유·필요한 행동을 설명합니다. 색상이나 영어 종류명만 보고 뜻을 추측하게 하지 않습니다.

## 선택적 내용 접기

`summary`에는 무엇을 펼치는지 구체적으로 씁니다. 태그와 Markdown 본문 사이에 빈 줄을 두어 목록·코드 블록이 해석되도록 합니다.

```html
<details>
<summary>기존 pip 프로젝트의 추가 확인 사항</summary>

현재 인터프리터 경로와 requirements.txt를 확인합니다.

</details>
```

<details>
<summary>기존 pip 프로젝트의 추가 확인 사항</summary>

현재 인터프리터 경로와 requirements.txt를 확인합니다.

</details>

기본적으로 닫혀 있으며 `open` 속성을 주면 처음부터 펼쳐집니다. 중요한 경고·선행 조건·기본 실행 명령은 접지 않습니다. 외부에서 링크하는 제목은 접기 밖에 유지하고, 제목 변경 시 들어오는 앵커 링크도 갱신합니다.

## 코드·도식·이미지

- 코드 블록에는 bash·powershell·json·yaml·text 등 실제 내용에 맞는 언어를 지정합니다. 설명용 예시와 실제 실행 명령을 구분합니다.
- 코드 블록이나 HTML 태그를 목록에 넣을 때 들여쓰기와 빈 줄을 확인합니다. 구조를 단순하게 유지하고 깊은 중첩을 피합니다.
- Mermaid는 의존 관계인지 실행 순서인지 설명하고 기존 도식이 있으면 재사용합니다. 도식이 렌더링되지 않아도 본문으로 흐름을 이해할 수 있어야 합니다.
- 이미지는 `![무엇을 보여주는 화면인지](상대경로)`로 삽입합니다. 긴 문서를 이미지 한 장으로 대체하지 않습니다.

## 적용·확인 순서

1. 기존 제목·명령·링크·중요 조건을 읽고 어떤 요소가 읽기에 도움이 되는지 정합니다.
2. 핵심 경고는 본문에서 알림 상자로 변환하고, 표는 비교할 항목이 있을 때만 사용합니다. 필수 절차를 접기 안으로 옮기지 않습니다.
3. 변경 문서의 상대 링크·앵커·코드 펜스와 details/summary 태그 짝을 검사합니다. 내용이 바뀐 버전 문서의 patch를 올립니다. 새 절차를 추가했다면 저장소 버전 규칙을 따릅니다.
4. GitHub Preview에서 상자·접기·표·도식과 좁은 화면의 가독성을 확인합니다. 로컬 정적 검사만 했다면 실제 렌더링 확인과 구분해 보고합니다.

이 기준은 Setup·Tools·Boilerplates·Utilities·Servers에 공통 적용합니다. 독립 보일러플레이트 패키지는 필수 설명을 이 외부 문서 링크에 의존하지 않고 패키지 안에서 유지합니다.

## 웹 디자인 관리

GitHub Pages에서는 루트 README와 Setup·Tools·Boilerplates·Utilities·Servers의 Markdown에 공통 디자인을 적용합니다. 실행 샘플 안의 README도 같은 규칙을 따릅니다. 원본 Markdown의 제목·명령·첫 줄 버전은 유지하며 CSS 없이도 필요한 내용을 읽을 수 있어야 합니다. 이모지·외부 폰트·JavaScript는 추가하지 않습니다.

| 관리 파일 | 역할 |
| :--- | :--- |
| [_config.yml](../_config.yml) | 공통 레이아웃 기본값·상위 분류 메뉴·게시 제외 경로 |
| [docs.html](../_layouts/docs.html) | 문서 레이아웃·폴더별 문서 메뉴·경로·이전/다음·GitHub 원문 링크 |
| [docs.css](../assets/css/docs.css) | 모바일·다크 모드·표·코드·인쇄 스타일 |
| [index.html](../index.html) | 기본 주소에서 전체 안내 `README.html`로 이동 |

README는 `_config.yml`의 `include`에 루트 및 분류별 패턴을 등록해 변환 대상에 포함합니다. 새 분류를 만들면 이 패턴도 갱신합니다. 새 Markdown 문서는 메뉴의 `document_navigation`에 제목과 `.md` 경로를 등록합니다. 웹 레이아웃은 자동으로 사용하므로 개별 문서에 스타일·front matter를 복제하지 않습니다. 문서 링크는 `.md` 상대 경로로 작성하고 `jekyll-relative-links`가 웹 링크로 변환하도록 합니다. README는 `README.html` 경로를 유지하도록 `readme_index.enabled: false`로 설정합니다. 빈 보일러플레이트 폴더는 문서가 생기기 전까지 GitHub 원문 경로로 안내합니다.

사이드바는 실제 폴더 깊이를 따라 중첩합니다. 예를 들어 `Boilerplates → mobile-app → 설명서 · docs → boilerplate.md`, `Servers → docker-server → 언어별 환경 · environments → python → README.md`로 탐색합니다. 그룹 클릭은 펼치기·접기, 문서 링크는 이동으로 통일하며 현재 문서를 포함한 상위 폴더를 모두 펼칩니다. 같은 제목도 구분할 수 있게 링크 아래에 파일명을 표시하고 본문 위에는 전체 경로를 표시합니다. 모바일도 같은 구조이며 스크롤은 페이지 하나를 사용합니다.

메뉴는 파일명 정렬 대신 `_config.yml`의 `document_navigation` 순서를 사용합니다. 폴더 노드는 끝이 `/`인 `path`와 `children`, 문서 노드는 `.md`로 끝나는 `path`와 `title`을 작성합니다. 안내 → 상세 절차 → 샘플 → 작업 지침 → 갱신 이력 순서를 기본으로 하고 서버 구축은 준비 → 사용자 영역 생성 → 운영 순서를 우선합니다. 이전·다음 문서는 트리를 위에서 아래로 펼친 순서이며, 메뉴와 별도의 순서 목록을 관리하지 않습니다. OS별 설정·언어별 환경은 필요한 항목을 선택하는 분기이므로 `다음 문서`를 모두 실행해야 한다는 뜻은 아닙니다.

이미지 자산 내부의 README 등 독서 흐름과 무관한 Markdown은 메뉴에 넣지 않습니다. 문서는 직접 주소로 열 수 있습니다. 새 문서·이동·삭제·제목 변경 시 메뉴의 경로·제목·순서도 갱신합니다. 렌더링은 `_includes/navigation.html`, 읽는 순서는 `_includes/reading-order.html`에서 같은 트리를 사용합니다.

`issues/`는 게시에서 제외합니다. 루트 README의 issues 안내 링크만 레이아웃에서 GitHub 원문으로 연결합니다. CSS·레이아웃은 저장소 공통 자산이며 독립 보일러플레이트의 실행 코드에 복사하지 않습니다. Mermaid·GitHub 알림 상자는 별도 렌더러를 추가하지 않으므로 웹에서 코드·인용문으로 표시될 수 있습니다.

Jekyll은 코드 블록 안의 Liquid 구문도 처리합니다. Docker Go template처럼 중괄호가 연속되는 예제는 Docker 문서처럼 HTML 주석 안의 Liquid raw/endraw 태그로 감싸 원문 표시와 빌드를 함께 보존합니다. 새 예제를 추가할 때도 이 충돌을 확인합니다.

이미 Jekyll을 사용하는 환경에서는 저장소 루트에서 `jekyll build --destination /private/tmp/docs-site-preview`로 생성합니다. 새 의존성 설치 없이 가능한 정적 검사와 실제 빌드·화면 검증은 구분해 보고합니다. 루트·분류 목록·중첩 문서의 상대 링크와 제목 앵커, 좁은 화면, 다크 모드, 인쇄를 확인합니다. 공통 스타일만 바뀐 문서의 내용 버전은 일괄 변경하지 않습니다.

기본 주소까지 404라면 **Settings → Pages**의 게시 소스가 `main`의 `/(root)`인지 확인합니다. Actions 게시라면 배포 산출물 최상위에 `index.html`이 있어야 합니다. push 후 Pages 빌드·배포 성공을 확인하고 하위 URL의 대소문자를 맞춥니다. 프로젝트 사이트의 접두 경로는 `baseurl`로 설정하고 레이아웃에서는 `relative_url` 필터를 사용합니다. 저장소·브랜치가 바뀌면 `source_url`도 수정합니다.

## 공식 참고

문법 확인일: 2026-11-02. GitHub 문서와 대조했으며 GitHub·VS Code 미리보기의 실제 화면 렌더링은 확인하지 않았습니다.

- [GitHub 기본 문법·알림 상자](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)
- [접힌 섹션](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-collapsed-sections)
- [Mermaid 도식](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)

- [Pages 404 문제 해결](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)
- [README 경로 설정](https://github.com/benbalter/jekyll-readme-index)
- [Jekyll 코드 블록과 Liquid](https://jekyllrb.com/docs/liquid/tags/)

### 메뉴 정적 검사

저장소 루트의 기존 Ruby에서 실행합니다. 메뉴 경로의 존재·폴더 소속·중복을 확인하며 실제 Jekyll 렌더링 검사를 대신하지 않습니다.

```bash
ruby -EUTF-8 -ryaml -e '
paths = []
walk = lambda do |nodes, parent|
  nodes.each do |node|
    path = node.fetch("path")
    abort path unless path.start_with?(parent)
    if node["children"]
      abort path unless path.end_with?("/") && File.directory?(path)
      walk.call(node["children"], path)
    else
      abort path unless path.end_with?(".md") && File.file?(path)
      paths << path
    end
  end
end
walk.call(YAML.load_file("_config.yml").fetch("document_navigation"), "")
abort "duplicate navigation path" unless paths.uniq == paths
puts "Navigation OK: #{paths.size} documents"
'
```
