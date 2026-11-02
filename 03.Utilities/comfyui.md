<!-- version: v1.1.0 -->
# ComfyUI 설치·실행·업데이트

확인일: 2026-10-28. 노드 기반 워크플로로 이미지 생성 모델 등을 실행합니다. [공식 GitHub](https://github.com/Comfy-Org/ComfyUI), [하드웨어·OS 조건](https://docs.comfy.org/installation/system_requirements)을 먼저 확인합니다. GPU·드라이버·메모리와 모델별 요구량에 따라 실행 가능 여부가 달라집니다.

## 설치 방식 선택

Desktop, Windows Portable, Git 수동 설치의 관리 환경을 혼용하지 않습니다. 이 문서는 GitHub 소스를 별도 Python 환경에서 실행하는 방식입니다. Desktop·Portable은 각 배포판의 실행·업데이트 절차를 따르고 임베디드 환경을 시스템 pip로 덮어쓰지 않습니다.

> [!IMPORTANT]
> Apple Silicon은 MPS, NVIDIA는 CUDA, AMD 등은 해당 GPU용 PyTorch 배포를 확인합니다. Intel Mac에서 Apple Silicon 설치 절차를 그대로 사용하지 않습니다. 모든 장치에 같은 torch 설치 명령을 적용하지 않습니다.

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

## macOS의 PyTorch 추가 설치

아래는 **Git 수동 설치와 위에서 활성화한 ComfyUI 전용 `.venv`**에서만 진행합니다. Desktop 앱이 관리하는 Python에 적용하지 않습니다. 먼저 Mac 하드웨어와 Python 아키텍처를 확인합니다.

```bash
uname -m
python -c "import platform; print(platform.machine())"
```

| 환경 | 진행 기준 |
| :--- | :--- |
| Apple Silicon·arm64 Python | 해당 PyTorch 릴리스의 macOS·Python 조건 확인 후 아래 MPS 설치 |
| Apple Silicon·x86_64 Python | Rosetta 실행 여부와 Python 설치 아키텍처 확인. 네이티브 arm64 환경으로 별도 재생성 후 진행 |
| Intel Mac·x86_64 Python | 아래 Apple Silicon 명령을 적용하지 않고 Intel 제한 확인 |

### Apple Silicon: torch·torchvision·torchaudio 설치

ComfyUI 공식 Apple Silicon 안내는 PyTorch nightly 설치를 권장합니다. [Apple의 PyTorch 안내](https://developer.apple.com/metal/pytorch/)에 있는 pip 명령을 현재 가상환경의 Python으로 실행합니다.

```bash
python -m pip install --pre torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/nightly/cpu
```

`nightly/cpu`는 Apple 공식 명령의 배포 인덱스 이름이며, Mac에서 MPS 가속 사용 가능 여부는 설치 후 따로 확인합니다. macOS에는 NVIDIA CUDA용 `cu*`나 Linux ROCm 인덱스를 지정하지 않습니다. nightly는 개발 빌드이므로 정상 동작한 실제 버전을 기록합니다.

사용하려는 ComfyUI 커밋·custom node가 stable PyTorch에서 검증된 경우에는 위 nightly 명령 대신 `python -m pip install torch torchvision torchaudio`를 선택할 수 있습니다. stable·nightly를 순서대로 모두 설치하지 않습니다. Apple 안내의 stable 배포는 Apple Silicon·macOS 14 이상을 요구하며, 더 새로운 릴리스·nightly의 최소 OS·Python 조건은 해당 배포 문서를 확인합니다. macOS 13에서 최신 배포가 동작한다고 가정하지 않습니다.

### Intel Mac 제한

PyTorch는 2.3부터 공식 macOS x86_64 바이너리 배포를 중단했습니다. 위 Python 3.13 환경 예시와 최신 torch를 Intel Mac에 그대로 적용하면 설치 가능한 wheel이 없을 수 있습니다. Intel GPU용 XPU 설치 안내도 Windows/Linux 대상이며 Intel Mac 지원 안내가 아닙니다.

Intel Mac에서 과거 환경을 복원하려면 당시 검증된 ComfyUI 커밋·Python·torch/torchvision/torchaudio 조합을 함께 확인합니다. torch만 임의로 낮추거나 requirements의 조건을 무시하지 않습니다. 현재 ComfyUI와의 호환 조합은 이 문서에서 검증하지 않았으므로 확정 설치 명령으로 제공하지 않습니다. [PyTorch 공식 배포 중단 논의](https://github.com/pytorch/pytorch/issues/114602), [PyTorch 배포팀의 중단 안내](https://github.com/pytorch/serve/issues/3005).

## ComfyUI 의존성 설치와 실행

Windows·Linux는 [공식 수동 설치 안내](https://docs.comfy.org/installation/manual_install)의 **현재 OS·GPU용 PyTorch 명령**을 같은 가상환경에서 먼저 실행합니다. macOS는 위 분기를 따릅니다. 그다음 모든 환경에서 ComfyUI 폴더의 나머지 의존성을 설치합니다.

```bash
python -m pip install -r requirements.txt
python -m pip check
```

설치 후 `python -m pip show torch torchvision torchaudio`로 실제 버전을 기록합니다. requirements 설치 과정에서도 torch 버전이 조정될 수 있으므로 **최종 의존성 설치 후** Apple Silicon에서는 MPS를 확인합니다.

```bash
python -c "import torch; print(torch.__version__); print('MPS built:', torch.backends.mps.is_built()); print('MPS available:', torch.backends.mps.is_available())"
```

MPS available이 True인 경우 실제 GPU 텐서 생성도 확인합니다.

```bash
python -c "import torch; print(torch.ones(1, device='mps'))"
```

False이면 Python 아키텍처·macOS·PyTorch 빌드를 확인합니다. `torch.cuda.is_available()`이 False인 것은 Mac MPS 실패 판정 기준이 아닙니다. torch import와 ComfyUI 의존성이 정상인 환경에서만 CPU 진단 실행(`python main.py --cpu`)을 선택할 수 있으며, CPU 옵션이 미지원 wheel·패키지 버전 충돌을 해결하지는 않습니다.

일반 실행:

```bash
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

macOS PyTorch 설치 안내 확인일: 2026-11-02. [ComfyUI 공식 Apple Silicon 설치](https://github.com/Comfy-Org/ComfyUI#apple-mac-silicon), [Apple pip 설치·MPS 검증](https://developer.apple.com/metal/pytorch/), [PyTorch MPS 문서](https://docs.pytorch.org/docs/stable/notes/mps.html). 공식 문서 대조만 수행했으며 pip 설치·모델 로딩·MPS 생성 실행은 수행하지 않았습니다.
