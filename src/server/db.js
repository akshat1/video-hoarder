/**
 * The database module. Because I don't want to spin up a whole database server (while still getting the benefits of a
 * database), I'm using [TingoDB](https://github.com/sergeyksv/tingodb) which is _"an embedded JavaScript in-process
 * filesystem or in-memory database upwards compatible with MongoDB"_. Unfortunately TingoDB is only compatible with
 * Mongo v1.4, is quite old, and never learnt about Promises. So you will see many wrappers in this module.
 *
 * @module server/db
 */
import Tingo from 'tingodb';
import path from 'path';
import { encrypt } from './crypto.js';
import { inPromiseCallback } from '../util.js';
import { getLogger } from '../logger.js';

const rootLogger = getLogger('db');

/**
 * The database object.
 * @typedef {Object} DB
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/db.html#id1
 */
/**
 * @typedef {Object} Collection
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/collections.html
 */

/**
 * @typedef {Object} Query
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#query-object
 */

/**
 * A field projection, when you want to retreive a subset of the document's properties.
 *
 * @typedef {Object} Fields
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#making-queries-with-find
 */

/**
 * A cursor object.
 * @typedef {Object} Cursor
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html
 */

const dbLocation = path.resolve(process.cwd(), 'db-data');
const tingo = Tingo();
const Db = tingo.Db;
export const db = new Db(dbLocation, { name: 'video-hoarder-dev' });

/** @typedef {string} CollectionName */
/**
 * @enum {CollectionName}
 */
export const Collection = {
  users: 'users',
  jobs: 'jobs',
};

/**
 * Get the indicated collection (or create one if it doesn't exist).
 * @func
 * @param {module:server/db~DB} db
 * @param {module:server/db~CollectionName} collectionName
 * @returns {Promise.<module:server/db~Collection>}
 */
export const getCollection = (db, collectionName) =>
  new Promise((resolve, reject) => db.collection(collectionName, inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#making-queries-with-find
 * @func
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
 * @param {module:server/db~Cursor} cursor
 * @returns {Promise.<Array>}
 */
export const toArray = cursor =>
  new Promise((resolve, reject) => cursor.toArray(inPromiseCallback(resolve, reject)));

/**
 * Initialize the database. Creates user collection and the default user.
 *
 * @func
 * @param {DB} db
 * @returns {Promise}
 */
export const initialize = async (db) => {
  const logger = getLogger('initialize', rootLogger);
  if (!db) {
    throw new Error('Missing db in call to initialize()');
  }
  let users;
  users = await getCollection(db, Collection.users);
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
