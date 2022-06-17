/** @todo Clean up the messy interaction between the async ytdl calls and waiting for updates to finish. */
import { Job, JobStatus, RateUnlimited } from "../model/Job";
import { JobProgress } from "../model/JobProgress";
import { Topic } from "../model/Topic";
import { YTMetadata } from "../model/YouTube";
import { getLogger } from "../shared/logger";
import { getPubSub } from "./pubsub";
import { execFile } from "child_process";
import NodeCache from "node-cache";
import YouTubeDLWrap from "youtube-dl-wrap";

const rootLogger = getLogger("youtube");
const ytdlPath = "/usr/local/bin/yt-dlp";
const youTubeDL = new YouTubeDLWrap(ytdlPath);
let isUpdating = false;

const metadataCache = new NodeCache({
  stdTTL: 24*60*60*1000, // 24 hours. Should this be shorter?
});

export const fetchMetadata = (url:string): Promise<YTMetadata> => {
  // Rather messy code here. We have async code executing, and that particular
  // codepath _may_ be executed in response to a pubsub event instead of being
  // executed straightaway.

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      let metadata = metadataCache.get<YTMetadata>(url);
      if (!metadata) {
        let subscriptionId;
        const actualFetch = async () => {
          metadata = YTMetadata.fromJSON(await youTubeDL.getVideoInfo(url));
          metadataCache.set(url, metadata);
          // Clean-up, in case we were waiting for an update to conclude.
          if (subscriptionId) {
            getPubSub().unsubscribe(subscriptionId);
          }
        };

        // If we are currently updating yt-dl, then wait until we are done.
        if (isUpdating) {
          subscriptionId = await getPubSub().subscribe(Topic.YTDLUpdateComplete, actualFetch, {});
        } else {
          // no update in progress. Go ahead and execute.
          await actualFetch();
        }
      }

      resolve(metadata);
    } catch (error) {
      reject(error);
    }
  });
};

export interface DownloadThunk {
  abort: Function;
}

interface DownloadArgs {
  job: Job;
  onProgress?: (job: Job, progress: JobProgress) => void|Promise<void>;
  onCompletion?: (error: Error, job: Job) => void|Promise<void>;
  onAbort?: (job: Job) => void|Promise<void>;
}

export const download = (args: DownloadArgs): Promise<DownloadThunk> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      let subscriptionId;
      const actualDownload = async (): Promise<void> => {
        if (subscriptionId) {
          getPubSub().unsubscribe(subscriptionId);
        }

        const {
          job,
          onProgress,
          onCompletion,
          // onAbort,
        } = args;
      
        const {
          downloadOptions: {
            formatSelector,
            rateLimit,
            downloadLocation,
          },
          url,
        } = job;
      
        const videoId = new URL(url).searchParams.get("v");
        const logger = getLogger(`download(${videoId})`, rootLogger);
        const controller = new AbortController();
        const dlArgs = [
          url,
          "-f", formatSelector,
          "-o", downloadLocation,
          "--restrict-filenames",
        ];
      
        if (typeof rateLimit === "string" && rateLimit !== RateUnlimited) {
          dlArgs.push("-r", rateLimit);
        }
      
        const options = {};
      
        logger.debug("Issuing command with args", dlArgs);
        const youtubeDlEventEmitter = youTubeDL.exec(dlArgs, options, controller.signal)
          .on("progress", async (progress) => {
            const subLogger = getLogger("on progress", logger);
            if (args.job.status == JobStatus.Canceled) {
              subLogger.debug("Job canceled. Ignore progress.");
            } else if (typeof onProgress === "function") {
              // logger.debug("Call onProgress");
              await onProgress(args.job, progress);
            }
          })
          .on("error", async (error) => {
            const subLogger = getLogger("on error", logger);
            subLogger.error(error);
            if (typeof onCompletion === "function") {
              subLogger.debug("Call onCompletion");
              await onCompletion(error, args.job);
              subLogger.debug("Done");
            }
          })
          .on("close", async () => {
            const subLogger = getLogger("on close", logger);
            if (args.job.status !== JobStatus.Canceled) {
              if (typeof onCompletion === "function") {
                subLogger.debug("Call onCompletion");
                await onCompletion(null, args.job);
                subLogger.debug("Done");
              }
            }
          });
      
        const thunk = {
          abort: () => {
            const subLogger = getLogger("abort", logger);
            subLogger.debug(`Aborting ${url}.`);
            controller.abort();
            // youtubeDlEventEmitter.youtubeDlProcess.kill();
            subLogger.debug("Killed process?", youtubeDlEventEmitter.youtubeDlProcess.killed);
          },
        };

        resolve(thunk);
      }
      
      if (isUpdating) {
        subscriptionId = await getPubSub().subscribe(Topic.YTDLUpdateComplete, actualDownload, {});
      } else {
        actualDownload();
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getYTDLExecutable = (): string => ytdlPath;

export const getYTDLVersion = (): Promise<string> => {
  const logger = getLogger("getYTDLVersion", rootLogger);
  return new Promise((resolve, reject) => {
    execFile(ytdlPath, ["--version"], (error, stdOut, stdError) => {
      if (stdOut.length) {
        resolve(stdOut.toString());
      }

      if (stdError?.length) {
        logger.error("Error while updating YTDL.", stdError.toString());
      }

      if (error) {
        logger.error("Error while updating YTDL.", error);
        reject(error);
        return;
      }
    });
  });
};

const UpdateFrequencyDays = 1;
const doUpdate = (): Promise<void> => {
  isUpdating = true;
  const logger = getLogger("doUpdate", rootLogger);
  return new Promise((resolve, reject) => {
    logger.info("Update yt-dlp");
    execFile(ytdlPath, ["-U"], (error, stdOut, stdError) => {
      isUpdating = false;
      // line up the next update.
      setTimeout(doUpdate, UpdateFrequencyDays * 86400000); // Magic number alert. 86400000 = 24 * 60 * 60 * 1000
      if (stdOut.length) {
        logger.info("yt-dlp -U output:\n", stdOut.toString());
      }

      if (stdError?.length) {
        logger.error("Error updating yt-dlp.", stdError.toString());
      }

      if (error) {
        logger.error("Error updating yt-dlp.", error);
        reject(error);
        return;
      }

      resolve();
    });
  });
};

// Run an update on application start (or rather, module load).
doUpdate();
