/** @module client/selectors */
import _ from "lodash";

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {User}
 */
export const getUser = state => state.user;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isLoggedIn = state => !!getUser(state).loggedIn;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isFetchingUser = state => !!state.fetchingUser;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isUserFetchDone = state => !!state.userFetchDone;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getCurrentPath = state => _.get(state, "router.location.pathname");

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {string|undefined}
 */
export const getLoginError = state => state.loginError;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getUserName = state => (getUser(state) || {}).userName;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getJobs = state => state.jobs || [];

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {StatusFilterValue}
 */
export const getStatusFilterValue = state => state.statusFilter;

/**
 * @function
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isPasswordExpired = state => (getUser(state) || {}).passwordExpired;

export const getUpdateUserErrorMessage = state => state.updateUserErrorMessage;

export const isUpdateUserFailed = state => state.updateUserFailed;

export const isUpdateUserSucceeded = state => state.updateUserSucceeded;

export const isUpdatingUser = state => state.updatingUser;

/**
 * Gets the value of a particular query-param, "text". The <InputForm /> component auto-populates
 * itself with the value of this param.
 *
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getTargetURL = state => decodeURIComponent(_.get(state, "router.location.query.text", ""));

/**
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getPathname = state => _.get(state, "router.location.pathname", "");

/**
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getYTDLBinaryVersion = state => _.get(state, "ytdlInfo.binaryVersion", "-");

/**
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getYTDLBinaryPath = state => _.get(state, "ytdlInfo.binaryPath", "-");

/**
 * @param {module:client/redux.State} state
 * @returns {string}
 */
export const getYTDLGlobalConfig = state => _.get(state, "ytdlInfo.globalConfig", "");

/**
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isFetchingYTDLInfo = state => !!state.fetchingYTDLInfo;

/**
 * @param {module:client/redux.State} state
 * @returns {Notification[]}
 */
export const getNotifications = state => state.notificationMessages || [];

/**
 * @param {module:client/redux.State} state
 * @returns {Notification}
 */
export const getCurrentNotification = state => getNotifications(state)[0];

/**
 * Are we currently on the home page?
 * @param {module:client/redux.State} state
 * @returns {boolean}
 */
export const isOnHomePage = state => getPathname(state) === "%%%SERVER_PATH%%%/";
