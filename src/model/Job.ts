import "reflect-metadata";
import { JobProgress } from "./JobProgress";
import { getJSONTransformer } from "./JSONTransformer";
import { YTMetadata } from "./YouTube";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum JobStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Failed = "failed",
  Completed = "completed",
  Canceled = "canceled",
}

export const RateUnlimited = "Unlimited";

// Can't have the same class as both object and input types. I'm probbaly missing something.
@InputType()
export class DownloadOptionsInput {
  @Field()
  formatSelector?: string;

  @Field(() => String, { nullable: true })
  rateLimit?: string;

  // At the moment it's not user editable through the UI (but CAN be controlled by the user through config/location.yml).
  @Field(() => String)
  downloadLocation: string;
}

@ObjectType()
export class DownloadOptions {
  @Field()
  formatSelector?: string;

  /**
   * Rate limit in bytes per second (e.g. 50K or 4.2M).
   * @see https://github.com/ytdl-org/youtube-dl#download-options
   */
  @Field(() => String, { nullable: true })
  rateLimit?: string;

  @Field(() => String)
  downloadLocation: string;
}

@Entity()
@ObjectType()
export class Job extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
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

  // Progress. This is not stored in the DB, but do exist in memory for graphql.
  @Field(() => JobProgress, { nullable: true })
  progress?: JobProgress;
}
