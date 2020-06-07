/* This is for use only with log-in and password reset APIs. */
export const ensureLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send("NOT AUTHORIZED");
};

/* This is for use with everything else. */
export const ensureValidUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user && !req.user.passwordExpired) {
    return next();
  }

  res.status(401).send("NOT AUTHORIZED");
};
