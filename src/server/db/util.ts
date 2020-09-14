import { getLogger } from "../../logger";
import path from "path";
import Tingo, { Collection, Cursor, Db, FindOptions, InsertOptions,Projection, Query, RemoveOptions, SaveOptions, SortClause,UpdateOptions } from "tingodb";

export enum CollectionName {
  Users = "users",
  Jobs = "jobs",
}

const rootLogger = getLogger("db");

let db;

/**
 * Returns the singleton db instance.
 */
export const getDb = ():Db => db;

export const createDB = (): Db => {
  if (!db || process.env.NODE_ENV === "test") {
    const dbLocation = path.resolve(process.cwd(), "db-data");
    const tingo = Tingo();
    const Db = tingo.Db;
    db = new Db(dbLocation, { name: "video-hoarder-dev" });
  }

  return db;
}

/**
 * Get the indicated collection (or create one if it doesn't exist).
 */
export const getCollection = (db: Db, collectionName: CollectionName):Promise<Collection> =>
  new Promise((resolve, reject) => db.collection(collectionName, (error, collection) => {
    error ? reject(error) : resolve(collection);
  }));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#making-queries-with-find
 */
export const findOne = (collection: Collection, query: Query, fields?: Projection, options?: FindOptions): Promise<any> =>
  new Promise((resolve, reject) => collection.findOne(query, fields, options, (error, document) => {
    error ? reject(error) : resolve(document);
  }));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#making-queries-with-find
 */
export const find = (collection: Collection, query: Query, fields?: Projection, options?: FindOptions): Promise<Cursor> =>
  new Promise((resolve, reject) => collection.find(query, fields, options, (error: Error, cursor: Cursor) => {
    error ? reject(error) : resolve(cursor);
  }));

/**
 * Extremely basic for now, will only go one level deep. Built specifically for debugging while inserting
 * users. Might write a better version in the future if required.
 */
const redact = src => {
  if (Array.isArray(src)) {
    return src.map(redact);
  }

  const dest = { ...src };
  if (dest.password) {
    dest.password = "XXXXXXXX";
  }

  if (dest.salt) {
    dest.salt = "XXXXXXXX";
  }

  return dest;
};

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/insert.html#insert
 */
export const insert = (collection: Collection, docs: any|any[], options?: InsertOptions): Promise<any[]> => {
  const logger = getLogger("insert", rootLogger);
  return new Promise((resolve, reject) => collection.insert(docs, options, (err, data) => {
    if (err) {
      logger.error(err);
      reject(err);
    } else {
      logger.debug(redact(data));
      resolve(data);
    }
  }));
};

/**
 * A wrapper around collection.save.
 *
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/insert.html#save
 * @returns A promise that resolves into 1 if an existing record was updated, or a record if a new one was created.
 */
export const save = (collection:Collection, docs: any[], options?: SaveOptions): Promise<any> =>
  new Promise((resolve, reject) => collection.save(docs, options, (error: Error, result) => {
    error ? reject(error) : resolve(result);
  }));

/**
 * A wrapper around collection.update.
 *
 * @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/insert.html#update
 * @returns An array of the form [numRecordsUpdated:number, operationStatus:Object]
 */
export const update = (collection: Collection, criteria: Query, update: Record<string, unknown>, options?: UpdateOptions): Promise<{ count: number, status: string }> =>
  new Promise((resolve, reject) => collection.update(criteria, update, options, (error: Error, count, status) => {
    getLogger("update", rootLogger).debug({ error, result: { count, status } });
    error ? reject(error) : resolve({ count, status });
  }));

/**
 * A wrapper around collection.remove.
 *
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/collection.html#remove
 * @returns the number of records removed.
 */
export const remove = (collection: Collection, criteria: Query, options?: RemoveOptions): Promise<number> =>
  new Promise((resolve, reject) => collection.remove(criteria, options, (error, numRemoved: number) => error ? reject(error) : resolve(numRemoved)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#toarray
 */
export const toArray = (cursor:Cursor): Promise<any[]> =>
  new Promise((resolve, reject) => cursor.toArray((error, documents) => error ? reject(error) : resolve(documents)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#count
 */
export const count = (cursor:Cursor, applySkipLimit: boolean): Promise<number> =>
  new Promise((resolve, reject) => cursor.count(applySkipLimit, (error, result) => error ? reject(error) : resolve(result)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#sort
 */
export const sort = (cursor: Cursor, keyOrList: string | SortClause[]): Promise<Cursor> =>
  // @ts-ignore
  new Promise((resolve, reject) => cursor.sort(keyOrList, (error, cursor) => error? reject(error) : resolve(cursor)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#limit
 */
export const limit = (cursor: Cursor, numLimit: number): Promise<Cursor> =>
  new Promise((resolve, reject) => cursor.limit(numLimit, (error, cursor) => error? reject(error) : resolve(cursor)));

/**
 * @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html#skip
 */
export const skip = (cursor: Cursor, numSkip: number): Promise<Cursor> =>
  new Promise((resolve, reject) => cursor.skip(numSkip, (error, cursor) => error? reject(error) : resolve(cursor)));

/**
 * @memberof module:server/db
 */
export const getJobsCollection = ():Promise<Collection> => getCollection(getDb(), CollectionName.Jobs);

/* *
 * @memberof module:server/db
 * @returns {Collection} - the users collection.
 */
export const getUsersCollection = ():Promise<Collection> => getCollection(getDb(), CollectionName.Users);
