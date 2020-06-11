import { getLogger } from "../../../logger";
import { getJobs, getStatusFilterValue } from "../../selectors";
import { StatusFilterValue } from "../../StatusFilterValue";
import { getURL } from "../../util";
import { makeActionF } from "../boilerplate";
import { getInstance } from "../net";
import _ from "lodash";

const rootLogger = getLogger("actions");

export const StatusFilter = "StatusFilter";
export const setStatusFilter = makeActionF(StatusFilter);

export const FetchingJobs = "FetchingJobs";
const setFetchingJobs = makeActionF(FetchingJobs);

export const Jobs = "Jobs";
const setJobs = makeActionF(Jobs);

export const AddingJob = "AddingJob";
const setAddingJob = makeActionF(AddingJob);

export const StoppingJob = "StoppingJob";
const setStoppingJob = makeActionF(StoppingJob);

export const DeletingJob = "DeletingJob";
const setDeletingJob = makeActionF(DeletingJob);

/**
 * @func
 * @returns {ActionCreator}a
 */
export const fetchJobs = () =>
  async (dispatch, getState) => {
    const logger = getLogger("fetchJobs", rootLogger);
    try {
      logger.debug("fetchJobs");
      dispatch(setFetchingJobs(true));
      const state = getState();
      const query = {};
      const statusFilterValue = getStatusFilterValue(state);
      if (statusFilterValue !== StatusFilterValue.All) {
        _.set(query, "status", statusFilterValue);
      }

      const response = await getInstance().post(getURL("./api/jobs"), { query });
      const { data: jobs } = response.data;
      dispatch(setJobs(jobs));
      dispatch(setFetchingJobs(false));
    } catch (err) {
      dispatch(setFetchingJobs(false));
      logger.error(err);
    }
  };

export const addJob = (url) =>
  async (dispatch) => {
    const logger = getLogger("addJob", rootLogger);
    try {
      logger.debug("adding job", url);
      dispatch(setAddingJob(true));
      const response = await getInstance().post(getURL("./api/job/add"), { url });
      logger.debug("done adding job.", response);
      dispatch(setAddingJob(false));
    } catch (err) {
      dispatch(setAddingJob(false));
      logger.error(err);
    }
  };

/**
 * Cancel the current download.
 *
 * @func
 * @alias cancelJob
 * @param {Item} item
 * @returns {ActionCreator}
 */
export const cancelJob = (item) =>
  async (dispatch) => {
    const logger = getLogger("cancelJob", rootLogger);
    try {
      const { id: itemId } = item;
      logger.debug("canceling job", itemId);
      dispatch(setStoppingJob(true));
      const response = await getInstance().post(getURL("./api/job/stop"), { itemId });
      logger.debug("done cancelling job", response);
      dispatch(setStoppingJob(false));
    } catch(err) {
      dispatch(setStoppingJob(true));
      logger.error(err);
    }
  };

/**
 * Delete the current download.
 *
 * @func
 * @alias deleteJob
 * @param {Item} item
 * @returns {ActionCreator}
 */
export const deleteJob = (item) =>
  async (dispatch) => {
    const logger = getLogger("deleteJob", rootLogger);
    try {
      const { id: itemId } = item;
      logger.debug("deleting job", itemId);
      dispatch(setDeletingJob(true));
      const response = await getInstance().post(getURL("./api/job/delete"), { itemId });
      logger.debug("done deleting job", response);
      dispatch(setStoppingJob(false));
    } catch(err) {
      dispatch(setStoppingJob(true));
      logger.error(err);
    }
  };

/**
 * Dispatched in response to a socket-event. Updates the store to reflect the current state of the
 * given item (if the item is present in the store).
 *
 * @alias updateJobInStore
 * @param {Item} item
 */
export const updateJobInStore = (item) =>
  async (dispatch, getState) => {
    const logger = getLogger("updateItemInStore", rootLogger);
    const { id: itemId } = item;
    /** @type {Item[]} */
    const allJobs = _.cloneDeep(getJobs(getState()));
    const jobIndex = allJobs.findIndex(({ id }) => id === itemId);
    if (jobIndex !== -1) {
      logger.debug("Found job at index", jobIndex);
      const currentItem = allJobs[jobIndex];
      const newItem = Object.assign(currentItem, item);
      logger.debug("Update", { currentItem, newItem });
      allJobs[jobIndex] = newItem;
      logger.debug("Dispatch setJobs");
      dispatch(setJobs(allJobs));
      logger.debug("Done");
    }
    logger.debug(`${itemId} is currently not in our store.`);
  };

export const changeStatusFilter = (filterValue) =>
  (dispatch) => {
    dispatch(setStatusFilter(filterValue));
    dispatch(fetchJobs());
  };
