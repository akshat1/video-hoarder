import * as Event from '../../common/event.mjs';
import getClient from '../io-client';
import md5 from 'blueimp-md5';

export const UrlChanged = 'UrlChanged';
export const SetInputFormDisabled = 'SetInputFormDisabled';
export const ClearInputForm = 'ClearInputForm';
export const QueueUpdated = 'QueueUpdated';
export const TaskStatusChanged = 'TaskStatusChanged';
export const SetSelectedTaskId = 'SetSelectedTaskId';
export const SetTaskOutput = 'SetTaskOutput';
export const AppendTaskOutput = 'AppendTaskOutput';

export const setTaskOutput = output => ({
  type  : SetTaskOutput,
  output: Array.isArray(output) ? output : [output]
});

export const appendTaskOutput = output => ({
  type  : AppendTaskOutput,
  output: Array.isArray(output) ? output : [output]
});

export const selectTask = ({ id }) => ({
  type: SetSelectedTaskId,
  id
});

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
    dispatch(selectTask({ id: md5(url) }));
  };

export const updateQueue = queue => ({
  type: QueueUpdated,
  queue
});
