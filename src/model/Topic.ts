export enum Topic {
  JobAdded = "JobAdded",
  JobCancelled = "JobCancelled",
  JobRemoved = "JobRemoved",
  JobUpdated = "JobUpdated", // This is emitted by job-update-batcher and consumed by the JobResolver (and the client)
  JobUpdatedInternal = "JobUpdatedInternal", // This is emitted by ytqueue and consumed by job-update-batcher
  YTDLUpdateComplete = "YTDLUpdateComplete",
}
