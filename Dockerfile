FROM golang:1.19

RUN apt update && \
    apt -y install build-essential npm && \
    npm install n -g && \
    n v16.13.1 && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --gid 1000 node \
    && useradd --create-home --uid 1000 --gid node --shell /bin/sh node

RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.55.2

USER node

CMD /bin/sh
