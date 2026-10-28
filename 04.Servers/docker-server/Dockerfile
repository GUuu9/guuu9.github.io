FROM ubuntu:24.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server ca-certificates git curl build-essential python3 python3-venv \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --user-group --shell /bin/bash developer \
    && passwd -d developer \
    && install -d -m 0755 /run/sshd \
    && install -d -o developer -g developer -m 0700 /home/developer/.ssh \
    && rm -f /etc/ssh/ssh_host_*_key /etc/ssh/ssh_host_*_key.pub

WORKDIR /home/developer
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D", "-e", "-h", "/etc/workspace-ssh/host_key", "-o", "AuthenticationMethods=publickey", "-o", "PasswordAuthentication=no", "-o", "KbdInteractiveAuthentication=no", "-o", "PermitEmptyPasswords=no", "-o", "PermitRootLogin=no", "-o", "AllowUsers=developer", "-o", "AllowTcpForwarding=local", "-o", "AllowAgentForwarding=no", "-o", "X11Forwarding=no", "-o", "GatewayPorts=no", "-o", "PermitTunnel=no"]
