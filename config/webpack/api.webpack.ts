import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';

// use runtime dependencies
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => nodeModules[mod] = 'commonjs ' + mod);

const outputDir = 'build';
const plugins = [];

const config: webpack.Configuration = {
  bail: true,
  mode: 'production',
  target: 'node',
  externals: nodeModules,

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname), 'node_modules', 'api'],
  },

  entry: './api/index.ts',

  output: {
    path: path.resolve(process.cwd(), outputDir),
    publicPath: path.resolve(process.cwd(), outputDir),
    filename: 'api.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'awesome-typescript-loader',
    }],
  },

  plugins,
};

export default config;
