import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router, browserHistory } = require('react-router');
import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect } = require('redux-connect');
import { AppContainer } from 'react-hot-loader';

import { configureStore } from './app/redux/store';
import routes from './app/routes';

const store = configureStore(
  browserHistory,
  window.__INITIAL_STATE__,
);
const history = syncHistoryWithStore(browserHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

const render = (routes) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider store={store} key="provider">
        <Router
          key={Math.random()}
          history={history}
          render={connectedCmp}
        >
          {routes}
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(routes);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./app/routes', () => render(require('./app/routes').default));
}
