const React = require('react');
require('@storybook/addon-console');
const { addDecorator } = require('@storybook/react');
const { Provider } = require('react-redux');
import { withA11y } from "@storybook/addon-a11y";
const { getStore } = require('../src/client/redux');
require('../src/client/App.less');

const withProvider = story =>
  <Provider store={getStore()}>{story()}</Provider>;

addDecorator(withProvider);
addDecorator(withA11y);
