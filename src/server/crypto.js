/**
 * Promisify wrappers around bcrypt module from npm.
 * @see https://www.npmjs.com/package/bcrypt
 * @module server/crypto
 */
import bcrypt from "bcrypt";

/**
 * @private
 * @const {number}
 */
export const DefaultNumberOfSaltRounds = 10;  // When changing this value, remember to update JSDoc wherever used.

/**
 * Wrapper around bcrypt.genSalt.
 *
 * @func
 * @see https://www.npmjs.com/package/bcrypt#to-hash-a-password
 * @param {number} [saltRounds=10]
 * @return {Promise.<string>}
 */
export const genSalt = async (saltRounds = DefaultNumberOfSaltRounds) => bcrypt.genSalt(saltRounds);

/**
 * bcrypt.hash
 *
 * @func
 * @see https://www.npmjs.com/package/bcrypt#to-hash-a-password
 * @param {string} plainText
 * @param {string} salt
 * @returns {Promise.<string>}
 */
export const hash = (plainText, salt) => bcrypt.hash(plainText, salt);

/**
 * Salts and hashes given plain text.
 *
 * @func
 * @see https://www.npmjs.com/package/bcrypt#to-hash-a-password
 * @param {string} plainText
 * @param {string} [saltRounds=10]
 * @returns {Promise.<Object>} - Object containing encrypted hash and corresponding salt.
 */
export const encrypt = async (plainText, saltRounds=DefaultNumberOfSaltRounds) => {
  const salt = await genSalt(saltRounds);
  return {
    salt,
    hash: await hash(plainText, salt),
  };
};
