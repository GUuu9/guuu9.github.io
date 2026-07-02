# 📑 DevGuide Portal
> **개발 중 자주 필요하거나 잊어버리기 쉬운 초기 셋업 및 가이드 모음집입니다.**  
> 필요한 가이드를 신속하게 찾아 적용할 수 있도록 카테고리별로 정리되어 있습니다.

<br />

## 🗺️ Quick Links (바로가기)

<table>
  <tr>
    <td align="center"><a href="#-pc-setup">💻<br><b>PC Setup</b></a></td>
    <td align="center"><a href="#-antigravity">🌌<br><b>Antigravity</b></a></td>
    <td align="center"><a href="#-docker">🐳<br><b>Docker</b></a></td>
    <td align="center"><a href="#-docs">📄<br><b>General Docs</b></a></td>
  </tr>
</table>

---

## 💻 PC Setup
> 로컬 컴퓨터 및 AI 개발 환경을 처음 설정할 때 참고하는 가이드입니다.

| 가이드 문서 | 설명 | 마지막 업데이트 | 버전 |
| :--- | :--- | :--- | :--- |
| 🛠️ **[OS Development Setting](./setup/_OS_Dev_Setting.md)** | 개발 PC 초기 OS 셋업 및 기본 구성 | `2026.07.02` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |
| 🤖 **[LM Studio & Pi Coding Agent Setting](./setup/_LM_Studio_Pi_Coding_Agent.md)** | 로컬 LLM 및 코딩 어시스턴트(AI) 구성 | `2026.07.02` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |

<br />

## 🌌 Antigravity
> Google Antigravity 개발 도구 사용을 위한 가이드입니다.

| 가이드 문서 | 설명 | 마지막 업데이트 | 버전 |
| :--- | :--- | :--- | :--- |
| 🚀 **[Google Antigravity Cli](./antigravity/_antigravity_cli.md)** | AGY CLI 사용법 및 주요 명령어 가이드 | `2026.07.02` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |

<br />

## 🐳 Docker
> Docker 환경 구성 및 Devcontainer 환경 템플릿입니다.

| 가이드 문서 | 설명 | 마지막 업데이트 | 버전 |
| :--- | :--- | :--- | :--- |
| 🌐 **[Docker Remote Dev Env](./docker/_docker_remote_dev_env.md)** | 원격 Docker 서버 구축 및 셋업 가이드 | `2026.07.02` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |
| 📦 **[Docker Devcontainer](./docker/_dev_container.md)** | VS Code Devcontainer를 활용한 개발 환경 일괄 구성 | `2026.07.02` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |

### 🛠️ Devcontainer Templates
개발 목적별 즉시 사용 가능한 Devcontainer 환경입니다.
* 📱 **[Flutter](./docker/devcontainer/flutter/README.md)** (최근 점검: `2026.07.02`)
* 🐧 **[Ubuntu 22.04](./docker/devcontainer/ubuntu/README.md)** (최근 점검: `2026.07.02`)

<br />

## 📄 Docs
> 버전 관리 및 가상 환경 등 일반적인 개발 도구 관련 가이드입니다.

| 가이드 문서 | 설명 | 마지막 업데이트 | 버전 |
| :--- | :--- | :--- | :--- |
| 🐙 **[GITHUB Guide](./docs/_github.md)** | Git/GitHub 사용 시 자주 쓰거나 유용한 기능 정리 | `2026.07.02` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |
| 🐍 **[VENV Guide](./docs/_venv.md)** | Python 가상환경(venv) 생성 및 관리 가이드 | `2026.07.02` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |

<br />

---

## ⚙️ 자동 업데이트 파이프라인 (CI/CD)
이 보드(README.md)는 GitHub Actions를 통해 **자동으로 갱신**됩니다. 

### 1. 마지막 업데이트 날짜 자동 반영
가이드 문서(`.md`)를 수정한 후 repository에 `push`하면, Git 커밋 히스토리를 분석하여 `마지막 업데이트` 날짜가 최신 커밋 일자로 자동 갱신됩니다.

### 2. 가이드 버전 연동 방법
개별 가이드 문서 내부에 버전을 명시하면, README의 버전 배지가 자동으로 연동됩니다. 가이드 문서 상단(첫 30줄 이내)에 아래와 같이 버전을 표기해 주세요.
* **표기 형식 예시** (세 가지 중 하나 사용):
  ```markdown
  <!-- version: v1.1.0 -->
  ```
  또는
  ```markdown
  version: v1.1.0
  ```
  또는
  ```markdown
  # Version v1.1.0
  ```

### 3. 로컬에서 수동 업데이트 실행
GitHub에 올리기 전 로컬에서 수동으로 README를 미리 업데이트하려면 아래 명령어를 실행하십시오.
```bash
python update_readme.py
```