FROM golang:latest  
WORKDIR /usr/src/backend
COPY . .
RUN go get

EXPOSE 8080
CMD ["go", "run", "main.go"]

