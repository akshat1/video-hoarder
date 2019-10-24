import { combineReducers } from 'redux';
import * as Actions from '../actions';
import DefaultState from './default-state';
import inputForm from './input-form';
import tasks from './tasks';

const selectedTaskId = (state = DefaultState.selectedTaskId, { type, id }) =>
  type === Actions.SetSelectedTaskId ? id : state;

const taskOutput = (state = DefaultState.taskOutput, { type, output }) =>
  type === Actions.SetTaskOutput ? output : state;

const taskStats = (state = DefaultState.taskStats, { type, stats }) =>
  type === Actions.SetTaskStats ? stats : state;

/**
 * @function rootReducer
 * @param {AppState} -
 * @param {Object} action -
 * @returns {AppState} -
 */
export default combineReducers({
  inputForm,
  selectedTaskId,
  taskOutput,
  tasks,
  taskStats
});
