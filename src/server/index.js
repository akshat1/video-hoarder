/** @module server */
import express from 'express';

/**
 * Wraps the server starting logic inside a function for ease of testing (also because we don't
 * yet have top level async/await). This function is called automatically when NODE_ENV != test.
 * During testing, we explicitly call this function and set the single boolean param according to
 * which branch we are currently testing.
 *
 * @param {boolean} startDevServer
 */
export const startServer = async (startDevServer) => {
  const app = express();
  if (startDevServer) {
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

  app.listen(
    7200,
    /* istanbul ignore next because we are not testing whether this callback is called */
    () => console.log('App listening on port 7200'
    )
  );
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  startServer(process.env.NODE_ENV === 'development');
}
