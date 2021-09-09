import { gql } from "@apollo/client";

export const CurrentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      user {
        id,
        userName,
        role,
        passwordExpired,
      }
    }
  }
`;

export const LoginMutation = gql`
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

export const LogoutMutation = gql`
  mutation logout { logout }
`;
