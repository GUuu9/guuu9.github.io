# 1. 베이스 이미지로 우분투 26.04 LTS 사용
FROM ubuntu:26.04

# 2. apt 패키지 설치 시 대화형 프롬프트가 뜨는 것을 방지
ENV DEBIAN_FRONTEND=noninteractive

# 3. 필수 시스템 패키지 및 네이티브 애드온 컴파일을 위한 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    sudo \
    build-essential \
    unzip \
    tar \
    openssh-server \
    && rm -rf /var/lib/apt/lists/*

# SSH 서비스 기동을 위한 디렉토리 사전 확보 및 권한 설정
RUN mkdir -p /var/run/sshd && chmod 0755 /var/run/sshd

# 4. 개발 전용 사용자(developer) 생성 및 sudo 권한 할당
RUN useradd -rm -d /home/developer -s /bin/bash -g root -G sudo -u 1001 developer

# 5. 사용자 비밀번호 설정 및 NOPASSWD sudo 권한 부여
RUN echo 'root:root' | chpasswd && \
    echo 'developer:developer' | chpasswd && \
    echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# SSH 로그인 정책 변경 (루트 및 패스워드 인증 활성화)
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 6. developer 사용자로 전환하여 nvm 설치
USER developer
WORKDIR /home/developer

# 7. nvm(Node Version Manager) 설치
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 8. nvm 환경 변수 설정 및 Node.js LTS(v20) 설치
ENV NVM_DIR=/home/developer/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install 20 && nvm alias default 20 && nvm use default

# 9. node, npm, nvm 명령을 셸 환경에서 바로 사용할 수 있도록 PATH 등록
ENV PATH=$NVM_DIR/versions/node/v20/bin:$PATH

# 10. TypeScript 및 ts-node 전역 설치
RUN npm install -g typescript ts-node

# 진입점 자동 시작 스크립트(entrypoint.sh) 복사 및 실행권한 부여
USER root
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# 포트 설정 (SSH 및 개발용 포트)
EXPOSE 22 3000

# 컨테이너 시작 시 실행될 진입점 스크립트 지정
USER developer
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
