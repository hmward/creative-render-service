import * as React from 'react';

import { ModelView } from 'components';

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
        <ModelView width={800} height={600} />
      </div>
    );
  }
}
