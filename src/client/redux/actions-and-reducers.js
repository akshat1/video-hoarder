import { makeActionF, makeReducer } from './boilerplate';
import { combineReducers } from 'redux';

const User = 'User';

/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {*} value
 */

/**
 * @function
 * @memberof module:client/redux
 * @param {User} user
 * @returns {Action}
 */
export const setUser = makeActionF(User);

/**
 * The redux store.
 * @typedef State
 * @property {User} user - currently logged in user; or `{}` when not logged in.
 */

/**
 * @function
 * @memberof module:client/redux
 * @param {State} - The current store state
 * @param {Action}
 * @returns {State} - The new store state
 */
export const rootReducer = combineReducers({
  user: makeReducer(User, {}),
});
