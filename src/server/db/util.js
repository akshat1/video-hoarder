import Tingo from 'tingodb';
import path from 'path';
import { encrypt } from '../crypto.js';
import { inPromiseCallback } from '../../util.js';
import { getLogger } from '../../logger.js';

const rootLogger = getLogger('db');

/** @typedef {string} CollectionName */

/**
 * @func
 * @enum {CollectionName}
 */
export const Collection = {
  Users: 'users',
  Jobs: 'jobs',
};

/**
 * Get the indicated collection (or create one if it doesn't exist).
 * @func
 * @memberof module:server/db
 * @param {module:server/db~DB} db
 * @param {module:server/db~CollectionName} collectionName
 * @returns {Promise.<module:server/db~Collection>}
 */
export const getCollection = (db, collectionName) =>
  new Promise((resolve, reject) => db.collection(collectionName, inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#making-queries-with-find
 * @func
 * @memberof module:server/db
 * @param {module:server/db~Collection} collection
 * @param {module:server/db~Query} query
 * @param {module:server/db~Fields} fields
 * @param {Object} options
 * @returns {Promise.<Object>}
 */
export const findOne = (collection, query, fields, options) =>
  new Promise((resolve, reject) => collection.findOne(query, fields, options, inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#making-queries-with-find
 * @func
 * @memberof module:server/db
 * @param {module:server/db~Collection} collection
 * @param {module:server/db~Query} query
 * @param {module:server/db~Fields} fields
 * @param {Object} options
 * @returns {Promise.<module:server/db~Cursor>}
 */
export const find = (collection, query, fields, options) =>
  new Promise((resolve, reject) => collection.find(query, fields, options, inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/insert.html#insert
 * @func
 * @memberof module:server/db
 * @param {module:server/db~Collection} collection
 * @param {Object|Object[]} docs
 * @param {Object} [options]
 * @returns {Promise.<Object|Object[]>}
 */
export const insert = (collection, docs, options) =>
  new Promise((resolve, reject) => collection.insert(docs, options, inPromiseCallback(resolve, reject)));

/**
 * A wrapper around collection.save.
 *
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/insert.html#save
 * @func
 * @memberof module:server/db
 * @param {module:server/db~Collection} collection
 * @param {Object|Object[]} docs
 * @param {Object} [options]
 * @returns {Promise.<Object|number>} - A promise that resolves into 1 if an existing record was updated, or a record if a new one was created.
 */
export const save = (collection, docs, options) =>
  new Promise((resolve, reject) => collection.save(docs, options, inPromiseCallback(resolve, reject)));

/**
 * A wrapper around collection.update.
 *
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/insert.html#update
 * @func
 * @memberof module:server/db
 * @param {module:server/db~Collection} collection
 * @param {module:server/db~Query} criteria
 * @param {Object} update
 * @param {Object} [options]
 * @returns {Promise.<Array>} - An array of the form [numRecordsUpdated:number, operationStatus:Object]
 */
export const update = (collection, criteria, update, options) =>
  new Promise((resolve, reject) => collection.update(criteria, update, options, inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#toarray
 * @func
 * @memberof module:server/db
 * @param {module:server/db~Cursor} cursor
 * @returns {Promise.<Array>}
 */
export const toArray = cursor =>
  new Promise((resolve, reject) => cursor.toArray(inPromiseCallback(resolve, reject)));

let db;

/**
 * Initialize the database. Creates user collection and the default user.
 *
 * @func
 * @memberof module:server/db
 * @param {DB} db
 * @returns {Promise}
 */
export const initialize = async () => {
  const logger = getLogger('initialize', rootLogger);
  if (!db || process.env.NODE_ENV === 'test') {
    const dbLocation = path.resolve(process.cwd(), 'db-data');
    const tingo = Tingo();
    const Db = tingo.Db;
    db = new Db(dbLocation, { name: 'video-hoarder-dev' });
  }

  let users;
  users = await getCollection(db, Collection.Users);
  const admin = await findOne(users, { userName: 'admin' });
  if (!admin) {
    // Create admin user with default password
    logger.debug('Create new admin user');
    const { salt, hash } = await encrypt('GottaHoardEmAll');
    await insert(users, {
      userName: 'admin',
      salt,
      password: hash,
    });
  }
};

/**
 * Returns the singleton db instance.
 * @func
 * @memberof module:server/db
 * @returns {Object}
 */
export const getDb = () => db;

/** @private */
export const stub = name => (arg) => {
  rootLogger(`stub ${name}() called`);
  return Promise.resolve(arg);
};
