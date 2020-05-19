import _ from "lodash";
import SocketIO from "socket.io";
import { subscribe } from "./event-bus.js";
import { Event } from "../Event.js";
import { getLogger } from "../logger.js"
import cookieParser from "cookie-parser";
import passportSocketIO from "passport.socketio";

const rootLogger = getLogger("socketio");

const onItemAdded = (io, item) => io.emit(Event.ItemAdded, item);
const onItemRemoved = (io, item) => io.emit(Event.ItemRemoved, item);
const onItemUpdated = (io, item) => io.emit(Event.ItemUpdated, item);

const onClientConnected = () => {
  const logger = getLogger("onClientConnected", rootLogger);
  logger.debug("A client just connected");
};

export const bootstrapApp = ({ server, sessionStore, secret }) => {
  const logger = getLogger("bootstrapApp", rootLogger);
  const io = SocketIO(server);
  logger.debug("io instance created");
  // See https://github.com/jfromaniello/passport.socketio
  io.use(passportSocketIO.authorize({
    cookieParser,
    secret,
    store: sessionStore,
    success: () => logger.debug("auth success"),
    fail: () => logger.debug("auth failure"),
  }));
  // Broadcast events.
  // TODO: Figure out how to restrict this to authenticated clients; look into a separate channel for authed clients.
  subscribe(Event.ItemAdded, _.curry(onItemAdded)(io));
  subscribe(Event.ItemRemoved, _.curry(onItemRemoved)(io));
  subscribe(Event.ItemUpdated, _.curry(onItemUpdated)(io));
  logger.debug("broadcast events wired.");

  io.on("connection", onClientConnected);
};
