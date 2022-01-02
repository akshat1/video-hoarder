import { gql } from "@apollo/client";

export const Login = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      user {
        id,
        userName,
        role,
        passwordExpired,
      }
    }
  }
`;

export const CurrentUser = gql`
  query CurrentUserQuery {
    currentUser {
      user {
        id,
        passwordExpired,
        role,
        userName,
      }
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
