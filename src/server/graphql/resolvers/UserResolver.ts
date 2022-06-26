import { Role } from "../../../model/Role";
import { User } from "../../../model/User";
import { encrypt } from "../../crypto";
import { createUser } from "../../db/userManagement";
import { EINCORRECTPASSWORD, ENEWPASSWORDMISMATCH, ENOUSER } from "../../errors";
import { Arg, Ctx, Field, InputType, Mutation,Query, Resolver } from "type-graphql";

type Context = Record<string, any>;

interface AuthenticateResult {
  user: User;
}

@InputType()
export class CreateUserInput {
  @Field()
  userName: string;

  @Field()
  password: string;

  @Field()
  role: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword: String;

  @Field()
  newPassword: String;

  @Field()
  newPasswordDeux: String;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User)
  async user(@Arg("id") id: string): Promise<User> {
    return await User.findOne({ where: { id } });
  }

  @Query(() => User, { nullable: true })
  currentUser (@Ctx() context: Context): User|null {
    return context.getUser() || null;
  }

  @Mutation(() => Boolean)
  logout (@Ctx() context: Context): boolean {
    return context.logout() || false;
  }

  @Mutation(() => User)
  async login (@Arg("userName") userName: string, @Arg("password") password: string, @Ctx() context: Context): Promise<User> {
    const { user } = await context.authenticate(
      "graphql-local",
      {
        // Funny story. This needs to pass "username" (and not userName) to work.
        // Had to step through code to figure this one out.
        username: userName,
        password,
      }
    ) as AuthenticateResult;
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

    if (currentUser.role !== Role.Admin) 
      throw new Error("Insufficient privilege to create new user.");
    

    const existingUser = await User.findOne({ where: { userName } });
    if (existingUser) 
      throw new Error("User already exists");
    

    const newUser = await createUser({
      password,
      passwordExpired: false,
      role,
      userName,
    }, currentUser.id);
    return newUser;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("userId") userId: string, @Ctx() context: Context): Promise<Boolean> {
    const currentUser = context.getUser();
    if (currentUser.role !== Role.Admin) 
      throw new Error("Insufficient privilege to create new user.");
    

    if (currentUser.id === userId) 
      throw new Error("Can't delete oneself.");
    

    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      await user.remove();
      return true;
    }

    return false;
  }

  @Mutation(() => Boolean)
  async changePassword(@Arg("data") data: ChangePasswordInput, @Ctx() context: Context): Promise<Boolean> {
    const {
      currentPassword,
      newPassword,
      newPasswordDeux,
    } = data;

    if (newPassword !== newPasswordDeux) 
      throw new Error(ENEWPASSWORDMISMATCH);
    

    const currentUser = await context.getUser();
    if (!currentUser) 
      throw new Error(ENOUSER);
    

    const { user: authenticatedUser } = await context.authenticate(
      "graphql-local",
      {
        // Funny story. This needs to pass "username" (and not userName) to work.
        // Had to step through code to figure this one out.
        username: currentUser.userName,
        password: currentPassword,
      }
    ) as AuthenticateResult;

    if (!authenticatedUser) 
      throw new Error(EINCORRECTPASSWORD);
    

    // At this point we know that
    // 1. current password is correct.
    // 2. both new passwords must match.
    const { hash, salt } = await encrypt(newPassword.toString());
    currentUser.updatedAt = new Date().toISOString();
    currentUser.updatedBy = currentUser.userName;
    currentUser.passwordHash = hash;
    currentUser.passwordSalt = salt;
    await currentUser.save();
    context.logout();
    return true;
  }
}
