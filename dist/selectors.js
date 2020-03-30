/** @module client/selectors */

/**
 * @function
 * @param {State} state
 * @returns {User}
 */
export var getUser = state => state.user;
/**
 * @function
 * @param {State} state
 * @returns {boolean}
 */

export var isLoggedIn = state => getUser(state).loggedIn;