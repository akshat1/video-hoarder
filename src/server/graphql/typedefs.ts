import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Job {
    id: String
    createdAt: String
    createdBy: String
    updatedAt: String
    updatedBy: String
    errorMessage: String
    status: String
    url: String
  }

  type Query {
    jobs: [Job]
  }
`;

/*


  type Mutation {
    addJob(type: String, name: String): NamedItem
    unfollow(type: String, name: String): Int
  }
*/
