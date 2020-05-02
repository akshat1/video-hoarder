/** @module server */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import getPassport from './getPassport.js';

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
  app.use(bodyParser.urlencoded({ extended: true }));

  // Auth
  app.use(expressSession({
    secret: 'nyan cat',
    resave: false,
    saveUninitialized: false,
  }));
  const passport = getPassport();
  app.use(passport.initialize());
  app.use(passport.session());
  app.post('/getProfile', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).send('Not logged in');
    }
  });
  app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

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

  const serveIndex = (req, res) =>
    res.sendFile(
      path.resolve(process.cwd(), './dist/index.html'),
      err => err && res.status(500).send(err)
    );
  app.get('/*', serveIndex);

  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

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
