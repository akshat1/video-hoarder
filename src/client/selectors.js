/** @module client/selectors */
import _ from 'lodash';

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

export const isFetchingUser = state => !!state.fetchingUser;

export const isUserFetchDone = state => !!state.userFetchDone;

export const getCurrentPath = state => _.get(state, 'router.location.pathname');
