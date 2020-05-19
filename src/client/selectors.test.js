import assert from "assert";
import * as Selectors from "./selectors";

describe("client/selectors", () => {
  test("getUser should return store.user", () => {
    const user = { foo: "bar" };
    assert.strictEqual(Selectors.getUser({ user }), user);
  });

  describe("isLoggedIn", () => {
    const { isLoggedIn } = Selectors;
    test("isLoggedIn returns true when the user is logged in", () => {
      assert.equal(isLoggedIn({
        user: { loggedIn: true },
      }), true);
    });

    test("isLoggedIn returns false when the user is not logged in", () => {
      assert.equal(isLoggedIn({
        user: { loggedIn: false }
      }), false);
      // Following assertion will most likely break once we enforce an actual schema; we'll remove it then.
      assert.equal(isLoggedIn({ user: {} }), false);
    });
  });
});
