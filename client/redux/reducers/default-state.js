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
 * @type {AppState}
 */
export default {
  taskOutput,
  inputForm,
  selectedTaskId: null,
  tasks,
  taskStats
};
