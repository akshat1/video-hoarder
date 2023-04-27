import { Preset } from "../../model/Preset";
import { User } from "../../model/User";
import { getLogger } from "../../shared/logger";
import { ENOUSER, EPRESETNAMEINUSE } from "../errors";
import { Context } from "@apollo/client";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

@InputType()
class PresetInput {
  @Field()
  name: string;
  @Field()
  downloadLocation: string;
  @Field()
  formatSelector: string;
  @Field()
  rateLimit: string;
  @Field()
  private: boolean;
  @Field()
  saveMetadata: boolean;
  @Field()
  generateNFO: boolean;
}

const rootLogger = getLogger("PresetResolver");

@Resolver()
export class PresetResolver {
  @Query(() => [Preset])
  async presets(@Ctx() context: Context): Promise<Preset[]> {
    const logger = getLogger("presets", rootLogger);
    const currentUser = await context.getUser() as User;
    logger.debug("currentUser: ", currentUser?.userName || "None!!!");
    const presets = await Preset.find({
      where: [
        { createdBy: "admin" },
        { createdBy: currentUser.userName },
      ],
    });
    logger.debug(`Got ${presets.length} presets.`);
    return presets;
  }

  @Mutation(() => String)
  async savePreset(@Arg("data") preset: PresetInput, @Ctx() context: Context): Promise<String> {
    const currentUser = await context.getUser() as User;
    if (!currentUser)
      throw new Error(ENOUSER);
    
    const presetsWithSameName = await Preset.find({ where: { name: preset.name }});
    if (presetsWithSameName.length)
      throw new Error(EPRESETNAMEINUSE);
    
    const newPreset = Preset.create({
      createdBy: currentUser.userName,
      createdAt: new Date(),
    });

    return newPreset.id;
  }
}
