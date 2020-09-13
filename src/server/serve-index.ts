import { getLogger } from "../logger";
import { Request, Response } from "express";
import path from "path";

const logger = getLogger("serveIndex");
export const serveIndex = (req: Request, res: Response): void => {
  logger.debug("serveIndex", req.path);
  return res.sendFile(
    path.resolve(process.cwd(), "./dist/index.html"),
    err => err && res.status(500).send(err),
  );
};
