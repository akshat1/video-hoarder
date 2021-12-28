import { Job, JobStatus, RateUnlimited } from "../model/Job";
import { JobProgress } from "../model/JobProgress";
import { User } from "../model/User";
import { YTMetadata } from "../model/YouTube";
import { getDownloadLocation } from "./DownloadLocation";
import NodeCache from "node-cache";
import YouTubeDLWrap from "youtube-dl-wrap";

const youTubeDL = new YouTubeDLWrap("/usr/local/bin/youtube-dl");

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
    },
    url,
  } = job;

  const user = await User.findOne({ where: { userName: job.createdBy }});
  const controller = new AbortController();
  const dlArgs = [
    url,
    "-f", formatSelector,
    "-o", await getDownloadLocation(job, user),
    "--restrict-filenames",
  ];

  if (typeof rateLimit === "string" && rateLimit !== RateUnlimited) {
    dlArgs.push("-r", rateLimit);
  }

  const options = {};

  console.log("Issuing command with args", dlArgs);
  const youtubeDlEventEmitter = youTubeDL.exec(dlArgs, options, controller.signal)
    .on("progress", (progress) => {
      console.log("progress for", url);
      if (args.job.status == JobStatus.Canceled) {
        console.log("Job canceled. Ignore progress.");
      } else if (typeof onProgress === "function") {
        onProgress(args.job, progress);
      }
    })
    .on("error", (error) => {
      console.error(error);
      if (typeof onCompletion === "function") {
        onCompletion(error, args.job);
      }
    })
    .on("close", () => {
      if (args.job.status !== JobStatus.Canceled) {
        if (typeof onCompletion === "function") {
          console.log("Complete");
          onCompletion(null, args.job);
        }
      }
    });

  return {
    abort: () => {
      console.log(`Aborting ${url}.`);
      controller.abort();
      // youtubeDlEventEmitter.youtubeDlProcess.kill();
      console.log("Killed process?", youtubeDlEventEmitter.youtubeDlProcess.killed);
    },
  };
}
