#!/usr/bin/env bash
set -euo pipefail
umask 077

if (( EUID == 0 )); then
  printf '%s\n' '저장소 소유 계정으로 sudo 없이 실행하세요.' >&2
  exit 1
fi

read -r -p '저장소 이름 (.git 생략 가능): ' name
name=${name%.git}
if [[ ! $name =~ ^[a-zA-Z0-9][a-zA-Z0-9_-]*$ ]]; then
  printf '%s\n' '영문자나 숫자로 시작하고 영문자, 숫자, _, -만 사용하세요.' >&2
  exit 1
fi

read -r -p '기본 브랜치 [main]: ' branch
branch=${branch:-main}
if [[ $branch == -* ]] || ! git check-ref-format "refs/heads/$branch"; then
  printf '%s\n' '유효한 기본 브랜치 이름을 입력하세요.' >&2
  exit 1
fi

repo_dir="$HOME/git"
repo_path="$repo_dir/$name.git"
printf '생성 경로: %s\n기본 브랜치: %s\n' "$repo_path" "$branch"
read -r -p '생성할까요? [y/N]: ' answer
if [[ $answer != y && $answer != Y ]]; then
  printf '%s\n' '생성을 취소했습니다.'
  exit 0
fi

mkdir -p -- "$repo_dir"
if ! mkdir -- "$repo_path"; then
  printf '경로가 이미 있거나 생성 권한이 없습니다: %s\n' "$repo_path" >&2
  exit 1
fi
if ! git init --bare --initial-branch="$branch" -- "$repo_path"; then
  printf '초기화에 실패했습니다. 서버에서 새로 만든 경로를 확인하세요: %s\n' "$repo_path" >&2
  exit 1
fi

ls -ld -- "$repo_path"
printf '클라이언트에서 실행 (git-host는 SSH 별칭):\ngit clone git-host:git/%s.git\n' "$name"
