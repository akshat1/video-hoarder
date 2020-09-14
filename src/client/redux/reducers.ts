/**
 * Actions and reducers. Together at last (we'll split them if required down the road).
 */
import { statusFilter } from "./job-management";
import { addingJob, fetchingJobs, jobs } from "./job-management";
import { notificationMessages } from "./notifications";
import { fetchingUser, loginError,user, userFetchDone } from "./session-management";
import { updateUserErrorMessage, updateUserFailed, updateUserSucceeded,updatingUser } from "./user-management";
import { fetchingYTDLInfo,ytdlInfo } from "./ytdl";
import { connectRouter } from "connected-react-router"
import { History } from "history";
import { combineReducers } from "redux";
import { Reducer } from "redux";

export const getRootReducer = (history: History): Reducer => {
  const rootReducer = combineReducers({
    addingJob,
    fetchingJobs,
    fetchingUser,
    fetchingYTDLInfo,
    jobs,
    loginError,
    notificationMessages,
    router: connectRouter(history),
    statusFilter,
    updateUserErrorMessage,
    updateUserFailed,
    updateUserSucceeded,
    updatingUser,
    user,
    userFetchDone,
    ytdlInfo,
  });

  return rootReducer;
};
