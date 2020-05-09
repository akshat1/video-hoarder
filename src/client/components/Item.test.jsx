import React from 'react';
import { shallow } from 'enzyme';
import { ThemeProvider } from '@material-ui/styles';
import { Theme } from '../theme';
import Item from './Item.jsx';
import { Status } from '../../Status';
import { getFakeItem } from '../fixtures/item';

describe('components/Item', () => {
  Object.values(Status).forEach((status) =>
    test(`Item matches snapshot for ${status}`, () => {
      const instance = <ThemeProvider theme={Theme}><Item item={getFakeItem(status)} />)</ThemeProvider>
      expect(shallow(instance)).toMatchSnapshot();
    })
  );
});
