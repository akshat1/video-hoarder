import { NextFunction,Request, Response } from "express";
import path from "path";

export const serveWebManifest = async (req: Request, res: Response, next: NextFunction): void => {
  try {
    return res.sendFile(
      path.resolve(process.cwd(), "./dist/app.webmanifest"),
      err => err && res.status(500).send(err),
    );
  } catch (error) {
    next(error);
  }
};
