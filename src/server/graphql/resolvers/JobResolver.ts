import { Job, JobStatus } from "../../../model/Job";
import { Context } from "@apollo/client";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

@InputType()
export class AddJobInput {
  @Field()
  url: string;

  @Field()
  metadataString: string;
}

@Resolver()
export class JobResolver {
  @Query(() => [Job])
  async jobs(): Promise<Job[]> {
    const jobs = await Job.find();
    return jobs;
  }

  @Mutation(() => Job)
  async addJob (@Arg("data") data: AddJobInput, @Ctx() context: Context ): Promise<Job> {
    const {
      url,
      metadataString,
    } = data;
    const user = await context.getUser();
    if (!user) {
      throw new Error("No user in the context.");
    }
    const { userName } = user; 
    const timeStamp = new Date().toISOString();
    const newJob = Job.create({
      createdAt: timeStamp,
      updatedAt: timeStamp,
      createdBy: userName,
      updatedBy: userName,
      status: JobStatus.Pending,
      url,
      metadataString,
    });
    await newJob.save();
    // newJob.metadata = JSON.parse(metadataString);
    return newJob;
  }
}
