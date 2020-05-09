/**
 * Job statuses.
 * @module Status
 */

/**
 * @enum {string}
 */
export const Status = {
  Pending: 'pending',
  Running: 'running',
  Failed: 'failed',
  Succeeded: 'succeeded'
};

/**
 * @func
 * @param {Status} status 
 * @returns {bool}
 */
export const hasStarted = status =>
  status === Status.Running || status === Status.Failed || status === Status.Succeeded;

/**
 * @func
 * @param {Status} status 
 * @returns {bool}
 */
export const hasConcluded = status =>
  status === Status.Failed || status === Status.Succeeded;
