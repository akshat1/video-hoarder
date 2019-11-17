import * as Event from '../../common/event.mjs';
import * as Store from '../store.mjs';
import getLogger from '../../common/logger.mjs';
import { enqueue } from '../task-queue.mjs';
import * as EventBus from '../event-bus.mjs';
import Status from '../../common/status.mjs';

const logger = getLogger({ module: 'event-handlers' });

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
