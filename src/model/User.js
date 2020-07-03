import _ from "lodash";

/** @enum {string} */
export const Role = {
  Admin: "admin",
  User: "user",
};

/**
 * @description This type is not supposed to be on the client side.
 * @typedef {Object} User
 * @property {boolean} passwordExpired
 * @property {string} createdBy
 * @property {string} password
 * @property {string} salt
 * @property {string} updatedBy
 * @property {string} userName
 * @property {TimeStamp} createdAt
 * @property {TimeStamp} updatedAt
 * @property {Role} role
 */

/**
 * @typedef {Object} ClientUser
 * @property {boolean} loggedIn - always true
 * @property {boolean} passwordExpired
 * @property {string} userName
 * @property {Role} role
 */

const ClientUserFields = [
  "userName",
  "passwordExpired",
  "role",
];

/**
 * Takes a user as returned from the database and sets the loggedIn flag while removing the password and salt fields.
 * @func
 * @private
 * @param {User} user -
 * @returns {ClientUser}
 */
export const getClientUser = user => ({
  ..._.pick(user, ClientUserFields),
  loggedIn: true,
});

/**
 * 
 * @param {User} user
 * @returns {boolean}
 */
export const isAdmin = user => user && user.role === Role.Admin;
