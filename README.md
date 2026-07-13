# 📑 DevGuide Portal
> **개발 중 자주 필요하거나 잊어버리기 쉬운 초기 셋업 및 가이드 모음집입니다.**  
> 필요한 가이드를 신속하게 찾아 적용할 수 있도록 카테고리별로 정리되어 있습니다.

<br />

## Quick Links (바로가기)

<table>
  <tr>
    <td align="center"><a href="#-pc-setup"><b>PC Setup</b></a></td>
    <td align="center"><a href="#-antigravity"><b>Antigravity</b></a></td>
    <td align="center"><a href="#-docker"><b>Docker</b></a></td>
    <td align="center"><a href="#-docs"><b>General Docs</b></a></td>
  </tr>
</table>

---

## PC Setup
> 로컬 컴퓨터 및 AI 개발 환경을 처음 설정할 때 참고하는 가이드입니다.

| 가이드 문서 | 설명 | 마지막 업데이트 | 버전 |
| :--- | :--- | :--- | :--- |
| **[OS Development Setting](./setup/OS_Dev_Setting.md)** | 개발 PC 초기 OS 셋업 및 기본 구성 | `2026.07.06` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |
| **[LM Studio & Pi Coding Agent Setting](./setup/LM_Studio_Pi_Coding_Agent.md)** | 로컬 LLM 및 코딩 어시스턴트(AI) 구성 | `2026.07.06` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |

<br />

## Antigravity
> Google Antigravity 개발 도구 사용을 위한 가이드입니다.

| 가이드 문서 | 설명 | 마지막 업데이트 | 버전 |
| :--- | :--- | :--- | :--- |
| **[Google Antigravity Cli](./antigravity/antigravity_cli.md)** | AGY CLI 사용법 및 주요 명령어 가이드 | `2026.07.06` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |

<br />

## Docker
> Docker 및 Devcontainer 환경 구축, 운영 관리에 대한 가이드 모음입니다.

| 가이드 문서 | 설명 | 마지막 업데이트 | 버전 |
| :--- | :--- | :--- | :--- |
| **[Docker Remote Dev Env (1편: 호스트 설정)](./docker/docker_remote_dev_env.md)** | Ubuntu 26.04 기반 호스트 OS 및 Docker Desktop 설치 | `2026.07.06` | ![Version v1.0.1](https://img.shields.io/badge/version-v1.0.1-blue?style=flat-square) |
| **[Docker Container Setup (2편: 개발 환경)](./docker/docker_container_setup.md)** | Linux, code-server, Windows 등 개발 컨테이너 구축 | `2026.07.06` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |
| **[Docker Management & Ops (3편: 운영 및 장애 대응)](./docker/docker_management_ops.md)** | 포트포워딩, 백업, 보안설정 및 VS Code 연동 에러 트러블슈팅 | `2026.07.06` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |

### Devcontainer Templates
개발 목적별 즉시 사용 가능한 Devcontainer 환경입니다.

| 템플릿 | 설명 | 포트 | 최근 점검 |
| :--- | :--- | :-: | :-: |
| **[Flutter](./docker/devcontainer/flutter/README.md)** | Flutter + Android SDK + ADB 연동 | `2220` (SSH), `5037` (ADB) | - |
| **[Ubuntu 26.04](./docker/devcontainer/ubuntu/README.md)** | 순수 Ubuntu 기반, SSH 원격 연결 지원 | `2224` (SSH) | `2026.07.07` |
| **[Python](./docker/devcontainer/python/README.md)** | Python 3 + venv + Black/Pylint | `2223` (SSH), `8000` (Web) | - |
| **[Rust](./docker/devcontainer/rust/README.md)** | Rust + Cargo + rust-analyzer | `2225` (SSH), `8080` (Web) | - |
| **[Node.js](./docker/devcontainer/nodejs/README.md)** | Node.js (nvm) + ESLint + Prettier | `2222` (SSH), `3000` (Web), `80`, `443` | `2026.07.07` |
| **[TypeScript](./docker/devcontainer/typescript/README.md)** | TypeScript + nvm + Node.js + ts-node | `2226` (SSH), `3000` (Web) | - |
| **[Go](./docker/devcontainer/go/README.md)** | Go + go.mod + Language Server | `2221` (SSH), `8080` (Web) | - |



<br />

## Docs
> 버전 관리 및 가상 환경 등 일반적인 개발 도구 관련 가이드입니다.

| 가이드 문서 | 설명 | 마지막 업데이트 | 버전 |
| :--- | :--- | :--- | :--- |
| **[GITHUB Guide](./docs/github.md)** | Git/GitHub 사용 시 자주 쓰거나 유용한 기능 정리 | `2026.07.13` | ![Version v1.0.1](https://img.shields.io/badge/version-v1.0.1-blue?style=flat-square) |
| **[GitHub Actions Guide](./docs/github_actions.md)** | GitHub Actions 핵심 개념, YAML 문법 및 실전 활용 예시 | `2026.07.06` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |
| **[VENV Guide](./docs/venv.md)** | Python 가상환경(venv) 생성 및 관리 가이드 | `2026.07.06` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |
| **[ㅕV Guide](./docs/uv.md)** | Python 가상환경(uv) 생성 및 관리 가이드 | `2026.07.09` | ![Version v1.0.0](https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square) |

<br />

---

## README 수동 업데이트 가이드

이 보드(README.md)는 커밋 충돌 방지 및 히스토리 정합성을 위해 GitHub Actions를 통한 자동 커밋 대신 **수동 업데이트 방식**으로 관리됩니다.

### 1. 가이드 버전 표기 방법
각 가이드 문서(`.md`)의 상단(첫 30줄 이내)에 버전을 아래 형식 중 하나로 기록해 두면 업데이트 스크립트가 이를 감지하여 반영합니다.
* **표기 형식 예시**:
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

### 2. 업데이트 실행 방법
가이드 문서를 새로 생성하거나 내용을 수정한 후, **커밋 및 푸시를 진행하기 전에** 로컬 터미널에서 아래 스크립트를 실행해 주세요. 스크립트가 각 문서의 최근 수정 날짜와 버전을 분석하여 README.md의 테이블을 최신화합니다.
```bash
python update_readme.py
```