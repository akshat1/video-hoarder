import { User } from "../../model/User";
import { encrypt } from "../crypto";

interface CreateUserInput {
  password: string;
  passwordExpired: boolean;
  role: string;
  userName: string;
}

export const createUser = async (input: CreateUserInput, createdBy: string): Promise<User> => {
  const {
    password,
    passwordExpired,
    role,
    userName,
  } = input;

  const timeStamp = new Date().toISOString();
  const { hash, salt } = await encrypt(password);
  const user = User.create({
    createdAt: timeStamp,
    createdBy,
    passwordExpired,
    passwordHash: hash,
    passwordSalt: salt,
    role,
    updatedAt: timeStamp,
    updatedBy: createdBy,
    userName,
  });

  await user.save();
  return user;
};

export const getUserByName = async (userName: string): Promise<User | undefined> =>
  User.findOne({where: { userName } });
