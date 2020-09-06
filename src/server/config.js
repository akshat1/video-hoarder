const DefaultConfig = require("../DefaultConfig.js");
const { getLogger } = require("../logger.js");
const fs  = require("fs");
const _  = require("lodash");
const path  = require("path");

const logger = getLogger("server/config");
let finalConfig;

/**
 * @typedef {Object} Config
 */

/**
 * @returns {Config}
 */
const getConfig = module.exports.getConfig = () => {
  if (!finalConfig) {
    const configPath = path.join(process.cwd(), "config.json");
    logger.debug("going to load", configPath);
    const localConfigExists = fs.existsSync(configPath);
    let loadedConfig = {};
    if (localConfigExists) {
      const buffer = fs.readFileSync(configPath);
      logger.debug("Got buffer");
      loadedConfig = JSON.parse(buffer.toString());
    }

    finalConfig = {
      ...DefaultConfig,
      ...loadedConfig,
    };

    logger.debug({ DefaultConfig, loadedConfig, finalConfig });
  }

  return finalConfig;
};

module.exports.getConfigValue = keyPath => _.get(getConfig(), keyPath);
