import { YTMetadata } from "../../model/YouTube";
import { Arg, Query, Resolver } from "type-graphql";
import YouTubeDLWrap from "youtube-dl-wrap";

const youTubeDL = new YouTubeDLWrap("/usr/local/bin/youtube-dl");

@Resolver()
export class YouTubeResolver {
  @Query(() => YTMetadata)
  async ytMetadata(@Arg("url") url: string): Promise<YTMetadata> {
    console.log("Try to fetch", url);
    const source = await youTubeDL.getVideoInfo(url);
    console.log("Got", source);
    const result = YTMetadata.fromJSON(source);
    console.log("Transformed into", result);
    return result;
  }
}
