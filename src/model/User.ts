import { Entity } from "./Entity";
import _ from "lodash";

export enum Role {
  Admin = "admin",
  User = "user",
}

export interface User {
  loggedIn: boolean,
  passwordExpired: boolean,
  role: Role,
  userName: string,
}

export interface ServerUser extends Entity, User {
  password: string,
  salt: string,
}

// This is used to create an instance of ClientUser from User.
const ClientUserFields = [
  "userName",
  "passwordExpired",
  "role",
];

/**
 * Takes a user as returned from the database and sets the loggedIn flag while removing the password and salt fields.
 */
// @ts-ignore
export const getClientUser = (user: ServerUser): User => ({
  ..._.pick(user, ClientUserFields),
  loggedIn: true,
});

export const DummyUser: User = {
  loggedIn: false,
  passwordExpired: false,
  role: Role.User,
  userName: "PLACEHOLDER",
};

export const isAdmin = (user: User): boolean => user && user.role === Role.Admin;
export const isDummyUser = (user: User): boolean => user === DummyUser;
