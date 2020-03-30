import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { appRoot } from './App.less';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('AppRoot');
  if (!root) {
    throw new Error('Missing AppRoot element.');
  }

  root.setAttribute('class', appRoot);
  ReactDOM.render(React.createElement(App), root);
});
