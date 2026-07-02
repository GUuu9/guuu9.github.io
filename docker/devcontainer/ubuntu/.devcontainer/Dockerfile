# 1. 우분투 22.04 LTS 공식 이미지 지정
FROM ubuntu:22.04

# 2. apt 패키지 설치 시 대화형 프롬프트가 뜨는 것을 방지
ENV DEBIAN_FRONTEND=noninteractive

# 3. 필수 시스템 패키지 및 개발 표준 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    openssh-server \
    sudo \
    tar \
    dbus \
    binutils \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. SSH 서비스 기동을 위한 디렉토리 사전 확보 및 권한 설정
RUN mkdir -p /var/run/sshd && chmod 0755 /var/run/sshd

# 5. 개발 전용 사용자(developer) 생성 및 sudo 권한 할당
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer

# 6. 사용자 및 루트 비밀번호 설정 (원격 PC SSH 로그인용)
RUN echo 'root:root' | chpasswd && \
    echo 'developer:developer' | chpasswd

# 7. SSH 로그인 정책 변경 (루트 및 패스워드 인증 활성화)
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 8. 진입점 자동 시작 스크립트(entrypoint.sh) 복사 및 실행권한 부여
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# 9. 포트 설정 (SSH: 22)
EXPOSE 22

# 10. 컨테이너 시작 시 실행될 진입점 스크립트 지정
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]