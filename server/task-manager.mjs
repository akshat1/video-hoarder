import * as Events from '../common/event.mjs';
import EventEmitter from 'events';
import getLogger from '../common/logger.mjs';
import Status from '../common/status.mjs';
import md5 from 'blueimp-md5';

const logger = getLogger({ module: 'event-handlers' });

const makeTaskManagerInner = (args) => {
  const {
    processOne,
    batchSize = 3,
    maxDoneSize = 20,
    maxPendingSize = 50
  } = args;

  const eventEmitter = new EventEmitter();
  const done = [];
  const queue = [];
  let nextIsRunning = false;
  const inFlight = new Set();

  const markDone = (item, err) => {
    logger.debug('markDone', item.url);
    inFlight.delete(item);
    queue.splice(queue.indexOf(item), 1);
    item.status = err ? Status.failed : Status.complete;
    if (err)
      item.error = err.message;
    item.finished = Date.now();
    done.push(item);
    while(done.length >= maxDoneSize)
      done.unshift();
    eventEmitter.emit(Events.TaskStatusChanged, item);
  }

  const processSingleItem = async (item) => {
    inFlight.add(item);
    logger.debug('Going to process', item.url);
    item.status = Status.running;
    eventEmitter.emit(Events.TaskStatusChanged, item);
    try {
      await processOne(item);
      logger.debug('Markdone');
      markDone(item);
    } catch (err) {
      logger.debug('Markdone with error', err);
      markDone(item, err);
    }
  }

  const next = () => {
    logger.debug('next')
    if (!nextIsRunning) {
      logger.debug('...');
      nextIsRunning = true;
      while (inFlight.size < batchSize) {
        // Find the first item that is not already in flight.
        const item = queue.find(item => item.status === Status.pending);
        if (!item)
          break;
        processSingleItem(item).then(() => setTimeout(next));
      }
      nextIsRunning = false;
    }
    logger.debug('txen');
  }

  const getQueue = () => {
    const result = [
      ...done,
      ...queue
    ]
    logger.debug({
      cPos: 'getQueue',
      queue
    });
    return result;
  }

  const addToQueue = (url, title) => {
    logger.debug('addToQueue', url);
    if (queue.length >= maxPendingSize) 
      throw new Error('Max queue size reached');
    

    if(queue.find(item => item.url === url)) {
      logger.debug('duplicate. ignore.');
      return;
    }

    const item = {
      added : Date.now(),
      id    : md5(url),
      status: Status.pending,
      title,
      url
    };
    queue.push(item);
    eventEmitter.emit(Events.QueueUpdated, item);
    next();
  }

  const clearQueue = () => {
    const cleared = done.map(({ id }) => id);
    done.length = 0;
    logger.info({ message: 'clearQueue', cleared });
    return cleared;
  }

  return {
    addToQueue,
    clearQueue,
    getQueue,
    on: (...args) => eventEmitter.on(...args),
  };
};

let instance;

const makeTaskManager = (args) => {
  if (!instance) 
    instance = makeTaskManagerInner(args);
  

  return instance;
}

export default makeTaskManager;
