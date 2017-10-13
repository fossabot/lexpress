const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src') + '/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    loaders: [
      { test: /.*\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
    ],
  },
}
