import _ from 'lodash';
import winston from 'winston';
import getConfig from './config.mjs';

/** @type {winston.Logger} */
let logger;
const level = _.get(getConfig(), 'logging.level');

/**
 * @return {winston.Logger} -
 */
const makeLogger = () =>
  winston.createLogger({
    level,
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
  });

/**
 * @return {winston.Logger} -
 */
const getLogger = (meta) => {
  if (!logger)
    logger = makeLogger();

  return logger.child(meta);
}

export default getLogger;
