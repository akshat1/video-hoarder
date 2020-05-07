/** @jest-environment jsdom */
import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App.jsx';
import { ThemeProvider } from '@material-ui/styles';
import { Theme } from './theme';

describe('App', () => {
  test('App matches snapshot', () => {
    const instance = shallow(<ThemeProvider theme={Theme}><App /></ThemeProvider>);
    expect(instance).toMatchSnapshot();
  });
});
