/**
 * Actions and reducers. Together at last (we'll split them if required down the road).
 * @module client/redux/actions-and-reducers
 */
import { StatusFilterValue } from "../StatusFilterValue.js";
import * as Actions from "./actions";
import { makeReducer } from "./boilerplate";
import { connectRouter } from "connected-react-router"
import { combineReducers } from "redux";

/**
 * The redux store.
 * @typedef State
 * @property {boolean} fetchingUser - are we currently fetching a user?
 * @property {boolean} userFetchDone - true if we have made an attempt to fetch the user profile.
 * @property {Object} router - from connected-react-router.
 * @property {string|null} loginError - error from the most recent login attempt, or null if the attempt was successful.
 * @property {User} user - currently logged in user; or `{}` when not logged in.
 */

 /**
 * @function
 * @param {History} -
 * @returns {Function} - The new store state
 */
export const getRootReducer = history => {
  /**
   * @function
   * @param {State} - The current store state
   * @param {Action}
   * @returns {State} - The new store state
   */
  const rootReducer = combineReducers({
    fetchingUser: makeReducer(Actions.FetchingUser, false),
    loginError: makeReducer(Actions.LoginError, null),
    router: connectRouter(history),
    user: makeReducer(Actions.User, {}),
    userFetchDone: makeReducer(Actions.UserFetchDone, false),
    jobs: makeReducer(Actions.Jobs, []),
    fetchingJobs: makeReducer(Actions.FetchingJobs, false),
    addingJob: makeReducer(Actions.AddingJob, false),
    statusFilter: makeReducer(Actions.StatusFilter, StatusFilterValue.All),
  });

  return rootReducer;
};
