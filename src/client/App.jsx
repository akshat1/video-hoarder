import { hot } from 'react-hot-loader';
import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from './redux';
import InputForm from './components/InputForm';
import { isDevMode } from './selectors';

const App = () =>
  <Provider store={getStore()}>
    <div id="App">
      <InputForm />
    </div>
  </Provider>;

export default isDevMode() ? hot(module)(App) : App;
