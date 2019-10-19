/**
 * @param {AppState} state -
 * @returns {string} -
 */
export const selectedTaskId = ({ selectedTaskId }) => selectedTaskId;

/**
 * @param {AppState} state -
 * @returns {InputFormState} -
 */
export const inputForm = ({ inputForm }) => inputForm;

/**
 * @param {AppState} state -
 * @returns {Task} -
 */
export const selectedTask = ({ selectedTaskId, tasks }) => tasks.find(item => item.id === selectedTaskId);

/**
 * @param {AppState} state -
 * @returns {string[]} -
 */
export const selectedTaskOutput = ({ selectedTaskOutput }) => selectedTaskOutput;

/** 
 * @param {AppState} state -
 * @returns {Object.<string, TaskStats>}
 */
export const taskStats = ({ taskStats }) => taskStats;

/**
 * @param {AppState} state -
 * @returns {TaskStats} -
 */
export const selectedTaskStats = ({ selectedTaskId, taskStats}) => taskStats[selectedTaskId];
