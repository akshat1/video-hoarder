import _ from 'lodash';
import { downloadFile, getTitle } from '../ytdl.mjs';
import * as Event from '../../common/event.mjs';
import * as EventBus from '../event-bus.mjs';
import * as Store from '../store.mjs';
import getConfig from '../config.mjs';
import getLogger from '../../common/logger.mjs';
import TaskQueue from '../task-queue.mjs';
import Status from '../../common/status.mjs';

const logger = getLogger({ module: 'event-handlers' });

const downloadQueue = new TaskQueue({
  batchSize: _.get(getConfig(), 'taskManager.batchSize'),
  processOne: downloadFile
});

const metadataQueue = new TaskQueue({
  batchSize: 10,
  processOne: getTitle
});

const enqueue = (id) => {
  downloadQueue.enqueue(id);
  metadataQueue.enqueue(id);
}

const onTaskAdded = ({ url }) => {
  const id = Store.addTask(url);
  enqueue(id);
  logger.debug({
    id,
    message: 'task added',
    url
  });
  EventBus.emit(Event.QueueUpdated);
}

const onTaskAborted = payload => EventBus.emit(Event.AbortTask, payload)

const onClearQueue = () => {
  logger.debug('onClearQueue');
  Store.filter(({ status }) => status !== Status.pending && status !== Status.running)
    .map(({ id }) => id)
    .forEach(Store.remove);
  EventBus.emit(Event.QueueUpdated);
}

const bootstrapApp = io => {
  EventBus.subscribe(Event.QueueUpdated, () => io.emit(Event.QueueUpdated, Store.all()));
  EventBus.subscribe(Event.TaskStatusChanged, ({ id }) => io.emit(Event.TaskStatusChanged, Store.getTask(id)));
  EventBus.subscribe(Event.TaskProgress, ({ id, output }) =>
    io.emit(
      Event.TaskProgress, {
        id,
        output,
        stats: {}
      }));

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on(Event.TaskAdded, onTaskAdded);
    socket.on(Event.AbortTask, onTaskAborted);
    socket.on(Event.ClearQueue, onClearQueue);
    socket.emit(Event.QueueUpdated, Store.all());
  });
}

export default bootstrapApp;
