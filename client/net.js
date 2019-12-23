import { updateQueue, updateTaskOutput, updateTaskStats } from './redux/actions';
import * as Event from '../common/event.mjs';
import getClient from './io-client';
import getLogger from '../common/logger.mjs';

const logger = getLogger({ module: 'net' });

/**
 * 
 * @param {SocketIO} socket -
 * @param {import('redux').Store} store -
 */
const wireSocketToStore = ({ store }) => {
  const socket = getClient();
  socket.on(Event.QueueUpdated, (queue) => {
    logger.debug('Queue Updated');
    store.dispatch(updateQueue(queue));
  });

  socket.on(Event.TaskStatusChanged, (updatedTask) => {
    logger.debug('Task Status Changed');
    const tasks = [
      ...store.getState().tasks.filter(({ id }) => id !== updatedTask.id),
      updatedTask
    ]

    store.dispatch(updateQueue(tasks));
  });

  socket.on(Event.ClientBootstrap, ({ tasks }) => {
    store.dispatch(updateQueue(tasks))
  });

  socket.on(Event.ClientNSpaceBootstrap, ({ id, output }) => {
    store.dispatch(updateTaskOutput(id, output));
  });

  // TODO: match id for sanity?
  socket.on(Event.TaskProgress, (args) => {
    const { id, output, stats, multi } = args;
    if (multi)
      store.dispatch(updateTaskOutput({ multi }));
    else
      store.dispatch(updateTaskOutput({ id, output }));
    store.dispatch(updateTaskStats(id, stats));
  });
}

export const socketMiddleware = () =>
  next =>
    action => {
      next(action);
    }

export default wireSocketToStore;
