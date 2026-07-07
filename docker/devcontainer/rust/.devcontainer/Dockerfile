# 1. 베이스 이미지로 우분투 26.04 LTS 사용
FROM ubuntu:26.04

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
    openssh-server \
    && rm -rf /var/lib/apt/lists/*

# SSH 서비스 기동을 위한 디렉토리 사전 확보 및 권한 설정
RUN mkdir -p /var/run/sshd && chmod 0755 /var/run/sshd

# 3. 개발용 사용자(developer) 생성 및 권한 설정
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer
RUN echo 'root:root' | chpasswd && \
    echo 'developer:developer' | chpasswd
RUN echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# SSH 로그인 정책 변경 (루트 및 패스워드 인증 활성화)
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

USER developer
WORKDIR /home/developer

# 4. rustup을 통한 Rust 툴체인 설치
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# 5. Cargo 및 rustup 바이너리 경로를 PATH에 등록
ENV PATH=/home/developer/.cargo/bin:$PATH

# 6. Cargo 환경 변수 소싱
RUN echo '. $HOME/.cargo/env' >> /home/developer/.bashrc

# 진입점 자동 시작 스크립트(entrypoint.sh) 복사 및 실행권한 부여
USER root
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# 포트 설정 (SSH 및 개발용 포트)
EXPOSE 22

# 컨테이너 시작 시 실행될 진입점 스크립트 지정
USER developer
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
