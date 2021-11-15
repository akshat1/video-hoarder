import { DownloadOptionsInput, Job, JobStatus } from "../../../model/Job";
import { Topic } from "../../../model/Topic";
import { canDelete } from "../../perms";
import { fetchMetadata } from "../../youtube";
import { Context } from "@apollo/client";
import md5 from "md5";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, Root, Subscription } from "type-graphql";

@InputType()
export class AddJobInput {
  @Field()
  url: string;

  @Field()
  downloadOptions: DownloadOptionsInput;
}

@Resolver()
export class JobResolver {
  @Query(() => [Job])
  async jobs(): Promise<Job[]> {
    const jobs = await Job.find({
      order: {
        updatedAt: "DESC",
      },
    });

    return jobs;
  }

  @Subscription({
    topics: Topic.JobAdded,
  })
  jobAdded(@Root() job: Job): Job {
    return job;
  }

  @Subscription({
    topics: Topic.JobRemoved,
  })
  jobRemoved(@Root() jobId: string): string {
    return jobId;
  }

  @Subscription({
    topics: Topic.JobUpdated,
  })
  jobUpdated(@Root() job: Job): Job {
    return job;
  }

  // TODO: Pubsub updates should happen from the event handlers in the Job model, not from mutations.
  @Mutation(() => Job)
  async addJob (@Arg("data") data: AddJobInput, @Ctx() context: Context): Promise<Job> {
    const {
      url,
      downloadOptions,
    } = data;

    const user = await context.getUser();
    if (!user) {
      throw new Error("No user in the context.");
    }

    const { userName } = user; 
    const timeStamp = new Date();
    const newJob = Job.create({
      id: md5(url),
      createdAt: timeStamp,
      updatedAt: timeStamp,
      createdBy: userName,
      updatedBy: userName,
      status: JobStatus.Pending,
      url,
      metadata: await fetchMetadata(url),
      downloadOptions,
    });
    await newJob.save();
    // await pubSub.publish(Topic.JobAdded, newJob);
    return newJob;
  }

  @Mutation(() => Number)
  async removeJob(@Arg("jobId") jobId: string, @Ctx() context: Context): Promise<Number> {
    const currentUser = await context.getUser();
    if (currentUser) {
      const job = await Job.findOne(jobId);
      if (canDelete(currentUser, job)) {
        await Job.remove([job]);
        // @TODO: If currently in progress, kill the download process for this video.
        // pubSub.publish(Topic.JobRemoved, jobId);
        return 0;
      }
    }

    return -1;
  }
}
