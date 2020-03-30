import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from './redux';
import InputForm from './components/InputForm';
export default (() => /*#__PURE__*/React.createElement(Provider, {
  store: getStore()
}, /*#__PURE__*/React.createElement("div", {
  id: "App"
}, /*#__PURE__*/React.createElement(InputForm, null))));