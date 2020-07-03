import { Event } from "../Event.js";
import { getLogger } from "../logger.js"
import { subscribe } from "./event-bus.js";
import cookieParser from "cookie-parser";
import _ from "lodash";
import passportSocketIO from "passport.socketio";
import path from "path";
import SocketIO from "socket.io";

const rootLogger = getLogger("socketio");

const itemAddedLogger = getLogger("onItemAdded", rootLogger);
const onItemAdded = (io, item) => {
  itemAddedLogger.debug("ItemAdded");
  io.emit(Event.ItemAdded, item);
};

const onItemRemoved = (io, item) => io.emit(Event.ItemRemoved, item);
const onItemUpdated = (io, item) => io.emit(Event.ItemUpdated, item);
const onYTDLUpgradeFailed = (io, error) => io.emit(Event.YTDLUpgradeFailed, error);
const onYTDLUpgradeSucceeded = (io, ytdlInfo) => io.emit(Event.YTDLUpgradeSucceeded, ytdlInfo);

/**
 * 
 * @param {import("socket.io").Socket} socket 
 */
const onClientConnected = (socket) => {
  const logger = getLogger("onClientConnected", rootLogger);
  logger.debug("A client just connected");
  socket.emit("TEST EVENT", "HELLO");
};

export const bootstrap = ({ server, sessionStore, secret, pathname = "/" }) => {
  const logger = getLogger("bootstrap", rootLogger);
  const io = SocketIO(server, {
    path: path.join(pathname, "socket.io"),
  });
  logger.debug("io instance created");

  // See https://github.com/jfromaniello/passport.socketio
  io.use(passportSocketIO.authorize({
    key: "connect.sid",
    cookieParser,
    secret,
    store: sessionStore,
  }));

  // Broadcast events.
  subscribe(Event.ItemAdded, item => onItemAdded(io, item));
  subscribe(Event.ItemRemoved, _.curry(onItemRemoved)(io));
  subscribe(Event.ItemUpdated, _.curry(onItemUpdated)(io));
  subscribe(Event.YTDLUpgradeFailed, _.curry(onYTDLUpgradeFailed)(io));
  subscribe(Event.YTDLUpgradeSucceeded, _.curry(onYTDLUpgradeSucceeded)(io));
  logger.debug("broadcast events wired.");

  io.on("connection", onClientConnected);
};
