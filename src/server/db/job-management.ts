import { Event } from "../../Event";
import { getLogger } from "../../logger";
import { Item, ItemMetadata,makeItem, markItemCanceled,markItemFailed,markItemSuccessful, setMetadata } from "../../model/Item";
import { emit } from "../event-bus";
import { find, findOne, getJobsCollection,insert, remove, update } from "./util";
import { Cursor,Query } from "tingodb";

const rootLogger = getLogger("job-management");

/**
 * This will emit 'ItemAdded' event.
 * @param args.url - url to be downloaded
 * @param args.createdBy - userName of the user adding this task.
 */
export const addJob = async (args: { url: string, createdBy: string }): Promise<Item> => {
  const { createdBy, url } = args;
  const item = makeItem({ url, createdBy });
  const jobs = await getJobsCollection()
  const newJob = (await insert(jobs, item, { w: 1 }))[0];
  emit(Event.ItemAdded, newJob);
  return newJob;
};

export const getJob = async (id: string): Promise<Item> => {
  const jobs = await getJobsCollection()
  return findOne(jobs, { id });
}

/**
 * This will emit 'ItemUpdated' event.
 */
export const cancelJob = async (args: { id: string, updatedBy: string }): Promise<Item> => {
  const { id, updatedBy } = args;
  const logger = getLogger("cancelJob", rootLogger);
  logger.debug("Cancelling", id);
  const item = await getJob(id);
  logger.debug("Found", item);
  /* istanbul ignore else */
  if (item) {
    const jobs = await getJobsCollection()
    const updatedItem = markItemCanceled({ item, updatedBy });
    // @ts-ignore
    const { count, status } = await update(jobs, { id }, updatedItem);
    logger.debug("Updated job", { count, status });
    /* istanbul ignore else */
    if (count === 1) {
      logger.debug("Emit bus event for ItemUpdated");
      emit(Event.ItemUpdated, {
        previous: item,
        item: updatedItem,
      });
      return updatedItem;
    } else {
      logger.error("Something went wrong in the update", {
        count,
        status,
      });
    }
  } else {
    logger.warn(`Job ${id} not found. Ignoring call.`);
  }
};

/**
 * Mark an item failed and associate the given error with it.
 */
export const failJob = async (args: { errorMessage: string, item: Item }): Promise<Item> => {
  const { errorMessage, item } = args;
  const logger = getLogger("failJob", rootLogger);
  const { id } = item;
  const jobs = await getJobsCollection();
  logger.debug("Got jobs collection", !!jobs);
  const updatedItem = markItemFailed({ item, errorMessage });
  logger.debug("Update to", updatedItem);
  const { count, status } = await update(jobs, { id }, updatedItem);
  if (count === 1) {
    logger.debug("Emit busEvent for failJob");
    emit(Event.ItemUpdated, {
      previous: item,
      item: updatedItem,
    });
    logger.debug("Return updated item", updatedItem);
    return updatedItem;
  } else {
    logger.error("Something went wrong in the update", {
      numUpdatedRecords: count,
      opStatus: status,
    });
  }
};

/**
 * Associate the given metadata with the given item.
 */
export const addMetadata = async (args: { item: Item, metadata: ItemMetadata}): Promise<Item> => {
  const logger = getLogger("addMetadata", rootLogger);
  logger.debug("begin", args);
  const { item, metadata } = args;
  const { id } = item;
  const jobs = await getJobsCollection();
  const updatedItem = setMetadata({ item, metadata });
  logger.debug("Update to", updatedItem);
  // @ts-ignore
  const { count, status } = await update(jobs, { id }, updatedItem);

  if (count === 1) {
    emit(Event.ItemUpdated, {
      previous: item,
      item: updatedItem,
    });
    return updatedItem;
  } else {
    logger.error("Something went wrong in the update", {
      numUpdatedRecords: count,
      opStatus: status,
    });
  }
};

/**
 * Mark a job as complete.
 */
export const completeJob = async (item: Item): Promise<Item> => {
  const logger = getLogger("completeJob", rootLogger);
  logger.debug(item);
  const { id } = item;
  const jobs = await getJobsCollection();
  logger.debug("Got jobs collection", !!jobs);
  const updatedItem = markItemSuccessful(item);
  logger.debug("Update to", updatedItem);
  // @ts-ignore
  const { count, status } = await update(jobs, { id }, updatedItem);

  if (count === 1) {
    emit(Event.ItemUpdated, {
      previous: item,
      item: updatedItem,
    });
    return updatedItem;
  } else {
    logger.error("Something went wrong in the update", {
      numUpdatedRecords: count,
      opStatus: status,
    });
  }
}

/**
 * This will emit 'ItemRemoved' event.
 */
export const removeJob = async (id: string): Promise<number> => {
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
 */
export const getJobs = async (query: Query): Promise<Cursor> => {
  const jobs = await getJobsCollection()
  return find(jobs, query);
};

/**
 * Find jobs added by this user filtered by this query.
 */
export const getJobsForUser = async (userName: string, query:Query = {}): Promise<Cursor> => {
  return getJobs({ ...query, createdBy: userName });
};


