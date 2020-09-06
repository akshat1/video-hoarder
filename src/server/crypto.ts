/**
 * Promisify wrappers around bcrypt module from npm.
 * @see https://www.npmjs.com/package/bcrypt
 * @module server/crypto
 */
import bcrypt from "bcrypt";

/**
 * @private
 */
export const DefaultNumberOfSaltRounds = 10;  // When changing this value, remember to update JSDoc wherever used.

/**
 * Wrapper around bcrypt.genSalt.
 *
 * @see https://www.npmjs.com/package/bcrypt#to-hash-a-password
 */
export const genSalt = (saltRounds: number = DefaultNumberOfSaltRounds): Promise<string> => bcrypt.genSalt(saltRounds);

/**
 * bcrypt.hash
 *
 * @see https://www.npmjs.com/package/bcrypt#to-hash-a-password
 */
export const hash = (plainText: string, salt: string): Promise<string> => bcrypt.hash(plainText, salt);

interface EncryptResult {
  salt: string,
  hash: string,
}

/**
 * Salts and hashes given plain text.
 *
 * @see https://www.npmjs.com/package/bcrypt#to-hash-a-password
 * @returns Object containing encrypted hash and corresponding salt.
 */
export const encrypt = async (plainText: string, saltRounds: number = DefaultNumberOfSaltRounds): Promise<EncryptResult> => {
  const salt = await genSalt(saltRounds);
  return {
    salt,
    hash: await hash(plainText, salt),
  };
};
