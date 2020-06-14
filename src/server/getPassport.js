/**
 * @module server/getPassport
 */
/* @todo: support both http and https; make https optional */
/* @todo: base URL ()for working behing reverse proxy */
/** @module server */
import { getLogger } from "../logger.js";
import { getRouter as getAPI } from "./api/index.js";
import { getConfig } from "./config.js";
import { initialize as initializeDB } from "./db/index.js";  // oooh modules are soooo awesome! and even Node support them now. Mmmm hmmm.
import { getUserByUserName,getVerifiedUser } from "./db/index.js";
import { iff, requestLogger, unless } from "./express-middleware/index.js";
import { bootstrap as bootstrapSocketIO } from "./socketio.js";
import { initializeYTDL } from "./ytdl.js";
import Base64 from "Base64";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import expressSession from "express-session";
import fs from "fs";
import http from "http";
import https from "https";
import _ from "lodash";
import MemoryStore from "memorystore";
import passport from "passport";
import Strategy from "passport-local";
import path from "path";

const rootLogger = getLogger("getPassport");
rootLogger.setLevel("warn");

export const MessageIncorrectLogin = "Incorrect username or password.";

/**
 * Takes a user as returned from the database and sets the loggedIn flag while removing the password and salt fields.
 * @func
 * @private
 * @param {User} user -
 * @returns {User}
 */
export const getReturnableUser = user => ({
  ..._.pick(user, "userName", "passwordExpired"),
  loggedIn: true,
});

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
      return cb(null, getReturnableUser(user));
    }

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
    cb(null, getReturnableUser(user));
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

export const SessionDuration = 24 * 60 * 60 * 1000;
export const Secret = "dogs for me please";

let sessionStore;
export const getSessionStore = () => {
  if (!sessionStore) {
    sessionStore = new (MemoryStore(expressSession))({ checkPeriod: SessionDuration });
  }

  return sessionStore;
};

export const bootstrap = ({ app }) => {
  // Other middlewares can create problems with session middleware. So, we place session middleware at the end
  // See https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive for some great info
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(Secret));
  app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: SessionDuration },
    secret: Secret,
    store: sessionStore,
  }));
  const passport = getPassport();
  app.use(passport.initialize());
  app.use(passport.session());
};
