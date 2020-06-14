import { Event } from "../Event";
import { getLogger } from "../logger";
import { getStore } from "./redux";
import { fetchJobs, updateJobInStore } from "./redux/actions";
import { getURL } from "./util";
import ioClient from "socket.io-client";

const rootLogger = getLogger("socketio");

let socket;
/**
 * A singleton socket-io client.
 * @returns {SocketIOClient}
 */
export const getSocket = () => {
  if (!socket) {
    getLogger("getLogger", rootLogger).debug("Creating a new instance of ioClient from", getURL("/"));
    socket = ioClient("/", { path: getURL("socket.io") });
  }

  return socket;
};

const onItemAdded = () => {
  getLogger("onItemAdded", rootLogger).debug("ItemAdded");
  getStore().dispatch(fetchJobs());
};

const onItemRemoved = () => {
  getLogger("onItemRemoved", rootLogger).debug("ItemRemoved");
  getStore().dispatch(fetchJobs());
};

const onItemUpdated = (item) => {
  getLogger("onItemUpdated", rootLogger).debug(item);
  getStore().dispatch(updateJobInStore(item));
};

export const bootstrapClient = () => {
  const logger = getLogger("bootstrapClient", rootLogger);
  const socket = getSocket();
  logger.debug("got a client", socket);
  socket.on(Event.ItemAdded, onItemAdded);
  socket.on(Event.ItemRemoved, onItemRemoved);
  socket.on(Event.ItemUpdated, onItemUpdated);
  window.ioClient = socket;
};

export const reconnect = () => {
  const logger = getLogger("reconnect", rootLogger);
  const socket = getSocket();
  logger.debug("disconnect...");
  socket.disconnect();
  logger.debug("done. connect...");
  socket.connect();
  logger.debug("done.");
};

export const disconnect = () => {
  const logger = getLogger("disconnect", rootLogger);
  logger.debug("disconnect...");
  getSocket().disconnect();
  logger.debug("done.");
};
