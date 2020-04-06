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
  const plugins = [];
  if (isDevMode()) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(new MiniCSSExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }));
  }
  plugins.push(new HtmlWebPackPlugin({
    template: "./src/client/template.html",
    filename: "./index.html"
  }));

  return plugins;
}

const getEntry = () => {
  const app = ['./src/client/index.js'];
  if (isDevMode()) {
    app.push('webpack-hot-middleware/client');
  }

  return { app };
}

const getJSRule = () => ({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: { loader: "babel-loader" }
});

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

const getFontsRule = () => ({
  test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
  use: [{
    loader: 'file-loader',
    options: { name: 'static/[name].[ext]' },
  }],
});

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
    rules: [
      getJSRule(),
      getLessRule(),
      getFontsRule(),
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: getDevServer(),
};

module.exports = config;
