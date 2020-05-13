import React from 'react';
import { shallow } from 'enzyme';
import { ThemeProvider } from '@material-ui/styles';
import { getTheme } from '../theme';
import ItemStatus from './ItemStatus.jsx';
import { Status } from '../../Status';

describe('components/ItemStatus', () => {
  Object.values(Status).forEach((status) =>
    test(`ItemStatus matches snapshot for ${status}`, () => {
      const instance = <ThemeProvider theme={getTheme()}><ItemStatus status={status} /></ThemeProvider>;
      expect(shallow(instance)).toMatchSnapshot();
    })
  );
});
