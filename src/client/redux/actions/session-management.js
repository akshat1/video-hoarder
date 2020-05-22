import { getLogger } from "../../../logger";
import { getCurrentPath,isLoggedIn, isUserFetchDone,  } from "../../selectors";
import { disconnect, reconnect } from "../../socketio";
import { makeActionF } from "../boilerplate";
import { getInstance } from "../net";
import { fetchJobs } from "./job-management";
import { push } from "connected-react-router"

const rootLogger = getLogger("actions");

export const User = "User";
/**
 * @function
 * @param {User} user
 * @returns {Action}
 */
export const setUser = makeActionF(User);

export const FetchingUser = "FetchingUser";
const setFetchingUser = makeActionF(FetchingUser);

export const UserFetchDone = "UserFetchDone";
const setUserFetchDone = makeActionF(UserFetchDone);

export const LoginError = "LoginError";
const setLoginError = makeActionF(LoginError);

/**
 * Action used by the login form.
 *
 * @func
 * @param {string} username 
 * @param {string} password 
 * @returns {ActionCreator} -
 */
export const doLogIn = (username, password) =>
  async (dispatch) => {
    const logger = getLogger("doLogin", rootLogger);
    try {
      const form = new URLSearchParams()
      form.append("username", username);
      form.append("password", password);
      logger.debug(form)
      const response = await getInstance().post("/api/user/login", form);

      if (response.status !== 200) {
        if (response.status === 401) {
          dispatch(setLoginError("Incorrect username or password."));
        } else {
          dispatch(setLoginError("Login error."));
        }

        return;
      }

      const user = response.data
      dispatch(setLoginError(null));
      dispatch(setUser(user));
      location.href = "/";
     } catch(err) {
       logger.error(err);
     }
  };

/**
 * Fetch the currently logged-in user (or clear state.user if the user session is expired).
 *
 * @func
 * @returns {ActionCreator}
 */
export const fetchUser = () =>
  async (dispatch) => {
    const logger = getLogger("fetchUser");
    try {
      dispatch(setFetchingUser(true));
      const response = await getInstance().get("/api/user/me");
      if (response.status !== 200) {
        throw new Error("Error occurred");
      }
      const user = await response.data;
      dispatch(setUser(user));
      reconnect();
    } catch (err) {
      logger.error(err);
      dispatch(setUser({}));
    }
    dispatch(setFetchingUser(false));
    dispatch(setUserFetchDone(true));
  };

/**
 * Perform a logout.
 *
 * @func
 * @returns {ActionCreator}
 */
export const doLogOut = () =>
  async dispatch => {
    await getInstance().post("/api/user/logout");
    disconnect();
    dispatch(setUser({}));
    dispatch(push("/login"));
  };

const initLoginPage = () =>
  (dispatch, getState) => {
    const logger = getLogger("initLoginPage", rootLogger);
    logger.debug("initLoginPage");
    if (isLoggedIn(getState())) {
      logger.debug("User is logged-in, redirect to /");
      dispatch(push("/"));
      return;
    }
    logger.debug("not logged-in. do nothing.");
  };

const initNonLoginPage = () =>
  async (dispatch, getState) => {
    const logger = getLogger("initializeClient", rootLogger);
    logger.debug("initNonLoginPage");
    if (isLoggedIn(getState())) {
      logger.debug("we are logged in. time to fetch other data.");
      await dispatch(fetchJobs());
      return;
    } else {
      logger.debug("We are not logged-in and we are not on the login page. Redirect to /login");
      dispatch(push("/login"));
      return;
    }
  };

/**
 * Called on every page view. Fetches the current user or clears state.user based on wether the user is logged-in and the session is valid or not.
 *
 * @func
 * @returns {ActionCreator}
 */
export const initializeClient = () =>
  async (dispatch, getState) => {
    const logger = getLogger("initializeClient", rootLogger);
    const state = getState();
    logger.debug("begin", state);
    if (!isUserFetchDone(state)) {
      logger.debug("Fetch user");
      await dispatch(fetchUser());
      logger.debug("Done fetching user");
    }

    if (getCurrentPath(state) === "/login") {
      await dispatch(initLoginPage());
    } else {
      await dispatch(initNonLoginPage());
    }
  };
