import bootstrapApp from './event-handlers.mjs';
import express from 'express';
import getLogger from '../common/logger.mjs';
import http from 'http';
import SocketIO from 'socket.io';

const logger = getLogger({ module: 'server' });

// Config
const port = 4000;

// Static HTTP
const app = express();
const server = http.createServer(app);
app.use(express.static('public'));
app.use(express.static('build'));

// Sockets
const io = SocketIO(server);
bootstrapApp(io);

server.listen(port, () => logger.info(`Server listening on port ${port}`));
