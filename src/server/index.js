/** @module server */
import { getLogger } from "../logger";
import { getRouter as getAPI } from "./api/index";
import { getConfig } from "./config";
import { initialize as initializeDB } from "./db/index";  // oooh modules are soooo awesome! and even Node support them now. Mmmm hmmm.
// import { bootstrap as bootstrapDevServer } from "./dev-server";
import { requestLogger } from "./express-middleware/index";
import { getPassport } from "./getPassport";
import { bootstrap as bootstrapPassport, getSessionStore, Secret } from "./getPassport";
import { serveIndex } from "./serve-index";
import { serveWebManifest } from "./serve-webmanifest";
import { bootstrap as bootstrapSocketIO } from "./socketio";
import { initializeYTDL } from "./ytdl";
import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

const rootLogger = getLogger("server");

process.on("unhandledRejection", (reason, p) => {
  getLogger("process.unhandledRejection", rootLogger)
    .error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

/**
 * Wraps the server starting logic inside a function for ease of testing (also because we don't
 * yet have top level async/await). This function is called automatically when NODE_ENV != test.
 * During testing, we explicitly call this function and set the single boolean param according to
 * which branch we are currently testing.
 *
 * @func
 */
export const startServer = async () => {
  const logger = getLogger("startServer", rootLogger);
  const config = getConfig();
  logger.debug("Got config:", config);
  const { serverPort } = config;
  // Note: config.serverPath is for the frontend. The translation from <your domain>/serverPath to "/" will happen in your proxy server (which is nginx for most people).
  const serverPath = "/";
  logger.debug({ serverPath, serverPort });
  const useHTTPS = false; // process.env.NODE_ENV === "development" ? true : config.https; TODO: enable https for dev environments.
  try {
    await initializeDB();
  } catch (err) {
    logger.error("Error ininitializeDB.");
    logger.error(err);
    process.exit(1);
  }

  const app = express();

  app.use(requestLogger);
  app.use(bodyParser.json());
  app.use(path.join(serverPath, "/static/"), express.static("./dist"));
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
  app.use(path.join(serverPath, "api"), getAPI(getPassport()));

  logger.debug("boostrap sockets");
  bootstrapSocketIO({
    pathname: serverPath,
    server,
    sessionStore: getSessionStore(),
    secret: Secret,
    // pathname: serverPath,
  });
  const onServerStart = () => {
    /* istanbul ignore next because we are not testing whether this callback is called */
    logger.info(`App listening on port ${serverPort}, at "${serverPath}"`);
  };
  server.listen(serverPort, onServerStart);
  await initializeYTDL();
  app.get(path.join(serverPath, "/app.webmanifest"), serveWebManifest);
  // Must come last
  app.get(path.join(serverPath, "service-worker.js"), (req, res) => {
    logger.debug("serveServiceWorker", req.path);
    return res.sendFile(
      path.resolve(process.cwd(), "./dist/service-worker.js"),
      err => err && res.status(500).send(err),
    )});
  app.get("*", serveIndex);
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  startServer(process.env.NODE_ENV === "development");
}
