import { Job } from "../model/Job";
import { YTMetadata } from "../model/YouTube";
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
  onProgress?: (Job, JobProgress) => void|Promise<void>;
  onCompletion?: (Error, Job) => void|Promise<void>;
}

const downloadLocation = "\"/home/akshat/Downloads/%(title)s.%(ext)s\"";
export const download = (args: DownloadArgs): DownloadThunk => {
  const {
    job: {
      downloadOptions,
      url,
    },
    onProgress,
    onCompletion,
  } = args;

  const controller = new AbortController();
  const dlArgs = [
    url,
    "-f", downloadOptions.formatSelector,
    "-o", downloadLocation,
    "--restrict-filenames",
  ];
  const options = {
    shell: true,
    detached: true,
  };

  console.log("Issuing command with args", dlArgs);

  const youtubeDlEventEmitter = youTubeDL.exec(dlArgs, options, controller.signal)
    .on("progress", (progress) => {
      console.log(`Progress for ${url}:`, progress);
      if (typeof onProgress === "function") {
        onProgress(args.job, progress);
      }
    })
    .on("youtubeDlEvent", (eventType, eventData) => {
      console.log(`Event for ${url}`, { eventType, eventData });
    })
    .on("error", (error) => {
      console.error(error);
      if (typeof onCompletion === "function") {
        onCompletion(error, args.job);
      }
    })
    .on("close", () => {
      console.log(`Completed ${url}`);
      if (typeof onCompletion === "function") {
        onCompletion(null, args.job);
      }
    });

  console.log(`Started downloading ${url}. PID: ${youtubeDlEventEmitter.pid}`);

  // TODO: Actually download the item.
  console.log(args);
  return {
    abort: () => {
      console.log(`Aborting ${url}.`);
      controller.abort();
    },
  };
}
