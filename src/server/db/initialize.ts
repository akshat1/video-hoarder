import { getLogger } from "../../logger";
import { Role } from "../../model/User";
import { encrypt } from "../crypto";
import { createUser,getUserByUserName } from "./user-management";
import { createDB, getDb } from "./util";

/**
 * Initialize the database. Creates user collection and the default user.
 */
export const initialize = async (): Promise<any> => {
  const logger = getLogger("initialize");
  if (!getDb()) {
    await createDB();
  }

  const admin = await getUserByUserName("admin");
  if (!admin) {
    // Create admin user with default password
    logger.debug("Create new admin user");
    logger.debug("Encrypt default password...");
    const { hash, salt } = await encrypt("password");
    logger.debug("call createUser");
    await createUser({
      userName: "admin",
      salt,
      password: hash,
      passwordExpired: process.env.NODE_ENV !== "development",
      role: Role.Admin,
    }, "system");
  }
};
