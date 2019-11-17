import { combineReducers } from 'redux';
import * as Actions from '../actions';
import DefaultState from './default-state';
import inputForm from './input-form';
import tasks from './tasks';

const taskOutput = (state = DefaultState.taskOutput, { type, output }) =>
  type === Actions.SetTaskOutput ? output : state;

const taskStats = (state = DefaultState.taskStats, { type, stats }) =>
  type === Actions.SetTaskStats ? stats : state;

const statusFilter = (state = DefaultState.statusFilter, { type, status }) =>
  type === Actions.SetStatusFilter ? status : state;

/**
 * @function rootReducer
 * @param {AppState} -
 * @param {Object} action -
 * @returns {AppState} -
 */
export default combineReducers({
  inputForm,
  statusFilter,
  taskOutput,
  tasks,
  taskStats
});
