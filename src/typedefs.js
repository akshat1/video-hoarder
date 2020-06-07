/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {*} value
 */

/**
 * An ISO 8601 timestamp
 * @typedef {string} TimeStamp
 */

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
 */

/**
 * @typedef {Object} ClientUser
 * @property {boolean} loggedIn
 * @property {boolean} passwordExpired
 * @property {string} userName
 */
