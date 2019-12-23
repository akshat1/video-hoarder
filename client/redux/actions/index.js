import * as Event from '../../../common/event.mjs';
import getClient from '../../io-client';

export const ClearInputForm = 'ClearInputForm';
export const QueueUpdated = 'QueueUpdated';
export const SetInputFormDisabled = 'SetInputFormDisabled';
export const SetTaskOutput = 'SetTaskOutput';
export const SetTaskStats = 'SetTaskStats';
export const TaskStatusChanged = 'TaskStatusChanged';
export const UrlChanged = 'UrlChanged';
export const SetStatusFilter = 'SetStatusFilter';

// Signals going to the server
const NOOP = { type: 'NOOP' };
const emit = (event, payload) => {
  getClient().emit(event, payload);
  return NOOP;
}

export const submitTask = url =>
  (dispatch) => {
    emit(Event.TaskAdded, { url });
    dispatch(clearInputForm());
  };

export const clearQueue = () => emit(Event.ClearQueue);

export const abortTask = id => {
  emit(Event.AbortTask, { id });
  return NOOP;
}

// Signals going to the client
export const updateQueue = queue => ({
  type: QueueUpdated,
  queue
});

/**
 * Appends given output to the existing output for the given task id.
 *
 * @param {Array} [args.multi] - contains multiple task statuses
 * @param {string} [args.id] - won't be supplied if multi is present
 * @param {string} [args.output] - won't be supplied if multi is present
 * @returns {function} -
 */
export const updateTaskOutput = (args) =>
  (dispatch, getState) => {
    const { taskOutput } = getState();
    const append = (id, output) => {
      const currentOutput = taskOutput[id] || [];
      const newOutput = [...currentOutput, ...output];
      dispatch({
        type: SetTaskOutput,
        output: Object.assign({}, taskOutput, { [id]: newOutput })
      });
    }

    if (args.multi)
      args.multi.forEach(([id, output]) => append(id, output));
    else
      append(args.id, args.output);
  }

/**
 * Updates the existing taskStats in the store with the given task-stats.
 * @param {string} id -
 * @param {TaskStats} stats -
 * @returns {function} -
 */
export const updateTaskStats = (id, stats) =>
  (dispatch, getState) => {
    const { taskStats } = getState();
    dispatch({
      type: SetTaskStats,
      stats: Object.assign({}, taskStats, { [id]: stats })
    });
  };

// Signals going to the client, from the client.
export const setInputFormDisabled = disabled => ({
  type: SetInputFormDisabled,
  disabled
});

export const clearInputForm = () => ({ type: ClearInputForm });

export const changeURL = url => {
  let error;
  if (url) 
    try {
      new URL(url);
    } catch(err) {
      error = err;
    }
  

  return {
    error,
    type: UrlChanged,
    url
  };
}

export const setStatusFilter = status => ({
  type: SetStatusFilter,
  status
});
