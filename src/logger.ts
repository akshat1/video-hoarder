/**
 * @module logger
 */

enum Priority {
  log = 6,   // Use this for stuff you always want to log.
  error = 5,
  warn = 4,
  info = 3,
  debug = 2,
  all = -1,
}

interface Logger {
  _shouldLog(level: Priority): boolean,
  getName() : string,
  setLevel(level:string): void,
  debug(...messages: any[]): void,
  error(...messages: any[]): void,
  info(...messages: any[]): void,
  log(...messages: any[]): void,
  warn(...messages: any[]): void,
}

/**
 * Get a new Logger instance.
 */
export const getLogger = (name: string, parentLogger?: Logger): Logger => {
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
