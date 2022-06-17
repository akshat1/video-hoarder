import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class YTDLInformation {
  @Field(() => String)
  executable: string;

  @Field(() => String)
  version: string;
}
