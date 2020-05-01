FROM golang:1.13

RUN apt update && \
    apt -y install build-essential npm && \
    npm install -g npm@latest && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --gid 1000 node \
    && useradd --create-home --uid 1000 --gid node --shell /bin/sh node

USER node

CMD /bin/sh
