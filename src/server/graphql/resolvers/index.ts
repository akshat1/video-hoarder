import { JobResolver } from "./JobResolver";
import { PresetResolver } from "./PresetResolver";
import { UserResolver } from "./UserResolver";
import { YouTubeResolver } from "./YouTubeResolver";
import { YTDLResolver } from "./YTDLResolver";
import { NonEmptyArray } from "type-graphql";

export const resolvers:NonEmptyArray<Function> = [
  JobResolver,
  PresetResolver,
  UserResolver,
  YouTubeResolver,
  YTDLResolver,
];
