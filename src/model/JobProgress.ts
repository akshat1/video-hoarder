import { Field, ObjectType } from "type-graphql";

/**
 * This is supplied by the ytdl-wrap library to the onProgress event handler.
 */
 @ObjectType()
 export class JobProgress {
   @Field(() => Number)
   percent: number;

   @Field(() => String)
   totalSize: string;

   @Field(() => String)
   currentSpeed: string;

   @Field(() => String)
   eta: string;
 }
 