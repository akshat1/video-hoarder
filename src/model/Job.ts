import "reflect-metadata";
import { addJobToQueue, removeJobFromQueue } from "../server/YTQueue";
import { getJSONTransformer } from "./JSONTransformer";
import { YTMetadata } from "./YouTube";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { AfterInsert, AfterRemove, AfterUpdate, BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

export enum JobStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Failed = "failed",
  Completed = "completed",
  Canceled = "canceled",
}

// Can't have the same class as both object and input types. I'm probbaly missing something.
@InputType()
export class DownloadOptionsInput {
  @Field()
  formatSelector?: string;
}

@ObjectType()
export class DownloadOptions {
  @Field()
  formatSelector?: string;
}

@Entity()
@ObjectType()
export class Job extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field(() => Date)
  @Column()
  createdAt: Date;

  @Field(() => String)
  @Column()
  createdBy: string;

  @Field(() => Date)
  @Column()
  updatedAt: Date;

  @Field(() => String)
  @Column()
  updatedBy: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  errorMessage?: string;

  @Field(() => String)
  @Column()
  status: JobStatus;

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => YTMetadata)
  @Column({
    transformer: getJSONTransformer<YTMetadata>(),
    type: String,
  })
  metadata: YTMetadata;

  @Field(() => DownloadOptions)
  @Column({
    transformer: getJSONTransformer<DownloadOptions>(),
    type: String,
  })
  downloadOptions: DownloadOptions;

  @AfterInsert()
  handleNewJob(): void {
    console.log("Adding job to queue", this);
    // TODO: Signal pubsub about new job.
    addJobToQueue(this);
  }

  @AfterUpdate()
  signalUpdate(): void {
    console.log("Job updated", this);
    // TODO: Signal pubsub about job update.
  }

  @AfterRemove()
  handleJobRemoval(): void {
    console.log("Job removed", this);
    // TODO: Signal pubsub about job being removed.
    removeJobFromQueue(this);
  }
}
