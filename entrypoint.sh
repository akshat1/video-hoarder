#!/bin/sh
npm run build
npm run mkdir
NODE_ENV="production"
node src/server/index.js
