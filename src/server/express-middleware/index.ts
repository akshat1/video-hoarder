import { getLogger } from "../../logger";
import { isAdmin } from "../../model/User";
import { Request, Response, NextFunction} from "express";

const rlLogger = getLogger("requestLogger");
/**
 * Middleware to log requests.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (req.query.transport !== "polling") {
    rlLogger.debug(`${req.method} ${req.path}`);
  }
  next();
};

/* This is for use only with log-in and password reset APIs. */
export const ensureLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send("NOT AUTHORIZED");
};

/* This is for use with everything else. */
export const ensureValidUser = (req: Request, res: Response, next: NextFunction): void => {
  // @ts-ignore
  if (req.isAuthenticated() && req.user && !req.user.passwordExpired) {
    return next();
  }

  res.status(401).send("NOT AUTHORIZED");
};

/** This is for routes only meant to be used by users with admin role. */
export const ensureAdminUser = (req: Request, res: Response, next: NextFunction): void => {
  // @ts-ignore
  if (req.isAuthenticated() && isAdmin(req.user)) {
    return next();
  }

  res.status(401).send("NOT AUTHORIZED");
};
