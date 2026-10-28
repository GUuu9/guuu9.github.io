<!-- version: v2.0.0 -->
# 서버 Node.js·React·Electron 작업 영역

이 문서는 **서버 관리자가 만든 SSH 컨테이너에 접속한 developer 사용자**가 실행하는 언어 설정입니다. 개인 PC의 로컬 Docker·Reopen in Container 절차가 아닙니다. 서버 생성·포트·키·볼륨은 [공통 구성](../../guides/docker_container_setup.md)을 따릅니다.


## nvm 설치

```bash
touch ~/.bashrc
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | PROFILE="$HOME/.bashrc" bash
source ~/.bashrc
command -v nvm
```

공식 [nvm 설치 안내](https://github.com/nvm-sh/nvm)의 현재 릴리스 태그를 확인해 사용합니다. NVM_DIR은 개인 홈에 두고 versions/node/v20/bin 같은 불완전한 버전 경로를 PATH에 하드코딩하지 않습니다.

## 기존 프로젝트

프로젝트 루트에 .nvmrc가 있으면:

```bash
nvm install
nvm use
node --version
npm --version
npm ci
npm run
```

npm ci는 package-lock.json이 있는 경우입니다. 없으면 npm 프로젝트인지 확인하고 npm install을 사용합니다. .nvmrc가 없으면 README·engines·CI의 버전을 확인해 nvm install 버전·nvm use 버전으로 선택합니다. 설치 실패를 || true로 숨기지 않습니다.

React·Electron·TypeScript는 프로젝트 의존성입니다. SSH 컨테이너에서는 devcontainer.json의 postCreateCommand가 자동 실행되지 않으므로 직접 복원합니다. Electron GUI 실행·패키징은 서버의 디스플레이·OS·CPU와 네이티브 모듈 조건을 별도 검증합니다.

웹 결과는 개인 PC의 SSH 터널로 확인하며 80·443·3000을 사용자마다 서버 전체에 공개하지 않습니다. 자세한 버전 변경·복귀는 [nvm 가이드](../../../../01.Tools/nvm.md)를 참고합니다.
