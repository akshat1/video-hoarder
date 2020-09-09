// @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#query-object
export type Query = any;

// @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/queries.html#making-queries-with-find
export type Projection = any;

export interface DBOptions { name: string }

export type FindOptions = Object;

export type InsertOptions = Object

export type SaveOptions = Object

export type UpdateOptions = Object

export type RemoveOptions = Object

export interface UpdateResult {
  count: number,
  status: string,
}

export type SortClause = [string, number];

// @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html
export interface Cursor {
  toArray(callback: (error, documents: any[]) => void);
  count(applySkipLimit: boolean, callback: (error, count: number) => void)
  sort(key: SortClause[] | string, callback: (error, cursor: Cursor) => void);
  limit(limit: number, callback: (error, cursor: Cursor) => void);
  skip(numToSkip: number, callback: (error, cursor: Cursor) => void);
}

// @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/collections.html
export interface Collection {
  findOne(query: Query, fields: Projection, options: FindOptions, callback: (error, document: any) => void);
  find(query: Query, fields: Projection, options: FindOptions, callback: (error, cursor: Cursor) => void);
  insert(documents: any | any[], options: InsertOptions, callback: (error, data) => void);
  save(documents: any[], options: SaveOptions, callback: (error, data) => void);
  update(criteria: Query, update, options: UpdateOptions, callback: (error, result: UpdateResult) => void);
  remove(criteria: Query, options: RemoveOptions, callback: (error, numRemoved: number) => void);
}

// @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/db.html#id1
export class Db {
  constructor(dbLocation: string, options: DBOptions);
  collection(name: string, callback: (error, collection: Collection) => void);
}

export interface TingoNameSpace {
  Db: typeof Db
}

declare function Tingo(): TingoNameSpace;

export default Tingo;
