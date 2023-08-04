import { VHEntity } from "./VHEntity";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity()
export class Preset extends VHEntity {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  downloadLocation: string;

  @Field(() => String)
  @Column()
  formatSelector: string;

  @Field(() => String)
  @Column()
  rateLimit: string;

  @Field(() => Boolean)
  @Column()
  isPrivate: string;
}
