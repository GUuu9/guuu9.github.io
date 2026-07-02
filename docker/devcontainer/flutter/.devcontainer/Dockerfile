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