const getLogger = loggerName =>({
  debug: (...messages) => console.debug(`[${loggerName}]`, ...messages),
  error: (...messages) => console.error(`[${loggerName}]`, ...messages),
  info: (...messages) => console.info(`[${loggerName}]`, ...messages),
  log: (...messages) => console.log(`[${loggerName}]`, ...messages),
  warn: (...messages) => console.warn(`[${loggerName}]`, ...messages),
});

export default getLogger;
