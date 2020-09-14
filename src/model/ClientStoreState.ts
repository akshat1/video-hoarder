import { StatusFilterValue } from "../model/Status";
import { Item } from "./Item";
import { Notification } from "./Notification";
import { User } from "./User";
import { RouterState } from "connected-react-router";

export interface ClientStoreState {
  addingJob: boolean,
  fetchingJobs: boolean,
  fetchingUser: boolean,
  fetchingYTDLInfo: boolean,
  jobs: Item[],
  loginError: string,
  notificationMessages: Notification[],
  router: RouterState,
  statusFilter: StatusFilterValue,
  updateUserErrorFailed: boolean,
  updateUserErrorMessage: string,
  updateUserFailed: boolean,
  updateUserSucceeded: boolean,
  updatingUser: boolean,
  user: User,
  userFetchDone: boolean,
}
