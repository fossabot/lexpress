const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    loaders: [
      { test: /.*\.ts$/, loader: 'awesome-typescript-loader', exclude: /node_modules/ },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
  ],
}
