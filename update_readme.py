import re
import os
import subprocess
from datetime import datetime

README_PATH = "README.md"

def get_git_last_commit_date(file_path):
    """
    Git 로그에서 파일의 마지막 커밋 날짜를 YYYY.MM.DD 형식으로 가져옵니다.
    커밋 내역이 없거나 에러가 날 경우 오늘 날짜를 반환합니다.
    """
    try:
        # git log -1 --format="%ad" --date=format:"%Y.%m.%d" -- <file_path>
        result = subprocess.run(
            ["git", "log", "-1", '--format=%ad', '--date=format:%Y.%m.%d', '--', file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        date_str = result.stdout.strip()
        if date_str:
            return date_str
    except Exception:
        pass
    
    # 커밋 기록이 없거나 Git을 쓸 수 없을 때는 현재 날짜
    return datetime.now().strftime("%Y.%m.%d")

def extract_version_from_file(file_path):
    """
    대상 파일 내부의 version 정보를 찾습니다.
    패턴: '<!-- version: vX.Y.Z -->' 또는 'version: vX.Y.Z' 또는 '# Version vX.Y.Z'
    """
    if not os.path.exists(file_path):
        return None
    
    version_patterns = [
        r"<!--\s*version:\s*v?([\d\.]+)\s*-->",
        r"(?:^|\s)version:\s*v?([\d\.]+)",
        r"#\s*Version\s*v?([\d\.]+)"
    ]
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            # 전체를 다 읽지 않고 앞쪽 30줄 정도만 확인
            lines = [f.readline() for _ in range(30)]
            content = "".join(lines)
            for pattern in version_patterns:
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    return f"v{match.group(1)}"
    except Exception as e:
        print(f"Error reading version from {file_path}: {e}")
    
    return None

def update_readme():
    if not os.path.exists(README_PATH):
        print(f"{README_PATH} not found.")
        return

    with open(README_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # 테이블 행에서 링크와 날짜, 버전을 추출/수정하기 위한 정규식
    # 예시: | 🛠️ **[OS Development Setting](./setup/_OS_Dev_Setting.md)** | 설명 | `2026.07.02` | ![Version v0.0.0](https://img.shields.io/badge/version-v0.0.0-blue?style=flat-square) |
    # 캡처 그룹: 1=아이콘, 2=이름, 3=경로, 4=설명, 5=기존 날짜, 6=기존 버전
    row_pattern = re.compile(
        r"(\|\s*[^|]*\s*\*\*\[([^\]]+)\]\(([^)]+\.md)\)\*\*\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*!\[Version v[^\]]+\]\(https://img\.shields\.io/badge/version-v([\d\.]+)-blue\?style=flat-square\)\s*\|)"
    )

    def replace_row(match):
        full_match = match.group(1)
        name = match.group(2)
        relative_path = match.group(3)
        desc = match.group(4)
        old_date = match.group(5)
        old_version = f"v{match.group(6)}"
        
        # 상대 경로의 ./ 제거하고 실제 파일 경로 획득
        actual_path = relative_path.lstrip("./")
        
        # Git 수정 날짜 및 버전 가져오기
        new_date = get_git_last_commit_date(actual_path)
        new_version = extract_version_from_file(actual_path) or old_version
        
        # 디버깅 출력
        print(f"File: {actual_path} | Date: {old_date} -> {new_date} | Version: {old_version} -> {new_version}")
        
        # 새 행 구성
        new_row = f"| **[{name}]({relative_path})** | {desc} | `{new_date}` | ![Version {new_version}](https://img.shields.io/badge/version-{new_version}-blue?style=flat-square) |"
        
        # 기존 행의 맨 앞 아이콘(예: 🛠️ 등)이 누락되지 않도록 매칭 정보 재구성
        # match.group(1) 전체 매치 중에서 아이콘 부분이 있다면 보존해 줍니다.
        original_prefix = full_match.split("**[")[0]
        return f"{original_prefix}**[{name}]({relative_path})** | {desc} | `{new_date}` | ![Version {new_version}](https://img.shields.io/badge/version-{new_version}-blue?style=flat-square) |"

    updated_content = row_pattern.sub(replace_row, content)

    # 변경사항이 있을 경우 파일 저장
    if updated_content != content:
        with open(README_PATH, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print("README.md updated successfully.")
    else:
        print("No changes detected in README.md.")

if __name__ == "__main__":
    update_readme()
