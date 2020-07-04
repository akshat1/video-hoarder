const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const publicPath = "/static/";
const isDevMode = () => process.env.NODE_ENV === "development";

const getDevServer = () => {
  if (isDevMode()) {
    return {
      hot: true,
      inline: true,
      https: true,
      port: 7200,
      host: "0.0.0.0",  // because remote development is neat.
      publicPath,
      contentBase: path.resolve(process.cwd(), "./dist"),
      historyApiFallback: true,
      index: "index.html",
      serveIndex: true,
      clientLogLevel: "debug",
    };
  }

  return undefined;
}

const getPlugins = () => {
  const plugins = [
    new CopyPlugin({
      patterns: [{
        from: "src/client/static",
        to: ".",
      }],
    }),
  ];

  if (isDevMode()) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  plugins.push(new SWPrecacheWebpackPlugin({
    cacheId: `video-hoarder-${Date.now()}`,
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: "service-worker.js",
    minify: true,
    navigateFallback: publicPath + "index.html",
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
  }));

  plugins.push(new HtmlWebPackPlugin({
    template: "./src/client/template.html",
    filename: "./index.html",
  }));

  return plugins;
}

const getEntry = () => {
  const app = ["./src/client/index.js"];
  if (isDevMode()) {
    app.push("webpack-hot-middleware/client");
  }

  return { app };
}

const getJSRule = () => ({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: { loader: "babel-loader" },
});

const webpackConfig = {
  mode: isDevMode() ? "development" : "production",
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    publicPath,
  },
  devtool: isDevMode() ? "inline-source-map" : false,
  plugins: getPlugins(),
  module: {
    rules: [
      getJSRule(),
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: getDevServer(),
  node: {
    fs: "empty",
  },
};

module.exports = webpackConfig;
