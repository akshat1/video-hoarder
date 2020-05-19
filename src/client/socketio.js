import ioClient from "socket.io-client";
import { Event } from "../Event";
import { getLogger } from "../logger";

const rootLogger = getLogger("socketio");

let socket;
/**
 * A singleton socket-io client.
 * @returns {SocketIOClient}
 */
export const getSocket = () => {
  if (!socket) {
    getLogger("getLogger", rootLogger).debug("Creating a new instance of ioClient");
    socket = ioClient("/");
  }

  return socket;
};

export const bootstrapClient = () => {
  const logger = getLogger("bootstrapClient", rootLogger);
  const socket = getSocket();
  logger.debug("got a client", !!socket);
  socket.on(Event.ItemAdded, item => logger.debug("ItemAdded", item));
  socket.on(Event.ItemRemoved, item => logger.debug("ItemRemoved", item));
  socket.on(Event.ItemUpdated, item => logger.debug("ItemUpdated", item));
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
