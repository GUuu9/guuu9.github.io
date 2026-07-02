---
name: "hello-helper"
description: "테스트용 인사이트 및 환경 검증을 위한 스킬"
---

# Hello Helper 스킬 가이드

에이전트가 개발자에게 인사를 하거나 특정 헬퍼 스크립트를 작동시켜야 하는 경우 이 스킬을 활성화하여 사용합니다.

## 작동 방식
1. 이 스킬이 매칭되면 에이전트는 `.agents/skills/hello-helper/scripts/greet.sh` 파일을 호출할 수 있습니다.
2. CLI 터미널 출력 환경을 진단할 때 활용합니다.
