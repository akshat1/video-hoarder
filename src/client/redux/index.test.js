/**
 * @jest-environment jsdom
 */
import assert from "assert";
import { getStore } from "./index";

describe("getStore", () => {
  test("should only create the store once", () => {
    const store = getStore();
    assert.strictEqual(store, getStore());
    assert.strictEqual(store, getStore());
  });
});
