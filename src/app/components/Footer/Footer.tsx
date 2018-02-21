import * as React from 'react';

const styles = require('./Footer.scss');
const version = process.env.VERSION;

/**
 * @class
 * @extends {React.Component}
 */
export class Footer extends React.Component<{}, {}> {
  /**
   * @inheritdoc
   */
  public constructor(props) {
    super(props);
  }

  /**
   * @inheritdoc
   */
  public render() {
    return (
      <div className={styles.Footer}>
        <div>Built by <strong>Homespace.io, Inc</strong> | v{version}</div>
      </div>
    );
  }
}
