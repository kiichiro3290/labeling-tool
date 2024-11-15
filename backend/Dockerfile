FROM golang:1.19.4-alpine as dev

ENV ROOT=/go/src/app
ENV CGO_ENABLED 0
ENV GOOS linux
ENV GOARCH amd64
WORKDIR ${ROOT}

RUN go install github.com/golang/mock/mockgen@v1.6.0
RUN go install github.com/swaggo/swag/cmd/swag@latest

RUN apk update && apk add git
COPY go.mod go.sum ./
RUN go mod download
EXPOSE 8080

CMD ["go", "run", "main.go"]

# -------------------------------------------------------

FROM golang:1.19.4-alpine as builder

ENV ROOT=/go/src/app
ENV CGO_ENABLED 0
ENV GOOS linux
ENV GOARCH amd64
WORKDIR ${ROOT}

RUN apk update && apk add git
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -a -o ./binary

# -------------------------------------------------------

FROM alpine:3.17.0 as prod

ENV ROOT=/go/src/app
WORKDIR ${ROOT}

RUN apk add --no-cache ca-certificates
COPY ./key ./key
COPY --from=builder "${ROOT}"/binary .

EXPOSE 8080
CMD ["/go/src/app/binary"]