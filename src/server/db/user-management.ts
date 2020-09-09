import { getLogger } from "../../logger" ;
import { Role, User } from "../../model/User";
import { hash } from "../crypto";
import { findOne, getUsersCollection, insert, update } from "./util";

const rootLogger = getLogger("db/user-management");

export const getUserByUserName = async (userName:string): Promise<User> => {
  const users = await getUsersCollection();
  return findOne(users, { userName });
};

interface UserStub {
  password: string,
  passwordExpired: boolean,
  role: Role,
  salt: string,
  userName: string,
};

export const createUser = async (userStub: UserStub, createdBy: string): Promise<User> => {
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
  return (await insert(users, {
    createdAt: timestamp,
    createdBy,
    password,
    passwordExpired,
    role,
    salt,
    updatedAt: timestamp,
    updatedBy: createdBy,
    userName,
  }))[0];
};

/**
 * @param updatedUser - the updated user. Expect userName to stay the same.
 * @param updatedBy -
 */
export const updateUser = async (updatedUser: User, updatedBy: string): Promise<User> => {
  const logger = getLogger("updateUser", rootLogger);
  if (!updatedBy) {
    logger.error("updatedBy not specified.")
    throw new Error("[updateUser] updatedBy arg must be specified.");
  }

  const { userName } = updatedUser;
  const users = await getUsersCollection();
  const timestamp = new Date().toISOString();
  logger.debug("Call update...");
  // @ts-ignore
  return await update(users, { userName }, {
    ...updatedUser,
    updatedAt: timestamp,
    updatedBy,
  });
};

/** Verify the user's login details.*/
export const getVerifiedUser = async (userName, password):Promise<User> => {
  const user = await getUserByUserName(userName);
  if (user && (await hash(password, user.salt)) === user.password) {
    return user;
  }

  return null;
};
