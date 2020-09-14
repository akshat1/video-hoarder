FROM alpine:latest
RUN apk add --update ffmpeg nodejs npm g++ make python
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/bin/youtube-dl
RUN chmod +x /usr/bin/youtube-dl
WORKDIR /app
COPY . .
RUN node --version
RUN npm ci
CMD ["./entrypoint.sh"]
