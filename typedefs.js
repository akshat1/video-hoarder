/**
 * @typedef Task
 * @property {string} id -
 * @property {string} url -
 * @property {Status} status -
 * @property {number} added -
 * @property {number} finished -
 * @property {string} error -
 */

/**
 * @typedef InputFormState
 * @property {string} url -
 * @property {boolean} disabled -
 * @property {string} errorMessage - blank if no errors encountered
 */

/**
 * @typedef AppState
 * @property {Tasks[]} tasks -
 * @property {InputFormState} inputForm -
 * @property {string} selectedTaskId -
 * @property {string[]} selectedTaskOutput -
 */

/**
 * @typedef SocketIO
 * @property {function} on -
 * @property {function} emit -
 */
