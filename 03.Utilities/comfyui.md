<!-- version: v1.0.0 -->
# ComfyUI 설치·실행·업데이트

확인일: 2026-10-28. 노드 기반 워크플로로 이미지 생성 모델 등을 실행합니다. [공식 GitHub](https://github.com/Comfy-Org/ComfyUI), [하드웨어·OS 조건](https://docs.comfy.org/installation/system_requirements)을 먼저 확인합니다. GPU·드라이버·메모리와 모델별 요구량에 따라 실행 가능 여부가 달라집니다.

## 설치 방식 선택

Desktop, Windows Portable, Git 수동 설치의 관리 환경을 혼용하지 않습니다. 이 문서는 GitHub 소스를 별도 Python 환경에서 실행하는 방식입니다. Desktop·Portable은 각 배포판의 실행·업데이트 절차를 따르고 임베디드 환경을 시스템 pip로 덮어쓰지 않습니다.

Apple Silicon은 MPS, NVIDIA는 CUDA, AMD 등은 해당 GPU용 PyTorch 배포를 확인합니다. Intel Mac에서 Apple Silicon 설치 절차를 그대로 사용하지 않습니다. 모든 장치에 같은 torch 설치 명령을 적용하지 않습니다.

## Git 소스와 전용 Python 환경

```bash
git clone https://github.com/Comfy-Org/ComfyUI.git
cd ComfyUI
```

README의 현재 Python 지원 조건과 사용할 custom node·PyTorch의 조건을 함께 확인해 Python을 선택합니다. 예를 들어 3.13을 지원하는 조합이라면:

```bash
uv python install 3.13
uv venv --python 3.13 --seed .venv
```

macOS·Linux는 `source .venv/bin/activate`, Windows PowerShell은 `.\.venv\Scripts\Activate.ps1`로 활성화합니다. 아래 확인에서 .venv의 실행 파일 경로가 나와야 합니다.

```bash
python -c "import sys; print(sys.executable)"
```

[공식 수동 설치 안내](https://docs.comfy.org/installation/manual_install)의 **현재 OS·GPU용 PyTorch 설치 명령**을 이 환경 안에서 실행합니다. 버전과 다운로드 인덱스는 GPU·드라이버에 맞춰 선택합니다. 이어서:

```bash
python -m pip install -r requirements.txt
python -m pip check
python main.py
```

터미널에 표시되는 로컬 URL을 엽니다. 기본 주소는 보통 http://127.0.0.1:8188 입니다. 종료는 실행 터미널에서 Ctrl+C입니다. 다음 실행 시 같은 폴더·환경을 사용합니다. 외부 공개가 필요할 때만 네트워크 접근·인증 구성을 별도로 검토합니다.

모델은 공식 워크플로·모델 설명에서 지정한 models 하위 경로에 배치합니다. 워크플로가 요구하는 custom node는 출처와 설치 요구사항을 확인하고 같은 환경에 설치합니다. custom node는 실행 가능한 코드이므로 저장소와 버전을 기록합니다.

## 업데이트와 보존할 항목

먼저 실행을 중지하고 현재 상태를 기록합니다.

```bash
git status
git rev-parse HEAD
python -m pip freeze
```

필요하면 freeze 출력을 프로젝트 외부 파일에 보관합니다. models·input·output·user 데이터, 워크플로, custom node와 별도 모델 경로 설정을 백업합니다. Git 커밋과 패키지 목록만으로 모델·사용자 데이터까지 복원되지는 않습니다.

로컬 코드 변경이 없고 현재 브랜치의 업데이트를 받을 경우:

```bash
git pull --ff-only
python -m pip install -r requirements.txt
python -m pip check
python main.py
```

분기·충돌이 생기면 강제 reset하지 않고 로컬 변경을 먼저 보존합니다. PyTorch와 custom node는 별도 호환 조건을 확인해 업데이트합니다. 정상 동작하던 워크플로로 생성 결과와 모델 로딩을 확인합니다.

특정 릴리스를 유지하려면 공식 태그·커밋을 선택하고 패키지 환경도 함께 기록합니다. 실패 시 업데이트 전 코드·환경·custom node 조합을 별도 작업 폴더에서 복원해 검증합니다. 코드만 되돌려도 Python 패키지는 자동 복구되지 않습니다.

## 문제 해결

| 증상 | 확인 |
| :--- | :--- |
| GPU 인식 실패 | 활성 Python·torch 빌드·GPU 드라이버·OS 지원 |
| 메모리 부족 | 모델 요구 VRAM·워크플로 크기·다른 프로세스 |
| 노드 누락 | 워크플로의 custom node 저장소·버전·의존성 |
| 모델 누락 | 모델 파일과 models 경로·추가 경로 설정 |
| 업데이트 후 실패 | ComfyUI·torch·custom node 중 변경된 항목 |
| 포트 충돌 | 기존 실행 프로세스·프로젝트 실행 옵션 |

버그 보고에는 OS·GPU·ComfyUI 커밋·Python·PyTorch 버전과 비밀값을 제거한 로그를 포함합니다. uv 사용법은 [uv 가이드](../01.Tools/uv.md)를 참고합니다.
