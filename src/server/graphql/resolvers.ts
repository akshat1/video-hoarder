import { JobResolver } from "./JobResolver";
import { UserResolver } from "./UserResolver";
import { NonEmptyArray } from "type-graphql";

export const resolvers:NonEmptyArray<Function> = [
  JobResolver,
  UserResolver,
];
