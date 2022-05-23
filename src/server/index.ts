import { Session } from "../model/Session";
import { User } from "../model/User";
import { getDataSource, initialize as initializeDB } from "./db/typeorm";
import { resolvers } from "./graphql/resolvers";
import { getLogger } from "./logger";
import { deserializeUser, serializeUser, verifyUser } from "./passport";
import { getPubSub } from "./pubsub";
import { pickUpPendingJobs } from "./YTQueue";
import { ApolloServer } from "apollo-server-express";
import { TypeormStore } from "connect-typeorm/out";
import cors from "cors";
import express, { Application, Request, RequestHandler, Response } from "express";
import session from "express-session";
import { execute, subscribe } from "graphql";
import { GraphQLLocalStrategy } from "graphql-passport";
import { buildContext, createOnConnect } from "graphql-passport";
import { createServer, Server } from "http";
import passport from "passport";
import path from "path";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { buildSchema } from "type-graphql";
import { v4 as uuid } from "uuid";

const rootLogger = getLogger("Server");
const SessionSecret = "Not so secretely bad secret";
const Port = 8080;
const enableStudio = !!process.env.ENABLE_STUDIO; // enabled through docker-compose for dev environments
const CORSOrigin = process.env.CORSOrigin || `http://localhost:${Port}`;

/** Exit handler. */
const onExit = () => {
  // TODO Clean-up
  getLogger("onExit", rootLogger).info("Server process exit.");
};

const getSessionMiddleware = async (): Promise<RequestHandler> => {
  const sessionRepository = (await getDataSource()).getRepository(Session);
  const sessionMiddleware: RequestHandler = session({
    genid: () => uuid(),
    secret: SessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new TypeormStore({
      cleanupLimit: 2,
      ttl: 86400,
    }).connect(sessionRepository),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
    }, // 1 week
  });

  return sessionMiddleware;
};

interface GetPassportMiddlewaresReturn {
  passportMiddleware: RequestHandler;
  passportSessionMiddleware: RequestHandler;
}
const getPassportMiddlewares = async (): Promise<GetPassportMiddlewaresReturn> => {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(new GraphQLLocalStrategy(verifyUser));
  const passportMiddleware = passport.initialize();
  const passportSessionMiddleware = passport.session();

  return {
    passportMiddleware,
    passportSessionMiddleware,
  };
};

interface InitApolloServerArgs {
  app: Application;
  passportMiddleware: RequestHandler;
  passportSessionMiddleware: RequestHandler;
  server: Server;
  sessionMiddleware: RequestHandler;
}
const initApolloServer = async (args: InitApolloServerArgs): Promise<ApolloServer> => {
  const logger = getLogger("initApolloServer", rootLogger);
  const {
    app,
    passportMiddleware,
    passportSessionMiddleware,
    server,
    sessionMiddleware,
  } = args;
  // Set-up apollo server
  const schema = await buildSchema({
    resolvers,
    pubSub: getPubSub(),
  });
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
    formatError: (err) => {
      logger.error("Apollo Error", err);
      return err;
    },
  });

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
  
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: enableStudio,
  });

  return apolloServer;
};

const requestLogger = getLogger("app");

interface InitExpressReturn {
  app: Application;
  passportMiddleware: RequestHandler;
  passportSessionMiddleware: RequestHandler;
  server: Server;
  sessionMiddleware: RequestHandler;
}
const initExpress = async (): Promise<InitExpressReturn> => {
  const logger = getLogger("initExpress", rootLogger);
  const app = express();
  const server = createServer(app);

  app.use((request, response, next) => {
    requestLogger.debug(`${request.method} ${request.url}`);
    next();
  });

  // We need our own CORS config when we are serving the FE. But we want Apollo to handle CORS when we are talking to the studio.
  logger.info(`enableStudio: ${enableStudio}`);
  if (!enableStudio) {
    app.use(cors({
      origin: CORSOrigin,
      credentials: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }));
  }

  const sessionMiddleware = await getSessionMiddleware();
  app.use(sessionMiddleware);
  
  const {
    passportMiddleware,
    passportSessionMiddleware,
  } = await getPassportMiddlewares();
  app.use(passportMiddleware);
  app.use(passportSessionMiddleware);

  // Web
  const webUIPath = path.resolve(process.cwd(), "public");
  const spaFallbackPath = path.join(webUIPath, "index.html");
  logger.info(`CWD: ${process.cwd()}`);
  logger.info(`Going to serve static files from ${webUIPath}`);
  logger.info(`SPA fallback path: ${spaFallbackPath}`);
  app.use(express.static(webUIPath));
  // Web: SPA Fallback
  app.use((request:Request, response: Response, next) => {
    if (request.method === "GET" && request.path !== "/graphql") {
      response.sendFile(spaFallbackPath);
    } else {
      // response.status(404).send({ message: "NOT FOUND" });
      next();
    }
  });

  return {
    app,
    server,
    passportMiddleware,
    passportSessionMiddleware,
    sessionMiddleware,
  };
};

const main = async () => {
  const logger = getLogger("main", rootLogger);
  logger.info("Starting server process.");
  process.on("SIGTERM", onExit);

  // DB
  logger.info("create connection");
  await initializeDB();

  // Create the express server
  const {
    app,
    passportMiddleware,
    passportSessionMiddleware,
    server,
    sessionMiddleware,
  } = await initExpress();

  const apolloServer = await initApolloServer({
    app,
    passportMiddleware,
    passportSessionMiddleware,
    server,
    sessionMiddleware,
  });

  // Start the server
  server.listen(Port, () => logger.info("Listening now."));
  logger.info(`🚀 Server ready at http://localhost:${Port}${apolloServer.graphqlPath}`);

  // Add any pending jobs to the queue.
  await pickUpPendingJobs();
};

main();
