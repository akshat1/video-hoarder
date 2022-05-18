import { Role } from "../model/Role";
import { Session } from "../model/Session";
import { User } from "../model/User";
import { getDataSource, initialize } from "./db/typeorm";
import { createUser, getUserByName } from "./db/userManagement";
import { resolvers } from "./graphql/resolvers";
import { getLogger } from "./logger";
import { deserializeUser, serializeUser, verifyUser } from "./passport";
import { getPubSub } from "./pubsub";
import { pickUpPendingJobs } from "./YTQueue";
import { ApolloServer } from "apollo-server-express";
import { TypeormStore } from "connect-typeorm/out";
import cors from "cors";
import express, { Request, RequestHandler, Response } from "express";
import session from "express-session";
import { execute, subscribe } from "graphql";
import { GraphQLLocalStrategy } from "graphql-passport";
import { buildContext, createOnConnect } from "graphql-passport";
import { createServer } from "http";
import passport from "passport";
import path from "path";
import { env } from "process";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { buildSchema } from "type-graphql";
import { v4 as uuid } from "uuid";

const rootLogger = getLogger("Server");
const SessionSecret = "Not so secretely bad secret";
const Config = {
  webUIPath: "./public/",
  port: process.env.SERVER_PORT || 8081,
};
rootLogger.info("Config:", JSON.stringify(Config, null, 2));

/** Exit handler. */
const onExit = () => {
  // TODO Clean-up
  getLogger("onExit", rootLogger).info("Server process exit.");
};

const main = async () => {
  const logger = getLogger("main", rootLogger)
  logger.info("Starting server process.");
  process.on("SIGTERM", onExit);

  // DB
  logger.info("create connection");
  await initialize();
  
  logger.debug("do we have an admin?");
  const adminUser = await getUserByName("admin");
  if (!adminUser) {
    logger.info("create an admin");
    await createUser({
      passwordExpired: false,
      password: "admin",
      userName: "admin",
      role: Role.Admin,
    }, "System");
  }

  // Create the express server
  const app = express();
  const server = createServer(app);

  // We need our own CORS config when we are serving the FE. But we want Apollo to handle CORS when we are talking to the studio.
  const enableStudio = !!env.ENABLE_STUDIO;
  logger.info(`enableStudio: ${enableStudio}`);
  if (!enableStudio) {
    app.use(cors({
      origin: "http://localhost:8080",
      credentials: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }));
  }

  // Session management
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

  // Passport
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(new GraphQLLocalStrategy(verifyUser));
  const passportMiddleware = passport.initialize();
  const passportSessionMiddleware = passport.session();
  app.use(sessionMiddleware);
  app.use(passportMiddleware);
  app.use(passportSessionMiddleware);

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

  // Web
  const webUIPath = path.resolve(process.cwd(), Config.webUIPath);
  const spaFallbackPath = path.join(webUIPath, "index.html");
  logger.info(`CWD: ${process.cwd()}`);
  logger.info(`Going to serve static files from ${webUIPath}`);
  logger.info(`SPA fallback path: ${spaFallbackPath}`);
  app.use(express.static(webUIPath));
  // Web: SPA Fallback
  app.use((request:Request, response: Response) => {
    if (request.method === "GET") {
      response.sendFile(spaFallbackPath);
    } else {
      response.status(404).send({ message: "NOT FOUND" });
    }
  });

  // Start the server
  server.listen(Config.port, () => logger.info("Listening now."));
  logger.info(`🚀 Server ready at http://localhost:${Config.port}${apolloServer.graphqlPath}`);

  // Add any pending jobs to the queue.
  await pickUpPendingJobs();
};

main();
