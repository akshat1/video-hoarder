import { DownloadOptions, RateUnlimited } from "../../../model/Job";
import { Preset } from "../../../model/Preset";
import { YTFormat, YTMetadata } from "../../../model/YouTube";
import { getDownloadLocation } from "../../downloadLocation";
import { ENOUSER } from "../../errors";
import { fetchMetadata } from "../../youtube";
import { Context } from "@apollo/client";
import { Arg, Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class MetadataAndOptions {
  @Field(() => YTMetadata)
  metadata: YTMetadata;

  @Field(() => DownloadOptions)
  downloadOptions: DownloadOptions; 
}

@Resolver()
export class YouTubeResolver {
  @Query(() => YTMetadata)
  async metadata(@Arg("url") url: string): Promise<YTMetadata> {
    const metadata = await fetchMetadata(url);
    return metadata;
  }

  @Query(() => MetadataAndOptions)
  async metadataAndOptions(@Arg("url") url: string, @Ctx() context: Context): Promise<MetadataAndOptions> {
    const metadata = await fetchMetadata(url);
    const user = await context.getUser();
    if (!user) 
      throw new Error(ENOUSER);
    

    const downloadOptions: DownloadOptions = {
      downloadLocation: await getDownloadLocation(metadata, user),
      formatSelector: YTFormat.BestBestMerged.formatId,
      rateLimit: RateUnlimited,
      // TODO: Change this once we have scripted matching up and running.
      presetId: (await Preset.find())[0].id,
    };

    return {
      metadata,
      downloadOptions,
    };
  }
}
