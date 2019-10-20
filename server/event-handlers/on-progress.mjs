import * as Event from '../../common/event.mjs';
import assert from 'assert';
import getLogger from '../../common/logger.mjs';

const logger = getLogger({ module: 'event-handlers/on-progress' });

// See https://www.debuggex.com/r/vNKARIImtRAYy5bX
const progressPattern = /([0-9|.]+)%\s+of\s+([0-9|.]+)(\w+)\s+at\s+([0-9|.]+)([\w|/]+)\s+ETA ([0-9|:]+)/;
const completionPattern = /([0-9|.]+)%\s+of\s+([0-9|.]+)(\w+)\s+in\s+([0-9|:]+)/;

const getOnProgress = ({ outputBuffer, io}) =>
  ({ id, output: buff }) => {
    const output = buff.toString().replace(/\r/, '\n');
    assert.equal(typeof id, 'string', 'onProgress missing id');
    logger.debug(`Progress for ${id}`);
    if (!outputBuffer[id])
      outputBuffer[id] = [];
    
    const opBuff = outputBuffer[id];
    opBuff.push(output);
    let matches = output.match(progressPattern);
    const stats = {
      downloadedPercent: 0,
      downloadETA: 'Unknown',
      downloadSpeed: 'Unknown',
      totalSize: 'Unknown',
      timeTaken: ''
    };

    // Most messages are about download progress.
    if (matches && matches[0]) {
      stats.downloadedPercent = Number(matches[1]);
      stats.totalSize = `${matches[2]}${matches[3]}`;
      stats.downloadSpeed = `${matches[4]}${matches[5]}`;
      stats.downloadETA = matches[6];
    } else {
      // Other messages are about completion.
      matches = output.match(completionPattern);
      if (matches && matches[0]) {
        stats.downloadedPercent = Number(matches[1]);
        stats.totalSize = `${matches[2]}${matches[3]}`;
        stats.timeTaken = matches[4];
      } else
        // And then there might be messages that we just couldn't parse.
        logger.error(`Could not parse >${output}<`);
    }

    /* Is broadcasting every task's output to every client a recipe for disaster? For a multi-user
    environment, I would have said yes. But this application is targeted towards a single user.
    Let's give this a shot and we can solve any problems when they actually arise. */
    io.emit(Event.TaskProgress, {
      id,
      output,
      stats
    });
  };

export default getOnProgress;
