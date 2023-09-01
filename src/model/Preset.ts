import { VHEntity } from "./VHEntity";
import { Field, InputType, ObjectType } from "type-graphql";
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
  isPrivate: boolean;

  @Field(() => Boolean)
  @Column()
  saveMetadata: boolean;
}

@InputType()
export class PresetInput {
  @Field()
  name: string;
  @Field()
  downloadLocation: string;
  @Field()
  formatSelector: string;
  @Field()
  rateLimit: string;
  @Field()
  isPrivate: boolean;
  @Field()
  saveMetadata: boolean;
  /*
  // This is aspirational at this point. NFO desn't support videp "clips" yet; See https://kodi.wiki/view/NFO_files
  @Field()
  generateNFO: boolean;
  */
}
