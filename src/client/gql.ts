import { gql } from "@apollo/client";

const YTMetadata = gql`
  query MetadataQuery($url: String!) {
    ytMetadata(url: $url) {
      title
      id
      uploadDate,
      channel
      channelUrl
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
        quality
        vcodec
      }
    }
  }
`;

const Jobs = gql`
  query Jobs {
    jobs {
      createdAt
      errorMessage
      id
      status
      metadata {
        title
        thumbnails {
          height
          width
          url
        }
      }
      url
      downloadOptions {
        formatSelector
      }
      progress {
        percent
        totalSize
        currentSpeed
        eta
      }
    }
  }
`;

const JobAdded = gql`
  subscription OnJobAdded {
    jobAdded {
      createdAt
      errorMessage
      id
      status
      metadata {
        title
        thumbnails {
          height
          width
          url
        }
      }
      url
    }
  }
`;

const AddJob = gql`
  mutation AddJob($data: AddJobInput!) {
    addJob(data: $data) {
      id
      createdBy
      status
      metadata {
        title
      }
    }
  }
`;

const RemoveJob = gql`
  mutation RemoveJob($jobId: String!) {
    removeJob(jobId: $jobId)
  }
`;

const JobRemoved = gql`
  subscription OnJobRemoved {
    jobRemoved
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

const Logout = gql`
  mutation logout { logout }
`;

export const Query = {
  CurrentUser,
  Jobs,
  YTMetadata,
};

export const Mutation = {
  AddJob,
  Login,
  Logout,
  RemoveJob,
};

export const Subscription = {
  JobAdded,
  JobRemoved,
};
