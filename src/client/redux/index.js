/**
 * @module client/redux
 */
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router'
import { setUser, getRootReducer } from './actions-and-reducers';

export { setUser };

let store;
export const getStore = () => {
  if (!store) {
    const history = createBrowserHistory();
    const middlewares = [
      thunk,
      routerMiddleware(history)
    ];
    /* istanbul ignore next. We'll figure out the devtools branch when we mock the window. */
    const composeArgs = [
      applyMiddleware(...middlewares),
      typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f  // TODO: Fake window for testing.
    ];

    store = compose(...composeArgs)(createStore)(getRootReducer(history));
  }

  return store;
};
