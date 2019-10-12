import bootstrapApp from './event-handlers.mjs';
import config from '../webpack.config.mjs';
import express from 'express';
import getLogger from '../common/logger.mjs';
import http from 'http';
import SocketIO from 'socket.io';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const logger = getLogger({ module: 'server' });

// Config
const port = 4000;

// Static HTTP
const app = express();
const compiler = webpack(config);
const server = http.createServer(app);
app.use(webpackDevMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));
app.use(express.static('public'));
app.use(express.static('build'));

// Sockets
const io = SocketIO(server);
bootstrapApp(io);

server.listen(port, () => logger.info(`Server listening on port ${port}`));
