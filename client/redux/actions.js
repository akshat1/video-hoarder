import * as Event from '../../common/event.mjs';
import getClient from '../io-client';

export const ClearInputForm = 'ClearInputForm';
export const QueueUpdated = 'QueueUpdated';
export const SetInputFormDisabled = 'SetInputFormDisabled';
export const SetTaskOutput = 'SetTaskOutput';
export const SetTaskStats = 'SetTaskStats';
export const TaskStatusChanged = 'TaskStatusChanged';
export const UrlChanged = 'UrlChanged';
export const SetStatusFilter = 'SetStatusFilter';

/**
 * Appends given output to the existing output for the given task id.
 *
 * @param {string} taskId -
 * @param {string} output -
 * @returns {function} -
 */
export const updateTaskOutput = (taskId, output) =>
  (dispatch, getState) => {
    const { taskOutput } = getState();
    const currentOutput = taskOutput[taskId] || [];
    const newOutput = [...currentOutput, output];
    dispatch({
      type: SetTaskOutput,
      output: Object.assign({}, taskOutput, { [taskId]: newOutput })
    });
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

export const submitTask = url =>
  (dispatch) => {
    getClient().emit(Event.TaskAdded, { url });
    dispatch(clearInputForm());
  };

export const updateQueue = queue => ({
  type: QueueUpdated,
  queue
});

export const setStatusFilter = status => ({
  type: SetStatusFilter,
  status
});

export const clearQueue = () => getClient().emit(Event.ClearQueue);    
