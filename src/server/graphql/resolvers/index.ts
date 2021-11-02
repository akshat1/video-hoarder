import { JobResolver } from "./JobResolver";
import { UserResolver } from "./UserResolver";
import { YouTubeResolver } from "./YouTubeResolver";
import { NonEmptyArray } from "type-graphql";

export const resolvers:NonEmptyArray<Function> = [
  JobResolver,
  UserResolver,
  YouTubeResolver,
];
