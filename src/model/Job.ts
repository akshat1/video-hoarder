import "reflect-metadata";
import { Field,ObjectType } from "type-graphql";
import { Column,Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Job {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  createdAt: string;

  @Field(() => String)
  @Column()
  createdBy: string;

  @Field(() => String)
  @Column()
  updatedAt: string;

  @Field(() => String)
  @Column()
  updatedBy: string;

  @Field(() => String)
  @Column()
  errorMessage: string;

  @Field(() => String)
  @Column()
  status: string;

  @Field(() => String)
  @Column()
  url: string;
}
