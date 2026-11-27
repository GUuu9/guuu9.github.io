#!/usr/bin/env bash
set -euo pipefail

archive=${1:-}
if (( $# > 1 )); then
  printf '사용법: bash %s [이미지.tar]\n' "$0" >&2
  exit 1
fi

if [[ -n $archive ]]; then
  [[ -f $archive && -r $archive ]] || { echo '읽을 수 있는 아카이브를 지정하세요.' >&2; exit 1; }
  read -r -p '송신 측에서 받은 SHA-256: ' expected
  expected=$(printf '%s' "$expected" | tr 'A-F' 'a-f')
  actual=$(sha256sum < "$archive")
  if [[ ! $expected =~ ^[[:xdigit:]]{64}$ || $expected != "${actual%% *}" ]]; then
    echo 'SHA-256이 일치하지 않습니다.' >&2
    exit 1
  fi
  echo '신뢰하는 아카이브만 불러오세요. 같은 이름의 로컬 이미지 태그가 바뀔 수 있습니다.'
  read -r -p '이미지를 불러올까요? [y/N]: ' answer
  [[ $answer == [yY] ]] || exit 0
  sudo docker image load -i "$archive"
  read -r -p '불러온 이미지 이름:태그 (위 출력 참조): ' image
  [[ -n $image && $image != -* ]] || exit 1
  sudo docker image inspect "$image" >/dev/null
else
  read -r -p '이미지 [ubuntu:24.04]: ' image
  image=${image:-ubuntu:24.04}
fi
[[ $image != -* && $image != *[[:space:]]* ]] || { echo '이미지 이름을 확인하세요.' >&2; exit 1; }

read -r -p '컨테이너 이름: ' name
[[ $name =~ ^[a-zA-Z0-9][a-zA-Z0-9_.-]*$ ]] || { echo '컨테이너 이름을 확인하세요.' >&2; exit 1; }
args=(run -dit --name "$name")

read -r -p '포트를 공개할까요? [y/N]: ' answer
if [[ $answer == [yY] ]]; then
  read -r -p '호스트 포트: ' host_port
  read -r -p '컨테이너 포트 [호스트 포트와 동일]: ' container_port
  container_port=${container_port:-$host_port}
  for port in "$host_port" "$container_port"; do
    if [[ ! $port =~ ^[1-9][0-9]{0,4}$ ]] || (( port > 65535 )); then
      echo '포트는 1~65535 사이의 숫자를 입력하세요.' >&2
      exit 1
    fi
  done
  args+=(--publish "127.0.0.1:$host_port:$container_port")
fi

read -r -p '호스트 디렉터리를 마운트할까요? [y/N]: ' answer
mount_target=
if [[ $answer == [yY] ]]; then
  read -r -p '서버의 기존 디렉터리 (절대 경로): ' source_dir
  read -r -p "컨테이너 경로 [/home/$name]: " mount_target
  mount_target=${mount_target:-/home/$name}
  if [[ $source_dir != /* || ! -d $source_dir || $mount_target != /* ||
        $mount_target == / || $source_dir == *[,\"$'\n']* || $mount_target == *[,\"$'\n']* ]]; then
    echo '기존 서버 폴더와 유효한 컨테이너 절대 경로를 지정하세요.' >&2
    exit 1
  fi
  args+=(--mount "type=bind,src=$source_dir,dst=$mount_target")
fi

read -r -p "컨테이너 작업 디렉터리 [${mount_target:-이미지 기본값}]: " work_dir
work_dir=${work_dir:-$mount_target}
if [[ -n $work_dir ]]; then
  [[ $work_dir == /* ]] || { echo '작업 디렉터리는 절대 경로를 사용하세요.' >&2; exit 1; }
  args+=(--workdir "$work_dir")
fi

read -r -p '실행 사용자 [이미지 기본값, 또는 UID:GID]: ' run_user
if [[ -n $run_user ]]; then
  [[ $run_user =~ ^[0-9]+:[0-9]+$ ]] || { echo 'UID:GID 형식으로 입력하세요.' >&2; exit 1; }
  args+=(--user "$run_user")
fi

printf '%q ' sudo docker "${args[@]}" --entrypoint bash "$image"
printf '\n'
read -r -p '이 옵션으로 생성할까요? [y/N]: ' answer
[[ $answer == [yY] ]] || exit 0
sudo docker "${args[@]}" --entrypoint bash "$image"
printf '셸 접속: sudo docker exec -it %q bash\n' "$name"
