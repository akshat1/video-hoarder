/* This is used in the gulpfile, so needs to be straight JS. */
const DefaultConfig = require("../DefaultConfig.js");
const fs  = require("fs");
const _  = require("lodash");
const path  = require("path");

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
    const localConfigExists = fs.existsSync(configPath);
    let loadedConfig = {};
    if (localConfigExists) {
      const buffer = fs.readFileSync(configPath);
      loadedConfig = JSON.parse(buffer.toString());
    }

    finalConfig = {
      ...DefaultConfig,
      ...loadedConfig,
    };
  }

  return finalConfig;
};

module.exports.getConfigValue = keyPath => _.get(getConfig(), keyPath);
