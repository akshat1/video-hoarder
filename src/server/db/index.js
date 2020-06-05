/**
 * The database module. Because I don't want to spin up a whole database server (while still getting the benefits of a
 * database), I'm using [TingoDB](https://github.com/sergeyksv/tingodb) which is _"an embedded JavaScript in-process
 * filesystem or in-memory database upwards compatible with MongoDB"_. Unfortunately TingoDB is only compatible with
 * Mongo v1.4, is quite old, and never learnt about Promises. So you will see many wrappers in this module.
 *
 * @module server/db
 */

export { initialize } from "./initialize.js";
export * from "./util.js";
export * from "./job-management.js";

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
