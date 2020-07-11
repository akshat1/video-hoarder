import loadedConfig from "../../config.json";
import DefaultConfig from "../DefaultConfig";
import _ from "lodash";

const __gulp__env = {};  // Don't change this line; will be modified at build time.

const FinalConfig = {
  ...DefaultConfig,
  ...loadedConfig,
  env: __gulp__env,
};

FinalConfig.serverPath = FinalConfig.proxiedPath;

if (typeof window !== "undefined") {
  window.FinalConfig = FinalConfig;
}

export const getConfig = () => FinalConfig;
export const getConfigValue = keyPath => _.get(getConfig(), keyPath);
