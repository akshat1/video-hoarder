import React from 'react';
// const React = require('react');
import '@storybook/addon-console';
import { addDecorator } from '@storybook/react';
import { Provider } from 'react-redux';
import { withA11y } from "@storybook/addon-a11y";
import { Paper } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { Theme } from '../src/client/theme';
import { getStore } from '../src/client/redux';

const withProvider = story =>
  <Provider store={getStore()}>
    <ThemeProvider theme={Theme}>
      {story()}
    </ThemeProvider>
  </Provider>;

addDecorator(withProvider);
addDecorator(withA11y);
