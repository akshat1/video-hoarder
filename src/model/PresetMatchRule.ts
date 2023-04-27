import { VHEntity } from "./VHEntity";
import { Field } from "type-graphql";
import { Column, Entity } from "typeorm";

@Entity()
export class PresetMatchRule extends VHEntity {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  ruleJS: string;

  @Field(() => String)
  @Column()
  presetID: string;
}
