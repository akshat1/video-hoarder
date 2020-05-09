/**
 * @module logger
 */

/**
 * A proxy to console.foo functions.
 *
 * @callback LogFunction
 * @param {...*} messages
 */

/**
 * @typedef {Object} Logger
 * @property {module:logger~LogFunction} debug
 * @property {module:logger~LogFunction} error
 * @property {module:logger~LogFunction} info
 * @property {module:logger~LogFunction} log
 * @property {module:logger~LogFunction} warn
 */

/**
 * Get a new Logger instance.
 *
 * @func
 * @param {string} name
 * @param {module:logger~Logger} [parentLogger]
 * @returns {Logger}
 */
export const getLogger = (name, parentLogger) => {
  const fullName = parentLogger ? `${parentLogger.getName()}:${name}` : name;
  return {
    getName: () => fullName,
    debug: (...messages) => console.debug(`[${fullName}]`, ...messages),
    error: (...messages) => console.error(`[${fullName}]`, ...messages),
    info: (...messages) => console.info(`[${fullName}]`, ...messages),
    log: (...messages) => console.log(`[${fullName}]`, ...messages),
    warn: (...messages) => console.warn(`[${fullName}]`, ...messages),
  }
};
