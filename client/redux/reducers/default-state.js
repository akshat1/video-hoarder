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

export const selectedTaskOutput = [];

/**
 * @type {Object.<string, TaskStats>}
 */
export const taskStats = {};

/**
 * @type {AppState}
 */
export default {
  inputForm,
  selectedTaskId: null,
  selectedTaskOutput,
  tasks,
  taskStats
};
