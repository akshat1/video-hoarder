import { makeActionF, makeReducer } from './boilerplate';
import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux';

const User = 'User';
const FetchingUser = 'FetchingUser';
const setFetchingUser = makeActionF(FetchingUser);
const UserFetchDone = 'UserFetchDone';
const setUserFetchDone = makeActionF(UserFetchDone);

/**
 * @function
 * @memberof module:client/redux
 * @param {User} user
 * @returns {Action}
 */
export const setUser = makeActionF(User);

/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {*} value
 */

const FetchOpts = {
  method: 'post',
  mode: 'same-origin',
  cache: 'no-cache',
  credentials: 'same-origin',
};
export const doLogIn = (username, password) =>
  async (dispatch) => {
    try {
      const form = new URLSearchParams()
      form.append('username', username);
      form.append('password', password);
      console.log(form)
      const response = await fetch(
        '/login',
        {
          ...FetchOpts,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form,
        },
      );

      if (!response.ok) {
        throw new Error('Error occurred');
      }

      const user = await response.json();
      dispatch(setUser(user));
      location.href = '/';
     } catch(err) {
       console.error(err);
     }
  }

export const fetchUser = () =>
  async (dispatch) => {
    try {
      dispatch(setFetchingUser(true));
      const response = await fetch('/getProfile', {...FetchOpts });
      if (!response.ok) {
        throw new Error('Error occurred');
      }
      const user = await response.json();
      dispatch(setUser(user));
    } catch (err) {
      console.error(err);
      dispatch(setUser({}));
    }
    dispatch(setFetchingUser(false));
    dispatch(setUserFetchDone(true));
  }

/**
 * The redux store.
 * @typedef State
 * @memberof module:client/redux
 * @property {User} user - currently logged in user; or `{}` when not logged in.
 */

/**
 * @function
 * @memberof module:client/redux
 * @param {History} -
 * @returns {Function} - The new store state
 */
export const getRootReducer = history => {
  /**
   * @function
   * @param {State} - The current store state
   * @param {Action}
   * @returns {State} - The new store state
   */
  const rootReducer = combineReducers({
    router: connectRouter(history),
    fetchingUser: makeReducer(FetchingUser, false),
    user: makeReducer(User, {}),
    userFetchDone: makeReducer(UserFetchDone, false),
  });

  return rootReducer;
};
