/* eslint-disable @typescript-eslint/no-var-requires */
// const path = require("path");
const path = require("path/posix");
const webpack = require("webpack");
const WorkboxPlugin = require("workbox-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? false : "inline-source-map",
  entry: "./src/client/index.tsx",
  optimization: {
    usedExports: true,
  },
  output: {
    filename: "app.js",
    path: path.join(__dirname, "public"),
    publicPath: "/",
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: "ts-loader",
      exclude: /node_modules/,
      options: {
        transpileOnly: true,
      },
    }],
  },
  resolve: {
    extensions: [".tsx", ".ts", "..."],
    fallback: {
      minimatch: false,
      "react-native-sqlite-storage": false,
      path: false,
      fs: false,
    },
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/type-graphql$/, resource => {
      resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim.js");
    }),
    new webpack.NormalModuleReplacementPlugin(/^typeorm$/, resource => {
      resource.request = resource.request.replace(/^typeorm$/, path.join(process.cwd(), "src", "client", "typeorm-shim"));
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    port: 8080,
    host: "localhost",
    allowedHosts: "all",
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: true,
  },
};
