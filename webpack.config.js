/* eslint-disable @typescript-eslint/no-var-requires */
// const path = require("path");
const path = require("path/posix");
const webpack = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devtool: "inline-source-map",
  entry: "./src/client/index.tsx",
  output: {
    filename: "app.js",
    path: path.join(__dirname, "public"),
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
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: true,
  },
};
