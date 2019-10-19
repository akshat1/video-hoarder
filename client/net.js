import * as Event from '../common/event.mjs';
import { appendTaskOutput, SetSelectedTaskId, setTaskOutput, updateQueue, updateTaskStats } from './redux/actions';
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

  socket.on(Event.ClientNSpaceBootstrap, ({ output }) => {
    store.dispatch(setTaskOutput(output));
  });

  // TODO: match id for sanity?
  socket.on(Event.TaskProgress, ({ id, output, stats }) => {
    store.dispatch(appendTaskOutput(output));
    store.dispatch(updateTaskStats(id, stats));
  });
}

const isValidTaskId = id => typeof id === 'string';

export const socketMiddleware = store =>
  next =>
    action => {
      if (action.type === SetSelectedTaskId && isValidTaskId(store.getState().selectedTaskId)) {
        logger.debug(`Leave ${store.getState().selectedTaskId}`);
        getClient().emit(Event.ClientLeave, { id: store.getState().selectedTaskId });
      }
      next(action);
      
      if (action.type === SetSelectedTaskId && isValidTaskId(store.getState().selectedTaskId)) {
        logger.debug(`Join ${store.getState().selectedTaskId}`);
        getClient().emit(Event.ClientJoin, { id: store.getState().selectedTaskId });
      }
    }

export default wireSocketToStore;
