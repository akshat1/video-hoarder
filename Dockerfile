FROM alpine:latest
RUN mkdir -p /data/db
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk add --update nodejs npm curl ffmpeg python bash mongodb=3.4.4-r0
ADD https://yt-dl.org/downloads/latest/youtube-dl /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl
WORKDIR /app
COPY . .
# RUN npm ci
# RUN npm run build-prod
EXPOSE 7200
ENTRYPOINT /bin/bash
