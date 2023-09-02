import { Job } from "../../model/Job";
import { gql } from "@apollo/client";

export const YTMetadata = gql`
  query MetadataQuery($url: String!) {
    metadata(url: $url) {
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
    }
  }
`;

export const Jobs = gql`
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
        rateLimit
        downloadLocation
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

export const JobAdded = gql`
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

export const AddJob = gql`
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

export const CancelJob = gql`
  mutation CancelJob($jobId: String!) {
    cancelJob(jobId: $jobId)
  }
`;

export const RemoveJob = gql`
  mutation RemoveJob($jobId: String!) {
    removeJob(jobId: $jobId)
  }
`;

export const RemoveAllDoneJobs = gql`
  mutation removeAllDoneJobs {
    removeAllDoneJobs
  }
`;

export const JobRemoved = gql`
  subscription OnJobRemoved {
    jobRemoved
  }
`;

export const JobUpdated = gql`
  subscription OnJobUpdated {
    jobUpdated {
      id,
      status,
      errorMessage,
      progress {
        percent,
        totalSize,
        currentSpeed,
        eta,
      }
    }
  }
`;

export interface JobsQueryResponse {
  jobs: Job[];
}
