import { expect } from 'chai';
import { renderComponent } from 'helpers/TestHelper';
import App from './App';

describe('<App />', () => {

  const component = renderComponent(App);

  it('Renders with correct style', () => {
    const styles = require('./App.scss');
    expect(component.find(styles.app)).to.exist;
  });

});
