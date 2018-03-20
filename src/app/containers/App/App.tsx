const appConfig = require('../../../../config/main');

import * as React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { Paper } from 'material-ui';
import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import { grey900 } from 'material-ui/styles/colors';

import 'whatwg-fetch';

import { Footer } from 'components';

import { cube } from './test';

import routeActions from 'redux/actions/routeAction';

// theme for mui
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#266d90',
    textColor: grey900,
  },
  textField: {
    focusColor: '#266d90',
  },
  userAgent: 'all',
  fontFamily: `"Source Sans Pro", sans-serif`,
});

const styles = require('./App.scss');

interface IProps {
  // route actions
  changeRoute(route: string);
}

cube(3);

/**
 * @class
 * @extends {React.Component}
 */
class App extends React.Component<IProps, {}> {
  /**
   * @inheritdoc
   */
  constructor(props: IProps) {
    super(props);
  }

  /**
   * @inheritdoc
   */
  public render() {
    const {
      children,
    } = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={styles.App}>
          <Helmet {...appConfig.app} {...appConfig.app.head} />
          <Paper className={styles.header}>
            <div className={styles.logo} />
            <div className={styles.title}>Homespace render service</div>
          </Paper>
          <div className={styles.content}>
            <div className={styles.children}>
              {
                React.Children.toArray(children)
              }
            </div>
          </div>
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }

  /**
   * @private
   * Handler for when MenuItem is clicked.
   * Navigates to specific route.
   *
   * @param {String} route the specific route to navigate to.
   */
  // private onMenuItemClick = (route: string) => {
  //   const { changeRoute } = this.props;

  //   changeRoute(route);
  // }
}

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  {
    changeRoute: routeActions.changeRoute,
  },
)(App);
