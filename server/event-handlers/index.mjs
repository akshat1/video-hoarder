import * as Event from '../../common/event.mjs';
import assert from 'assert';
import getConfig from '../config.mjs';
import getLogger from '../../common/logger.mjs';
import getOnProgress from './on-progress.mjs';
import getOnTaskAdded from './on-task-added.mjs';
import makeTaskManager from '../task-manager.mjs';
import ytdlDownload from '../download-file.mjs';

// TODO: Keep a separate queue of more fully-fledged tasks here; task manager should keep very minimal info.
// for the time being, we'll map queue before sending it down.


const logger = getLogger({ module: 'event-handlers' });

// Real dirty deeds now. This WILL lead to a memory leak.
// Need to set-up a system of max number of items (because I don't want to implement a least recent type cache).
const outputBuffer = {};
const config = getConfig();

const onConnection = async ({ io, socket, onProgress, taskMan }) => {  
  logger.debug('bootstrap');
  socket.emit(Event.ClientBootstrap, { tasks: taskMan.getQueue() });
  logger.debug('wireAllEvents');
  const onTaskAdded = getOnTaskAdded({ taskMan, onProgress });
  socket.on(Event.TaskAdded, onTaskAdded);

  socket.on(Event.ClientLeave, ({ id }) => {
    assert.equal(typeof id, 'string', 'ClientLeave event missing id');
    socket.leave(id);
  });

  socket.on(Event.ClientJoin, ({ id }) => {
    assert.equal(typeof id, 'string', 'ClientJoin event missing id');
    logger.debug('ClientJoin', id);
    socket.join(id);
    socket.emit(Event.ClientNSpaceBootstrap, {
      id,
      output: outputBuffer[id]
    });
  });

  // This only works because we have a single user. If we ever have multiple users then
  // this would get rather awkward as one user could clear the queue for everyone else.
  socket.on(Event.ClearQueue, () => {
    const clearedIDs = taskMan.clearQueue();
    clearedIDs.forEach(id => delete outputBuffer[id]);
    io.emit(Event.QueueUpdated, taskMan.getQueue());
  });
}

const bootstrapApp = io => {
  const onProgress = getOnProgress({ outputBuffer, io });
  const taskMan = makeTaskManager(Object.assign(
    config.taskManager, { processOne: (item) => ytdlDownload({ item, onProgress }) }
  ));
  taskMan.on(Event.QueueUpdated, () => io.emit(Event.QueueUpdated, taskMan.getQueue()));
  taskMan.on(Event.TaskStatusChanged, task => io.emit(Event.TaskStatusChanged, task));

  // Wire-up each client as it connects.
  io.on('connection', (socket) => {
    logger.debug('socket connected');
    onConnection({ io, socket, onProgress, taskMan });
  });
}

export default bootstrapApp;
