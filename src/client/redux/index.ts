/**
 * @module client/redux
 */
import { getHistory } from "../history";
import { getRootReducer } from "./reducers";
import { routerMiddleware } from "connected-react-router"
import { applyMiddleware, compose, createStore } from "redux";
import { Store } from "redux";
import thunk from "redux-thunk";

let store: Store;
export const getStore = (): Store => {
  if (!store) {
    const history = getHistory();
    const middlewares = [
      thunk,
      routerMiddleware(history),
    ];
    /* istanbul ignore next. We'll figure out the devtools branch when we mock the window. */
    const composeArgs = [
      applyMiddleware(...middlewares),
      // @ts-ignore
      typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,  // TODO: Fake window for testing.
    ];

    // @ts-ignore
    store = compose(...composeArgs)(createStore)(getRootReducer(history));
  }

  return store;
};

// @ts-ignore
if (typeof window!== "undefined")
  // @ts-ignore
  window.getStore = getStore;
