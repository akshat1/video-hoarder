/**
 * A fake cursor.
 * @func
 */
export const fakeCursor = () => {
  return {
    toArray: jest.fn(),
  };
};

/**
 * A fake collection object comprising a bunch of jest.fn instances. Add more mocks as required.
 * @func
 */
export const fakeCollection = () => {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    insert: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
};

/**
 * A fake DB instance.
 * @func
 */
export function FakeDB() {
  return {
    collection: jest.fn(),
  };
}

/**
 * A fake Tingo module.
 * @func
 */
export const fakeTingoDB = () => {
  return {
    Db: jest.fn(),
  };
};