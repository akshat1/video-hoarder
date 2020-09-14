import { getLogger } from "../../logger";
import { ServerUser } from "../../model/User";
import { encrypt } from "../crypto";
import { getUserByUserName, getVerifiedUser, updateUser } from "../db/index";
import { ensureLoggedIn } from "../express-middleware/index";
import express, { Request, Response,Router } from "express";
import { PassportStatic } from "passport";

const rootLogger = getLogger("api/user-management");

export const getProfile = (req: Request, res: Response): void => {
  const logger = getLogger("getProfile", rootLogger);
  logger.debug("getProfile", req.user, req.isAuthenticated());
  res.json(req.user);
};

export const logout = (req: Request, res: Response): void => {
  const logger = getLogger("logout", rootLogger);
  logger.debug("logout");
  req.logout();
  res.status(200).send("OK");
};

export const login = (req: Request, res: Response): void => {
  const logger = getLogger("login", rootLogger);
  logger.debug("login");
  res.json(req.user);
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const logger = getLogger("changePassword", rootLogger);
  try {
    // @ts-ignore
    const currentUser:ServerUser = req.currentUser;
    const { userName: updatedBy } = currentUser;
    const {
      currentPassword,
      newPassword,
      userName,
    } = req.body;
    logger.debug("Setting new password to", newPassword); // TODO: Remove this
    const { hash, salt } = await encrypt(newPassword);
    let user: ServerUser;
    if (userName!== "admin" && updatedBy === "admin") {
      // admin can change anybody's password
      logger.debug(`password change for ${userName} by admin (${updatedBy})`);
      user = await getUserByUserName(userName);
    } else if (userName === updatedBy) {
      // other users can only update their own password. We must validate current password.
      user = await getVerifiedUser(userName, currentPassword);
    }

    if (user) {
      await updateUser({
        ...user,
        salt,
        password: hash,
        passwordExpired: false,
      }, updatedBy);

      res.status(200).send("OK");
    }

    res.status(401).send("NOT AUTHORIZED");
  } catch (err) {
    logger.error(err);
    res.status(500).send("SERVER ERROR");
  }
};

export const getRouter = (passport: PassportStatic): Router => {
  const user = express.Router();
  user.get("/user/me", ensureLoggedIn, getProfile);
  user.post("/user/logout", logout);
  user.post("/user/login", passport.authenticate("local"), login);
  user.post("/user/change-password", ensureLoggedIn, changePassword);
  return user;
};
