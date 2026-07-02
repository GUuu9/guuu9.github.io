<!-- version: v1.0.0 -->
# Flutter 개발을 위한 Dev Container 구축 가이드

이 가이드는 VS Code Dev Containers 환경 내부에서 Flutter SDK와 Android SDK를 구성하고, 호스트 PC에 연결된 실제 기기 또는 에뮬레이터를 연동하여 앱을 개발 및 디버깅하는 방법을 다룹니다.

---

## 1. 프로젝트 파일 구성

Flutter 개발 환경을 구축하기 위한 폴더 트리는 다음과 같습니다.

```text
my-flutter-project/
└── .devcontainer/
    ├── devcontainer.json   # Dev Container 설정 파일
    └── Dockerfile          # Flutter, Android SDK, OpenJDK가 설치된 이미지 정의
```

### 1) `Dockerfile` 작성
Ubuntu 환경을 기반으로 OpenJDK 17, Android SDK Command-line Tools, 그리고 Flutter SDK를 자동으로 설치하고 환경 변수를 등록하는 설정 파일입니다.

```dockerfile
# 1. 베이스 이미지로 우분투 22.04 LTS 사용
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 2. 필수 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-17-jdk \
    openssh-server \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# 3. 개발용 사용자(developer) 생성 및 권한 설정
RUN useradd -ms /bin/bash developer && \
    echo "developer:developer" | chpasswd && \
    adduser developer sudo
RUN echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER developer
WORKDIR /home/developer

# 4. Android SDK 설치 환경 변수 설정
ENV ANDROID_SDK_ROOT=/home/developer/android-sdk
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# 5. Android Command-line Tools 다운로드 및 설치
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    curl -o sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip sdk.zip -d $ANDROID_SDK_ROOT/cmdline-tools && \
    rm sdk.zip && \
    mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest

# 6. Android 라이선스 동의 및 필수 플랫폼 도구 설치 (adb 등)
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

# 7. Flutter SDK 다운로드 및 설치
ENV FLUTTER_HOME=/home/developer/flutter
ENV PATH=$PATH:$FLUTTER_HOME/bin

RUN git clone https://github.com/flutter/flutter.git -b stable $FLUTTER_HOME

# 8. Flutter 기본 진단 및 빌드 사전 체크
RUN flutter doctor
```

### 2) `devcontainer.json` 작성
호스트 PC의 ADB 서버 포트(`5037`)를 컨테이너 내부로 바인딩하여 기기 연결을 공유하고, Flutter/Dart 관련 VS Code 확장을 탑재합니다.

```json
{
  "name": "Flutter 개발 환경",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "."
  },
  "remoteUser": "developer",
  
  // 중요: 호스트의 ADB 연결 정보(포트 5037)를 컨테이너와 연동합니다.
  "appPort": [
    "5037:5037"
  ],

  // 컨테이너 내부에서 기기 검출 및 연결을 안정화하기 위한 실행 인수 설정
  "runArgs": [
    "--privileged",
    "--net=host" // 호스트의 네트워크 스택을 공유하여 로컬 에뮬레이터 탐색에 용이하게 설정
  ],

  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash"
      },
      "extensions": [
        "dart-code.dart-code",     // Dart 언어 공식 확장
        "dart-code.flutter"        // Flutter 프레임워크 공식 확장
      ]
    }
  }
}
```

---

## 2. 모바일 기기(실기기/에뮬레이터) 연동 및 테스트 방법

컨테이너 환경 안에서는 직접 화면(GUI)을 그리는 Android 에뮬레이터를 실행하기 까다로우므로, 다음과 같은 방식을 사용해 개발합니다.

### 1단계: 호스트 PC (내 실제 컴퓨터) 설정
1. 호스트 PC에 실제 안드로이드 스마트폰을 USB로 연결(USB 디버깅 허용 필수)하거나, 호스트용 **Android Studio**를 켜서 에뮬레이터를 구동해 둡니다.
2. 호스트 PC 터미널에서 ADB 서버를 실행해 둡니다.
   ```bash
   adb start-server
   ```

### 2단계: 컨테이너 내부 연결 확인
1. VS Code에서 `Reopen in Container`를 실행하여 Flutter 개발 컨테이너에 접속합니다.
2. VS Code 컨테이너 터미널에서 아래 명령을 실행합니다.
   ```bash
   flutter devices
   ```
3. 호스트 PC에 구동되고 있는 스마트폰이나 에뮬레이터 기기 목록이 터미널 화면에 정상적으로 표시되는지 확인합니다.

### 3단계: 디버깅 실행
* VS Code 상에서 `F5` 키를 누르면 컨테이너 내부에서 빌드 및 컴파일된 바이너리가 호스트 PC에 연동된 에뮬레이터나 스마트폰 기기로 자동 전송되어 기동하며, 핫 리로드(Hot Reload) 기능을 활용하여 개발할 수 있습니다.
