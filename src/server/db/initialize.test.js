/* eslint-disable jest/no-disabled-tests */
import { fakeCollection, FakeDB, fakeTingoDB } from "../../fixtures/tingodb";
import { initialize } from "./initialize";
import { getDb  } from "./util";
import Tingo from "tingodb";

jest.mock("tingodb", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  }
});

describe("initialize", () => {
  test("initialize", async () => {
    const db = new FakeDB();
    const collection = fakeCollection();
    collection.findOne.mockImplementation((a, b, c, callback) => callback(null, {}));
    db.collection.mockImplementation((a, callback) => callback(null, collection));
    const fakeTingo = fakeTingoDB();
    fakeTingo.Db.mockImplementation(() => db);
    Tingo.mockReturnValue(fakeTingo);
    await initialize();
    expect(getDb()).toBe(db);
  });
});
