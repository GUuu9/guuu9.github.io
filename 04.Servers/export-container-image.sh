#!/usr/bin/env bash
set -euo pipefail
umask 077
set -o noclobber

sudo docker ps -a
read -r -p '내보낼 컨테이너 이름: ' container
read -r -p '새 이미지 이름:태그 (예: dev-environment:2026-11-27): ' image
read -r -p '저장할 아카이브 경로 (.tar): ' archive

if [[ ! $container =~ ^[a-zA-Z0-9][a-zA-Z0-9_.-]*$ ||
      ! $image =~ ^[a-z0-9][a-z0-9_.-]*:[a-zA-Z0-9_][a-zA-Z0-9_.-]*$ ||
      $archive != *.tar || -e $archive || -L $archive ]]; then
  echo '컨테이너 이름, 새 이미지 태그, 아직 없는 .tar 경로를 확인하세요.' >&2
  exit 1
fi
sudo docker container inspect "$container" >/dev/null
if sudo docker image inspect "$image" >/dev/null 2>&1; then
  echo '이미지 태그가 이미 있습니다. 새 태그를 사용하세요.' >&2
  exit 1
fi
printf '컨테이너: %s\n이미지: %s\n아카이브: %s\n' "$container" "$image" "$archive"
echo '실행 중인 컨테이너는 이미지 생성 중 잠시 멈출 수 있습니다. 비밀값과 별도 백업할 마운트 데이터를 확인하세요.'
read -r -p '이미지를 내보낼까요? [y/N]: ' answer
[[ $answer == [yY] ]] || exit 0

if ! {
  sudo docker commit "$container" "$image" >&2 &&
  sudo docker image save "$image"
} > "$archive"; then
  echo '내보내기 실패. 아카이브 경로의 부분 파일과 새 이미지 태그를 확인하세요.' >&2
  exit 1
fi
sudo docker image inspect --format '{{.Os}}/{{.Architecture}}' "$image"
sha256sum -- "$archive"
