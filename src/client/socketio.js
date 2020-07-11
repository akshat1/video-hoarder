import { Event } from "../Event";
import { getLogger } from "../logger";
import { getTitle } from "../model/Item";
import { getStore } from "./redux";
import { fetchJobs, showNotification, signalYTDLUpgradeFailure, signalYTDLUpgradeSuccess, updateJobInStore } from "./redux/actions";
import { getURL } from "./util";
import ioClient from "socket.io-client";

const rootLogger = getLogger("socketio");

let socket;
/**
 * A singleton socket-io client.
 * @returns {SocketIOClient}
 */
export const getSocket = () => {
  const logger = getLogger("getSocket", rootLogger);
  if (!socket) {
    const socketIOPath = getURL("socket.io");
    logger.debug("Creating a new instance of ioClient from", socketIOPath);
    socket = ioClient("/", { path: socketIOPath });
    socket.on("connect", () => logger.debug("Socket connected"));
    socket.on("connect_error", (err) => logger.error("Error connecting", err));
    socket.on("reconnect_failed", (err) => logger.error("Error re-connecting", err));
    socket.on("error", (err) => logger.error("Error", err));
    socket.on("disconnect", () => logger.debug("Socket disconnected"));
    socket.on("reconnect", () => logger.debug("Socket reconnected"));
    socket.on("reconnect_attempt", () => logger.debug("Socket reconnect_attempt"));
    socket.on("reconnecting", () => logger.debug("Socket reconnecting"));
    socket.on("reconnect_error", (err) => logger.error("Socket reconnect_err", err));
    socket.on("reconnect_failed", () => logger.error("Socket reconnect_failed"));
    socket.on("ping", () => logger.debug("ping"));
    socket.on("pong", (latency) => logger.debug("pong", latency));
  }

  return socket;
};

const onItemAdded = (item) => {
  getLogger("onItemAdded", rootLogger).debug("ItemAdded");
  getStore().dispatch(showNotification(`Added ${getTitle(item)}`));
  getStore().dispatch(fetchJobs());
};

const onItemRemoved = (item) => {
  getLogger("onItemRemoved", rootLogger).debug("ItemRemoved");
  getStore().dispatch(showNotification(`Removed ${getTitle(item)}`));
  getStore().dispatch(fetchJobs());
};

const onItemUpdated = (item) => {
  getLogger("onItemUpdated", rootLogger).debug(item);
  getStore().dispatch(updateJobInStore(item));
};

const onYTDLUpgradeFailed = (error) => {
  getStore().dispatch(signalYTDLUpgradeFailure(error));
};

const onYTDLUpgradeSucceeded = (ytdlInfo) => {
  getStore().dispatch(signalYTDLUpgradeSuccess(ytdlInfo));
};

const wireSocket = (socket, eventHandlers) =>
  Object
    .keys(eventHandlers)
    .forEach(eventName =>
      socket.on(eventName, eventHandlers[eventName]));

export const bootstrapClient = () => {
  const logger = getLogger("bootstrapClient", rootLogger);
  const socket = getSocket();
  logger.debug("got a client", socket);
  wireSocket(socket, {
    [Event.ItemAdded]: onItemAdded,
    [Event.ItemRemoved]: onItemRemoved,
    [Event.ItemUpdated]: onItemUpdated,
    [Event.YTDLUpgradeFailed]: onYTDLUpgradeFailed,
    [Event.YTDLUpgradeSucceeded]: onYTDLUpgradeSucceeded,
  });
  window.ioClient = socket;
};

export const reconnect = () => {
  const logger = getLogger("reconnect", rootLogger);
  const socket = getSocket();
  logger.debug("socket connected?", socket.connected);
  if (socket.connected) {
    logger.debug("Socket is already connected. Exit.");
  } else {
    logger.debug("Socket not connected. Connect now...");
    socket.disconnect();
    socket.connect();
    logger.debug("done.");
  }
  // logger.debug("disconnect...");
  // socket.disconnect();
};

export const disconnect = () => {
  const logger = getLogger("disconnect", rootLogger);
  logger.debug("disconnect...");
  getSocket().disconnect();
  logger.debug("done.");
};
