import { Job, JobStatus, RateUnlimited } from "../model/Job";
import { JobProgress } from "../model/JobProgress";
import { YTMetadata } from "../model/YouTube";
import { getLogger } from "./logger";
import NodeCache from "node-cache";
import YouTubeDLWrap from "youtube-dl-wrap";

const rootLogger = getLogger("youtube");
const youTubeDL = new YouTubeDLWrap("/usr/local/bin/yt-dlp");

const metadataCache = new NodeCache({
  stdTTL: 24*60*60*1000, // 24 hours. Should this be shorter?
});

export const fetchMetadata = async (url:string): Promise<YTMetadata> => {
  let metadata = metadataCache.get<YTMetadata>(url);
  if (!metadata) {
    metadata = YTMetadata.fromJSON(await youTubeDL.getVideoInfo(url));
    metadataCache.set(url, metadata);
  }

  return metadata;
}

export interface DownloadThunk {
  abort: Function;
}

interface DownloadArgs {
  job: Job;
  onProgress?: (job: Job, progress: JobProgress) => void|Promise<void>;
  onCompletion?: (error: Error, job: Job) => void|Promise<void>;
  onAbort?: (job: Job) => void|Promise<void>;
}

export const download = async (args: DownloadArgs): Promise<DownloadThunk> => {
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

  return {
    abort: () => {
      const subLogger = getLogger("abort", logger);
      subLogger.debug(`Aborting ${url}.`);
      controller.abort();
      // youtubeDlEventEmitter.youtubeDlProcess.kill();
      subLogger.debug("Killed process?", youtubeDlEventEmitter.youtubeDlProcess.killed);
    },
  };
}
