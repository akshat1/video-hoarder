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
  onProgress?: Function;
  onCompletion?: Function;
}

export const download = (args: DownloadArgs): DownloadThunk => {
  // TODO: Actually download the item.
  console.log(args);
  return {
    abort: () => 0,
  };
}
