import { makeActionF, makeReducer } from './boilerplate';
import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux';
import { getLogger } from '../../logger';
import { getCurrentPath, isFetchingUser, isUserFetchDone, isLoggedIn } from '../selectors';
import { getHistory } from '../history';

const rootLogger = getLogger('actions-and-reducers');

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
    const logger = getLogger('doLogin', rootLogger);
    try {
      const form = new URLSearchParams()
      form.append('username', username);
      form.append('password', password);
      logger.debug(form)
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
       logger.error(err);
     }
  }

export const fetchUser = () =>
  async (dispatch) => {
    const logger = getLogger('fetchUser');
    try {
      dispatch(setFetchingUser(true));
      const response = await fetch('/getProfile', {...FetchOpts });
      if (!response.ok) {
        throw new Error('Error occurred');
      }
      const user = await response.json();
      dispatch(setUser(user));
    } catch (err) {
      logger.error(err);
      dispatch(setUser({}));
    }
    dispatch(setFetchingUser(false));
    dispatch(setUserFetchDone(true));
  }

export const doLogOut = () =>
  async dispatch => {
    await fetch('/logout', FetchOpts);
    dispatch(setUser({}));
  }

export const initializeClient = () =>
  async (dispatch, getState) => {
    const logger = getLogger('initializeClient', rootLogger);
    logger.debug('begin');
    const state = getState();
    if (isFetchingUser(state)) {
      logger.debug('Still fetching user. Bail.');
      return;
    }

    if (isUserFetchDone(state)) {
      const loggedIn = isLoggedIn(getState());
      const onLoginScreen = getCurrentPath(getState()) === '/login';
      logger.debug('We have already fetched a user.', { loggedIn, onLoginScreen });
      if (loggedIn && onLoginScreen) {
        logger.debug('User is logged-in and on /login. Redirect to /.');
        getHistory().push('/');
      } else if(!loggedIn && !onLoginScreen) {
        logger.debug('User is not logged-in and not on the login page. Redirect to /login.');
        getHistory().push('/login');
      }
    } else {
      logger.debug("We have't fetched a user yet. Fetch it now.");
      try {
        await dispatch(fetchUser());
      } catch (err) {
        logger.error('Error in fetchUser; eating it.');
      }
      logger.debug('fetchUser() done.');
      // State has now been updated
    }
  };

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
