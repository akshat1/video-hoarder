import _ from "lodash";
import { Entity } from "./Entity";

export enum Role {
  Admin = "admin",
  User = "user",
}

export interface User extends Entity {
  password: string,
  passwordExpired: boolean,
  role: Role,
  salt: string,
  userName: string,
}

export interface ClientUser {
  loggedIn: boolean,
  passwordExpired: boolean,
  role: Role,
  userName: string,
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
export const getClientUser = (user: User): ClientUser => ({
  ..._.pick(user, ClientUserFields),
  loggedIn: true,
});

export const isAdmin = (user: User) => user && user.role === Role.Admin;
