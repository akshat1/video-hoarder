import loadedConfig from "../../config.json";
import DefaultConfig from "../DefaultConfig";
import _ from "lodash";

const FinalConfig = {
  ...DefaultConfig,
  ...loadedConfig,
};

FinalConfig.serverPath = FinalConfig.proxiedPath;

if (typeof window !== "undefined") {
  window.FinalConfig = FinalConfig;
}

export const getConfig = () => FinalConfig;
export const getConfigValue = keyPath => _.get(getConfig(), keyPath);
