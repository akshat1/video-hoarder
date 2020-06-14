import { getLogger } from "../logger.js";

const logger = getLogger("serveIndex");
export const bootstrap = async ({ app }) => {
  logger.debug("start up dev server");
  const webpack = (await import("webpack")).default;
  const webpackDevMiddleware = (await import("webpack-dev-middleware")).default;
  const webpackConfig = (await import("../../webpack.config.cjs")).default;
  logger.debug("WebPack Config", webpackConfig);
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {}));
  const webpackHotMiddleware = (await import("webpack-hot-middleware")).default;
  app.use(webpackHotMiddleware(compiler));
};
