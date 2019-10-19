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
 * @typedef TaskStats
 * @property {string} downloadETA
 * @property {number} downloadedPercent
 * @property {string} downloadSpeed
 * @property {string} totalSize
 * @property {string} timeTaken
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
 * @property {Object.<string, TaskStats>} taskStats - A map of task-id to respective TaskStats
 */

/**
 * @typedef SocketIO
 * @property {function} on -
 * @property {function} emit -
 */
