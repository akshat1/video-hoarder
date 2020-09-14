import { actionCreatorFactory, reducerFactory } from "./boilerplate";
import assert from "assert";

describe("redux/boilerplate", () => {
  describe("makeActionF", () => {
    test("should return a function", () => {
      assert.equal(typeof actionCreatorFactory("foo"), "function");
    });

    test("returned function should return the expected action", () => {
      assert.deepEqual(actionCreatorFactory("foo")("bar"), { type: "foo", value: "bar" });
    });
  });

  describe("makeReducer", () => {
    const actionType = "FOO";
    const defaultVal = "FOO-DEFAULT";
    let reducer;
    beforeAll(() => {
      reducer = reducerFactory(actionType, defaultVal);
    });

    test("reducer should be a function", () => {
      assert.equal(typeof reducer, "function");
    });

    test("reducer should ignore actions without the target-type", () => {
      assert.equal(reducer("baz", { type: "qux", value: "quux" }), "baz");
      assert.equal(reducer(undefined, { type: "qux", value: "quux" }), defaultVal);
    });

    test("given the right action-type, action should return the action value", () => {
      assert.equal(reducer("baz", { type: actionType, value: "quux" }), "quux");
    });
  });
});
