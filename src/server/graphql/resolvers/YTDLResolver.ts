import { YTDLInformation } from "../../../model/YTDL";
import { getYTDLExecutable, getYTDLVersion } from "../../youtube";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class YTDLResolver {
  @Query(() => YTDLInformation)
  async ytdlInformation(): Promise<YTDLInformation> {
    return {
      executable: getYTDLExecutable(),
      version: await getYTDLVersion(),
    };
  }
}
