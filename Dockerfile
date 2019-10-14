# @see https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
FROM node:12

WORKDIR /usr/src/app
COPY . .
RUN npm ci
EXPOSE 4000
RUN chmod +x ./docker-entry.sh
CMD ["node", "--experimental-modules", "server/index.mjs"]
