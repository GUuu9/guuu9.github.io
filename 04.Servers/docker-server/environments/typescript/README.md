<!-- version: v2.0.0 -->
# 서버 TypeScript 작업 영역

이 문서는 **서버 관리자가 만든 SSH 컨테이너에 접속한 developer 사용자**가 실행하는 언어 설정입니다. 개인 PC의 로컬 Docker·Reopen in Container 절차가 아닙니다. 서버 생성·포트·키·볼륨은 [공통 구성](../../guides/docker_container_setup.md)을 따릅니다.

Node 설치·버전 선택·프로젝트 의존성 복원은 [Node.js 공통 안내](../nodejs/README.md)를 따릅니다. TypeScript 전용 SSH 이미지나 추가 공유 포트를 만들지 않습니다.

## 기존 프로젝트

1. 프로젝트의 .nvmrc·engines·CI에 맞는 Node를 선택합니다.
2. npm ci 등 잠금 파일 기준으로 복원합니다.
3. npm run으로 사용 가능한 스크립트를 확인하고 typecheck·test·build를 실행합니다.

```bash
npm run
```

스크립트 이름은 실제 프로젝트를 따릅니다. tsc·ts-node를 전역 설치하지 않습니다. 새 프로젝트에 TypeScript가 필요하면 npm install --save-dev typescript로 선언합니다. 기존 프로젝트의 tsconfig.json을 초기화·덮어쓰지 않습니다.

React frontend·TypeScript server·server+wui·Electron은 프로젝트 scripts와 의존성이 다르므로 같은 실행 명령을 강제하지 않습니다. 서버에 열린 브라우저가 아니라 개인 PC의 SSH 터널·VS Code 포트 전달로 확인합니다. 원격 확장은 프로젝트가 요구하는 버전·설정을 우선하고 TypeScript nightly 확장을 일괄 설치하지 않습니다.
