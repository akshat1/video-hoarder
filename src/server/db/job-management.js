import { db, stub, Collection, getCollection, insert } from './util.js';
import { Status } from '../../Status.js';

const {
  Jobs,
} = Collection;

/**
 * This will emit 'ItemAdded' event.
 * @func
 * @param {Item} item - An item object complete with ID etc. created by the server API from client supplied partial information.
 * @returns {Promise}
 */
export const addJob = async (item) => {
  const jobs = getCollection(db, Jobs);
  return insert(jobs, {
    ...item,
    status: Status.Pending,
  });
};

/**
 * This will emit 'ItemUpdated' event.
 * @func
 * @param {string} itemId
 * @returns {Promise}
 */
export const cancelJob = stub('cancelTask');

/**
 * This will emit 'ItemRemoved' event.
 * @func
 * @param {string} itemId
 * @returns {Promise}
 */
export const removeJob = stub('removeTask');

/**
 * @func
 * @param {string} itemId
 * @returns {Promise<Item>}
 */
export const getJob = stub('getTask');

/**
 * @func
 * @param {string} userName
 * @returns {Promise<Item[]>}
 */
export const getJobsForUser = stub('getTasksForUser');
