import { IStore } from 'redux/models';
import * as React from 'react';
import Helmet from 'react-helmet';

const htmlStyles = require('./Html.scss');

interface IHtmlProps {
  manifest?: any;
  markup?: string;
  store?: Redux.Store<IStore>;
}

class Html extends React.Component<IHtmlProps, {}> {
  private resolve(files) {
    return files.map((src) => {
      if (!this.props.manifest[src]) { return; }
      return '/public/' + this.props.manifest[src];
    }).filter((file) => file !== undefined);
  }

  public render() {
    const head = Helmet.rewind();
    const { markup, store } = this.props;

    const styles = this.resolve(['vendor.css', 'app.css']);
    const renderStyles = styles.map((src, i) =>
      <link key={i} rel="stylesheet" type="text/css" href={src} />,
    );

    const scripts = this.resolve(['vendor.js', 'app.js']);
    const renderScripts = scripts.map((src, i) =>
      <script src={src} key={i} />,
    );

    // tslint:disable-next-line:max-line-length
    const initialState = (<script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${JSON.stringify(store.getState())};` }} charSet="UTF-8" />);

    return (
      <html className={htmlStyles.html}>
        <head>
          <script src="https://use.fontawesome.com/releases/v5.0.6/js/all.js" />
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          {renderStyles}
          <link rel="shortcut icon" href="/favicon.ico" />
        </head>
        <body className={htmlStyles.body}>
          <main
            id="app"
            className={htmlStyles.content}
            dangerouslySetInnerHTML={{ __html: markup }}
          />
          {initialState}
          {renderScripts}
        </body>
      </html>
    );
  }
}

export { Html };
