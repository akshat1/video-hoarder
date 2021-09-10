import { Job } from "../../../model/Job";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class JobResolver {
  @Query(() => [Job])
  jobs():Job[] {
    return [];
  }
}
