import { Job, JobStatus } from "../model/Job";
import { download, DownloadThunk } from "./youtube";
import PQueue from "p-queue";

const concurrency = 1; // 6
const queue = new PQueue({ concurrency });
const thunks = new Map<string, DownloadThunk>(); // map job-id to download thunk.

const onCompletion = async (error: Error, job: Job): Promise<void> => {
  if (error) {
    job.status = JobStatus.Failed;
    job.errorMessage = error.message;
  } else {
    job.status = JobStatus.Completed;
  }
  await job.save(); // This is important, as this will let everyone else know the job update.
  thunks.delete(job.id);
};

export const addJobToQueue = (job: Job): void => {
  queue.add(async () => {
    job.status = JobStatus.InProgress;
    await job.save(); // This is important, as this will let everyone else know the job update.
    const thunk = download({
      job,
      onCompletion,
    });
    thunks.set(job.id, thunk);
  });
}

export const removeJobFromQueue = async (job: Job): Promise<void> => {
  const thunk = thunks.get(job.id);
  if (thunk) {
    // thunk exists, which means we have started downloading this item.
    thunk.abort();
    job.status = JobStatus.Canceled;
    await job.save(); // This is important, as this will let everyone else know the job update.
  }
}
