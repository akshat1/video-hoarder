/**
 * @func
 * @param {string} url
 * @returns {string}
 */
export const getURL = url => {
  return `%%%SERVER_PATH%%%/${url}`.replace(/\/+/g, "/");
};
