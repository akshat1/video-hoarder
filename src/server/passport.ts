import { User } from "../model/User";
import { hash } from "./crypto";
import { getUserByName } from "./db/userManagement";
import { GraphQLLocalStrategy } from "graphql-passport";
import passport, { PassportStatic } from "passport";

const MessageIncorrectLogin = "Incorrect username or password.";

export const verifyUser = async (userName: string, password: string, cb: Function): Promise<any> => {
  try {
    console.debug("verifyUser called", userName, "*********");
    const user = await getUserByName(userName);
    const suppliedHash = await hash(password, user.passwordSalt);
    if (suppliedHash === user.passwordHash) {
      const {
        id,
        passwordExpired,
        role,
        userName,
      } = user;

      console.log("calling cb for", userName);
      return cb(null, {
        id,
        passwordExpired,
        role,
        userName,
      });
    }
    
    return cb(null, false, { message: MessageIncorrectLogin });
  } catch (err) {
    console.error(err);
    cb(err);
  }
};

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await User.findOne({ where: { id }});
  done(null, user);
});

export const getPassport = ():PassportStatic => {
  passport.use(new GraphQLLocalStrategy(verifyUser));
  return passport;
}
