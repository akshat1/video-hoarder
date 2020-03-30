const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const app = ['./src/client/index.js'];
let devtool = false;
let plugins = [
  new HtmlWebPackPlugin({
    template: "./src/static/index.html",
    filename: "./index.html"
  })
];
let devServer = undefined;

if (mode === 'development') {
  app.push('webpack-hot-middleware/client');
  devtool = 'inline-source-map';
  plugins.push(new webpack.HotModuleReplacementPlugin());
  devServer = {
    hot: true,
    inline: true,
    https: true,
    port: 7200,
    host: '0.0.0.0',  // because remote development is neat.
    publicPath: '/',
    contentBase: './dist/'
  };
}

const config = {
  mode,
  entry: {
    app,
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devtool,
  plugins,
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: { loader: "babel-loader" }
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { sourceMap: mode === 'development', },
        }
      ],
    }, {
      test: /\.less$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: mode === 'development',
            modules: { localIdentName: '[local]__[hash:base64:5]' },
          },
        },
        'less-loader',
      ],
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer,
};

module.exports = config;
