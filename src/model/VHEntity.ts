import { Field, ID } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VHEntity extends BaseEntity {
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
}
