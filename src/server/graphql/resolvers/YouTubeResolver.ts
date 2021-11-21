import { YTMetadata } from "../../../model/YouTube";
import { fetchMetadata } from "../../youtube";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class YouTubeResolver {
  @Query(() => YTMetadata)
  async ytMetadata(@Arg("url") url: string): Promise<YTMetadata> {
    const metadata = await fetchMetadata(url);
    return metadata;
  }
}
