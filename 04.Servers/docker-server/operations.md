<!-- version: v1.0.0 -->
# Docker 작업 영역 서버 운영·버전·복구

[기본 구성](./README.md)을 완료한 뒤 적용합니다. 아래 Docker 명령은 해당 사용자 Compose 디렉터리에서 관리자가 실행합니다. 실제 서버 데이터에 적용하기 전 복사본에서 복원을 시험합니다.

## 1. 운영 범위

서버는 Docker Engine으로 관리하고 일반 사용자는 개인 작업 영역에만 접속합니다. 공통 구성은 [구축 안내](./README.md), 언어별 설정은 environments, RStudio·Jupyter·code-server 등은 [작업 영역 선택](./workspace-types.md)을 따릅니다.

Desktop에서 이전하는 경우 이미지·볼륨이 Engine으로 자동 이동되지 않습니다. 이미지 save/load, 볼륨 백업/복원, 실행 설정을 각각 준비합니다. 이미지 commit/save는 마운트 데이터 백업이 아닙니다.

## 2. 버전·사용자 운영 기록

| 기록 대상 | 남길 내용 |
| :--- | :--- |
| 호스트 | 서버명·OS·커널·CPU·Docker Engine·Compose 버전 |
| 배포 구성 | 이 저장소 Git 커밋·Dockerfile·Compose 버전 |
| 이미지 | 배포 태그·이미지 ID·레지스트리 digest·OS/CPU |
| 사용자 영역 | 사용자·담당자·Compose 프로젝트명·포트·볼륨 이름·UID/GID |
| 접속 | 공개키 지문·host key 지문·허용 IP/VPN·폐기 일자 |
| 프로젝트 | Node·Python·Flutter·R 등 버전 파일·잠금 파일 |
| 백업 | 시각·저장 위치·암호화·보관 기한·마지막 복원 검증 결과 |

```bash
uname -r
cat /etc/os-release
sudo docker version
sudo docker compose version
sudo docker compose images
sudo docker compose ps
```

운영 기록에는 실제 태그·커밋·볼륨명을 적고 개인 키·토큰·비밀번호는 넣지 않습니다. ubuntu:24.04와 apt 패키지는 시간에 따라 달라지므로 Dockerfile만으로 과거 바이너리를 완전히 재현할 수 없습니다. 검증한 이미지 자체를 레지스트리 또는 save 파일로 보관합니다. 필요하면 베이스 이미지 digest도 고정하고 보안 업데이트 때 새 digest로 검증합니다.

## 3. 새 버전 배포와 복귀

현재 .env의 WORKSPACE_IMAGE와 이미지 ID를 기록합니다. 새 버전 예시는 personal-workspace:1.1.0이며 실제로는 팀의 배포 버전 규칙을 사용합니다.

1. 작업 저장·점검 공지·백업을 완료합니다.
2. 한 빌드 디렉터리에서 WORKSPACE_IMAGE를 새 태그로 변경하고 `sudo docker compose build --pull workspace`로 빌드합니다. 같은 태그로 다른 내용을 재빌드하지 않습니다.
3. 시험 사용자·별도 홈 볼륨에서 SSH·VS Code·프로젝트 빌드·재생성을 검증합니다. 시험 영역도 고유 프로젝트명·포트·키를 사용합니다.
4. 사용자별 .env의 WORKSPACE_IMAGE만 검증한 태그로 변경합니다. 프로젝트명·포트·볼륨·키는 유지합니다.
5. `sudo docker compose up -d --no-build --pull never workspace`로 이미 준비한 이미지를 배포합니다. 다른 서버는 레지스트리 pull 또는 이미지 load를 먼저 수행합니다.
6. 사용자별 SSH·도구 버전·프로젝트·포트 전달을 확인하고 배포 기록을 남깁니다.

실패하면 .env를 이전 태그로 돌리고 같은 no-build 명령으로 재생성합니다. Compose·Dockerfile 변경도 해당 버전과 맞춥니다. 개인 home의 패키지·설정이나 데이터 형식까지 바뀌었다면 이미지 복귀만으로 해결되지 않으므로 백업 복원이 필요합니다.

기존 홈 볼륨은 이미지의 /home/developer 내용을 가립니다. 이미지에 새 셸 설정·도구를 넣었다고 기존 홈에 자동 배포되지 않습니다. 시스템 도구는 /usr/local 등 이미지 경로에 두고 홈의 설정 변경은 기존 파일 백업과 사용자별 적용 절차를 따릅니다. developer UID/GID도 버전 간 유지하고 임의의 chown -R로 맞추지 않습니다.

## 4. 홈 볼륨·접속 설정 백업

다음은 기본 alice 프로젝트의 home 볼륨 이름이 **workspace-alice_home인지 inspect로 확인한 경우**의 예시입니다. 다른 프로젝트에 그대로 실행하지 않습니다. 백업 디렉터리는 /srv/workspace-backups/alice로 고정해 예시를 일관되게 사용합니다.

```bash
sudo docker volume inspect workspace-alice_home
sudo install -d -m 0700 /srv/workspace-backups/alice
sudo docker compose stop workspace
```

