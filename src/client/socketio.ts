/* e slint-disable jsx-control-statements/jsx-jcs-no-undef */  // For SicketIOClient namespace and jsx-control-statements/jsx-jcs-no-undef

import { Event } from "../Event";
import { getLogger } from "../logger";
import { Dictionary } from "../model/Dictionary";
import { getTitle, Item } from "../model/Item";
import { YTDLInformation } from "../model/ytdl";
import { getStore } from "./redux";
import { fetchJobs, updateJobInStore } from "./redux/job-management";
import { showNotification } from "./redux/notifications";
import { signalYTDLUpgradeFailure, signalYTDLUpgradeSuccess } from "./redux/ytdl";
import { getURL } from "./util";
import ioClient from "socket.io-client";

const rootLogger = getLogger("socketio");

let socket;
/**
 * A singleton socket-io client.
 */
export const getSocket = (): SocketIOClient.Socket => {
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

const onItemAdded = (item: Item) => {
  getLogger("onItemAdded", rootLogger).debug("ItemAdded");
  // @ts-ignore
  getStore().dispatch(showNotification(`Added ${getTitle(item)}`));
  // @ts-ignore
  getStore().dispatch(fetchJobs());
};

const onItemRemoved = (item: Item) => {
  getLogger("onItemRemoved", rootLogger).debug("ItemRemoved");
  // @ts-ignore
  getStore().dispatch(showNotification(`Removed ${getTitle(item)}`));
  // @ts-ignore
  getStore().dispatch(fetchJobs());
};

const onItemUpdated = (args: { item: Item }) => {
  const { item } = args;
  getLogger("onItemUpdated", rootLogger).debug(item);
  // @ts-ignore
  getStore().dispatch(updateJobInStore(item));
};

const onYTDLUpgradeFailed = (error: Error) => {
  // @ts-ignore
  getStore().dispatch(signalYTDLUpgradeFailure(error));
};

const onYTDLUpgradeSucceeded = (ytdlInfo: YTDLInformation) => {
  // @ts-ignore
  getStore().dispatch(signalYTDLUpgradeSuccess(ytdlInfo));
};

const wireSocket = (socket: SocketIOClient.Socket, eventHandlers: Dictionary<(...args: any[]) => void>) =>
  Object
    .keys(eventHandlers)
    .forEach(eventName =>
      socket.on(eventName, eventHandlers[eventName]));

export const bootstrapClient = (): void => {
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

  // @ts-ignore
  window.ioClient = socket;
};

export const reconnect = (): void => {
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
};

export const disconnect = (): void => {
  const logger = getLogger("disconnect", rootLogger);
  logger.debug("disconnect...");
  getSocket().disconnect();
  logger.debug("done.");
};
