import { User } from "../../model/User";
import { gql } from "@apollo/client";

export const Login = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      id,
      userName,
      role,
      passwordExpired,
    }
  }
`;

export const CurrentUser = gql`
  query CurrentUserQuery {
    currentUser {
      id,
      passwordExpired,
      role,
      userName,
    }
  }
`;

export const Users = gql`
  query Users {
    users {
      id,
      role,
      userName,
    }
  }
`;

export const Logout = gql`
  mutation logout { logout }
`;

export const ChangePassword = gql`
  mutation ChangePassword($data: ChangePasswordInput!) {
    changePassword(data: $data)
  }
`;

export const CreateUser = gql`
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export interface CurrentUserResponse {
  currentUser: User;
}

export interface UsersResponse {
  users: User[];
}
