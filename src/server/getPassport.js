import passport from 'passport';
import Strategy from 'passport-local';

/** @type {User} */
const DummyUser = {
  id: 999999,
  name: 'Dummy User',
  loggedIn: true,
};

const verifyUser = (username, password, cb) => {
  console.log('verifyUser called', username, password);
  if(password === 'sample') {
    console.log('Log in!');
    cb(null, DummyUser);
   } else {
    console.log('ERROR! ERROR!')
    cb(new Error('User not found'));
   }
}

const serializeUser = (user, cb) => {
  console.log('serialize user')
  cb(null, user.id);
}

const deserializeUser = (id, cb) => {
  console.log(`deserializeUser: ${id}`);
  cb(null, DummyUser);
}

/**
 * @function
 * @alias getPassport
 */
export default () => {
  const localStrategy = new Strategy({
    usernameField: 'username',
    passwordField: 'password',
  }, verifyUser);
  passport.use(localStrategy);
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  return passport;
};
