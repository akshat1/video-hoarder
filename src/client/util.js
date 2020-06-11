import config from "../../config.json";

const basePath = config.serverPath;

/**
 * @func
 * @param {string} url
 * @returns {string}
 */
export const getURL = url => `${basePath}/${url}`.replace(/\/+/g, "/");
