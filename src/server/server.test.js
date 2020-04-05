import assert from 'assert';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config.cjs';
import { startServer } from './index';

jest.mock('express', () => {
  const mockExpress = jest.fn();
  mockExpress.static = jest.fn();

  return {
    __esModule: true,
    default: mockExpress,
  };
});

jest.mock('webpack', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('webpack-dev-middleware', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('webpack-hot-middleware', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../webpack.config.cjs', () => 'webpack-config');

/* Note that server/index.js doesn't automatically start the express server when NODE_ENV is test.
You have to explicitly call `startServer()` in such a situation. */
describe('server/start-server', () => {
  test('should start the express server without webpack by default', async () => {
    const app = {
      listen: jest.fn(),
      use: jest.fn(),
    };
    express.static.mockReturnValue('static');
    express.mockReturnValue(app);
    await startServer();
    assert.equal(express.mock.calls.length, 1);
    assert.equal(app.listen.mock.calls.length, 1);  // TODO: assert correct port once we have the config system up.
    assert.ok(!!app.use.mock.calls.find(([middleware]) => middleware === 'static'));
  });

  test('should start the express server with webpack when so instructed', async () => {
    const app = {
      listen: jest.fn(),
      use: jest.fn(),
    };
    webpack.mockImplementation(config => ({ config }));  // This is what makes our assertions on dev and hotmiddleware work.
    express.mockReturnValue(app);
    webpackDevMiddleware.mockReturnValue('webpackDevMiddleware');
    webpackHotMiddleware.mockReturnValue('webpackHotMiddleware');
    await startServer(true);
    assert.equal(express.mock.calls.length, 1);
    assert.equal(app.listen.mock.calls.length, 1);  // TODO: assert correct port once we have the config system up.
    assert.ok(!!app.use.mock.calls.find(([middleware]) => middleware === 'webpackDevMiddleware'));
    assert.ok(!!app.use.mock.calls.find(([middleware]) => middleware === 'webpackHotMiddleware'));
    assert.ok(!!webpackDevMiddleware.mock.calls.find(([compiler]) => compiler && compiler.config === webpackConfig));
    assert.ok(!!webpackHotMiddleware.mock.calls.find(([compiler]) => compiler && compiler.config === webpackConfig));
  });
});