const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const config = {
  externals: nodeModules,
  target: 'node',

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname), 'node_modules', 'api'],
  },

  entry: './api/index.ts',

  output: {
    path: path.resolve('./build'),
    filename: 'api.js',
    libraryTarget: 'commonjs2'
  },

  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/
    }]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: false,
      options: {}
    })
  ]
};

const createIfDoesntExist = dest => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
}

createIfDoesntExist('./build');

module.exports = config;
