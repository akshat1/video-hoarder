import { YTMetadata } from "../../../model/YouTube";
import { Arg, Query, Resolver } from "type-graphql";
import YouTubeDLWrap from "youtube-dl-wrap";

const youTubeDL = new YouTubeDLWrap("/usr/local/bin/youtube-dl");

@Resolver()
export class YouTubeResolver {
  @Query(() => YTMetadata)
  async ytMetadata(@Arg("url") url: string): Promise<YTMetadata> {
    const source = await youTubeDL.getVideoInfo(url);
    const result = YTMetadata.fromJSON(source);
    return result;
  }
}
