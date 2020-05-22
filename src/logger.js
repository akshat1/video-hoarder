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
 * @property {Function} getName
 * @property {Function} setLevel
 * @property {module:logger~LogFunction} debug
 * @property {module:logger~LogFunction} error
 * @property {module:logger~LogFunction} info
 * @property {module:logger~LogFunction} log
 * @property {module:logger~LogFunction} warn
 */

const Priority = {
  log: 6,   // Use this for stuff you always want to log.
  error: 5,
  warn: 4,
  info: 3,
  debug: 2,
  all: -1,
};

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
  let loggerLevel = "debug";
  const _shouldLog = level => {
    return Priority[level] >= Priority[loggerLevel] && (!parentLogger || parentLogger._shouldLog(level));
  };

  const instance = {
    _shouldLog,
    setLevel: level => loggerLevel = level,
    getName: () => fullName,
    debug: (...messages) => _shouldLog("debug") && console.debug(stub, ...messages),
    error: (...messages) => _shouldLog("error") && console.error(stub, ...messages),
    info: (...messages) => _shouldLog("info") && console.info(stub, ...messages),
    log: (...messages) => _shouldLog("log") && console.log(stub, ...messages),
    warn: (...messages) => _shouldLog("warn") && console.warn(stub, ...messages),
  };

  return instance;
};
