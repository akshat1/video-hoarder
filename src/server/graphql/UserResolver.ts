import { Role } from "../../model/Role";
import { User } from "../../model/User";
import { createUser } from "../db/userManagement";
import { Arg, Ctx, Field, InputType, Mutation,Query, Resolver } from "type-graphql";

type Context = Record<string, any>;

@InputType()
export class CreateUserInput {
  @Field()
  userName: string;

  @Field()
  password: string;

  @Field()
  role: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User)
  async user(@Arg("id") id: string): Promise<User|undefined> {
    return User.findOne({
      where: { id },
    });
  }

  @Query(() => User)
  currentUser (@Ctx() context: Context): User {
    return context.getUser();
  }

  @Mutation(() => Boolean)
  logout (@Ctx() context: Context): boolean {
    return context.logout();
  }

  @Mutation(() => User)
  async login (@Arg("userName") userName: string, @Arg("password") password: string, @Ctx() context: Context): Promise<User> {
    const { user } = await context.authenticate("graphql-local", { userName, password });
    await context.login(user);
    return user;
  }

  @Mutation(() => User)
  async createUser (@Arg("data") data: CreateUserInput, @Ctx() context: Context): Promise<User> {
    const currentUser = context.getUser();
    const {
      password,
      role,
      userName,
    } = data;

    if (currentUser.role !== Role.Admin) {
      throw new Error("Insufficient privilege to create new user.");
    }

    const existingUser = await User.findOne({ where: { userName } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = await createUser({
      password,
      passwordExpired: false,
      role,
      userName,
    }, currentUser.id);
    return newUser;
  }
}
