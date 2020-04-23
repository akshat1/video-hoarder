import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { getStore } from './redux';
import App from './App.jsx';
import { appRoot } from './App.less';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('AppRoot');
  if (!root) {
    throw new Error('Missing AppRoot element.');
  }

  root.setAttribute('class', appRoot);
  ReactDOM.render(
    <Provider store={getStore()}>
      <App />
    </Provider>,
    root
  );
});
