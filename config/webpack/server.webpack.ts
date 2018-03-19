import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';

import * as serverConfig from '../main';

// use runtime dependencies
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => nodeModules[mod] = 'commonjs ' + mod);

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      VERSION: JSON.stringify(require('../../package.json').version),
      NODE_ENV: JSON.stringify(serverConfig.env),
      HOST: JSON.stringify(serverConfig.host),
      PORT: JSON.stringify(serverConfig.port),
      API_HOST: JSON.stringify(serverConfig.apiHost),
      API_PORT: JSON.stringify(serverConfig.apiPort),
    },
  }),
];

const config: webpack.Configuration = {
  bail: true,
  mode: 'development',
  target: 'node',
  externals: nodeModules,

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: ['node_modules', 'src', 'src/app'],
  },

  entry: './src/server.tsx',

  output: {
    path: path.resolve('./build/public'),
    filename: '../server.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [{
      test: /\.(jpe?g|png|gif)$/i,
      loader: 'url-loader?limit=1000&name=images/[hash].[ext]',
    }, {
      test: /\.jsx$/,
      loader: 'babel-loader',
    }, {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
    }, {
      test: /\.(obj|mtl)$/i,
      loader: 'file-loader?name=obj/[hash].[ext]',
    }, {
      test: /\.css$/,
      loaders: [
        'isomorphic-style-loader',
        'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
      ],
    }, {
      test: /\.scss$/,
      loaders: [
        'isomorphic-style-loader',
        'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
        'postcss-loader',
      ],
    }],
  },

  plugins,

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

const copySync = (src, dest, overwrite) => {
  if (overwrite && fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
};

const createIfDoesntExist = (dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
};

createIfDoesntExist('./build');
createIfDoesntExist('./build/public');
copySync('./src/favicon.ico', './build/public/favicon.ico', true);

export default config;
