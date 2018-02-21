const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const stylelint = require('stylelint');

const serverConfig = require('../main');

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
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: ['node_modules', 'src', 'src/app'],
  },

  entry: './src/server.tsx',

  output: {
    path: path.resolve('./build/public'),
    filename: '../server.js',
    publicPath: '/public',
    libraryTarget: 'commonjs2'
  },

  module: {
    loaders: [{
      test: /\.(jpe?g|png|gif)$/i,
      loader: 'url-loader?limit=1000&name=images/[hash].[ext]'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.jsx$/,
      loader: 'babel-loader'
    },
    {
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    },
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader"
    },
    {
      test: /\.css$/,
      loaders: [
        'isomorphic-style-loader',
        'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]'
      ]
    },
    {
      test: /\.scss$/,
      loaders: [
        'isomorphic-style-loader',
        'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
        'postcss-loader'
      ]
    }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: false,
      options: {}
    }),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(require('../../package.json').version),
        ENV: JSON.stringify(serverConfig.env),
        HOST: JSON.stringify(serverConfig.host),
        PORT: JSON.stringify(serverConfig.port),
        API_HOST: JSON.stringify(serverConfig.apiHost),
        API_PORT: JSON.stringify(serverConfig.apiPort),
      }
    }),
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
};

const copySync = (src, dest, overwrite) => {
  if (overwrite && fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
}

const createIfDoesntExist = dest => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
}

createIfDoesntExist('./build');
createIfDoesntExist('./build/public');
copySync('./src/favicon.ico', './build/public/favicon.ico', true);

module.exports = config;