Docker의 --mount는 존재하지 않는 볼륨 이름도 새로 만들 수 있으므로 앞서 확인한 정확한 이름을 사용합니다. 아래 파일명이 이미 있으면 새로운 시각의 이름으로 변경해 이전 백업을 덮어쓰지 않습니다.

```bash
sudo docker run --rm --network none --mount type=volume,src=workspace-alice_home,dst=/data,readonly --mount type=bind,src=/srv/workspace-backups/alice,dst=/backup ubuntu:24.04 tar czpf /backup/home-20261028-120000.tar.gz -C /data .
sudo tar czpf /srv/workspace-backups/alice/config-20261028-120000.tar.gz .env compose.yaml Dockerfile access
sudo chmod 0600 /srv/workspace-backups/alice/*.tar.gz
sudo docker compose start workspace
```

도우미 ubuntu 이미지도 엄격한 운영에서는 검증한 digest로 고정합니다. 두 백업 명령의 성공·파일 크기·해시를 확인하며 실패한 파일은 정상 백업으로 기록하지 않습니다. 중단된 작업을 재개할 수 있게 별도 관리 세션을 유지합니다.

백업에는 사용자 비밀값과 SSH host key가 포함될 수 있습니다. 관리자만 읽을 수 있게 저장하고 암호화해 별도 저장소에도 보관합니다. 같은 서버 디스크에만 둔 사본은 서버 손실에 대비한 백업이 아닙니다. 주기·보관 기한은 업무 데이터 손실 허용 시간과 복구 목표에 맞춰 정합니다.

DB를 추가한 경우 이 파일 압축 절차만 적용하지 않고 DB별 dump·일관성 보장 방법을 추가합니다. [Docker 볼륨 백업](https://docs.docker.com/engine/storage/volumes/)

## 5. 복원 연습

기존 home에 바로 덮어쓰지 않고 비어 있는 새 볼륨을 만듭니다. 아래 볼륨명이 이미 사용 중이면 새 이름을 선택합니다.

```bash
sudo docker volume create workspace-alice-restore-home
sudo docker run --rm --network none --mount type=volume,src=workspace-alice-restore-home,dst=/data --mount type=bind,src=/srv/workspace-backups/alice,dst=/backup,readonly ubuntu:24.04 tar xzpf /backup/home-20261028-120000.tar.gz -C /data
```

config 백업은 별도 복원 디렉터리에 풀고 프로젝트명·시험 포트·bind IP를 겹치지 않게 조정합니다. Compose의 home 정의에 아래를 적용해 실제 복원 볼륨을 연결합니다.

```yaml
volumes:
  home:
    external: true
    name: workspace-alice-restore-home
```

복구한 이미지 버전·host key와 홈의 UID/GID를 확인한 뒤 접속·파일·프로젝트 실행을 시험합니다. 백업 SSH 키는 실제 사용자 데이터에 대한 권한이므로 시험 환경도 외부 접근을 제한합니다. 성공 후 사용자와 점검 시간을 잡고 전환하며 이전 볼륨은 복구 확인 전 삭제하지 않습니다.

## 6. 감시·장애 확인·재접속

```bash
sudo docker stats --no-stream
sudo docker system df
df -h
df -i
sudo docker compose ps -a
sudo docker compose logs --tail=100 workspace
sudo docker compose port workspace 22
sudo docker compose exec workspace id developer
```

CPU·메모리 제한은 디스크 쿼터를 대신하지 않습니다. 홈·빌드 캐시·이미지·inode·백업 증가를 관찰하고 알림 담당자를 정합니다. 로그는 Compose의 크기·파일 수 제한을 유지합니다. 반복 재시작은 컨테이너 inspect의 State·OOMKilled·ExitCode도 확인합니다.

| 문제 | 확인·대응 |
| :--- | :--- |
| SSH 끊김 | 서버 경로·NAT·허용 IP·컨테이너 상태 확인. 필요 시 클라이언트 ServerAliveInterval 설정 |
| 키 거부 | 공개키 내용·authorized_keys 마운트·홈 권한·sshd 로그 |
| 서버 지문 변경 | 관리자 지문과 실제 host key 확인 후 해당 주소:포트 기록만 갱신 |
| 볼륨 권한 오류 | 실제 UID/GID·마운트·이전 이미지 사용자 ID 확인 |
| VS Code만 실패 | Remote SSH 로그·지원 OS·다운로드 접근·디스크 여유·기본 유틸리티 확인 |
| 공간 부족 | 사용량 확인 → 보존할 이미지·볼륨 확인 → 특정 불필요 대상만 제거 |

VS Code 창 종료만으로 이 Compose SSH 컨테이너가 자동 중지되는 것은 아닙니다. 중지했다면 compose start로 재개하고 같은 SSH 프로필로 접속합니다. Dockerfile이나 설정 변경이 없으면 재빌드할 필요가 없습니다.

호스트 Fail2ban의 sshd 규칙만으로 컨테이너 stdout의 SSH 로그까지 감시되지는 않습니다. 컨테이너 접속 방어가 필요하면 로그 수집·포트·차단 경로를 별도로 설계합니다. Portainer를 추가한다면 Docker socket 권한을 가진 관리자 도구로 취급하고 일반 사용자에게 공유하지 않습니다.
