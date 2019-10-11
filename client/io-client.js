import ioClient from 'socket.io-client';

let io;

/**
 * @function
 * @returns {SocketIO} -
 */
const getClient = () => {
  if (!io) {
    io = ioClient('/');
    window.io = io;
  }

  return io;
}

export default getClient;
