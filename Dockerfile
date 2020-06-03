FROM golang:1.13

RUN apt update && \
    apt -y install build-essential npm && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --gid 1000 node \
    && useradd --create-home --uid 1000 --gid node --shell /bin/sh node

RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.27.0

USER node

CMD /bin/sh
