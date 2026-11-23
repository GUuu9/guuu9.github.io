# 원격 개발 서버

서버 PC에 네트워크로 접속해 파일과 프로젝트를 사용하고, 필요하면 Docker 컨테이너에서 개발 도구를 실행합니다.

| 순서 | 안내 | 목적 |
| :--- | :--- | :--- |
| 1 | [Linux 원격 접속 서버](./01-linux-server.md) | Ubuntu Server 설치, SSH 키 접속, VS Code Remote-SSH, 서버 파일 접근 |
| 2 | [Docker 개발 환경](./02-docker-development.md) | Docker Engine 설치, `docker run`으로 컨테이너 실행, 프로젝트 경로 연결·포트 전달 |

Dockerfile·Compose 파일 없이 제공되는 이미지와 `docker run` 옵션으로 컨테이너를 구성합니다. 실행 명령과 이미지 버전을 작업 기록에 남겨 같은 개발 환경을 다시 실행합니다.
