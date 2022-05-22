FROM node:18-alpine
WORKDIR /workspace/
COPY ./src ./src
COPY ./package.json .
COPY ./tsconfig.json .
COPY webpack.config.js .
COPY yarn.lock .
RUN apk -U upgrade \
  && apk add curl \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp \
  && yarn install \
  && yarn run build
CMD yarn start
# CMD sleep infinity