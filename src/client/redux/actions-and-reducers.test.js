import assert from 'assert';
import { setUser, rootReducer, } from './actions-and-reducers';

describe('actions', () => {
  describe('setUser', () => {
    test('should set the provided user as value', () => {
      const user = { use: 'r' };
      assert.strictEqual(setUser(user).value, user);
    });
  });

  describe('reducers', () => {
    describe('root', () => {
      test('should have the user when presented with the right action', () => {
        const user = { use: 'r' };
        assert.strictEqual(rootReducer({}, setUser(user)).user, user);
      });

      test('should not modify state.user when not given the right action', () => {
        const user = { use: 'r' };
        assert.strictEqual(rootReducer({ user }, { type: 'foo', value: 'bar' }).user, user);
      });
    });
  });
});
