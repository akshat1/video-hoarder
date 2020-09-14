export enum Status {
  Failed = "failed",
  Paused = "paused",
  Pending = "pending",
  Running = "running",
  Succeeded = "succeeded",
}

export enum StatusFilterValue {
  All = "all",
  Failed = "failed",
  Paused = "paused",
  Pending = "pending",
  Running = "running",
  Succeeded = "succeeded",
}


export const hasStarted = (status: Status): boolean =>
  status === Status.Running || status === Status.Failed || status === Status.Succeeded || status === Status.Paused;

export const hasConcluded = (status: Status): boolean =>
  status === Status.Failed || status === Status.Succeeded;

export const isPending = (status: Status): boolean =>
  status === Status.Pending;
