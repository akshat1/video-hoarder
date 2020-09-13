import { getLogger } from "../../logger";
import { DummyYTDLInfo,YTDLInformation } from "../../model/ytdl";
import { getURL } from "../util";
import { actionCreatorFactory, AsyncActionCreator, Dispatch, reducerFactory } from "./boilerplate";
import { getInstance } from "./net";
import { showNotification } from "./notifications";

const rootLogger = getLogger("actions/ytdl");

export const FetchingYTDLInfo = "FetchingYTDLInfo";
export const setFetchingYTDLInfo = actionCreatorFactory<boolean>(FetchingYTDLInfo);

export const YTDLInfo = "YTDLInfo";
export const setYTDLInfo = actionCreatorFactory<YTDLInformation>(YTDLInfo);

export const fetchYTDLInfo = (): AsyncActionCreator =>
  async (dispatch: Dispatch) => {
    const logger = getLogger("fetchYTDLInfo", rootLogger);
    try {
      dispatch(setFetchingYTDLInfo(true));
      const response = await getInstance().get(getURL("/api/youtube-dl/information"));
      if (response.status !== 200) {
        throw new Error("Error occurred");
      }
      const information = response.data;
      dispatch(setYTDLInfo(information));
    } catch (err) {
      logger.error(err);
      dispatch(setYTDLInfo({}));
    }
    dispatch(setFetchingYTDLInfo(false));
  };

export const signalYTDLUpgradeFailure = (error: Error): AsyncActionCreator =>
  (dispatch: Dispatch) => {
    getLogger("signalYTDLUpgradeFailure").error(error);
    dispatch(setYTDLInfo(DummyYTDLInfo));
    dispatch(setFetchingYTDLInfo(false));
    dispatch(showNotification(`youtube-dl upgrade failed: ${error.message}`, "error"));
  };

export const signalYTDLUpgradeSuccess = (information: YTDLInformation): AsyncActionCreator =>
  (dispatch: Dispatch) => {
    getLogger("signalYTDLUpgradeSuccess").debug("Success");
    dispatch(setYTDLInfo(information));
    dispatch(setFetchingYTDLInfo(false));
    dispatch(showNotification(`youtube-dl upgraded to version ${information.binaryVersion}`, "success"));
  };

export const doYTDLUpgrade = (): AsyncActionCreator =>
  async (dispatch: Dispatch): Promise<void> => {
    const logger = getLogger("doYTDLUpgrade");
    try {
      dispatch(setFetchingYTDLInfo(true));
      logger.debug("Call upgrade endpoint...");
      const response = await getInstance().post(getURL("/api/youtube-dl/upgrade"));
      if (response.status !== 200) {
        throw new Error("API call failed");
      }
    } catch (error) {
      dispatch(signalYTDLUpgradeFailure(error));
      dispatch(setFetchingYTDLInfo(false));
    }
  };

export const doUpdateYTDLGlobalConfig = (newConfiguration: string): AsyncActionCreator =>
  async (dispatch: Dispatch): Promise<void> => {
    const logger = getLogger("updateYTDLGlobalConfig");
    try {
      dispatch(setFetchingYTDLInfo(true));
      logger.debug("Call endpoint...");
      const response = await getInstance().put(getURL("/api/youtube-dl/global-config"), { newConfiguration });
      if (response.status !== 200) {
        throw new Error("API call failed");
      }
      dispatch(showNotification("youtube-dl global config update succeeded.", "success"));
    } catch (error) {
      dispatch(showNotification(`youtube-dl global config update failed: ${error.message}`, "error"));
    }
    dispatch(setFetchingYTDLInfo(false));
  };

export const ytdlInfo = reducerFactory<YTDLInformation>(YTDLInfo, DummyYTDLInfo);
export const fetchingYTDLInfo = reducerFactory<boolean>(FetchingYTDLInfo, false);
