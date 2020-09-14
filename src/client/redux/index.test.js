/**
 * @jest-environment jsdom
 */
import { getStore } from "./index";
import assert from "assert";

describe("getStore", () => {
  test("should only create the store once", () => {
    const store = getStore();
    assert.strictEqual(store, getStore());
    assert.strictEqual(store, getStore());
  });
});
