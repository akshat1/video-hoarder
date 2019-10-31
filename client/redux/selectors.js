import _ from 'lodash';
import { All } from '../../common/constants.mjs';

/**
 * @param {AppState} state -
 * @returns {InputFormState} -
 */
export const inputForm = ({ inputForm }) => inputForm;

/**
 * @returns {Object.<string, string[]>} -
 */
export const taskOutput = ({ taskOutput }) => taskOutput;

/** 
 * @param {AppState} state -
 * @returns {Object.<string, TaskStats>}
 */
export const taskStats = ({ taskStats }) => taskStats;

/** 
 * @param {AppState} state -
 * @returns {string} -
 */
export const statusFilter = ({ statusFilter }) => statusFilter;

export const tasks = ({ tasks }) => tasks;

export const filteredTasks = ({ statusFilter, tasks }) =>
  statusFilter === All ? tasks :  _.filter(tasks, { status: statusFilter });
