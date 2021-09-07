import "reflect-metadata";
import { Field,ObjectType } from "type-graphql";

@ObjectType()
export class Job {
  @Field(() => String)
  id: string;
  @Field(() => String)
  createdAt: string;
  @Field(() => String)
  createdBy: string;
  @Field(() => String)
  updatedAt: string;
  @Field(() => String)
  updatedBy: string;
  @Field(() => String)
  errorMessage: string;
  @Field(() => String)
  status: string;
  @Field(() => String)
  url: string;
}
