<!-- version: v1.2.0 -->
# 서버 작업 영역 종류와 이미지 선택

확인일: 2026-10-28. [기본 서버 구성](./README.md)은 사용자별 SSH 작업 영역입니다. 작업 성격에 따라 RStudio·JupyterLab·브라우저 IDE를 별도 컨테이너로 제공할 수 있습니다. 하나의 이미지에 전부 설치하지 않고 필요한 환경을 선택합니다.

## 종류 비교

| 작업 영역 | 이미지·구성 후보 | 접속 | 주로 보존할 데이터 |
| :--- | :--- | :--- | :--- |
| R CLI | `rocker/r-ver` | SSH 작업 영역에 도구 통합 또는 배치 실행 | R 소스·데이터·renv.lock |
| RStudio Server | `rocker/rstudio`, `rocker/tidyverse` | 브라우저, 기본 컨테이너 포트 8787 | 사용자 home·프로젝트·R 패키지 환경 |
| JupyterLab | `quay.io/jupyter/base-notebook`, `quay.io/jupyter/scipy-notebook` | 브라우저, 기본 컨테이너 포트 8888 | notebook·데이터·추가 패키지 선언 |
| R 노트북 | `quay.io/jupyter/r-notebook` | JupyterLab에서 R 커널 | notebook·R 패키지 환경 |
| 개인 PC VS Code | 기존 SSH 작업 영역 + Remote - SSH | 개인 PC의 VS Code | 원격 home·소스·확장 설정 |
| 브라우저 코드 편집기 | `ghcr.io/coder/code-server` | 브라우저, 이미지 기본 실행 설정 확인 | 사용자 home·소스·에디터 설정 |
| Microsoft VS Code 웹 접속 | 공식 Remote Tunnels | 계정 인증 후 웹·데스크톱 | 원격 작업 폴더·사용자 설정 |
| Android CLI 빌드 | 프로젝트 전용 JDK·Android SDK 이미지 | SSH·CI·VS Code | 소스·Gradle 설정·빌드 결과 |
| Android Studio GUI | Linux GUI·원격 데스크톱 또는 전용 VM | 원격 데스크톱 | 사용자 home·SDK·프로젝트 |

이미지 이름 뒤에는 사용 시점에 실제 제공되는 검증한 태그 또는 digest를 지정합니다. 위 목록은 동일 제작사의 이미지라는 뜻이 아니며 CPU·OS·GPU 조건과 라이선스는 각각 확인합니다.

## R·RStudio Server

R만 실행하면 R 버전을 고정한 rocker/r-ver를, 브라우저 IDE가 필요하면 rocker/rstudio를 선택합니다. tidyverse는 관련 패키지를 포함한 선택지입니다. RStudio Server는 웹 로그인 계정·비밀번호 설정이 필요하며 인증을 끄는 DISABLE_AUTH 설정을 외부 작업 영역에 사용하지 않습니다.

사용자별 컨테이너·home·포트를 분리하고 비밀번호는 저장소에 커밋하지 않습니다. RStudio 로그인 계정과 서버 관리자의 계정은 구분합니다. R 패키지는 프로젝트의 renv.lock 등으로 기록하고 컨테이너 수동 설치만으로 환경을 관리하지 않습니다.

