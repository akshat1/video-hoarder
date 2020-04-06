import React from 'react';
// const React = require('react');
import '@storybook/addon-console';
import { addDecorator } from '@storybook/react';
import { Provider } from 'react-redux';
import { withA11y } from "@storybook/addon-a11y";
import { getStore } from '../src/client/redux';
import '../src/client/App.less';

const withProvider = story =>
  <Provider store={getStore()}>{story()}</Provider>;

addDecorator(withProvider);
addDecorator(withA11y);
