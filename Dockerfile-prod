FROM alpine:latest
RUN apk add --update ffmpeg youtube-dl nodejs npm g++ make
WORKDIR /app
COPY . .
RUN node --version
RUN npm ci
CMD ["./entrypoint.sh"]
