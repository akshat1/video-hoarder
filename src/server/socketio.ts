import { Event, ItemUpdatedPayload } from "../Event";
import { getLogger } from "../logger"
import { Item } from "../model/Item";
import { YTDLInformation } from "../model/ytdl";
import { subscribe } from "./event-bus";
import cookieParser from "cookie-parser";
import session from "express-session";
import { Server as HttpServer } from "http";
import _ from "lodash";
import passportSocketIO from "passport.socketio";
import path from "path";
import SocketIO, { Server, Socket } from "socket.io";

const rootLogger = getLogger("socketio");

const itemAddedLogger = getLogger("onItemAdded", rootLogger);
const onItemAdded = (io, item) => {
  itemAddedLogger.debug("ItemAdded");
  io.emit(Event.ItemAdded, item);
};

const onItemRemoved = (io: Server, item: Item) => io.emit(Event.ItemRemoved, item);
const onItemUpdated = (io: Server, payload: ItemUpdatedPayload) => io.emit(Event.ItemUpdated, payload);
const onYTDLUpgradeFailed = (io: Server, error: Error) => io.emit(Event.YTDLUpgradeFailed, error);
const onYTDLUpgradeSucceeded = (io: Server, ytdlInfo: YTDLInformation) => io.emit(Event.YTDLUpgradeSucceeded, ytdlInfo);

const onClientConnected = (socket: Socket) => {
  const logger = getLogger("onClientConnected", rootLogger);
  logger.debug("A client just connected");
  socket.emit("TEST EVENT", "HELLO");
};

interface BootstrapArgs {
  pathname: string,
  secret: string,
  server: HttpServer,
  sessionStore: session.MemoryStore
}

export const bootstrap = (args: BootstrapArgs): void => {
  const { pathname = "/", secret, server, sessionStore } = args;
  const logger = getLogger("bootstrap", rootLogger);
  const io = SocketIO(server, {
    path: path.join(pathname, "socket.io"),
  });
  logger.debug("io instance created");

  // See https://github.com/jfromaniello/passport.socketio
  io.use(passportSocketIO.authorize({
    key: "connect.sid",
    // @ts-ignore
    cookieParser,
    secret,
    // @ts-ignore
    store: sessionStore,
  }));

  // Broadcast events.
  subscribe(Event.ItemAdded, item => onItemAdded(io, item));
  subscribe(Event.ItemRemoved, _.curry(onItemRemoved)(io));
  subscribe(Event.ItemUpdated, _.curry(onItemUpdated)(io));
  subscribe(Event.YTDLUpgradeFailed, _.curry(onYTDLUpgradeFailed)(io));
  subscribe(Event.YTDLUpgradeSucceeded, _.curry(onYTDLUpgradeSucceeded)(io));
  logger.debug("broadcast events wired.");

  // Listen for connections.
  io.on("connection", onClientConnected);
};
