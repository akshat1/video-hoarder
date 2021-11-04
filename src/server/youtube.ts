import { YTMetadata } from "../model/YouTube";
import YouTubeDLWrap from "youtube-dl-wrap";

const youTubeDL = new YouTubeDLWrap("/usr/local/bin/youtube-dl");

export const fetchMetadata = async (url:string): Promise<YTMetadata> =>
  // @TODO: Put this in some sort of cache.
  YTMetadata.fromJSON(await youTubeDL.getVideoInfo(url));
