FROM nginx:bookworm



COPY ./nginx.conf /etc/nginx/conf.d/default.conf


RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install NVM
ENV NVM_DIR /root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install 22 \
    && nvm alias default 22 \
    && nvm use default \
    && npm install -g npm@10.9.2

# Set path to ensure nvm and node are available
ENV PATH "$NVM_DIR/versions/node/v22.14.0/bin:$PATH"

# Verify installation
RUN node -v && npm -v

WORKDIR /app

COPY . .
RUN npm install

EXPOSE 80

CMD ["sh", "-c", "npm run dev & nginx -g 'daemon off;'"]
