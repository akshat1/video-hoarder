import { ClientStoreState } from "../model/ClientStoreState";
import { Item } from "../model/Item";
import { Notification } from "../model/Notification";
import { StatusFilterValue } from "../model/Status";
import { User } from "../model/User";
// @ts-ignore
import _ from "lodash";

export const getUser = (state: ClientStoreState): User => state.user;

export const isLoggedIn = (state: ClientStoreState): boolean => !!getUser(state).loggedIn;

export const isFetchingUser = (state: ClientStoreState): boolean => !!state.fetchingUser;

export const isUserFetchDone = (state: ClientStoreState): boolean => !!state.userFetchDone;

export const getCurrentPath = (state: ClientStoreState): string => _.get(state, "router.location.pathname");

export const getLoginError = (state: ClientStoreState): string|null => state.loginError;

export const getUserName = (state: ClientStoreState): string => getUser(state).userName;

export const getJobs = (state: ClientStoreState): Item[] => state.jobs || [];

export const getStatusFilterValue = (state: ClientStoreState): StatusFilterValue => state.statusFilter;

export const isPasswordExpired = (state: ClientStoreState): boolean => getUser(state).passwordExpired;

export const getUpdateUserErrorMessage = (state: ClientStoreState): string => state.updateUserErrorMessage;

export const isUpdateUserFailed = (state: ClientStoreState): boolean => state.updateUserFailed;

export const isUpdateUserSucceeded = (state: ClientStoreState): boolean => state.updateUserSucceeded;

export const isUpdatingUser = (state: ClientStoreState): boolean => state.updatingUser;

/**
 * Gets the value of a particular query-param, "text". The <InputForm /> component auto-populates
 * itself with the value of this param. This query paranm is used in the PWA "share" URL.
 */
export const getTargetURL = (state: ClientStoreState): string => decodeURIComponent(_.get(state, "router.location.query.text", ""));

export const getPathname = (state: ClientStoreState): string => _.get(state, "router.location.pathname", "");

export const getYTDLBinaryVersion = (state: ClientStoreState): string => _.get(state, "ytdlInfo.binaryVersion", "-");

export const getYTDLBinaryPath = (state: ClientStoreState): string => _.get(state, "ytdlInfo.binaryPath", "-");

export const getYTDLGlobalConfig = (state: ClientStoreState): string => _.get(state, "ytdlInfo.globalConfig", "");

export const isFetchingYTDLInfo = (state: ClientStoreState): boolean => !!state.fetchingYTDLInfo;

export const getNotifications = (state: ClientStoreState): Notification[] => state.notificationMessages || [];

export const getCurrentNotification = (state: ClientStoreState): Notification => getNotifications(state)[0];

/**
 * Are we currently on the home page?
 */
export const isOnHomePage = (state: ClientStoreState): boolean => getPathname(state) === "%%%SERVER_PATH%%%/";
