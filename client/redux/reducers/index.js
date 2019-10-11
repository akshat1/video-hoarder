import * as Actions from '../actions';
import { combineReducers } from 'redux';
import DefaultState from './default-state';
import inputForm from './input-form';
import tasks from './tasks';

const selectedTaskId = (state = DefaultState.selectedTaskId, { type, id }) =>
  type === Actions.SetSelectedTaskId ? id : state;

const selectedTaskOutput = (state = DefaultState.selectedTaskOutput, action) => {
  const { type, output } = action;
  if (type === Actions.SetTaskOutput) 
    // Clear output whenever taskId is changed
    return action.output;
  

  if (type === Actions.AppendTaskOutput) 
    return state.concat(output);
  

  return state;
}

/**
 * @function rootReducer
 * @param {AppState} -
 * @param {Object} action -
 * @returns {AppState} -
 */
export default combineReducers({
  tasks,
  inputForm,
  selectedTaskId,
  selectedTaskOutput
});
