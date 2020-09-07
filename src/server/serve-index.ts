import { getLogger } from "../logger";
import path from "path";
import { Request, Response } from "express";

const logger = getLogger("serveIndex");
export const serveIndex = (req: Request, res: Response) => {
  logger.debug("serveIndex", req.path);
  return res.sendFile(
    path.resolve(process.cwd(), "./dist/index.html"),
    err => err && res.status(500).send(err),
  );
};
