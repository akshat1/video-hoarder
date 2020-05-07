import React from 'react';
import { shallow } from 'enzyme';
import { ThemeProvider } from '@material-ui/styles';
import { Theme } from '../theme';
import { Toolbar } from './Toolbar.jsx';

describe('components/Toolbar', () => {
  test('component should render', () => {
    const instance = shallow(<ThemeProvider theme={Theme}><Toolbar /></ThemeProvider>);
    expect(instance).toMatchSnapshot();
  });
});