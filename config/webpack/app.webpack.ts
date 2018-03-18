import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
import * as ManifestPlugin from 'webpack-manifest-plugin';

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  new webpack.LoaderOptionsPlugin({
    debug: true,
    options: {
      tslint: {
        failOnHint: true,
      },
    },
  }),
  new ManifestPlugin({
    fileName: '../manifest.json',
  }),
  new webpack.DefinePlugin({
    'process.env': {
      VERSION: JSON.stringify(require('../../package.json').version),
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify('development'),
    },
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];

const config: webpack.Configuration = {
  bail: true,
  mode: isProduction ? 'production' : 'development',

  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: ['node_modules', 'src', 'src/app'],
  },

  entry: {
    app: [
      'whatwg-fetch',
      'webpack-hot-middleware/client',
      './src/client.tsx',
      './src/vendor/main.ts',
    ],
  },

  output: {
    path: path.resolve('./build/public'),
    filename: 'js/[name].js',
    pathinfo: true,
  },

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.tsx?$/,
      loader: 'tslint-loader',
    }, {
      test: /\.tsx?$/,
      loader: 'ts-loader',
    }, {
      test: /\.jsx$/,
      loader: 'babel-loader',
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      include: path.resolve('./src/app'),
      loaders: [
        'style-loader',
        'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
        'postcss-loader',
      ],
    }, {
      test: /\.css$/,
      exclude: path.resolve('./src/app'),
      loaders: [
        'style-loader',
        'css-loader',
      ],
    }, {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[local]___[hash:base64:5]',
        },
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'sass-loader',
      }],
    }, {
      test: /\.eot(\?.*)?$/,
      loader: 'file-loader?name=fonts/[hash].[ext]',
    }, {
      test: /\.(woff|woff2)(\?.*)?$/,
      loader: 'file-loader?name=fonts/[hash].[ext]',
    }, {
      test: /\.(obj|mtl)$/i,
      loader: 'file-loader?name=obj/[hash].[ext]',
    }, {
      test: /\.ttf(\?.*)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]',
    }, {
      test: /\.svg(\?.*)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]',
    }, {
      test: /\.(jpe?g|png|gif)$/i,
      loader: 'url-loader?limit=1000&name=images/[hash].[ext]',
    }],
  },

  plugins,

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
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
