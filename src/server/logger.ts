// @todo restrict output by priority

export interface Logger {
  getName: () => string;
  debug: (...messages: any[]) => void;
  error: (...messages: any[]) => void;
  info: (...messages: any[]) => void;
  log: (...messages: any[]) => void;
  warn: (...messages: any[]) => void;
}

export const getLogger = (name: string, parent?: Logger): Logger => {
  const fullName = parent ? `${parent.getName()} > ${name}` : `${name}`;
  const getLabel = () => `[${new Date().toISOString()} | ${fullName}]`;
  return {
    getName: () => fullName,
    debug: (...messages) => console.debug(getLabel(), ...messages),
    error: (...messages) => console.error(getLabel(), ...messages),
    info: (...messages) => console.info(getLabel(), ...messages),
    log: (...messages) => console.log(getLabel(), ...messages),
    warn: (...messages) => console.warn(getLabel(), ...messages),
  };
};
