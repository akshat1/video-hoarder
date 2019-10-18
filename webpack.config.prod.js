const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    app: ['./client/index.js']
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
  node: {
    fs: 'empty'  // For winston.
  }
};
