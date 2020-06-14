import { getConfigValue } from "./config.js";

/**
 * @func
 * @param {string} url
 * @returns {string}
 */
export const getURL = url => {
  const serverPath = getConfigValue("serverPath");
  return `${serverPath}/${url}`.replace(/\/+/g, "/");
};
