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

export const hasStarted = status =>
  status === Status.Running || status === Status.Failed || status === Status.Succeeded;
