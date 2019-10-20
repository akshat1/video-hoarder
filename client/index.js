import './index.less';
import { Provider } from 'react-redux';
import App from './components/app';
import getClient from './io-client';
import getStore from './redux/store';
import React from 'react';
import ReactDOM from 'react-dom';
import wireSocketToStore from './net';

document.addEventListener('DOMContentLoaded', () => {
  const store = getStore();
  wireSocketToStore({
    socket: getClient(),
    store
  });
  const root = document.getElementById('appRoot');
  if (root)
    ReactDOM.render(<Provider store={store}><App /></Provider>, root);
});
