import Status from '../../../common/status.mjs';

/**
 * @type {InputFormState}
 */
export const inputForm = {
  disabled    : false,
  errorMessage: '',
  url         : ''
};

/**
 * @type {Task[]}
 */
export const tasks = [];

/**
 * @type {Object.<string, string[]>}
 */
export const taskOutput = {};

/**
 * @type {Object.<string, TaskStats>}
 */
export const taskStats = {};

/**
 * @type {string}
 */
export const statusFilter = Status.running;

/**
 * @type {AppState}
 */
export default {
  inputForm,
  statusFilter,
  taskOutput,
  tasks,
  taskStats
};
