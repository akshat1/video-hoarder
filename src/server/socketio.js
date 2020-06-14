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

const onClientConnected = () => {
  const logger = getLogger("onClientConnected", rootLogger);
  logger.debug("A client just connected");
};

export const bootstrap = ({ server, sessionStore, secret, pathname = "/" }) => {
  const logger = getLogger("bootstrap", rootLogger);
  const io = SocketIO(server, {
    path: path.join(pathname, "socket.io"),
  });
  logger.debug("io instance created");
  // See https://github.com/jfromaniello/passport.socketio
  io.use(passportSocketIO.authorize({
    cookieParser,
    secret,
    store: sessionStore,
  }));
  // Broadcast events.
  // TODO: Figure out how to restrict this to authenticated clients; look into a separate channel for authed clients.
  subscribe(Event.ItemAdded, _.curry(onItemAdded)(io));
  subscribe(Event.ItemRemoved, _.curry(onItemRemoved)(io));
  subscribe(Event.ItemUpdated, _.curry(onItemUpdated)(io));
  logger.debug("broadcast events wired.");

  io.on("connection", onClientConnected);
};
