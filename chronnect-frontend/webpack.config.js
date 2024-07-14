const path = require('path');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public/build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: { "crypto": require.resolve("crypto-browserify"),
	        "stream": require.resolve("stream-browserify"),
		"vm": require.resolve("vm-browserify"),
		"process": require.resolve("process/browser"),
		"buffer": require.resolve("buffer/"), }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
};
