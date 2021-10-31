import { User } from "../../model/User";
import { resolvers } from "./resolvers";
import { ApolloServer } from "apollo-server-express";
import { RequestHandler } from "express";
import { execute, subscribe } from "graphql";
import { buildContext, createOnConnect } from "graphql-passport";
import { Server } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { buildSchema } from "type-graphql";

let calledOnce = false;
interface Servers {
  apolloServer: ApolloServer,
  subscriptionServer: SubscriptionServer,
}

interface Args {
  passportMiddleware: RequestHandler;
  passportSessionMiddleware: RequestHandler;
  server: Server;
  sessionMiddleware: RequestHandler;
}

export const getGraphQLServers = async (args: Args) : Promise<Servers> => {
  const {
    passportMiddleware,
    passportSessionMiddleware,
    server,
    sessionMiddleware,
  } = args;
  if (calledOnce) {
    throw new Error("Trying to create servers again.");
  }
  calledOnce = true;

  const schema = await buildSchema({ resolvers });
  // eslint-disable-next-line prefer-const
  let subscriptionServer;
  
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => buildContext({ req, res, User }),
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
          subscriptionServer.close();
          },
        };
      },
    }],
  });

  console.log(`apolloServer.graphqlPath: ${apolloServer.graphqlPath}`);
  subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: createOnConnect([
      sessionMiddleware,
      passportMiddleware,
      passportSessionMiddleware,
    ]),
  }, {
    server,
    path: apolloServer.graphqlPath,
  });

  return {
    apolloServer,
    subscriptionServer,
  };
};
