import { makeActionF, makeReducer } from './boilerplate';
import { combineReducers } from 'redux';
var User = 'User';
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

export var setUser = makeActionF(User);
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

export var rootReducer = combineReducers({
  user: makeReducer(User, {})
});