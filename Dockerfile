FROM alpine:latest
WORKDIR /workspace/
COPY . .
RUN apk -U upgrade \
  && apk add curl \
  && apk add python3 \
  && apk add nodejs \
  && apk add npm \
  && apk add yarn \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp \
  && yarn install \
  && yarn run build
# Get rid of dev dependencies.
RUN rm -rf node_modules
ENV NODE_ENV=production
RUN yarn install --production=true
CMD yarn start
# CMD sleep infinity