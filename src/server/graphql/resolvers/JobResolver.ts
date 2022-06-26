import { DownloadOptionsInput, Job, JobStatus } from "../../../model/Job";
import { Topic } from "../../../model/Topic";
import { getLogger } from "../../../shared/logger";
import { canDelete } from "../../../shared/perms";
import { EINSUFFICIENTPERMS, ENOUSER } from "../../errors";
import { getPubSub } from "../../pubsub";
import { fetchMetadata } from "../../youtube";
import { Context } from "@apollo/client";
import md5 from "md5";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, Root, Subscription } from "type-graphql";

const rootLogger = getLogger("JobResolver");

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
    if (!user) 
      throw new Error(ENOUSER);
    

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
    const videoId = new URL(newJob.url).searchParams.get("v");
    const logger = getLogger(`jobUpdated ${videoId}`, rootLogger);
    logger.debug("newJob", newJob);
    await newJob.save();
    await getPubSub().publish(Topic.JobAdded, newJob);
    return newJob;
  }

  @Mutation(() => Number)
  async cancelJob(@Arg("jobId") jobId: string, @Ctx() context: Context): Promise<Number> {
    const logger = getLogger("cancelJob", rootLogger);
    logger.debug("Cancel job");
    const currentUser = await context.getUser();
    if (currentUser) {
      const job = await Job.findOne({
        where: {
          id: jobId,
        },
      });

      if (canDelete(currentUser, job)) {
        logger.debug("Set status to canceled");
        job.status = JobStatus.Canceled;
        await job.save();
        getPubSub().publish(Topic.JobCancelled, job);
        return 0;
      }
    }

    return -1;
  }

  /**
   * @param jobId id of the job to be deleted
   * @param context
   * @returns number of items deleted (should always be 0 or 1)
   */
  @Mutation(() => Number)
  async removeJob(@Arg("jobId") jobId: string, @Ctx() context: Context): Promise<Number> {
    const currentUser = await context.getUser();
    if (currentUser) {
      const job = await Job.findOne({
        where: {
          id: jobId,
        },
      });

      if (job) {
        if (canDelete(currentUser, job)) {
          await job.remove();
          await getPubSub().publish(Topic.JobRemoved, job);
          return 1;
        }

        throw new Error(EINSUFFICIENTPERMS);
      }

      return 0;
    }

    throw new Error(ENOUSER);
  }
}
