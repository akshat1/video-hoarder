import * as childProcess from 'child_process';
import * as Event from '../common/event.mjs';
import assert from 'assert';
import getConfig from './config.mjs';
import getLogger from '../common/logger.mjs';
import makeTaskManager from './task-manager.mjs';
import md5 from 'blueimp-md5';
import { promisify } from 'util';
import ytdlDownload from './download-file.mjs';

const execFile = promisify(childProcess.execFile);
const logger = getLogger({ module: 'event-handlers' });

// Real dirty deeds now. This WILL lead to a memory leak.
// Need to set-up a syetem of max number of items (because I don't want to implement a least recent type cache).
const outputBuffer = {};
const config = getConfig();

const onConnection = async ({ socket, io }) => {
  let taskMan;
  const onProgress = ({ id, output: buff }) => {
    const output = buff.toString();
    assert.equal(typeof id, 'string', 'onProgress missing id');
    logger.debug(`Progress for ${id}`);
    if (!outputBuffer[id]) 
      outputBuffer[id] = [];
    

    const opBuff = outputBuffer[id];
    opBuff.push(output);
    io.to(id).emit(Event.TaskProgress, {
      id,
      output
    });
  }

  taskMan = makeTaskManager(Object.assign(
    config.taskManager, { processOne: (item) => ytdlDownload({ item, taskMan, io, onProgress }) }
  ));

  const onTaskAdded = async ({ url }) => {
    logger.debug('TaskAdded');
    const foo = await execFile('youtube-dl', ['--get-title', url]);
    const title = foo.stdout.toString();
    taskMan.addToQueue(url, title);
    onProgress({ id: md5(url), output: 'Added to queue\n' });
  };

  taskMan.on(Event.QueueUpdated, () => io.emit(Event.QueueUpdated, taskMan.getQueue()));
  taskMan.on(Event.TaskStatusChanged, task => io.emit(Event.TaskStatusChanged, task));

  logger.debug('bootstrap');
  socket.emit(Event.ClientBootstrap, { tasks: taskMan.getQueue() });
  logger.debug('wireAllEvents');
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
}

const bootstrapApp = io => {
  // Wire-up each client as it connects.
  io.on('connection', (socket) => {
    logger.debug('socket connected');
    onConnection({ socket, io });
  });
}

export default bootstrapApp;
