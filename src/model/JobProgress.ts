import { Field, ObjectType } from "type-graphql";

/**
 * This is supplied by the ytdl-wrap library to the onProgress event handler.
 */
 @ObjectType()
 export class JobProgress {
   @Field(() => Number, { nullable: true })
   percent: number;

   @Field(() => String, { nullable: true })
   totalSize: string;

   @Field(() => String, { nullable: true })
   currentSpeed: string;

   @Field(() => String, { nullable: true })
   eta: string;
 }
 