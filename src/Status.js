/**
 * Job statuses.
 * @module Status
 */

/** @typedef {string} Status */

/**
 * @enum {Status}
 */
export const Status = {
  Failed: "failed",
  Paused: "paused",
  Pending: "pending",
  Running: "running",
  Succeeded: "succeeded",
};

/**
 * @func
 * @param {Status} status 
 * @returns {bool}
 */
export const hasStarted = status =>
  status === Status.Running || status === Status.Failed || status === Status.Succeeded || status === Status.Paused;

/**
 * @func
 * @param {Status} status 
 * @returns {bool}
 */
export const hasConcluded = status =>
  status === Status.Failed || status === Status.Succeeded;

/**
 * @param {Status} status 
 * @returns {bool}
 */
export const isPending = status => status === Status.Pending;
