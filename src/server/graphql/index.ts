import { resolvers } from "./resolvers";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

let server:ApolloServer;
export const getApolloServer = async (): Promise<ApolloServer> => {
  if (!server) {
    const schema = await buildSchema({ resolvers });
    server = new ApolloServer({ schema });
  }

  return server;
}
