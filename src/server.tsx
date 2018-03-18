import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryHistory, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';

import * as express from 'express';
import * as proxy from 'http-proxy-middleware';
import * as path from 'path';
import * as compression from 'compression';
import * as favicon from 'serve-favicon';

import { configureStore } from './app/redux/store';
import routes from './app/routes';
import { Html } from './app/containers';
import Logger from '../api/utils/Logger';

const manifest = require('../build/manifest.json');
const { ENV, HOST, PORT, API_HOST, API_PORT } = process.env;
const serviceAddress = `http://${API_HOST}:${API_PORT}`;

const logger = new Logger();
const app = express();

// enable gzip compression
app.use(compression());

if (ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../config/webpack/app.webpack').default;
  const webpackCompiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    quiet: true,
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

// proxy api requests to /api on service layer
app.use('/api', proxy({
  target: serviceAddress,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
}));

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  const location = req.url;
  const memoryHistory = createMemoryHistory();
  const store = configureStore(memoryHistory);
  const history = syncHistoryWithStore(memoryHistory, store);

  match({ history, routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const asyncRenderData = {
        ...renderProps,
        store,
      };

      loadOnServer(asyncRenderData).then(() => {
        const markup = ReactDOMServer.renderToString(
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>,
        );
        res.status(200).send(renderHTML(markup, store));
      });
    } else {
      res.status(404).send('Not Found?');
    }
  });
});

app.listen(PORT, (err) => {
  if (err) {
    logger.error('Failed to start the web server.', err);
  } else {
    logger.info(
      `Running ${ENV} Web server, listening at http://${HOST}:${PORT}\n`,
    );
  }
});

function renderHTML(markup: string, store: any) {
  const html = ReactDOMServer.renderToString(
    <Html markup={markup} manifest={manifest} store={store} />,
  );

  return `<!doctype html> ${html}`;
}
