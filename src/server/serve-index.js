import { getLogger } from "../logger.js";
import path from "path";

const logger = getLogger("serveIndex");
/**
 * @param {express.Request} req 
 * @param {express.Response} res
 */
export const serveIndex = (req, res) => {
  logger.debug("serveIndex", req.path);
  return res.sendFile(
    path.resolve(process.cwd(), "./dist/index.html"),
    err => err && res.status(500).send(err),
  );
};
