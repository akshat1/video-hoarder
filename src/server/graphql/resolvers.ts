import { Job } from "../../model/Job";
import { NonEmptyArray, Query, Resolver } from "type-graphql";

@Resolver()
export class JobResolver {
  @Query(() => [Job])
  jobs():Job[] {
    return [];
  }
}

export const resolvers:NonEmptyArray<Function> = [JobResolver];
