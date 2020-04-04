const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');

const isDevMode = () => process.env.NODE_ENV === 'development';

const getDevServer = () => {
  if (isDevMode()) {
    return {
      hot: true,
      inline: true,
      https: true,
      port: 7200,
      host: '0.0.0.0',  // because remote development is neat.
      publicPath: '/',
      contentBase: './dist/'
    };
  }

  return undefined;
}

const getPlugins = () => {
  const plugins = [
    new HtmlWebPackPlugin({
      template: "./src/client/template.html",
      filename: "./index.html"
    })
  ];

  if (isDevMode()) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(new MiniCSSExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }));
  }

  return plugins;
}

const getEntry = () => {
  const app = ['./src/client/index.js'];
  if (isDevMode()) {
    app.push('webpack-hot-middleware/client');
  }

  return { app };
}

const getLessRule = () => {
  const loaders = [];
  if (isDevMode()) {
    loaders.push('style-loader');
  } else {
    loaders.push(MiniCSSExtractPlugin.loader);
  }

  loaders.push({
    loader: 'css-loader',
    options: {
      sourceMap: isDevMode(),
      modules: { localIdentName: '[local]__[hash:base64:5]' },
    },
  },
  'less-loader');

  return {
    test: /\.less$/,
    exclude: /node_modules/,
    use: loaders,
  };
}

const config = {
  mode: isDevMode() ? 'development' : 'production',
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devtool: isDevMode() ? 'inline-source-map' : false,
  plugins: getPlugins(),
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: { loader: "babel-loader" }
    }, getLessRule()]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: getDevServer(),
};

module.exports = config;
