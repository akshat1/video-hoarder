import { promisify } from 'util';
import * as childProcess from 'child_process';
import getLogger from '../../common/logger.mjs';
import md5 from 'blueimp-md5';

const logger = getLogger({ module: 'event-handlers/on-task-added' });
const execFile = promisify(childProcess.execFile);

const getOnTaskAdded = ({ taskMan, onProgress }) =>
  async ({ url }) => {
    logger.debug('TaskAdded');
    const foo = await execFile('youtube-dl', ['--get-title', url]);
    const title = foo.stdout.toString();
    taskMan.addToQueue(url, title);
    onProgress({ id: md5(url), output: 'Added to queue\n' });
  };

export default getOnTaskAdded;
