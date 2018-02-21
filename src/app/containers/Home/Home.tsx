import * as React from 'react';

const styles = require('./Home.scss');

/**
 * @class
 * @extends {React.Component}
 */
export class Home extends React.Component<{}, {}> {
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
      <div className={styles.Home}>
        <div>Home</div>
      </div>
    );
  }
}
