const basePath = new URL(document.baseURI).pathname;

/**
 * @func
 * @param {string} url
 * @returns {string}
 */
export const getURL = url => `${basePath}/${url}`.replace(/\/+/g, "/");
