import { Job, JobStatus } from "../model/Job";
import { JobProgress } from "../model/JobProgress";
import { Topic } from "../model/Topic";
import { getPubSub } from "./pubsub";
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

const onProgress = (job: Job, progress: JobProgress): void => {
  job.progress = progress;
  // Most events are published to pubsub by the typeorm model (JobSubscriber class). However, progress isn't
  // a part of the typeorm model (while it is part of the graphql model) and therefore this isn't handled by
  // JobSubscriber. In order to still update the UI, we make this one exception about publishing pubsub from
  // YTQueue.
  console.log("Job Updated...", job.url);
  job.progress = progress;
  getPubSub().publish(Topic.JobUpdated, job);
};

export const addJobToQueue = (job: Job): void => {
  queue.add(async () => {
    job.status = JobStatus.InProgress;
    await job.save(); // This is important, as this will let everyone else know the job update.
    const thunk = download({
      job,
      onCompletion,
      onProgress,
    });
    thunks.set(job.id, thunk);
  });
};

export const removeJobFromQueue = async (job: Job): Promise<void> => {
  const thunk = thunks.get(job.id);
  if (thunk) {
    // thunk exists, which means we have started downloading this item.
    thunk.abort();
    job.status = JobStatus.Canceled;
    await job.save(); // This is important, as this will let everyone else know the job update.
  }
};

export const pickUpPendingJobs = async (): Promise<void> => {
  const jobs = await Job.find({
    where: [
      { status: JobStatus.Pending },
      { status: JobStatus.InProgress }, // TODO: Check what happens to in-progress downloads if the server dies.
    ],
    order: {
      createdAt: "ASC",
    },
  });
  // @TODO: USe save and load info json to resume downloads
  // @See: https://github.com/ytdl-org/youtube-dl/issues/11308
  jobs.forEach(job => addJobToQueue(job));
};
