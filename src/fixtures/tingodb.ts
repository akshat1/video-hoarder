import { Collection, Cursor, Db, TingoNameSpace } from "tingodb";

/**
 * A fake cursor.
 * @private
 */
export const fakeCursor = ():Cursor => ({
  count: jest.fn(),
  limit: jest.fn(),
  skip: jest.fn(),
  sort: jest.fn(),
  toArray: jest.fn(),
});

/**
 * A fake collection object comprising a bunch of jest.fn instances. Add more mocks as required.
 * @private
 */
export const fakeCollection = ():Collection => ({
  find: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
  remove: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

/**
 * A fake DB instance.
 * @private
 */
export const fakeDB = ():Db => ({
  collection: jest.fn(),
});

/**
 * A fake Tingo module.
 * @private
 */
export const fakeTingoDB = (): TingoNameSpace => ({
  Db: jest.fn(),
});
