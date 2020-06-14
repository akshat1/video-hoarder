import DefaultConfig from "../DefaultConfig.js";
import { getLogger } from "../logger.js";
import fs from "fs";
import _ from "lodash";
import path from "path";

const logger = getLogger("server/config");
let finalConfig;

/**
 * @typedef {Object} Config
 */

/**
 * @returns {Config}
 */
export const getConfig = () => {
  if (!finalConfig) {
    const configPath = path.join(process.cwd(), "config.json");
    logger.debug("going to load", configPath);
    const buffer = fs.readFileSync(configPath);
    logger.debug("Got buffer");
    const loadedConfig = JSON.parse(buffer.toString());
    finalConfig = {
      ...DefaultConfig,
      ...loadedConfig,
    };
    logger.debug({ DefaultConfig, loadedConfig, finalConfig });
  }

  return finalConfig;
};

export const getConfigValue = keyPath => _.get(getConfig(), keyPath);
