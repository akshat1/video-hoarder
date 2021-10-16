import "reflect-metadata";
import { YTMetadata } from "./YouTube";
import { Field, ID, ObjectType } from "type-graphql";
import { AfterInsert,AfterLoad, BaseEntity, BeforeInsert, Column,Entity, PrimaryColumn } from "typeorm";

export enum JobStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Failed = "failed",
  Completed = "completed",
  Canceled = "canceled",
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

  @Column()
  metadataString: string;

  @Field(() => YTMetadata)
  metadata?: YTMetadata;

  @BeforeInsert()
  private beforeInsert() {
    this.id = this.url;
  }

  @AfterLoad()
  private afterFind() {
    this.metadata = JSON.parse(this.metadataString);
  }

  @AfterInsert()
  private afterInsert() {
    this.metadata = JSON.parse(this.metadataString);
  }
}
