/**
 * @module client/redux
 */
import { getHistory } from "../history";
import { getRootReducer,setUser } from "./actions-and-reducers";
import { routerMiddleware } from "connected-react-router"
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
export { setUser };

let store;
export const getStore = () => {
  if (!store) {
    const history = getHistory();
    const middlewares = [
      thunk,
      routerMiddleware(history)
    ];
    /* istanbul ignore next. We'll figure out the devtools branch when we mock the window. */
    const composeArgs = [
      applyMiddleware(...middlewares),
      typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f  // TODO: Fake window for testing.
    ];

    store = compose(...composeArgs)(createStore)(getRootReducer(history));
  }

  return store;
};
