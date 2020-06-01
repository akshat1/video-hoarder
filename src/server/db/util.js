import { getLogger } from "../../logger.js";
import { inPromiseCallback } from "../../util.js";
import { encrypt } from "../crypto.js";
import path from "path";
import Tingo from "tingodb";

const rootLogger = getLogger("db");

/** @typedef {string} CollectionName */

/**
 * @func
 * @memberof module:server/db
 * @enum {CollectionName}
 */
export const Collection = {
  Users: "users",
  Jobs: "jobs",
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
export const insert = (collection, docs, options) => {
  const logger = getLogger("insert", rootLogger);
  return new Promise((resolve, reject) => collection.insert(docs, options, (err, data) => {
    if (err) {
      logger.error(err);
      reject(err);
    } else {
      logger.debug(data);
      resolve(data[0]);
    }
  }));
};

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
 * A wrapper around collection.remove.
 *
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/collection.html#remove
 * @func
 * @memberof module:server/db
 * @param {module:server/db~Collection} collection
 * @param {module:server/db~Query} criteria
 * @param {Object} [options]
 * @returns {Promise.<number>} - Number of records removed.
 */
export const remove = (collection, criteria, options) =>
  new Promise((resolve, reject) => collection.remove(criteria, options, inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#toarray
 * @func
 * @memberof module:server/db
 * @param {module:server/db~Cursor} cursor
 * @returns {Promise.<Array>}
 */
export const toArray = cursor =>
  new Promise((resolve, reject) => cursor.toArray(inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#count
 * @func
 * @param {module:server/db~Cursor} cursor 
 * @param {boolean} applySkipLimit
 * @returns {Promise.<number>}
 */
export const count = (cursor, applySkipLimit) =>
  new Promise((resolve, reject) => cursor.count(applySkipLimit, inPromiseCallback(resolve, reject)));

/**
 * An array of arrays, such that each sub-array contains a string field name and anumber direction.
 * @typedef {Array} SortList
 * @example
 * ```
 * [
 *   ['wheels', -1],
 *   ['model_year', '-1'],
 *   ['name', 1],
 * ]
 * ```
 */
/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#sort
 * @func
 * @param {module:server/db~Cursor} cursor
 * @param {string|SortList} keyOrList
 * @returns {Promise.<module:server/db~Cursor>}
 */
export const sort = (cursor, keyOrList) =>
  new Promise((resolve, reject) => cursor.sort(keyOrList, inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#limit
 * @func
 * @param {module:server/db~Cursor} cursor
 * @param {number} numLimit - number of docs to limit to.
 * @returns {Promise.<module:server/db~Cursor>}
 */
export const limit = (cursor, numLimit) =>
  new Promise((resolve, reject) => cursor.limit(numLimit, inPromiseCallback(resolve, reject)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#skip
 * @func
 * @param {module:server/db~Cursor} cursor
 * @param {number} numSkip - number of records to skip.
 * @returns {Promise.<module:server/db~Cursor>}
 */
export const skip = (cursor, numSkip) =>
  new Promise((resolve, reject) => cursor.skip(numSkip, inPromiseCallback(resolve, reject)));

let db;

/**
 * Returns the singleton db instance.
 * @func
 * @memberof module:server/db
 * @returns {Object}
 */
export const getDb = () => db;

// Not really sure how to test the following two. Immutable modules. Mmmm hmm. Lovely.
/**
 * @memberof module:server/db
 * @returns {Collection} - the jobs collection.
 */
export const getJobsCollection = () => getCollection(getDb(), Collection.Jobs);

/**
 * @memberof module:server/db
 * @returns {Collection} - the users collection.
 */
export const getUsersCollection = () => getCollection(getDb(), Collection.Users);

/**
 * Initialize the database. Creates user collection and the default user.
 *
 * @func
 * @memberof module:server/db
 * @param {DB} db
 * @returns {Promise}
 */
export const initialize = async () => {
  const logger = getLogger("initialize", rootLogger);
  if (!db || process.env.NODE_ENV === "test") {
    const dbLocation = path.resolve(process.cwd(), "db-data");
    const tingo = Tingo();
    const Db = tingo.Db;
    db = new Db(dbLocation, { name: "video-hoarder-dev" });
  }

  const users = await getUsersCollection();
  const admin = await findOne(users, { userName: "admin" });
  if (!admin) {
    // Create admin user with default password
    logger.debug("Create new admin user");
    const { salt, hash } = await encrypt("GottaHoardEmAll");
    await insert(users, {
      userName: "admin",
      salt,
      password: hash,
    });
  }
};
