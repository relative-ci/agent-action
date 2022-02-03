const path = require('path');

const CONTEXT = path.join(__dirname, 'src');

module.exports = {
  context: CONTEXT,
  entry: {
    index: './index.ts',
  },
  output: {
    path: path.join(__dirname, 'dist'),
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    mainFields: ['main'],
    fallback: {
      // and-zip electron check
      'original-fs': false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: 'babel-loader',
        include: [CONTEXT],
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'ts-loader',
        include: [CONTEXT],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};
