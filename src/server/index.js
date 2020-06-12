/* @todo: support both http and https; make https optional */
/* @todo: base URL ()for working behing reverse proxy */
/** @module server */
import { getConfig } from "../config.js";
import { getLogger } from "../logger.js";
import { getRouter as getAPI } from "./api/index.js";
import { initialize as initializeDB } from "./db/index.js";  // oooh modules are soooo awesome! and even Node support them now. Mmmm hmmm.
import { requestLogger } from "./express-middleware/index.js";
import { getPassport } from "./getPassport.js";
import { bootstrapApp } from "./socketio.js";
import { initializeYTDL } from "./ytdl.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import expressSession from "express-session";
import fs from "fs";
import http from "http";
import https from "https";
import MemoryStore from "memorystore";
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
  const config = await getConfig();
  const serverPath = config.serverPath;
  const serverPort = config.serverPort;
  const useHTTPS = process.env.NODE_ENV === "development" ? true : config.https;
  await initializeDB();
  const app = express();

  app.use("*", requestLogger);

  if (startDevServer) {
    const webpack = (await import("webpack")).default;
    const webpackDevMiddleware = (await import("webpack-dev-middleware")).default;
    const webpackConfig = (await import("../../webpack.config.cjs")).default;
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {}));
    const webpackHotMiddleware = (await import("webpack-hot-middleware")).default;
    app.use(webpackHotMiddleware(compiler));
  } else {
    // In non-dev mode, we expect client files to already be present in /dist directory.
    // `npm run start` script is responsible for ensuring that.
    app.use(path.join(serverPath), express.static("./dist"));
  }

  const serveIndex = (req, res) => {
    logger.debug("serveIndex...");
    res.sendFile(
      path.resolve(process.cwd(), "./dist/index.html"),
      err => err && res.status(500).send(err),
    );
  }

  // Other middlewares can create problems with session middleware. So, we place session middleware at the end
  // See https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive for some great info
  const secret = "dogs for me please";
  const SessionDuration = 24 * 60 * 60 * 1000;
  const sessionStore = new (MemoryStore(expressSession))({ checkPeriod: SessionDuration });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(secret));
  app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: SessionDuration },
    secret,
    store: sessionStore,
  }));
  const passport = getPassport();
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(path.join(serverPath, "/api"), getAPI(passport));
  app.get(serverPath, serveIndex);
  app.get(path.join(serverPath, "/"), serveIndex);
  app.get(path.join(serverPath, "/index.html"), serveIndex);
  app.get(path.join(serverPath, "/login"), serveIndex);
  app.get(path.join(serverPath, "/account"), serveIndex);

  // https://gaboesquivel.com/blog/2014/node.js-https-and-ssl-certificate-for-development/
  /* istanbul ignore next */
  const options = {};
  let server;
  if (useHTTPS) {
    logger.debug("going to start HTTPS");
    options.key = await fs.promises.readFile(path.resolve(process.cwd(), "cert/vhoarder.key"));
    options.cert = await fs.promises.readFile(path.resolve(process.cwd(), "cert/vhoarder.crt"));
    server = https.createServer(options, app);
  } else {
    logger.debug("going to start HTTP");
    server = http.createServer(app);
  }
  logger.debug("call bootstrap app");
  bootstrapApp({ server, sessionStore, secret, pathname: serverPath });
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
