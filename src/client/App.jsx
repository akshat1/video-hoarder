import { hot } from 'react-hot-loader';
import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from './redux';
import InputForm from './components/InputForm';
import * as Style from './App.less';

const App = () =>
  <Provider store={getStore()}>
    <div id={Style.App}>
      <InputForm onSubmit={() => 0}/>
    </div>
  </Provider>;

/**
 * @private
 * @returns {boolean}
 */
const isDevMode = () => process.env.NODE_ENV === 'development';

export default isDevMode() ? hot(module)(App) : App;
