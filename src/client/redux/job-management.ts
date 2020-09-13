import { getLogger } from "../../logger";
import { Item } from "../../model/Item";
import { StatusFilterValue } from "../../model/Status";
import { getJobs, getStatusFilterValue } from "../selectors";
import { getURL } from "../util";
import { actionCreatorFactory, AsyncActionCreator, Dispatch, GetState, reducerFactory } from "./boilerplate";
import { getInstance } from "./net";
// @ts-ignore
import _ from "lodash";

const rootLogger = getLogger("actions");

export const StatusFilter = "StatusFilter";
export const setStatusFilter = actionCreatorFactory<StatusFilterValue>(StatusFilter);

export const FetchingJobs = "FetchingJobs";
const setFetchingJobs = actionCreatorFactory<boolean>(FetchingJobs);

export const Jobs = "Jobs";
const setJobs = actionCreatorFactory<Item[]>(Jobs);

export const AddingJob = "AddingJob";
const setAddingJob = actionCreatorFactory<boolean>(AddingJob);

export const StoppingJob = "StoppingJob";
const setStoppingJob = actionCreatorFactory<boolean>(StoppingJob);

export const DeletingJob = "DeletingJob";
const setDeletingJob = actionCreatorFactory<boolean>(DeletingJob);

export const fetchJobs = ():AsyncActionCreator =>
  async (dispatch: Dispatch, getState: GetState): Promise<void> => {
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

export const addJob = (url: string): AsyncActionCreator =>
  async (dispatch: Dispatch) => {
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

export const cancelJob = (item: Item): AsyncActionCreator =>
  async (dispatch: Dispatch) => {
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

export const deleteJob = (item: Item): AsyncActionCreator =>
  async (dispatch: Dispatch) => {
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
 * Dispatched in response to a socket-event. Updates the store to reflect the current state of the given item if the
 * said item is not present in the store.
 */
export const updateJobInStore = (item: Item): AsyncActionCreator =>
  async (dispatch: Dispatch, getState: GetState) => {
    const logger = getLogger("updateItemInStore", rootLogger);
    const { id: itemId } = item;
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

export const changeStatusFilter = (filterValue: StatusFilterValue): AsyncActionCreator =>
  (dispatch: Dispatch): void => {
    dispatch(setStatusFilter(filterValue));
    dispatch(fetchJobs());
  };

// Reducers
export const addingJob = reducerFactory<boolean>(AddingJob, false);
export const fetchingJobs = reducerFactory<boolean>(FetchingJobs, false);
export const jobs = reducerFactory<Item[]>(Jobs, []);
export const statusFilter = reducerFactory<StatusFilterValue>(StatusFilter, StatusFilterValue.All);
