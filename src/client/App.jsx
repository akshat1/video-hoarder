import { hot } from 'react-hot-loader';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import InputForm from './components/InputForm';
import * as Style from './App.less';
import { handleRoute } from './redux/actions-and-reducers';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => dispatch(handleRoute()));
  return <div id={Style.App}>
      <InputForm onSubmit={() => 0}/>
    </div>;
};

/**
 * @private
 * @returns {boolean}
 */
const isDevMode = () => process.env.NODE_ENV === 'development';

export default isDevMode() ? hot(module)(App) : App;
