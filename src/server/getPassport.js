/**
 * @module server/getPassport
 */
import _ from 'lodash';
import passport from 'passport';
import Strategy from 'passport-local';
import Base64 from 'Base64';
import { getDb, getCollection, Collection, findOne } from './db';
import { hash } from './crypto.js';
import { getLogger } from '../logger.js';

const rootLogger = getLogger('getPassport');

const getReturnableUser = user => ({
  ..._.pick(user, 'userName'),
  loggedIn: true,
})

/**
 * Called by passport.js to verify the current user during log-in.
 *
 * @func
 * @param {string} userName 
 * @param {string} password - unencrypted password
 * @param {Function} cb -
 * @returns {Promise}
 */
const verifyUser = async (userName, password, cb) => {
  const logger = getLogger('verifyUser', rootLogger);
  try {
    logger.debug('verifyUser called', userName, password);
    const users = await getCollection(getDb(), Collection.users);
    logger.debug('Got users collection');
    const user = await findOne(users, { userName });
    logger.debug('Done finding user', user);
    if (user && (await hash(password, user.salt)) === user.password) {
      logger.debug('Calling cb');
      cb(null, getReturnableUser(user));
    } else {
      logger.debug('Indicate login-error.');
      cb(null, false, { message: 'Incorrect username or password.' });
    }
  } catch (err) {
    logger.error(err);
    cb(err);
  }
};

/**
 * Given a user object, calls `cb` with a single memoizable identifier to be placed in cookie.
 *
 * @func
 * @private
 * @param {User} user
 * @param {Function} cb
 */
export const serializeUser = (user, cb) => {
  rootLogger.debug('serialize user')
  cb(null, Base64.btoa(user.userName));
}

/**
 * Given a memoizable identifier, return the corresponding User object.
 *
 * @func
 * @private
 * @param {string} id
 * @param {Function} cb
 * @returns {Promise}
 */
export const deserializeUser = async (id, cb) => {
  rootLogger.debug(`deserializeUser: ${id}`);
  const userName = Base64.atob(id);
  const users = await getCollection(getDb(), Collection.users);
  const user = await findOne(users, { userName });
  cb(null, getReturnableUser(user));
}

/**
 * @func
 * @returns {Object} - passport.js instance.
 */
export const getPassport = () => {
  const localStrategy = new Strategy({
    usernameField: 'username',
    passwordField: 'password',
  }, verifyUser);
  passport.use(localStrategy);
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  return passport;
};
