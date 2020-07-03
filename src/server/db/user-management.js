import { getLogger } from "../../logger.js" ;
import { Role } from "../../model/User.js";
import { hash } from "../crypto.js";
import { findOne, getUsersCollection, insert, update } from "./util.js";

const rootLogger = getLogger("db/user-management");

export const getUserByUserName = async (userName) => {
  const users = await getUsersCollection();
  return findOne(users, { userName });
};

export const createUser = async (userStub, createdBy) => {
  if (!createdBy) {
    throw new Error("[createUser] createdBy arg must be specified.");
  }

  const {
    password,
    passwordExpired,
    role = Role.User,
    salt,
    userName,
  } = userStub;

  const users = await getUsersCollection();
  const timestamp = new Date().toISOString();
  await insert(users, {
    createdAt: timestamp,
    createdBy,
    password,
    passwordExpired,
    role,
    salt,
    updatedAt: timestamp,
    updatedBy: createdBy,
    userName,
  });
};

/**
 * @param {User} updatedUser - the updated user. Expect userName to stay the same.
 * @param {string} updatedBy -
 * @return {Promise.<User>}
 */
export const updateUser = async (updatedUser, updatedBy) => {
  const logger = getLogger("updateUser", rootLogger);
  if (!updatedBy) {
    logger.error("updatedBy not specified.")
    throw new Error("[updateUser] updatedBy arg must be specified.");
  }

  const { userName } = updatedUser;
  const users = await getUsersCollection();
  const timestamp = new Date().toISOString();
  logger.debug("Call update...");
  await update(users, { userName }, {
    ...updatedUser,
    updatedAt: timestamp,
    updatedBy,
  });
  logger.debug("Done.");
};

export const getVerifiedUser = async (userName, password) => {
  const user = await getUserByUserName(userName);
  if (user && (await hash(password, user.salt)) === user.password) {
    return user;
  }

  return null;
};
