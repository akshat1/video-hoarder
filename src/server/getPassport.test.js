import passport from 'passport';
import Strategy from 'passport-local';
import Base64 from 'Base64';
import { findOne, getUsersCollection } from './db';
import assert from 'assert';
import { getReturnableUser, verifyUser, MessageIncorrectLogin, serializeUser, deserializeUser, getPassport } from './getPassport';
import { fakeCollection } from '../fixtures/tingodb';
import { encrypt } from './crypto';

jest.mock('passport', () => ({
  __esModule: true,
  default: {
    use: jest.fn(),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
  },
}));

jest.mock('passport-local');

jest.mock('./db', () => ({
  getUsersCollection: jest.fn(),
  findOne: jest.fn(),
}));

describe('server/getPassport', () => {
  test('getReturnableUser', () => {
    const user = {
      userName: 'foo',
      password: 'bar',
      salt: 'baz',
    };

    assert.deepEqual(getReturnableUser(user), {
      userName: 'foo',
      loggedIn: true,
    });
  });

  describe('verifyUser', () => {
    test('calls cb with user when user verified', async () => {
      const usersCollection = fakeCollection();
      const userName = 'test-user';
      const password = 'test-password';
      const { salt, hash } = await encrypt(password);
      const user = {
        userName,
        salt,
        password: hash,
      };
      getUsersCollection.mockResolvedValue(usersCollection);
      findOne.mockResolvedValue(user);
      const cb = jest.fn();
      await verifyUser(userName, password, cb);
      expect(cb).toHaveBeenCalledWith(null, getReturnableUser(user));
    });

    test('calls cb with message message when user not verified', async () => {
      const usersCollection = fakeCollection();
      const userName = 'test-user';
      const password = 'test-password';
      const { salt, hash } = await encrypt('non-matching-password');
      const user = {
        userName,
        salt,
        password: hash,
      };
      getUsersCollection.mockResolvedValue(usersCollection);
      findOne.mockResolvedValue(user);
      const cb = jest.fn();
      await verifyUser(userName, password, cb);
      expect(cb).toHaveBeenCalledWith(null, false, { message: MessageIncorrectLogin });
    });

    test('calls cb with error when one occurs', async () => {
      const expectedError = new Error('test error');
      getUsersCollection.mockImplementation(() => Promise.reject(expectedError));
      const cb = jest.fn();
      await verifyUser('foo', 'bar', cb);
      expect(cb).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('serializeUser', () => {
    test('should yield Base64 encoded userName', () => {
      const user = {
        userName: 'foobar',
        other: 'data',
        moar: 'randomFutureStuff',
      };
      const cb = jest.fn();
      serializeUser(user, cb);
      expect(cb).toHaveBeenCalledWith(null, Base64.btoa(user.userName));
    });
  });

  describe('deserializeUser', () => {
    test('yields with user when one found in db', async () => {
      const userName = 'foobar';
      const id = Base64.btoa(userName);
      const user = {
        userName,
        password: 'sooper secret',
        salt: 'to taste',
      };
      getUsersCollection.mockResolvedValue({});
      findOne.mockResolvedValue(user);
      const cb = jest.fn();
      await deserializeUser(id, cb);
      expect(cb).toHaveBeenCalledWith(null, getReturnableUser(user));
    });

    test('yields error when one occurs', async () => {
      getUsersCollection.mockResolvedValue({});
      const expectedError = new Error('expected error');
      findOne.mockImplementation(Promise.reject(expectedError));
      const cb = jest.fn();
      await deserializeUser('foo', cb);
      expect(cb).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('getPassport', () => {
    const p = getPassport();
    expect(p).toBe(passport);
    expect(Strategy).toHaveBeenCalledWith({
      usernameField: 'username',
      passwordField: 'password',
    }, verifyUser);
    expect(passport.use).toHaveBeenCalledWith(Strategy.mock.instances[0]);
    expect(passport.serializeUser).toHaveBeenCalledWith(serializeUser);
    expect(passport.deserializeUser).toHaveBeenCalledWith(deserializeUser);
  });
});
