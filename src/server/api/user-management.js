import { getLogger } from "../../logger.js";
import { encrypt } from "../crypto.js";
import { getUserByUserName, getVerifiedUser, updateUser } from "../db/index.js";
import { ensureLoggedIn } from "./middleware.js";
import express from "express";

const rootLogger = getLogger("api/user-management");

export const getProfile = (req, res) => {
  const logger = getLogger("getProfile", rootLogger);
  logger.debug("getProfile", req.user, req.isAuthenticated());
  res.json(req.user);
};

export const logout = (req, res) => {
  const logger = getLogger("logout", rootLogger);
  logger.debug("logout");
  req.logout();
  res.status(200).send("OK");
};

export const login = (req, res) => {
  const logger = getLogger("login", rootLogger);
  logger.debug("login");
  res.json(req.user);
};

export const changePassword = async (req, res) => {
  const logger = getLogger("changePassword", rootLogger);
  try {
    const {
      userName,
      currentPassword,
      newPassword,
    } = req.body;
    logger.debug("Setting new password to", newPassword); // TODO: Remove this
    const { salt, hash } = await encrypt(newPassword);
    const { userName: updatedBy } = req.user;
    let user;
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

      return res.status(200).send("OK");
    }

    return res.status(401).send("NOT AUTHORIZED");
  } catch (err) {
    logger.error(err);
    return res.status(500).send("SERVER ERROR");
  }
};

export const getRouter = (passport) => {
  const user = new express.Router();

  user.get("/user/me", ensureLoggedIn, getProfile);
  user.post("/user/logout", logout);
  user.post("/user/login", passport.authenticate("local"), login);
  user.post("/user/change-password", ensureLoggedIn, changePassword);
  return user;
};
