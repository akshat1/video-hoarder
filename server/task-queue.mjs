import _ from 'lodash';
import getConfig from './config.mjs';
import { downloadFile as processOne } from './download-file.mjs';

const batchSize = _.get(getConfig(), 'taskManager.batchSize');
const pending = [];
let inFlight = 0;

const processQueue = async () => {
  let taskId;
  while ((taskId = pending.shift()) && inFlight++ <= batchSize)
    processOne(taskId).then(processQueue);
};

export const enqueue = (taskId) => {
  pending.push(taskId);
  processQueue();
};
