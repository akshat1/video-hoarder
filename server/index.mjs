import bootstrapApp from './event-handlers/index.mjs';
import express from 'express';
import getLogger from '../common/logger.mjs';
import http from 'http';
import SocketIO from 'socket.io';

const start = async () => {
  const logger = getLogger({ module: 'server' });

  // Config
  const port = 4000;

  // Static HTTP
  const app = express();
  const server = http.createServer(app);

  if (process.env.NODE_ENV === 'development') {
    // We don't want to install these dev dependencies in our prod env (docker container)
    // So, dyanmic imports.
    const [
      { default: webpack },
      { default: webpackDevMiddleware },
      { default: webpackHotMiddleware },
      { default: config },
    ] = await Promise.all([
      import('webpack'),
      import('webpack-dev-middleware'),
      import('webpack-hot-middleware'),
      import('../webpack.config.mjs')
    ]);
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler));
    app.use(webpackHotMiddleware(compiler));
  }

  app.use(express.static('public'));
  app.use(express.static('build'));

  // Sockets
  const io = SocketIO(server);
  bootstrapApp(io);

  server.listen(port, () => logger.info(`Server listening on port ${port}`));
}

start();
