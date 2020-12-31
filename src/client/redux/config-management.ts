import { getLogger } from "../../logger";
import { ConfigurationPreset } from "../../model/ConfigurationPreset";
import { getURL } from "../util";
import { actionCreatorFactory, AsyncActionCreator, reducerFactory } from "./boilerplate";
import { getInstance } from "./net";

const rootLogger = getLogger("redux/config-management");

export const Presets = "Presets";
export const setPresets = actionCreatorFactory<ConfigurationPreset[]>(Presets);

export const FetchingPresets = "FetchingPresets";
export const setFetchingPresets = actionCreatorFactory<boolean>(FetchingPresets);

export const fetchPresets = ():AsyncActionCreator =>
  async (dispatch):Promise<void> => {
    const logger = getLogger("fetchPresets", rootLogger);
    logger.debug("begin");
    try {
      dispatch(setFetchingPresets(true));
      // For now, hardcode youtube-dl as the tool.
      const response = await getInstance().post(getURL("./api/config-management/presets"), { tool: "youtube-dl" });
      const { data: presets } = response.data;
      dispatch(setPresets(presets));
    } catch (error) {
      logger.error(error);
    } finally {
      dispatch(setFetchingPresets(false));
    }
  };

// Reducers
export const presets = reducerFactory<ConfigurationPreset[]>(Presets, []);
export const fetchingPresets = reducerFactory<boolean>(FetchingPresets, false);
