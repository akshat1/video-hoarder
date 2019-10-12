import path from 'path';
import webpack from 'webpack';

export default {
  mode: 'development',
  entry: {
    app: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      './client/index.js'
    ]
  },
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
  devtool: 'source-map',
  devServer: {
    hot: true,
    historyApiFallback: '/index.html'
  },
  node: {
    fs: 'empty'  // For winston.
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
