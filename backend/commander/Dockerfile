FROM ubuntu:22.04

WORKDIR /app

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install dependencies
ENV ANSIBLE_VERSION=2.18.3

RUN apt-get update; \
    apt-get install -y curl unzip sshpass; \
    apt-get install -y gcc python3; \
    apt-get install -y python3-pip; \
    apt-get clean all

RUN pip3 install --upgrade pip; \
    pip3 install "ansible==${ANSIBLE_VERSION}"; \
    pip3 install ansible

ENV TERRAFORM_VERSION=1.11.2

RUN curl -fsSL https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -o terraform.zip && \
    unzip terraform.zip && \
    mv terraform /usr/local/bin/ && \
    rm terraform.zip

ENV NODE_VERSION=22

RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.40.2/install.sh | bash

ENV NVM_DIR=/root/.nvm

# install node
RUN bash -c "source $NVM_DIR/nvm.sh && nvm install 22"

# set ENTRYPOINT for reloading nvm-environment
ENTRYPOINT ["bash", "-c", "source $NVM_DIR/nvm.sh && exec \"$@\"", "--"]


CMD ["npm", "run", "dev"]