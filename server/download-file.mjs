import { promisify } from 'util';
import * as childProcess from 'child_process';
import fs from 'fs';
import getConfig from './config.mjs';
import getLogger from '../common/logger.mjs';
import path from 'path';

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
 * @param {Object} args -
 * @param {function} args.onError -
 * @param {function} args.onProgress -
 * @param {function} args.onSuccess -
 * @param {string} args.taskId -
 * @param {string} args.url -
 * @returns {FileDownload} -
 */
export const downloadFile = async (args) => {
  try {
    const {
      onError,
      onProgress,
      onSuccess,
      taskId,
      url
    } = args;

    const dirName = path.join(process.cwd(), config.downloadLocation, await getFileName(url));
    logger.debug(`dirName := ${dirName}`);
    await prepareLocation(dirName);
    logger.debug(`exec: youtube-dl ${getArgs(url, dirName).join(' ')}`);
    const prcs = spawn('youtube-dl', getArgs(url, dirName), { detached: true, cwd: dirName });
    prcs.on('error', (err) => {
      logger.error({
        err,
        message: 'Process error',
        taskId
      });
      onError(err);
    });

    prcs.on('exit', (code, signal) => {
      logger.debug({
        code,
        message: 'Process complete',
        signal,
        taskId
      });

      if (code)
        onError(new Error(`YouTubeDL exited with code ${code} // ${signal}`));
      else
        onSuccess();
    });

    const onData = (outputBuff) => {
      const output = outputBuff.toString();
      logger.debug({
        message: 'Process output',
        output,
        taskId
      });
      onProgress(output);
    };

    prcs.stdout.on('data', onData);
    prcs.stderr.on('data', onData);

    return {
      abort: () => prcs.kill()
    };
  } catch (err) {
    logger.error({
      err,
      message: 'caught error'
    });
    args.onError && args.onError(err);
  }
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
