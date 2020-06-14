/** @module server */
import { getLogger } from "../logger.js";
import { getRouter as getAPI } from "./api/index.js";
import { getConfig } from "./config.js";
import { initialize as initializeDB } from "./db/index.js";  // oooh modules are soooo awesome! and even Node support them now. Mmmm hmmm.
import { boostrap as bootstrapDevServer } from "./dev-server.js";
import { iff, requestLogger, unless } from "./express-middleware/index.js";
import { getPassport } from "./getPassport.js";
import { bootstrap as bootstrapPassport, getSessionStore, Secret } from "./getPassport.js";
import { serveIndex } from "./serve-index.js";
import { bootstrap as bootstrapSocketIO } from "./socketio.js";
import { initializeYTDL } from "./ytdl.js";
import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

const rootLogger = getLogger("server");

/**
 * Wraps the server starting logic inside a function for ease of testing (also because we don't
 * yet have top level async/await). This function is called automatically when NODE_ENV != test.
 * During testing, we explicitly call this function and set the single boolean param according to
 * which branch we are currently testing.
 *
 * @func
 * @param {boolean} startDevServer
 */
export const startServer = async (startDevServer) => {
  const logger = getLogger("startServer", rootLogger);
  const config = getConfig();
  logger.debug("Got config:", config);
  const { serverPath, serverPort } = config;
  logger.debug({ serverPath, serverPort });
  const useHTTPS = process.env.NODE_ENV === "development" ? true : config.https;
  await initializeDB();
  const app = express();

  app.use("*", requestLogger);

  if (startDevServer) {
    await bootstrapDevServer({ app })
    app.use("*", unless(/^\/+(index\.html|login|account|app\.js)?(\?.*)?$/, express.static("./dist")));
  } else {
    logger.debug("start up non-dev server");
    // In non-dev mode, we expect client files to already be present in /dist directory.
    // `npm run start` script is responsible for ensuring that.
    app.use("*", unless(/^\/+(index\.html|login|account)?(\?.*)?$/, express.static("./dist")));
  }
  app.use(bodyParser.json());
  app.use(path.join(serverPath, "/api"), getAPI(getPassport()));
  app.get("*", iff(/^\/+(index\.html|login|account)?(\?.*)?$/, serveIndex));

  /* istanbul ignore next */
  const options = {};
  let server;
  if (useHTTPS) {
    // https://gaboesquivel.com/blog/2014/node.js-https-and-ssl-certificate-for-development/
    logger.debug("going to start HTTPS");
    options.key = await fs.promises.readFile(path.resolve(process.cwd(), "cert/vhoarder.key"));
    options.cert = await fs.promises.readFile(path.resolve(process.cwd(), "cert/vhoarder.crt"));
    server = https.createServer(options, app);
  } else {
    logger.debug("going to start HTTP");
    server = http.createServer(app);
  }

  logger.debug("bootstrap passport");
  bootstrapPassport({ app });

  logger.debug("boostrap sockets");
  bootstrapSocketIO({
    server,
    sessionStore: getSessionStore(),
    secret: Secret,
    pathname: serverPath,
  });
  const onServerStart = () => {
    /* istanbul ignore next because we are not testing whether this callback is called */
    logger.info(`App listening on port ${serverPort}, at "${serverPath}"`);
  };
  server.listen(7200, onServerStart);
  await initializeYTDL();
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  startServer(process.env.NODE_ENV === "development");
}
