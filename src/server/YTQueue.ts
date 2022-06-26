import { Job, JobStatus } from "../model/Job";
import { JobProgress } from "../model/JobProgress";
import { Topic } from "../model/Topic";
import { getLogger } from "../shared/logger";
import { getPubSub } from "./pubsub";
import { download, DownloadThunk } from "./youtube";
import PQueue from "p-queue";

const rootLogger = getLogger("YTQueue");
const concurrency = 1; // 6
const queue = new PQueue({ concurrency });
const thunks = new Map<string, DownloadThunk>(); // map job-id to download thunk.

const onCompletion = async (error: Error, job: Job): Promise<void> => {
  const videoId = new URL(job.url).searchParams.get("v");
  const logger = getLogger(`onCompletion ${videoId}`, rootLogger);
  if (error) {
    logger.error("We had an error", error);
    job.status = JobStatus.Failed;
    job.errorMessage = error.message;
  } else {
    logger.debug("No Errors. Set status", JobStatus.Completed);
    job.status = JobStatus.Completed;
  }

  logger.debug("Saving job");
  await job.save();
  getPubSub().publish(Topic.JobUpdated, job);

  logger.debug("Done");
  thunks.delete(job.id);
};

const onAbort = async (job: Job): Promise<void> => {
  job.status = JobStatus.Canceled;
  await job.save();
  getPubSub().publish(Topic.JobUpdated, job);
  thunks.delete(job.id);
};

const onProgress = (job: Job, progress: JobProgress): void => {
  job.progress = progress;
  getPubSub().publish(Topic.JobUpdated, job);
};

export const addJobToQueue = (job: Job): void => {
  const videoId = new URL(job.url).searchParams.get("v");
  const logger = getLogger(`addJobToQueue ${videoId}`, rootLogger);
  logger.debug("Adding job to queue");
  queue.add(async () => {
    logger.debug("Set status in-progress");
    job.status = JobStatus.InProgress;
    logger.debug("save...");
    await job.save();
    getPubSub().publish(Topic.JobUpdated, job);
    logger.debug("Call download");
    const thunk = await download({
      job,
      onCompletion,
      onProgress,
      onAbort,
    });
    logger.debug("Done.");
    thunks.set(job.id, thunk);
  });
};

export const removeJobFromQueue = async (job: Job): Promise<void> => {
  const videoId = job ? new URL(job.url).searchParams.get("v") : "NoJob";
  const logger = getLogger(`removeJobFromQueue ${videoId}`, rootLogger);
  if (job) {
    logger.debug("Removing job from queue");
    const thunk = thunks.get(job.id);
    if (thunk) {
      // thunk exists, which means we have started downloading this item.
      thunk.abort();
      job.status = JobStatus.Canceled;
      await job.save();
      getPubSub().publish(Topic.JobUpdated, job);
    } else 
      logger.debug("Thunk not found.");
    
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

const hookUp = () => {
  const pubSub = getPubSub();
  pubSub.subscribe(Topic.JobAdded, addJobToQueue, {});
  pubSub.subscribe(Topic.JobCancelled, removeJobFromQueue, {});
  pubSub.subscribe(Topic.JobRemoved, removeJobFromQueue, {});
};
hookUp();
