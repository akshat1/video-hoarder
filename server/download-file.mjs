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

const ytdlDownload = ({ item, onProgress }) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const { url } = item;
      // Async func inside a promise because we don't want to resolve until close event occurs.
      const dirName = path.join(process.cwd(), config.downloadLocation, await getFileName(url));
      logger.debug(`dirName := ${dirName}`);
      await prepareLocation(dirName);
      logger.debug(`exec: youtube-dl ${getArgs(url, dirName).join(' ')}`);
      const prcs = spawn('youtube-dl', getArgs(url, dirName), { detached: true, cwd: dirName });
      prcs.on('close', () => {
        logger.debug(`[[Done with ${item.id}]]`);
        resolve();
      });

      const onData = (output) => onProgress({
        id: item.id,
        output
      });

      prcs.stdout.on('data', onData);
      prcs.stderr.on('data', onData);
    } catch (err) {
      logger.debug('Error occurred', err);
      reject(err);
    }
  });

export default ytdlDownload;
