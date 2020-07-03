import { Event } from "../../Event.js";
import { getLogger } from "../../logger.js";
import { makeItem } from "../../model/Item.js";
import { Status } from "../../Status.js";
import { emit } from "../event-bus.js";
import { find, findOne, getJobsCollection,insert, remove, update } from "./util.js";

const rootLogger = getLogger("job-management");

/**
 * This will emit 'ItemAdded' event.
 * @func
 * @memberof module:server/db
 * @param {Object} args -
 * @param {string} args.url - url to be downloaded
 * @param {string} args.addedBy - userName of the user adding this task.
 * @returns {Promise<Item>}
 */
export const addJob = async ({ addedBy, url }) => {
  const item = makeItem({ url, addedBy });
  const jobs = await getJobsCollection()
  const newJob = await insert(jobs, item, { w: 1 });
  emit(Event.ItemAdded, newJob);
  return newJob;
};

/**
 * @func
 * @memberof module:server/db
 * @param {string} id
 * @returns {Promise<Item>}
 */
export const getJob = async (id) => {
  const jobs = await getJobsCollection()
  return findOne(jobs, { id });
}

/**
 * This will emit 'ItemUpdated' event.
 * @func
 * @memberof module:server/db
 * @param {Object} args
 * @param {string} args.id
 * @param {string} args.updatedBy
 * @returns {Promise<Item>}
 */
export const cancelJob = async ({ id, updatedBy }) => {
  const logger = getLogger("cancelJob", rootLogger);
  logger.debug("Cancelling", id);
  const item = await getJob(id);
  logger.debug("Found", item);
  /* istanbul ignore else */
  if (item) {
    const jobs = await getJobsCollection()
    const updatedItem = {
      ...item,
      status: Status.Failed,
      updatedAt: new Date().toISOString(),
      updatedBy: updatedBy,
    };
    const [numUpdatedRecords, opStatus] = await update(jobs, { id }, updatedItem);
    logger.debug("Updated job", { numUpdatedRecords, opStatus });
    /* istanbul ignore else */
    if (numUpdatedRecords === 1) {
      logger.debug("Emit bus event for ItemUpdated");
      emit(Event.ItemUpdated, updatedItem);
      return updatedItem;
    } else {
      logger.error("Something went wrong in the update", {
        numUpdatedRecords,
        opStatus,
      });
    }
  } else {
    logger.warn(`Job ${id} not found. Ignoring call.`);
  }
};

/**
 * Mark an item failed and associate the given error with it.
 *
 * @param {Object} args
 * @param {Item} args.item
 * @param {string} args.errorMessage
 * @return {Promise}
 */
export const failJob = async ({ errorMessage, item }) => {
  const logger = getLogger("failJob", rootLogger);
  const { id } = item;
  const jobs = await getJobsCollection();
  logger.debug("Got jobs collection", !!jobs);
  const updatedItem = {
    ...item,
    status: Status.Failed,
    updatedAt: new Date().toISOString(),
    errorMessage,
  };
  logger.debug("Update to", updatedItem);
  const [numUpdatedRecords, opStatus] = await update(jobs, { id }, updatedItem);

  if (numUpdatedRecords === 1) {
    emit(Event.ItemUpdated, updatedItem);
    return updatedItem;
  } else {
    logger.error("Something went wrong in the update", {
      numUpdatedRecords,
      opStatus,
    });
  }
};

/**
 * Associate the given metadata with the given item.
 * @param {Object} args
 * @param {ItemMetadata} args.metadata
 * @param {Item} args.item
 */
export const addMetadata = async (args) => {
  const logger = getLogger("addMetadata", rootLogger);
  logger.debug("begin", args);
  const { item, metadata } = args;
  const { id } = item;
  const jobs = await getJobsCollection();
  const updatedItem = {
    ...item,
    updatedAt: new Date().toISOString(),
    metadata,
  };
  logger.debug("Update to", updatedItem);
  const [numUpdatedRecords, opStatus] = await update(jobs, { id }, updatedItem);

  if (numUpdatedRecords === 1) {
    emit(Event.ItemUpdated, updatedItem);
    return updatedItem;
  } else {
    logger.error("Something went wrong in the update", {
      numUpdatedRecords,
      opStatus,
    });
  }
};

/**
 * Mark a job as complete.
 * @param {Item} item
 * @returns {Promise}
 */
export const completeJob = async (item) => {
  const logger = getLogger("completeJob", rootLogger);
  logger.debug(item);
  const { id } = item;
  const jobs = await getJobsCollection();
  logger.debug("Got jobs collection", !!jobs);
  const updatedItem = {
    ...item,
    status: Status.Succeeded,
    updatedAt: new Date().toISOString(),
  };
  logger.debug("Update to", updatedItem);
  const [numUpdatedRecords, opStatus] = await update(jobs, { id }, updatedItem);

  if (numUpdatedRecords === 1) {
    emit(Event.ItemUpdated, updatedItem);
    return updatedItem;
  } else {
    logger.error("Something went wrong in the update", {
      numUpdatedRecords,
      opStatus,
    });
  }
}

/**
 * This will emit 'ItemRemoved' event.
 * @func
 * @memberof module:server/db
 * @param {Object} args
 * @param {string} args.id
 * @returns {Promise}
 */
export const removeJob = async (id) => {
  const logger = getLogger("removeJob", rootLogger);
  const item = await getJob(id);
  /* istanbul ignore else */
  if (item) {
    const jobs = await getJobsCollection()
    const numRecordsRemoved = await remove(jobs, { id });
    /* istanbul ignore if */
    if (numRecordsRemoved !== 1) {
      logger.error("Something went wrong in remove()", {
        numUpdatedRecords: numRecordsRemoved,
      });
    }
    emit(Event.ItemRemoved, item);
    return numRecordsRemoved;
  } else {
    logger.warn(`Job ${id} not found. Ignoring call.`);
  }
}


/**
 * Find jobs filtered by this query.
 *
 * @func
 * @memberof module:server/db
 * @param {Query} [query]
 * @returns {Promise<Cursor[]>}
 */
export const getJobs = async (query) => {
  const jobs = await getJobsCollection()
  return find(jobs, query);
};

/**
 * Find jobs added by this user filtered by this query.
 *
 * @func
 * @memberof module:server/db
 * @param {string} userName
 * @param {Query} [query]
 * @returns {Promise<Cursor[]>}
 */
export const getJobsForUser = async (userName, query = {}) => {
  return getJobs({ ...query, addedBy: userName });
};


