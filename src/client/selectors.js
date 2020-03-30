/** @module client/selectors */

export const isDevMode = () => process.env.NODE_ENV === 'development';

/**
 * @function
 * @param {State} state
 * @returns {User}
 */
export const getUser = state => state.user;

/**
 * @function
 * @param {State} state
 * @returns {boolean}
 */
export const isLoggedIn = state => getUser(state).loggedIn;
