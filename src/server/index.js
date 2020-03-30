/** @module server */
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack.config.cjs';

const startServer = async () => {
  const app = express();
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {}));
  if (process.env.NODE_ENV === 'development') {
    const webpackHotMiddleware = (await import('webpack-hot-middleware')).default;
    app.use(webpackHotMiddleware(compiler));
  }
  app.use(express.static('./src/static'));
  app.listen(7200, () => console.log('App listening on port 7200'));
};

startServer();
