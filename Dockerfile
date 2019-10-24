FROM alpine:latest
RUN apk add --update nodejs npm curl ffmpeg python
ADD https://yt-dl.org/downloads/latest/youtube-dl /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build-prod
EXPOSE 4000
CMD ["node", "--experimental-modules", "server/index.mjs"]
