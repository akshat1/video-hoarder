import path from 'path';
import webpack from 'webpack';

let mode = 'production';
let entry = {
  app: ['./client/index.js']
};

let devtool;
let devServer;
let plugins = [];

if (process.env.NODE_ENV === 'development') {
  mode = 'development';
  entry = {
    app: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      './client/index'
    ]
  };
  devtool = 'source-map';
  devServer = {
    hot: true,
    historyApiFallback: '/index.html'
  };
  plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ];
}

export default {
  mode,
  entry,
  output: {
    filename: 'index.js',
    path: path.resolve(process.cwd(), 'build')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs']
  },
  devtool,
  devServer,
  node: {
    fs: 'empty'  // For winston.
  },
  plugins
};
