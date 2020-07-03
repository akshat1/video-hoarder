import { getLogger } from "../../../logger";
import { getURL } from "../../util";
import { makeActionF } from "../boilerplate";
import { getInstance } from "../net";
import { showNotification } from "./notifications";

const rootLogger = getLogger("actions/ytdl");

export const FetchingYTDLInfo = "FetchingYTDLInfo";
export const setFetchingYTDLInfo = makeActionF(FetchingYTDLInfo);

export const YTDLInfo = "YTDLInfo";
export const setYTDLInfo = makeActionF(YTDLInfo);

/**
 * @func
 * @returns {ActionCreator}
 */
export const fetchYTDLInfo = () =>
  async (dispatch) => {
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

/**
 * @func
 * @param {Error} error 
 * @returns {ActionCreator}
 */
export const signalYTDLUpgradeFailure = (error) =>
  (dispatch) => {
    getLogger("signalYTDLUpgradeFailure").error(error);
    dispatch(setYTDLInfo({}));
    dispatch(setFetchingYTDLInfo(false));
    dispatch(showNotification(`youtube-dl upgrade failed: ${error.message}`, "error"));
  };

/**
 * @func
 * @param {YTDLInformation} information 
 * @returns {ActionCreator}
 */
export const signalYTDLUpgradeSuccess = (information) =>
  (dispatch) => {
    getLogger("signalYTDLUpgradeSuccess").debug("Success");
    dispatch(setYTDLInfo(information));
    dispatch(setFetchingYTDLInfo(false));
    dispatch(showNotification(`youtube-dl upgraded to version ${information.binaryVersion}`, "success"));
  };

/**
 * @func
 * @returns {ActionCreator}
 */
export const doYTDLUpgrade = () =>
  async (dispatch) => {
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

/**
 * @func
 * @param {string} newConfiguration
 * @returns {ActionCreator}
 */
export const doUpdateYTDLGlobalConfig = (newConfiguration) =>
  async (dispatch) => {
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
