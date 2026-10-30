<!-- version: v1.1.0 -->
# Firefox·Google Chrome 설치·실행·업데이트

확인일: 2026-10-28. 웹 개발 결과를 서로 다른 브라우저에서 확인하고 일반 웹 작업에 사용합니다. [Firefox 공식 배포](https://www.mozilla.org/firefox/)와 [Chrome 공식 배포](https://www.google.com/chrome/)에서 OS·CPU 지원 조건을 확인합니다. 브라우저 바이너리는 임의의 GitHub 미러에서 받지 않습니다.

## macOS

공식 dmg를 받아 Applications에 설치합니다. Homebrew는 기본 설치 경로로 사용하지 않습니다. 사용하는 macOS·CPU가 지원되는지 공식 배포 페이지에서 확인하고 별도의 비공식 curl 설치기를 사용하지 않습니다.

응용 프로그램 목록에서 실행합니다. 터미널에서는:

```bash
open -a Firefox http://localhost:3000
open -a "Google Chrome" http://localhost:3000
```

앱의 자동 업데이트 또는 아래 정보 화면의 업데이트·재시작 기능으로 관리합니다. 기존 Homebrew 설치를 유지한다면 [선택용 brew 가이드](../01.Tools/brew.md)를 따르고 두 방식으로 같은 앱을 중복 설치하지 않습니다.

## Windows

공식 설치 프로그램 또는 winget으로 설치합니다.

```powershell
winget install --id Mozilla.Firefox -e --source winget
winget install --id Google.Chrome -e --source winget
```

시작 메뉴에서 Firefox·Chrome을 실행하고 개발 서버 URL을 엽니다. winget 수동 업데이트는 해당 앱별로 `winget upgrade --id Mozilla.Firefox -e`, `winget upgrade --id Google.Chrome -e`를 사용합니다.

## Linux (Ubuntu / Debian)

Firefox는 배포판이 제공하는 apt·Snap 등 실제 설치 방식을 확인합니다. Ubuntu에서는 apt 패키지가 Snap 설치로 연결될 수 있으므로 설치 명령만 보고 관리 경로를 판단하지 않습니다. Chrome은 공식 사이트의 지원 아키텍처용 deb와 설치 안내를 사용합니다.

앱 메뉴에서 실행하거나 설치된 실행 파일이 PATH에 있으면:

```bash
firefox http://localhost:3000
google-chrome http://localhost:3000
```

apt 설치는 `sudo apt update` 후 실제 패키지 이름으로 갱신합니다. Chrome 공식 deb·저장소 설치는 `sudo apt install --only-upgrade google-chrome-stable`입니다. Firefox가 Snap이면 `snap list firefox`로 확인하고 `sudo snap refresh firefox`로 갱신합니다. 배포판 패키지 브라우저는 앱 내부 업데이트 대신 패키지 관리자를 따릅니다.

## 앱 내부 업데이트와 확인

- Firefox: 메뉴의 도움말 → Firefox 정보에서 버전을 확인하고 제공된 업데이트·재시작을 진행합니다. macOS는 Firefox 메뉴의 정보 항목을 사용합니다.
- Chrome: `chrome://settings/help`에서 버전·업데이트 상태를 확인하고 다시 시작합니다. Linux는 패키지 관리자로 갱신합니다.

업데이트 전 작성 중인 폼·다운로드 등 작업을 저장하고 재시작 후 개발 사이트의 로그인·확장 기능·표시를 확인합니다. 브라우저 앱 업데이트와 프로필 동기화는 별개입니다. 재설치·프로필 초기화 전 북마크와 필요한 데이터를 백업하며 보안 업데이트를 피하려고 구버전으로 장기 고정하지 않습니다.

공식 참고: [Firefox 업데이트](https://support.mozilla.org/en-US/kb/update-firefox-latest-release), [Chrome 업데이트](https://support.google.com/chrome/answer/95414).
