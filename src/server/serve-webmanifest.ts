import path from "path";
import { Request, Response, NextFunction } from "express";

export const serveWebManifest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.sendFile(
      path.resolve(process.cwd(), "./dist/app.webmanifest"),
      err => err && res.status(500).send(err),
    );
  } catch (error) {
    next(error);
  }
};
