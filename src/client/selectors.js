/** @module client/selectors */
import _ from "lodash";

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {User}
 */
export const getUser = state => state.user;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isLoggedIn = state => !!getUser(state).loggedIn;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isFetchingUser = state => !!state.fetchingUser;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isUserFetchDone = state => !!state.userFetchDone;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getCurrentPath = state => _.get(state, "router.location.pathname");

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {string|undefined}
 */
export const getLoginError = state => state.loginError;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getUserName = state => (getUser(state) || {}).userName;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getJobs = state => state.jobs || [];
