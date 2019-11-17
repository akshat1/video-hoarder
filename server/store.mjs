/**
 * We have a store on the server side as a stand-in for a db layer. This thing lets us pass task-ids around instead of
 * the task. This useful for situations where we might have partial task data (for instance, initially, we only have
 * the task url, not the title).
 *
 * Might replace this with a persistant system in the future.
 */
import md5 from 'blueimp-md5';
import Status from '../common/status.mjs';

const makeTask = url => ({
  added: Date.now(),
  id: md5(url),
  status: Status.pending,
  title: url,
  url
});

/**
 * @const {Map.<string, Task}>
 */
const tasks = new Map();

/**
 * @const {Map.<string, string[]>}
 */
const outputMap = new Map();

/**
 * Adds a new task to the store, returns the task-id, and emits a task-added event on the bus.
 * @param {string} url -
 * @returns {string} - the task-id
 */
export const addTask = url => {
  const task = makeTask(url);
  tasks.set(task.id, task);
  return task.id;
}

/**
 * @param {string} taskId -
 * @returns {Task} -
 */
export const getTask = id => tasks.get(id);

/**
 * We have this so that we can change our id generation to some other system (instead of md5) in the future.
 * @param {string} url -
 * @returns {string} -
 */
export const getTaskId = url => md5(url);

export const appendTaskOutput = (id, outputChunk) => {
  let outputList = outputMap.get(id);
  if (!outputList) {
    outputList = [];
    outputMap.set(id, outputList);
  }

  outputList.push(outputChunk);
};

export const remove = (id) => {
  tasks.delete(id);
  outputMap.delete(id);
};

export const all = () => Array.from(tasks.values());

export const filter = fn => all().filter(fn);
