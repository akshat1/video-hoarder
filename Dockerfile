FROM alpine:latest
RUN mkdir -p db-data
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk add --update nodejs npm curl ffmpeg python bash make
ADD https://yt-dl.org/downloads/latest/youtube-dl /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run dev
EXPOSE 7200
EXPOSE 9229
ENTRYPOINT /bin/bash
