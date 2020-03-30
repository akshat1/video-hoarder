/**
 * @module client/redux
 */
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { setUser, rootReducer } from './actions-and-reducers';
export { setUser };
var store;
export var getStore = () => {
  if (!store) {
    var composeArgs = [applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f];
    store = compose(...composeArgs)(createStore)(rootReducer);
  }

  return store;
};