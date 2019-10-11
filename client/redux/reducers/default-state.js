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
 * @type {AppState}
 */
export default {
  inputForm,
  tasks,
  selectedTaskId: null,
  selectedTaskOutput
};
