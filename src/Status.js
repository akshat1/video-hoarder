/**
 * @enum {string} Status
 */
const Status = {
  Pending: 'pending',
  Running: 'running',
  Failed: 'failed',
  Succeeded: 'succeeded'
};

export default Status;

export const hasStarted = status =>
  status === Status.Running || status === Status.Failed || status === Status.Succeeded;
