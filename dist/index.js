import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
document.addEventListener('DOMContentLoaded', () => {
  var root = document.getElementById('AppRoot');

  if (!root) {
    throw new Error('Missing AppRoot element.');
  }

  ReactDOM.render(React.createElement(App), root);
});