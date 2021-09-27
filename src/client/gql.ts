import { gql } from "@apollo/client";

const CurrentUser = gql`
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

const YTMetadata = gql`
  query MetadataQuery($url: String!) {
    ytMetadata(url: $url) {
      title
      id
      thumbnails {
        height
        url
        width
      }
      description
      formats {
        acodec
        format
        formatId
        vcodec
      }
    }
  }
`;

const Login = gql`
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

const Logout = gql`
  mutation logout { logout }
`;

export const Query = {
  CurrentUser,
  YTMetadata,
};

export const Mutation = {
  Login,
  Logout,
};