공식 참고: [Rocker RStudio 이미지·인증·사용자 설정](https://rocker-project.org/images/versioned/rstudio.html).

## JupyterLab·노트북

Jupyter Docker Stacks는 Quay.io의 프로젝트 배포 이미지를 사용합니다. 기본 notebook, 과학 계산용 scipy-notebook, R 커널을 포함한 r-notebook 등에서 필요한 것을 선택합니다. Python·R 버전과 포함 패키지가 이미지별로 다르므로 프로젝트에 맞춰 확인합니다.

초기 token 또는 설정한 비밀번호 인증을 유지합니다. token URL과 로그는 자격증명이므로 그대로 공유하지 않습니다. notebook뿐 아니라 데이터와 추가 패키지 선언도 보관합니다. 사용자별 서버로 시작하고 다수 사용자 로그인·작업 영역 생성을 한 서비스에서 관리해야 하면 JupyterHub를 별도 설계합니다.

공식 참고: [이미지 선택](https://jupyter-docker-stacks.readthedocs.io/en/latest/using/selecting.html), [실행·영속 저장](https://jupyter-docker-stacks.readthedocs.io/en/latest/using/running.html).

## Jupyter·R 그래프의 한글 폰트

호스트에 D2Coding 같은 한글 폰트가 있어도 컨테이너에 자동 설치되지 않습니다. 먼저 깨지는 위치를 구분합니다.

| 증상 | 확인할 영역 |
| :--- | :--- |
| 그래프·PNG·PDF의 한글이 네모이거나 Glyph missing 경고 | 컨테이너 폰트와 Python/R 렌더링 설정 |
| Markdown·코드 편집기 글자만 깨짐 | 브라우저/개인 PC 폰트·에디터 설정 |
| 문자열 자체가 물음표·다른 문자로 바뀜 | 파일/입출력 인코딩·locale. 폰트 설치로 손상된 문자열은 복구되지 않음 |

### 1. 파생 이미지에 설치

관리자가 Docker 빌드를 실행할 PC·서버에서 작업합니다. 아래는 **Debian/Ubuntu 기반 Jupyter Docker Stacks 전용** Dockerfile 예제입니다. base-notebook에 Matplotlib/R이 반드시 포함되는 것은 아니므로 현재 프로젝트에 맞는 scipy-notebook·r-notebook 등을 선택합니다. OS 패키지·그림 라이브러리는 별개입니다.

빌드할 폴더에 [D2Coding 공식 배포](https://github.com/naver/d2-coding-font/releases)의 **일반형 Regular TTF**와 배포에 포함된 라이선스/저작권 문서를 준비합니다. TTC·Ligature 버전과 혼용하지 않습니다. 아래 예제에서는 받은 TTF의 파일명만 D2Coding.ttf로 맞춥니다. 이미 사용하던 D2Coding-Ver1 계열도 같은 방식으로 넣을 수 있으며 실제 파일의 내부 family 이름을 확인합니다.

```text
작업폴더/
├── Dockerfile
└── fonts/
    ├── D2Coding.ttf
    └── LICENSE.md
```

D2Coding은 SIL OFL 1.1로 배포됩니다. 이미지에 폰트를 포함해 배포할 때도 원본의 저작권·라이선스 문서를 함께 보존합니다. 폰트 파일을 이 문서 저장소에 추가하는 절차는 아닙니다.

```dockerfile
ARG BASE_IMAGE
FROM ${BASE_IMAGE}
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends fontconfig \
    && rm -rf /var/lib/apt/lists/*
COPY fonts/D2Coding.ttf fonts/LICENSE.md /usr/local/share/fonts/d2coding/
RUN chmod 0644 /usr/local/share/fonts/d2coding/D2Coding.ttf /usr/local/share/fonts/d2coding/LICENSE.md \
    && fc-cache -f
USER ${NB_UID}
```

BASE_IMAGE에는 공식 배포에서 확인한 실제 태그/digest를 전달합니다. Jupyter의 기존 실행 사용자로 되돌리며 ENTRYPOINT/CMD·인증 설정은 변경하지 않습니다. Rocker의 Debian/Ubuntu 파생 이미지에도 같은 fontconfig 설치·COPY·캐시 갱신 블록을 사용할 수 있지만 USER는 해당 이미지의 기존 설정을 유지합니다. RStudio 초기화 사용자와 Jupyter의 NB_UID를 혼용하지 않습니다. Alpine 등 다른 배포판에는 apt 명령을 사용하지 않습니다.

```bash
# 빌드할 개인 PC/서버. 이미지와 태그는 실제 확인값으로 교체합니다.
docker build --build-arg BASE_IMAGE='quay.io/jupyter/scipy-notebook:검증한태그' -t notebook-d2coding:0.1.0 .
```

새 태그로 빌드한 뒤 기존 포트·인증·사용자별 볼륨 설정을 유지해 컨테이너를 재생성합니다. 기존 notebook·R 프로젝트·패키지 선언과 데이터는 먼저 백업하고 볼륨을 삭제하지 않습니다. 실행 중인 컨테이너에만 apt로 설치하면 컨테이너 교체 때 사라지므로 최종 설정은 Dockerfile로 관리합니다. 기존 기본 SSH Dockerfile에는 이 패키지를 일괄 추가하지 않습니다.

### 2. 컨테이너에서 설치 확인

접속한 notebook/R 컨테이너의 일반 사용자 터미널에서:

```bash
cat /etc/os-release
fc-list :lang=ko family file
fc-match D2Coding
test -r /usr/local/share/fonts/d2coding/D2Coding.ttf
```

fc-match는 요청한 폰트가 없어도 대체 폰트를 반환하므로 출력이 D2Coding인지 확인합니다. family가 다르면 아래 R 설정에도 실제 내부 이름을 사용합니다. 파일이 없으면 COPY 경로·빌드 컨텍스트·.dockerignore를 확인합니다. 폰트 설치 후 기존 Python/R 커널·세션도 재시작합니다.

### 3. Python·Matplotlib

notebook의 **그래프를 그리는 Python 커널**에서 먼저 실행합니다. Matplotlib이 설치된 프로젝트 환경을 사용합니다. 명시적 파일 등록은 오래된 Matplotlib 폰트 목록을 사용하더라도 해당 폰트를 현재 프로세스에 추가합니다.

```python
from pathlib import Path
import matplotlib.pyplot as plt
from matplotlib import font_manager

font_path = Path('/usr/local/share/fonts/d2coding/D2Coding.ttf')
if not font_path.is_file():
    raise FileNotFoundError(font_path)
font_manager.fontManager.addfont(str(font_path))
font_name = font_manager.FontProperties(fname=str(font_path)).get_name()
plt.rcParams['font.family'] = [font_name]
# 음수 기호 글리프가 없는 폰트에서도 마이너스를 표시합니다.
plt.rcParams['axes.unicode_minus'] = False

plt.plot([-1, 0, 1], [1, 0, 1])
plt.title('한글 그래프 확인')
plt.xlabel('시간')
plt.savefig('korean-font-check.png')
plt.savefig('korean-font-check.pdf')
plt.show()
plt.close()
```

addfont 등록은 영구 캐시 설정이 아니므로 새 커널에서도 초기화 셀/프로젝트 설정으로 다시 실행합니다. Seaborn 테마가 rcParams를 덮어쓴다면 테마 적용 뒤 폰트를 지정합니다. 전체 캐시를 삭제하는 명령부터 실행하지 않습니다.

### 4. R·ggplot2

**그림을 만드는 R 커널/RStudio 세션**에서 실행합니다. 아래는 추가 R 패키지 없이 Cairo 지원 R에서 PNG·PDF를 확인하는 예입니다.

```r
stopifnot(isTRUE(capabilities('cairo')))

png('korean-font-check-r.png', width = 800, height = 600,
    type = 'cairo', family = 'D2Coding')
plot(-1:1, c(1, 0, 1), main = '한글 그래프 확인', xlab = '시간')
dev.off()

cairo_pdf('korean-font-check-r.pdf', family = 'D2Coding')
plot(-1:1, c(1, 0, 1), main = '한글 PDF 확인', xlab = '시간')
dev.off()
```

ggplot2가 있는 프로젝트는 plot에 theme(text = element_text(family = 'D2Coding'))를 적용하고, PDF 저장은 ggsave의 device = grDevices::cairo_pdf를 사용합니다. 기본 pdf()와 Cairo 장치는 폰트 처리 방식이 다르므로 family만 같다고 모든 장치에서 동작한다고 가정하지 않습니다. Cairo 지원이 없으면 해당 R 이미지의 그래픽 빌드를 확인하거나 프로젝트에서 ragg/showtext 등 별도 장치를 검증합니다. 패키지는 프로젝트 잠금으로 관리합니다.

### 5. 산출물·재생성 확인

notebook 화면뿐 아니라 저장한 PNG/PDF를 개인 PC에서 열어 한글·굵기·음수 기호를 확인합니다. notebook 전체 PDF 내보내기는 Matplotlib/R 그래프 PDF와 별개이며 nbconvert의 LaTeX/브라우저 렌더러에도 폰트 설정이 필요할 수 있습니다. 컨테이너 재생성 뒤 같은 코드로 확인하고 base digest·OS/CPU·D2Coding 배포 버전·TTF SHA-256·Python/R·라이브러리 버전과 실제 검사일을 프로젝트에 기록합니다.

절차 근거 확인일: 2026-11-05. 이번 문서 작성에서 이미지를 빌드하거나 Python/R 그래프를 실제 렌더링하지 않았습니다.

공식 근거: [Jupyter 파생 이미지·환경 보존](https://jupyter-docker-stacks.readthedocs.io/en/latest/using/faq.html), [D2Coding 공식 배포](https://github.com/naver/d2-coding-font/releases), [D2Coding 라이선스](https://github.com/naver/d2-coding-font/blob/master/LICENSE.md), [Matplotlib 폰트 등록](https://matplotlib.org/stable/api/font_manager_api.html), [R PNG 장치](https://www.stat.ethz.ch/R-manual/R-patched/library/grDevices/html/png.html), [R Cairo 장치](https://www.stat.math.ethz.ch/R-manual/R-devel/library/grDevices/html/cairo.html).

## VS Code·code-server 구분

기존 템플릿은 **개인 PC의 VS Code가 SSH로 컨테이너에 연결**하는 방식입니다. 컨테이너에 VS Code GUI를 설치할 필요가 없습니다.

브라우저만으로 접속하려면 code-server를 추가할 수 있습니다. code-server는 Coder가 제공하는 별도 배포이며 Microsoft VS Code의 배포·확장 마켓플레이스와 동일하다고 가정하지 않습니다. 필요한 확장과 인증 방식을 먼저 확인합니다. 공식 Remote Tunnels는 다른 선택지이며 일반적인 서버 주소:포트 직접 접속과 계정·중계 연결 방식이 다릅니다.

공식 참고: [code-server 설치·Docker](https://coder.com/docs/code-server/install), [Microsoft Remote Tunnels](https://code.visualstudio.com/docs/remote/tunnels).

## Android Studio와 빌드 컨테이너

Android SDK·JDK를 넣은 **빌드 이미지**와 Android Studio 창을 조작하는 **GUI 작업 영역**은 구분합니다. 빌드만 필요하면 Gradle Wrapper·프로젝트 요구 JDK·SDK·NDK를 갖춘 컨테이너가 더 간단합니다. Android Studio GUI는 디스플레이 서버와 원격 데스크톱, GPU·입력 지원까지 필요합니다.

개인 PC에 연결한 USB 실기기는 원격 서버 컨테이너에 자동으로 전달되지 않습니다. 실기기 디버깅은 로컬 Android Studio를 우선하고, 원격 기기 접근이 필요하면 별도 연결·접근 제어를 설계합니다. adb 5037 포트를 인터넷에 공개하지 않습니다. 에뮬레이터는 KVM·중첩 가상화·자원 조건까지 확인해야 하므로 사전 설치하지 않습니다.

현재 이 문서에서는 검증하지 않은 Android Studio 컨테이너를 Google 공식 이미지로 소개하지 않습니다. GUI 원격 사용이 필요하면 전용 VM과 제3자 이미지의 유지보수·권한 요구를 비교한 뒤 선택합니다. iOS 빌드는 이 Linux 작업 영역으로 대체하지 않습니다.

공식 참고: [Android Studio 요구 조건](https://developer.android.com/studio/install).

## 브라우저 작업 영역의 공통 접속·운영 규칙

기본 SSH 이미지에 웹 IDE 포트만 추가한다고 해당 IDE가 설치되는 것은 아닙니다. 각 이미지의 시작 명령·사용자 UID·저장 경로·인증 설정에 맞춘 별도 Compose 서비스를 작성합니다. 이미지 간 사용자 home 볼륨을 무작정 공유하지 않습니다.

처음에는 웹 포트를 서버의 127.0.0.1에만 바인딩하고 관리자 또는 제한된 터널 계정의 SSH 터널로 확인합니다. 예를 들어 서버의 RStudio 포트를 127.0.0.1:18787로 공개한 경우, 개인 PC에서:

```bash
ssh -N -L 127.0.0.1:8787:127.0.0.1:18787 터널계정@서버주소
```

브라우저에서 http://localhost:8787 을 엽니다. 이 SSH 계정은 **호스트 측**에서 18787에 접근할 수 있어야 하며 기본 컨테이너 developer 계정과 다릅니다. 터널 전용 사용자는 포워딩 목적지·쉘 권한을 제한하도록 별도 구성합니다.

여러 사용자가 주소:포트로 직접 접속해야 하면 VPN 또는 인증·HTTPS 리버스 프록시를 적용합니다. 평문 HTTP·공유 비밀번호만으로 웹 IDE를 공인 인터넷에 공개하지 않습니다. 사용자별 인증·포트·볼륨·CPU·메모리 제한과 백업을 정의하고, 이미지 업데이트 전 기존 notebook·R 프로젝트·확장의 호환성을 확인합니다.
