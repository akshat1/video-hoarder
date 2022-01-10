# https://docs.docker.com/develop/develop-images/multistage-build/
FROM node:16 as builder
WORKDIR /workspace
COPY . /workspace
RUN yarn --frozen-lockfile && yarn build
COPY ormconfig.prod ormconfig.js

FROM node:16 as runner
WORKDIR /workspace
COPY --from=builder /workspace/app ./app
COPY --from=builder /workspace/yarn.lock ./
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/ormconfig.prod ./ormconfig.js
COPY --from=builder /workspace/public ./public
COPY --from=builder /workspace/config ./config
COPY --from=builder /workspace/node_modules ./node_modules
CMD ["yarn", "start"]
