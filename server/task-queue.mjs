import _ from 'lodash';
import getConfig from './config.mjs';
import * as Store from './store.mjs';
import { downloadFile } from './download-file.mjs';
import Status from '../common/status.mjs';
import * as Event from '../common/event.mjs';
import getLogger from '../common/logger.mjs';
import * as EventBus from './event-bus.mjs';

const logger = getLogger({ module: 'task-queue' });
const batchSize = _.get(getConfig(), 'taskManager.batchSize');
const pending = [];
let inFlight = 0;

const processOne = (taskId) =>
  new Promise((resolve) => {
    const task = Store.getTask(taskId);
    const onError = () => {
      task.status = Status.failed;
      EventBus.emit(Event.TaskStatusChanged, { id: taskId });
      resolve();
    };

    const onProgress = (output) => {
      Store.appendTaskOutput(taskId, output);
      if (task.status === Status.pending) {
        task.status = Status.running;
        EventBus.emit(Event.TaskStatusChanged, { id: taskId });
      }

      EventBus.emit(Event.TaskProgress, { id: taskId, output });
    };

    const onSuccess = () => {
      task.status = Status.complete;
      EventBus.emit(Event.TaskStatusChanged, { id: taskId });
      resolve();
    }

    const download = downloadFile({
      onError,
      onProgress,
      onSuccess,
      url: task.url
    });

    const onAbort = ({ id }) => {
      logger.info({
        id,
        message: 'Abort Task'
      });
      download.abort();
    };

    EventBus.once(Event.AbortTask, onAbort);
  });

const processQueue = async () => {
  let taskId;
  while ((taskId = pending.shift()) && inFlight++ <= batchSize) {
    console.log(taskId);
    processOne(taskId).then(processQueue);
  }
};

export const enqueue = (taskId) => {
  pending.push(taskId);
  processQueue();
};
