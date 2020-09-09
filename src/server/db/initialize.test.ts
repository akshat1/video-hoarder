import { fakeCollection, fakeDB, fakeTingoDB } from "../../fixtures/tingodb";
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
    const db = fakeDB();
    const collection = fakeCollection();
    // @ts-ignore0
    collection.findOne.mockImplementation((a, b, c, callback) => callback(null, {}));
    db.collection.mockImplementation((a, callback) => callback(null, collection));
    const fakeTingo = fakeTingoDB();
    fakeTingo.Db.mockImplementation(() => db);
    // @ts-ignore
    Tingo.mockReturnValue(fakeTingo);
    await initialize();
    expect(getDb()).toBe(db);
  });
});
