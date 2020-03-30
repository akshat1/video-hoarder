/**
 * @module client/redux
 */
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { setUser, rootReducer } from './actions-and-reducers';

export { setUser };

let store;
export const getStore = () => {
  if (!store) {
    const composeArgs = [
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    ];

    store = compose(...composeArgs)(createStore)(rootReducer);
  }

  return store;
};
