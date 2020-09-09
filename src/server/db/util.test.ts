import assert from "assert";
import { fakeCollection, fakeCursor, fakeDB } from "../../fixtures/tingodb";
import { find, findOne, getCollection, insert, remove,save, toArray, update, CollectionName  } from "./util";

jest.mock("tingodb", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  }
});

describe("db/util", () => {
  test("getCollection", async () => {
    const db = fakeDB();
    const expectedCollection = {};
    let actualName;
    db.collection.mockImplementation((name, cb) => {
      actualName = name;
      cb(null, expectedCollection);
    });
    const actualCollection = await getCollection(db, CollectionName.Jobs);
    expect(actualCollection).toBe(expectedCollection);
    expect(actualName).toBe(CollectionName.Jobs);

    let actualError;
    const expectedError = new Error("fake error");
    try {
      db.collection.mockImplementation((name, cb) => cb(expectedError));
      await getCollection(db, CollectionName.Users);
    } catch (err) {
      actualError = err;
    }

    expect(actualError).toBe(expectedError);
  });

  test("findOne", async () => {
    const collection = fakeCollection();
    let actualQuery, actualFields, actualOptions;
    const expectedResult = {};
    // @ts-ignore
    collection.findOne.mockImplementation((query, fields, options, callback) => {
      actualQuery = query;
      actualFields = fields;
      actualOptions = options;
      callback(null, expectedResult)
    });
    const result = await findOne(collection, "query", "fields", "options");
    expect(collection.findOne).toHaveBeenCalled();
    expect(actualQuery).toEqual("query");
    expect(actualFields).toEqual("fields");
    expect(actualOptions).toEqual("options");
    expect(result).toBe(expectedResult);

    const expectedError = new Error("fubar");
    let actualError;
    try {
      // @ts-ignore
      collection.findOne.mockImplementation((query, fields, options, callback) => callback(expectedError));
      await findOne(collection, "query", "fields", "options");
    } catch (err) {
      actualError = err;
    }
    expect(actualError).toBe(expectedError);
  });

  test("find", async () => {
    const collection = fakeCollection();
    let actualQuery, actualFields, actualOptions;
    const expectedResult = {};
    // @ts-ignore
    collection.find.mockImplementation((query, fields, options, callback) => {
      actualQuery = query;
      actualFields = fields;
      actualOptions = options;
      callback(null, expectedResult)
    });
    const result = await find(collection, "query", "fields", "options");
    expect(collection.find).toHaveBeenCalled();
    expect(actualQuery).toEqual("query");
    expect(actualFields).toEqual("fields");
    expect(actualOptions).toEqual("options");
    expect(result).toBe(expectedResult);

    const expectedError = new Error("fubar");
    let actualError;
    try {
      // @ts-ignore
      collection.find.mockImplementation((query, fields, options, callback) => callback(expectedError));
      await find(collection, "query", "fields", "options");
    } catch (err) {
      actualError = err;
    }
    expect(actualError).toBe(expectedError);
  });

  test("insert", async () => {
    const collection = fakeCollection();
    let actualDocs, actualOptions;
    const expectedResult = [{}];
    // @ts-ignore
    collection.insert.mockImplementation((docs, options, callback) => {
      actualDocs = docs;
      actualOptions = options;
      callback(null, expectedResult)
    });
    const result = await insert(collection, "docs", "options");
    expect(collection.insert).toHaveBeenCalled();
    expect(actualDocs).toEqual("docs");
    expect(actualOptions).toEqual("options");
    expect(result).toBe(expectedResult);

    const expectedError = new Error("fubar");
    let actualError;
    try {
      // @ts-ignore
      collection.insert.mockImplementation((docs, options, callback) => callback(expectedError));
      await insert(collection, "docs", "options");
    } catch (err) {
      actualError = err;
    }
    expect(actualError).toBe(expectedError);
  });

  test("save", async () => {
    const collection = fakeCollection();
    let actualDocs, actualOptions;
    const expectedResult = {};
    // @ts-ignore
    collection.save.mockImplementation((docs, options, callback) => {
      actualDocs = docs;
      actualOptions = options;
      callback(null, expectedResult)
    });
    const docs = [{ a: "A" }, { b: "B" }];
    const result = await save(collection, docs, "options");
    expect(collection.save).toHaveBeenCalled();
    expect(actualDocs).toEqual(docs);
    expect(actualOptions).toEqual("options");
    expect(result).toBe(expectedResult);

    const expectedError = new Error("fubar");
    let actualError;
    try {
      // @ts-ignore
      collection.save.mockImplementation((docs, options, callback) => callback(expectedError));
      await save(collection, docs, "options");
    } catch (err) {
      actualError = err;
    }
    expect(actualError).toBe(expectedError);
  });

  test("update", async () => {
    const collection = fakeCollection();
    let actualCriteria, actualUpdate, actualOptions;
    const count = 10;
    const status = "foo";
    const expectedResult = { count, status };
    // @ts-ignore
    collection.update.mockImplementation((criteria, update, options, callback) => {
      actualCriteria = criteria;
      actualUpdate = update;
      actualOptions = options;
      callback(null, count, status);
    });
    const result = await update(collection, "criteria", "update", "options");
    expect(collection.update).toHaveBeenCalled();
    expect(actualCriteria).toEqual("criteria");
    expect(actualUpdate).toEqual("update");
    expect(actualOptions).toEqual("options");
    // expect(result).toBe(expectedResult);
    assert.deepEqual(result, expectedResult);

    const expectedError = new Error("fubar");
    let actualError;
    try {
      // @ts-ignore
      collection.update.mockImplementation((criteria, update, options, callback) => callback(expectedError));
      await update(collection, "criteria", "update", "options");
    } catch (err) {
      actualError = err;
    }
    expect(actualError).toBe(expectedError);
  });

  test("remove", async () => {
    const collection = fakeCollection();
    let actualCriteria, actualOptions;
    const expectedResult = {};
    // @ts-ignore
    collection.remove.mockImplementation((criteria, options, callback) => {
      actualCriteria = criteria;
      actualOptions = options;
      callback(null, expectedResult)
    });
    const result = await remove(collection, "criteria", "options");
    expect(collection.remove).toHaveBeenCalled();
    expect(actualCriteria).toEqual("criteria");
    expect(actualOptions).toEqual("options");
    expect(result).toBe(expectedResult);

    const expectedError = new Error("fubar");
    let actualError;
    try {
      // @ts-ignore
      collection.remove.mockImplementation((criteria, options, callback) => callback(expectedError));
      await remove(collection, "criteria", "options");
    } catch (err) {
      actualError = err;
    }
    expect(actualError).toBe(expectedError);
  });

  test("toArray", async () => {
    const cursor = fakeCursor();
    const expectedResult = {};
    // @ts-ignore
    cursor.toArray.mockImplementation((callback) => callback(null, expectedResult));
    const actualResult = await toArray(cursor);
    expect(actualResult).toBe(expectedResult);

    const expectedError = new Error("fubar");
    let actualError;
    try {
      // @ts-ignore
      cursor.toArray.mockImplementation(callback => callback(expectedError));
      await toArray(cursor);
    } catch (err) {
      actualError = err;
    }
    expect(actualError).toBe(expectedError);
  });
  
});
