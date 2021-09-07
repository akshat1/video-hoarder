import "reflect-metadata";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  passwordHash: string;

  @Column()
  passwordSalt: string;

  @Field(() => String)
  @Column()
  passwordExpired: boolean;

  @Field(() => String)
  @Column()
  role: string

  @Field(() => String)
  @Column()
  userName: string;

  @Field(() => String)
  @Column()
  createdBy: string;

  @Field(() => String)
  @Column()
  updatedBy: string;

  @Field(() => String)
  @Column()
  createdAt: string;

  @Field(() => String)
  @Column()
  updatedAt: string;
}
