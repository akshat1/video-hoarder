import { getLogger } from "../../logger.js";
import { Role } from "../../model/User.js";
import { encrypt } from "../crypto.js";
import { createUser,getUserByUserName } from "./user-management.js";
import { createDB, getDb } from "./util.js";

/**
 * Initialize the database. Creates user collection and the default user.
 *
 * @func
 * @memberof module:server/db
 * @param {DB} db
 * @returns {Promise}
 */
export const initialize = async () => {
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
      passwordExpired: true,
      role: Role.Admin,
    }, "system");
  }
};
