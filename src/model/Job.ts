import "reflect-metadata";
import { JobProgress } from "./JobProgress";
import { getJSONTransformer } from "./JSONTransformer";
import { VHEntity } from "./VHEntity";
import { YTMetadata } from "./YouTube";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

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

  @Field(() => String)
  presetId: string;
}

@Entity()
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

  @Field(() => String)
  presetId: string;
}

@Entity()
@ObjectType()
export class Job extends VHEntity {
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
