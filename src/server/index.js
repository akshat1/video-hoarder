/** @module server */
import express from 'express';

// because we don't have top level async/await yet, we must put all this code inside a function.
const startServer = async () => {
  const app = express();
  if (process.env.NODE_ENV === 'development') {
    const webpack = (await import('webpack')).default;
    const webpackDevMiddleware = (await import('webpack-dev-middleware')).default;
    const webpackConfig = (await import('../../webpack.config.cjs')).default;
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {}));
    const webpackHotMiddleware = (await import('webpack-hot-middleware')).default;
    app.use(webpackHotMiddleware(compiler));
  } else {
    // In non-dev mode, we expect client files to already be present in /dist directory.
    // `npm run start` script is responsible for ensuring that.
    app.use(express.static('./dist'));
  }

  app.listen(7200, () => console.log('App listening on port 7200'));
};

startServer();
