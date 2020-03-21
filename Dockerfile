FROM golang:1.12

RUN apt update && \
    apt -y install build-essential npm && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --gid 1000 node \
    && useradd --create-home --uid 1000 --gid node --shell /bin/sh node

USER node

CMD /bin/sh