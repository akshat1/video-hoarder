import * as childProcess from 'child_process';
import * as Event from '../common/event.mjs';
import assert from 'assert';
import getConfig from './config.mjs';
import getLogger from '../common/logger.mjs';
import makeTaskManager from './task-manager.mjs';
import md5 from 'blueimp-md5';
import { promisify } from 'util';
import ytdlDownload from './download-file.mjs';

// TODO: Keep a separate queue of more fully-fledged tasks here; task manager should keep very minimal info.
// for the time being, we'll map queue before sending it down.

const execFile = promisify(childProcess.execFile);
const logger = getLogger({ module: 'event-handlers' });

// Real dirty deeds now. This WILL lead to a memory leak.
// Need to set-up a system of max number of items (because I don't want to implement a least recent type cache).
const outputBuffer = {};
const config = getConfig();
// See https://www.debuggex.com/r/vNKARIImtRAYy5bX
const progressPattern = /([0-9|.]+)%\s+of\s+([0-9|.]+)(\w+)\s+at\s+([0-9|.]+)([\w|/]+)\s+ETA ([0-9|:]+)/;
const onConnection = async ({ socket, io }) => {
  let taskMan;
  const onProgress = ({ id, output: buff }) => {
    const output = buff.toString().replace(/\r/, '\n');
    assert.equal(typeof id, 'string', 'onProgress missing id');
    logger.debug(`Progress for ${id}`);
    if (!outputBuffer[id])
      outputBuffer[id] = [];
    
    const opBuff = outputBuffer[id];
    opBuff.push(output);
    const matches = output.match(progressPattern);
    const stats = {
      downloadedPercent: 0,
      downloadETA: 'Unknown',
      downloadSpeed: 'Unknown',
      totalSize: 'Unknown'
    };
    if (matches && matches[0]) {
      stats.downloadedPercent = Number(matches[1]);
      stats.totalSize = `${matches[2]}${matches[3]}`;
      stats.downloadSpeed = `${matches[4]}${matches[5]}`;
      stats.downloadETA = matches[6];
    }
    io.to(id).emit(Event.TaskProgress, {
      id,
      output,
      stats
    });
  }

  taskMan = makeTaskManager(Object.assign(
    config.taskManager, { processOne: (item) => ytdlDownload({ item, taskMan, io, onProgress }) }
  ));

  const getQueue = () => taskMan.getQueue()
    .map(item =>
      item.stats ? item : Object.assign(item, { stats: { downloadPercent: 50, totalSize: '64.89MiB', downloadSpeed: '2.18MiB/s', downloadETA: '00:29' } }))

  const onTaskAdded = async ({ url }) => {
    logger.debug('TaskAdded');
    const foo = await execFile('youtube-dl', ['--get-title', url]);
    const title = foo.stdout.toString();
    taskMan.addToQueue(url, title);
    onProgress({ id: md5(url), output: 'Added to queue\n' });
  };

  taskMan.on(Event.QueueUpdated, () => io.emit(Event.QueueUpdated, getQueue()));
  taskMan.on(Event.TaskStatusChanged, task => io.emit(Event.TaskStatusChanged, task));

  logger.debug('bootstrap');
  socket.emit(Event.ClientBootstrap, { tasks: getQueue() });
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
