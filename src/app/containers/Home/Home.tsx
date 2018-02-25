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
        <ModelView modelPath="assets/obj/r2-d2.obj" materialPath="assets/obj/r2-d2.mtl" />
      </div>
    );
  }
}
