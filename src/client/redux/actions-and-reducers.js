/**
 * Actions and reducers. Together at last (we'll split them if required down the road).
 * @module client/redux/actions-and-reducers
 */
import { makeActionF, makeReducer } from './boilerplate';
import { connectRouter, push } from 'connected-react-router'
import { combineReducers } from 'redux';
import { getLogger } from '../../logger';
import { getCurrentPath, isFetchingUser, isUserFetchDone, isLoggedIn } from '../selectors';
import { reconnect, disconnect } from '../socketio';

const rootLogger = getLogger('actions-and-reducers');

const User = 'User';
const FetchingUser = 'FetchingUser';
const setFetchingUser = makeActionF(FetchingUser);
const UserFetchDone = 'UserFetchDone';
const setUserFetchDone = makeActionF(UserFetchDone);
const LoginError = 'LoginError';
const setLoginError = makeActionF(LoginError);
const FetchingJobs = 'FetchingJobs';
const setFetchingJobs = makeActionF(FetchingJobs);
const Jobs = 'Jobs';
const setJobs = makeActionF(Jobs);
const AddingJob = 'AddingJob';
const setAddingJob = makeActionF(AddingJob);


/**
 * @function
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

/**
 * @func
 * @returns {ActionCreator}
 */
export const fetchJobs = () =>
  async (dispatch) => {
    const logger = getLogger('fetchJobs', rootLogger);
    try {
      logger.debug('fetchJobs');
      dispatch(setFetchingJobs(true));
      const response = await fetch(
        '/api/jobs',
        {
          ...FetchOpts,
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        },
      );
      const { data: jobs } = response.json();
      dispatch(setJobs(jobs));
      dispatch(setFetchingJobs(false));
    } catch (err) {
      dispatch(setFetchingJobs(false));
      logger.error(err);
    }
  };

export const addJob = (url) =>
  async (dispatch) => {
    const logger = getLogger('addJob', rootLogger);
    try {
      logger.debug('adding job', url);
      dispatch(setAddingJob(true));
      const response = await fetch(
        '/api/job/add',
        {
          ...FetchOpts,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        },
      );
      logger.debug('done adding job.', response);
      dispatch(setAddingJob(false));
    } catch (err) {
      dispatch(setAddingJob(false));
      logger.error(err);
    }
  };

/**
 * Action used by the login form.
 *
 * @func
 * @param {string} username 
 * @param {string} password 
 * @returns {ActionCreator} -
 */
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
        if (response.status === 401) {
          dispatch(setLoginError('Incorrect username or password.'));
        } else {
          dispatch(setLoginError('Login error.'));
        }

        return;
      }

      const user = await response.json();
      dispatch(setLoginError(null));
      dispatch(setUser(user));
      // location.href = '/';
      dispatch(push('/'));
      reconnect();
     } catch(err) {
       logger.error(err);
     }
  };

/**
 * Fetch the currently logged-in user (or clear state.user if the user session is expired).
 *
 * @func
 * @returns {ActionCreator}
 */
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
  };

/**
 * Perform a logout.
 *
 * @func
 * @returns {ActionCreator}
 */
export const doLogOut = () =>
  async dispatch => {
    await fetch('/logout', FetchOpts);
    disconnect();
    dispatch(setUser({}));
    dispatch(push('/login'));
  };

/**
 * Called on every page view. Fetches the current user or clears state.user based on wether the user is logged-in and the session is valid or not.
 *
 * @func
 * @returns {ActionCreator}
 */
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
        dispatch(push('/'));
      } else if(!loggedIn && !onLoginScreen) {
        logger.debug('User is not logged-in and not on the login page. Redirect to /login.');
        dispatch(push('/login'));
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
 * Cancel the current download.
 * @todo Implement me.
 *
 * @func
 * @returns {ActionCreator}
 */
export const doCancelDownload = () =>
  () => 0;

/**
 * The redux store.
 * @typedef State
 * @property {boolean} fetchingUser - are we currently fetching a user?
 * @property {boolean} userFetchDone - true if we have made an attempt to fetch the user profile.
 * @property {Object} router - from connected-react-router.
 * @property {string|null} loginError - error from the most recent login attempt, or null if the attempt was successful.
 * @property {User} user - currently logged in user; or `{}` when not logged in.
 */

 /**
 * @function
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
    fetchingUser: makeReducer(FetchingUser, false),
    loginError: makeReducer(LoginError, null),
    router: connectRouter(history),
    user: makeReducer(User, {}),
    userFetchDone: makeReducer(UserFetchDone, false),
  });

  return rootReducer;
};
