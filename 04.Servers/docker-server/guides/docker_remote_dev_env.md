<!-- version: v2.0.0 -->
# 1. 서버용 PC 준비와 Docker Engine

대상은 Ubuntu Server 24.04 LTS 기반의 상시 가동 서버용 PC입니다. 서버에 데스크톱 GUI가 있어도 이 구성은 Docker Engine의 시스템 서비스를 사용합니다. 사용자별 SSH 컨테이너에는 KVM이 필요하지 않습니다.

## 역할과 준비 정보

| 위치 | 담당 작업 |
| :--- | :--- |
| 서버용 PC·관리자 | Docker 설치, 이미지 빌드·배포, 공개키·포트·볼륨 관리, 백업 |
| 개인 PC·사용자 | SSH 키 생성, VS Code Remote - SSH 설치, 할당된 작업 영역 접속 |
| 서버의 사용자 컨테이너 | 프로젝트·런타임 설치, 개발·빌드·테스트 |

서버 OS·CPU·메모리·디스크·고정 주소 또는 DHCP 예약, NAT·VPN·허용 IP, 관리자 접속 경로를 기록합니다. 자원은 작업별 요구량과 동시 사용자 수로 산정하며 일괄 최소 사양을 보장하지 않습니다.

## 설치

[공통 서버 구성 2절](../README.md#2-서버-준비와-docker-설치)에 따라 OS 업데이트와 Docker 공식 apt 저장소 등록·Engine·Compose 설치를 진행합니다. [Docker 공식 Ubuntu 설치](https://docs.docker.com/engine/install/ubuntu/)에서 현재 지원 OS·CPU를 확인합니다.

```bash
sudo systemctl status docker
sudo docker version
sudo docker compose version
sudo docker context show
sudo docker run --rm hello-world
```

기존 Engine·Desktop·컨테이너 데이터가 있으면 사용 context·볼륨·서비스를 조사한 뒤 전환합니다. 기존 패키지를 무조건 제거하지 않습니다. Engine으로 전환해도 Desktop VM의 볼륨은 자동 이전되지 않습니다.

## 관리 권한과 외부 접근

일반 사용자는 서버 호스트의 sudo·docker 그룹·Docker socket 권한을 받지 않습니다. 호스트 SSH는 관리용이며 사용자 컨테이너의 SSH 포트와 구분합니다. Docker TCP 2375/2376은 열지 않습니다.

서버 주소·관리 SSH 포트·사용자별 포트·허용 IP/VPN·담당자를 기록합니다. 사용자별 포트는 겹치지 않게 할당하되 애플리케이션 포트는 기본적으로 SSH 터널로 전달합니다.

방화벽 변경 전에 콘솔·기존 SSH 세션을 확보하고 관리자 허용 규칙을 먼저 만듭니다. 새 세션 접속을 확인한 뒤 제한을 적용합니다. 원격 Netplan 변경은 실제 인터페이스·주소·게이트웨이를 확인하고 되돌릴 수 있게 netplan try 등 복구 가능한 절차로 적용합니다. 예시 주소를 그대로 넣지 않습니다.

Docker가 공개한 포트는 UFW 일반 규칙을 우회할 수 있습니다. 상위 방화벽·VPN과 Docker 백엔드 규칙을 확인하고 허용·비허용 네트워크에서 모두 검증합니다. [공식 방화벽 제한](https://docs.docker.com/engine/install/ubuntu/#firewall-limitations)

## 다음 단계

[작업 영역 생성](./docker_container_setup.md)으로 진행합니다. RStudio·Jupyter·code-server·Android·Windows GUI는 기본 SSH 구성에 모두 넣지 않고 필요한 작업 영역만 별도 설계합니다.
