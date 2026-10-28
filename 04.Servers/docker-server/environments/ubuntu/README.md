<!-- version: v2.0.0 -->
# 서버 작업 영역 기본 사용

이 문서는 **서버 관리자가 만든 SSH 컨테이너에 접속한 developer 사용자**가 실행하는 언어 설정입니다. 개인 PC의 로컬 Docker·Reopen in Container 절차가 아닙니다. 서버 생성·포트·키·볼륨은 [공통 구성](../../guides/docker_container_setup.md)을 따릅니다. 


## 접속·파일 위치

```bash
whoami
hostname
pwd
id
mkdir -p ~/projects
```

계정은 developer이고 프로젝트는 /home/developer/projects 아래에 둡니다. 홈은 개인 named volume으로 유지됩니다. /tmp·컨테이너 쓰기 영역에만 중요한 파일을 두지 않습니다.

## 권한과 도구

sudo·호스트 Docker socket은 제공하지 않습니다. 시스템 라이브러리가 필요하면 관리자가 공통 Dockerfile에 추가하고 새 이미지 버전으로 배포합니다. 사용자 도구는 홈에 설치하고 버전을 기록합니다.

## VS Code·재접속

개인 PC의 Remote - SSH로 할당된 컨테이너에 직접 연결하고 원격 프로젝트 폴더를 엽니다. 확장은 원격 환경에 필요한 것만 설치합니다. 창을 닫아도 컨테이너는 유지되며 같은 SSH 프로필로 돌아옵니다. 관리자가 stop한 경우 재개를 요청합니다.

