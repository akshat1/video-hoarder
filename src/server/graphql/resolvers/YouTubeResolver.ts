import { YTMetadata } from "../../../model/YouTube";
import { fetchMetadata } from "../../youtube";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class YouTubeResolver {
  @Query(() => YTMetadata)
  ytMetadata(@Arg("url") url: string): Promise<YTMetadata> {
    return fetchMetadata(url);
  }
}
