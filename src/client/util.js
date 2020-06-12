import { getConfigValue } from "../config.js";

/**
 * @func
 * @param {string} url
 * @returns {string}
 */
export const getURL = async url => `${(await getConfigValue("serverPath"))}/${url}`.replace(/\/+/g, "/");
