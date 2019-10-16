# @see https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
FROM node:12

WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 4000
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl
CMD ["node", "--experimental-modules", "server/index.mjs"]
