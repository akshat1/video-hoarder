import { findOne, getUsersCollection, insert } from "./util.js";

export const getUserByUserName = async (userName) => {
  const users = await getUsersCollection();
  return findOne(users, { userName });
};

export const createUser = async (userStub) => {
  const {
    password,
    passwordExpired,
    salt,
    userName,
  } = userStub;

  const users = await getUsersCollection();
  const timestamp = new Date().toISOString();
  await insert(users, {
    createdAt: timestamp,
    password,
    passwordExpired,
    salt,
    updatedAt: timestamp,
    userName,
  });
};
