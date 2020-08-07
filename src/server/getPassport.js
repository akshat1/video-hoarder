/**
 * @module server/getPassport
 */

import { getLogger } from "../logger.js";
import { getClientUser } from "../model/User.js";
import { getUserByUserName,getVerifiedUser } from "./db/index.js";
import Base64 from "Base64";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import Strategy from "passport-local";

const rootLogger = getLogger("getPassport");
rootLogger.setLevel("warn");

export const MessageIncorrectLogin = "Incorrect username or password.";

/**
 * Called by passport.js to verify the current user during log-in.
 *
 * @func
 * @private
 * @param {string} userName 
 * @param {string} password - unencrypted password
 * @param {Function} cb -
 * @returns {Promise}
 */
export const verifyUser = async (userName, password, cb) => {
  const logger = getLogger("verifyUser", rootLogger);
  try {
    logger.debug("verifyUser called", userName, "*********");
    const user = await getVerifiedUser(userName, password);
    if (user) {
      return cb(null, getClientUser(user));
    }

    logger.debug("Auth failed");
    return cb(null, false, { message: MessageIncorrectLogin });
  } catch (err) {
    logger.error(err);
    cb(err);
  }
};

/**
 * Given a user object, calls `cb` with a single memoizable identifier to be placed in cookie.
 *
 * @func
 * @private
 * @param {User} user
 * @param {Function} cb
 */
export const serializeUser = (user, cb) => {
  rootLogger.debug("serialize user")
  cb(null, Base64.btoa(user.userName));
};

/**
 * Given a memoizable identifier, return the corresponding User object.
 *
 * @func
 * @private
 * @param {string} id
 * @param {Function} cb
 * @returns {Promise}
 */
export const deserializeUser = async (id, cb) => {
  const logger = getLogger("deserializeUser", rootLogger);
  logger.debug(id);
  try {
    const userName = Base64.atob(id);
    logger.debug(userName);
    const user = await getUserByUserName(userName);
    logger.debug(user);
    cb(null, getClientUser(user));
  } catch (err) {
    logger.debug("error trying to deserialize user.", err);
    cb(err);
  }
};

let instance;
/**
 * @func
 * @returns {Object} - passport.js instance.
 */
export const getPassport = () => {
  const logger = getLogger("getPassport", rootLogger);
  if (!instance) {
    logger.debug("Create passport instance");
    const localStrategy = new Strategy({
      usernameField: "username",
      passwordField: "password",
    }, verifyUser);
    passport.use(localStrategy);
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    instance = passport
  }
  return instance;
};

/** @type {number} */
export const SessionDuration = 24 * 60 * 60 * 1000;
/** @type {string} */
export const Secret = new Date(Date.now() + Math.random()).toUTCString();

let sessionStore;
/**
 * @returns {Object} - the singleton instance of the session store.
 */
export const getSessionStore = () => {
  if (!sessionStore) {
    getLogger("getSessionStore", rootLogger).debug("Create new instance of MemoryStore");
    sessionStore = new (MemoryStore(expressSession))({ checkPeriod: SessionDuration });
  }

  return sessionStore;
};

let sessionMiddleware;
/**
 * @returns {Object} - the singleton instance of the session middleware.
 */
export const getSessionMiddleware = () => {
  if (!sessionMiddleware) {
    sessionMiddleware = expressSession({
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: SessionDuration },
      secret: Secret,
      store: getSessionStore(),
    });
  }

  return sessionMiddleware;
}

/**
 * Wires up the provided Express application object to use passport local auth.
 * @param {Object} args
 * @param {Application}
 */
export const bootstrap = ({ app }) => {
  // Other middlewares can create problems with session middleware. So, we place session middleware at the end
  // See https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive for some great info
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(Secret));
  app.use(getSessionMiddleware());
  const passport = getPassport();
  app.use(passport.initialize());
  app.use(passport.session());
};
