import { getLogger } from "../../logger";
import { DummyUser, ServerUser as UserType } from "../../model/User";
import { getCurrentPath,isLoggedIn, isPasswordExpired,isUserFetchDone  } from "../selectors";
import { disconnect, reconnect } from "../socketio";
import { getURL } from "../util";
import { actionCreatorFactory, AsyncActionCreator, Dispatch, GetState,reducerFactory } from "./boilerplate";
import { fetchJobs } from "./job-management";
import { goToAccountScreen, goToHome, goToLogin } from "./navigation";
import { getInstance } from "./net";

const rootLogger = getLogger("actions");

export const User = "User";
/**
 * @function
 * @param {User} user
 * @returns {Action}
 */
export const setUser = actionCreatorFactory(User);

export const FetchingUser = "FetchingUser";
const setFetchingUser = actionCreatorFactory<boolean>(FetchingUser);

export const UserFetchDone = "UserFetchDone";
const setUserFetchDone = actionCreatorFactory<boolean>(UserFetchDone);

export const LoginError = "LoginError";
const setLoginError = actionCreatorFactory<boolean>(LoginError);

/**
 * Fetch the currently logged-in user (or clear state.user if the user session is expired).
 */
export const fetchUser = ():AsyncActionCreator =>
  async (dispatch: Dispatch): Promise<void> => {
    const logger = getLogger("fetchUser");
    try {
      dispatch(setFetchingUser(true));
      const response = await getInstance().get(getURL("/api/user/me"));
      if (response.status !== 200) {
        throw new Error("Error occurred");
      }
      const user = response.data;
      dispatch(setUser(user));
    } catch (err) {
      logger.error(err);
      dispatch(setUser({}));
    }
    dispatch(setFetchingUser(false));
    dispatch(setUserFetchDone(true));
  };

/**
 * Log out the currently user.
 */
export const doLogOut = (): AsyncActionCreator =>
  async (dispatch: Dispatch): Promise<void> => {
    await getInstance().post(getURL("./api/user/logout"));
    disconnect();
    dispatch(setUser({}));
    dispatch(goToLogin());
  };

const initLoginPage = (): AsyncActionCreator =>
  (dispatch: Dispatch, getState: GetState): Promise<void> => {
    const logger = getLogger("initLoginPage", rootLogger);
    logger.debug("initLoginPage");
    if (isLoggedIn(getState()) && getCurrentPath(getState()).endsWith("/login")) {
      logger.debug("User is logged-in, redirect to /");
      dispatch(goToHome());
      return;
    }
    logger.debug("not logged-in. do nothing.");
  };

const initNonLoginPage = (): AsyncActionCreator =>
  async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    const logger = getLogger("initializeClient", rootLogger);
    logger.debug("initNonLoginPage");
    if (isLoggedIn(getState())) {
      logger.debug("we are logged in.");
      if (!isPasswordExpired(getState())) {
        logger.debug("Fetch jobs.");
        await dispatch(fetchJobs());
        logger.debug("reconnect the socket");
        reconnect();
        return;
      }
    } else {
      logger.debug("We are not logged-in and we are not on the login page. Redirect to /login");
      dispatch(goToLogin());
      return;
    }
  };

/**
 * Called on every page view. Fetches the current user or clears state.user based on wether the user is logged-in and the session is valid or not.
 */
export const initializeClient = (): AsyncActionCreator =>
  async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    // if (getCurrentPath(getState()) === "/account") {
    //   debugger
    // }
    const logger = getLogger("initializeClient", rootLogger);
    const state = getState();
    logger.debug("begin", state);
    if (!isUserFetchDone(state)) {
      logger.debug("Fetch user");
      await dispatch(fetchUser());
      logger.debug("Done fetching user");
    }

    if (getCurrentPath(state).endsWith("/login")) {
      await dispatch(initLoginPage());
    } else {
      await dispatch(initNonLoginPage());
    }

    if (isPasswordExpired(getState())) {
      logger.debug("Go to account screen.");
      dispatch(goToAccountScreen());
    }
  };

/**
 * Action used by the login form.
 */
export const doLogIn = (username: string, password: string): AsyncActionCreator =>
  async (dispatch: Dispatch): Promise<void> => {
    const logger = getLogger("doLogin", rootLogger);
    try {
      const form = new URLSearchParams()
      form.append("username", username);
      form.append("password", password);
      logger.debug(form)
      const response = await getInstance().post(getURL("./api/user/login"), form);
      logger.debug("status:", response.status);
      if (response.status !== 200) {
        dispatch(setLoginError("Login error."));
        return;
      }

      const user = response.data
      dispatch(setLoginError(null));
      dispatch(setUser(user));
      dispatch(initializeClient());
     } catch(err) {
       logger.error("Log-in Failed!!!");
       logger.error(err);
       if (err.response?.status === 401) {
          dispatch(setLoginError("Incorrect username or password."));
        } else {
          dispatch(setLoginError("Login error."));
        }
     }
  };

export const fetchingUser = reducerFactory<boolean>(FetchingUser, false);
export const user = reducerFactory<UserType>(User, DummyUser);
export const userFetchDone = reducerFactory<boolean>(UserFetchDone, false);
export const loginError = reducerFactory<Error>(LoginError, null);
