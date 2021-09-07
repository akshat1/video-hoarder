import { User } from "../../model/User";
import { Arg, Query, Resolver } from "type-graphql";

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
}
