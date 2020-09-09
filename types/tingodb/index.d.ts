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

export type SortClause = [string, number];

// @see https://mongodb.github.io/node-mongodb-native/1.4/api-generated/cursor.html
export interface Cursor {
  count(applySkipLimit: boolean, callback: (error, count: number) => void)
  limit(limit: number, callback: (error, cursor: Cursor) => void);
  skip(numToSkip: number, callback: (error, cursor: Cursor) => void);
  sort(key: SortClause[] | string, callback: (error, cursor: Cursor) => void);
  toArray(callback: (error, documents: any[]) => void);
}

// @see https://mongodb.github.io/node-mongodb-native/1.4/markdown-docs/collections.html
export interface Collection {
  find(query: Query, fields: Projection, options: FindOptions, callback: (error, cursor: Cursor) => void);
  findOne(query: Query, fields: Projection, options: FindOptions, callback: (error, document: any) => void);
  insert(documents: any | any[], options: InsertOptions, callback: (error, data) => void);
  remove(criteria: Query, options: RemoveOptions, callback: (error, numRemoved: number) => void);
  save(documents: any[], options: SaveOptions, callback: (error, data) => void);
  update(criteria: Query, update, options: UpdateOptions, callback: (error, count: number, status: string) => void);
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
