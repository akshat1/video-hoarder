import React from 'react';
import { shallow } from 'enzyme';
import { ThemeProvider } from '@material-ui/styles';
import { Theme } from '../theme';
import { CancelButton } from './CancelButton.jsx';
import { Status } from '../../Status';
import { getFakeItem } from '../fixtures/item';

describe('components/CancelButton', () => {
  Object.values(Status).forEach((status) =>
    test(`CancelButton matches snapshot for ${status}`, () => {
      const instance =
        <ThemeProvider theme={Theme}>
          <CancelButton item={getFakeItem(status)} doCancel={() => 0}/>
        </ThemeProvider>;
      expect(shallow(instance)).toMatchSnapshot();
    })
  );
});
