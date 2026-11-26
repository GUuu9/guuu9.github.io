# 원격 개발 서버

서버 PC에 네트워크로 접속해 파일·프로젝트를 사용하고, 필요하면 Docker 개발 환경이나 SSH bare Git 저장소를 구성합니다.

| 순서 | 안내 | 목적 |
| :--- | :--- | :--- |
| 1 | [Linux 원격 접속 서버](./01-linux-server.md) | Ubuntu Server 최소 설치, 고정 IP, 추가 디스크와 경로, 관리자·작업자 계정, LAN SSH |
| 2 | [Docker 개발 환경](./02-docker-development.md) | Docker Engine, 프로젝트별 bind mount, SSH 이후 작업, 개발 포트, 환경 공유 |
| 3 | [SSH Git bare 저장소](./03-bare-git-server.md) | Linux bare 저장소 생성, SSH 키, push·clone, 소유권, 백업·복구 |

Dockerfile·Compose 파일 없이 제공되는 이미지와 `docker run` 옵션으로 컨테이너를 구성합니다. 실행 명령과 이미지 버전을 작업 기록에 남겨 같은 개발 환경을 다시 실행합니다.
