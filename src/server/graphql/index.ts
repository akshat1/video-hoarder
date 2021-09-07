import { resolvers } from "./resolvers";
import { typeDefs } from "./typedefs";
import { ApolloServer } from "apollo-server-express";

let server:ApolloServer;
export const getApolloServer = ():ApolloServer => {
  if (!server) {
    server = new ApolloServer({
      typeDefs,
      resolvers,
    })
  }

  return server;
}
