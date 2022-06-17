import { User } from "../model/User";
import { hash } from "./crypto";
import { getUserByName } from "./db/userManagement";
import { getLogger } from "../shared/logger";

const rootLogger = getLogger("passport");
const MessageIncorrectLogin = "Incorrect username or password.";

export const verifyUser = async (userName: string, password: string, cb: Function): Promise<any> => {
  const logger = getLogger("verifyUser", rootLogger);
  try {
    logger.debug("verifyUser called", userName, "*********");
    const user = await getUserByName(userName);
    const suppliedHash = await hash(password, user.passwordSalt);
    if (suppliedHash === user.passwordHash) {
      logger.debug("Login successful.");
      const {
        id,
        passwordExpired,
        role,
        userName,
      } = user;

      return cb(null, {
        id,
        passwordExpired,
        role,
        userName,
      });
    }
    
    logger.error("Login failed.");
    return cb(null, false, { message: MessageIncorrectLogin });
  } catch (err) {
    logger.error(err);
    cb(err);
  }
};

export const serializeUser = ((user: User, done: Function): void => {
  done(null, user.id);
});

export const deserializeUser = (async (id: string, done: Function): Promise<void> => {
  const user = await User.findOne({ where: { id }});
  done(null, user);
});
