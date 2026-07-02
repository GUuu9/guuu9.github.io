# 1. 베이스 이미지로 우분투 22.04 LTS 사용
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 2. 필수 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    sudo \
    build-essential \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 3. 개발용 사용자(developer) 생성 및 권한 설정
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer
RUN echo 'developer:developer' | chpasswd
RUN echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER developer
WORKDIR /home/developer

# 4. rustup을 통한 Rust 툴체인 설치
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# 5. Cargo 및 rustup 바이너리 경로를 PATH에 등록
ENV PATH=/home/developer/.cargo/bin:$PATH

# 6. Cargo 환경 변수 소싱
RUN echo '. $HOME/.cargo/env' >> /home/developer/.bashrc
