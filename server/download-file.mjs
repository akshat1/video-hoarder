import { promisify } from 'util';
import * as childProcess from 'child_process';
import fs from 'fs';
import getConfig from './config.mjs';
import getLogger from '../common/logger.mjs';
import path from 'path';
import * as Store from './store.mjs';
import * as EventBus from './event-bus.mjs';
import Status from '../common/status.mjs';
import * as Event from '../common/event.mjs';

const logger = getLogger({ module: 'download-file' });

const { spawn } = childProcess;
const execFile = promisify(childProcess.execFile);
const mkdir = promisify(fs.mkdir);
const config = getConfig();

const getArgs = url => [
  ...config['youtube-dl'],
  '--config-location',
  path.resolve(process.cwd(), 'youtube-dl.conf'),
  url
];

// figure out download target on the FS.
// mkdir -p that download target.
// try to cd into that location and then download.

const getFileName = async url => {
  const fileName = (await execFile('youtube-dl', ['--get-filename', url])).stdout.toString();
  return path.basename(fileName, path.extname(fileName));
}

const prepareLocation = dirName =>
  mkdir(dirName, { recursive: true });

/**
 * @callback onSuccess
 */

/**
 * @callback onError
 * @param {Error} err
 */

/**
 * @callback onProgress
 * @param {string} output
 */

/**
 * @typedef {Object} FileDownload -
 * @property {function} abort -
 */

/**
 * @param {string} id - the task id
 * @returns {Promise} -
 */
export const downloadFile = async (id) => {
  const task = Store.getTask(id);
  const { url } = task;

  getTitle(url)
    .then((title) => {
      task.title = title;
      EventBus.emit(Event.TaskStatusChanged, { id });
    });

  const dirName = path.join(process.cwd(), config.downloadLocation, await getFileName(url));
  logger.debug(`dirName := ${dirName}`);
  await prepareLocation(dirName);

  return new Promise((resolve) => {
    logger.debug(`exec: youtube-dl ${getArgs(url, dirName).join(' ')}`);
    const prcs = spawn('youtube-dl', getArgs(url, dirName), { detached: true, cwd: dirName });

    const onAbort = (payload) => {
      if (payload.id === id) {
        prcs.kill();
        EventBus.unsubscribe(Event.AbortTask, onAbort);
      }
    };

    const onError = (err) => {
      logger.error({
        err,
        id,
        message: 'Download process error'
      });
      task.status = Status.failed;
      EventBus.emit(Event.TaskStatusChanged, { id });
      EventBus.unsubscribe(Event.AbortTask, onAbort);
      resolve();
    };

    const onSuccess = () => {
      task.status = Status.complete;
      EventBus.emit(Event.TaskStatusChanged, { id });
      EventBus.unsubscribe(Event.AbortTask, onAbort);
      resolve();
    }

    prcs.on('error', onError);

    prcs.on('exit', (code, signal) => {
      logger.debug({
        code,
        message: 'Process complete',
        signal,
        id
      });

      if (code || signal)
        onError(new Error(`YouTubeDL exited with code ${code} // ${signal}`));
      else
        onSuccess();
    });

    const onData = (outputBuff) => {
      const output = outputBuff.toString();
      logger.debug({
        message: 'Process output',
        output,
        id
      });
      Store.appendTaskOutput(id, output);
      if (task.status === Status.pending) {
        task.status = Status.running;
        EventBus.emit(Event.TaskStatusChanged, { id });
      }

      EventBus.emit(Event.TaskProgress, { id, output });
    };

    prcs.stdout.on('data', onData);
    prcs.stderr.on('data', onData);
    EventBus.subscribe(Event.AbortTask, onAbort);
  });
}

/**
 * @param {string} url -
 * @returns {Promise.<string>} - title obtained using youtube-dl --get-title
 * @throws {Error} - if youtube-dl emits anything in the stdErr.
 */
export const getTitle = async (url) => {
  logger.debug('TaskAdded');
  const foo = await execFile('youtube-dl', ['--get-title', url]);
  if (foo.stderr.length)
    throw new Error(foo.stderr.toString());

  return foo.stdout.toString();
};
