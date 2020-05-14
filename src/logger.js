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
 * @property {Function<string>} getName
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
  const stub = `[${fullName}]`;
  return {
    getName: () => fullName,
    debug: (...messages) => console.debug(stub, ...messages),
    error: (...messages) => console.error(stub, ...messages),
    info: (...messages) => console.info(stub, ...messages),
    log: (...messages) => console.log(stub, ...messages),
    warn: (...messages) => console.warn(stub, ...messages),
  }
};
