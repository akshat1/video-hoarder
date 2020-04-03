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
    /* istanbul ignore next. We'll figure out the devtools branch when we mock the window. */
    const composeArgs = [
      applyMiddleware(thunk),
      typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f  // TODO: Fake window for testing.
    ];

    store = compose(...composeArgs)(createStore)(rootReducer);
  }

  return store;
};
